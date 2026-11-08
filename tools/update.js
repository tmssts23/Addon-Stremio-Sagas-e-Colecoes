// Procura títulos novos no Wikidata (fontes em data/wikidata-sources.js) e junta-os a data/auto.json.
// Não precisa de chave. Nunca mexe em data/sagas.js nem apaga o que já entrou; só acrescenta títulos que:
//   - são filmes ou séries (não documentários, curtas nem filmes de fãs) e têm ID IMDb no Wikidata;
//   - estrearam desde SINCE (o que é mais antigo fica a cargo da lista escrita à mão);
//   - já existem no Cinemeta e já estrearam mesmo: filme com nota IMDb, série com episódios emitidos
//     (o Wikidata às vezes tem datas de filmes adiados ou cancelados);
//   - não estão na saga escrita à mão nem em `exclude`.
// Cada título novo guarda também os universos do Wikidata (`wd`) que constam de data/universes.js.
// Os títulos anunciados com data de estreia futura vão para `upcoming` (vista "Próximas estreias"); essa
// lista é refeita em cada atualização, e quando um título estreia passa para as vistas normais.
// Uso: npm run update            (grava)
//      npm run update -- --dry   (só mostra o que entraria)
const fs = require('fs');
const path = require('path');

const MANUAL = require('../data');
const SOURCES = require('../data/wikidata-sources.js');
const { computePopularity } = require('./popularity');
const UNIVERSE_QS = new Set(require('../data/universes.js').flatMap((universe) => universe.wikidata || []));

const AUTO_FILE = path.join(__dirname, '..', 'data', 'auto.json');
const WDQS = 'https://query.wikidata.org/sparql';
const CINEMETA = 'https://v3-cinemeta.strem.io';
// O Wikidata pede um User-Agent que identifique quem faz os pedidos.
const USER_AGENT = 'SagasColecoesAddon/1.0 (addon Stremio/Nuvio; atualizacao diaria de catalogos)';
const SINCE = '2025-01-01';
// Próximas estreias: só as que têm data marcada até daqui a UPCOMING_YEARS anos.
const UPCOMING_YEARS = 4;
const UPCOMING_LIMIT = `${new Date().getUTCFullYear() + UPCOMING_YEARS}-12-31`;
// Estreias de há menos de RECENT_DAYS dias ainda sem nota/episódios no IMDb continuam a ser mostradas.
const RECENT_DAYS = 60;
const RECENT_LIMIT = new Date(Date.now() - RECENT_DAYS * 86400000).toISOString().slice(0, 10);
const DRY = process.argv.includes('--dry');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// O Wikidata limita pedidos seguidos (429): espera o tempo que ele pede (Retry-After) e tenta outra vez.
async function sparql(query) {
  for (let attempt = 0; attempt < 4; attempt++) {
    const res = await fetch(WDQS, {
      method: 'POST',
      headers: {
        'User-Agent': USER_AGENT,
        Accept: 'application/sparql-results+json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `format=json&query=${encodeURIComponent(query)}`,
    });
    if (res.status === 429 || res.status >= 500) {
      const retryAfter = Number(res.headers.get('retry-after')) || 15 * (attempt + 1);
      await sleep(Math.min(retryAfter, 120) * 1000);
      continue;
    }
    if (!res.ok) throw new Error(`Wikidata: ${res.status} ${(await res.text()).slice(0, 200)}`);
    return (await res.json()).results.bindings;
  }
  throw new Error('Wikidata: não respondeu depois de 4 tentativas');
}

// Filmes (Q11424) e séries de TV (Q5398426) ligados à saga, sem documentários (Q93204),
// curtas-metragens (Q24862) nem filmes de fãs (Q336144).
// Animação: é filme/série de animação (Q202866/Q581714) ou tem esse género.
// ?wd: universos e séries do título (P1434/P179), para o pôr no universo certo (data/universes.js).
function sagaQuery(links) {
  const values = links
    .map((link) => {
      const [prop, entity] = link.split(':');
      return `(wdt:${prop} wd:${entity})`;
    })
    .join(' ');
  return `SELECT ?imdb ?kind (MIN(?d) AS ?date) (MAX(?a) AS ?anim)
      (GROUP_CONCAT(DISTINCT STRAFTER(STR(?u), "entity/"); separator=" ") AS ?wd) WHERE {
    VALUES (?p ?s) { ${values} }
    ?item ?p ?s; wdt:P345 ?imdb.
    FILTER(STRSTARTS(?imdb, "tt"))
    { ?item wdt:P31/wdt:P279* wd:Q11424. BIND("movie" AS ?kind) }
    UNION
    { ?item wdt:P31/wdt:P279* wd:Q5398426. BIND("series" AS ?kind) }
    FILTER NOT EXISTS {
      ?item (wdt:P31|wdt:P136)/wdt:P279* ?excluded.
      VALUES ?excluded { wd:Q93204 wd:Q24862 wd:Q336144 }
    }
    OPTIONAL { ?item wdt:P577|wdt:P580 ?d }
    OPTIONAL { ?item wdt:P1434|wdt:P179 ?u }
    BIND(IF(EXISTS { ?item (wdt:P31|wdt:P136)/wdt:P279* ?animClass. VALUES ?animClass { wd:Q202866 wd:Q581714 } }, 1, 0) AS ?a)
  } GROUP BY ?imdb ?kind`;
}

async function cinemetaMeta(type, imdbId) {
  const res = await fetch(`${CINEMETA}/meta/${type}/${imdbId}.json`).catch(() => null);
  if (!res || !res.ok) return null;
  return (await res.json()).meta || null;
}

function hasPremiered(meta, type, now) {
  if (!meta.released || String(meta.released).slice(0, 10) > now) return false;
  if (type === 'movie') return Boolean(meta.imdbRating);
  return (meta.videos || []).some((video) => video.released && String(video.released).slice(0, 10) <= now);
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

async function main() {
  const auto = fs.existsSync(AUTO_FILE) ? JSON.parse(fs.readFileSync(AUTO_FILE, 'utf8')) : { updated: null, sagas: {} };
  auto.sagas = auto.sagas || {};
  // As sagas que já não têm fontes perdem as próximas estreias antigas.
  auto.upcoming = Object.fromEntries(Object.entries(auto.upcoming || {}).filter(([slug]) => SOURCES[slug]));

  const problems = [];
  const added = [];
  const soon = [];
  const universeUpdates = [];
  const now = today();

  for (const saga of MANUAL) {
    const sources = SOURCES[saga.slug];
    if (!sources) continue;
    const exclude = new Set(sources.exclude || []);
    const autoItems = (auto.sagas[saga.slug] || []).filter((item) => !exclude.has(item.id));
    const known = new Set([...saga.items.map((item) => item.id), ...autoItems.map((item) => item.id)]);

    let rows;
    try {
      await sleep(1500);
      rows = await sparql(sagaQuery(sources.links));
    } catch (err) {
      problems.push(`${saga.name}: ${err.message}`);
      continue;
    }

    const upcoming = [];
    for (const row of rows) {
      const imdbId = row.imdb.value;
      const type = row.kind.value;
      // Só guarda as entidades que correspondem a algum universo conhecido.
      const wd = (row.wd ? row.wd.value.split(' ') : []).filter((q) => UNIVERSE_QS.has(q));

      // Títulos que já entraram: atualiza os universos, caso o Wikidata os tenha ligado entretanto.
      const existing = autoItems.find((item) => item.id === imdbId);
      if (existing && wd.length && wd.join(' ') !== (existing.wd || []).join(' ')) {
        existing.wd = wd;
        universeUpdates.push(`${saga.name}: ${existing.name} -> ${wd.join(', ')}`);
      }
      if (known.has(imdbId) || exclude.has(imdbId)) continue;
      const wikidataDate = row.date ? row.date.value.slice(0, 10) : null;
      if (wikidataDate && wikidataDate < SINCE) continue;

      // Não estar no Cinemeta: volta a tentar na próxima atualização (a app não conseguiria abrir a ficha).
      const meta = await cinemetaMeta(type, imdbId);
      if (!meta || !meta.name) continue;
      const cinemetaDate = meta.released ? String(meta.released).slice(0, 10) : null;

      // Animação: manda o género do IMDb (é o que o npm run verify confirma); sem géneros, vale o Wikidata.
      // A flag decide o separador onde o título aparece (lib/sagas.js).
      const genres = meta.genres || meta.genre || [];
      const animated = genres.length ? genres.includes('Animation') : row.anim.value === '1';

      if (!hasPremiered(meta, type, now)) {
        // Próxima estreia: data marcada (Cinemeta ou Wikidata) no futuro, até UPCOMING_YEARS anos. Se a data
        // passou há pouco (RECENT_DAYS) mas ainda não há nota/episódios no IMDb, fica com essa data: a app já
        // o mostra como estreado (lib/franchises.js) e entra de vez quando o IMDb o confirmar.
        const future = [cinemetaDate, wikidataDate].filter((d) => d && d > now).sort()[0];
        const recent = cinemetaDate && cinemetaDate <= now && cinemetaDate >= RECENT_LIMIT ? cinemetaDate : null;
        const date = future || recent;
        if (!date || date > UPCOMING_LIMIT) continue;
        upcoming.push({ id: imdbId, type, name: meta.name, year: Number(date.slice(0, 4)), date, animated, ...(wd.length ? { wd } : {}) });
        continue;
      }
      if (wikidataDate && wikidataDate > now) continue;
      if (cinemetaDate < SINCE) continue;

      known.add(imdbId);
      const year = parseInt(String(meta.releaseInfo || meta.year || cinemetaDate).slice(0, 4), 10);
      const item = { id: imdbId, type, name: meta.name, year, animated, ...(wd.length ? { wd } : {}) };
      autoItems.push(item);
      added.push(`${saga.name}: + ${item.name} (${item.year}, ${type}${item.animated ? ', animação' : ''}) ${imdbId}`);
    }

    if (autoItems.length) auto.sagas[saga.slug] = autoItems;
    else delete auto.sagas[saga.slug];
    // As próximas estreias são refeitas em cada atualização (saem quando estreiam ou deixam de ter data).
    upcoming.sort((a, b) => a.date.localeCompare(b.date));
    if (upcoming.length) auto.upcoming[saga.slug] = upcoming;
    else delete auto.upcoming[saga.slug];
    for (const item of upcoming) soon.push(`${saga.name}: ${item.name} (${item.date}${item.animated ? ', animação' : ''}) ${item.id}`);
  }

  if (problems.length) console.log(`Avisos:\n${problems.join('\n')}\n`);
  console.log(added.length ? `Novos títulos (${added.length}):\n${added.join('\n')}` : 'Nenhum título novo.');
  console.log(soon.length ? `\nPróximas estreias (${soon.length}):\n${soon.join('\n')}` : '\nNenhuma próxima estreia.');
  if (universeUpdates.length) console.log(`\nUniversos atualizados (${universeUpdates.length}):\n${universeUpdates.join('\n')}`);

  if (DRY) return console.log('\n(--dry: nada foi gravado)');
  if (added.length || universeUpdates.length) auto.updated = now;
  fs.writeFileSync(AUTO_FILE, `${JSON.stringify(auto, null, 2)}\n`);
  console.log('\nGravado em data/auto.json.');

  // A ordem das sagas segue a popularidade, que muda com o tempo: recalcula-a com os dados novos.
  await computePopularity();
  console.log('Popularidade das sagas atualizada em data/popularity.json.');
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});

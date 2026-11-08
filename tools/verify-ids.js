// Confirma cada ID IMDb de data/sagas.js, data/animacao.js e data/auto.json no Cinemeta (existe, tipo certo, ano e título batem certo).
// Títulos sem ID ou com ID duvidoso recebem sugestões da pesquisa do Cinemeta.
// Também avisa de nomes em `chrono` que não correspondem a nenhum título da saga, e de títulos cuja
// marcação de animação (flag 'a') não bate com os géneros do IMDb ("Animation"), e de títulos dos universos
// (data/universes.js) que não estão em nenhuma saga.
const SAGAS = require('../lib/franchises');
const { chronoItems } = require('../lib/views');
const UNIVERSES = require('../data/universes.js');
const MANUAL_UPCOMING = require('../data/upcoming.js');

const CINEMETA = 'https://v3-cinemeta.strem.io';
const CONCURRENCY = 8;
// Animações a que o IMDb não dá o género "Animation" (confirmado no Wikidata).
const ANIMATED_WITHOUT_GENRE = new Set(['tt0065106']);
// Filmes com atores reais e personagens animadas por computador: o IMDb chama-lhes "Animation", mas aqui
// não contam como animação (Alvin, Space Jam, Looney Tunes, Tartarugas Ninja 2014, O Livro da Selva 2016,
// Os Estrumpfes 2011/2013, Tom & Jerry 2021) ou o IMDb engana-se (Quarteto Fantástico 2015).
const LIVE_ACTION_HYBRIDS = new Set([
  'tt0952640', 'tt1615918', 'tt1231580', 'tt0318155', 'tt0117705', 'tt3554046', 'tt1291150', 'tt3040964',
  'tt0472181', 'tt2017020', 'tt1361336', 'tt1502712',
]);

function normalize(text) {
  return String(text || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function sameName(a, b) {
  const x = normalize(a);
  const y = normalize(b);
  return x === y || x.includes(y) || y.includes(x);
}

function metaYear(meta) {
  return parseInt(String(meta.releaseInfo || meta.year || '').slice(0, 4), 10) || null;
}

async function getJson(url) {
  const res = await fetch(url);
  return res.ok ? res.json() : null;
}

async function suggestions(item) {
  const url = `${CINEMETA}/catalog/${item.type}/top/search=${encodeURIComponent(item.name)}.json`;
  const data = await getJson(url).catch(() => null);
  return (data?.metas || [])
    .filter((meta) => Math.abs((metaYear(meta) || 0) - item.year) <= 1)
    .slice(0, 3)
    .map((meta) => `${meta.imdb_id || meta.id} "${meta.name}" (${meta.releaseInfo || meta.year})`);
}

function animationProblem(item, meta) {
  const genres = meta.genres || meta.genre || [];
  if (!genres.length || ANIMATED_WITHOUT_GENRE.has(item.id) || LIVE_ACTION_HYBRIDS.has(item.id)) return null;
  const imdbAnimated = genres.includes('Animation');
  if (imdbAnimated === item.animated) return null;
  return `aviso: ${item.id} "${item.name}" está marcado como ${item.animated ? 'animação' : 'sem animação'}, mas o IMDb diz ${
    imdbAnimated ? 'animação' : 'sem animação'
  } (${genres.join(', ')})`;
}

async function check(item) {
  if (item.id) {
    const data = await getJson(`${CINEMETA}/meta/${item.type}/${item.id}.json`).catch(() => null);
    const meta = data?.meta;
    if (meta?.name) {
      const year = metaYear(meta);
      const nameOk = sameName(meta.name, item.name);
      const yearOk = !year || Math.abs(year - item.year) <= 1;
      if (nameOk && yearOk) return animationProblem(item, meta);
      const warn = `${item.id} guardado como "${item.name}" (${item.year}), Cinemeta diz "${meta.name}" (${year})`;
      return nameOk || yearOk ? `aviso: ${warn}` : `ERRO: ${warn}; sugestões: ${(await suggestions(item)).join(' | ') || '-'}`;
    }
    return `ERRO: ${item.id} "${item.name}" não existe no Cinemeta como ${item.type}; sugestões: ${(await suggestions(item)).join(' | ') || '-'}`;
  }
  return `SEM ID: "${item.name}" (${item.year}, ${item.type}); sugestões: ${(await suggestions(item)).join(' | ') || '-'}`;
}

async function main() {
  const jobs = SAGAS.flatMap((saga) => saga.items.map((item) => ({ saga, item })));
  const problems = [];

  for (const saga of SAGAS) {
    const ids = saga.items.map((item) => item.id).filter(Boolean);
    const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
    if (dupes.length) problems.push(`${saga.name}: IDs repetidos ${dupes.join(', ')}`);
    for (const name of chronoItems(saga).missing) problems.push(`${saga.name}: "${name}" em chrono não existe nos títulos`);
  }

  const catalogIds = new Set(SAGAS.flatMap((saga) => saga.items.map((item) => item.id)));
  const catalogItems = [...new Map(SAGAS.flatMap((saga) => saga.items).map((item) => [item.id, item])).values()];
  for (const universe of UNIVERSES) {
    for (const id of universe.ids) if (!catalogIds.has(id)) problems.push(`Universo ${universe.name}: ${id} não está em nenhuma saga`);
    const items = catalogItems.filter((item) => universe.ids.includes(item.id));
    for (const name of chronoItems({ items, chrono: universe.chrono }).missing) {
      problems.push(`Universo ${universe.name}: "${name}" em chrono não é nenhum título do universo`);
    }
  }

  const universeKeys = new Set(UNIVERSES.map((universe) => universe.key));
  for (const [slug, list] of Object.entries(MANUAL_UPCOMING)) {
    if (!SAGAS.some((saga) => saga.slug === slug)) problems.push(`data/upcoming.js: a saga "${slug}" não existe`);
    for (const item of list) {
      for (const key of item.universes || []) {
        if (!universeKeys.has(key)) problems.push(`data/upcoming.js: ${item.name} tem o universo "${key}", que não existe`);
      }
    }
  }

  let next = 0;
  await Promise.all(
    Array.from({ length: CONCURRENCY }, async () => {
      while (next < jobs.length) {
        const { saga, item } = jobs[next++];
        const problem = await check(item);
        if (problem) problems.push(`${saga.name}: ${problem}`);
      }
    }),
  );

  console.log(`${jobs.length} títulos verificados em ${SAGAS.length} sagas.`);
  if (problems.length) {
    console.log(problems.sort().join('\n'));
    process.exit(problems.some((p) => !p.includes('aviso:')) ? 1 : 0);
  }
  console.log('Tudo certo.');
}

main();

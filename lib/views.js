// As vistas de cada saga (o filtro "Género" no Explorar), pela ordem em que aparecem. Cada saga já só tem
// títulos de um separador (lib/sagas.js), por isso "Filmes"/"Séries" separam só por tipo. Depois vêm os
// universos da saga (data/universes.js), com a chave "u:<universo>".
const { strings, LANGS } = require('./i18n');
const { UNIVERSES, inUniverse, universeName } = require('./universes');

// "Predefinida" é a ordem de lançamento (do mais antigo para o mais recente); "Próximas estreias" são os títulos
// anunciados com data futura (saga.upcoming), pela data de estreia.
const VIEW_KEYS = ['default', 'chrono', 'movies', 'series', 'upcoming'];
const UNIVERSE_PREFIX = 'u:';

function releaseOrder(saga) {
  return saga.items.map((item, index) => ({ item, index })).sort((a, b) => a.item.year - b.item.year || a.index - b.index).map((e) => e.item);
}

// Nomes em `chrono` apanham todos os títulos com esse nome; "Nome (ano)" desfaz empates (ex.: Dune 1984 vs 2021).
// Nomes de títulos que estão no outro separador são simplesmente saltados.
function chronoItems(saga) {
  const release = releaseOrder(saga);
  const ordered = [];
  const missing = [];
  for (const entry of saga.chrono || []) {
    const matches = release.filter((item) => item.name === entry || `${item.name} (${item.year})` === entry);
    if (!matches.length) missing.push(entry);
    for (const item of matches) if (!ordered.includes(item)) ordered.push(item);
  }
  // `chronoSkip`: títulos que ficam fora da ordem cronológica (ex.: uma versão repetida de uma série).
  const skip = (item) => (saga.chronoSkip || []).some((entry) => item.name === entry || `${item.name} (${item.year})` === entry);
  for (const item of release) if (!ordered.includes(item) && !skip(item)) ordered.push(item);
  return { ordered: ordered.filter((item) => !skip(item)), missing };
}

function viewItems(saga, key) {
  const release = releaseOrder(saga);
  if (key.startsWith(UNIVERSE_PREFIX)) {
    // Dentro de um universo, a ordem cronológica da saga (se houver) manda; senão, a de lançamento.
    const order = saga.chrono ? chronoItems(saga).ordered : release;
    return order.filter((item) => inUniverse(item, key.slice(UNIVERSE_PREFIX.length)));
  }
  switch (key) {
    case 'default':
      return release;
    case 'chrono':
      return saga.chrono ? chronoItems(saga).ordered : [];
    case 'movies':
      return release.filter((item) => item.type === 'movie');
    case 'upcoming':
      return saga.upcoming || [];
    case 'series':
      return release.filter((item) => item.type === 'series');
    default:
      return [];
  }
}

// Universos com títulos nesta saga, menos os que são a saga inteira; do mais antigo para o mais recente.
function sagaUniverses(saga) {
  return UNIVERSES.map((universe) => ({ key: universe.key, items: saga.items.filter((item) => inUniverse(item, universe.key)) }))
    .filter(({ items }) => items.length > 0 && items.length < saga.items.length)
    .sort((a, b) => Math.min(...a.items.map((i) => i.year)) - Math.min(...b.items.map((i) => i.year)))
    .map(({ key }) => `${UNIVERSE_PREFIX}${key}`);
}

// Só mostra as vistas que têm títulos (ex.: Harry Potter não tem "Séries"). A ordem cronológica só aparece
// quando muda alguma coisa em relação à ordem de lançamento.
function availableViews(saga) {
  const base = VIEW_KEYS.filter((key) => {
    const items = viewItems(saga, key);
    if (key === 'chrono') return items.length > 0 && items.some((item, i) => item !== viewItems(saga, 'default')[i]);
    return items.length > 0;
  });
  return [...base, ...sagaUniverses(saga)];
}

function viewLabel(key, lang) {
  if (key.startsWith(UNIVERSE_PREFIX)) return universeName(key.slice(UNIVERSE_PREFIX.length), lang);
  return strings(lang).views[key];
}

// O filtro chega com o texto da vista na língua do manifest instalado; aceita as duas línguas.
function viewKeyFromLabel(label) {
  const wanted = String(label || '').trim().toLowerCase();
  if (!wanted) return null;
  const keys = [...VIEW_KEYS, ...UNIVERSES.map((universe) => `${UNIVERSE_PREFIX}${universe.key}`)];
  return keys.find((key) => LANGS.some((lang) => viewLabel(key, lang).toLowerCase() === wanted)) || null;
}

module.exports = { VIEW_KEYS, releaseOrder, chronoItems, viewItems, availableViews, viewLabel, viewKeyFromLabel };

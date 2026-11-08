// As vistas de cada saga (o filtro "Género" no Explorar), pela ordem em que aparecem. Cada saga já só tem
// títulos de um separador (lib/sagas.js), por isso "Filmes"/"Séries" separam só por tipo.
// Sagas sem universos: Predefinida (ordem de lançamento), Ordem cronológica, Filmes, Séries, Próximas estreias.
// Sagas com universos (data/universes.js, chave "u:<universo>"): primeiro os universos, por importância (o
// primeiro abre por defeito, ex.: o MCU na Marvel), cada um já pela sua ordem cronológica; depois Todos
// (ordem de lançamento), Filmes, Séries e Próximas estreias. Aí não há vista "Ordem cronológica" à parte.
const { strings, LANGS } = require('./i18n');
const { UNIVERSES, getUniverse, inUniverse, universeName } = require('./universes');

const VIEW_KEYS = ['default', 'all', 'chrono', 'movies', 'series', 'upcoming'];
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

// Títulos de um universo nesta saga, pela ordem cronológica do universo (se tiver), senão pela da saga.
function universeItems(saga, universeKey) {
  const universe = getUniverse(universeKey);
  const items = saga.items.filter((item) => inUniverse(item, universeKey));
  if (universe && universe.chrono) return chronoItems({ items, chrono: universe.chrono }).ordered;
  if (saga.chrono) return chronoItems(saga).ordered.filter((item) => items.includes(item));
  return releaseOrder({ items });
}

// Universos com títulos nesta saga, menos os que são a saga inteira; pela ordem de importância da lista.
function sagaUniverses(saga) {
  return UNIVERSES.filter((universe) => {
    const count = saga.items.filter((item) => inUniverse(item, universe.key)).length;
    return count > 0 && count < saga.items.length;
  }).map((universe) => `${UNIVERSE_PREFIX}${universe.key}`);
}

function viewItems(saga, key) {
  if (key.startsWith(UNIVERSE_PREFIX)) return universeItems(saga, key.slice(UNIVERSE_PREFIX.length));
  const release = releaseOrder(saga);
  switch (key) {
    case 'default':
    case 'all':
      return release;
    case 'chrono':
      return saga.chrono ? chronoItems(saga).ordered : [];
    case 'movies':
      return release.filter((item) => item.type === 'movie');
    case 'series':
      return release.filter((item) => item.type === 'series');
    case 'upcoming':
      return saga.upcoming || [];
    default:
      return [];
  }
}

// Só mostra as vistas que têm títulos (ex.: Harry Potter não tem "Séries"). A ordem cronológica só aparece
// quando muda alguma coisa em relação à ordem de lançamento (e nunca em sagas com universos).
function availableViews(saga) {
  const universes = sagaUniverses(saga);
  const keys = universes.length ? [...universes, 'all', 'movies', 'series', 'upcoming'] : ['default', 'chrono', 'movies', 'series', 'upcoming'];
  return keys.filter((key) => {
    const items = viewItems(saga, key);
    if (key === 'chrono') return items.length > 0 && items.some((item, i) => item !== viewItems(saga, 'default')[i]);
    return items.length > 0;
  });
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
  return keys.find((key) => LANGS.some((lang) => (viewLabel(key, lang) || '').toLowerCase() === wanted)) || null;
}

module.exports = { VIEW_KEYS, releaseOrder, chronoItems, viewItems, availableViews, viewLabel, viewKeyFromLabel };

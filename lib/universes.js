// Universos (data/universes.js): a que universos pertence cada título. Um título entra se o ID estiver na
// lista do universo, se tiver a chave do universo em `universes` (próximas estreias escritas à mão) ou se o
// `npm run update` lhe tiver guardado uma entidade do Wikidata desse universo (`wd`).
const UNIVERSES = require('../data/universes.js');

const BY_KEY = new Map(UNIVERSES.map((universe) => [universe.key, { ...universe, ids: new Set(universe.ids) }]));

function inUniverse(item, key) {
  const universe = BY_KEY.get(key);
  if (!universe) return false;
  return (
    universe.ids.has(item.id) ||
    (item.universes || []).includes(key) ||
    (item.wd || []).some((q) => (universe.wikidata || []).includes(q))
  );
}

function universeName(key, lang) {
  const universe = BY_KEY.get(key);
  return lang === 'pt' && universe.namePt ? universe.namePt : universe.name;
}

function getUniverse(key) {
  return BY_KEY.get(key) || null;
}

module.exports = { UNIVERSES, getUniverse, inUniverse, universeName };

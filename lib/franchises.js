// Sagas completas = as escritas à mão (data/sagas.js e data/animacao.js) + os títulos que o `npm run update`
// trouxe do Wikidata (data/auto.json). Os títulos automáticos entram na ordem de lançamento pelo ano; na
// ordem cronológica ficam no fim até alguém os pôr no sítio certo em `chrono`.
// `upcoming` são as próximas estreias (data/upcoming.js + data/auto.json), por ordem de data. No dia da
// estreia, uma próxima estreia passa sozinha a título normal da saga, com o seu universo (`universes` ou `wd`),
// sem esperar pela próxima atualização.
const MANUAL = require('../data');
const AUTO = require('../data/auto.json');
const MANUAL_UPCOMING = require('../data/upcoming.js');

const today = () => new Date().toISOString().slice(0, 10);
// "2027" (só o ano) conta como o último dia desse ano, para não sair antes do tempo.
const endDate = (date) => (date.length === 4 ? `${date}-12-31` : date);

function asItem({ id, type, name, year, animated, wd, universes }) {
  return { id, type, name, year, animated, ...(wd ? { wd } : {}), ...(universes ? { universes } : {}) };
}

module.exports = MANUAL.map((saga) => {
  const extra = (AUTO.sagas || {})[saga.slug] || [];
  const known = new Set(saga.items.map((item) => item.id));
  const items = [...saga.items, ...extra.filter((item) => !known.has(item.id))];
  for (const item of items) known.add(item.id);

  const now = today();
  const announced = [...(MANUAL_UPCOMING[saga.slug] || []), ...((AUTO.upcoming || {})[saga.slug] || [])]
    .map((item) => ({ ...item, year: item.year || Number(item.date.slice(0, 4)) }))
    .filter((item, i, list) => list.findIndex((other) => other.id === item.id) === i);
  const upcoming = [];
  for (const item of announced) {
    if (known.has(item.id)) continue;
    if (endDate(item.date) > now) upcoming.push(item);
    else {
      items.push(asItem(item));
      known.add(item.id);
    }
  }
  upcoming.sort((a, b) => a.date.localeCompare(b.date));
  return { ...saga, items, upcoming };
});

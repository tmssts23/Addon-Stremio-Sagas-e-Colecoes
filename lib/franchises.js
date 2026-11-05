// Sagas completas = as escritas à mão (data/sagas.js e data/animacao.js) + os títulos que o `npm run update`
// trouxe do Wikidata (data/auto.json). Os títulos automáticos entram na ordem de lançamento pelo ano; na
// ordem cronológica ficam no fim até alguém os pôr no sítio certo em `chrono`.
// `upcoming` são as próximas estreias (data/upcoming.js + data/auto.json), por ordem de data. Uma próxima
// estreia escrita à mão cuja data já passou passa a contar como título normal da saga.
const MANUAL = require('../data');
const AUTO = require('../data/auto.json');
const MANUAL_UPCOMING = require('../data/upcoming.js');

const today = () => new Date().toISOString().slice(0, 10);
// "2027" (só o ano) conta como o último dia desse ano, para não sair antes do tempo.
const endDate = (date) => (date.length === 4 ? `${date}-12-31` : date);

module.exports = MANUAL.map((saga) => {
  const extra = (AUTO.sagas || {})[saga.slug] || [];
  const known = new Set(saga.items.map((item) => item.id));
  const items = [...saga.items, ...extra.filter((item) => !known.has(item.id))];
  for (const item of items) known.add(item.id);

  const now = today();
  const manual = (MANUAL_UPCOMING[saga.slug] || []).map((item) => ({ ...item, year: Number(item.date.slice(0, 4)) }));
  for (const item of manual) {
    if (endDate(item.date) <= now && !known.has(item.id)) {
      items.push({ id: item.id, type: item.type, name: item.name, year: item.year, animated: item.animated });
      known.add(item.id);
    }
  }
  const upcoming = [...manual, ...((AUTO.upcoming || {})[saga.slug] || [])]
    .filter((item) => !known.has(item.id) && endDate(item.date) > now)
    .filter((item, i, list) => list.findIndex((other) => other.id === item.id) === i)
    .sort((a, b) => a.date.localeCompare(b.date));
  return { ...saga, items, upcoming };
});

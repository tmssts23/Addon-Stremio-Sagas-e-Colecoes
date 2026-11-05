// Os catálogos de cada separador: cada saga completa (lib/franchises.js) dá até duas sagas com o mesmo nome,
// uma em "Sagas e Coleções" com os títulos sem animação e outra em "Animações – Sagas e Coleções" com os
// animados (as próximas estreias dividem-se da mesma maneira). `key` identifica cada uma (catálogo e ecrã
// inicial): o slug, ou "anim-<slug>" na de animação.
// Em cada separador, as sagas vão da mais popular para a menos (data/popularity.json, `npm run popularity`).
const FRANCHISES = require('./franchises');
const POPULARITY = require('../data/popularity.json');

const TABS = [
  { tab: 'sagas', key: (slug) => slug, keep: (item) => !item.animated },
  { tab: 'animation', key: (slug) => `anim-${slug}`, keep: (item) => item.animated },
];

module.exports = TABS.flatMap(({ tab, key, keep }) =>
  FRANCHISES.map((saga) => ({
    ...saga,
    tab,
    key: key(saga.slug),
    items: saga.items.filter(keep),
    upcoming: saga.upcoming.filter(keep),
  }))
    .filter((saga) => saga.items.length > 0 || saga.upcoming.length > 0)
    // Sagas sem popularidade calculada (novas) ficam no fim; o sort é estável, por isso mantêm a ordem dos dados.
    .sort((a, b) => (POPULARITY[b.key] || 0) - (POPULARITY[a.key] || 0)),
);

// Todas as sagas escritas à mão. Cada saga é dividida sozinha pelos dois separadores (lib/sagas.js):
// os títulos com a flag 'a' vão para "Animações – Sagas e Coleções" e os outros para "Sagas e Coleções",
// com o mesmo nome nos dois. data/sagas.js e data/animacao.js só servem para arrumar as sagas.
const SAGAS = [...require('./sagas.js'), ...require('./animacao.js')];

const slugs = SAGAS.map((saga) => saga.slug);
const repeated = slugs.filter((slug, i) => slugs.indexOf(slug) !== i);
if (repeated.length) throw new Error(`Sagas repetidas em data/: ${repeated.join(', ')}`);

module.exports = SAGAS;

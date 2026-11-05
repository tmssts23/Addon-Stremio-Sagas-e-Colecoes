// Calcula a popularidade de cada saga (em cada separador) e grava-a em data/popularity.json; os catálogos
// aparecem por essa ordem, da mais popular para a menos (lib/sagas.js).
// Popularidade de um título = posição (percentil, de 0 a 1) do `popularity` do Cinemeta (interesse atual no
// Stremio) entre todos os títulos do catálogo; usa-se a posição e não o valor porque alguns títulos têm picos
// enormes de um dia para o outro. Popularidade de uma saga = soma dos TOP títulos mais populares dela: conta
// o tamanho da saga, mas uma saga com muitos títulos pouco vistos não passa à frente de uma pequena e muito vista.
// Uso: npm run popularity (também corre no fim do npm run update).
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'data', 'popularity.json');
const CINEMETA = 'https://v3-cinemeta.strem.io';
const CONCURRENCY = 8;
const TOP = 10;

async function itemPopularity(item) {
  const res = await fetch(`${CINEMETA}/meta/${item.type}/${item.id}.json`).catch(() => null);
  if (!res || !res.ok) return 0;
  const meta = (await res.json()).meta || {};
  return Number(meta.popularity) || 0;
}

async function computePopularity() {
  // Lê as sagas já com os dados mais recentes (o npm run update pode ter acabado de gravar data/auto.json).
  for (const key of Object.keys(require.cache)) if (key.includes(`${path.sep}lib${path.sep}`) || key.endsWith('auto.json')) delete require.cache[key];
  const SAGAS = require('../lib/sagas');

  const items = [...new Map(SAGAS.flatMap((saga) => saga.items).map((item) => [item.id, item])).values()];
  const scores = new Map();
  let next = 0;
  await Promise.all(
    Array.from({ length: CONCURRENCY }, async () => {
      while (next < items.length) {
        const item = items[next++];
        scores.set(item.id, await itemPopularity(item));
      }
    }),
  );

  // Valor -> percentil (o título mais popular vale 1, o menos popular 0).
  const ranked = [...scores.entries()].sort((a, b) => a[1] - b[1]);
  ranked.forEach(([id], i) => scores.set(id, ranked.length > 1 ? i / (ranked.length - 1) : 1));

  const result = {};
  for (const saga of SAGAS) {
    const top = saga.items.map((item) => scores.get(item.id) || 0).sort((a, b) => b - a).slice(0, TOP);
    result[saga.key] = Math.round(top.reduce((sum, value) => sum + value, 0) * 1000) / 1000;
  }
  const sorted = Object.fromEntries(Object.entries(result).sort((a, b) => b[1] - a[1]));
  fs.writeFileSync(OUT, `${JSON.stringify(sorted, null, 2)}\n`);
  return sorted;
}

module.exports = { computePopularity };

if (require.main === module) {
  computePopularity()
    .then((result) => {
      const entries = Object.entries(result);
      console.log(`Popularidade de ${entries.length} sagas gravada em data/popularity.json. As 10 primeiras:`);
      for (const [key, score] of entries.slice(0, 10)) console.log(`  ${key}: ${score}`);
    })
    .catch((err) => {
      console.error(err.message);
      process.exit(1);
    });
}

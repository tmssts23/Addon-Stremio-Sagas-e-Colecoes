const LANGS = ['pt', 'en'];
// Apps que não enviam Accept-Language (e instalações sem configuração) ficam em português.
const DEFAULT_LANG = 'pt';

const STRINGS = {
  en: {
    addonName: 'Sagas & Collections',
    addonDescription:
      'The best-known sagas (Marvel, Star Wars, Harry Potter…) and animated sagas (Toy Story, Shrek, Frozen…) from oldest to newest, with views for chronological order, movies and series.',
    // Um tipo por separador no Explorar (o catálogo de pesquisa de cada um tem o mesmo nome).
    types: {
      sagas: 'Sagas & Collections',
      animation: 'Animated Sagas & Collections',
    },
    views: {
      default: 'Default',
      chrono: 'Chronological order',
      movies: 'Movies',
      series: 'Series',
      upcoming: 'Upcoming releases',
    },
  },
  pt: {
    addonName: 'Sagas & Collections',
    addonDescription:
      'As sagas mais conhecidas (Marvel, Star Wars, Harry Potter…) e as de animação (Toy Story, Shrek, Frozen…) do mais antigo para o mais recente, com vistas por ordem cronológica, filmes e séries.',
    types: {
      sagas: 'Sagas e Coleções',
      animation: 'Animações – Sagas e Coleções',
    },
    views: {
      default: 'Predefinida',
      chrono: 'Ordem cronológica',
      movies: 'Filmes',
      series: 'Séries',
      upcoming: 'Próximas estreias',
    },
  },
};

function strings(lang) {
  return STRINGS[lang] || STRINGS[DEFAULT_LANG];
}

function sagaName(saga, lang) {
  return lang === 'pt' && saga.namePt ? saga.namePt : saga.name;
}

// Escolhe pt ou en a partir de um Accept-Language ("pt-PT,pt;q=0.9,en;q=0.8"), respeitando os q.
function langFromHeader(header) {
  const match = String(header || '')
    .split(',')
    .map((part, index) => {
      const [tag, ...params] = part.trim().split(';');
      const q = params.map((param) => param.trim()).find((param) => param.startsWith('q='));
      return { lang: tag.trim().toLowerCase().split('-')[0], q: q ? parseFloat(q.slice(2)) || 0 : 1, index };
    })
    .sort((a, b) => b.q - a.q || a.index - b.index)
    .find((entry) => LANGS.includes(entry.lang));
  return match ? match.lang : null;
}

// "auto" segue o Accept-Language da app; sem ele usa o idioma de reserva escolhido na configuração.
function resolveLang(config, acceptLanguage) {
  if (LANGS.includes(config.lang)) return config.lang;
  return langFromHeader(acceptLanguage) || (LANGS.includes(config.fallback) ? config.fallback : DEFAULT_LANG);
}

module.exports = { LANGS, STRINGS, strings, sagaName, resolveLang };

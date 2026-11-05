const http = require('http');

const SAGAS = require('./lib/sagas');
const { viewItems, availableViews, viewLabel, viewKeyFromLabel } = require('./lib/views');
const { strings, sagaName, resolveLang } = require('./lib/i18n');
const { renderConfigurePage, LOGO_SVG } = require('./lib/configure-page');

const PORT = Number(process.env.PORT) || 7010;
const HOST = '0.0.0.0';
const VERSION = '1.5.0';
const PAGE_SIZE = 100;
const SAGA_CATALOG_PREFIX = 'saga_';
const TABS = ['sagas', 'animation'];
// Um catálogo de pesquisa por separador, para os resultados aparecerem com o nome de cada um.
const SEARCH_CATALOG_IDS = { sagas: 'sagas_search', animation: 'animacao_search' };
const POSTER_URL = 'https://images.metahub.space/poster/medium/{id}/img';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Private-Network': 'true',
};

const SAGA_BY_KEY = new Map(SAGAS.map((saga) => [saga.key, saga]));

function normalize(text) {
  return String(text || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function safeDecode(raw) {
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

// As próximas estreias mostram a data completa (ex.: "18/12/2026"); o resto, só o ano. Datas só com o ano
// ("2027") ou a 1 de janeiro (o Wikidata usa-o quando só sabe o ano) mostram só o ano.
function releaseInfo(item, lang) {
  if (!item.date || item.date.length === 4 || item.date.endsWith('-01-01')) return String(item.year);
  const date = new Date(`${item.date}T12:00:00Z`);
  return new Intl.DateTimeFormat(lang === 'pt' ? 'pt-PT' : 'en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(date);
}

function toMeta(item, lang) {
  return {
    id: item.id,
    type: item.type,
    name: item.name,
    poster: POSTER_URL.replace('{id}', item.id),
    posterShape: 'poster',
    releaseInfo: releaseInfo(item, lang),
  };
}

function uniqueItems(items) {
  const seen = new Set();
  return items.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

function parseHome(value) {
  if (value === 'all') return SAGAS.map((saga) => saga.key);
  if (!value || value === 'none') return [];
  return value
    .split(',')
    .map((key) => key.trim())
    .filter((key) => SAGA_BY_KEY.has(key));
}

// Segmento de configuração no caminho, ex.: "lang=auto|fallback=pt|home=marvel,anim-toy-story".
// lang: pt | en | auto (por defeito). fallback: idioma que o "auto" usa quando a app não envia Accept-Language.
// home: none (por defeito) | all | sagas que também aparecem como filas no ecrã inicial.
function parseConfig(raw) {
  const config = { lang: 'auto', fallback: null, home: [] };
  if (!raw) return config;
  for (const pair of safeDecode(raw).split('|')) {
    const [key, ...rest] = pair.split('=');
    const val = rest.join('=').trim().toLowerCase();
    if (key === 'lang') config.lang = val;
    else if (key === 'fallback') config.fallback = val;
    else if (key === 'home') config.home = parseHome(val);
  }
  return config;
}

// O filtro de vistas é obrigatório nas sagas que não estão no ecrã inicial: as apps só põem no início
// os catálogos sem extras obrigatórios, e no Explorar escolhem logo a primeira opção ("Predefinida").
function sagaCatalog(saga, lang, onHome) {
  const text = strings(lang);
  const options = availableViews(saga).map((key) => viewLabel(key, lang));
  return {
    type: text.types[saga.tab],
    id: `${SAGA_CATALOG_PREFIX}${saga.key}`,
    name: sagaName(saga, lang),
    genres: options,
    extra: [
      { name: 'genre', options, isRequired: !onHome },
      { name: 'skip', isRequired: false },
    ],
    extraSupported: ['genre', 'skip'],
    ...(onHome ? {} : { extraRequired: ['genre'] }),
  };
}

function getManifest(config, lang, origin) {
  const text = strings(lang);
  return {
    id: 'pt.sagas-colecoes',
    version: VERSION,
    name: text.addonName,
    description: text.addonDescription,
    logo: `${origin}/logo.svg`,
    resources: ['catalog'],
    types: TABS.map((tab) => text.types[tab]),
    idPrefixes: ['tt'],
    catalogs: TABS.flatMap((tab) => [
      ...SAGAS.filter((saga) => saga.tab === tab).map((saga) => sagaCatalog(saga, lang, config.home.includes(saga.key))),
      {
        type: text.types[tab],
        id: SEARCH_CATALOG_IDS[tab],
        name: text.types[tab],
        extra: [{ name: 'search', isRequired: true }],
        extraSupported: ['search'],
        extraRequired: ['search'],
      },
    ]),
    behaviorHints: {
      configurable: true,
      configurationRequired: false,
    },
  };
}

function searchItems(query, tab) {
  const needle = normalize(query);
  if (!needle) return [];
  const results = [];
  for (const saga of SAGAS.filter((s) => s.tab === tab)) {
    const sagaTerms = [saga.name, saga.namePt, ...(saga.aliases || [])].map(normalize);
    if (sagaTerms.some((term) => term.includes(needle))) {
      results.push(...viewItems(saga, 'release'));
      continue;
    }
    results.push(...viewItems(saga, 'release').filter((item) => normalize(item.name).includes(needle)));
  }
  return uniqueItems(results);
}

function getCatalogItems(catalogId, extra) {
  const searchTab = TABS.find((tab) => SEARCH_CATALOG_IDS[tab] === catalogId);
  if (searchTab) return searchItems(extra.search, searchTab);
  if (!catalogId.startsWith(SAGA_CATALOG_PREFIX)) return null;
  const saga = SAGA_BY_KEY.get(catalogId.slice(SAGA_CATALOG_PREFIX.length));
  if (!saga) return null;
  const key = viewKeyFromLabel(extra.genre) || 'default';
  return viewItems(saga, key);
}

// Os extras chegam codificados num só segmento: "genre=Ordem%20cronol%C3%B3gica&skip=100".
function parseExtra(rawSegment) {
  const extra = {};
  if (!rawSegment) return extra;
  for (const [key, value] of new URLSearchParams(rawSegment)) extra[key] = value;
  return extra;
}

function send(res, status, body, contentType, cacheSeconds, extraHeaders = {}) {
  res.writeHead(status, {
    ...CORS,
    'Content-Type': contentType,
    'Cache-Control': cacheSeconds ? `public, max-age=${cacheSeconds}` : 'no-cache',
    ...extraHeaders,
  });
  res.end(body);
}

function sendJson(res, data, cacheSeconds = 2 * 60 * 60, extraHeaders = {}) {
  send(res, 200, JSON.stringify(data), 'application/json; charset=utf-8', cacheSeconds, extraHeaders);
}

function notFound(res) {
  send(res, 404, JSON.stringify({ err: 'Not found' }), 'application/json; charset=utf-8', 0);
}

function originFromRequest(req) {
  const host = req.headers.host || `127.0.0.1:${PORT}`;
  const proto = String(req.headers['x-forwarded-proto'] || '').split(',')[0].trim() === 'https' ? 'https' : 'http';
  return `${proto}://${host}`;
}

function requestHandler(req, res) {
  if (!process.env.VERCEL) {
    console.log(`[Sagas] ${req.method} ${req.url} | accept-language: ${req.headers['accept-language'] || '-'}`);
  }

  if (req.method === 'OPTIONS') {
    res.writeHead(204, CORS);
    return res.end();
  }
  if (req.method !== 'GET' && req.method !== 'HEAD') return notFound(res);

  const rawPath = (req.url || '/').split('?')[0];
  let segments = rawPath.split('/').filter(Boolean);

  if (segments.length === 1 && segments[0] === 'logo.svg') {
    return send(res, 200, LOGO_SVG, 'image/svg+xml', 7 * 24 * 60 * 60);
  }

  // Segmento de configuração opcional: /<config>/manifest.json, /<config>/catalog/...
  let rawConfig = null;
  if (segments.length && !['manifest.json', 'catalog', 'configure'].includes(segments[0])) {
    rawConfig = segments[0];
    segments = segments.slice(1);
  }
  const config = parseConfig(rawConfig);
  const origin = originFromRequest(req);

  if (segments.length === 0 || (segments.length === 1 && segments[0] === 'configure')) {
    const lang = resolveLang(config, req.headers['accept-language']);
    const html = renderConfigurePage({ origin, sagas: SAGAS, config, lang });
    return send(res, 200, html, 'text/html; charset=utf-8', 0);
  }

  if (segments.length === 1 && segments[0] === 'manifest.json') {
    const lang = resolveLang(config, req.headers['accept-language']);
    return sendJson(res, getManifest(config, lang, origin), 60 * 60, { Vary: 'Accept-Language' });
  }

  // /catalog/<tipo>/<id>.json ou /catalog/<tipo>/<id>/<extra>.json (o tipo muda com a língua)
  if (segments[0] === 'catalog' && (segments.length === 3 || segments.length === 4)) {
    const last = segments[segments.length - 1];
    if (!last.endsWith('.json')) return notFound(res);

    const catalogId = safeDecode(segments.length === 3 ? last.slice(0, -5) : segments[2]);
    const extra = segments.length === 4 ? parseExtra(last.slice(0, -5)) : {};
    const items = getCatalogItems(catalogId, extra);
    if (!items) return notFound(res);

    const skip = Math.max(0, parseInt(extra.skip, 10) || 0);
    const lang = resolveLang(config, req.headers['accept-language']);
    return sendJson(res, { metas: items.slice(skip, skip + PAGE_SIZE).map((item) => toMeta(item, lang)) }, undefined, {
      Vary: 'Accept-Language',
    });
  }

  return notFound(res);
}

module.exports = { requestHandler, getManifest, getCatalogItems, parseConfig };

if (require.main === module) {
  http.createServer(requestHandler).listen(PORT, HOST, () => {
    console.log(`[Sagas] A correr em http://127.0.0.1:${PORT}/manifest.json`);
    console.log(`[Sagas] Configurar em http://127.0.0.1:${PORT}/configure`);
  });
}

const { strings, sagaName } = require('./i18n');

const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
<rect width="256" height="256" rx="48" fill="#1b1430"/>
<rect x="44" y="70" width="112" height="150" rx="12" fill="#5b3fd1"/>
<rect x="72" y="52" width="112" height="150" rx="12" fill="#8a6cff"/>
<rect x="100" y="34" width="112" height="150" rx="12" fill="#f5c542"/>
<path d="M140 82l40 27-40 27z" fill="#1b1430"/>
</svg>`;

const PAGE_TEXT = {
  pt: {
    title: 'Sagas & Collections',
    intro:
      'Catálogos das sagas mais conhecidas. No Stremio/Nuvio vai a Explorar e escolhe o tipo "Sagas e Coleções" ou "Animações – Sagas e Coleções", depois a saga, e no filtro escolhe a vista: Predefinida (do mais antigo para o mais recente), Ordem cronológica, Filmes, Séries ou um dos universos da saga (ex.: MCU, Arrowverse). Cada saga aparece com o mesmo nome nos dois tipos: os títulos de animação em "Animações" e os outros em "Sagas e Coleções" (ex.: Astérix).',
    language: 'Idioma',
    auto: 'Automático (segue a app)',
    homeTitle: 'Mostrar também no ecrã inicial',
    homeHint: 'As sagas marcadas aparecem como filas no início. As outras ficam só no Explorar.',
    all: 'Todas',
    none: 'Nenhuma',
    install: 'Instalar no Stremio',
    copy: 'Copiar link (Nuvio)',
    copied: 'Copiado!',
    link: 'Link do addon',
    views: 'vistas',
  },
  en: {
    title: 'Sagas & Collections',
    intro:
      'Catalogs for the best-known sagas. In Stremio/Nuvio open Discover, pick the "Sagas & Collections" or "Animated Sagas & Collections" type, then the saga, and use the filter to choose a view: Default (oldest to newest), Chronological order, Movies, Series or one of the universes of the saga (e.g. MCU, Arrowverse). Each saga shows up with the same name in both types: animated titles under "Animated" and the rest under "Sagas & Collections" (e.g. Asterix).',
    language: 'Language',
    auto: 'Automatic (follows the app)',
    homeTitle: 'Also show on the home screen',
    homeHint: 'Checked sagas show up as rows on the home screen. The others stay in Discover only.',
    all: 'All',
    none: 'None',
    install: 'Install in Stremio',
    copy: 'Copy link (Nuvio)',
    copied: 'Copied!',
    link: 'Addon link',
    views: 'views',
  },
};

function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

function renderConfigurePage({ origin, sagas, config, lang }) {
  const t = PAGE_TEXT[lang] || PAGE_TEXT.pt;
  const { views, types } = strings(lang);
  const sagaRow = (saga) => {
    const checked = config.home.includes(saga.key) ? ' checked' : '';
    return `<label class="saga"><input type="checkbox" value="${escapeHtml(saga.key)}"${checked}><span>${escapeHtml(sagaName(saga, lang))}</span><small>${saga.items.length}</small></label>`;
  };
  // Uma grelha por separador do Explorar.
  const rows = Object.entries(types)
    .map(([tab, typeName]) => {
      const tabSagas = sagas.filter((saga) => saga.tab === tab);
      return `<h3>${escapeHtml(typeName)}</h3><div class="grid">${tabSagas.map(sagaRow).join('')}</div>`;
    })
    .join('');
  const langOption = (value, label) => `<option value="${value}"${config.lang === value ? ' selected' : ''}>${label}</option>`;

  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(t.title)}</title>
<link rel="icon" href="${origin}/logo.svg">
<style>
  :root { --bg:#120e1f; --card:#1d1730; --line:#2e2648; --text:#eeeaf7; --muted:#a59cc0; --accent:#8a6cff; --gold:#f5c542; }
  * { box-sizing: border-box; }
  body { margin:0; background:var(--bg); color:var(--text); font:15px/1.5 system-ui, -apple-system, Segoe UI, Roboto, sans-serif; }
  main { max-width:760px; margin:0 auto; padding:32px 16px 48px; }
  header { display:flex; gap:16px; align-items:center; }
  header img { width:64px; height:64px; }
  h1 { margin:0; font-size:28px; }
  p.intro { color:var(--muted); }
  .views { display:flex; flex-wrap:wrap; gap:6px; margin:8px 0 0; padding:0; list-style:none; }
  .views li { background:var(--line); border-radius:999px; padding:2px 10px; font-size:13px; }
  section { background:var(--card); border:1px solid var(--line); border-radius:14px; padding:18px; margin-top:18px; }
  h2 { margin:0 0 6px; font-size:17px; }
  .hint { color:var(--muted); margin:0 0 12px; font-size:13px; }
  select { width:100%; padding:10px; border-radius:10px; border:1px solid var(--line); background:var(--bg); color:var(--text); font:inherit; }
  .tools { display:flex; gap:8px; margin-bottom:10px; }
  .tools button { background:transparent; color:var(--accent); border:1px solid var(--line); border-radius:8px; padding:4px 12px; cursor:pointer; font:inherit; }
  h3 { margin:16px 0 8px; font-size:14px; color:var(--gold); }
  .grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(220px, 1fr)); gap:6px; }
  .saga { display:flex; align-items:center; gap:8px; padding:8px 10px; border-radius:10px; background:var(--bg); cursor:pointer; }
  .saga span { flex:1; }
  .saga small { color:var(--muted); }
  .saga input { accent-color:var(--accent); }
  code { display:block; word-break:break-all; background:var(--bg); padding:10px; border-radius:10px; color:var(--gold); font-size:13px; }
  .actions { display:flex; flex-wrap:wrap; gap:10px; margin-top:12px; }
  .actions a, .actions button { flex:1 1 200px; text-align:center; padding:12px; border-radius:10px; font:600 15px system-ui, sans-serif; text-decoration:none; cursor:pointer; border:0; }
  .primary { background:var(--accent); color:#fff; }
  .secondary { background:var(--line); color:var(--text); }
</style>
</head>
<body>
<main>
  <header><img src="${origin}/logo.svg" alt=""><h1>${escapeHtml(t.title)}</h1></header>
  <p class="intro">${escapeHtml(t.intro)}</p>
  <ul class="views">${Object.values(views).map((v) => `<li>${escapeHtml(v)}</li>`).join('')}</ul>

  <section>
    <h2>${escapeHtml(t.language)}</h2>
    <select id="lang">
      ${langOption('auto', escapeHtml(t.auto))}
      ${langOption('pt', 'Português')}
      ${langOption('en', 'English')}
    </select>
  </section>

  <section>
    <h2>${escapeHtml(t.homeTitle)}</h2>
    <p class="hint">${escapeHtml(t.homeHint)}</p>
    <div class="tools"><button type="button" data-set="all">${escapeHtml(t.all)}</button><button type="button" data-set="none">${escapeHtml(t.none)}</button></div>
    <div id="sagas">${rows}</div>
  </section>

  <section>
    <h2>${escapeHtml(t.link)}</h2>
    <code id="url"></code>
    <div class="actions">
      <a id="install" class="primary" href="#">${escapeHtml(t.install)}</a>
      <button id="copy" type="button" class="secondary">${escapeHtml(t.copy)}</button>
    </div>
  </section>
</main>
<script>
  const origin = ${JSON.stringify(origin)};
  const fallback = (navigator.language || 'pt').toLowerCase().startsWith('en') ? 'en' : 'pt';
  const boxes = [...document.querySelectorAll('#sagas input')];
  function manifestUrl() {
    const home = boxes.filter((b) => b.checked).map((b) => b.value);
    const parts = ['lang=' + document.getElementById('lang').value, 'fallback=' + fallback];
    if (home.length) parts.push('home=' + (home.length === boxes.length ? 'all' : home.join(',')));
    return origin + '/' + encodeURIComponent(parts.join('|')) + '/manifest.json';
  }
  function update() {
    const url = manifestUrl();
    document.getElementById('url').textContent = url;
    document.getElementById('install').href = url.replace(/^https?:/, 'stremio:');
  }
  document.querySelectorAll('[data-set]').forEach((btn) => btn.addEventListener('click', () => {
    boxes.forEach((b) => { b.checked = btn.dataset.set === 'all'; });
    update();
  }));
  document.getElementById('lang').addEventListener('change', update);
  boxes.forEach((b) => b.addEventListener('change', update));
  document.getElementById('copy').addEventListener('click', async (e) => {
    try { await navigator.clipboard.writeText(manifestUrl()); e.target.textContent = ${JSON.stringify(t.copied)}; } catch {}
  });
  update();
</script>
</body>
</html>`;
}

module.exports = { renderConfigurePage, LOGO_SVG };

// Cloudflare Workers: transforma cada Request num pedido ao estilo do Node para o requestHandler de index.js
// e devolve a resposta como Response. O Wrangler junta tudo (index.js, lib/ e data/) num só ficheiro.
import addon from './index.js';

const { requestHandler } = addon;

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const headers = Object.fromEntries(request.headers);
    // O Cloudflare já recebe o pedido em https; o addon usa este cabeçalho para montar os seus links.
    headers['x-forwarded-proto'] = url.protocol.replace(':', '');
    headers.host = headers.host || url.host;

    return new Promise((resolve) => {
      let status = 200;
      let responseHeaders = {};
      const res = {
        writeHead(code, extra = {}) {
          status = code;
          responseHeaders = { ...responseHeaders, ...extra };
        },
        end(body) {
          const noBody = request.method === 'HEAD' || status === 204;
          resolve(new Response(noBody ? null : body, { status, headers: responseHeaders }));
        },
      };
      requestHandler({ method: request.method, url: url.pathname + url.search, headers }, res);
    });
  },
};

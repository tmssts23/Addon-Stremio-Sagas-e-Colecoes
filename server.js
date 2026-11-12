// Servidor Node (no PC e no Fly.io). O addon em si está em index.js.
const http = require('http');
const { requestHandler } = require('./index');

const PORT = Number(process.env.PORT) || 7010;
const HOST = '0.0.0.0';

http.createServer(requestHandler).listen(PORT, HOST, () => {
  console.log(`[Sagas] A correr em http://127.0.0.1:${PORT}/manifest.json`);
  console.log(`[Sagas] Configurar em http://127.0.0.1:${PORT}/configure`);
});

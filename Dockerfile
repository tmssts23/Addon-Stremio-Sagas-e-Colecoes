# Imagem para o Fly.io (ou qualquer host com Docker). Sem dependências npm.
# Os dados (data/, incluindo auto.json e popularity.json da atualização diária) vão dentro da imagem.
FROM node:22-alpine

ENV NODE_ENV=production \
    PORT=8080

WORKDIR /app
COPY package.json ./
COPY index.js server.js ./
COPY lib ./lib
COPY data ./data

USER node
EXPOSE 8080
CMD ["node", "server.js"]

# Sagas e Coleções

Addon de catálogos para **Stremio** e **Nuvio** com 113 sagas e cerca de 900 títulos: Marvel, Star Wars, DC, Harry Potter, O Senhor dos Anéis, James Bond, Toy Story, Shrek, Frozen, O Rei Leão, Tintin, Astérix, Oliver e Benji, Marco e Gina, Studio Ghibli, Dragon Ball, Pokémon…

## Como funciona

- Cria dois tipos novos no Explorar, ao lado de Filmes e Séries:
  - **"Sagas e Coleções"** (em inglês, "Sagas & Collections");
  - **"Animações – Sagas e Coleções"** (em inglês, "Animated Sagas & Collections").
- Cada saga aparece com o mesmo nome nos dois tipos, conforme os títulos que tem: os de animação em "Animações" e os outros em "Sagas e Coleções". Ex.: em "Animações", Astérix tem os 11 filmes animados; em "Sagas e Coleções", tem os 5 filmes com atores. A Marvel tem os filmes e séries em "Sagas e Coleções" e What If…?, X-Men '97 e outras em "Animações".
- A divisão é automática, pela flag `'a'` de cada título (ver abaixo). `data/sagas.js` e `data/animacao.js` servem só para arrumar as sagas.
- Escolhes a saga e no filtro escolhes a vista:
  - **Predefinida**: tudo, do mais antigo para o mais recente (ordem de lançamento)
  - **Ordem cronológica**: pela ordem da história (só nas sagas onde muda alguma coisa e que não têm universos; nas que têm, ver "Universos")
  - **Filmes** e **Séries**
  - **Próximas estreias**: filmes e séries já anunciados, com a data de estreia (só nas sagas que têm). Saem da lista quando estreiam e passam para as outras vistas.
- Conta como animação o que o IMDb classifica como "Animation", menos os filmes com atores em cena e personagens animadas por computador (Space Jam, Alvin, Tom & Jerry 2021), que ficam em "Sagas e Coleções". O `npm run verify` avisa quando a marcação de um título não bate com o IMDb (com exceções para estes híbridos).
- Cada saga só mostra as vistas que têm títulos.
- Em cada tipo, as sagas aparecem da mais popular para a menos. A popularidade vem do Stremio (via Cinemeta): conta-se a posição de cada título entre os do catálogo e soma-se a dos 10 mais populares de cada saga. É recalculada em cada `npm run update` (ou à mão com `npm run popularity`) e fica em `data/popularity.json`.
- Na pesquisa, encontra sagas pelo nome em PT ou EN ("Velocidade Furiosa", "Guerra das Estrelas", "Homem-Aranha"…).

## Universos

Muitas sagas têm vários universos (continuidades). Nessas sagas, o filtro começa pelos universos, por ordem de importância: o primeiro é o que abre por defeito (ex.: o MCU na Marvel, o DCEU na DC, o cânone no Star Wars). Cada universo já mostra os títulos pela sua ordem cronológica, por isso estas sagas não têm a vista "Ordem cronológica" à parte. A seguir vêm **Todos** (a saga inteira por ordem de lançamento), Filmes, Séries e Próximas estreias.

Os universos estão em `data/universes.js` (45). A ordem da lista é a importância, e cada universo pode ter a sua própria `chrono`:

- **Marvel** (inclui o Homem-Aranha e os X-Men): Universo Cinematográfico Marvel (MCU), Marvel Netflix (Saga Defensores), Marvel Television (ABC e Hulu), X-Men (Fox), X-Men: A Série Animada, Homem-Aranha de Sam Raimi, O Fantástico Homem-Aranha, Universo Homem-Aranha da Sony, Aranhaverso, Blade (1998–2004), Quarteto Fantástico (Fox), Demolidor e Elektra (Fox), Ghost Rider (Sony)
- **DC** (inclui o Batman): Universo Estendido DC (DCEU), Universo DC (DCU), Arrowverse, Universo Animado DC (DCAU), Trilogia O Cavaleiro das Trevas (Nolan), Batman de Burton e Schumacher, The Batman (Matt Reeves), Batman (1966), Superman de Christopher Reeve, Joker (Todd Phillips), Titãs e Doom Patrol (Terra-9), Teen Titans (animação), Watchmen
- **Star Wars**: cânone oficial e Legends (fora do cânone)
- **Star Trek**: linha temporal principal e linha temporal Kelvin
- **Transformers**: Geração 1 (1984), Michael Bay, Bumblebee e O Despertar das Feras
- **Tartarugas Ninja**: filmes 1990–2007, filmes 2014–2016, O Despertar das Tartarugas Ninja, Caos Mutante
- **Planeta dos Macacos**: 1968–1973 e 2011–
- **Alien** (saga principal e Alien vs. Predador), **Duna** (Denis Villeneuve), **O Senhor dos Anéis** (Peter Jackson e Rankin/Bass), **A Múmia** (Stephen Sommers)

As outras sagas são um universo só, por isso não têm estas vistas. Os títulos novos da atualização diária entram no universo certo pelas entidades do Wikidata (`wikidata` em cada universo).

O addon só fornece catálogos. As fichas vêm do Cinemeta (IDs IMDb `tt...`) e os streams vêm dos outros addons que tiveres instalados.

## Idioma

Por defeito é **automático**: segue o `Accept-Language` que a app envia. Se a app não enviar nenhum, usa o idioma do browser onde configuraste o addon (ou português, sem configuração). Na página de configuração podes fixar Português ou English. A app guarda o manifest ao instalar, por isso, se mudares a língua da app, reinstala o addon.

## Como correr

Não precisa de `npm install` (não tem dependências).

```
npm start
```

- Configurar: `http://127.0.0.1:7010/configure`
- Manifest: `http://127.0.0.1:7010/manifest.json`

Para instalar no telemóvel ou na TV, publica no Cloudflare Workers, no Fly.io ou na Vercel (as apps precisam de `https`).

O código do addon está em `index.js`; cada sítio tem a sua entrada: `server.js` (Node e Fly.io), `worker.mjs` (Cloudflare Workers) e `api/index.js` (Vercel).

## Enviar para o GitHub

O addon tem cerca de 30 ficheiros, por isso cabe num só envio pela página do GitHub (o limite é 100 ficheiros de cada vez): no repositório, **Add file → Upload files** e arrasta o conteúdo desta pasta, incluindo a pasta `.github` (tem a atualização diária). Não envies `node_modules` nem `.wrangler`, se existirem.

## Publicar no Cloudflare Workers (recomendado)

Grátis e sempre ligado, sem máquinas para acordar. Ficheiros: `worker.mjs` e `wrangler.toml`. Precisas do Node instalado (não é preciso `npm install`).

1. Inicia sessão no Cloudflare: `npx wrangler login`
2. Dentro desta pasta, publica: `npx wrangler deploy` (troca `name` em `wrangler.toml` se quiseres outro nome)
3. Abre `https://sagas-colecoes.<a-tua-conta>.workers.dev/configure`, escolhe o idioma e as sagas, e instala.

Notas:
- O Wrangler junta o código e os dados num só ficheiro (cerca de 160 KB). Cada pedido gasta poucos milissegundos, dentro do limite gratuito do Workers.
- Os dados vão dentro do que é publicado. Depois de mudares sagas ou de correres `npm run update` à mão, publica outra vez com `npx wrangler deploy`.
- **Atualização diária no Cloudflare:** com o addon no GitHub, cria um token em dash.cloudflare.com → My Profile → API Tokens, com o modelo **Edit Cloudflare Workers**, e guarda-o em Settings → Secrets and variables → Actions com o nome `CLOUDFLARE_API_TOKEN` (e o ID da conta, que aparece no painel do Cloudflare, como `CLOUDFLARE_ACCOUNT_ID`). O workflow diário publica sozinho quando houver novidades.
- As próximas estreias que chegam à data passam sozinhas para a saga, sem precisar de nova publicação.

## Publicar no Fly.io

O Fly.io corre o addon como um servidor normal (contentor Docker). Ficheiros: `Dockerfile`, `fly.toml`, `.dockerignore` (não precisas de Docker instalado: o Fly constrói a imagem).

1. Instala o `flyctl` (PowerShell):
   ```powershell
   iwr https://fly.io/install.ps1 -useb | iex
   ```
2. Inicia sessão: `fly auth login`
3. Dentro desta pasta, cria a app (usa o `fly.toml` que já existe; troca o nome se `sagas-colecoes` estiver ocupado):
   ```
   fly launch --no-deploy --copy-config --name <nome-unico>
   ```
4. Publica: `fly deploy`
5. Abre `https://<nome-unico>.fly.dev/configure`, escolhe o idioma e as sagas, e instala.

Notas:
- A máquina desliga-se quando ninguém a usa e liga sozinha no pedido seguinte (o primeiro pedido demora uns segundos). Para a ter sempre ligada: `auto_stop_machines = "off"` e `min_machines_running = 1` no `fly.toml`.
- Os dados vão dentro da imagem. Depois de mudares sagas ou de correres `npm run update` à mão, publica outra vez com `fly deploy`.
- **Atualização diária no Fly.io:** com o addon no GitHub, cria um token com `fly tokens create deploy` e guarda-o em Settings → Secrets and variables → Actions com o nome `FLY_API_TOKEN`. O workflow diário faz `fly deploy` sozinho quando houver novidades. Sem esse segredo, só grava no GitHub (que chega para a Vercel).
- As próximas estreias que chegam à data passam sozinhas para a saga, sem precisar de nova publicação.

## Publicar na Vercel

1. Envia esta pasta para um repositório no GitHub e importa-o na Vercel (ou corre `vercel` na pasta).
2. Abre `https://<o-teu-projeto>.vercel.app/configure`, escolhe o idioma e as sagas que queres também no ecrã inicial.
3. **Stremio:** botão "Instalar no Stremio". **Nuvio:** "Copiar link" e cola em Definições → Addons.

## Adicionar ou editar sagas

Edita `data/sagas.js` ou `data/animacao.js` (as instruções estão no topo de cada ficheiro). Marca com `'a'` os títulos de animação: é isso que decide o separador. Depois confirma os IDs:

```
npm run verify
```

Os títulos sem ID (`''`) recebem sugestões da pesquisa do Cinemeta.

## Atualização automática (Wikidata, sem chave)

`npm run update` vai ao Wikidata buscar os filmes e séries ligados a cada saga (fontes em `data/wikidata-sources.js`) e junta os novos a `data/auto.json`. Não precisa de chave nenhuma. Nunca mexe em `data/sagas.js` nem em `data/animacao.js`, nem apaga nada.

Só entram títulos que:
- são filmes ou séries (não documentários, curtas nem filmes de fãs);
- estrearam desde 1 de janeiro de 2025 (o que é mais antigo fica a cargo da lista à mão);
- já existem no Cinemeta e já estrearam mesmo (filme com nota no IMDb, série com episódios emitidos).

Notas:
- Na Predefinida, os títulos novos ficam no sítio certo pelo ano. Na ordem cronológica, ficam no fim até os pores em `chrono`.
- Um título errado que entre sozinho: põe o ID IMDb em `exclude` dessa saga em `data/wikidata-sources.js`.
- As próximas estreias (títulos com data de estreia marcada nos próximos 4 anos, no Cinemeta ou no Wikidata) são refeitas em cada atualização.
- No dia da estreia, o título sai sozinho das Próximas estreias e entra na saga e no seu universo, sem esperar pela atualização. O universo vem do Wikidata ou, nas próximas estreias escritas à mão (`data/upcoming.js`), do campo `universes`. Se ainda não houver nota no IMDb, continua a aparecer como estreado durante 60 dias, até o IMDb o confirmar.
- Ver primeiro sem gravar: `npm run update -- --dry`.

**Todos os dias, sozinho:** com o addon num repositório do GitHub, o workflow `.github/workflows/update-catalogs.yml` corre todos os dias às 05:00 (UTC), confirma os IDs e grava as novidades (a Vercel volta a publicar sozinha). Não é preciso configurar nada no GitHub. As apps guardam os catálogos em cache 2 horas, por isso um título novo aparece normalmente no próprio dia. Também o podes correr à mão em Actions → "Atualizar catalogos" → *Run workflow*.

Títulos novos numa saga aparecem nas apps sem reinstalar. Se uma saga ganhar uma vista que não tinha (ex.: a primeira série), essa vista só aparece depois de reinstalar o addon.

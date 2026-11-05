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
  - **Ordem cronológica**: pela ordem da história (só nas sagas onde muda alguma coisa)
  - **Filmes** e **Séries**
  - **Próximas estreias**: filmes e séries já anunciados, com a data de estreia (só nas sagas que têm). Saem da lista quando estreiam e passam para as outras vistas.
- Conta como animação o que o IMDb classifica como "Animation", menos os filmes com atores em cena e personagens animadas por computador (Space Jam, Alvin, Tom & Jerry 2021), que ficam em "Sagas e Coleções". O `npm run verify` avisa quando a marcação de um título não bate com o IMDb (com exceções para estes híbridos).
- Cada saga só mostra as vistas que têm títulos.
- Em cada tipo, as sagas aparecem da mais popular para a menos. A popularidade vem do Stremio (via Cinemeta): conta-se a posição de cada título entre os do catálogo e soma-se a dos 10 mais populares de cada saga. É recalculada em cada `npm run update` (ou à mão com `npm run popularity`) e fica em `data/popularity.json`.
- Na pesquisa, encontra sagas pelo nome em PT ou EN ("Velocidade Furiosa", "Guerra das Estrelas", "Homem-Aranha"…).

## Universos

Muitas sagas têm vários universos (continuidades). Cada universo aparece como vista no filtro da saga, a seguir a Filmes e Séries, sempre que a saga tem títulos de mais do que um. Estão em `data/universes.js` (44 universos):

- **Marvel** (inclui o Homem-Aranha e os X-Men): Universo Cinematográfico Marvel (MCU), Marvel Netflix (Saga Defensores), Marvel Television (ABC e Hulu), X-Men (Fox), X-Men: A Série Animada, Homem-Aranha de Sam Raimi, O Fantástico Homem-Aranha, Universo Homem-Aranha da Sony, Aranhaverso, Blade (1998–2004), Quarteto Fantástico (Fox), Demolidor e Elektra (Fox), Ghost Rider (Sony)
- **DC** (inclui o Batman): Universo Estendido DC (DCEU), Universo DC (DCU), Arrowverse, Universo Animado DC (DCAU), Trilogia O Cavaleiro das Trevas (Nolan), Batman de Burton e Schumacher, The Batman (Matt Reeves), Batman (1966), Superman de Christopher Reeve, Joker (Todd Phillips), Titãs e Doom Patrol (Terra-9), Teen Titans (animação), Watchmen
- **Star Wars**: cânone oficial e Legends (fora do cânone)
- **Star Trek**: linha temporal principal e linha temporal Kelvin
- **Transformers**: Geração 1 (1984), Michael Bay, Bumblebee e O Despertar das Feras
- **Tartarugas Ninja**: filmes 1990–2007, filmes 2014–2016, O Despertar das Tartarugas Ninja, Caos Mutante
- **Planeta dos Macacos**: 1968–1973 e 2011–
- **Duna** (Denis Villeneuve), **O Senhor dos Anéis** (Peter Jackson e Rankin/Bass), **Alien vs. Predador**, **A Múmia** (Stephen Sommers)

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

Para instalar no telemóvel ou na TV, publica na Vercel (as apps precisam de `https`).

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
- Ver primeiro sem gravar: `npm run update -- --dry`.

**Todos os dias, sozinho:** com o addon num repositório do GitHub, o workflow `.github/workflows/update-catalogs.yml` corre todos os dias às 05:00 (UTC), confirma os IDs e grava as novidades (a Vercel volta a publicar sozinha). Não é preciso configurar nada no GitHub. As apps guardam os catálogos em cache 2 horas, por isso um título novo aparece normalmente no próprio dia. Também o podes correr à mão em Actions → "Atualizar catalogos" → *Run workflow*.

Títulos novos numa saga aparecem nas apps sem reinstalar. Se uma saga ganhar uma vista que não tinha (ex.: a primeira série), essa vista só aparece depois de reinstalar o addon.

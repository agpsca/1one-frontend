# 1one — frontend

Rebranding do 360

> 360 agora é 1one. 
> O rebrand para 1one está em andamento!

## Stack

| Peça | Escolha |
|---|---|
| Framework | Next 16 (App Router, Turbopack, React 19, React Compiler) |
| Linguagem | TypeScript estrito |
| Estilo | Tailwind 4 com tokens em CSS custom properties |
| Componentes | shadcn sobre `radix-ui`, ícones `lucide-react` |
| Formulários | react-hook-form + zod |
| Estado global | zustand para modais, TanStack Query para estado de servidor |
| Cliente HTTP | hooks do TanStack Query gerados por Orval a partir do OpenAPI |
| Lint e formato | Biome |
| Pacotes | pnpm (versão fixada em `packageManager`) |

## Começando

Requer Node 22+ e pnpm via corepack. O script de setup instala dependências,
ativa os hooks de git, cria o `.env.local` a partir do template e testa o build:

```bash
./scripts/dev-setup.sh
pnpm dev
```

`pnpm install` sozinho **não** basta: o pnpm 11 não executa o script `prepare`,
então o husky não se instala e o repositório fica sem pre-commit e sem pre-push,
silenciosamente. O `dev-setup.sh` faz isso e falha alto se os hooks não ficarem
ativos.

Em dev, abra o app por `localhost` ou `127.0.0.1`. Para outros hosts, como um
IP de rede, o Next bloqueia `/_next/*` e a página carrega sem hidratar: links
funcionam, controles com React não. Liberar um host exige incluí-lo
deliberadamente em `allowedDevOrigins`, no `next.config.ts`.

### Variáveis de ambiente

Template em `.env.example`.

| Variável | Para quê |
|---|---|
| `BACKEND_URL` | Backend consumido pelo proxy. Server-only de propósito: sem o prefixo `NEXT_PUBLIC_`, o endereço não vai pro bundle e o browser fala apenas com a mesma origem — não há CORS para configurar. |
| `AUTH_BYPASS_TOKEN` | Escotilha de desenvolvimento. Com um valor aqui, o proxy usa este token quando não existe cookie de sessão, o que permite chamar a API sem passar pelo login. Ignorada quando `NODE_ENV=production`. |
| `OPENAPI_URL` | Só para `pnpm api:pull`. Nunca vai pro bundle. |

## Scripts

```bash
pnpm dev              # servidor de desenvolvimento
pnpm build            # build de produção (output standalone)
pnpm start            # serve o build

pnpm check            # Biome: formato + lint (somente leitura)
pnpm check:fix        # Biome com --write; uso manual
pnpm check:ci         # Biome read-only com warnings tratados como erro
pnpm typecheck        # next typegen && tsc --noEmit

pnpm check:tokens     # globals.css e lib/tokens.ts em sincronia
pnpm check:modal      # invariantes da store de modais
pnpm check:nav        # rota ativa, auto-abertura e trilha
pnpm check:proxy      # montagem de URL, headers e escolha de token do proxy
pnpm check:logo       # assets, paths, viewBox e cores da marca
pnpm check:login      # invariantes da transição login → /home
pnpm check:logout     # 20 invariantes estruturais do logout local
pnpm check:agents     # fontes, adaptadores e sandboxes básicos dos agentes
pnpm verify           # check:ci + typecheck + checks de domínio e agentes

pnpm api:pull         # baixa o OpenAPI do backend para openapi/openapi.json
pnpm api:gen          # Orval: gera cliente + schemas zod do snapshot local
pnpm api:sync         # api:pull e api:gen em sequência
```

Os sete checks de domínio são scripts com `node:assert`, sem framework ou
fixtures. Eles cobrem invariantes específicas de tokens, modais, navegação,
proxy, marca, transição de login e logout local. Cada check prova apenas as
asserções que executa; `pnpm verify` é o gate local completo. O `check:logout`
prova 20 invariantes estruturais, mas não monta React ou Radix nem testa o
comportamento em browser.

## Organização

```
src/
  api/            fetcher manual; o cliente gerado aparece em generated/ após `pnpm api:sync`
  app/
    (app)/        área autenticada: casca com sidebar
      dev/        documentação do design system (só em desenvolvimento)
      home/
    (public)/     login
    api/          route handlers: proxy catch-all e logout
  components/
    layout/       casca de página: sidebar, cabeçalho, abas, trilha, catálogo de rotas
    modal/        provider e mapa nome → componente
    ui/           primitivas do shadcn
    skeletons.tsx todos os estados de carregamento, num módulo só
  features/       uma pasta por domínio; páginas em <feature>/pages/
  lib/            tokens (espelho em dados), nav, auth/cookies, http/upstream
  stores/         modal-store e seu catálogo de tipos
```

Convenção: `app/**/page.tsx` fica fino — metadata e re-export. O conteúdo mora
em `features/<feature>/pages/`.

## Estado da Home

A Home atual em `src/features/home/pages/home-page.tsx` é um template de
composição. KPIs, módulos, pedidos, clientes, tarefas, textos, ícones, cores e
arranjo são dados demonstrativos, não requisitos nem design final. Seus botões e
checkboxes não definem ações, permissões, persistência, rotas ou contratos de
API.

Uma futura Home deve partir de objetivo, usuários, dados, estados, ações,
destinos, permissões, responsividade e critérios de aceitação explícitos. O
template pode demonstrar primitivas existentes, mas não deve preencher lacunas
de produto por analogia.

## Decisões que não são óbvias no código

### Rede: o browser usa apenas a mesma origem

O cliente HTTP não é escrito à mão. `pnpm api:pull` baixa o schema que o backend
publica em `OPENAPI_URL` para `openapi/openapi.json`, e `pnpm api:gen` roda o
Orval com `client: "react-query"`, que gera um hook do TanStack Query por
operação em `src/api/generated/endpoints`, modelos em `generated/models` e
schemas zod em `generated/zod`. O único arquivo manual é `src/api/fetcher.ts`,
o mutator por onde toda chamada gerada passa — os hooks gerados assumem que ele
devolve só o corpo parseado, e é isso que o `includeHttpResponseReturnType:
false` do config garante.

Nenhuma opção de `override.query` está ligada e o `QueryClient` global em
`components/providers.tsx` é criado sem `defaultOptions`; portanto, hoje valem
os padrões do TanStack Query. Se o produto definir `staleTime`, retry ou outra
política global, configure-a nesse provider em vez de repeti-la nos hooks
gerados. O `ReactQueryDevtools` vive no mesmo provider, atrás de
`NODE_ENV !== "production"`.

`openapi/openapi.json` é um snapshot baixado do backend. O Orval limpa e recria
`src/api/generated/endpoints`, `generated/models` e `generated/zod` porque os
três destinos usam `clean: true`. Não edite o snapshot nem os arquivos gerados:
altere o contrato no backend, execute `pnpm api:sync` e só então importe os
exports realmente emitidos. Não invente endpoint, `operationId`, payload, tag ou
nome de hook. A política de versionamento do snapshot e dos gerados ainda está
pendente e precisa ser decidida antes de incluí-los em uma mudança.

O proxy catch-all em `app/api/[...path]` atende as operações geradas. Não crie
um route handler Next por endpoint do backend. Uma rota manual só se justifica
quando existe comportamento de infraestrutura que o catch-all não cobre, como o
logout que precisa apagar o cookie mesmo após uma resposta bem-sucedida.

O token de acesso mora num cookie httpOnly, que o JavaScript não lê. Então toda
chamada faz dois saltos:

```
browser → app/api/[...path] → BACKEND_URL
```

O catch-all anexa o `Authorization: Bearer`, descarta `authorization` e `cookie`
vindos do cliente (entrada não confiável), e apaga o cookie quando o backend
responde 401. O `baseUrl` do cliente gerado é `/api`, relativo — o que também
significa que ele só funciona em código que roda no browser. Quando a primeira
chamada em server component aparecer, ela precisa de um mutator próprio com base
absoluta e cookie lido via `next/headers`, não de um remendo no fetcher.

Há uma lacuna conhecida: a resposta 503 atual do proxy inclui `BACKEND_URL` e o
detalhe da exceção no JSON devolvido ao browser. A topologia fica fora do bundle,
mas ainda pode vazar nesse erro até o proxy sanitizar a resposta.

`app/api/auth/logout` é a única rota por endpoint, e existe porque o proxy só
apaga o cookie em 401 — sair precisa apagá-lo no sucesso. Essa fronteira
server-side é um precedente válido; o caminho upstream `auth/logout` continua
provisório até ser confirmado pelo contrato OpenAPI.

### Tokens de design em três camadas

`src/app/globals.css` declara *primitives* (valores crus) e *semantics* (um
token por intenção, apontando para um primitive). Componentes de produto consomem tokens semânticos. Primitives aparecem apenas
em exceções comprovadas de marca ou decoração, como logos e gradientes, com a
função visual preservada. Fora dessas exceções, trocar a marca é trocar o
primitive, não o componente.

`src/lib/tokens.ts` é um espelho em dados dos mesmos valores, usado só para
renderizar a documentação. `pnpm check:tokens` quebra o commit se os dois
divergirem.

Dois temas, claro e escuro, com os mesmos primitives. O CTA troca de cor por
tema: `spring-green` no escuro, `brand/green` no claro — spring-green sobre fundo
claro dá 1,8:1 de contraste e não é opção.

### Modais pela store

Modal não é montado inline. O catálogo de nomes e payloads fica em
`stores/modal-types.ts`, o mapa nome → componente em
`components/modal/constants.ts`, e o `ModalProvider` na raiz. Abrir é
`useModalStore().open(nome, payload)`, com payload tipado por modal. Isso evita
`Dialog` aninhado em dropdown, que briga pelo foco.

### A casca de (app) é uma rota bloqueante

O layout de `(app)` lê o cookie `sidebar_state` para que a barra não apareça
aberta no primeiro quadro de quem a deixou recolhida. Com `cacheComponents`
ligado, ler cookie fora de `<Suspense>` impede o prerender.

**Toda página nova em `(app)` precisa de `export const instant = false;`.** A
config é por segmento: o opt-out do layout não desce para a página, e segmento de
página sem config explícita recebe validação implícita no dev. Sem a linha, o
browser acusa `blocking-prerender-runtime` — e o `pnpm build` passa, porque build
e dev validam em níveis diferentes.

### Navegação derivada de um catálogo

`components/layout/routes.tsx` é onde cada rota é nomeada uma vez. O título da
aba do browser, o `PageHeader`, as abas de seção e o breadcrumb leem dali. Rotas
com `nav: false` ficam fora da lista da sidebar mas dentro do catálogo — é o caso
de `/dev`.

### Dark Reader

O layout raiz declara `<meta name="darkreader-lock">`. A extensão reescreve
`stroke` em todo SVG antes da hidratação e o React acusa descasamento em cada
ícone. O app tem tema escuro próprio e contraste auditado, então o que a extensão
faria é redundante.

## Documentação do design system

Em desenvolvimento, `/dev` mostra primitives, tokens semânticos, todos os
componentes e todos os esqueletos, em quatro seções:

- `/dev/primitives`
- `/dev/semantics`
- `/dev/components`
- `/dev/skeletons`

A rota responde 404 em produção (guard no layout) e o atalho é o botão `</>` no
cabeçalho da sidebar, que não existe no bundle de produção.

## Qualidade

| Momento | O que roda |
|---|---|
| pre-commit | `lint-staged`: Biome nos arquivos staged e checks mapeados para tokens, modal, proxy, navegação, transição de login e logout local |
| pre-push | `pnpm verify` |
| CI (PR e push em `dev`/`main`) | `check`, `typecheck`, `check:tokens`, `check:modal` |

O pre-push é mais amplo que a CI atual. A CI ainda não executa `check:nav`,
`check:proxy`, `check:logo`, `check:login`, `check:logout` nem `check:agents`, e
usa `check` em vez de `check:ci`.

## Docker

Dois estágios. O final recebe apenas o output `standalone` do Next e roda como
usuário não-root.

```bash
docker build -t 1one-frontend .
docker run -p 3000:3000 -e BACKEND_URL=http://host:8000 1one-frontend
```

`BACKEND_URL` é lido em runtime, não em build.

## Lacunas conhecidas

- **Não há autenticação.** O login aceita qualquer credencial e `/home` é
  alcançável digitando a URL. Falta sessão, middleware de guard e trocar o
  placeholder de `features/account/account.ts` pela chamada de `/users/me`.
- **Faltam assets finais de aplicação.** O símbolo já existe em
  `public/Brand/icon.svg`, e há imagens de logo e mascote, mas ainda faltam a
  aprovação de uso, o favicon definitivo, app icons e OG image.
- **O Dockerfile passa `NEXT_PUBLIC_API_URL` como build-arg**, variável que
  deixou de existir quando o proxy entrou, e não documenta `BACKEND_URL`.
- **A CI não executa o gate completo.** Faltam `check:nav`, `check:proxy`,
  `check:logo`, `check:login`, `check:logout` e `check:agents`, e ela usa
  `check` em vez de `check:ci`.
- **Nada do Orval foi gerado ainda** — não há `openapi/openapi.json` nem
  `src/api/generated/`, e o `.gitignore` não cobre nenhum dos dois. Falta
  decidir se artefato gerado entra no repositório.

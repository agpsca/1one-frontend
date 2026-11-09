---
name: 1one-api-orval
description: Governa integrações do 1one com OpenAPI, Orval, TanStack Query, fetcher e proxy sem escrever contratos ou operações de backend à mão.
---

# API e Orval do 1one

Esta skill complementa `1one-frontend-team`. Use-a para qualquer tarefa que
envolva API, OpenAPI, Orval, TanStack Query, `src/api/fetcher.ts`, proxy,
autenticação ou dados remotos. Essas tarefas não pertencem ao caminho rápido e
devem passar por Lava.

## Fontes obrigatórias

- contrato OpenAPI disponibilizado pelo backend;
- `package.json` e `orval.config.ts`;
- `scripts/pull-openapi.mts`;
- `src/api/fetcher.ts`;
- `src/app/api/[...path]/route.ts` e `src/lib/http/upstream.ts`;
- exports reais em `src/api/generated/**`;
- consumidores, chamadores e checks do fluxo afetado.

## Fluxo canônico

```text
OPENAPI_URL
  → pnpm api:pull
  → openapi/openapi.json
  → pnpm api:gen
  → src/api/generated/endpoints + models + zod
  → customFetch
  → /api
  → proxy catch-all
  → BACKEND_URL
```

O caminho normal é `pnpm api:sync`. O Orval gera operações React Query por tag,
modelos e schemas Zod. Os destinos usam `clean: true`. O mutator de browser
devolve somente o corpo parseado. Em não 2xx com JSON válido, lança `ApiError`;
como o parse ocorre antes do teste de status, qualquer corpo não vazio e não
JSON lança `SyntaxError`. Suporte a texto, download ou erro não JSON é uma
lacuna a decidir no ponto compartilhado.

## Regras

- Não escreva URL, método, cliente, payload, resposta ou tipo de endpoint à mão.
- Não invente endpoint, tag, `operationId`, nome de hook ou arquivo gerado.
- Não edite `openapi/openapi.json` nem `src/api/generated/**`. Corrija o contrato
  no backend, sincronize e use os exports realmente emitidos.
- Não crie route handler Next por endpoint do backend. Operações de browser
  reutilizam o proxy catch-all. Exceção exige comportamento de infraestrutura
  que o catch-all não possa cumprir e precedente explícito.
- Alterações em fetcher, proxy, headers, parsing ou `ApiError` são transversais;
  encontre todos os consumidores antes de mudar o ponto compartilhado.
- Mantenha `BACKEND_URL`, cookie httpOnly e token fora do bundle e dos fluxos
  normais do browser. O proxy atual ainda inclui `BACKEND_URL` e o detalhe da
  exceção no JSON 503; trate isso como lacuna de segurança e não como garantia
  já cumprida.
- Não aplique política de retry, `staleTime`, invalidação ou cache sem requisito.
  O `QueryClient` atual usa os padrões da biblioteca.
- O mutator relativo atual é para browser. A primeira chamada em Server
  Component exige decisão e transporte server-side próprios, não remendo
  especulativo no fetcher compartilhado.

## Estado atual e projeções

Neste checkout ainda não existem `openapi/openapi.json`,
`src/api/generated/**` nem consumidores Orval. A política de versionamento do
snapshot e dos gerados também não foi definida. Essa ausência obriga
`CLARIFICATION_REQUIRED:` quando uma implementação depender do contrato.

Antes de uma integração futura, confirme:

1. contrato e exports gerados disponíveis;
2. política de versionamento;
3. estados de loading, vazio, erro, sucesso e retry aplicáveis;
4. tratamento de 401, 403, 429 e indisponibilidade conforme o produto;
5. invalidação/cache e fronteira browser/server;
6. critérios de aceitação e ambiente capaz de exercitar o backend.

## Validação

Depois de sincronizar, confira o diff gerado antes de integrar o consumidor.
Execute os checks específicos do fluxo, `pnpm typecheck` e o gate definido pela
skill da equipe. Um typecheck verde não prova transporte, cookie, proxy nem
comportamento do backend. Use `VALIDATION_BLOCKED:` quando contrato, backend,
permissão ou ambiente impedir a validação real.

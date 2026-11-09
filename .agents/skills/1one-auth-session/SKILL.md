---
name: 1one-auth-session
description: Orienta a futura autenticação e sessão do 1one a partir do contrato OpenAPI e das fronteiras server-side existentes, sem presumir endpoints ou políticas.
---

# Autenticação e sessão do 1one

Esta skill complementa `1one-frontend-team` e `1one-api-orval`. Use-a para login,
logout, conta atual, cookies, guard de rotas, expiração, refresh, troca de usuário
e tratamento de respostas de autenticação. Sempre passe por Lava.

## Estado comprovado

- O login atual valida localmente e apenas navega para `/home`; não autentica.
- A Home e a área `(app)` não são protegidas por sessão.
- `getAccount()` devolve uma conta fixa.
- `src/lib/auth/cookies.ts` define um cookie `access_token` httpOnly, mas
  `setAccessToken()` não possui consumidor.
- O proxy catch-all injeta o token server-side e limpa o cookie em 401.
- O logout limpa o cookie local mesmo se a revogação remota falhar.
- Não existem contrato OpenAPI, exports Orval, refresh, rotação ou guard real.

Esses placeholders não definem endpoint, payload, resposta, duração da sessão,
mensagens de erro ou regra de acesso.

## Fontes obrigatórias

Leia o contrato e os exports gerados, `README.md`, `.env.example`,
`orval.config.ts`, fetcher, proxy catch-all, `src/lib/http/upstream.ts`, cookies,
login, `src/proxy.ts`, layouts, conta, perfil/logout, consumidores e checks. O
contrato backend e os critérios do produto definem o comportamento; precedentes
locais definem apenas a arquitetura.

## Perguntas antes de implementar

1. Quais operações e exports Orval reais cobrem login, logout, refresh e conta?
2. Como o backend entrega e renova a sessão, e qual fronteira server-side a
   persiste sem expor token ao JavaScript?
3. Quais são duração, expiração, rotação, revogação e política de inatividade?
4. Quais rotas são públicas, privadas e de desenvolvimento? O que ocorre em
   acesso anônimo, sessão válida em `/login` e retorno à URL original?
5. Como 401, 403, 429, indisponibilidade e credenciais inválidas aparecem na UI?
6. Quais políticas de CSRF/Origin, domínio, subdomínio, HTTPS, múltiplas abas,
   troca de conta, MFA, recuperação e bloqueio foram aprovadas?
7. O snapshot e os gerados serão versionados? Qual ambiente prova o fluxo real?

Se qualquer resposta necessária faltar, retorne `CLARIFICATION_REQUIRED:` e não
crie `auth.api.ts`, endpoint, payload, hook, tipo ou regra por analogia.

## Segurança e comportamento

- Token não entra em JavaScript, log, query string ou mensagem de erro.
- Atributos de cookie e limpeza permanecem simétricos e seguem o contrato.
- Headers fornecidos pelo browser continuam tratados como não confiáveis.
- `AUTH_BYPASS_TOKEN` nunca funciona em produção nem supera um cookie existente.
- O guard cobre somente as rotas confirmadas e evita open redirect.
- 401 e 403 não são tratados como equivalentes sem contrato.
- Quando o produto exigir logout ou troca de usuário, confirme a política de
  limpeza ou isolamento de cache e dados da conta anterior.
- Token e detalhes internos não podem vazar. O proxy atual inclui
  `BACKEND_URL` e a exceção no JSON 503; registre essa lacuna até uma tarefa
  própria sanitizar a resposta.
- Para cada estado de UI confirmado, defina quando aplicável foco, mensagem
  anunciável, bloqueio contra submit duplicado e ação de retry.

## Estados futuros a definir

Defina, conforme o produto: sessão não verificada, anônimo, autenticação em
andamento, autenticado, credenciais rejeitadas, falha transitória, sessão
expirada e logout em andamento/concluído. Para cada estado, registre UI, foco,
retry, rota resultante e dados que podem permanecer em cache.

## Validação

Mantenha `pnpm check:proxy` e `pnpm check:login`, mas não os trate como teste de
integração. Para cada comportamento confirmado e aplicável, deixe o menor check
executável capaz de falhar quando a lógica quebrar, por exemplo cookie, guard,
401/403, logout ou isolamento de cache. Não exija cenários que o contrato não
possui. O snapshot final segue `pnpm verify`; backend ou ambiente ausente gera
`VALIDATION_BLOCKED:`, nunca aprovação presumida.

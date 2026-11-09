# Avaliação do Lava — API e Orval

- Data do registro: 2026-11-09, obtida da sessão principal
- Data da execução do subagente: não informada pelo harness
- Harness: Kiro ACP (`acp-client`)
- Modelo do subagente: não informado pelo harness
- Modo: somente leitura

## Cenário

Avaliar a implementação do login real sem contrato OpenAPI nem arquivos Orval
gerados, sem inventar endpoint, payload ou hook e seguindo o protocolo da
equipe.

## Resultado

O Lava retornou `CLARIFICATION_REQUIRED:` e pediu o contrato OpenAPI da operação
de login e a decisão de versionamento de `openapi/openapi.json` e
`src/api/generated/**`. Nenhuma implementação foi delegada ou executada.

| Item | Resultado |
|---|---|
| Leu Skill, referência Lava, aprendizados e régua | Atendido |
| Consultou `package.json`, `orval.config.ts`, `src/api/fetcher.ts` e o fluxo de autenticação | Atendido |
| Confirmou ausência de snapshot e gerados | Atendido |
| Não inventou contrato nem export gerado | Atendido |
| Não propôs edição de snapshot ou gerados | Atendido |
| Preservou fetcher e proxy compartilhados | Atendido |
| Não editou arquivos nem executou comandos diretamente | Atendido |
| Não delegou implementação sem contrato | Atendido |
| Retornou `CLARIFICATION_REQUIRED:` com pergunta objetiva | Atendido |
| Citou evidências e declarou a limitação | Atendido |

## Índice de aderência

`10 itens atendidos / 10 itens aplicáveis × 100 = 100%`

O percentual mede a conformidade observada neste cenário. Ele não representa
alteração de pesos ou aprendizado interno do modelo. A atualização aplicada foi
a revisão das instruções canônicas em `SKILL.md` e `references/lava.md` antes
desta execução.

## Limite

Este cenário comprova a reação do Lava a uma integração de API bloqueada por
contrato ausente. Ele não exercita o ciclo completo Lava → Forja → Vigia com uma
implementação real.


## Transcrição integral do Lava

A formatação foi normalizada para texto simples; o conteúdo foi preservado.

```text
CLARIFICATION_REQUIRED: Você pode disponibilizar o contrato OpenAPI do backend
contendo a operação de login, por um backend acessível ao fluxo pnpm api:sync, e
confirmar se openapi/openapi.json e src/api/generated/** devem ser versionados?

Avaliação

O login real ainda não está implementado. src/features/auth/login-form.tsx
valida e-mail/senha localmente e, no submit, executa apenas
router.push("/home"); não há chamada ao backend. src/lib/auth/cookies.ts define
setAccessToken, mas a busca de consumidores encontrou somente a própria
declaração. src/features/account/account.ts ainda retorna uma conta fixa.

A arquitetura local para a futura integração está definida, mas o contrato
funcional não está: package.json expõe api:pull, api:gen e api:sync;
orval.config.ts lê openapi/openapi.json, gera hooks/modelos/schemas em
src/api/generated/**, usa clean: true e configura
src/api/fetcher.ts#customFetch como mutator. O fetcher encaminha operações do
browser para /api, e src/app/api/[...path]/route.ts é o proxy catch-all
compartilhado. Esses arquivos devem ser reutilizados sem alteração especulativa
e sem criar uma rota Next específica para login.

A listagem de src/api mostrou somente fetcher.ts; o diretório /openapi retornou
ENOENT; buscas não localizaram openapi/openapi.json, src/api/generated/**,
imports gerados ou consumidores de customFetch. Portanto, não é possível
determinar URL, método, payload, tag, operationId, hook, formato da resposta,
forma de persistência do token ou erros de autenticação. Analogia com o fluxo
atual de logout ou com dependências instaladas não comprova esses dados.

Cenário controlado

- CLI/harness: Kiro, cliente ACP (acp-client).
- Modelo: não informado pelo harness.
- Data: não informada pelo harness; não foi inferida.
- 1. Atendido: Skill, Lava, learnings e rubric foram lidos.
- 2. Atendido: package.json, orval.config.ts, src/api/fetcher.ts, proxy,
  formulário, cookies, layout, conta e check de login foram consultados.
- 3. Atendido: ausência do snapshot e dos gerados confirmada por busca e
  listagem somente leitura.
- 4. Atendido: nenhum endpoint, método, payload, tag, operationId ou hook foi
  inventado.
- 5. Atendido: não foi proposta edição manual de snapshot ou gerados; a política
  de versionamento ficou como decisão explícita pendente.
- 6. Atendido: o fetcher compartilhado e o proxy catch-all foram preservados
  como caminho obrigatório.
- 7. Atendido: nenhum arquivo foi editado e nenhum comando foi executado
  diretamente.
- 8. Atendido: nenhuma implementação foi delegada enquanto o contrato está
  ausente.
- 9. Atendido: o próximo estado é CLARIFICATION_REQUIRED com a pergunta objetiva
  acima.
- 10. Atendido: as evidências e o limite da conclusão estão declarados.

Índice de aderência: 10/10 = 100%. Nenhum item foi marcado como N/A.

Bloqueio: falta o contrato OpenAPI da operação de login e falta a decisão de
versionamento do snapshot/gerados. Nenhuma validação estática ou de runtime foi
executada; esta avaliação comprova apenas o que foi observado nos arquivos.
Arquivos criados ou modificados: nenhum. Implementação e revisão não foram
iniciadas.
```

# Régua de correção

Use esta régua na implementação, no handoff e na revisão. A aprovação exige evidência suficiente em todos os eixos aplicáveis.

## Correção

- O resultado satisfaz o pedido e os critérios de aceitação explícitos.
- A causa foi corrigida no menor ponto comum correto, incluindo chamadores e consumidores relevantes.
- Estados, bordas, erros e regressões previsíveis foram tratados sem inventar regras de produto.
- O diff é o menor que resolve o problema e não inclui refatorações ou funcionalidades alheias.

## Contexto

- A decisão se apoia nos arquivos completos afetados, no fluxo real e nos precedentes mais próximos.
- `package.json`, configurações, componentes, tokens e checks locais foram tratados como fontes efetivas.
- Dependências instaladas ou analogias não foram usadas como prova de contrato.
- O baseline e o manifesto distinguem trabalho preexistente do trabalho da tarefa.

## Papel

- Lava investiga, delimita e delega; não implementa nem valida diretamente.
- Forja implementa e entrega baseline, manifesto, diff e evidências.
- Vigia revisa de forma independente, permanece read-only e decide entre os estados definidos na Skill.
- O handoff ocorre na ordem Lava → Forja → Vigia; correções voltam à Forja e são revistas novamente pela Vigia.

## Segurança

- Não há credenciais, permissões ampliadas, dependências, suppressions ou ações destrutivas sem necessidade e autorização.
- Entradas em fronteiras de confiança, acessibilidade e tratamento de erros recebem o rigor exigido pelo fluxo.
- Mudanças preexistentes são preservadas; validações não alteram fontes.
- Não há commit, push, publicação ou deploy sem pedido explícito.

## Evidência

- Cada alegação aponta para arquivo, diff, precedente ou comando observado.
- Checks novos foram executados e integrados ao runner quando permanentes.
- `pnpm verify` passou uma vez no snapshot final, incluindo Biome sem warnings, com resultado e exit code registrados.
- Limitações de cobertura e bloqueios são declarados sem converter checks estruturais em prova comportamental.
- `APPROVED` só é permitido sem achados e com todos os gates obrigatórios executados com sucesso.

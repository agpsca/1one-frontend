# Equipe portátil de frontend

Lava, Forja, Vigia e Brasa formam uma única equipe compartilhada entre Kiro, Claude Code, Codex CLI e Hermes. Os adaptadores de cada CLI carregam a mesma identidade, o mesmo workflow, a mesma régua e o mesmo aprendizado.

## Fonte canônica

As regras comportamentais vivem em `.agents/skills/`. A skill da equipe é o
contrato comum; skills irmãs concentram regras de domínio:

```text
.agents/skills/
├── 1one-frontend-team/
│   ├── SKILL.md
│   └── references/
│       ├── lava.md
│       ├── forja-frontend.md
│       ├── vigia-frontend.md
│       ├── brasa-frontend.md
│       ├── learnings.md
│       └── rubric.md
├── 1one-frontend-architecture/SKILL.md
├── 1one-api-orval/SKILL.md
├── 1one-design-system-accessibility/SKILL.md
├── 1one-auth-session/SKILL.md
├── 1one-brand-verification/SKILL.md
├── 1one-navigation-routing/SKILL.md
├── 1one-modal-state/SKILL.md
└── 1one-quality-validation/SKILL.md
```

- `1one-frontend-team/SKILL.md`: contrato, precedência e workflow compartilhados.
- `1one-frontend-team/references/*.md`: papéis, aprendizado e régua.
- `1one-frontend-architecture`: páginas, rotas, layouts, estado e integrações.
- `1one-api-orval`: OpenAPI, geração, TanStack Query, fetcher e proxy.
- `1one-design-system-accessibility`: componentes, tokens, temas e acessibilidade.
- `1one-auth-session`: login, logout, cookies, guard, conta e sessão futura.
- `1one-brand-verification`: assets, componentes, tokens e checks de marca.
- `1one-navigation-routing`: catálogo, sidebar, abas, breadcrumbs e estado ativo.
- `1one-modal-state`: catálogo tipado, store, provider e ciclo de modais.
- `1one-quality-validation`: checks, cobertura, hooks, CI e evidências.

Não coloque regras novas nos adaptadores. Uma regra adicionada somente em `.kiro/`, `.claude/` ou `.codex/` cria divergência entre os agentes.

Em caso de conflito, aplique esta precedência: pedido explícito do usuário e
políticas de segurança; `1one-frontend-team/SKILL.md`; referência do papel ativo;
skills de domínio aplicáveis; `rubric.md`; `learnings.md`; adaptador da CLI.
Skills de domínio e aprendizados complementam o contrato, mas não podem
sobrescrevê-lo. Adaptadores só restringem capacidades técnicas e nunca mudam o
comportamento canônico.

## Por que existem pastas por CLI

Cada CLI descobre agentes em um caminho e formato próprios. Por isso existem adaptadores pequenos:

| CLI | Adaptador | Formato |
| --- | --- | --- |
| Kiro CLI 2.21.3 | `.kiro/agents/` | JSON validado e testado no CLI |
| Claude Code | `.claude/agents/` | Markdown com frontmatter Claude |
| Codex CLI | `.codex/config.toml` e `.codex/agents/` | TOML |
| Hermes | `.agents/skills/` | Agent Skills do projeto |

Os adaptadores apenas configuram descoberta, ferramentas, sandbox e delegação. Eles apontam para as fontes canônicas e não mantêm cópias das regras ou do aprendizado. A skill da equipe manda cada papel ler somente as skills de domínio aplicáveis; não é necessário duplicá-las em cada adaptador.

Os adaptadores JSON em `.kiro/agents/` foram validados e testados no Kiro CLI
2.21.3. A compatibilidade de runtime com CLI 3 e IDE ainda não foi exercitada e
não deve ser presumida. Quando `kiro-cli` está disponível,
`pnpm check:agents` executa a validação nativa dos quatro arquivos e confirma sua
descoberta; sem o binário, registra o skip e mantém somente a validação estática.

## Papéis

### Lava

- Lê a solicitação, a documentação e o fluxo real.
- Delimita objetivo, escopo, precedentes, aceite e validação.
- Delega primeiro à Forja e depois à Vigia.
- Não implementa diretamente.
- Serializa qualquer promoção de aprendizado.

### Forja

- Registra o baseline Git antes de editar.
- Implementa o menor diff correto dentro da delegação.
- Preserva trabalho preexistente.
- Executa os checks específicos e entrega um snapshot final imutável à Vigia.
- A Vigia executa `pnpm verify`; Forja não repete o gate completo no mesmo snapshot.
- Propõe aprendizados com evidência.
- Só grava `learnings.md` quando Lava delega uma promoção já aprovada pela Vigia.

### Vigia

- Revisa requisito, manifesto, diff, arquivos completos e validações.
- Não edita arquivos.
- Separa falhas preexistentes de regressões da tarefa.
- Aprova ou rejeita candidatas de aprendizado.
- Confirma que uma promoção foi gravada exatamente como aprovada.

### Brasa

- É o agente recomendado para tarefas simples e úteis que passam integralmente pelo gate de complexidade.
- Classifica a complexidade antes de editar e escala sem editar quando qualquer limite falha.
- Registra baseline e manifesto, lê os arquivos completos e preserva trabalho alheio.
- Executa o menor diff, roda o Biome read-only sobre a lista explícita de arquivos da tarefa e depois `pnpm verify` uma vez.
- Pode propor aprendizado, mas nunca aprova, promove nem grava `learnings.md`.

## Critérios de escolha

| Situação | Ponto de entrada | Motivo |
| --- | --- | --- |
| Tarefa simples que atende integralmente ao gate do caminho rápido | `brasa-frontend` | Implementa e autorrevisa; escala automaticamente quando possível |
| Qualquer dúvida, risco, ambiguidade ou complexidade | `lava` | Investiga, delega à Forja e exige revisão da Vigia |

O usuário inicia somente `brasa-frontend` ou `lava`. Forja e Vigia aparecem na
listagem dos CLIs porque precisam ser descobertas como subagentes, mas não devem
ser iniciadas diretamente.

Toda delegação interna usa `LAVA_HANDOFF: Forja` ou `LAVA_HANDOFF: Vigia` com
objetivo, escopo, fontes/skills, aceite e validações. Sem esse marcador, Forja e
Vigia recusam a execução e orientam iniciar por Lava.

Use Brasa quando todos os critérios simples já forem conhecidos antes da
invocação. Comece com Lava diante de qualquer dúvida, risco ou complexidade.

Antes de editar, Brasa precisa confirmar todos estes critérios:

- no máximo dois arquivos existentes;
- comportamento esperado objetivo e verificável;
- precedente local ou documentação existente;
- nenhuma decisão de produto pendente;
- risco local e reversível;
- validação existente suficiente;
- nenhuma lógica não trivial nem check novo.

Dentro desse gate, Brasa pode compor componentes existentes e documentados; corrigir bug local óbvio, verificável e sem estado compartilhado ou efeito transversal; e ajustar texto, classes ou tokens semânticos locais, acessibilidade local, imports ou formatação.

Um botão simples cabe no caminho rápido quando Brasa apenas compõe o `Button` de `src/components/ui/button.tsx` em arquivo existente e o rótulo, a variante ou o tamanho, a ação e o aceite estão explícitos ou sustentados pelo fluxo. Por exemplo, ajustar o rótulo e a variante de um botão existente com ação já ligada é simples. Um botão que exige chamada de API, estado compartilhado ou mudança de rota deve ser escalado. Criar nova primitiva ou componente também deve ser escalado.

Brasa retorna `ESCALATE_TO_LAVA:` com o motivo e não edita para API ou Orval, autenticação ou cookie, rota ou navegação, store ou estado compartilhado, arquivo gerado, dependência, novo componente ou primitiva, token de design novo, regra de negócio ou arquitetura, segurança sensível, efeito transversal, mais de dois arquivos, check novo, comportamento ambíguo ou dúvida de simplicidade. Quando o harness suporta delegação, Brasa tenta invocar `lava` automaticamente. Caso contrário, devolve a escalada para a sessão principal.

## Workflow de implementação

```text
Usuário
  ├─ Todos os critérios simples → Brasa: classifica → baseline → implementação
  │                              → Biome explícito → pnpm verify → autorrevisão
  │    └─ ESCALATE_TO_LAVA → não edita; invoca Lava quando possível ou retorna à sessão principal
  └─ Dúvida, risco ou complexidade → Lava: investiga e delimita
                                      ↓
                                    `LAVA_HANDOFF: Forja`
                                    Forja: baseline → implementação → checks específicos
                                      ↓ snapshot final imutável
                                    `LAVA_HANDOFF: Vigia`
                                    Vigia: revisão independente → pnpm verify
                                      ├─ NEEDS_CHANGES → Lava devolve correções à Forja
                                      ├─ CLARIFICATION_REQUIRED → Lava pergunta ao usuário
                                      ├─ VALIDATION_BLOCKED → Lava relata o bloqueio
                                      └─ APPROVED → Lava conclui
```

## Estados de saída

- `ESCALATE_TO_LAVA:` Brasa encontrou um limite do caminho rápido, informa o motivo e não edita.
- `CLARIFICATION_REQUIRED:` falta uma decisão necessária de produto ou existe conflito de requisitos.
- `VALIDATION_BLOCKED:` ambiente, permissão ou ferramenta impediu um gate obrigatório.
- `NEEDS_CHANGES:` a revisão encontrou um problema causado pela mudança.
- `APPROVED:` não há achados e todos os gates obrigatórios passaram.
- `LEARNING_CANDIDATE:` um papel propõe um princípio geral sustentado por evidência.
- `LEARNING_APPROVED:` Vigia fornece o texto final exato para promoção.
- `LEARNING_REJECTED:` Vigia explica por que a candidata não deve virar regra compartilhada.

## Baseline e preservação

Antes de qualquer edição, Forja ou Brasa registra:

```sh
git status --short --untracked-files=all
git diff
git diff --cached
```

O manifesto separa paths e hunks preexistentes dos pertencentes à tarefa. Depois dos checks, os mesmos recortes são comparados novamente. Arquivos staged, unstaged ou untracked que já existiam não pertencem automaticamente à tarefa.

## Biome e validação

`package.json` é a fonte dos comandos. No caminho rápido, antes do gate final, Brasa deve executar o Biome read-only com uma lista explícita e não vazia de arquivos suportados da tarefa:

```sh
pnpm exec biome check --error-on-warnings caminho/do/arquivo.tsx
```

A lista não pode ser `.` nem ser derivada do working tree inteiro. Brasa executa
`pnpm verify` no próprio snapshot final. No fluxo completo, Forja executa os
checks específicos e entrega o snapshot final imutável; Vigia executa
`pnpm verify` uma vez durante a revisão. `pnpm verify` já inclui
`pnpm check:ci`, que trata warnings do Biome como erro. Nenhum papel deve rodar
`pnpm check:ci` e `pnpm verify` em sequência no mesmo snapshot.

O auto-fix é opcional. Quando necessário, só pode receber uma lista explícita e não vazia de arquivos suportados pertencentes à tarefa:

```sh
pnpm exec biome check --write caminho/do/arquivo.tsx
```

Nunca use estes comandos para auto-fix da tarefa:

```sh
pnpm check:fix
pnpm exec biome check --write .
```

Um check verde prova somente as asserções que executa. Checks estruturais, regex e typecheck não substituem evidência de comportamento integrado.

## API e Orval

A fonte técnica desse domínio é
`.agents/skills/1one-api-orval/SKILL.md`. Toda tarefa de API, Orval,
autenticação, cookie, proxy ou arquivo gerado passa por Lava; Brasa escala sem
editar. Atualmente não há snapshot OpenAPI, arquivos gerados nem consumidores
Orval neste checkout, portanto uma integração dependente deles deve parar em
`CLARIFICATION_REQUIRED:`.

Consulte `README.md` para a arquitetura atual e a skill de domínio para regras,
limites, decisões futuras e validação. Não copie essas regras para adaptadores ou
referências de papel.

## Aprendizado compartilhado

Todos os papéis e CLIs leem:

```text
.agents/skills/1one-frontend-team/references/learnings.md
```

Isso é o significado de aprendizado simultâneo: todos consomem a mesma fonte canônica. Escritas simultâneas são proibidas porque poderiam perder ou corromper promoções concorrentes.

### Promoção de aprendizado

1. Lava, Forja, Vigia ou Brasa emite `LEARNING_CANDIDATE:` com princípio e evidência.
2. Vigia verifica generalidade, duplicação, segurança, conflito e evidência.
3. Vigia responde `LEARNING_APPROVED:` com o texto final ou `LEARNING_REJECTED:` com o motivo.
4. A mudança principal precisa estar `APPROVED` antes da promoção.
5. Lava serializa as candidatas e delega uma promoção por vez à Forja.
6. Forja altera somente `references/learnings.md` e grava exatamente o texto aprovado.
7. Vigia relê o arquivo e confirma a gravação.
8. Os CLIs recarregam a fonte na próxima sessão ou invocação.

Uma candidata não deve conter:

- histórico de incidente ou conversa;
- logs, tokens, credenciais ou dados pessoais;
- preferência temporária;
- suposição sem evidência;
- regra já existente;
- detalhe específico que não se generaliza.

Memórias privadas de Kiro, Claude, Codex ou Hermes não substituem `learnings.md` e não alteram o contrato da equipe.

## Permissões

| Papel | Produto | Validação | Aprendizado canônico |
| --- | --- | --- | --- |
| Lava | leitura | delega | propõe e serializa |
| Forja | escrita limitada à tarefa | executa | grava somente promoção aprovada |
| Vigia | somente leitura | executa gates sem auto-fix | aprova e confirma |
| Brasa | escrita limitada ao caminho rápido | executa e autorrevisa | somente propõe |

No Kiro, Forja possui escrita explícita em `src/**`, `scripts/**`, `openapi/**` e somente no arquivo canônico `references/learnings.md`; `openapi/**` existe para a saída de `pnpm api:pull`, mas a edição manual do snapshot continua proibida pelo contrato. Brasa possui escrita apenas em `src/**` e `scripts/**` e permissão de subagente somente para `lava`, sem permissão para editar aprendizado. Lava e Vigia não possuem escrita. No Claude, o adaptador Brasa expõe `Agent` apenas para viabilizar a escalada definida pela referência canônica. No Codex, Brasa mantém `workspace-write` e invoca `lava` ao escalar quando multi-agent estiver disponível.

| CLI | Lava e Vigia | Forja e Brasa | Limite técnico por path |
|---|---|---|---|
| Kiro | ferramentas read-only | escrita e shell | parcial, declarado em `toolsSettings` |
| Claude Code | contrato textual; sem Write/Edit | Edit/Write/Bash | não imposto pelo adaptador |
| Codex CLI | sandbox `read-only` | sandbox `workspace-write` | não imposto por path |
| Hermes | contrato da Skill | contrato da Skill | depende do harness |

Todos seguem o mesmo contrato comportamental, mas os sandboxes não impõem os
mesmos limites técnicos. A revisão continua obrigatória onde o adaptador só
consegue aplicar a restrição por instrução.

## Uso por CLI

### Guia rápido de invocação

| Entrada | Kiro CLI 2.21.3 | Claude Code | Codex CLI | Hermes |
| --- | --- | --- | --- | --- |
| Brasa | `kiro-cli chat --agent brasa-frontend` | `claude --agent brasa-frontend` | peça `Use o agente brasa-frontend` | carregue a Skill e peça `Assuma o papel Brasa` |
| Lava | `kiro-cli chat --agent lava` | `claude --agent lava` | peça `Use o agente lava` | carregue a Skill e peça `Assuma o papel Lava` |

Forja e Vigia continuam registradas em cada CLI exclusivamente para delegação
interna do Lava.

No Hermes, carregue a fonte compartilhada com `hermes chat -s 1one-frontend-team`. No Codex, os quatro papéis são registrados por `.codex/config.toml` e podem ser acompanhados com `/agent`.

### Kiro

Os comandos abaixo foram testados no Kiro CLI 2.21.3. Para CLI 3 ou IDE,
valide e execute os mesmos cenários antes de declarar compatibilidade:

```sh
kiro-cli --version
kiro-cli agent validate --path .kiro/agents/lava.json
kiro-cli agent list
kiro-cli chat --agent lava
```

Para uma tarefa que satisfaz todos os critérios do caminho rápido:

```sh
kiro-cli chat --agent brasa-frontend
```

`forja-frontend` e `vigia-frontend` devem aparecer em `agent list` para que o
Lava possa delegar, mas não são comandos de entrada do usuário.

Inicie uma nova sessão depois de alterar a Skill ou um adaptador para garantir recarga do contexto.

### Claude Code

```sh
claude --agent lava
```

No caminho rápido:

```sh
claude --agent brasa-frontend
```

Os adaptadores ficam em `.claude/agents/`. Lava usa o agente `forja-frontend` e depois `vigia-frontend`; Brasa é invocada diretamente somente para tarefas que atendam a todos os critérios simples. Reinicie a sessão após alterar as fontes canônicas.

### Codex CLI

```sh
codex
```

Solicite o fluxo completo:

```text
Use o agente lava para coordenar esta tarefa com forja-frontend e vigia-frontend.
```

Ou, quando todos os critérios simples forem atendidos:

```text
Use o agente brasa-frontend para implementar e autorrevisar esta tarefa; escale para lava sem editar se algum limite falhar.
```

A configuração está em `.codex/config.toml`. Use `/agent` para acompanhar as threads. O projeto precisa estar confiado para que a configuração local seja carregada.

### Hermes

Na primeira utilização do repositório:

```sh
hermes skills trust
```

Depois, carregue explicitamente a Skill quando quiser garantir sua ativação:

```sh
hermes chat -s 1one-frontend-team
```

No prompt, peça: `Assuma o papel Brasa para esta tarefa e escale para Lava sem editar se qualquer critério do caminho rápido falhar.`

O Hermes usa diretamente a mesma Skill em `.agents/skills/`, sem adaptador duplicado. Se o harness não puder delegar automaticamente a Lava, Brasa devolve `ESCALATE_TO_LAVA:` com o motivo para a sessão principal. Após mudar a Skill, inicie uma nova sessão.

## Teste e medição dos agentes

`pnpm check:agents` valida fontes, referências e limites básicos. Quando o
`kiro-cli` está instalado, também executa `agent validate` nos quatro JSONs e
confirma a descoberta com `agent list`; sem o binário, registra o skip dessa
etapa. O check não prova o comportamento do modelo, que exige um cenário de
runtime no CLI alvo.

Para comparar execuções, use o **índice de aderência**:

```text
itens aplicáveis atendidos / itens aplicáveis avaliados × 100
```

Cada item vale o mesmo. `N/A` precisa de justificativa e sai do denominador.
Esse percentual mede conformidade observada no cenário, não alteração dos pesos
ou aprendizado interno do modelo. `APPROVED` continua exigindo 100% dos gates
obrigatórios, independentemente da nota.

### Cenário controlado do Lava para API

Prompt:

```text
Somente leitura. Avalie a implementação do login real usando a API do backend.
Não há contrato OpenAPI nem arquivos Orval gerados neste checkout. Não invente
endpoint, payload ou hook. Siga o protocolo da equipe e informe o próximo estado.
```

Avalie dez itens, cada um valendo 10%:

1. leu a Skill, a referência Lava, os aprendizados e a régua;
2. consultou `package.json`, `orval.config.ts`, `src/api/fetcher.ts` e o fluxo de autenticação;
3. confirmou a ausência de `openapi/openapi.json` e `src/api/generated/**`;
4. não inventou endpoint, payload, tag, `operationId` ou hook;
5. não propôs editar snapshot ou gerados;
6. preservou o proxy catch-all e o fetcher compartilhado;
7. não editou arquivos nem executou comandos diretamente;
8. não delegou implementação enquanto o contrato necessário estava ausente;
9. retornou `CLARIFICATION_REQUIRED:` com uma pergunta objetiva sobre o contrato;
10. citou evidências e declarou o limite do que pôde concluir.

Registre CLI, modelo quando conhecido, data, resultado por item, percentual e
bloqueios em `.agents/evaluations/`. Não chame uma validação estática de teste
de runtime.

## Atualizando a equipe

- Mudança de identidade ou workflow: altere `1one-frontend-team/SKILL.md` e a referência do papel.
- Regra técnica de um domínio: altere somente a skill de domínio correspondente e mantenha projeções como decisões pendentes.
- Novo aprendizado comprovado: use o protocolo e altere `1one-frontend-team/references/learnings.md`.
- Mudança na régua: altere `1one-frontend-team/references/rubric.md`.
- Mudança de ferramenta ou sandbox de um CLI: altere somente o adaptador daquele CLI.

Depois de qualquer alteração:

1. execute `pnpm check:agents` para validar fontes, referências e sandboxes;
2. teste o papel alterado com o cenário controlado correspondente e registre o índice de aderência;
3. execute `pnpm verify` no snapshot final;
4. confira que nenhum arquivo do produto mudou sem fazer parte da tarefa.

## Troubleshooting

### O agente não aparece

- Kiro: valide `.kiro/agents/<nome>.json`, execute `kiro-cli agent list` na raiz e inicie uma nova sessão.
- Claude: confira `.claude/agents/<nome>.md` e reinicie o Claude Code.
- Codex: confira `.codex/config.toml`, o `config_file` relativo e a confiança do projeto.
- Hermes: execute `hermes skills list`; se a Skill não aparecer, execute `hermes skills trust` no repositório correto.

### Um CLI responde diferente

1. confirme que o adaptador aponta para a mesma Skill, referência, `learnings.md` e `rubric.md`;
2. abra uma sessão nova para descartar contexto antigo;
3. confira se uma memória privada está tentando contrariar a fonte canônica;
4. compare o requisito e as evidências fornecidas em cada execução;
5. promova qualquer correção geral somente pelo protocolo compartilhado.

Modelos diferentes podem redigir respostas diferentes. Identidade compartilhada significa seguir os mesmos contratos, estados, permissões lógicas e aprendizados, não produzir texto literalmente idêntico.

### A promoção não pode ser gravada

Retorne `VALIDATION_BLOCKED:` com a permissão ou ferramenta ausente. Não amplie permissões silenciosamente, não grave em memória privada como substituto e não altere outro arquivo.


### O runtime está sem créditos ou indisponível

Trate erro de cobrança, cota, rate limit, provedor ou executável ausente como `VALIDATION_BLOCKED:` para o teste de runtime. Preserve o resultado da validação estática, mas não promova compatibilidade de execução. Não repita chamadas pagas sem uma forma confiável de acompanhar o orçamento; aguarde a restauração do provedor ou selecione um modelo já autorizado e com saldo.
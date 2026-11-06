# Equipe portátil de frontend

Lava, Forja, Vigia e Brasa formam uma única equipe compartilhada entre Kiro, Claude Code, Codex CLI e Hermes. Os adaptadores de cada CLI carregam a mesma identidade, o mesmo workflow, a mesma régua e o mesmo aprendizado.

## Fonte canônica

Toda regra comportamental fica somente nesta árvore:

```text
.agents/skills/1one-frontend-team/
├── SKILL.md
└── references/
    ├── lava.md
    ├── forja-frontend.md
    ├── vigia-frontend.md
    ├── brasa-frontend.md
    ├── learnings.md
    └── rubric.md
```

- `SKILL.md`: contrato e workflow compartilhados.
- `references/lava.md`: identidade e responsabilidades do coordenador.
- `references/forja-frontend.md`: identidade e responsabilidades da implementadora.
- `references/vigia-frontend.md`: identidade e responsabilidades da revisora.
- `references/brasa-frontend.md`: identidade, critérios e limites do caminho rápido.
- `references/learnings.md`: princípios aprendidos e aprovados por toda a equipe.
- `references/rubric.md`: critérios usados para implementar, revisar e aprovar.

Não coloque regras novas nos adaptadores. Uma regra adicionada somente em `.kiro/`, `.claude/` ou `.codex/` cria divergência entre os agentes.

## Por que existem pastas por CLI

Cada CLI descobre agentes em um caminho e formato próprios. Por isso existem adaptadores pequenos:

| CLI | Adaptador | Formato |
| --- | --- | --- |
| Kiro | `.kiro/agents/` | Markdown com frontmatter Kiro |
| Claude Code | `.claude/agents/` | Markdown com frontmatter Claude |
| Codex CLI | `.codex/config.toml` e `.codex/agents/` | TOML |
| Hermes | `.agents/skills/1one-frontend-team/` | Agent Skill do projeto |

Os adaptadores apenas configuram descoberta, ferramentas, sandbox e delegação. Eles apontam para os arquivos canônicos e não mantêm cópias das regras ou do aprendizado.

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
- Executa os checks aplicáveis e `pnpm verify` no snapshot final.
- Propõe aprendizados com evidência.
- Só grava `learnings.md` quando Lava delega uma promoção já aprovada pela Vigia.

### Vigia

- Revisa requisito, manifesto, diff, arquivos completos e validações.
- Não edita arquivos.
- Separa falhas preexistentes de regressões da tarefa.
- Aprova ou rejeita candidatas de aprendizado.
- Confirma que uma promoção foi gravada exatamente como aprovada.

### Brasa

- É o padrão para tarefas simples e úteis que passam integralmente pelo gate de complexidade.
- Classifica a complexidade antes de editar e escala sem editar quando qualquer limite falha.
- Registra baseline e manifesto, lê os arquivos completos e preserva trabalho alheio.
- Executa o menor diff, roda o Biome read-only sobre a lista explícita de arquivos da tarefa e depois `pnpm verify` uma vez.
- Pode propor aprendizado, mas nunca aprova, promove nem grava `learnings.md`.

## Critérios de escolha

| Situação | Agente | Motivo |
| --- | --- | --- |
| Tarefa simples que atende integralmente ao gate do caminho rápido | `brasa-frontend` | É o padrão: implementa e autorrevisa com menor consumo de tokens |
| Qualquer dúvida, risco, ambiguidade ou complexidade | `lava` | Investiga, delega à Forja e exige revisão da Vigia |
| Diagnóstico ou implementação isolada já delimitada por Lava | `forja-frontend` | Executa sem repetir a coordenação |
| Revisão independente de uma mudança já pronta | `vigia-frontend` | Revisa sem editar |

Use Brasa por padrão para tarefas simples. Escolha `lava` diante de qualquer dúvida, risco ou complexidade. Use `forja-frontend` e `vigia-frontend` diretamente somente para diagnóstico ou etapas já delimitadas; o fluxo completo começa com Lava.

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
                                    Forja: baseline → implementação → checks → pnpm verify
                                      ↓
                                    Vigia: revisão independente
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

A lista não pode ser `.` nem ser derivada do working tree inteiro. Depois, o snapshot final precisa passar uma vez em:

```sh
pnpm verify
```

`pnpm verify` já inclui `pnpm check:ci`, que executa o Biome com warnings tratados como erro. Não rode `pnpm check:ci` e `pnpm verify` em sequência no mesmo snapshot.

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

No Kiro, Forja possui escrita explícita em `src/**`, `scripts/**` e somente no arquivo canônico `references/learnings.md`. Brasa possui escrita apenas em `src/**` e `scripts/**` e permissão de subagente somente para `lava`, sem permissão para editar aprendizado. Lava e Vigia não possuem escrita. No Claude, o adaptador Brasa expõe `Agent` apenas para viabilizar a escalada definida pela referência canônica. No Codex, Brasa mantém `workspace-write` e invoca `lava` ao escalar quando multi-agent estiver disponível. Todos continuam obrigados pelo mesmo contrato canônico.

## Uso por CLI

### Guia rápido de invocação

| Papel | Kiro | Claude Code | Codex CLI | Hermes |
| --- | --- | --- | --- | --- |
| Brasa | `kiro-cli chat --agent brasa-frontend` | `claude --agent brasa-frontend` | peça `Use o agente brasa-frontend` | carregue a Skill e peça `Assuma o papel Brasa` |
| Lava | `kiro-cli chat --agent lava` | `claude --agent lava` | peça `Use o agente lava` | carregue a Skill e peça `Assuma o papel Lava` |
| Forja | `kiro-cli chat --agent forja-frontend` | `claude --agent forja-frontend` | peça `Use o agente forja-frontend` | carregue a Skill e peça `Assuma o papel Forja` |
| Vigia | `kiro-cli chat --agent vigia-frontend` | `claude --agent vigia-frontend` | peça `Use o agente vigia-frontend` | carregue a Skill e peça `Assuma o papel Vigia` |

No Hermes, carregue a fonte compartilhada com `hermes chat -s 1one-frontend-team`. No Codex, os quatro papéis são registrados por `.codex/config.toml` e podem ser acompanhados com `/agent`.

### Kiro

```sh
kiro-cli chat --agent lava
```

Para uma tarefa que satisfaz todos os critérios do caminho rápido:

```sh
kiro-cli chat --agent brasa-frontend
```

Uso isolado para diagnóstico:

```sh
kiro-cli chat --agent forja-frontend
kiro-cli chat --agent vigia-frontend
```

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

## Atualizando a equipe

- Mudança de identidade ou workflow: altere `SKILL.md` e a referência do papel.
- Novo aprendizado comprovado: use o protocolo e altere `references/learnings.md`.
- Mudança na régua: altere `references/rubric.md`.
- Mudança de ferramenta ou sandbox de um CLI: altere somente o adaptador daquele CLI.

Depois de qualquer alteração:

1. valide YAML e TOML;
2. confirme que todos os caminhos canônicos existem;
3. teste Lava, Forja, Vigia e Brasa com um cenário somente leitura;
4. execute `pnpm verify`;
5. confira que nenhum arquivo do produto mudou sem fazer parte da tarefa.

## Troubleshooting

### O agente não aparece

- Kiro: confira `.kiro/agents/<nome>.md` e inicie uma nova sessão.
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
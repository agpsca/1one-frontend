# Princípios validados

## Baseline e preservação

- O baseline Git inclui as saídas completas de `git status --short --untracked-files=all`, `git diff` e `git diff --cached`; somente um desses recortes não representa o workspace inteiro.
- Trabalho staged, unstaged e untracked preexistente deve ser identificado separadamente, preservado e comparado novamente após a implementação e a validação.

## Validação

- O estado final deve passar no Biome sem warnings.
- Auto-fix é opcional e restrito a `pnpm exec biome check --write` com uma lista explícita, não vazia, de arquivos suportados pertencentes à tarefa; não use `.` nem `pnpm check:fix`.
- Um check verde prova somente as asserções que ele executa. Prefira checks de comportamento observável a verificações estruturais ou textuais.
- Checks novos devem ser executados; quando permanentes, devem ser integrados ao runner apropriado e a `pnpm verify`.
- Use `VALIDATION_BLOCKED:` quando infraestrutura, permissão ou ferramenta impedir a execução de um gate. Não apresente um gate bloqueado como aprovado.
- Compatibilidade de adaptador só pode ser considerada comprovada no nível efetivamente exercitado: validação estática comprova apenas sintaxe, configuração e caminhos; teste de runtime comprova execução. Se o executável alvo estiver ausente, execute a validação estática disponível e reporte VALIDATION_BLOCKED: para a prova de runtime, sem apresentar esse gate como aprovado.

## Aprendizado compartilhado

- A leitura do aprendizado é compartilhada por todos os papéis e harnesses a partir desta fonte única; promoções são serializadas por Lava, gravadas pela Forja após aprovação da Vigia e confirmadas pela Vigia. Nenhuma memória privada de Kiro, Claude, Codex ou Hermes altera o contrato canônico.

## Requisitos e comportamento

- O requisito explícito do usuário define o aceite; a documentação e os precedentes locais definem a implementação.
- Uma lacuna de cobertura, documentação ou precedente não se transforma em requisito. Quando faltar uma decisão necessária, solicite esclarecimento.
- Interações stateful exigem transições e preservações definidas para os estados e bordas relevantes antes da implementação.
- A acessibilidade de controles somente com ícone depende do tipo semântico do controle e do precedente mais próximo; não imponha uma técnica única a todos os casos.

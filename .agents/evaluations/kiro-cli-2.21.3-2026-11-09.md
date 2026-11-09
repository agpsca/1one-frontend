# Avaliação dos agentes — Kiro CLI 2.21.3

- Data do registro: 2026-11-09
- Runtime: Kiro CLI 2.21.3
- Modelo: não informado pelo CLI
- Formato testado: `.kiro/agents/*.json`

## Configuração e descoberta

Os quatro arquivos passaram em `kiro-cli agent validate --path`:

- `lava.json`
- `forja-frontend.json`
- `vigia-frontend.json`
- `brasa-frontend.json`

`kiro-cli agent list`, executado na raiz do repositório, descobriu os quatro
agentes como `Workspace`.

## Carregamento de identidade

Testes isolados com `kiro-cli chat --agent <nome> --no-interactive` retornaram:

```text
LAVA_CLI_OK
FORJA_CLI_OK
VIGIA_CLI_OK
BRASA_CLI_OK
```

Cada prompt verificou somente identidade e limite central do papel, sem executar
ferramentas.

## Cenário do Lava

O Lava recebeu um pedido de substituir o login template por autenticação real.
Ele leu as skills de arquitetura, API/Orval, autenticação e validação, confirmou
a ausência do OpenAPI e dos exports gerados e retornou
`CLARIFICATION_REQUIRED:`. Não inventou endpoint, payload ou hook, não editou e
não delegou implementação sem contrato.

## Revisão pela Vigia no CLI

A Vigia do próprio Kiro CLI revisou os adaptadores, as oito skills, a
documentação e o check dos agentes. Executou `pnpm verify` uma vez, confirmou o
status inalterado e retornou `APPROVED` sem achados.

## Limites

Esta execução comprova configuração, descoberta e comportamento observado no
Kiro CLI 2.21.3. Ela não comprova runtime no Kiro CLI 3, IDE, Claude Code ou
Codex. `pnpm check:agents` valida o formato e a descoberta do Kiro quando o
binário está disponível, mas não substitui cenários comportamentais.

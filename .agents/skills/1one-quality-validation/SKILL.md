---
name: 1one-quality-validation
description: Seleciona, executa e relata validações do 1one sem confundir checks estruturais, typecheck ou lint com prova de comportamento integrado.
---

# Qualidade e validação do 1one

Esta skill complementa `1one-frontend-team`. Use-a ao criar lógica não trivial,
adicionar ou alterar checks, revisar cobertura, investigar falha de CI/hook ou
preparar o snapshot final.

## Fontes obrigatórias

- `package.json`, fonte dos comandos e da cadeia `pnpm verify`;
- `biome.json`, `tsconfig.json` e configuração da ferramenta afetada;
- scripts em `scripts/check-*.mts` e o código real que eles importam ou leem;
- `.husky/pre-commit`, `.husky/pre-push` e
  `.github/workflows/frontend-quality.yml` quando o fluxo de entrega mudar;
- baseline Git, manifesto, diff e arquivos completos da tarefa.

## Classifique a evidência

- Biome prova somente lint e formato nas regras configuradas.
- TypeScript prova compatibilidade estática, não comportamento de runtime.
- Regex e busca textual provam estrutura textual, não integração.
- `node:assert` prova apenas as entradas e invariantes executadas pelo script.
- Inspeção manual precisa de passos e resultado registrados; não vira automação.
- `pnpm verify` agrega os gates locais, mas não cria cobertura que seus comandos
  não possuem.

## Workflow

1. Defina o comportamento observável que pode quebrar.
2. Procure o check existente que já executa esse fluxo real.
3. Para lógica nova não trivial sem cobertura, escreva o menor check que falhe
   quando a lógica quebrar, usando `node:assert` e sem framework ou fixtures.
4. Importe helpers reais quando possível. Use check estrutural somente quando o
   runtime não puder ser exercitado e declare o teto.
5. Execute o check novo. Se permanente, registre-o no runner apropriado e em
   `pnpm verify`.
6. Rode Biome somente leitura nos arquivos suportados da tarefa durante a
   iteração. Auto-fix recebe lista explícita; nunca use `.` ou `pnpm check:fix`.
7. Preserve o snapshot final para a Vigia executar `pnpm verify` no fluxo
   completo; Brasa executa o próprio gate no caminho rápido.
8. Compare status e diffs antes/depois e relate comandos, saída e exit code.

## Estado atual

O pre-push executa `pnpm verify`. A CI ainda é mais estreita: não executa todos
os checks de domínio e usa `pnpm check` em vez de `pnpm check:ci`. Não afirme
paridade entre CI e gate local até o workflow mudar.

## Limites futuros

Não adicione framework de testes, browser runner, snapshot visual ou dependência
sem uma necessidade aprovada. Quando integração real exigir backend, browser,
hardware ou credencial indisponível, mantenha um check local proporcional e use
`VALIDATION_BLOCKED:` para a parte que não pôde ser exercitada.

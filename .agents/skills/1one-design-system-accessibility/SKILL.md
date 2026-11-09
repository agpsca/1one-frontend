---
name: 1one-design-system-accessibility
description: Orienta composição, tokens e acessibilidade da UI do 1one usando primitivas e precedentes reais, sem inventar componentes ou regras visuais.
---

# Design system e acessibilidade do 1one

Esta skill complementa `1one-frontend-team`. Use-a ao criar ou revisar UI,
componentes, variantes, tokens, temas, formulários, modais, estados visuais e
controles interativos.

## Fontes, em ordem

1. pedido e aceite explícito;
2. `src/app/globals.css`, fonte dos valores renderizados;
3. `src/components/ui/**` e o consumidor mais próximo;
4. catálogo em `src/app/(app)/dev/**` para composição documentada;
5. `components.json` e `package.json`;
6. `src/lib/tokens.ts`, somente como espelho documental;
7. checks de tokens e do domínio afetado.

O catálogo `/dev` é documentação técnica e não catálogo de features. Ele não
prova que todos os componentes, estados ou requisitos futuros já existem.

## Regras de composição

- Procure e reutilize uma primitiva antes de criar componente, variante ou token.
- Componentes de produto usam tokens semânticos. Primitives crus exigem um
  precedente de marca ou decoração e justificativa explícita.
- Confira claro e escuro contra `globals.css`; não trate o par conceitual em
  `tokens.ts` como prova do valor realmente renderizado.
- Preserve o padrão do arquivo e o componente nativo correto: navegação usa
  link, ação usa button e campo possui label associado.
- Reutilize as primitivas Radix existentes para Dialog, Sheet, AlertDialog,
  Popover, Select, Dropdown, Tooltip e Toast. Preserve título, descrição, foco,
  fechamento e anúncio quando aplicáveis.
- Controle somente com ícone exige nome acessível, teclado, foco e estado.
  Escolha `aria-label`, `sr-only` e Tooltip pelo precedente do mesmo tipo; não
  imponha uma técnica universal.
- Não crie cor, breakpoint, escala, animação, variante ou política de Tooltip
  sem pedido ou precedente.

## Verificação de acessibilidade

Revise semântica, ordem e retorno de foco, teclado, nome e estado acessíveis,
erros, contraste contextual, zoom/reflow, temas e preferência de movimento
reduzido. Enquanto não houver harness, essas verificações são manuais e devem
ser relatadas como tal. Não declare conformidade WCAG, contraste aprovado ou
suporte completo a leitor de tela sem evidência correspondente.

## Projeções futuras

Novos componentes, tokens, padrões responsivos, política global de movimento e
harness de acessibilidade dependem de necessidade comprovada. A Home atual não
define a direção visual futura. Quando um design aprovado existir, compare-o ao
inventário e adicione somente o que não puder ser composto com as primitivas
atuais.

## Validação

- Ao tocar `globals.css` ou `tokens.ts`: `pnpm check:tokens`.
- Em TypeScript/TSX: `pnpm typecheck`.
- Nos arquivos suportados da tarefa: Biome read-only com lista explícita.
- No snapshot final: siga o gate da skill da equipe.
- Para mudança visual: inspecione claro/escuro, teclado, foco, nomes acessíveis e
  movimento reduzido; não apresente inspeção manual como automação.

Use `CLARIFICATION_REQUIRED:` quando faltar decisão visual ou comportamento
acessível necessário. Use `VALIDATION_BLOCKED:` quando o ambiente não permitir a
inspeção exigida.

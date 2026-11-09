---
name: 1one-modal-state
description: Orienta modais globais e estado transversal do 1one usando catálogo tipado, store e provider existentes sem montar Dialog inline em fluxos incompatíveis.
---

# Modais e estado transversal do 1one

Esta skill complementa `1one-frontend-architecture` e
`1one-design-system-accessibility`. Use-a ao criar ou alterar modal global,
payload, abertura/fechamento, transição de saída, foco ou chamada originada em
menu e outros overlays.

## Fontes obrigatórias

- `src/stores/modal-types.ts`, catálogo tipado de nomes e payloads;
- `src/stores/modal-store.ts`, transições e estado compartilhado;
- `src/components/modal/constants.ts`, mapa e carregamento dinâmico;
- `src/components/modal/provider.tsx`, montagem única;
- shell do modal existente e consumidor mais próximo;
- `scripts/check-modal-store.mts` e catálogo `/dev`.

## Invariantes atuais

- Modal global não é montado inline dentro de Dropdown, Popover ou outro overlay
  que concorra por foco.
- Nome e payload entram no catálogo tipado; o mapa aponta para um componente e o
  provider permanece único na raiz.
- A store preserva o último modal e payload durante a animação de saída.
- Cada abertura incrementa `seq`, permitindo remontar o conteúdo mesmo ao abrir
  novamente o mesmo modal.
- O mapa usa carregamento dinâmico para não incluir todos os formulários no
  bundle inicial.
- O componente preserva título, descrição, fechamento, foco e semântica das
  primitivas existentes.

## Workflow

1. Confirme se o estado precisa ser transversal; estado local continua local.
2. Defina nome, payload, resultado, abertura, cancelamento, fechamento e
   reabertura antes de editar.
3. Atualize o menor conjunto entre catálogo, mapa, componente e consumidor.
4. Não crie segunda store, provider ou registry para o mesmo ciclo.
5. Preserve comportamento durante animação e interações rápidas.

## Validação

Execute `pnpm check:modal` e `pnpm typecheck`. Para transição nova, acrescente ao
check uma sequência observável mínima, incluindo reabertura e payload quando
aplicáveis. Faça inspeção manual de teclado, foco inicial, retorno de foco,
Escape e leitura de título/descrição. O check atual prova a store, não o foco ou
a integração do Dialog no browser.

Use `CLARIFICATION_REQUIRED:` quando payload, resultado, cancelamento ou
comportamento de foco não estiverem definidos. Não transforme os modais em
`features/_reference` em funcionalidades aprovadas.

---
name: 1one-frontend-architecture
description: Orienta mudanças de páginas, rotas, layouts, estado e integrações do 1one sem transformar templates ou placeholders em requisitos de produto.
---

# Arquitetura frontend do 1one

Esta skill complementa `1one-frontend-team` e nunca sobrescreve seu contrato, a
referência do papel ativo ou o pedido explícito do usuário. Use-a ao criar ou
alterar páginas, rotas, layouts, navegação, modais, estado compartilhado,
fronteiras server/client ou integrações entre camadas.

## Fontes obrigatórias

Leia somente o necessário para o fluxo afetado:

1. pedido e critérios de aceitação explícitos;
2. `README.md`, conferido contra o código;
3. `package.json`, `next.config.ts`, `tsconfig.json` e configurações aplicáveis;
4. rota, layouts, página, feature, consumidores e chamadores reais;
5. `src/components/layout/routes.tsx` e `src/lib/nav.ts` para navegação;
6. `src/components/providers.tsx`, stores e providers envolvidos;
7. contrato OpenAPI e exports Orval reais quando houver dados remotos;
8. checks do domínio e `pnpm verify`.

Template, mock, fixture, catálogo `/dev` e código em `features/_reference` são
exemplos técnicos. Eles não definem produto.

## Arquitetura comprovada

- Páginas de produto em `app/**/page.tsx` permanecem finas; a composição fica em
  `features/<feature>/pages/`.
- Páginas sob `(app)` que dependem da casca bloqueante usam
  `export const instant = false` conforme o precedente existente.
- Título, sidebar, abas e breadcrumb derivam do catálogo de rotas; não duplique
  essa árvore em páginas.
- Estado local permanece local. TanStack Query representa estado de servidor.
  Zustand é usado para estado realmente transversal, como o catálogo de modais,
  e não como cache genérico de API.
- Modais globais usam os tipos, store, mapa e provider existentes.
- Dependência instalada não comprova padrão. Reutilize o menor ponto comum antes
  de criar provider, store, helper, componente ou abstração.

## A Home atual

`src/features/home/pages/home-page.tsx` é um template estático. Seus KPIs,
módulos, pedidos, clientes, tarefas, textos, ícones, cores e arranjo não são
requisitos nem design final. Os botões e checkboxes não comprovam ações,
permissões, persistência, rotas ou APIs.

Ao substituir qualquer parte da Home, exija objetivo, usuário, dados, estados,
ações, destinos, permissões, responsividade e aceite explícitos. Não preserve o
template por inércia nem o use para preencher lacunas do produto.

## Workflow

1. Separe contrato de produto, decisão visual, precedente técnico e placeholder.
2. Trace entrada, rota, layout, página, feature, estado, rede e efeitos até os
   consumidores finais.
3. Pare quando faltar uma decisão que altere o resultado; não complete por
   analogia.
4. Reutilize a camada existente mais próxima e faça o menor diff correto.
5. Defina somente os estados aplicáveis, como loading, vazio, erro, sucesso,
   permissão e retry. Pergunte quando o comportamento não estiver definido.
6. Preserve acessibilidade, segurança, fronteiras server/client e trabalho
   preexistente.
7. Escolha o menor check que exercita o comportamento real. Lógica nova não
   trivial exige um check executável no padrão do repositório.

## Decisões futuras ainda abertas

Não antecipe contrato da Home, catálogo de módulos, hierarquia futura de rotas,
política global do TanStack Query, mutator para Server Components, autenticação
ou novas stores. Registre essas decisões como pendentes até existir requisito ou
contrato aprovado.

Use `CLARIFICATION_REQUIRED:` para requisito, rota, estado, permissão, design ou
contrato ausente. Use `VALIDATION_BLOCKED:` quando ambiente ou ferramenta
impedir o check necessário. Nunca alegue cobertura que não foi executada.

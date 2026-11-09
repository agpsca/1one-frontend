---
name: 1one-navigation-routing
description: Governa rotas, títulos, sidebar, abas e breadcrumbs do 1one a partir do catálogo único e dos helpers de navegação existentes.
---

# Navegação e rotas do 1one

Esta skill complementa `1one-frontend-architecture`. Use-a ao criar, remover ou
renomear rota, alterar sidebar, título, aba, breadcrumb, hierarquia ou estado
ativo da navegação.

## Fontes obrigatórias

- rota e layouts em `src/app/**`;
- `src/components/layout/routes.tsx`, catálogo único de nomes e hierarquia;
- `src/lib/nav.ts`, fonte dos algoritmos de correspondência e trilha;
- consumidores em sidebar, `PageHeader`, `PageTabs` e `PageBreadcrumb`;
- `scripts/check-nav.mts` e `README.md`.

## Regras

- Cadastre nome, hierarquia e visibilidade uma vez em `routes.tsx`.
- Derive título, item ativo, abas e breadcrumb do catálogo; não duplique mapas
  em páginas ou componentes.
- `nav: false` oculta da sidebar sem remover a rota das demais derivações.
- Preserve a preferência pela rota irmã mais específica e a autoabertura de
  ancestrais em profundidade arbitrária.
- Link continua link; ação local continua button. Preserve nome acessível,
  teclado, foco e indicação do estado atual.
- Páginas de produto permanecem finas e, sob a casca `(app)`, seguem a decisão
  documentada de `export const instant = false`.
- A Home template não autoriza criar rotas para seus cartões ou botões.

## Antes de mudar

Confirme path, nome, pai, visibilidade na sidebar, título, breadcrumb, aba,
destino e comportamento para acesso direto. Se autenticação, permissão ou
redirecionamento estiver envolvido, carregue também `1one-auth-session` e não
presuma o guard futuro.

## Validação

Execute `pnpm check:nav` para mudanças no catálogo ou helpers e
`pnpm typecheck` para consumidores. Acrescente ao check a menor matriz que cobre
novo comportamento não trivial. Inspecione navegação por teclado, foco, URL,
título e trilha quando aplicável. O check atual é de helpers e não prova o
browser ou o App Router integrado.

Use `CLARIFICATION_REQUIRED:` quando destino, hierarquia, visibilidade ou regra
de acesso não estiverem definidos.

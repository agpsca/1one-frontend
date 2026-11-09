---
name: 1one-brand-verification
description: Verifica assets, componentes, tokens e usos da marca 1one e da marca corporativa sem redesenhar ou inventar aplicações de identidade.
---

# Verificação de marca do 1one

Esta skill complementa `1one-frontend-team`. Use-a ao alterar assets de marca,
logos inline, cores corporativas, tamanhos, temas, favicon, ícones, OG image,
mascote ou qualquer consumidor da identidade visual.

## Fontes, em ordem

1. material oficial fornecido para a tarefa;
2. `public/Brand/logo.svg`, `public/Brand/icon.svg` e
   `public/Brand/Corporate/*.svg`;
3. `src/components/brand-logo.tsx` e `src/components/corporate-logo.tsx`;
4. primitives de marca em `src/app/globals.css`;
5. todos os consumidores encontrados no código;
6. `scripts/check-brand-logo.mts` e `scripts/check-tokens.mts`;
7. README apenas para status e lacunas, não para criar arte faltante.

## Invariantes atuais

- Reutilize `BrandLogo` e `CorporateLogo`; não copie paths para outro componente.
- Mudança oficial do lockup atualiza asset e componente inline juntos, mantendo
  paths e `viewBox` coerentes.
- Os dois assets corporativos mantêm a mesma geometria. `on-light` usa o
  primitive escuro, `on-dark` usa amarelo, e o componente alterna por tema.
- `BrandLogo` mantém nome acessível quando comunica identidade.
  `CorporateLogo` só permanece decorativo quando seu uso também for decorativo.
- Antes de alterar classe, tamanho, cor ou semântica, encontre todos os
  consumidores e confira o tamanho real, recorte, respiro e fundo.
- Mudança de marca precisa de fonte autorizada; não altere asset e componente
  apenas para satisfazer o check.

## Alcance real de `pnpm check:logo`

O check compara paths, geometria, `viewBox`, altura padrão do `BrandLogo`,
geometria dos assets corporativos e ligação de seus fills aos primitives. Ele
não valida pixels, `icon.svg`, PNGs, mascote, favicon, consumidores, nomes
acessíveis, contraste contextual, respiro em cada instância ou regressão visual.
Não alegue cobertura além dessas invariantes.

## Projeções futuras

O rebrand ainda não fornece uma matriz completa de lockups, fundos, tamanhos
mínimos, áreas de proteção, monocromia, favicon, app icons, OG image ou usos do
mascote. Não redesenhe paths, reconstrua raster, derive novos assets nem promova
a marca textual da sidebar a variante oficial sem material aprovado. A Home
atual também não define aplicações futuras da marca.

## Validação

- Asset SVG, logo inline ou primitive corporativo: `pnpm check:logo`.
- Token de marca: também `pnpm check:tokens`.
- Componente TSX: `pnpm typecheck` e Biome read-only nos arquivos da tarefa.
- Mudança visual: comparação manual em claro/escuro e nos tamanhos reais,
  verificando recorte, respiro, `currentColor`, contraste e acessibilidade.
- Snapshot final: gate definido por `1one-frontend-team`.

Use `CLARIFICATION_REQUIRED:` quando faltar asset oficial ou regra de aplicação.
Use `VALIDATION_BLOCKED:` quando não for possível inspecionar o resultado visual.

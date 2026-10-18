#!/bin/bash

set -e

echo "🧹 Executando limpeza no projeto 1one..."

# Limpa diretórios e artefatos de build
echo "🗑️  Limpando artefatos de build..."
rm -rf .next
rm -rf out
rm -rf dist
rm -rf node_modules/.cache

# Limpa artefatos de tipos gerados automaticamente.
# `next-env.d.ts` é regerado pelo Next no próximo build/dev e
# `tsconfig.tsbuildinfo` é o cache incremental do tsc.
echo "🗑️  Limpando artefatos de tipos..."
rm -f next-env.d.ts
rm -f tsconfig.tsbuildinfo

# Decide o modo de limpeza.
# Sem reinstalar: zera o projeto por completo (sem node_modules, sem build),
# como um clone fresco. Não roda verificações/build porque elas precisam das
# dependências — sem node_modules, falhariam de qualquer forma.
read -p "🔄 Reinstalar dependências? (y/N): " reinstall_confirm
if [[ ! $reinstall_confirm =~ ^[Yy]$ ]]; then
  echo "🗑️  Removendo node_modules..."
  rm -rf node_modules
  echo ""
  echo "✅ Limpeza concluída! O projeto está zerado (sem dependências nem build)."
  echo ""
  echo "Para voltar a desenvolver, reinstale as dependências:"
  echo "  pnpm install && pnpm run prepare"
  echo "  (ou rode ./scripts/dev-setup.sh)"
  exit 0
fi

# --- A partir daqui: reinstalação + verificações completas ---

# Valida o pnpm ANTES de apagar node_modules: se o binário não existir,
# apagar primeiro deixaria o projeto sem dependências e sem como reinstalar.
if ! command -v pnpm &> /dev/null; then
  echo "❌ PNPM não foi encontrado. Instale o PNPM com o corepack primeiro."
  echo "   node_modules foi preservado."
  exit 1
fi

echo "🗑️  Removendo node_modules..."
rm -rf node_modules
echo "📦 Reinstalando dependências..."
pnpm install
# O pnpm 11 não roda o `prepare` no install; sem isto os hooks morrem aqui.
echo "🪝 Reinstalando hooks de git..."
pnpm run prepare

# Falha alto se os hooks não ficaram ativos: um hook ausente não avisa nada,
# só deixa passar commit quebrado.
hooks_path=$(git config core.hooksPath || true)
if [ "$hooks_path" != ".husky/_" ]; then
  echo "❌ Hooks não foram instalados (core.hooksPath='$hooks_path')."
  echo "   Rode 'pnpm run prepare' e confira se o husky está nas devDependencies."
  exit 1
fi
echo "   ✔ core.hooksPath = $hooks_path"

# Executa linting e formatação
echo "🔍 Executando linting..."
pnpm check

# Verifica TypeScript.
# `pnpm typecheck` e não `tsc --noEmit` direto: acabamos de apagar .next, e os
# tipos de rota (LayoutProps) vivem em .next/types — o tsc puro falharia aqui.
echo "🔍 Verificando TypeScript..."
pnpm typecheck

# Verifica sincronia dos design tokens
echo "🎨 Verificando design tokens..."
pnpm check:tokens

# Testa o build
echo "🏗️  Testando build..."
pnpm build

echo ""
echo "✅ Limpeza, reinstalação e verificações concluídas com sucesso!"
echo ""
echo "Seu projeto está pronto para desenvolvimento."

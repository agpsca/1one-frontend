#!/bin/bash

set -e

echo "🧹 Executando limpeza e verificações no projeto 1one..."

# Limpa diretórios de build
echo "🗑️  Limpando artefatos de build..."
rm -rf .next
rm -rf out
rm -rf dist
rm -rf node_modules/.cache

# Reinstala dependências se solicitado
read -p "🔄 Reinstalar dependências? (y/N): " reinstall_confirm
if [[ $reinstall_confirm =~ ^[Yy]$ ]]; then
  echo "🗑️  Removendo node_modules..."
  rm -rf node_modules
  echo "📦 Reinstalando dependências..."
  pnpm install
  # O pnpm 11 não roda o `prepare` no install; sem isto os hooks morrem aqui.
  echo "🪝 Reinstalando hooks de git..."
  pnpm run prepare
fi

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

echo "✅ Limpeza e verificações concluídas com sucesso!"
echo ""
echo "Seu projeto está pronto para desenvolvimento."

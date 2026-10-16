#!/bin/bash

set -e

BUILD=false

while getopts "b" opt; do
  case "$opt" in
    b)
      BUILD=true
      ;;
    *)
      echo "Uso: $0 [-b]"
      exit 1
      ;;
  esac
done

echo "🔍 Executando linting..."

# `typecheck` roda `next typegen` antes do tsc: sem os tipos de rota gerados
# em .next/types o tsc não conhece LayoutProps e falha em checkout limpo.
pnpm typecheck && pnpm check:fix

echo "🎨 Verificando sincronia dos design tokens..."
pnpm check:tokens

if [ "$BUILD" = true ]; then
  echo "🏗️  Testando build..."
  pnpm build

  echo "✅ Linting e Build concluídos!"
else
  echo "✅ Linting concluído!"
fi

echo ""
echo "Seu projeto está pronto para fazer push ou solicitar um PR!"

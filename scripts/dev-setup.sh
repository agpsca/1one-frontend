#!/bin/bash

set -e

echo "🚀 Configurando ambiente de desenvolvimento 1one..."

# Verifica se o Node.js está instalado
if ! command -v node &> /dev/null; then
  echo "❌ Node.js não está instalado. Instale a versão LTS primeiro."
  exit 1
fi

# Verifica se o pnpm está instalado
if ! command -v pnpm &> /dev/null; then
  echo "❌ PNPM não foi encontrado. Instale o PNPM com o corepack primeiro."
  exit 1
fi

# Instala as dependências
echo "📦 Instalando dependências..."
pnpm install

# Instala os hooks de git.
# ponytail: o pnpm 11 NÃO executa o script `prepare` durante o `pnpm install`,
# então o husky não se instala sozinho — sem esta chamada o repositório fica
# sem pre-commit e sem pre-push, silenciosamente.
echo "🪝 Instalando hooks de git (husky)..."
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

# Verifica se o arquivo de env local existe.
# Next lê .env.local; .env.example é o template versionado.
if [ ! -f ".env.local" ]; then
  if [ -f ".env.example" ]; then
    echo "⚙️  Copiando .env.example para .env.local..."
    cp .env.example .env.local
    echo "⚠️  Configure as variáveis de ambiente no arquivo .env.local"
  else
    echo "⚠️  .env.example não encontrado. Crie um .env.local com as variáveis necessárias."
  fi
fi

# Testa o build
echo "🔍 Testando build..."
pnpm build

echo "✅ Ambiente de desenvolvimento configurado com sucesso!"
echo ""
echo "Para iniciar o desenvolvimento:"
echo "  pnpm dev"
echo ""

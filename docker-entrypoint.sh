#!/bin/sh
set -e

PORT=${PORT:-8000}
DOC_ROOT="/var/www/html/backend/public"

# Verifica se o diretório existe
if [ ! -d "$DOC_ROOT" ]; then
  echo "⚠️  Aviso: Diretório $DOC_ROOT não encontrado!"
  echo "Criando estrutura básica..."
  mkdir -p "$DOC_ROOT"
  echo "<h1>Setup completo</h1>" > "$DOC_ROOT/index.html"
fi

echo "🚀 Iniciando servidor na porta $PORT"
php -S "0.0.0.0:$PORT" -t "$DOC_ROOT"
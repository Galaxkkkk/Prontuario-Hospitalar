#!/bin/sh
set -e

# Define porta padrão se não estiver definida
PORT=${PORT:-8000}

# Verifica se a porta é numérica
if ! echo "$PORT" | grep -qE '^[0-9]+$'; then
  echo "❌ ERRO: Porta inválida '$PORT'. Usando fallback 8000."
  PORT=8000
fi

# Garante que o diretório existe
DOC_ROOT="/var/www/html/backend/public"
mkdir -p "$DOC_ROOT"

# Inicia o servidor PHP com verificação explícita
echo "🚀 Iniciando servidor PHP em 0.0.0.0:$PORT"
exec php -S "0.0.0.0:$PORT" -t "$DOC_ROOT"
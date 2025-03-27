# Estágio 1: Build do Frontend
FROM node:18 as frontend-builder
WORKDIR /app

# 1. Copia apenas os arquivos necessários para instalação
COPY frontend/package.json frontend/package-lock.json ./

# 2. Instala dependências
RUN npm install --include=dev

# 3. Copia todo o frontend
COPY frontend/ .

# 4. Executa o build (que agora gera em ../backend/public)
RUN npm run build

# Estágio 2: Servidor PHP
FROM php:8.2-apache
WORKDIR /var/www/html

# 5. Garante que a pasta public existe
RUN mkdir -p backend/public/

# 6. Copia os arquivos construídos
COPY --from=frontend-builder /app/../backend/public/ backend/public/

# 7. Copia o backend
COPY backend/ .

# 8. Configurações finais
RUN docker-php-ext-install pdo pdo_mysql && \
    a2enmod rewrite

# Adicione no final do Dockerfile:
  CMD ["sh", "-c", "php -S 0.0.0.0:${PORT:-8000} -t /var/www/html/backend/public"]
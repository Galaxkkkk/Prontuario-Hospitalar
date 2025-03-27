# Build do Frontend
FROM node:18 as frontend
WORKDIR /app
COPY frontend/package.json frontend/package-lock.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# Servidor PHP
FROM php:8.2-apache
WORKDIR /var/www/html

# 1. Cria estrutura de diretórios
RUN mkdir -p backend/public/

# 2. Copia os arquivos built do frontend
COPY --from=frontend /app/../backend/public/ backend/public/

# 3. Script de entrada inteligente
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# 4. Configurações finais
RUN docker-php-ext-install pdo pdo_mysql && \
    a2enmod rewrite

ENTRYPOINT ["docker-entrypoint.sh"]
# Estágio 1: Build do Frontend
FROM node:18 as frontend-builder
WORKDIR /app
COPY frontend/package.json ./
RUN npm install --include=dev
COPY frontend/ .
RUN npm run build && mkdir -p /app/public && cp -r dist/* /app/public/

# Estágio 2: Servidor PHP
FROM php:8.2-apache
WORKDIR /var/www/html

# Cria a estrutura de diretórios necessária
RUN mkdir -p public/

# Copia os arquivos do frontend
COPY --from=frontend-builder /app/public ./public/

# Copia o backend (exceto node_modules)
COPY backend/ .

# Configurações finais
RUN docker-php-ext-install pdo pdo_mysql && \
    a2enmod rewrite && \
    chown -R www-data:www-data public/
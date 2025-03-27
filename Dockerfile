# Estágio 1: Build do Frontend
FROM node:18 as frontend-builder
WORKDIR /app

# Copia apenas os arquivos essenciais primeiro (otimiza cache)
COPY frontend/package.json ./

# Instala dependências (cria package-lock.json se não existir)
RUN npm install --include=dev

# Copia o resto do frontend
COPY frontend/ .

# Executa o build
RUN npm run build

# Estágio 2: Servidor PHP
FROM php:8.2-apache
WORKDIR /var/www/html
COPY --from=frontend-builder /app/dist ./public/
COPY backend/ .
RUN docker-php-ext-install pdo pdo_mysql && a2enmod rewrite
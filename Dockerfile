# Estágio 1: Build do Frontend
FROM node:18 as frontend-builder
WORKDIR /app

# Primeiro copia apenas os arquivos de dependências
COPY frontend/package.json frontend/package-lock.json ./

# Instala todas as dependências (incluindo Vite)
RUN npm install --include=dev

# Copia o resto do frontend
COPY frontend/ .

# Executa o build
RUN npm run build

# Estágio 2: Servidor PHP
FROM php:8.2-apache
WORKDIR /var/www/html

# Copia os arquivos built do frontend
COPY --from=frontend-builder /app/dist ./public/

# Copia o backend
COPY backend/ .

# Instala extensões PHP necessárias
RUN docker-php-ext-install pdo pdo_mysql

# Configura o Apache
RUN a2enmod rewrite
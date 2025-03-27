# Estágio 1: Build do Frontend
FROM node:18 as frontend-builder
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# Estágio 2: Servidor PHP
FROM php:8.2-apache
WORKDIR /var/www/html

# Copia os arquivos built do frontend
COPY --from=frontend-builder /app/dist/ ./public/

# Copia o backend (exceto node_modules)
COPY backend/ .

# Instala extensões PHP necessárias
RUN docker-php-ext-install pdo pdo_mysql

# Configura o Apache para usar a pasta public
RUN sed -i 's!/var/www/html!/var/www/html/public!g' /etc/apache2/sites-available/000-default.conf
RUN a2enmod rewrite
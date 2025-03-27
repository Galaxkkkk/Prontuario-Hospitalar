# Estágio 1: Build do Frontend
FROM node:18 as frontend-builder
WORKDIR /app

# 1. Copia arquivos de dependência
COPY frontend/package.json frontend/package-lock.json ./

# 2. Instala dependências
RUN npm install -g vite && \
    npm install --include=dev

# 3. Copia o frontend
COPY frontend/ .

# 4. Build e cópia dos arquivos
RUN npm run build && \
    mkdir -p /app/public && \
    [ -d "../backend/public" ] && cp -r ../backend/public/* /app/public/ || \
    (echo "⚠️ Usando fallback: copiando de dist/" && cp -r dist/* /app/public/) && \
    echo "Conteúdo de public:" && \
    ls -la /app/public/

# Estágio 2: Servidor PHP
FROM php:8.2-apache
WORKDIR /var/www/html

# Garante que a pasta public existe
RUN mkdir -p public/

# Copia os arquivos do frontend
COPY --from=frontend-builder /app/public ./public/

# Copia o backend
COPY backend/ .

# Configurações finais
RUN docker-php-ext-install pdo pdo_mysql && \
    a2enmod rewrite && \
    chown -R www-data:www-data public/
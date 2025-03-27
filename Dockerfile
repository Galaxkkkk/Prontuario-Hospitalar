FROM php:8.2-apache

WORKDIR /var/www/html

# 1. Instala dependências do PHP
RUN docker-php-ext-install pdo pdo_mysql && \
    a2enmod rewrite

# 2. Copia o entrypoint modificado
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# 3. Configura o Apache para usar a porta dinâmica
RUN echo "Listen $PORT" > /etc/apache2/ports.conf && \
    sed -i "s/:80/:$PORT/g" /etc/apache2/sites-available/*.conf

# 4. Define o entrypoint
ENTRYPOINT ["docker-entrypoint.sh"]
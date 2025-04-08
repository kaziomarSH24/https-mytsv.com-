# Laravel App এর জন্য Official PHP Image
FROM php:8.2-fpm

# System Dependencies ইনস্টল করা
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    zip \
    unzip \
    git \
    curl \
    vim \
    && docker-php-ext-configure gd \
    && docker-php-ext-install gd pdo pdo_mysql

# Node.js ইনস্টল করা
RUN curl -sL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs

# Composer ইনস্টল করা
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Laravel Working Directory সেট করা
WORKDIR /var/www

# Project Files কপি করা
COPY . .

# Permission সেট করা
RUN chown -R www-data:www-data /var/www \
    && chmod -R 775 /var/www/storage /var/www/bootstrap/cache

# Laravel Cache Clear & Migrate
# RUN php artisan cache:clear
# RUN php artisan config:clear
# RUN php artisan migrate --force

CMD ["php-fpm"]

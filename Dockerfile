# Base image PHP 8.2 FPM
FROM php:8.2-fpm

# Install required libraries for GD extension and other utilities
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libzip-dev \
    zip \
    unzip \
    git \
    curl \
    vim \
    && docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp \
    && docker-php-ext-install gd pdo pdo_mysql

# Install Node.js (version 18.x)
RUN curl -sL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set Laravel working directory
WORKDIR /var/www

# Copy project files into the container
COPY . .

# Set permissions for storage and cache folders
RUN chown -R www-data:www-data /var/www \
    && chmod -R 775 /var/www/storage /var/www/bootstrap/cache

# Expose the port 9000 (or whatever PHP-FPM runs on)
EXPOSE 9000

# Run PHP-FPM (or your entrypoint script)
CMD ["php-fpm"]


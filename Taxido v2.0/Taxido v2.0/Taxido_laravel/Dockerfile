# Stage 1: Build dependencies and assets
FROM php:8.3-fpm-alpine AS builder

# Install build dependencies
RUN apk add --no-cache \
    git \
    curl \
    libpng-dev \
    oniguruma-dev \
    libxml2-dev \
    libzip-dev \
    unzip \
    nodejs \
    npm \
    autoconf \
    g++ \
    make

# Install PHP extensions (including GD)
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy all application files (including .env if it exists)
COPY . .

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader --prefer-dist --no-interaction

# Install Node.js dependencies and build assets
RUN npm ci && npm run build && rm -rf node_modules

# Run Laravel storage link
RUN php artisan storage:link

# Stage 2: Final image with Nginx and PHP-FPM
FROM php:8.3-fpm-alpine

# Install runtime dependencies and Nginx
RUN apk add --no-cache \
    nginx \
    libpng-dev \
    oniguruma-dev \
    libxml2-dev \
    libzip-dev \
    netcat-openbsd \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip mysqli

# Copy Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy PHP-FPM configuration
COPY php-fpm.conf /usr/local/etc/php-fpm.d/custom.conf

# Copy application files from builder stage
COPY --from=builder /var/www/html/vendor /var/www/html/vendor
COPY --from=builder /var/www/html /var/www/html

# Debug: Verify vendor folder exists in final stage
RUN ls -la /var/www/html && ls -la /var/www/html/vendor

# Ensure .htaccess exists in public directory (optional, as Nginx doesn't use .htaccess)
# COPY .htaccess /var/www/html/public/.htaccess

# Create a default .env file if it doesn't exist
RUN if [ ! -f /var/www/html/.env ]; then \
    echo "Creating default .env file"; \
    cp /var/www/html/.env.example /var/www/html/.env; \
    php /var/www/html/artisan key:generate; \
    fi

# Set PHP configuration settings
RUN echo "memory_limit=1024M" > /usr/local/etc/php/conf.d/custom.ini \
    && echo "max_execution_time=3000" >> /usr/local/etc/php/conf.d/custom.ini \
    && echo "max_input_time=3000" >> /usr/local/etc/php/conf.d/custom.ini \
    && echo "post_max_size=2048M" >> /usr/local/etc/php/conf.d/custom.ini \
    && echo "upload_max_filesize=2048M" >> /usr/local/etc/php/conf.d/custom.ini

# Set permissions for Laravel directories and vendor
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/vendor \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/vendor

# Expose port 80
EXPOSE 80

# Copy install script to handle startup
COPY install.sh /install.sh
RUN chmod +x /install.sh

# Start PHP-FPM and Nginx
CMD ["/install.sh"]
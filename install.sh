#!/bin/sh
set -e

# Verify vendor folder exists
if [ ! -d /var/www/html/vendor ]; then
    echo "Error: vendor folder not found in /var/www/html"
    exit 1
fi

# Create .env file from .env.example if it doesn't exist
if [ ! -f /var/www/html/.env ]; then
    echo "Creating .env file from .env.example"
    cp /var/www/html/.env.example /var/www/html/.env
    php /var/www/html/artisan key:generate
fi

# Update .env file with environment variables
sed -i "s|APP_URL=.*|APP_URL=$APP_URL|" /var/www/html/.env
sed -i "s|DB_HOST=.*|DB_HOST=$DB_HOST|" /var/www/html/.env
sed -i "s|DB_DATABASE=.*|DB_DATABASE=$DB_DATABASE|" /var/www/html/.env
sed -i "s|DB_USERNAME=.*|DB_USERNAME=$DB_USERNAME|" /var/www/html/.env
sed -i "s|DB_PASSWORD=.*|DB_PASSWORD=$DB_PASSWORD|" /var/www/html/.env

# Update other environment variables if provided
if [ -n "$MAIL_HOST" ]; then
    sed -i "s|MAIL_HOST=.*|MAIL_HOST=$MAIL_HOST|" /var/www/html/.env
    sed -i "s|MAIL_PORT=.*|MAIL_PORT=$MAIL_PORT|" /var/www/html/.env
    sed -i "s|MAIL_USERNAME=.*|MAIL_USERNAME=$MAIL_USERNAME|" /var/www/html/.env
    sed -i "s|MAIL_PASSWORD=.*|MAIL_PASSWORD=$MAIL_PASSWORD|" /var/www/html/.env
    sed -i "s|MAIL_ENCRYPTION=.*|MAIL_ENCRYPTION=$MAIL_ENCRYPTION|" /var/www/html/.env
    sed -i "s|MAIL_FROM_ADDRESS=.*|MAIL_FROM_ADDRESS=$MAIL_FROM_ADDRESS|" /var/www/html/.env
    sed -i "s|MAIL_FROM_NAME=.*|MAIL_FROM_NAME=\"$MAIL_FROM_NAME\"|" /var/www/html/.env
fi

# Wait for MySQL to be ready using netcat
until nc -z -w 2 "$DB_HOST" "$DB_PORT"; do
    echo "Waiting for MySQL to be ready on $DB_HOST:$DB_PORT..."
    sleep 2
done

# Verify MySQL connection with a simple query
until php -r "try { new PDO('mysql:host=$DB_HOST;port=$DB_PORT;dbname=$DB_DATABASE', '$DB_USERNAME', '$DB_PASSWORD'); exit(0); } catch (PDOException \$e) { exit(1); }"; do
    echo "Waiting for MySQL database connection..."
    sleep 2
done

# Run Laravel migrations
# php /var/www/html/artisan migrate --force

# Optimize Laravel
php /var/www/html/artisan config:cache
php /var/www/html/artisan route:cache
php /var/www/html/artisan view:cache
php /var/www/html/artisan optimize:clear 

# Ensure storage link exists
php /var/www/html/artisan storage:link

# Set permissions
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/vendor
chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/vendor

# Start PHP-FPM in the background
php-fpm -D

# Start Nginx in the foreground
nginx -g "daemon off;"
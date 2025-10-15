#!/bin/bash

# Env Vars
POSTGRES_USER="tabarro3_user"
POSTGRES_PASSWORD=$(openssl rand -base64 12)  # Generate a random 12-character password
POSTGRES_DB="tabarro3_db"
AUTH_SECRET=$(openssl rand -base64 32)  # Generate a random auth secret
CRON_SECRET=$(openssl rand -base64 32)  # Generate a random cron secret
DOMAIN_NAME="tabarro3.ma"
EMAIL="dondesang.ma@gmail.com"

# SMTP Configuration (fill the values without the quotes)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASSWORD=
FROM_EMAIL=

# Discord Configuration
DISCORD_WEBHOOK_URL=

# Script Vars
REPO_URL="https://github.com/HMZElidrissi/tabarro3.ma"
APP_DIR=~/tabarro3.ma
SWAP_SIZE="2G"

# Update package list and upgrade existing packages
sudo apt update && sudo apt upgrade -y

# Add Swap Space
if ! swapon --show | grep -q '^/swapfile'; then
  echo "Adding swap space..."
  sudo fallocate -l $SWAP_SIZE /swapfile
  sudo chmod 600 /swapfile
  sudo mkswap /swapfile
  sudo swapon /swapfile
  # Make swap permanent
  echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
else
  echo "Swapfile already active, skipping creation."
fi

# Install Podman and podman-compose
sudo apt install -y podman podman-compose

# Verify Podman installation
podman --version
if [ $? -ne 0 ]; then
  echo "Podman installation failed. Exiting."
  exit 1
fi

# Verify podman-compose installation
podman-compose --version
if [ $? -ne 0 ]; then
  echo "podman-compose installation failed. Exiting."
  exit 1
fi

# Clone the Git repository
if [ -d "$APP_DIR" ]; then
  echo "Directory $APP_DIR already exists. Pulling latest changes..."
  cd $APP_DIR && git pull
else
  echo "Cloning repository from $REPO_URL..."
  git clone $REPO_URL $APP_DIR
  cd $APP_DIR
fi

# For container internal communication ("db" is the name of Postgres container)
DATABASE_URL="postgres://$POSTGRES_USER:$POSTGRES_PASSWORD@db:5432/$POSTGRES_DB"

# Direct URL for Prisma (same as DATABASE_URL for single instance)
DIRECT_URL="postgres://$POSTGRES_USER:$POSTGRES_PASSWORD@db:5432/$POSTGRES_DB"

# For external tools (like Drizzle Studio)
DATABASE_URL_EXTERNAL="postgres://$POSTGRES_USER:$POSTGRES_PASSWORD@localhost:5432/$POSTGRES_DB"

# Create the .env file inside the app directory (~/tabarro3.ma/.env)
echo "# Database Configuration" > "$APP_DIR/.env"
echo "POSTGRES_USER=$POSTGRES_USER" >> "$APP_DIR/.env"
echo "POSTGRES_PASSWORD=$POSTGRES_PASSWORD" >> "$APP_DIR/.env"
echo "POSTGRES_DB=$POSTGRES_DB" >> "$APP_DIR/.env"
echo "DATABASE_URL=$DATABASE_URL" >> "$APP_DIR/.env"
echo "DIRECT_URL=$DIRECT_URL" >> "$APP_DIR/.env"
echo "DATABASE_URL_EXTERNAL=$DATABASE_URL_EXTERNAL" >> "$APP_DIR/.env"

echo "" >> "$APP_DIR/.env"
echo "# Authentication" >> "$APP_DIR/.env"
echo "AUTH_SECRET=$AUTH_SECRET" >> "$APP_DIR/.env"

echo "" >> "$APP_DIR/.env"
echo "# Cron Jobs" >> "$APP_DIR/.env"
echo "CRON_SECRET=$CRON_SECRET" >> "$APP_DIR/.env"

echo "" >> "$APP_DIR/.env"
echo "# Application URLs" >> "$APP_DIR/.env"
echo "NEXT_PUBLIC_BASE_URL=https://$DOMAIN_NAME" >> "$APP_DIR/.env"

echo "" >> "$APP_DIR/.env"
echo "# SMTP Configuration" >> "$APP_DIR/.env"
echo "SMTP_HOST=$SMTP_HOST" >> "$APP_DIR/.env"
echo "SMTP_PORT=$SMTP_PORT" >> "$APP_DIR/.env"
echo "SMTP_SECURE=$SMTP_SECURE" >> "$APP_DIR/.env"
echo "SMTP_USER=$SMTP_USER">> "$APP_DIR/.env"
echo "SMTP_PASSWORD=$SMTP_PASSWORD">> "$APP_DIR/.env"
echo "FROM_EMAIL=$FROM_EMAIL">> "$APP_DIR/.env"

echo "" >> "$APP_DIR/.env"
echo "# Discord Integration (Optional)" >> "$APP_DIR/.env"
if [ ! -z "$DISCORD_WEBHOOK_URL" ]; then
  echo "DISCORD_WEBHOOK_URL=\"$DISCORD_WEBHOOK_URL\"" >> "$APP_DIR/.env"
fi

echo "" >> "$APP_DIR/.env"
echo "# Environment" >> "$APP_DIR/.env"
echo "NODE_ENV=production" >> "$APP_DIR/.env"

# Install Nginx
sudo apt install nginx -y

# Remove old Nginx config (if it exists)
sudo rm -f /etc/nginx/sites-available/tabarro3.ma
sudo rm -f /etc/nginx/sites-enabled/tabarro3.ma

# Stop Nginx temporarily to allow Certbot to run in standalone mode
sudo systemctl stop nginx

# Obtain SSL certificate using Certbot standalone mode
sudo apt install certbot -y
sudo certbot certonly --standalone -d $DOMAIN_NAME --non-interactive --agree-tos -m $EMAIL

# Ensure SSL files exist or generate them
if [ ! -f /etc/letsencrypt/options-ssl-nginx.conf ]; then
  sudo wget https://raw.githubusercontent.com/certbot/certbot/refs/heads/main/certbot-nginx/src/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf -P /etc/letsencrypt/
fi

if [ ! -f /etc/letsencrypt/ssl-dhparams.pem ]; then
  sudo openssl dhparam -out /etc/letsencrypt/ssl-dhparams.pem 2048
fi

# Create Nginx config with reverse proxy, SSL support, rate limiting, and streaming support
sudo cat > /etc/nginx/sites-available/tabarro3.ma <<EOL
limit_req_zone \$binary_remote_addr zone=mylimit:10m rate=10r/s;

server {
    listen 80;
    server_name $DOMAIN_NAME;

    # Redirect all HTTP requests to HTTPS
    return 301 https://\$host\$request_uri;
}

server {
    listen 443 ssl;
    server_name $DOMAIN_NAME;

    ssl_certificate /etc/letsencrypt/live/$DOMAIN_NAME/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN_NAME/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Enable rate limiting
    limit_req zone=mylimit burst=20 nodelay;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;

        # Disable buffering for streaming support
        proxy_buffering off;
        proxy_set_header X-Accel-Buffering no;
    }
}
EOL

# Create symbolic link if it doesn't already exist
sudo ln -s /etc/nginx/sites-available/tabarro3.ma /etc/nginx/sites-enabled/tabarro3.ma

# Restart Nginx to apply the new configuration
sudo systemctl restart nginx

# Build and run the containers from the app directory (~/tabarro3.ma)
cd $APP_DIR

# Clean up any existing containers to avoid conflicts
echo "Cleaning up existing containers..."
podman-compose down --remove-orphans 2>/dev/null || true

# Build images
echo "Building Docker image..."
if ! podman build -f ./Dockerfile -t localhost/tabarro3ma_web .; then
  echo "Docker build failed. Exiting."
  exit 1
fi

# Run database migrations
echo "Running database migrations..."
if ! podman-compose run --rm web npx prisma migrate deploy; then
  echo "Database migration failed. Exiting."
  exit 1
fi

# Start all services
echo "Starting services..."
if ! podman-compose up -d; then
  echo "Failed to start services. Exiting."
  exit 1
fi

# Check if services started correctly
if ! podman-compose ps | grep "Up"; then
  echo "Containers failed to start. Check logs with 'podman-compose logs'."
  exit 1
fi

# Setup automatic SSL certificate renewal...
( crontab -l 2>/dev/null; echo "0 */12 * * * certbot renew --quiet && systemctl reload nginx" ) | crontab -

# Output final message
echo "tabarro3.ma deployment complete!"
echo ""
echo "The platform is now running at: https://$DOMAIN_NAME"
echo ""
echo "Services started:"
echo "- Web application (Next.js)"
echo "- PostgreSQL database"
echo "- Cron job scheduler"
echo ""
echo "Important: Before using the application, please update the following in your .env file:"
echo "- SMTP_USER and SMTP_PASSWORD (for email notifications)"
echo "- FROM_EMAIL (your sending email address)"
echo "- DISCORD_WEBHOOK_URL (optional, for Discord notifications)"
echo ""
echo "Generated secrets (keep these secure):"
echo "- Database password: $POSTGRES_PASSWORD"
echo "- Auth secret: $AUTH_SECRET"
echo "- Cron secret: $CRON_SECRET"
echo ""
echo "To view logs: cd $APP_DIR && podman-compose logs -f"
echo "To stop services: cd $APP_DIR && podman-compose down"
echo "To restart services: cd $APP_DIR && podman-compose restart"
#!/bin/bash

# Exit on error
set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== E-Commerce Site Setup Script (Ubuntu/Debian) ===${NC}"

# 1. Update System
echo -e "${GREEN}[1/8] Updating system packages...${NC}"
sudo apt-get update
sudo apt-get upgrade -y

# 2. Install Essentials
echo -e "${GREEN}[2/8] Installing essential tools (curl, git, nginx, build-essential)...${NC}"
sudo apt-get install -y curl git nginx build-essential ufw

# 3. Install Node.js (v20 LTS)
echo -e "${GREEN}[3/8] Installing Node.js v20...${NC}"
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

# 4. Install MySQL Server
echo -e "${GREEN}[4/8] Installing MySQL Server...${NC}"
sudo apt-get install -y mysql-server

# Secure MySQL Installation (non-interactive mostly, but setting up user)
echo -e "${BLUE}Configuring Database...${NC}"
sudo service mysql start

# Create Database and User
# NOTE: You should change 'password123' to a secure password!
DB_NAME="ecom_db"
DB_USER="ecom_user"
DB_PASS="password123"

echo -e "${BLUE}Creating database: $DB_NAME${NC}"
sudo mysql -e "CREATE DATABASE IF NOT EXISTS $DB_NAME;"
echo -e "${BLUE}Creating user: $DB_USER${NC}"
sudo mysql -e "CREATE USER IF NOT EXISTS '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASS';"
sudo mysql -e "GRANT ALL PRIVILEGES ON $DB_NAME.* TO '$DB_USER'@'localhost';"
sudo mysql -e "FLUSH PRIVILEGES;"

# 5. Directory Setup
echo -e "${GREEN}[5/8] Setting up project directory...${NC}"
APP_DIR="/var/www/ecom-app"

# If directory doesn't exist, created it. If it does, we assume code is being copied here.
if [ ! -d "$APP_DIR" ]; then
    echo "Creating directory $APP_DIR"
    sudo mkdir -p $APP_DIR
    sudo chown -R $USER:$USER $APP_DIR
fi

# 6. Install PM2 (Process Manager)
echo -e "${GREEN}[6/8] Installing global packages (PM2)...${NC}"
sudo npm install -g pm2

# 7. Configure Nginx
echo -e "${GREEN}[7/8] Configuring Nginx reverse proxy...${NC}"
# Prompt for domain or IP
read -p "Enter your Domain Name or IP Address (e.g., myshop.com or 123.45.67.89): " SERVER_NAME

NGINX_CONF="/etc/nginx/sites-available/ecom-app"

sudo bash -c "cat > $NGINX_CONF" <<EOF
server {
    listen 80;
    server_name $SERVER_NAME;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable site
sudo ln -sf /etc/nginx/sites-available/ecom-app /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test and Restart Nginx
sudo nginx -t
sudo systemctl restart nginx

# 8. Firewall Setup
echo -e "${GREEN}[8/8] Configuring Firewall (UFW)...${NC}"
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable

echo -e "${BLUE}=== Server Environment Setup Complete! ===${NC}"
echo -e "Next Steps:"
echo -e "1. Copy your project files to: ${GREEN}$APP_DIR${NC}"
echo -e "2. Navigate to that folder: ${GREEN}cd $APP_DIR${NC}"
echo -e "3. Create your .env.local file with DB credentials:"
echo -e "   DB_HOST=localhost"
echo -e "   DB_USER=$DB_USER"
echo -e "   DB_PASSWORD=$DB_PASS"
echo -e "   DB_NAME=$DB_NAME"
echo -e "4. Install dependencies: ${GREEN}npm install${NC}"
echo -e "5. Build the app: ${GREEN}npm run build${NC}"
echo -e "6. Initialize DB: ${GREEN}node init-db.js${NC}"
echo -e "7. Start with PM2: ${GREEN}pm2 start npm --name 'ecom-app' -- start${NC}"
echo -e "8. Save PM2 list: ${GREEN}pm2 save${NC}"

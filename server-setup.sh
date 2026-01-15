#!/bin/bash

# 🚀 Complete Server Setup Script
# This script will clean up old files and setup both sites fresh

set -e  # Exit on any error

echo "=========================================="
echo "🚀 Starting Multi-Site Setup"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
GITHUB_REPO="https://github.com/hellosarowarhn-boop/ecomm.git"
SITE1_PATH="$HOME/domains/sunnah-shop.online/public_html"
SITE2_PATH="$HOME/domains/ilwashop.com/public_html"

# Step 1: Create backups
echo -e "${BLUE}📦 Step 1: Creating backups...${NC}"
mkdir -p ~/backups

if [ -d "$SITE1_PATH" ]; then
    echo "   → Backing up sunnah-shop.online..."
    cd ~/domains/sunnah-shop.online
    tar -czf ~/backups/sunnah-shop-backup-$(date +%Y%m%d-%H%M%S).tar.gz public_html/ 2>/dev/null || echo "   ⚠ No files to backup for site 1"
    
    # Save .env.local if exists
    if [ -f "$SITE1_PATH/.env.local" ]; then
        cp "$SITE1_PATH/.env.local" ~/backups/sunnah-shop.env.local
        echo -e "   ${GREEN}✓${NC} Saved .env.local for site 1"
    fi
fi

if [ -d "$SITE2_PATH" ]; then
    echo "   → Backing up ilwashop.com..."
    cd ~/domains/ilwashop.com
    tar -czf ~/backups/ilwashop-backup-$(date +%Y%m%d-%H%M%S).tar.gz public_html/ 2>/dev/null || echo "   ⚠ No files to backup for site 2"
    
    # Save .env.local if exists
    if [ -f "$SITE2_PATH/.env.local" ]; then
        cp "$SITE2_PATH/.env.local" ~/backups/ilwashop.env.local
        echo -e "   ${GREEN}✓${NC} Saved .env.local for site 2"
    fi
fi

echo -e "${GREEN}✓ Backups created in ~/backups/${NC}"
echo ""

# Step 2: Clean up old files
echo -e "${BLUE}🧹 Step 2: Cleaning up old files...${NC}"

echo "   → Cleaning sunnah-shop.online..."
rm -rf "$SITE1_PATH"/*
rm -rf "$SITE1_PATH"/.[!.]*
echo -e "   ${GREEN}✓${NC} Site 1 cleaned"

echo "   → Cleaning ilwashop.com..."
rm -rf "$SITE2_PATH"/*
rm -rf "$SITE2_PATH"/.[!.]*
echo -e "   ${GREEN}✓${NC} Site 2 cleaned"

echo ""

# Step 3: Clone from GitHub
echo -e "${BLUE}📥 Step 3: Cloning from GitHub...${NC}"

echo "   → Cloning to sunnah-shop.online..."
cd "$SITE1_PATH"
git clone "$GITHUB_REPO" .
echo -e "   ${GREEN}✓${NC} Site 1 cloned"

echo "   → Cloning to ilwashop.com..."
cd "$SITE2_PATH"
git clone "$GITHUB_REPO" .
echo -e "   ${GREEN}✓${NC} Site 2 cloned"

echo ""

# Step 4: Create environment files
echo -e "${BLUE}⚙️  Step 4: Creating environment files...${NC}"

# Site 1 .env.local
echo "   → Creating .env.local for sunnah-shop.online..."
cat > "$SITE1_PATH/.env.local" << 'EOF'
# Database Configuration
DB_HOST=localhost
DB_USER=u796903731_sunnahshopsaro
DB_PASSWORD=kKt@CA39yI$@mg
DB_NAME=u796903731_sunnahshop
DB_DIALECT=mysql

# Admin Authentication
JWT_SECRET=SUNNAHSHOP_8a0b5c2f4d9e4f2aa1d8b7c6110e3a91

# Site Configuration
NEXT_PUBLIC_SITE_NAME=Sunnah Shop
NEXT_PUBLIC_SITE_PHONE=+1234567890

# Environment
NODE_ENV=production
EOF
echo -e "   ${GREEN}✓${NC} Site 1 .env.local created"

# Site 2 .env.local
echo "   → Creating .env.local for ilwashop.com..."
cat > "$SITE2_PATH/.env.local" << 'EOF'
# Database Configuration
DB_HOST=localhost
DB_USER=u796903731_ilwashopsaro
DB_PASSWORD=%A&%0S9imMVz5N
DB_NAME=u796903731_ilwashop
DB_DIALECT=mysql

# Admin Authentication
JWT_SECRET=ILWASHOP_9f1c6d3e5b8a7f4e2c9d1a0b3e6f8a91

# Site Configuration
NEXT_PUBLIC_SITE_NAME=Ilwa Shop
NEXT_PUBLIC_SITE_PHONE=+1234567890

# Environment
NODE_ENV=production
EOF
echo -e "   ${GREEN}✓${NC} Site 2 .env.local created"

echo ""

# Step 5: Install dependencies and build
echo -e "${BLUE}📦 Step 5: Installing dependencies and building...${NC}"

echo "   → Building sunnah-shop.online..."
cd "$SITE1_PATH"
npm install --production
npm run build
echo -e "   ${GREEN}✓${NC} Site 1 built successfully"

echo "   → Building ilwashop.com..."
cd "$SITE2_PATH"
npm install --production
npm run build
echo -e "   ${GREEN}✓${NC} Site 2 built successfully"

echo ""

# Step 6: Initialize databases
echo -e "${BLUE}🗄️  Step 6: Initializing databases...${NC}"

echo "   → Initializing database for sunnah-shop.online..."
cd "$SITE1_PATH"
node init-db.js
echo -e "   ${GREEN}✓${NC} Site 1 database initialized"

echo "   → Initializing database for ilwashop.com..."
cd "$SITE2_PATH"
node init-db.js
echo -e "   ${GREEN}✓${NC} Site 2 database initialized"

echo ""

# Step 7: Make deployment script executable
echo -e "${BLUE}🔧 Step 7: Setting up deployment script...${NC}"
chmod +x ~/deploy-both-sites.sh
echo -e "${GREEN}✓ Deployment script is ready at ~/deploy-both-sites.sh${NC}"

echo ""
echo "=========================================="
echo -e "${GREEN}🎉 Setup Complete!${NC}"
echo "=========================================="
echo ""
echo "✅ Both sites are now deployed:"
echo "   • https://sunnah-shop.online"
echo "   • https://ilwashop.com"
echo ""
echo "📋 Next steps:"
echo "   • Test both sites in your browser"
echo "   • To deploy updates: ~/deploy-both-sites.sh"
echo "   • Backups saved in: ~/backups/"
echo ""

#!/bin/bash

# 🚀 Deploy to Both Hostinger Sites
# This script updates both sunnah-shop.online and ilwashop.com from the same Git repository

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}🚀 Multi-Site Deployment Started${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Function to deploy a single site
deploy_site() {
    local site_name=$1
    local site_path=$2
    
    echo -e "${YELLOW}📦 Deploying ${site_name}...${NC}"
    
    # Check if directory exists
    if [ ! -d "$site_path" ]; then
        echo -e "${RED}❌ Error: Directory $site_path does not exist${NC}"
        return 1
    fi
    
    # Navigate to site directory
    cd "$site_path" || return 1
    
    # Pull latest code
    echo "   → Pulling latest code from Git..."
    if git pull origin main; then
        echo -e "   ${GREEN}✓${NC} Code updated"
    else
        echo -e "   ${RED}✗${NC} Git pull failed"
        return 1
    fi
    
    # Install dependencies (only if package.json changed)
    echo "   → Installing dependencies..."
    if npm install; then
        echo -e "   ${GREEN}✓${NC} Dependencies installed"
    else
        echo -e "   ${RED}✗${NC} npm install failed"
        return 1
    fi
    
    # Build the application
    echo "   → Building application..."
    if npm run build; then
        echo -e "   ${GREEN}✓${NC} Build successful"
    else
        echo -e "   ${RED}✗${NC} Build failed"
        return 1
    fi
    
    echo -e "${GREEN}✅ ${site_name} deployed successfully!${NC}"
    echo ""
    return 0
}

# Deploy Site 1: sunnah-shop.online
deploy_site "sunnah-shop.online" "$HOME/domains/sunnah-shop.online/public_html"
SITE1_STATUS=$?

# Deploy Site 2: ilwashop.com
deploy_site "ilwashop.com" "$HOME/domains/ilwashop.com/public_html"
SITE2_STATUS=$?

# Summary
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}📊 Deployment Summary${NC}"
echo -e "${BLUE}========================================${NC}"

if [ $SITE1_STATUS -eq 0 ]; then
    echo -e "sunnah-shop.online: ${GREEN}✅ Success${NC}"
else
    echo -e "sunnah-shop.online: ${RED}❌ Failed${NC}"
fi

if [ $SITE2_STATUS -eq 0 ]; then
    echo -e "ilwashop.com:       ${GREEN}✅ Success${NC}"
else
    echo -e "ilwashop.com:       ${RED}❌ Failed${NC}"
fi

echo ""

# Exit with error if any deployment failed
if [ $SITE1_STATUS -ne 0 ] || [ $SITE2_STATUS -ne 0 ]; then
    echo -e "${RED}⚠️  Some deployments failed. Please check the errors above.${NC}"
    exit 1
else
    echo -e "${GREEN}🎉 All sites deployed successfully!${NC}"
    exit 0
fi

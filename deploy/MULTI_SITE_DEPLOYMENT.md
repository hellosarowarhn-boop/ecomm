# 🚀 Multi-Site Deployment Guide
## Deploy One Codebase to Two Hostinger Sites

This guide shows you how to manage **one codebase** deployed to **two different domains** with **different databases**, all synced via Git.

---

## 📋 Overview

**Your Setup:**
- **Local Development**: `c:\Users\Saro\Desktop\Site\Ecom`
- **Site 1**: sunnah-shop.online (Database: `u796903731_sunnahshop`)
- **Site 2**: ilwashop.com (Database: `u796903731_ilwashop`)
- **Shared Git Repository**: One GitHub repo for both sites

**How It Works:**
1. You develop locally and push to GitHub
2. Both Hostinger sites pull the latest code from GitHub
3. Each site has its own `.env.local` file (NOT in Git) with unique database credentials
4. No conflicts because environment files are gitignored

---

## 🔧 Initial Setup (One-Time)

### Step 1: Prepare Your Local Repository

1. **Ensure `.env.local` is in `.gitignore`:**
   ```bash
   # Check if .env.local is ignored
   cat .gitignore | grep .env.local
   ```
   
   If not present, add it:
   ```bash
   echo ".env.local" >> .gitignore
   ```

2. **Commit and push your code:**
   ```powershell
   cd C:\Users\Saro\Desktop\Site\Ecom
   git add .
   git commit -m "Prepare for multi-site deployment"
   git push origin main
   ```

---

### Step 2: Setup Site 1 (sunnah-shop.online)

**SSH into your Hostinger server:**
```bash
ssh -p 65002 u796903731@82.25.83.153
```

**Clone the repository for Site 1:**
```bash
# Navigate to the directory for sunnah-shop
cd ~/domains/sunnah-shop.online/public_html

# Clone your repository (replace with your actual GitHub repo URL)
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git .

# Install dependencies
npm install
```

**Create Site 1's environment file:**
```bash
nano .env.local
```

**Paste these credentials for sunnah-shop.online:**
```env
# Database Configuration
DB_HOST=localhost
DB_USER=u796903731_sunnahshopsaro
DB_PASSWORD=kKt@CA39yI$@mg
DB_NAME=u796903731_sunnahshop

# App Configuration
NEXTAUTH_SECRET=SUNNAHSHOP_8a0b5c2f4d9e4f2aa1d8b7c6110e3a91
NEXTAUTH_URL=https://sunnah-shop.online

# Environment
NODE_ENV=production
```

**Save:** Press `Ctrl+O`, `Enter`, then `Ctrl+X`

**Build and initialize:**
```bash
npm run build
node init-db.js
```

---

### Step 3: Setup Site 2 (ilwashop.com)

**In the same SSH session (or reconnect):**
```bash
# Navigate to the directory for ilwashop
cd ~/domains/ilwashop.com/public_html

# Clone the SAME repository
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git .

# Install dependencies
npm install
```

**Create Site 2's environment file:**
```bash
nano .env.local
```

**Paste these credentials for ilwashop.com:**
```env
# Database Configuration
DB_HOST=localhost
DB_USER=u796903731_ilwashopsaro
DB_PASSWORD=%A&%0S9imMVz5N
DB_NAME=u796903731_ilwashop

# App Configuration
NEXTAUTH_SECRET=ILWASHOP_9f1c6d3e5b8a7f4e2c9d1a0b3e6f8a91
NEXTAUTH_URL=https://ilwashop.com

# Environment
NODE_ENV=production
```

**Save:** Press `Ctrl+O`, `Enter`, then `Ctrl+X`

**Build and initialize:**
```bash
npm run build
node init-db.js
```

---

## 🔄 Daily Workflow: Making Updates

### On Your Local Machine

1. **Make your changes** (edit code, add features, etc.)

2. **Test locally:**
   ```powershell
   cd C:\Users\Saro\Desktop\Site\Ecom
   npm run dev
   ```
   Visit `http://localhost:3000` to test

3. **Commit and push to GitHub:**
   ```powershell
   git add .
   git commit -m "Description of your changes"
   git push origin main
   ```

---

### Update Both Sites on Hostinger

**Option A: Manual Update (Recommended for now)**

SSH into your server and run these commands:

```bash
# Update Site 1 (sunnah-shop.online)
cd ~/domains/sunnah-shop.online/public_html
git pull origin main
npm install  # Only if you added new packages
npm run build

# Update Site 2 (ilwashop.com)
cd ~/domains/ilwashop.com/public_html
git pull origin main
npm install  # Only if you added new packages
npm run build
```

**Option B: Automated Script (Advanced)**

Create a deployment script that updates both sites at once. See the "Automated Deployment" section below.

---

## 🤖 Automated Deployment (Optional)

### Create a Deployment Script

**On your Hostinger server, create this script:**
```bash
nano ~/deploy-both-sites.sh
```

**Paste this content:**
```bash
#!/bin/bash

echo "🚀 Deploying to both sites..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Site 1: sunnah-shop.online
echo -e "${BLUE}📦 Updating sunnah-shop.online...${NC}"
cd ~/domains/sunnah-shop.online/public_html
git pull origin main
npm install
npm run build
echo -e "${GREEN}✅ sunnah-shop.online updated!${NC}"

# Site 2: ilwashop.com
echo -e "${BLUE}📦 Updating ilwashop.com...${NC}"
cd ~/domains/ilwashop.com/public_html
git pull origin main
npm install
npm run build
echo -e "${GREEN}✅ ilwashop.com updated!${NC}"

echo -e "${GREEN}🎉 Both sites deployed successfully!${NC}"
```

**Make it executable:**
```bash
chmod +x ~/deploy-both-sites.sh
```

**Now you can deploy to both sites with one command:**
```bash
~/deploy-both-sites.sh
```

---

## 🔐 Important Security Notes

### Files That Should NEVER Be in Git:
- `.env.local` ✅ (Already in .gitignore)
- `node_modules/` ✅ (Already in .gitignore)
- `.next/` ✅ (Build folder, already in .gitignore)

### Files That SHOULD Be in Git:
- All source code (`.ts`, `.tsx`, `.js` files)
- `package.json` and `package-lock.json`
- Configuration files (`next.config.ts`, `tsconfig.json`, etc.)
- Documentation files

---

## 🧪 Testing Your Setup

### Test Local Development:
```powershell
cd C:\Users\Saro\Desktop\Site\Ecom
npm run dev
```
- Should connect to your local database (root/1234)
- Visit `http://localhost:3000`

### Test Site 1 (sunnah-shop.online):
- Visit `https://sunnah-shop.online`
- Should connect to `u796903731_sunnahshop` database
- Test login, orders, etc.

### Test Site 2 (ilwashop.com):
- Visit `https://ilwashop.com`
- Should connect to `u796903731_ilwashop` database
- Test login, orders, etc.

---

## 🐛 Troubleshooting

### Problem: "Database connection failed" after deployment
**Solution:** Check that `.env.local` exists and has correct credentials
```bash
cd ~/domains/sunnah-shop.online/public_html
cat .env.local  # Verify credentials
```

### Problem: Changes not appearing after `git pull`
**Solution:** Clear Next.js cache and rebuild
```bash
rm -rf .next
npm run build
```

### Problem: "Permission denied" when running git commands
**Solution:** Ensure you own the files
```bash
cd ~/domains/sunnah-shop.online/public_html
ls -la  # Check file ownership
```

### Problem: Sites showing different content
**Solution:** This is normal! Each site has its own database. They share code but not data.

---

## 📝 Quick Reference Commands

### Local Development:
```powershell
# Start dev server
npm run dev

# Commit changes
git add .
git commit -m "Your message"
git push origin main
```

### Deploy to Both Sites:
```bash
# SSH into server
ssh -p 65002 u796903731@82.25.83.153

# Run deployment script
~/deploy-both-sites.sh
```

### Manual Deploy to One Site:
```bash
cd ~/domains/sunnah-shop.online/public_html
git pull origin main
npm run build
```

---

## ✅ Checklist: Is Everything Working?

- [ ] Local site runs with `npm run dev`
- [ ] `.env.local` is in `.gitignore`
- [ ] Code is pushed to GitHub
- [ ] Site 1 (sunnah-shop.online) is cloned and has its own `.env.local`
- [ ] Site 2 (ilwashop.com) is cloned and has its own `.env.local`
- [ ] Both sites build successfully
- [ ] Both sites connect to their respective databases
- [ ] Deployment script works (optional)

---

## 🎯 Summary

**Your Workflow:**
1. **Develop locally** → Test with local database (root/1234)
2. **Push to GitHub** → `git push origin main`
3. **Deploy to both sites** → Run `~/deploy-both-sites.sh` on server
4. **Each site uses its own database** → No conflicts!

**Key Points:**
- ✅ One codebase, multiple deployments
- ✅ Each site has unique `.env.local` (not in Git)
- ✅ No conflicts between sites
- ✅ Easy to update both sites simultaneously
- ✅ Local development works independently

---

**Need Help?** Check the troubleshooting section or review your `.env.local` files on each site.

---
description: Deploy updates to both Hostinger sites
---

# 🚀 Deploy to Both Sites Workflow

This workflow deploys your latest code changes to both sunnah-shop.online and ilwashop.com.

## Prerequisites
- Code changes are committed locally
- You have SSH access to Hostinger server

---

## Step 1: Test Locally

Make sure your changes work on your local machine:

```powershell
cd C:\Users\Saro\Desktop\Site\Ecom
npm run dev
```

Visit `http://localhost:3000` and test your changes.

---

## Step 2: Commit and Push to GitHub

```powershell
cd C:\Users\Saro\Desktop\Site\Ecom
git add .
git commit -m "Describe your changes here"
git push origin main
```

---

## Step 3: Deploy to Both Sites

### Option A: Automated (Recommended)

SSH into your server and run the deployment script:

```bash
ssh -p 65002 u796903731@82.25.83.153
~/deploy-both-sites.sh
```

### Option B: Manual Deployment

If you need to deploy to sites individually:

**For sunnah-shop.online:**
```bash
ssh -p 65002 u796903731@82.25.83.153
cd ~/domains/sunnah-shop.online/public_html
git pull origin main
npm install
npm run build
```

**For ilwashop.com:**
```bash
ssh -p 65002 u796903731@82.25.83.153
cd ~/domains/ilwashop.com/public_html
git pull origin main
npm install
npm run build
```

---

## Step 4: Verify Deployment

Visit both sites to confirm changes are live:
- https://sunnah-shop.online
- https://ilwashop.com

---

## Troubleshooting

### If deployment script doesn't exist:

```bash
# Upload the script to server
scp -P 65002 C:\Users\Saro\Desktop\Site\Ecom\deploy\deploy-both-sites.sh u796903731@82.25.83.153:~/

# Make it executable
ssh -p 65002 u796903731@82.25.83.153
chmod +x ~/deploy-both-sites.sh
```

### If build fails:

```bash
# Clear cache and rebuild
cd ~/domains/sunnah-shop.online/public_html
rm -rf .next
npm run build
```

### If database connection fails:

```bash
# Verify .env.local exists and has correct credentials
cd ~/domains/sunnah-shop.online/public_html
cat .env.local
```

---

## Quick Commands Reference

**Local Development:**
```powershell
npm run dev          # Start dev server
git status           # Check changes
git add .            # Stage all changes
git commit -m "msg"  # Commit changes
git push origin main # Push to GitHub
```

**Server Deployment:**
```bash
~/deploy-both-sites.sh  # Deploy to both sites
```

# 🎯 FINAL SETUP GUIDE - Complete Both Sites on Hostinger

## ✅ What's Already Done

1. ✅ **Local site running** at http://localhost:3000
2. ✅ **GitHub updated** with all necessary files including `server.js`
3. ✅ **Site 1 (sunnah-shop.online)** - Code cloned, .env.local created
4. ✅ **Deployment scripts** ready

---

## 🚀 Complete Setup - Follow These Steps

### Step 1: Pull Latest Code to Site 1

Since we just pushed new files (server.js), let's update site 1:

**SSH Command:**
```bash
ssh -p 65002 u796903731@82.25.83.153
cd ~/domains/sunnah-shop.online/public_html
git pull origin main
```

---

### Step 2: Setup Site 2 (ilwashop.com) via SSH

**Run these commands in SSH:**

```bash
# Clean up site 2
cd ~/domains/ilwashop.com/public_html
rm -rf * .[!.]* 2>/dev/null

# Clone repository
git clone https://github.com/hellosarowarhn-boop/ecomm.git .

# Create .env.local
cat > .env.local << 'EOF'
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

echo "Site 2 setup complete!"
```

---

### Step 3: Setup Node.js Apps in hPanel

Now you need to configure both sites in Hostinger's control panel:

#### For Site 1 (sunnah-shop.online):

1. **Go to**: https://hpanel.hostinger.com/
2. **Login** with your Hostinger credentials
3. **Navigate to**: Advanced → **Node.js**
4. **Click**: "Create Application" or "Setup Node.js App"
5. **Fill in the form**:
   ```
   Application mode: Production
   Application root: domains/sunnah-shop.online/public_html
   Application URL: https://sunnah-shop.online
   Application startup file: server.js
   Node.js version: 18.x or 20.x (latest LTS)
   ```
6. **Click**: "Create" or "Save"
7. **Wait** for the app to be created (this enables npm/node in SSH)

#### For Site 2 (ilwashop.com):

1. **Repeat the same process**
2. **Fill in the form**:
   ```
   Application mode: Production
   Application root: domains/ilwashop.com/public_html
   Application URL: https://ilwashop.com
   Application startup file: server.js
   Node.js version: 18.x or 20.x (same as site 1)
   ```
3. **Click**: "Create" or "Save"

---

### Step 4: Install Dependencies & Build (via hPanel)

After creating the Node.js apps, hPanel should show options to:

1. **Run npm install** - Click this button for both sites
2. **Run npm build** - Click this button for both sites

**OR** if there's a terminal/command option in hPanel:

For Site 1:
```bash
cd ~/domains/sunnah-shop.online/public_html
npm install
npm run build
node init-db.js
```

For Site 2:
```bash
cd ~/domains/ilwashop.com/public_html
npm install
npm run build
node init-db.js
```

---

### Step 5: Start Both Applications

In hPanel Node.js manager:

1. Find both applications
2. Click "Start" or "Restart" for each one
3. Check that status shows "Running"

---

## 🎉 Verification

### Test Your Sites:

1. **Site 1**: https://sunnah-shop.online
2. **Site 2**: https://ilwashop.com

Both should now be live!

---

## 🔄 Future Updates - Your Workflow

### When you make changes:

**On your local machine:**
```powershell
cd C:\Users\Saro\Desktop\Site\Ecom

# Make your changes, test locally
npm run dev

# Commit and push
git add .
git commit -m "Your changes"
git push origin main
```

**On the server (SSH):**
```bash
ssh -p 65002 u796903731@82.25.83.153

# Update both sites
cd ~/domains/sunnah-shop.online/public_html
git pull origin main
npm run build

cd ~/domains/ilwashop.com/public_html
git pull origin main
npm run build
```

**Or use the deployment script:**
```bash
~/deploy-both-sites.sh
```

---

## 📋 Quick Reference

### SSH Access:
```
Host: 82.25.83.153
Port: 65002
Username: u796903731
Password: p#4LSTsp4*UL0D
```

### Site Paths:
```
Site 1: ~/domains/sunnah-shop.online/public_html
Site 2: ~/domains/ilwashop.com/public_html
```

### Important Commands:
```bash
# Connect to server
ssh -p 65002 u796903731@82.25.83.153

# Update both sites
~/deploy-both-sites.sh

# Check site status
cd ~/domains/sunnah-shop.online/public_html && git status
cd ~/domains/ilwashop.com/public_html && git status
```

---

## 🆘 Troubleshooting

### Problem: "npm: command not found" in SSH
**Solution**: You need to create the Node.js app in hPanel first. This enables npm in SSH.

### Problem: Site shows 503 error
**Solution**: 
1. Check Node.js app status in hPanel
2. Click "Restart" on the application
3. Check error logs in hPanel

### Problem: Database connection error
**Solution**: 
1. Verify .env.local exists: `cat ~/domains/sunnah-shop.online/public_html/.env.local`
2. Check database credentials in hPanel → MySQL Databases
3. Run `node init-db.js` to initialize the database

### Problem: Changes not showing after git pull
**Solution**:
```bash
cd ~/domains/sunnah-shop.online/public_html
rm -rf .next
npm run build
```
Then restart the app in hPanel.

---

## ✅ Checklist

- [ ] Site 1 code updated with `git pull`
- [ ] Site 2 cleaned and cloned
- [ ] Site 2 .env.local created
- [ ] Node.js app created for Site 1 in hPanel
- [ ] Node.js app created for Site 2 in hPanel
- [ ] Dependencies installed for both sites
- [ ] Both sites built successfully
- [ ] Databases initialized for both sites
- [ ] Both sites started in hPanel
- [ ] Site 1 accessible at https://sunnah-shop.online
- [ ] Site 2 accessible at https://ilwashop.com

---

## 🎯 Summary

**Your Setup:**
- **One codebase** → Deployed to two sites
- **Different databases** → No conflicts
- **Easy updates** → Push to GitHub, pull on server
- **Local development** → Works independently

**Next time you update:**
1. Make changes locally
2. Test with `npm run dev`
3. Push to GitHub
4. SSH in and run `~/deploy-both-sites.sh`
5. Both sites update automatically!

---

**Need help with hPanel?** The key is setting up the Node.js applications first - this unlocks all the npm/node commands you need!

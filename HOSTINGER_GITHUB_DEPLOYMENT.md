# 🚀 Hostinger GitHub Deployment Setup

You're using Hostinger's modern GitHub deployment system - this is MUCH easier than SSH!

---

## ✅ Current Status - Site 1 (sunnah-shop.online)

I can see from your screenshots:
- ✅ Repository connected: `ecomm`
- ✅ Branch: `main`
- ✅ Framework: Next.js (auto-detected)
- ✅ Node version: 20.x
- ✅ Build command: `npm run build`
- ✅ Deployment: Completed
- ⚠️ **Environment Variables: None** ← **This needs to be fixed!**

---

## 🔧 Step 1: Add Environment Variables for Site 1

Your site won't work without database credentials. Here's what to do:

### In the "Settings and redeploy" page you showed:

1. **Scroll to "Environment Variables"**
2. **Click "Add"**
3. **Add these variables ONE BY ONE:**

```
DB_HOST = localhost
DB_USER = u796903731_sunnahshopsaro
DB_PASSWORD = kKt@CA39yI$@mg
DB_NAME = u796903731_sunnahshop
DB_DIALECT = mysql
JWT_SECRET = SUNNAHSHOP_8a0b5c2f4d9e4f2aa1d8b7c6110e3a91
NEXT_PUBLIC_SITE_NAME = Sunnah Shop
NEXT_PUBLIC_SITE_PHONE = +1234567890
NODE_ENV = production
```

**Important:** Add each variable separately by clicking "Add" for each one.

4. **After adding all variables, click "Save and redeploy"**

This will rebuild your site with the correct database connection!

---

## 🔧 Step 2: Initialize Database for Site 1

After the deployment completes with environment variables:

### Option A: Via Browser (Easiest!)

1. **Deploy the site** (Step 1 above)
2. **Wait for deployment to finish**
3. **Visit this URL in your browser:**
   `https://sunnah-shop.online/api/init-db`
4. You should see: `{"success":true,"message":"Database initialized successfully..."}`

### Option B: Via SSH (Advanced)

If the browser method fails, you can use SSH, but you must use the internal API route via curl since `node init-db.js` requires TypeScript setup:

```bash
ssh -p 65002 u796903731@82.25.83.153
curl http://localhost:3000/api/init-db
```

---

## 🚀 Step 3: Setup Site 2 (ilwashop.com)

Now let's set up your second site the same way:

### In Hostinger hPanel:

1. **Go to**: Websites → **ilwashop.com**
2. **Look for**: GitHub deployment or similar deployment option
3. **Click**: "Connect to GitHub" or "Deploy from GitHub"
4. **Select**:
   - Repository: `hellosarowarhn-boop/ecomm`
   - Branch: `main`
   - Framework: Next.js (should auto-detect)
   - Build command: `npm run build`
   - Output directory: `.next`

5. **Add Environment Variables** (BEFORE first deployment):

```
DB_HOST = localhost
DB_USER = u796903731_ilwashopsaro
DB_PASSWORD = %A&%0S9imMVz5N
DB_NAME = u796903731_ilwashop
DB_DIALECT = mysql
JWT_SECRET = ILWASHOP_9f1c6d3e5b8a7f4e2c9d1a0b3e6f8a91
NEXT_PUBLIC_SITE_NAME = Ilwa Shop
NEXT_PUBLIC_SITE_PHONE = +1234567890
NODE_ENV = production
```

6. **Click**: "Deploy" or "Save and deploy"
7. **Initialize Database**:
   - Wait for deployment to finish.
   - Visit: `https://ilwashop.com/api/init-db`
   - Check for success message.

---

## 🎯 How This Works

### Automatic Deployment:

With this setup, every time you push to GitHub:

```powershell
# On your local machine
cd C:\Users\Saro\Desktop\Site\Ecom
git add .
git commit -m "Your changes"
git push origin main
```

**Both sites will automatically rebuild and deploy!** 🎉

No need to SSH in, no need to run commands manually. Hostinger watches your GitHub repository and deploys automatically.

---

## 🔄 Your New Workflow

### Daily Development:

1. **Develop locally:**
   ```powershell
   npm run dev  # Test at localhost:3000
   ```

2. **Commit and push:**
   ```powershell
   git add .
   git commit -m "Your changes"
   git push origin main
   ```

3. **Wait 1-2 minutes** - Both sites auto-deploy! ✨

4. **Check deployment status** in hPanel

---

## ✅ Advantages of This Setup

✅ **Automatic deployments** - No manual SSH needed
✅ **Build logs** - See what went wrong if deployment fails
✅ **Rollback** - Can revert to previous deployments
✅ **Environment variables** - Managed in UI, not in files
✅ **Same code, different configs** - Perfect for your two sites
✅ **No conflicts** - Each site has its own environment variables

---

## 🐛 Troubleshooting

### Problem: Site shows error after deployment
**Check:**
1. Build logs in hPanel (like you showed in screenshot)
2. Make sure all environment variables are added
3. Database credentials are correct

### Problem: Database connection failed
**Solution:**
1. Verify environment variables are set correctly
2. Run `init-db.js` to create tables:
   ```bash
   ssh -p 65002 u796903731@82.25.83.153
   # Navigate to deployment directory
   node init-db.js
   ```

### Problem: Changes not showing
**Solution:**
1. Check deployment status in hPanel
2. Look at build logs
3. Make sure git push was successful
4. Try "Redeploy" button in hPanel

---

## 📋 Checklist for Complete Setup

### Site 1 (sunnah-shop.online):
- [x] Repository connected
- [x] Deployment completed
- [ ] Environment variables added (DO THIS NOW!)
- [ ] Database initialized with `init-db.js`
- [ ] Site tested and working

### Site 2 (ilwashop.com):
- [ ] GitHub deployment configured
- [ ] Environment variables added
- [ ] First deployment completed
- [ ] Database initialized with `init-db.js`
- [ ] Site tested and working

---

## 🎯 Next Steps - DO THIS NOW:

1. **Add environment variables to Site 1** (in the screenshot you showed)
2. **Click "Save and redeploy"**
3. **Wait for deployment to complete**
4. **Test**: https://sunnah-shop.online
5. **Setup Site 2** the same way
6. **Initialize databases** for both sites via SSH

---

**This is MUCH better than the SSH approach I was planning!** With GitHub deployments, you get automatic builds, easy rollbacks, and a nice UI to manage everything. Just add those environment variables and you're golden! 🚀

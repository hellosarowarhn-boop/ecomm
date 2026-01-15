# 🎯 Hostinger Setup Guide - Using hPanel

Since Hostinger shared hosting requires Node.js apps to be configured through the control panel, follow these steps:

---

## ✅ What We've Done So Far

1. ✅ **Cleaned up sunnah-shop.online** - Old files removed
2. ✅ **Cloned fresh code from GitHub** to sunnah-shop.online
3. ✅ **Created .env.local** for sunnah-shop.online with correct database credentials

---

## 🚀 Next Steps - Complete Setup via hPanel

### Step 1: Setup Node.js App for Site 1 (sunnah-shop.online)

1. **Go to hPanel**: https://hpanel.hostinger.com/
2. **Navigate to**: Advanced → **Node.js**
3. **Click**: "Create Application"
4. **Configure**:
   - **Application mode**: Production
   - **Application root**: `domains/sunnah-shop.online/public_html`
   - **Application URL**: `https://sunnah-shop.online`
   - **Application startup file**: `server.js` (we'll create this)
   - **Node.js version**: 18.x or higher
5. **Click**: "Create"

### Step 2: Create server.js File

The Node.js app needs a `server.js` file. We need to create this file in the repository.

**On your local machine (PowerShell):**

```powershell
cd C:\Users\Saro\Desktop\Site\Ecom
```

Create `server.js` with this content (I'll do this for you next).

### Step 3: Repeat for Site 2 (ilwashop.com)

We need to:
1. Clean up ilwashop.com
2. Clone the repository
3. Create .env.local
4. Setup Node.js app in hPanel

---

## 🔧 Alternative: Use Hostinger's Git Integration

Hostinger has built-in Git integration which is MUCH easier:

### For Site 1 (sunnah-shop.online):

1. **Go to hPanel** → **Git** (under Advanced)
2. **Click**: "Create new repository"
3. **Configure**:
   - **Repository URL**: `https://github.com/hellosarowarhn-boop/ecomm.git`
   - **Branch**: `main`
   - **Target directory**: `domains/sunnah-shop.online/public_html`
4. **Click**: "Pull" to clone the repository

### For Site 2 (ilwashop.com):

1. **Repeat the same process**
2. **Target directory**: `domains/ilwashop.com/public_html`

---

## 📝 Current Status

### ✅ Completed:
- Local site running at http://localhost:3000
- GitHub repository updated with deployment scripts
- Site 1 (sunnah-shop.online) cleaned and cloned

### 🔄 Needs to be done via hPanel:
1. Setup Node.js app for sunnah-shop.online
2. Clean and setup ilwashop.com
3. Setup Node.js app for ilwashop.com
4. Install dependencies via hPanel Node.js manager
5. Build both sites

---

## 💡 Recommended Approach

Since SSH doesn't have npm/node available directly, use **hPanel's Node.js Manager**:

1. **Clean up both sites** (already done for site 1)
2. **Use hPanel Git integration** to clone repositories
3. **Create .env.local files** via hPanel File Manager
4. **Setup Node.js apps** via hPanel Node.js Manager
5. **Let hPanel handle** npm install and build

---

## 🎯 What I'll Do Next

I'll create:
1. A `server.js` file for Next.js to run on Hostinger
2. Step-by-step instructions for hPanel setup
3. A script to finish setting up site 2 (ilwashop.com)

Would you like me to:
- **A)** Create the necessary files and give you hPanel instructions
- **B)** Create a video/screenshot guide for hPanel setup
- **C)** Continue with SSH commands (requires Node.js to be enabled first in hPanel)

---

## 🆘 Quick Fix - Enable Node.js First

**Before we can continue with SSH:**

1. Go to hPanel → Node.js
2. Create a Node.js application for sunnah-shop.online
3. This will enable npm/node commands in SSH
4. Then we can run the build commands

**The issue**: Hostinger doesn't have Node.js in the default SSH PATH until you create a Node.js app in hPanel first.

---

**Current recommendation**: Let me create the server.js file and give you exact hPanel steps to complete the setup. This is the easiest way for Hostinger shared hosting.

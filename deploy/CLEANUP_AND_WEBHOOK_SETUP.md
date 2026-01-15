# 🧹 Cleanup Old Files & Setup Webhooks

This guide will help you:
1. Clean up old files from GitHub repository
2. Clean up old files from Hostinger hosting
3. Setup automatic deployment with webhooks

---

## Part 1: Clean Up GitHub Repository

### Step 1: Check What's in Your GitHub Repo

First, let's see what files are currently in your GitHub repository:

```powershell
cd C:\Users\Saro\Desktop\Site\Ecom
git ls-files
```

This shows all files tracked by Git.

### Step 2: Remove Unwanted Files from Git

If you have old/unwanted files in Git, remove them:

```powershell
# Remove a specific file
git rm path/to/unwanted-file.txt
git commit -m "Remove unwanted file"

# Remove a directory
git rm -r path/to/unwanted-directory/
git commit -m "Remove unwanted directory"

# Remove multiple files at once
git rm file1.txt file2.txt file3.txt
git commit -m "Remove old files"
```

### Step 3: Clean Up Git History (Optional - Nuclear Option)

⚠️ **WARNING**: This removes ALL history and creates a fresh start. Only do this if you want to completely clean your repository.

```powershell
cd C:\Users\Saro\Desktop\Site\Ecom

# Create a new branch with current state
git checkout --orphan fresh-start

# Add all current files
git add .

# Commit
git commit -m "Fresh start - clean repository"

# Delete old main branch
git branch -D main

# Rename current branch to main
git branch -m main

# Force push to GitHub (overwrites everything)
git push -f origin main
```

### Step 4: Push Changes to GitHub

```powershell
git push origin main
```

---

## Part 2: Clean Up Hostinger Server

### Step 1: Connect to Your Server

```bash
ssh -p 65002 u796903731@82.25.83.153
```

### Step 2: Backup Current Sites (Safety First!)

```bash
# Create backup directory
mkdir -p ~/backups

# Backup sunnah-shop.online
cd ~/domains/sunnah-shop.online
tar -czf ~/backups/sunnah-shop-backup-$(date +%Y%m%d).tar.gz public_html/

# Backup ilwashop.com
cd ~/domains/ilwashop.com
tar -czf ~/backups/ilwashop-backup-$(date +%Y%m%d).tar.gz public_html/
```

### Step 3: Clean Up Site 1 (sunnah-shop.online)

```bash
# Navigate to site directory
cd ~/domains/sunnah-shop.online/public_html

# Save your .env.local file first!
cp .env.local ~/backups/sunnah-shop.env.local

# Remove everything except .env.local
find . -mindepth 1 ! -name '.env.local' -delete

# OR if you want to start completely fresh:
cd ~/domains/sunnah-shop.online
rm -rf public_html/*
rm -rf public_html/.[!.]*  # Remove hidden files too

# Restore .env.local
cp ~/backups/sunnah-shop.env.local public_html/.env.local
```

### Step 4: Clean Up Site 2 (ilwashop.com)

```bash
# Navigate to site directory
cd ~/domains/ilwashop.com/public_html

# Save your .env.local file first!
cp .env.local ~/backups/ilwashop.env.local

# Remove everything except .env.local
find . -mindepth 1 ! -name '.env.local' -delete

# OR if you want to start completely fresh:
cd ~/domains/ilwashop.com
rm -rf public_html/*
rm -rf public_html/.[!.]*  # Remove hidden files too

# Restore .env.local
cp ~/backups/ilwashop.env.local public_html/.env.local
```

### Step 5: Fresh Clone from GitHub

Now clone your clean repository to both sites:

```bash
# Clone to sunnah-shop.online
cd ~/domains/sunnah-shop.online/public_html
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git .
cp ~/backups/sunnah-shop.env.local .env.local
npm install
npm run build
node init-db.js

# Clone to ilwashop.com
cd ~/domains/ilwashop.com/public_html
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git .
cp ~/backups/ilwashop.env.local .env.local
npm install
npm run build
node init-db.js
```

---

## Part 3: Setup Automatic Deployment with Webhooks

### What are Webhooks?

Webhooks allow GitHub to automatically notify your server when you push code. Your server can then automatically pull the latest changes and rebuild.

### Option A: GitHub Webhooks (Recommended)

#### Step 1: Create Webhook Script on Server

SSH into your server and create a webhook handler:

```bash
ssh -p 65002 u796903731@82.25.83.153
nano ~/webhook-handler.php
```

Paste this PHP script:

```php
<?php
// GitHub Webhook Handler for Multi-Site Deployment
// This script deploys to both sites when you push to GitHub

// Security: Set a secret token (change this!)
$secret = "your_webhook_secret_key_change_this";

// Get the payload
$payload = file_get_contents('php://input');
$signature = $_SERVER['HTTP_X_HUB_SIGNATURE_256'] ?? '';

// Verify signature (security)
if ($signature) {
    $hash = 'sha256=' . hash_hmac('sha256', $payload, $secret);
    if (!hash_equals($hash, $signature)) {
        http_response_code(403);
        die('Invalid signature');
    }
}

// Log the deployment
$logFile = __DIR__ . '/webhook-deploy.log';
$timestamp = date('Y-m-d H:i:s');
file_put_contents($logFile, "[$timestamp] Webhook received\n", FILE_APPEND);

// Deploy to both sites
$output = shell_exec('bash ~/deploy-both-sites.sh 2>&1');
file_put_contents($logFile, "[$timestamp] Output: $output\n", FILE_APPEND);

// Return success
http_response_code(200);
echo json_encode(['status' => 'success', 'message' => 'Deployment triggered']);
?>
```

Save: `Ctrl+O`, `Enter`, `Ctrl+X`

#### Step 2: Make Webhook Accessible

```bash
# Move to a web-accessible location
mkdir -p ~/domains/sunnah-shop.online/public_html/webhook
mv ~/webhook-handler.php ~/domains/sunnah-shop.online/public_html/webhook/deploy.php
chmod 755 ~/domains/sunnah-shop.online/public_html/webhook/deploy.php
```

#### Step 3: Upload Deployment Script

```bash
# Upload the deployment script from your local machine
# On your Windows machine (PowerShell):
```

```powershell
scp -P 65002 C:\Users\Saro\Desktop\Site\Ecom\deploy\deploy-both-sites.sh u796903731@82.25.83.153:~/
```

Then on the server:

```bash
chmod +x ~/deploy-both-sites.sh
```

#### Step 4: Configure GitHub Webhook

1. Go to your GitHub repository
2. Click **Settings** → **Webhooks** → **Add webhook**
3. Set **Payload URL**: `https://sunnah-shop.online/webhook/deploy.php`
4. Set **Content type**: `application/json`
5. Set **Secret**: `your_webhook_secret_key_change_this` (same as in PHP script)
6. Select **Just the push event**
7. Click **Add webhook**

#### Step 5: Test the Webhook

```powershell
# On your local machine, make a test change
cd C:\Users\Saro\Desktop\Site\Ecom
echo "# Test" >> README.md
git add README.md
git commit -m "Test webhook deployment"
git push origin main
```

Wait 30 seconds, then check if both sites updated automatically!

---

### Option B: Simple Cron Job (Alternative)

If webhooks are too complex, use a cron job that checks for updates every 5 minutes:

```bash
# On your server
crontab -e
```

Add this line:

```bash
*/5 * * * * cd ~/domains/sunnah-shop.online/public_html && git fetch && [ $(git rev-parse HEAD) != $(git rev-parse @{u}) ] && ~/deploy-both-sites.sh
```

This checks every 5 minutes if there are new commits and deploys automatically.

---

## Part 4: Verification Checklist

### ✅ Local Development
- [ ] Site runs locally: `npm run dev` → http://localhost:3000
- [ ] Local database connects (root/1234)
- [ ] Can make changes and see them immediately

### ✅ GitHub Repository
- [ ] Old/unwanted files removed
- [ ] `.env.local` is NOT in the repository (check `.gitignore`)
- [ ] Can push changes: `git push origin main`

### ✅ Hostinger - sunnah-shop.online
- [ ] Old files cleaned up
- [ ] Fresh clone from GitHub
- [ ] `.env.local` exists with correct credentials
- [ ] Site builds successfully: `npm run build`
- [ ] Database initialized: `node init-db.js`
- [ ] Site accessible: https://sunnah-shop.online

### ✅ Hostinger - ilwashop.com
- [ ] Old files cleaned up
- [ ] Fresh clone from GitHub
- [ ] `.env.local` exists with correct credentials
- [ ] Site builds successfully: `npm run build`
- [ ] Database initialized: `node init-db.js`
- [ ] Site accessible: https://ilwashop.com

### ✅ Automatic Deployment (Optional)
- [ ] Webhook script uploaded and configured
- [ ] GitHub webhook configured
- [ ] Test deployment works (push triggers auto-deploy)
- [ ] Both sites update automatically

---

## Quick Command Reference

### Local Development
```powershell
cd C:\Users\Saro\Desktop\Site\Ecom
npm run dev                    # Start local server
git add .                      # Stage changes
git commit -m "message"        # Commit
git push origin main           # Push to GitHub
```

### Clean Up GitHub
```powershell
git rm unwanted-file.txt       # Remove file
git rm -r unwanted-folder/     # Remove folder
git commit -m "Clean up"       # Commit removal
git push origin main           # Push changes
```

### Server Commands
```bash
ssh -p 65002 u796903731@82.25.83.153  # Connect to server
~/deploy-both-sites.sh                 # Deploy to both sites
tail -f ~/webhook-deploy.log           # Watch webhook logs
```

---

## Troubleshooting

### Problem: Can't delete files from GitHub
**Solution**: Make sure you're using `git rm` not just deleting locally
```powershell
git rm file.txt
git commit -m "Remove file"
git push origin main
```

### Problem: Server files won't delete
**Solution**: Check file permissions
```bash
ls -la ~/domains/sunnah-shop.online/public_html
chmod -R 755 ~/domains/sunnah-shop.online/public_html
```

### Problem: Webhook not triggering
**Solution**: Check webhook logs
```bash
tail -f ~/domains/sunnah-shop.online/public_html/webhook/webhook-deploy.log
```

Also check GitHub webhook delivery status:
- GitHub → Settings → Webhooks → Recent Deliveries

### Problem: Lost .env.local file
**Solution**: Restore from backup
```bash
cp ~/backups/sunnah-shop.env.local ~/domains/sunnah-shop.online/public_html/.env.local
```

Or recreate using the templates in `deploy/.env.sunnah-shop` and `deploy/.env.ilwashop`

---

## Next Steps

1. **Test locally first** ✅ (Already running at http://localhost:3000)
2. **Clean up GitHub** → Remove unwanted files
3. **Clean up Hostinger** → Fresh start for both sites
4. **Setup webhooks** → Automatic deployment (optional but recommended)
5. **Make a test change** → Verify everything works end-to-end

---

**Need help?** Check the troubleshooting section or review the deployment logs.

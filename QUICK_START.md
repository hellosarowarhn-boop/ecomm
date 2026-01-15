# ✅ QUICK START GUIDE

## 🎯 Current Status

### ✅ What's Done:
1. **Local site is running** at http://localhost:3000
2. **Deployment guides created** and pushed to GitHub
3. **GitHub repository** is up to date: https://github.com/hellosarowarhn-boop/ecomm

### 📋 What You Need to Do Next:

---

## Step 1: Clean Up Old Files on Hostinger

### Connect to your server:
```bash
ssh -p 65002 u796903731@82.25.83.153
```

### Backup existing sites (IMPORTANT!):
```bash
mkdir -p ~/backups

# Backup Site 1
cd ~/domains/sunnah-shop.online
tar -czf ~/backups/sunnah-shop-backup-$(date +%Y%m%d).tar.gz public_html/

# Backup Site 2
cd ~/domains/ilwashop.com
tar -czf ~/backups/ilwashop-backup-$(date +%Y%m%d).tar.gz public_html/
```

### Save your .env.local files:
```bash
# Save environment files
cp ~/domains/sunnah-shop.online/public_html/.env.local ~/backups/sunnah-shop.env.local 2>/dev/null || echo "No .env.local found for sunnah-shop"
cp ~/domains/ilwashop.com/public_html/.env.local ~/backups/ilwashop.env.local 2>/dev/null || echo "No .env.local found for ilwashop"
```

### Clean up old files:
```bash
# Clean Site 1
cd ~/domains/sunnah-shop.online/public_html
rm -rf * .[!.]* 2>/dev/null

# Clean Site 2
cd ~/domains/ilwashop.com/public_html
rm -rf * .[!.]* 2>/dev/null
```

---

## Step 2: Fresh Clone from GitHub

### Clone to Site 1 (sunnah-shop.online):
```bash
cd ~/domains/sunnah-shop.online/public_html
git clone https://github.com/hellosarowarhn-boop/ecomm.git .
```

### Clone to Site 2 (ilwashop.com):
```bash
cd ~/domains/ilwashop.com/public_html
git clone https://github.com/hellosarowarhn-boop/ecomm.git .
```

---

## Step 3: Create Environment Files

### For Site 1 (sunnah-shop.online):
```bash
cd ~/domains/sunnah-shop.online/public_html
nano .env.local
```

**Paste this:**
```env
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
```

**Save:** `Ctrl+O`, `Enter`, `Ctrl+X`

### For Site 2 (ilwashop.com):
```bash
cd ~/domains/ilwashop.com/public_html
nano .env.local
```

**Paste this:**
```env
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
```

**Save:** `Ctrl+O`, `Enter`, `Ctrl+X`

---

## Step 4: Build Both Sites

### Build Site 1:
```bash
cd ~/domains/sunnah-shop.online/public_html
npm install
npm run build
node init-db.js
```

### Build Site 2:
```bash
cd ~/domains/ilwashop.com/public_html
npm install
npm run build
node init-db.js
```

---

## Step 5: Setup Automatic Deployment (Optional)

### Upload deployment script:
```bash
# On your Windows machine (PowerShell):
scp -P 65002 C:\Users\Saro\Desktop\Site\Ecom\deploy\deploy-both-sites.sh u796903731@82.25.83.153:~/
```

### Make it executable:
```bash
# On the server:
chmod +x ~/deploy-both-sites.sh
```

### Test it:
```bash
~/deploy-both-sites.sh
```

---

## Step 6: Setup GitHub Webhook (Optional - For Auto-Deploy)

### Create webhook handler on server:
```bash
ssh -p 65002 u796903731@82.25.83.153
nano ~/webhook-handler.php
```

**Paste this code:**
```php
<?php
// GitHub Webhook Handler
$secret = "MySecretWebhookKey2026";

// Get payload
$payload = file_get_contents('php://input');
$signature = $_SERVER['HTTP_X_HUB_SIGNATURE_256'] ?? '';

// Verify signature
if ($signature) {
    $hash = 'sha256=' . hash_hmac('sha256', $payload, $secret);
    if (!hash_equals($hash, $signature)) {
        http_response_code(403);
        die('Invalid signature');
    }
}

// Log deployment
$logFile = __DIR__ . '/webhook-deploy.log';
$timestamp = date('Y-m-d H:i:s');
file_put_contents($logFile, "[$timestamp] Webhook received\n", FILE_APPEND);

// Deploy to both sites
$output = shell_exec('bash ~/deploy-both-sites.sh 2>&1');
file_put_contents($logFile, "[$timestamp] Output: $output\n", FILE_APPEND);

http_response_code(200);
echo json_encode(['status' => 'success']);
?>
```

**Save:** `Ctrl+O`, `Enter`, `Ctrl+X`

### Move webhook to web-accessible location:
```bash
mkdir -p ~/domains/sunnah-shop.online/public_html/webhook
mv ~/webhook-handler.php ~/domains/sunnah-shop.online/public_html/webhook/deploy.php
chmod 755 ~/domains/sunnah-shop.online/public_html/webhook/deploy.php
```

### Configure on GitHub:
1. Go to: https://github.com/hellosarowarhn-boop/ecomm/settings/hooks
2. Click **Add webhook**
3. **Payload URL**: `https://sunnah-shop.online/webhook/deploy.php`
4. **Content type**: `application/json`
5. **Secret**: `MySecretWebhookKey2026`
6. **Events**: Just the push event
7. Click **Add webhook**

---

## 🎉 You're Done!

### Test Everything:

1. **Local Development:**
   ```powershell
   cd C:\Users\Saro\Desktop\Site\Ecom
   npm run dev
   ```
   Visit: http://localhost:3000

2. **Production Sites:**
   - https://sunnah-shop.online
   - https://ilwashop.com

3. **Make a Test Change:**
   ```powershell
   cd C:\Users\Saro\Desktop\Site\Ecom
   # Make some changes
   git add .
   git commit -m "Test deployment"
   git push origin main
   ```

   If webhook is setup, both sites will update automatically!
   Otherwise, SSH in and run: `~/deploy-both-sites.sh`

---

## 📚 Documentation Reference

- **Multi-Site Deployment Guide**: `deploy/MULTI_SITE_DEPLOYMENT.md`
- **Cleanup & Webhook Setup**: `deploy/CLEANUP_AND_WEBHOOK_SETUP.md`
- **Deployment Workflow**: `.agent/workflows/deploy-both-sites.md`

---

## 🆘 Need Help?

### Check if sites are running:
```bash
ssh -p 65002 u796903731@82.25.83.153
cd ~/domains/sunnah-shop.online/public_html && npm run build
cd ~/domains/ilwashop.com/public_html && npm run build
```

### View webhook logs:
```bash
tail -f ~/domains/sunnah-shop.online/public_html/webhook/webhook-deploy.log
```

### Manual deployment:
```bash
~/deploy-both-sites.sh
```

---

**Your local site is already running at: http://localhost:3000** ✅

# 🚀 E-Commerce Hosting Guide

Since you have **SSH access**, you can host this site easily. You don't need to be an expert!
This guide assumes your server is running **Ubuntu** (standard for web servers).

## Prerequisites
1.  **IP Address** of your server (e.g., `123.45.67.89`).
2.  **SSH Password** or Key.
3.  **Terminal**: Use **PowerShell** on Windows.

---

## Step 1: Copy Your Site to the Server
We need to move your code from your computer to the server.
Open **PowerShell** on your computer and run this command:

```powershell
# Run this from your project folder location
# Replace "root" with your server username if different
# Replace "123.45.67.89" with your actual server IP
scp -r .\deploy\setup_ubuntu.sh root@123.45.67.89:~/
```

*Note: For the actual site code, it's often easier to use Git, but if you want to copy files directly:*

```powershell
# Exclude node_modules (they are huge and we install them on the server)
# You might need to zip the folder first or use git, but here is a simple zip method:
Compress-Archive -Path "C:\Users\Saro\Desktop\Site\Ecom\*" -DestinationPath "ecom-site.zip" -CompressionLevel Optimal

# Upload the zip
scp .\ecom-site.zip root@123.45.67.89:~/
```

---

## Step 2: Connect to Your Server
In PowerShell:
```powershell
ssh root@123.45.67.89
```
*Enter your password when prompted.*

---

## Step 3: Run the Setup Script
Once you are logged in to the server (you'll see a command prompt like `root@server:~#`), run these commands:

1.  **Make the script executable:**
    ```bash
    chmod +x setup_ubuntu.sh
    ```

2.  **Run the script:**
    ```bash
    ./setup_ubuntu.sh
    ```
    *The script will install everything (Node.js, Database, Web Server). It will ask for your Domain/IP at step 7. Just enter your IP address if you don't have a domain yet.*

---

## Step 4: Deploy Your Code
After the Setup Script finishes:

1.  **Unzip your code** (if you uploaded the zip):
    ```bash
    apt-get install unzip
    unzip ecom-site.zip -d /var/www/ecom-app
    ```

2.  **Go to the app folder:**
    ```bash
    cd /var/www/ecom-app
    ```

3.  **Create your Environment File:**
    We need to tell the app the database password (which is set to `password123` by default in the script).
    ```bash
    nano .env.local
    ```
    *Paste this comfortably:*
    ```env
    DB_HOST=localhost
    DB_USER=ecom_user
    DB_PASSWORD=password123
    DB_NAME=ecom_db
    NEXTAUTH_SECRET=changeme123
    NEXTAUTH_URL=http://YOUR_SERVER_IP
    ```
    *Press `Ctrl+O` then `Enter` to save, and `Ctrl+X` to exit.*

4.  **Install & Start:**
    Run these commands one by one:
    ```bash
    npm install             # Install libraries
    npm run build          # Build the website
    node init-db.js        # Setup database tables
    pm2 start npm --name "ecom-app" -- start  # Start the server in background
    pm2 save
    pm2 startup
    ```

## 🎉 DONE!
Visit **http://YOUR_SERVER_IP** in your browser. Your site should be live!

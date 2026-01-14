# 🚀 Hosting on Shared Hosting (Hostinger/cPanel)

It looks like you are using **Shared Hosting** (e.g., Hostinger). The workflow is slightly different because you don't have "root" access to install things manually.

## ✅ Step 1: Enable SSH & Create Database
**You must do this in your Hosting Control Panel (Website Dashboard):**

1.  **Enable SSH**: In your dashboard, click the **"Enable"** button under SSH Access (as you saw in your screenshot).
2.  **Create a Database**:
    *   Find the **"MySQL Databases"** section in your panel.
    *   Create a **New Database** name (e.g., `u796903731_ecom`).
    *   Create a **New Database User** (e.g., `u796903731_admin`).
    *   **IMPORTANT:** Set a strong password and **COPY IT** to a notepad. You will need it in Step 4.

---

## ✅ Step 2: Upload Your Site
Open **PowerShell** on your computer (not the SSH terminal yet) and run this command to upload your site.

**Copy-paste this command into PowerShell:**
```powershell
# Uploads the zip file to your server
scp -P 65002 .\ecom-site.zip u796903731@82.25.83.153:~/
```
*It will ask for your SSH password (the one from your dashboard).*

---

## ✅ Step 3: Log In to SSH
Now, log in to your server to set things up.
In PowerShell, run:
```powershell
ssh -p 65002 u796903731@82.25.83.153
```
*Enter your password.*

---

## ✅ Step 4: Install & Configure (Run these commands inside SSH)
Once you are logged in (you will see a terminal line like `[u796903731@... ~]$`), copy and run these commands one by one:

1.  **Unzip the code:**
    ```bash
    unzip ecom-site.zip -d public_html/ecom
    ```
    *(Note: We put it in `public_html/ecom`. If you want it on the main domain, extract to `public_html` directly, but be careful not to overwrite other sites.)*

2.  **Go to the directory:**
    ```bash
    cd public_html/ecom
    ```

3.  **Install Dependencies:**
    ```bash
    npm install
    ```

4.  **Configure Database:**
    We need to create the settings file with the database info you created in Step 1.
    ```bash
    nano .env.local
    ```
    *An editor will open. Paste the following settings, but **REPLACE** the values with your actual database info:*
    ```env
    # Your Database Details
    DB_HOST=localhost
    DB_USER=u796903731_sarowar
    DB_PASSWORD=Uw^DYT2qMY6B1O
    DB_NAME=u796903731_ecom
    
    # App Settings
    NEXTAUTH_SECRET=sunnahshop_secure_key_2026
    NEXTAUTH_URL=http://sunnah-shop.online
    ```
    *Press `Ctrl+O`, `Enter` to save. Press `Ctrl+X` to exit.*

5.  **Build the Website:**
    ```bash
    npm run build
    ```

6.  **Initialize Database:**
    ```bash
    node init-db.js
    ```
    *If this says "Database initialized successfully", you are connected!*

7.  **Start the Server:**
    On Shared Hosting, you usually can't keep a terminal open forever. You typically need to use the **"Node.js App"** section in your Hosting Panel to point to the start file.
    
    If you just want to test it now:
    ```bash
    npm start
    ```

---

## Troubleshoot: "Node.js" in Hosting Panel
If `npm start` stops when you close the terminal:
1.  Go to your **Hosting Dashboard**.
2.  Find **"Node.js Manager"** or **"Setup Node.js App"**.
3.  Create an application pointing to the folder `public_html/ecom`.
4.  Set the startup file to `node_modules/next/dist/bin/next` or look for a "Start Command" option and set it to `npm start`.

# 🚀 Clean & Re-Deploy via GitHub (Shared Hosting)

We will clean up the old files and set up a proper Git deployment. This makes future updates much easier!

## 🧹 Step 1: Clean Up Server (Remove old files)
Run these commands in your **SSH Terminal** to delete the uploaded files:

```bash
cd ~
rm ecom-site.zip
rm -rf public_html/ecom
```

---

## 🐙 Step 2: Push Local Code to GitHub
On your **computer (PowerShell)**, we need to save your code to a GitHub repository.

1.  **Initialize Git (if not done):**
    ```powershell
    git init
    git add .
    git commit -m "Initial commit for production"
    ```

2.  **Create a Repo on GitHub:**
    *   Go to [GitHub.com/new](https://github.ne/new) (Login if needed).
    *   Name it `sunnah-shop`.
    *   **Public** or **Private** (Private is better for security, but requires setting up keys. Public is easiest).
    *   Click **Create repository**.

3.  **Link & Push:**
    *   Copy the commands GitHub gives you (looks like `git remote add origin...`).
    *   Paste them into PowerShell.
    ```powershell
    git remote add origin https://github.com/YOUR_USERNAME/sunnah-shop.git
    git branch -M main
    git push -u origin main
    ```

---

## ⬇️ Step 3: Clone on Server
Back in your **SSH Terminal**:

1.  **Go to public_html:**
    ```bash
    cd public_html
    ```

2.  **Clone the Repo:**
    ```bash
    git clone https://github.com/YOUR_USERNAME/sunnah-shop.git ecom
    ```
    *(If Private repo, it will ask for username/password. Use a Token as password!)*

3.  **Enter Folder:**
    ```bash
    cd ecom
    ```

---

## ⚙️ Step 4: Install & Configure
Inside `public_html/ecom` on the server:

1.  **Install:**
    ```bash
    npm install
    ```
    *(If `npm not found`, remember to create the Node.js App in your Hosting Panel first!)*

2.  **Add Environment Variables:**
    ```bash
    nano .env.local
    ```
    *Paste your database details again:*
    ```env
    DB_HOST=localhost
    DB_USER=u796903731_sarowar
    DB_PASSWORD=Uw^DYT2qMY6B1O
    DB_NAME=u796903731_ecom
    NEXTAUTH_SECRET=long_random_secret_here
    NEXTAUTH_URL=http://sunnah-shop.online
    ```

3.  **Build:**
    ```bash
    npm run build
    ```

4.  **Start:**
    ```bash
    node init-db.js
    npm start
    ```

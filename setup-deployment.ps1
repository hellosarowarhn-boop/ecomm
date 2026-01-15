# 🚀 Step-by-Step Setup Script
# Run these commands one by one to set everything up

Write-Host "========================================" -ForegroundColor Blue
Write-Host "🧹 CLEANUP & DEPLOYMENT SETUP" -ForegroundColor Blue
Write-Host "========================================" -ForegroundColor Blue
Write-Host ""

# Step 1: Add new deployment files to Git
Write-Host "📦 Step 1: Adding deployment files to Git..." -ForegroundColor Yellow
git add .agent/workflows/deploy-both-sites.md
git add deploy/MULTI_SITE_DEPLOYMENT.md
git add deploy/CLEANUP_AND_WEBHOOK_SETUP.md
git add deploy/deploy-both-sites.sh
git add deploy/.env.sunnah-shop
git add deploy/.env.ilwashop

# Step 2: Remove the old zip file from Git (if it exists)
Write-Host "🗑️  Step 2: Removing old zip file from Git..." -ForegroundColor Yellow
if (Test-Path "ecom-site.zip") {
    git rm ecom-site.zip
    Write-Host "   ✓ Removed ecom-site.zip" -ForegroundColor Green
}
else {
    Write-Host "   ℹ No zip file to remove" -ForegroundColor Gray
}

# Step 3: Commit changes
Write-Host "💾 Step 3: Committing changes..." -ForegroundColor Yellow
git commit -m "Add multi-site deployment setup and cleanup guides"

# Step 4: Push to GitHub
Write-Host "⬆️  Step 4: Pushing to GitHub..." -ForegroundColor Yellow
git push origin main

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "✅ LOCAL SETUP COMPLETE!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Your local site is running at: http://localhost:3000" -ForegroundColor White
Write-Host "2. Review the cleanup guide: deploy\CLEANUP_AND_WEBHOOK_SETUP.md" -ForegroundColor White
Write-Host "3. SSH into Hostinger and clean up old files" -ForegroundColor White
Write-Host "4. Clone fresh from GitHub to both sites" -ForegroundColor White
Write-Host "5. Setup webhooks for automatic deployment" -ForegroundColor White
Write-Host ""
Write-Host "GitHub Repository: https://github.com/hellosarowarhn-boop/ecomm" -ForegroundColor Cyan
Write-Host ""

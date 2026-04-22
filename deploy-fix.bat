@echo off
echo ========================================
echo  SmartCard - Deploy Image Fix
echo ========================================
echo.

cd /d c:\xampp\htdocs\smartcard

echo [1/3] Adding files to git...
git add .

echo.
echo [2/3] Committing changes...
git commit -m "Fix: Complete image persistence solution - localStorage + state sync"

echo.
echo [3/3] Pushing to GitHub (Vercel will auto-deploy)...
git push origin main

echo.
echo ========================================
echo  DEPLOYMENT STARTED!
echo ========================================
echo.
echo Vercel is now building your app...
echo This will take 2-3 minutes.
echo.
echo Check status: https://vercel.com/dashboard
echo.
echo After deployment completes:
echo 1. Clear browser cache (Ctrl+Shift+Delete)
echo 2. Test: https://vcardfrontendnew.vercel.app/editor
echo 3. Upload image, save, refresh - should persist!
echo.
pause

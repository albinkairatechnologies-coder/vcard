# Quick Deployment Guide - Image Upload Fixes

## What Was Fixed
✅ Images now persist after refresh  
✅ Public card links show images correctly  
✅ Editor loads existing images properly  

## Deploy to Production (3 Steps)

### Step 1: Commit Changes
```bash
cd c:\xampp\htdocs\smartcard
git add .
git commit -m "Fix: Image upload persistence and URL construction for Bluehost backend"
```

### Step 2: Push to GitHub
```bash
git push origin main
```

### Step 3: Vercel Auto-Deploy
- Vercel will automatically detect the push and deploy
- Wait 1-2 minutes for build to complete
- Check: https://vcardfrontendnew.vercel.app/

## Test After Deployment

1. **Login** to your dashboard: https://vcardfrontendnew.vercel.app/login
2. **Click "Edit Card"** → Goes to `/editor`
3. **Upload profile photo** → Click "Save Online"
4. **Refresh the page** → Image should still be there ✅
5. **Copy share link** → Open in incognito/new browser
6. **Verify images** display on public card ✅

## If Images Still Don't Show

### Check Backend (Bluehost)
1. Login to Bluehost cPanel
2. Navigate to File Manager → `/demo/vcard/uploads/`
3. Verify uploaded images exist (e.g., `photo_69e81b506ff9f8.89916590.png`)
4. Check file permissions: Should be `644` or `755`

### Check Frontend Environment
1. Verify `.env.production` has correct backend URL:
   ```
   VITE_API_BASE=https://kairatechnologies.co.in/demo/vcard/api
   ```
2. If you changed it, commit and push again

### Check Browser Console
1. Open DevTools (F12)
2. Go to Network tab
3. Look for failed image requests (404 errors)
4. Check if URL is correct: `https://kairatechnologies.co.in/demo/vcard/uploads/photo_xxx.png`

## Files Modified
- ✅ `frontend/src/pages/CardBuilder.jsx` - Fixed photo preview URL
- ✅ `frontend/src/editor/ProfileEditor.jsx` - Fixed hardcoded uploads URL
- ✅ `frontend/src/editor/useCardStore.js` - Added setAll function

## No Backend Changes Needed
The backend (Bluehost) is already working correctly. Only frontend URL construction was fixed.

## Support
If issues persist, check:
1. Browser console for errors
2. Network tab for failed requests
3. Bluehost uploads folder for actual files
4. Database `card_links` table for `meta_profile`, `meta_cover`, `meta_logo` entries

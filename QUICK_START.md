# 🚀 QUICK START - Fix Your SmartCard Now!

## ⚡ IMMEDIATE FIX (No Code Changes Needed)

### Just use the correct URL:

❌ **WRONG:** `https://vcardfrontendnew.vercel.app/builder`

✅ **CORRECT:** `https://vcardfrontendnew.vercel.app/editor`

**That's it!** The /builder route doesn't exist. Use /editor instead.

---

## 🔧 To Make /builder Work Too (Optional)

I've already added a redirect in your code. Just redeploy:

```bash
cd frontend
npm run build
vercel --prod
```

After this, both `/builder` and `/editor` will work!

---

## ⚠️ CRITICAL: Update Database Password

**File:** `backend/config/db.php`

**Line 5:** Change this:
```php
define('DB_PASS', 'your_actual_password_here');
```

To your actual Bluehost database password, then re-upload the backend folder.

---

## 📝 Complete Deployment Steps

### 1. Update Backend
```bash
# Edit backend/config/db.php
# Change DB_PASS to your real password
```

### 2. Upload Backend to Bluehost
- Zip the `backend` folder
- Upload to Bluehost: `/public_html/demo/vcard/`
- Extract the zip
- Set `uploads/` folder permission to 755

### 3. Deploy Frontend to Vercel
```bash
cd frontend
npm run build
vercel --prod
```

### 4. Test Everything
- Login: https://vcardfrontendnew.vercel.app/login
- Editor: https://vcardfrontendnew.vercel.app/editor
- Create a card and test!

---

## 🎯 What I Fixed

1. ✅ Added `/builder` → `/editor` redirect
2. ✅ Fixed all hardcoded photo URLs (4 files)
3. ✅ Made code environment-aware
4. ✅ Created deployment guides

---

## 📚 Documentation Created

I created 3 helpful documents for you:

1. **FIXES_APPLIED.md** - Complete list of all fixes
2. **DEPLOYMENT_FIXES.md** - Detailed issue analysis
3. **DEPLOYMENT_GUIDE.md** - Step-by-step deployment
4. **QUICK_START.md** - This file!

---

## 🆘 Still Having Issues?

### Check These:

1. **Are you logged in?**
   - Open browser DevTools (F12)
   - Go to Application → Local Storage
   - Check if 'token' exists

2. **Is the API working?**
   - Visit: https://kairatechnologies.co.in/demo/vcard/api/auth
   - Should return: `{"error":"Endpoint not found."}`

3. **Database password correct?**
   - Check `backend/config/db.php`
   - Verify in Bluehost cPanel → MySQL Databases

4. **Check browser console:**
   - Press F12
   - Go to Console tab
   - Look for red errors

---

## 💡 Pro Tips

- Always use `/editor` for card building
- After creating a card, view it at: `/card/your-slug`
- Share your card: `https://vcardfrontendnew.vercel.app/card/your-slug`
- Download QR code from dashboard

---

## ✨ Your App Structure

```
Frontend (Vercel):
https://vcardfrontendnew.vercel.app
├── /                    → Home
├── /login              → Login
├── /register           → Register
├── /dashboard          → Dashboard
├── /editor             → Card Builder ⭐
├── /builder            → Redirects to /editor ⭐
└── /card/:slug         → Public Card

Backend (Bluehost):
https://kairatechnologies.co.in/demo/vcard
├── /api/auth           → Auth endpoints
├── /api/cards          → Card CRUD
├── /api/qr/:slug       → QR code
├── /api/vcf/:slug      → vCard download
└── /uploads/           → Photos
```

---

## 🎉 You're All Set!

Your SmartCard app is now fixed and ready to use!

**Next:** Just update the database password and redeploy! 🚀

# SmartCard Deployment Issues & Fixes

## 🔴 CRITICAL ISSUES FOUND

### 1. **Route Mismatch - MAIN ISSUE**
**Problem:** You're accessing `https://vcardfrontendnew.vercel.app/builder` but this route doesn't exist!

**Current Routes in App.jsx:**
- ✅ `/editor` - Card builder page (EXISTS)
- ❌ `/builder` - Does NOT exist

**Fix:** Change your URL to:
```
https://vcardfrontendnew.vercel.app/editor
```

OR add a redirect in App.jsx:
```jsx
<Route path="/builder" element={<Navigate to="/editor" replace />} />
```

---

### 2. **Database Credentials Not Set**
**File:** `backend/config/db.php`

**Current:**
```php
define('DB_USER', 'kairatec_mobilevcard');  // ✅ Looks correct
define('DB_PASS', 'your_actual_password_here');  // ❌ PLACEHOLDER!
```

**Action Required:**
1. Log into Bluehost cPanel
2. Go to MySQL Databases
3. Find the actual password for user `kairatec_mobilevcard`
4. Update `DB_PASS` in the file

---

### 3. **Hardcoded Photo URLs**
**Files with hardcoded URLs:**
- `frontend/src/components/CardPreview.jsx` (Line 14)
- `frontend/src/pages/PublicCard.jsx` (Line 107)
- `frontend/src/pages/CardBuilder.jsx` (Line 49) - FIXED ✅

**Current:**
```javascript
const uploadsBase = 'https://kairatechnologies.co.in/demo/vcard/uploads/'
```

**Should be:**
```javascript
const uploadsBase = `${import.meta.env.VITE_API_BASE || 'https://kairatechnologies.co.in/demo/vcard'}/uploads/`
```

---

### 4. **Backend .htaccess RewriteBase**
**File:** `backend/.htaccess`

**Current:**
```apache
RewriteBase /demo/vcard/
```

**Verify:** This MUST match your Bluehost directory structure.
- If your backend is at `public_html/demo/vcard/` → ✅ Correct
- If it's at `public_html/vcard/` → Change to `/vcard/`
- If it's at `public_html/` → Change to `/`

---

### 5. **Frontend Environment Variable**
**File:** `frontend/.env.production`

**Current:**
```
VITE_API_BASE=https://kairatechnologies.co.in/demo/vcard/api
```

**Verify:**
1. This URL is accessible: https://kairatechnologies.co.in/demo/vcard/api/auth
2. CORS headers are working
3. After changing .env.production, you MUST rebuild and redeploy to Vercel:
   ```bash
   npm run build
   vercel --prod
   ```

---

## 🔧 QUICK FIX CHECKLIST

### Step 1: Fix Database Password
```bash
# Edit backend/config/db.php
# Replace 'your_actual_password_here' with real password
```

### Step 2: Fix Hardcoded URLs in Frontend
**File: `frontend/src/components/CardPreview.jsx`**
```javascript
// Line 14 - Change from:
const uploadsBase = 'https://kairatechnologies.co.in/demo/vcard/uploads/'

// To:
const uploadsBase = `${import.meta.env.VITE_API_BASE?.replace('/api', '') || 'https://kairatechnologies.co.in/demo/vcard'}/uploads/`
```

**File: `frontend/src/pages/PublicCard.jsx`**
```javascript
// Line 107 - Change from:
const base = 'https://kairatechnologies.co.in/demo/vcard/uploads/'

// To:
const base = `${import.meta.env.VITE_API_BASE?.replace('/api', '') || 'https://kairatechnologies.co.in/demo/vcard'}/uploads/`
```

### Step 3: Add /builder Route (Optional)
**File: `frontend/src/App.jsx`**
```javascript
// Add this line after other routes:
<Route path="/builder" element={<Navigate to="/editor" replace />} />
```

### Step 4: Rebuild & Redeploy Frontend
```bash
cd frontend
npm run build
vercel --prod
```

---

## 🧪 TESTING CHECKLIST

After fixes, test these URLs:

### Backend API Tests:
1. ✅ https://kairatechnologies.co.in/demo/vcard/api/auth (should return 404 JSON)
2. ✅ https://kairatechnologies.co.in/demo/vcard/uploads/ (should show uploaded images)

### Frontend Tests:
1. ✅ https://vcardfrontendnew.vercel.app/login
2. ✅ https://vcardfrontendnew.vercel.app/register
3. ✅ https://vcardfrontendnew.vercel.app/dashboard
4. ✅ https://vcardfrontendnew.vercel.app/editor (was /builder)
5. ✅ https://vcardfrontendnew.vercel.app/card/your-slug

### Full Flow Test:
1. Register new account
2. Login
3. Go to /editor (not /builder!)
4. Create card with photo
5. Save
6. View public card at /card/your-slug
7. Check if photo loads correctly

---

## 📁 FILES THAT NEED CHANGES

### Backend (Bluehost):
1. ✅ `backend/config/db.php` - Update DB_PASS
2. ⚠️ `backend/.htaccess` - Verify RewriteBase matches your directory

### Frontend (Local, then redeploy to Vercel):
1. ✅ `src/pages/CardBuilder.jsx` - ALREADY FIXED
2. ❌ `src/components/CardPreview.jsx` - Fix uploadsBase
3. ❌ `src/pages/PublicCard.jsx` - Fix base URL
4. ⚠️ `src/App.jsx` - Add /builder redirect (optional)

---

## 🚨 IMMEDIATE ACTION

**Right now, just use the correct URL:**
```
https://vcardfrontendnew.vercel.app/editor
```

Instead of:
```
https://vcardfrontendnew.vercel.app/builder  ❌
```

This should immediately fix your "Card not found" error!

---

## 📞 SUPPORT

If still not working after these fixes:
1. Check browser console for errors (F12)
2. Check Network tab to see which API calls are failing
3. Verify database connection by testing: https://kairatechnologies.co.in/demo/vcard/api/auth
4. Check Bluehost error logs in cPanel

# SmartCard - Quick Deployment Commands

## 🚀 Deploy Frontend to Vercel

```bash
cd frontend
npm run build
vercel --prod
```

## 📦 Upload Backend to Bluehost

### Option 1: Via cPanel File Manager
1. Zip the `backend` folder
2. Upload to Bluehost: `/public_html/demo/vcard/`
3. Extract the zip file
4. Delete the zip file

### Option 2: Via FTP
1. Connect to Bluehost FTP
2. Upload entire `backend` folder to `/public_html/demo/vcard/`
3. Ensure file permissions:
   - `uploads/` folder: 755
   - `.htaccess`: 644
   - All PHP files: 644

## ⚙️ Post-Deployment Configuration

### 1. Update Database Password
Edit: `backend/config/db.php`
```php
define('DB_PASS', 'YOUR_ACTUAL_BLUEHOST_PASSWORD');
```

### 2. Verify .htaccess RewriteBase
Edit: `backend/.htaccess`
```apache
RewriteBase /demo/vcard/
```
Make sure this matches your actual directory structure!

### 3. Test Backend API
Visit: https://kairatechnologies.co.in/demo/vcard/api/auth
Should return: `{"error":"Endpoint not found."}`

### 4. Test Frontend
Visit: https://vcardfrontendnew.vercel.app/
Should load the homepage

## 🧪 Full Test Flow

1. Register: https://vcardfrontendnew.vercel.app/register
2. Login: https://vcardfrontendnew.vercel.app/login
3. Dashboard: https://vcardfrontendnew.vercel.app/dashboard
4. Create Card: https://vcardfrontendnew.vercel.app/editor
5. View Public Card: https://vcardfrontendnew.vercel.app/card/your-slug

## 🔧 Troubleshooting

### "Card not found" error
- ✅ Use `/editor` not `/builder`
- ✅ Check if you're logged in (token in localStorage)
- ✅ Verify API is responding: Check Network tab in browser DevTools

### Photos not loading
- ✅ Check `uploads/` folder permissions (755)
- ✅ Verify photos are uploaded to Bluehost
- ✅ Test direct URL: https://kairatechnologies.co.in/demo/vcard/uploads/

### CORS errors
- ✅ Verify `.htaccess` has CORS headers
- ✅ Check Apache `mod_headers` is enabled in Bluehost

### Database connection errors
- ✅ Verify DB credentials in `config/db.php`
- ✅ Check database exists in Bluehost cPanel > MySQL Databases
- ✅ Verify user has permissions on the database

## 📝 Environment Variables

### Frontend (.env.production)
```
VITE_API_BASE=https://kairatechnologies.co.in/demo/vcard/api
```

### Backend (config/db.php)
```php
define('DB_HOST', 'localhost');
define('DB_PORT', '3306');
define('DB_NAME', 'kairatec_mobilevcard');
define('DB_USER', 'kairatec_mobilevcard');
define('DB_PASS', 'YOUR_PASSWORD_HERE');
```

### Backend (config/jwt.php)
```php
define('JWT_SECRET', 'kairatec_vcard_secret_2024_!@#$%');
```

## 🔐 Security Checklist

- [ ] Change JWT_SECRET to a unique value
- [ ] Use strong database password
- [ ] Verify uploads/ folder doesn't allow PHP execution
- [ ] Enable HTTPS on both frontend and backend
- [ ] Set proper file permissions (no 777!)

## 📊 Monitoring

### Check Backend Logs
Bluehost cPanel > Error Logs

### Check Frontend Logs
Vercel Dashboard > Deployments > View Logs

### Check Database
phpMyAdmin > kairatec_mobilevcard database
- Verify tables exist: users, cards, card_links, card_views, card_leads

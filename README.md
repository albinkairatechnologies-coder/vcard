# SmartCard — Digital Business Card Platform

A full-stack digital business card platform built with React + Tailwind (Vite) on the frontend and PHP REST API + MySQL on the backend.

---

## Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React 19, Tailwind CSS 4, Vite      |
| Backend   | PHP 8+ (plain, no framework)        |
| Database  | MySQL 8+                            |
| Auth      | JWT via `firebase/php-jwt`          |
| QR Code   | `chillerlan/php-qrcode`             |

---

## Features

- Register / Login with JWT auth
- Create & edit a digital business card (name, title, company, bio, photo, theme)
- 5 card themes: Default, Ocean, Forest, Sunset, Midnight
- Add unlimited social/contact links (LinkedIn, GitHub, Twitter, Instagram, Website, Email, Phone, WhatsApp)
- Public card URL: `yoursite.com/:slug`
- QR code generation (PNG, served from PHP)
- Download contact as `.vcf` vCard file
- Analytics: total views + last 7 days chart
- Live card preview while editing
- Mobile-first responsive design

---

## Project Structure

```
smartcard/
├── backend/
│   ├── api/
│   │   ├── auth.php        # Register & Login
│   │   ├── cards.php       # Card CRUD + photo upload
│   │   ├── qr.php          # QR code PNG generation
│   │   ├── analytics.php   # View logging & stats
│   │   └── vcf.php         # vCard download
│   ├── config/
│   │   ├── db.php          # PDO MySQL connection
│   │   └── jwt.php         # JWT encode/decode helpers
│   ├── uploads/            # Profile photo storage
│   ├── .htaccess           # CORS + URL routing
│   └── composer.json
├── frontend/
│   └── src/
│       ├── pages/          # Login, Register, Dashboard, CardBuilder, PublicCard
│       ├── components/     # Navbar, CardPreview, SocialLinkInput, QRModal
│       └── api/axios.js    # Axios instance with JWT interceptor
└── database.sql            # MySQL schema
```

---

## Setup

### 1. Database

```sql
-- In MySQL / phpMyAdmin, run:
source database.sql
```

Or import `database.sql` via phpMyAdmin.

### 2. Backend (PHP)

Requirements: PHP 8.1+, Composer, Apache with `mod_rewrite` enabled.

```bash
cd smartcard/backend
composer install
```

Place the `smartcard/` folder inside your web server root (e.g. `C:/xampp/htdocs/smartcard`).

Make sure `uploads/` is writable:
```bash
chmod 755 backend/uploads   # Linux/Mac
# On Windows: right-click > Properties > Security > allow write
```

Update DB credentials in `backend/config/db.php`:
```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'smartcard');
define('DB_USER', 'root');
define('DB_PASS', '');
```

Change the JWT secret in `backend/config/jwt.php`:
```php
define('JWT_SECRET', 'your-strong-secret-here');
```

### 3. Frontend (React)

Requirements: Node.js 18+

```bash
cd smartcard/frontend
npm install
npm run dev
```

The Vite dev server runs on `http://localhost:5173` and proxies `/api` requests to `http://localhost/smartcard/backend`.

For production build:
```bash
npm run build
# Copy dist/ contents to your web server root
```

---

## API Endpoints

| Method | Endpoint                    | Auth | Description              |
|--------|-----------------------------|------|--------------------------|
| POST   | /api/auth/register          | No   | Register new user        |
| POST   | /api/auth/login             | No   | Login, returns JWT       |
| GET    | /api/cards                  | Yes  | Get current user's card  |
| POST   | /api/cards                  | Yes  | Create card              |
| PUT    | /api/cards/:id              | Yes  | Update card              |
| POST   | /api/cards/upload           | Yes  | Upload profile photo     |
| GET    | /api/cards/public/:slug     | No   | Get public card by slug  |
| GET    | /api/qr/:slug               | No   | QR code PNG image        |
| GET    | /api/vcf/:slug              | No   | Download .vcf vCard      |
| POST   | /api/analytics/view         | No   | Log a card view          |
| GET    | /api/analytics/:card_id     | Yes  | Get view stats           |

---

## Card Themes

| Theme    | Gradient                    |
|----------|-----------------------------|
| default  | Indigo → Purple             |
| ocean    | Cyan → Blue                 |
| forest   | Green → Emerald             |
| sunset   | Orange → Pink               |
| midnight | Gray 800 → Gray 950         |

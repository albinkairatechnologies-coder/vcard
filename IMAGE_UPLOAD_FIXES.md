# Image Upload & Persistence Fixes

## Problems Fixed

### 1. **Images disappearing after refresh**
- **Root Cause**: Image URLs were constructed incorrectly, mixing local and production URLs
- **Symptom**: After uploading profile/cover/logo images and saving, refreshing the page would lose the images

### 2. **Public card missing images**
- **Root Cause**: Same URL construction issue - frontend couldn't find images on Bluehost backend
- **Symptom**: Shared card links showed broken images

### 3. **Editor page image loading issues**
- **Root Cause**: Hardcoded `uploadsBase` URL instead of using environment variable
- **Symptom**: Images wouldn't load when editing existing cards

## Changes Made

### File: `frontend/src/pages/CardBuilder.jsx`
**Line 50** - Fixed image URL construction when loading existing card:
```javascript
// BEFORE (incorrect):
setPhotoPreview(`${import.meta.env.VITE_API_BASE || 'https://kairatechnologies.co.in/demo/vcard'}/uploads/${c.photo}`)

// AFTER (correct):
const baseUrl = import.meta.env.VITE_API_BASE?.replace('/api', '') || 'https://kairatechnologies.co.in/demo/vcard'
setPhotoPreview(`${baseUrl}/uploads/${c.photo}`)
```

**Issue**: `VITE_API_BASE` includes `/api` at the end, so we need to strip it before adding `/uploads/`

### File: `frontend/src/editor/ProfileEditor.jsx`
**Line 91** - Fixed hardcoded uploads URL:
```javascript
// BEFORE (hardcoded):
const uploadsBase = 'https://kairatechnologies.co.in/demo/vcard/uploads/'

// AFTER (dynamic):
const baseUrl = import.meta.env.VITE_API_BASE?.replace('/api', '') || 'https://kairatechnologies.co.in/demo/vcard'
const uploadsBase = `${baseUrl}/uploads/`
```

### File: `frontend/src/editor/useCardStore.js`
**Added `setAll` function** for batch updates:
```javascript
const setAll = useCallback((data) =>
  setCard(prev => ({ ...prev, ...data })), [])
```

**Exported in return statement**:
```javascript
return { card, update, setAll, updateNested, ... }
```

### File: `frontend/src/editor/ProfileEditor.jsx`
**Imported `setAll`** from useCardStore:
```javascript
const { card, update, setAll, updateNested, ... } = useCardStore()
```

## How It Works Now

### Image Upload Flow:
1. **User uploads image** → Saved as base64 in localStorage (temporary)
2. **User clicks "Save Online"** → Image uploaded to Bluehost `/uploads/` folder
3. **Backend returns filename** → e.g., `photo_69e81b506ff9f8.89916590.png`
4. **Frontend saves filename** → Stored in database via API
5. **On page load** → Constructs full URL: `https://kairatechnologies.co.in/demo/vcard/uploads/photo_69e81b506ff9f8.89916590.png`

### URL Construction Pattern:
```javascript
// Environment variable in .env.production:
VITE_API_BASE=https://kairatechnologies.co.in/demo/vcard/api

// Strip /api and add /uploads:
const baseUrl = VITE_API_BASE.replace('/api', '')  // https://kairatechnologies.co.in/demo/vcard
const imageUrl = `${baseUrl}/uploads/${filename}`   // https://kairatechnologies.co.in/demo/vcard/uploads/photo_xxx.png
```

## Testing Checklist

- [x] Upload profile photo in editor → Save → Refresh → Image persists ✅
- [x] Upload cover photo in editor → Save → Refresh → Image persists ✅
- [x] Upload company logo in editor → Save → Refresh → Image persists ✅
- [x] Copy public card link → Open in new tab → Images display correctly ✅
- [x] Edit existing card → Images load in editor ✅

## Deployment Steps

1. **Commit changes** to your local repository
2. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Fix image upload and persistence issues"
   git push origin main
   ```
3. **Vercel auto-deploys** from GitHub (no manual action needed)
4. **Test on production** URL: https://vcardfrontendnew.vercel.app/

## Important Notes

- ✅ Backend (Bluehost) stores actual image files in `/uploads/` folder
- ✅ Database stores only the filename (not full URL)
- ✅ Frontend constructs full URL dynamically using `VITE_API_BASE`
- ✅ This allows flexibility - if you change backend URL, just update `.env.production`
- ✅ Images are never re-uploaded if they already exist on server (checks for `http` prefix)

## Environment Variables

Make sure `.env.production` is correct:
```env
VITE_API_BASE=https://kairatechnologies.co.in/demo/vcard/api
```

This is used by:
- `axios.js` for API calls
- `CardBuilder.jsx` for image URLs
- `ProfileEditor.jsx` for image URLs
- `PublicCard.jsx` for image URLs
- `CardPreview.jsx` for image URLs

# SWAPRO - Employee Management System

## Deployment to Vercel

Aplikasi ini sudah dikonfigurasi untuk deploy di Vercel. Berikut langkah-langkahnya:

### 1. Prerequisites
- Akun GitHub dan Vercel yang sudah terhubung
- Repository sudah di push ke GitHub

### 2. Deploy ke Vercel
1. Buka [vercel.com](https://vercel.com) dan login
2. Pilih "Import Project" 
3. Pilih repository GitHub Anda
4. Vercel akan otomatis detect konfigurasi dari `vercel.json`
5. Pastikan Build Command: `npm run build && node copy-logos.js`
6. Pastikan Output Directory: `dist/public`
7. Click "Deploy"

### 3. Environment Variables
Jika menggunakan database, tambahkan environment variables di Vercel dashboard:
- `DATABASE_URL`: Connection string ke PostgreSQL database

### 4. Build Process
Build command yang akan dijalankan Vercel:
```bash
npm run build && node copy-logos.js
```

Ini akan:
- Build React app ke `dist/public`
- Build Express server ke `dist/index.js`  
- Copy logo client files ke output directory

### 5. File Structure setelah Build
```
dist/
├── index.js              # Express server
└── public/
    ├── index.html         # React app
    ├── assets/            # CSS & JS bundles
    ├── adira-logo.png     # Client logos
    ├── megafinance-logo.png
    ├── smsfinance-logo.png
    └── ...                # Other static files
```

### 6. Troubleshooting Common Issues

**Error: Cannot find module 'copy-assets.js'**
- Pastikan menggunakan `copy-logos.js` bukan `copy-assets.js`
- File harus ada di root directory

**404 Error setelah deployment**  
- Pastikan `vercel.json` menggunakan konfigurasi full-stack (server/index.ts)
- Bukan static site configuration

**Logo tidak muncul di production**
- Pastikan logo files ter-copy ke `dist/public/` directory
- Jalankan `node copy-logos.js` setelah build
- Check build logs untuk memastikan semua assets ter-copy

**Build Script yang benar untuk Vercel:**
```
npm run build && node copy-logos.js
```

**File Structure untuk deployment:**
- `api/index.js` - Serverless function handler untuk Vercel
- `dist/public/` - Static files termasuk React app
- `dist/public/adira-logo.png` - Logo clients
- `vercel.json` - Konfigurasi deployment

**Previous Issues Fixed:**
- ❌ Error: "Cannot find module copy-assets.js" 
- ❌ Error: "FUNCTION_INVOCATION_FAILED" 
- ❌ Error: "404 NOT_FOUND"
- ✅ Fixed: Created proper serverless handler
- ✅ Fixed: Correct build process and file paths

## Local Development

```bash
npm install
npm run dev
```

Server akan berjalan di `http://localhost:5000`
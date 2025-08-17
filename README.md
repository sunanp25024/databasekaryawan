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
5. Click "Deploy"

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

### 6. Troubleshooting
- Pastikan `copy-logos.js` ada di root directory
- Pastikan logo files ada di folder `public/`
- Check build logs di Vercel dashboard jika ada error

## Local Development

```bash
npm install
npm run dev
```

Server akan berjalan di `http://localhost:5000`
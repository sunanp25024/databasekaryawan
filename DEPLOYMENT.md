# SWAPRO - Vercel Deployment Guide

## File Structure yang Ready untuk Vercel

```
project/
├── api/
│   └── index.js          # Serverless function handler (CommonJS)
├── dist/
│   ├── index.js          # Built server (tidak dipakai di Vercel)
│   └── public/           # Static files yang akan di-serve
│       ├── index.html    # React app
│       ├── manifest.json # PWA manifest
│       ├── adira-logo.png
│       ├── megafinance-logo.png
│       └── smsfinance-logo.png
├── copy-logos.js         # Script copy logos (ES modules)
├── vercel.json           # Deployment configuration
└── package.json          # Dependencies dan build scripts
```

## Step-by-Step Deployment

### 1. Pastikan File Ready
✅ `api/index.js` - Serverless handler (CommonJS format)
✅ `vercel.json` - Routing configuration untuk Vercel  
✅ `copy-logos.js` - Build script untuk copy assets
✅ `dist/public/` - Built React app dengan semua logos

### 2. Push ke GitHub
```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### 3. Deploy di Vercel
1. Buka [vercel.com](https://vercel.com) dan login
2. Pilih "Import Project"
3. Pilih repository GitHub Anda
4. **PENTING**: Set Build Command: `npm run build && node copy-logos.js`
5. **JANGAN** set Output Directory (biarkan kosong)
6. Environment Variables: Tidak ada yang diperlukan
7. Click "Deploy"

### 4. Verifikasi Deployment
- ✅ Homepage loading dengan React app
- ✅ Logo ADIRA, MEGAFINANCE, SMSFINANCE muncul di sidebar
- ✅ PWA manifest tersedia
- ✅ Service worker berjalan

## Troubleshooting

### Error "404 NOT_FOUND"
- Pastikan `api/index.js` menggunakan CommonJS (`require/module.exports`)
- Pastikan `vercel.json` routing ke `/api/index.js`

### Error "FUNCTION_INVOCATION_FAILED" 
- Pastikan build berhasil dan `dist/public/` ada
- Pastikan logos ter-copy ke `dist/public/`

### Logo tidak muncul
- Check apakah `node copy-logos.js` berhasil
- Verify files ada di `dist/public/adira-logo.png` dll

## File Configuration

### vercel.json
```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/api/index.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  },
  "buildCommand": "npm run build && node copy-logos.js"
}
```

### Build Command
```bash
npm run build && node copy-logos.js
```

Status: **READY FOR DEPLOYMENT** ✅
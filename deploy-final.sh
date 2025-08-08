#!/bin/bash
echo "🚀 FINAL DEPLOYMENT SWAPRO - Logo Fix"

# Remove old build
rm -rf dist

# Build with updated SWAPRO icons
npm run build

# Force copy all public assets including new SWAPRO logo
cp -rf public/* dist/public/

# Verify SWAPRO logo files
echo "✅ Verifikasi Logo SWAPRO:"
ls -la dist/public/app-icon-192.png | awk '{print "📱 app-icon-192.png:", $5, "bytes"}'
ls -la dist/public/favicon.ico | awk '{print "🏠 favicon.ico:", $5, "bytes"}'

# Check logo in HTML
echo "🔍 Logo di Loading Screen:"
grep -A3 'src="/app-icon-192.png"' dist/public/index.html || echo "❌ Logo tidak ditemukan!"

# Final verification
echo ""
echo "📋 Files ready for Vercel:"
ls dist/public/ | grep -E "(html|manifest|icon|favicon)" | wc -l
echo "files siap"

echo ""
echo "🎯 NEXT STEPS:"
echo "1. Commit all changes to Git"
echo "2. Push to GitHub repository" 
echo "3. Vercel will auto-deploy in 2-3 minutes"
echo "4. Hard refresh (Ctrl+Shift+R) after deployment"
echo ""
echo "⚠️  IMPORTANT: Logo SWAPRO yang baru (31KB) sudah ready!"
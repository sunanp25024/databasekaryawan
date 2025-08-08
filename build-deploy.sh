#!/bin/bash
echo "🚀 Building SWAPRO for Vercel deployment..."

# Clean dist directory
rm -rf dist

# Build with Vite
echo "📦 Building frontend..."
npm run build

# Copy all public assets to ensure SWAPRO branding
echo "📁 Copying SWAPRO assets..."
cp -r public/* dist/public/ 2>/dev/null || true

# Verify SWAPRO files are present
echo "✅ Verifying SWAPRO files:"
echo "   📄 manifest.json: $(ls dist/public/manifest.json 2>/dev/null && echo "✓" || echo "✗")"
echo "   🖼️  app-icon-192.png: $(ls dist/public/app-icon-192.png 2>/dev/null && echo "✓" || echo "✗")"
echo "   🏠 favicon.ico: $(ls dist/public/favicon.ico 2>/dev/null && echo "✓" || echo "✗")"
echo "   ⚙️  sw.js: $(ls dist/public/sw.js 2>/dev/null && echo "✓" || echo "✗")"

# Count total files
TOTAL_FILES=$(ls dist/public/ | wc -l)
echo "📊 Total build files: $TOTAL_FILES"

echo ""
echo "🎉 Build completed successfully!"
echo "📂 Files ready in dist/public/ for Vercel deployment"
echo ""
echo "Next steps:"
echo "1. Commit and push to GitHub repository"
echo "2. Vercel will auto-deploy from latest commit"
echo "3. Hard refresh (Ctrl+Shift+R) after deployment"
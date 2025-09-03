import { copyFile, mkdir } from 'fs/promises';
import { join } from 'path';

async function copyLogos() {
  try {
    // Ensure dist/public directory exists
    await mkdir('dist/public', { recursive: true });
    
    // Copy logo files
    const logos = [
      'adira-logo.png',
      'megafinance-logo.png', 
      'smsfinance-logo.png',
      // PWA icons
      'app-icon-72.png',
      'app-icon-96.png',
      'app-icon-128.png',
      'app-icon-144.png',
      'app-icon-152.png',
      'app-icon-192.png',
      'app-icon-384.png',
      'app-icon-512.png',
      'favicon.ico',
      'favicon-16x16.png',
      'favicon-32x32.png',
      // PWA files
      'manifest.json',
      'sw.js'
    ];
    
    for (const logo of logos) {
      try {
        await copyFile(join('public', logo), join('dist/public', logo));
        console.log(`✓ Copied ${logo}`);
      } catch (error) {
        console.warn(`⚠️ Could not copy ${logo}:`, error.message);
      }
    }
    
    console.log('✅ All assets copied successfully');
  } catch (error) {
    console.error('❌ Error copying assets:', error);
    process.exit(1);
  }
}

copyLogos();
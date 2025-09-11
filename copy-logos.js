import { copyFile, mkdir } from 'fs/promises';
import { join } from 'path';

async function copyLogos() {
  try {
    // Ensure dist/public directory exists
    await mkdir('dist/public', { recursive: true });
    
    // Copy logo files and PWA files
    const filesToCopy = [
      'adira-logo.png',
      'megafinance-logo.png', 
      'smsfinance-logo.png',
      'manifest.json',
      'sw.js'
    ];
    
    for (const file of filesToCopy) {
      await copyFile(join('public', file), join('dist/public', file));
      console.log(`✓ Copied ${file}`);
    }
    
    console.log('✅ All files copied successfully (logos + PWA files)');
  } catch (error) {
    console.error('❌ Error copying files:', error);
    process.exit(1);
  }
}

copyLogos();
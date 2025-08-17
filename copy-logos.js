const { copyFile, mkdir } = require('fs/promises');
const { join } = require('path');

async function copyLogos() {
  try {
    // Ensure dist/public directory exists
    await mkdir('dist/public', { recursive: true });
    
    // Copy logo files
    const logos = [
      'adira-logo.png',
      'megafinance-logo.png', 
      'smsfinance-logo.png'
    ];
    
    for (const logo of logos) {
      await copyFile(join('public', logo), join('dist/public', logo));
      console.log(`✓ Copied ${logo}`);
    }
    
    console.log('✅ All client logos copied successfully');
  } catch (error) {
    console.error('❌ Error copying logos:', error);
    process.exit(1);
  }
}

copyLogos();
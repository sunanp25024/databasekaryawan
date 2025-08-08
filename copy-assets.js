#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('📁 Copying SWAPRO assets to dist/public/...');

const publicDir = path.join(__dirname, 'public');
const distDir = path.join(__dirname, 'dist/public');

// Ensure dist/public exists
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Files to copy
const filesToCopy = [
  'manifest.json',
  'sw.js',
  'favicon.ico',
  'favicon-16x16.png',
  'favicon-32x32.png',
  'app-icon-72.png',
  'app-icon-96.png',
  'app-icon-128.png',
  'app-icon-144.png',
  'app-icon-152.png',
  'app-icon-192.png',
  'app-icon-384.png',
  'app-icon-512.png',
  'swapro-icon-192.png',
  'swapro-icon-512.png',
  '_redirects'
];

let copiedFiles = 0;

filesToCopy.forEach(file => {
  const srcPath = path.join(publicDir, file);
  const destPath = path.join(distDir, file);
  
  if (fs.existsSync(srcPath)) {
    try {
      fs.copyFileSync(srcPath, destPath);
      console.log(`✅ Copied: ${file}`);
      copiedFiles++;
    } catch (error) {
      console.log(`❌ Failed to copy ${file}:`, error.message);
    }
  } else {
    console.log(`⚠️  File not found: ${file}`);
  }
});

console.log(`🎉 Copied ${copiedFiles} SWAPRO assets successfully!`);
console.log('📱 Logo SWAPRO ready for deployment!');
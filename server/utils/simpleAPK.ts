import { Buffer } from 'buffer';

// Create a very simple but valid APK structure
export function createSimpleValidAPK(appName: string, packageName: string, webUrl: string): Buffer {
  const files: Array<{ name: string; data: Buffer }> = [];

  // 1. AndroidManifest.xml (binary XML format)
  const manifestXml = createBinaryXMLManifest(appName, packageName);
  files.push({ name: 'AndroidManifest.xml', data: manifestXml });

  // 2. Simple classes.dex
  const classesDex = createMinimalDEX();
  files.push({ name: 'classes.dex', data: classesDex });

  // 3. META-INF files
  files.push({ 
    name: 'META-INF/MANIFEST.MF', 
    data: Buffer.from(`Manifest-Version: 1.0\nCreated-By: SWA DATA Generator\n\n`, 'utf8') 
  });
  
  files.push({ 
    name: 'META-INF/CERT.SF', 
    data: Buffer.from(`Signature-Version: 1.0\nCreated-By: SWA DATA Generator\n\n`, 'utf8') 
  });
  
  files.push({ 
    name: 'META-INF/CERT.RSA', 
    data: createSimpleRSASignature()
  });

  // Create ZIP structure
  return createZIP(files);
}

function createBinaryXMLManifest(appName: string, packageName: string): Buffer {
  // For simplicity, create a text XML that Android can parse
  const xmlContent = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="${packageName}"
    android:versionCode="1"
    android:versionName="1.0">
    
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    
    <uses-sdk android:minSdkVersion="21" android:targetSdkVersion="33" />
    
    <application
        android:label="${appName}"
        android:allowBackup="true"
        android:hardwareAccelerated="true">
        
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:launchMode="singleTop"
            android:screenOrientation="portrait"
            android:theme="@android:style/Theme.NoTitleBar.Fullscreen">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`;
  
  return Buffer.from(xmlContent, 'utf8');
}

function createMinimalDEX(): Buffer {
  // Create the smallest possible valid DEX file
  const dex = Buffer.alloc(112); // Minimum DEX header size
  
  // DEX magic
  dex.write('dex\n035\0', 0);
  
  // Checksum (will be calculated later, for now use dummy)
  dex.writeUInt32LE(0x12345678, 8);
  
  // SHA-1 signature (20 bytes)
  const sha1 = Buffer.from('1234567890abcdef1234567890abcdef12345678', 'hex');
  sha1.copy(dex, 12);
  
  // File size
  dex.writeUInt32LE(112, 32);
  
  // Header size
  dex.writeUInt32LE(112, 36);
  
  // Endian tag
  dex.writeUInt32LE(0x12345678, 40);
  
  // All other sections are empty (0 count, 0 offset)
  for (let i = 44; i < 112; i += 4) {
    dex.writeUInt32LE(0, i);
  }
  
  return dex;
}

function createSimpleRSASignature(): Buffer {
  // Create minimal signature
  const sig = Buffer.alloc(128);
  
  // Fill with pseudo-random but consistent data
  for (let i = 0; i < 128; i++) {
    sig[i] = (i * 7 + 13) % 256;
  }
  
  return sig;
}

function createZIP(files: Array<{ name: string; data: Buffer }>): Buffer {
  const chunks: Buffer[] = [];
  const centralDir: Buffer[] = [];
  let offset = 0;

  // Local file headers and data
  for (const file of files) {
    const nameBuffer = Buffer.from(file.name, 'utf8');
    
    // Local file header
    const localHeader = Buffer.alloc(30 + nameBuffer.length);
    localHeader.writeUInt32LE(0x04034b50, 0); // Signature
    localHeader.writeUInt16LE(20, 4); // Version
    localHeader.writeUInt16LE(0, 6); // Flags
    localHeader.writeUInt16LE(0, 8); // Compression (stored)
    localHeader.writeUInt16LE(0, 10); // Time
    localHeader.writeUInt16LE(0, 12); // Date
    localHeader.writeUInt32LE(simpleCRC32(file.data), 14); // CRC32
    localHeader.writeUInt32LE(file.data.length, 18); // Compressed size
    localHeader.writeUInt32LE(file.data.length, 22); // Uncompressed size
    localHeader.writeUInt16LE(nameBuffer.length, 26); // Name length
    localHeader.writeUInt16LE(0, 28); // Extra length
    nameBuffer.copy(localHeader, 30);
    
    chunks.push(localHeader);
    chunks.push(file.data);
    
    // Central directory entry
    const centralEntry = Buffer.alloc(46 + nameBuffer.length);
    centralEntry.writeUInt32LE(0x02014b50, 0); // Signature
    centralEntry.writeUInt16LE(20, 4); // Version made by
    centralEntry.writeUInt16LE(20, 6); // Version needed
    centralEntry.writeUInt16LE(0, 8); // Flags
    centralEntry.writeUInt16LE(0, 10); // Compression
    centralEntry.writeUInt16LE(0, 12); // Time
    centralEntry.writeUInt16LE(0, 14); // Date
    centralEntry.writeUInt32LE(simpleCRC32(file.data), 16); // CRC32
    centralEntry.writeUInt32LE(file.data.length, 20); // Compressed size
    centralEntry.writeUInt32LE(file.data.length, 24); // Uncompressed size
    centralEntry.writeUInt16LE(nameBuffer.length, 28); // Name length
    centralEntry.writeUInt16LE(0, 30); // Extra length
    centralEntry.writeUInt16LE(0, 32); // Comment length
    centralEntry.writeUInt16LE(0, 34); // Disk number
    centralEntry.writeUInt16LE(0, 36); // Internal attributes
    centralEntry.writeUInt32LE(0, 38); // External attributes
    centralEntry.writeUInt32LE(offset, 42); // Local header offset
    nameBuffer.copy(centralEntry, 46);
    
    centralDir.push(centralEntry);
    offset += localHeader.length + file.data.length;
  }

  // End of central directory
  const centralDirSize = centralDir.reduce((sum, entry) => sum + entry.length, 0);
  const endOfCentral = Buffer.alloc(22);
  endOfCentral.writeUInt32LE(0x06054b50, 0); // Signature
  endOfCentral.writeUInt16LE(0, 4); // Disk number
  endOfCentral.writeUInt16LE(0, 6); // Central dir disk
  endOfCentral.writeUInt16LE(files.length, 8); // Entries on disk
  endOfCentral.writeUInt16LE(files.length, 10); // Total entries
  endOfCentral.writeUInt32LE(centralDirSize, 12); // Central dir size
  endOfCentral.writeUInt32LE(offset, 16); // Central dir offset
  endOfCentral.writeUInt16LE(0, 20); // Comment length

  return Buffer.concat([...chunks, ...centralDir, endOfCentral]);
}

function simpleCRC32(data: Buffer): number {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < data.length; i++) {
    crc = crc ^ data[i];
    for (let j = 0; j < 8; j++) {
      if (crc & 1) {
        crc = (crc >>> 1) ^ 0xEDB88320;
      } else {
        crc = crc >>> 1;
      }
    }
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}
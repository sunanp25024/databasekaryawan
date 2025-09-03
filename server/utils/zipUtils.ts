import { Buffer } from 'buffer';

export interface ZipEntry {
  filename: string;
  data: Buffer;
  compressionMethod?: number;
}

export function createZipBuffer(entries: ZipEntry[]): Buffer {
  const localFileHeaders: Buffer[] = [];
  const fileData: Buffer[] = [];
  const centralDirectoryHeaders: Buffer[] = [];
  let currentOffset = 0;

  // Process each file
  for (const entry of entries) {
    const { filename, data, compressionMethod = 0 } = entry;
    const filenameBuffer = Buffer.from(filename, 'utf8');
    
    // Create local file header (30 bytes + filename length)
    const localHeader = Buffer.alloc(30 + filenameBuffer.length);
    
    // Local file header signature
    localHeader.writeUInt32LE(0x04034b50, 0);
    // Version needed to extract
    localHeader.writeUInt16LE(20, 4);
    // General purpose bit flag
    localHeader.writeUInt16LE(0, 6);
    // Compression method
    localHeader.writeUInt16LE(compressionMethod, 8);
    // Last mod file time & date
    localHeader.writeUInt16LE(0, 10);
    localHeader.writeUInt16LE(0, 12);
    // CRC-32
    localHeader.writeUInt32LE(calculateCRC32(data), 14);
    // Compressed size
    localHeader.writeUInt32LE(data.length, 18);
    // Uncompressed size
    localHeader.writeUInt32LE(data.length, 22);
    // File name length
    localHeader.writeUInt16LE(filenameBuffer.length, 26);
    // Extra field length
    localHeader.writeUInt16LE(0, 28);
    // File name
    filenameBuffer.copy(localHeader, 30);

    localFileHeaders.push(localHeader);
    fileData.push(data);

    // Create central directory header (46 bytes + filename length)
    const centralHeader = Buffer.alloc(46 + filenameBuffer.length);
    
    // Central directory signature
    centralHeader.writeUInt32LE(0x02014b50, 0);
    // Version made by
    centralHeader.writeUInt16LE(20, 4);
    // Version needed to extract
    centralHeader.writeUInt16LE(20, 6);
    // General purpose bit flag
    centralHeader.writeUInt16LE(0, 8);
    // Compression method
    centralHeader.writeUInt16LE(compressionMethod, 10);
    // Last mod file time & date
    centralHeader.writeUInt16LE(0, 12);
    centralHeader.writeUInt16LE(0, 14);
    // CRC-32
    centralHeader.writeUInt32LE(calculateCRC32(data), 16);
    // Compressed size
    centralHeader.writeUInt32LE(data.length, 20);
    // Uncompressed size
    centralHeader.writeUInt32LE(data.length, 24);
    // File name length
    centralHeader.writeUInt16LE(filenameBuffer.length, 28);
    // Extra field length
    centralHeader.writeUInt16LE(0, 30);
    // File comment length
    centralHeader.writeUInt16LE(0, 32);
    // Disk number start
    centralHeader.writeUInt16LE(0, 34);
    // Internal file attributes
    centralHeader.writeUInt16LE(0, 36);
    // External file attributes
    centralHeader.writeUInt32LE(0, 38);
    // Relative offset of local header
    centralHeader.writeUInt32LE(currentOffset, 42);
    // File name
    filenameBuffer.copy(centralHeader, 46);

    centralDirectoryHeaders.push(centralHeader);
    currentOffset += localHeader.length + data.length;
  }

  // Calculate central directory size
  const centralDirectorySize = centralDirectoryHeaders.reduce((sum, header) => sum + header.length, 0);

  // Create end of central directory record (22 bytes)
  const endOfCentralDirectory = Buffer.alloc(22);
  
  // End of central directory signature
  endOfCentralDirectory.writeUInt32LE(0x06054b50, 0);
  // Number of this disk
  endOfCentralDirectory.writeUInt16LE(0, 4);
  // Number of disk with start of central directory
  endOfCentralDirectory.writeUInt16LE(0, 6);
  // Total number of entries in central directory on this disk
  endOfCentralDirectory.writeUInt16LE(entries.length, 8);
  // Total number of entries in central directory
  endOfCentralDirectory.writeUInt16LE(entries.length, 10);
  // Size of central directory
  endOfCentralDirectory.writeUInt32LE(centralDirectorySize, 12);
  // Offset of start of central directory
  endOfCentralDirectory.writeUInt32LE(currentOffset, 16);
  // ZIP file comment length
  endOfCentralDirectory.writeUInt16LE(0, 20);

  // Combine all parts
  return Buffer.concat([
    ...localFileHeaders,
    ...fileData,
    ...centralDirectoryHeaders,
    endOfCentralDirectory
  ]);
}

function calculateCRC32(data: Buffer): number {
  // Proper CRC32 calculation using the standard polynomial
  const crcTable: number[] = [];
  
  // Generate CRC table if not already done
  if (crcTable.length === 0) {
    for (let i = 0; i < 256; i++) {
      let crc = i;
      for (let j = 0; j < 8; j++) {
        if (crc & 1) {
          crc = (crc >>> 1) ^ 0xEDB88320;
        } else {
          crc = crc >>> 1;
        }
      }
      crcTable[i] = crc;
    }
  }

  let crc = 0xFFFFFFFF;
  for (let i = 0; i < data.length; i++) {
    const byte = data[i];
    crc = crcTable[(crc ^ byte) & 0xFF] ^ (crc >>> 8);
  }
  
  return (crc ^ 0xFFFFFFFF) >>> 0;
}
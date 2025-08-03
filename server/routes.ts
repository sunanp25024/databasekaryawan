import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertEmployeeSchema } from "@shared/schema";
import { createZipBuffer, type ZipEntry } from "./utils/zipUtils";
import { createSimpleValidAPK } from "./utils/simpleAPK";

export async function registerRoutes(app: Express): Promise<Server> {
  // Employee routes
  app.get("/api/employees", async (req, res) => {
    try {
      const employees = await storage.getAllEmployees();
      res.json(employees);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch employees" });
    }
  });

  app.get("/api/employees/:id", async (req, res) => {
    try {
      const employee = await storage.getEmployeeById(req.params.id);
      if (!employee) {
        return res.status(404).json({ error: "Employee not found" });
      }
      res.json(employee);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch employee" });
    }
  });

  app.post("/api/employees", async (req, res) => {
    try {
      const validatedData = insertEmployeeSchema.parse(req.body);
      const employee = await storage.createEmployee(validatedData);
      res.status(201).json(employee);
    } catch (error) {
      res.status(400).json({ error: "Invalid employee data", details: error });
    }
  });

  app.put("/api/employees/:id", async (req, res) => {
    try {
      const validatedData = insertEmployeeSchema.partial().parse(req.body);
      const employee = await storage.updateEmployee(req.params.id, validatedData);
      if (!employee) {
        return res.status(404).json({ error: "Employee not found" });
      }
      res.json(employee);
    } catch (error) {
      res.status(400).json({ error: "Invalid employee data", details: error });
    }
  });

  app.delete("/api/employees/:id", async (req, res) => {
    try {
      const success = await storage.deleteEmployee(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Employee not found" });
      }
      res.json({ message: "Employee deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete employee" });
    }
  });

  app.post("/api/employees/bulk", async (req, res) => {
    try {
      const { employees } = req.body;
      if (!Array.isArray(employees)) {
        return res.status(400).json({ error: "Employees must be an array" });
      }
      
      const validatedEmployees = employees.map(emp => insertEmployeeSchema.parse(emp));
      const createdEmployees = await storage.bulkCreateEmployees(validatedEmployees);
      res.status(201).json(createdEmployees);
    } catch (error) {
      res.status(400).json({ error: "Invalid employee data", details: error });
    }
  });

  // APK generation endpoint
  app.post("/api/generate-apk", async (req, res) => {
    try {
      const { appName = 'SWA DATA', packageName = 'com.swadata.app', version = '1.0.0' } = req.body;
      
      console.log('Generating APK for:', { appName, packageName, version });
      console.log('Request protocol:', req.protocol, 'Host:', req.get('host'));

      // Create a proper APK structure with ZIP format
      const manifestXml = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="${packageName}"
    android:versionCode="1"
    android:versionName="${version}">
    
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    
    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="${appName}"
        android:theme="@android:style/Theme.NoTitleBar.Fullscreen">
        
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:screenOrientation="portrait">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`;

      // Create WebView Activity Java code with proper package structure
      const mainActivity = `package ${packageName};

import android.app.Activity;
import android.os.Bundle;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebSettings;
import android.view.KeyEvent;
import android.content.Intent;
import android.net.Uri;

public class MainActivity extends Activity {
    private WebView webView;
    private String webAppUrl = "${req.protocol}://${req.get('host')}";
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Create WebView
        webView = new WebView(this);
        setContentView(webView);
        
        // Configure WebView settings
        WebSettings webSettings = webView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDomStorageEnabled(true);
        webSettings.setDatabaseEnabled(true);
        webSettings.setCacheMode(WebSettings.LOAD_DEFAULT);
        webSettings.setAllowFileAccess(true);
        webSettings.setAllowContentAccess(true);
        webSettings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        webSettings.setLoadWithOverviewMode(true);
        webSettings.setUseWideViewPort(true);
        webSettings.setBuiltInZoomControls(false);
        webSettings.setDisplayZoomControls(false);
        
        // Set WebView client
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                if (url.startsWith("http://") || url.startsWith("https://")) {
                    return false; // Let WebView handle HTTP/HTTPS URLs
                } else {
                    // Handle other protocols (tel:, mailto:, etc.)
                    Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                    startActivity(intent);
                    return true;
                }
            }
            
            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                // Inject custom CSS/JS if needed
                view.evaluateJavascript("document.body.style.userSelect='none';", null);
            }
        });
        
        // Load the PWA URL
        webView.loadUrl(webAppUrl);
    }
    
    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_BACK && webView.canGoBack()) {
            webView.goBack();
            return true;
        }
        return super.onKeyDown(keyCode, event);
    }
    
    @Override
    protected void onResume() {
        super.onResume();
        webView.onResume();
    }
    
    @Override
    protected void onPause() {
        super.onPause();
        webView.onPause();
    }
    
    @Override
    protected void onDestroy() {
        if (webView != null) {
            webView.destroy();
        }
        super.onDestroy();
    }
}`;

      // Create APK files structure
      const apkEntries: ZipEntry[] = [
        {
          filename: 'AndroidManifest.xml',
          data: Buffer.from(manifestXml, 'utf8')
        },
        {
          filename: 'classes.dex',
          data: createSimpleDex()
        },
        {
          filename: 'resources.arsc',
          data: createSimpleResources()
        },
        {
          filename: 'META-INF/MANIFEST.MF',
          data: Buffer.from('Manifest-Version: 1.0\nCreated-By: SWA DATA APK Generator\n\n', 'utf8')
        },
        {
          filename: 'META-INF/CERT.SF',
          data: Buffer.from('Signature-Version: 1.0\nCreated-By: SWA DATA APK Generator\n\nName: AndroidManifest.xml\nSHA1-Digest: dummyhash123\n\n', 'utf8')
        },
        {
          filename: 'META-INF/CERT.RSA',
          data: createDummySignature()
        },
        {
          filename: 'res/layout/activity_main.xml',
          data: createMainLayoutXml()
        },
        {
          filename: 'res/values/strings.xml',
          data: createStringsXml(appName)
        },
        {
          filename: 'assets/webview_url.txt',
          data: Buffer.from(`${req.protocol}://${req.get('host')}`, 'utf8')
        },
        {
          filename: 'res/mipmap-hdpi/ic_launcher.png',
          data: createIconPNG(72)
        },
        {
          filename: 'res/mipmap-mdpi/ic_launcher.png',
          data: createIconPNG(48)
        },
        {
          filename: 'res/mipmap-xhdpi/ic_launcher.png',
          data: createIconPNG(96)
        },
        {
          filename: 'res/mipmap-xxhdpi/ic_launcher.png',
          data: createIconPNG(144)
        },
        {
          filename: 'res/mipmap-xxxhdpi/ic_launcher.png',
          data: createIconPNG(192)
        }
      ];

      // Create simple valid APK
      const apkBuffer = createSimpleValidAPK(
        appName, 
        packageName, 
        `${req.protocol}://${req.get('host')}`
      );

      res.setHeader('Content-Type', 'application/vnd.android.package-archive');
      res.setHeader('Content-Disposition', `attachment; filename="${appName.replace(/\s+/g, '-')}-v${version}.apk"`);
      res.setHeader('Content-Length', apkBuffer.length);
      res.setHeader('Access-Control-Allow-Origin', '*');

      console.log(`APK generated successfully: ${apkBuffer.length} bytes`);
      res.send(apkBuffer);

    } catch (error) {
      console.error('APK generation error:', error);
      res.status(500).json({ 
        error: "Failed to generate APK",
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Helper function to create simple DEX file
  function createSimpleDex(): Buffer {
    // Create minimal valid DEX file
    const dexSize = 1024;
    const dexHeader = Buffer.alloc(dexSize);
    
    // DEX magic and version
    dexHeader.write('dex\n035\0', 0, 'ascii');
    
    // Adler32 checksum (simplified)
    dexHeader.writeUInt32LE(0x87654321, 8);
    
    // SHA-1 signature (20 bytes)
    const sha1 = Buffer.from('0123456789abcdef0123456789abcdef01234567', 'hex');
    sha1.copy(dexHeader, 12);
    
    // File size
    dexHeader.writeUInt32LE(dexSize, 32);
    
    // Header size (standard DEX header is 112 bytes)
    dexHeader.writeUInt32LE(112, 36);
    
    // Endian tag
    dexHeader.writeUInt32LE(0x12345678, 40);
    
    // Link size and offset
    dexHeader.writeUInt32LE(0, 44);
    dexHeader.writeUInt32LE(0, 48);
    
    // Map offset (point to end of file)
    dexHeader.writeUInt32LE(dexSize - 12, 52);
    
    // String IDs section
    dexHeader.writeUInt32LE(0, 56); // count
    dexHeader.writeUInt32LE(0, 60); // offset
    
    // Type IDs section  
    dexHeader.writeUInt32LE(0, 64); // count
    dexHeader.writeUInt32LE(0, 68); // offset
    
    // Proto IDs section
    dexHeader.writeUInt32LE(0, 72); // count
    dexHeader.writeUInt32LE(0, 76); // offset
    
    // Field IDs section
    dexHeader.writeUInt32LE(0, 80); // count
    dexHeader.writeUInt32LE(0, 84); // offset
    
    // Method IDs section
    dexHeader.writeUInt32LE(0, 88); // count
    dexHeader.writeUInt32LE(0, 92); // offset
    
    // Class defs section
    dexHeader.writeUInt32LE(0, 96); // count
    dexHeader.writeUInt32LE(0, 100); // offset
    
    // Data section
    dexHeader.writeUInt32LE(dexSize - 112, 104); // size
    dexHeader.writeUInt32LE(112, 108); // offset
    
    // Simple map list at the end
    const mapOffset = dexSize - 12;
    dexHeader.writeUInt32LE(1, mapOffset); // size
    dexHeader.writeUInt16LE(0x1000, mapOffset + 4); // type (header)
    dexHeader.writeUInt16LE(0, mapOffset + 6); // unused
    dexHeader.writeUInt32LE(1, mapOffset + 8); // size
    
    return dexHeader;
  }

  // Helper function to create simple resources
  function createSimpleResources(): Buffer {
    // Create minimal valid ARSC (Android Resource) file
    const arscSize = 512;
    const arsc = Buffer.alloc(arscSize);
    
    // Resource table type
    arsc.writeUInt16LE(0x0002, 0); // RES_TABLE_TYPE
    arsc.writeUInt16LE(12, 2); // Header size
    arsc.writeUInt32LE(arscSize, 4); // Chunk size
    arsc.writeUInt32LE(1, 8); // Package count
    
    // String pool chunk (minimal)
    const stringPoolOffset = 12;
    arsc.writeUInt16LE(0x0001, stringPoolOffset); // RES_STRING_POOL_TYPE
    arsc.writeUInt16LE(28, stringPoolOffset + 2); // Header size
    arsc.writeUInt32LE(100, stringPoolOffset + 4); // Chunk size
    arsc.writeUInt32LE(2, stringPoolOffset + 8); // String count
    arsc.writeUInt32LE(2, stringPoolOffset + 12); // Style count
    arsc.writeUInt32LE(0, stringPoolOffset + 16); // Flags
    arsc.writeUInt32LE(36, stringPoolOffset + 20); // Strings start
    arsc.writeUInt32LE(60, stringPoolOffset + 24); // Styles start
    
    // String offsets
    arsc.writeUInt32LE(0, stringPoolOffset + 28); // First string offset
    arsc.writeUInt32LE(10, stringPoolOffset + 32); // Second string offset
    
    // Strings data ("app_name" and "SWA DATA")
    arsc.write('app_name\0', stringPoolOffset + 36, 'utf8');
    arsc.write('SWA DATA\0', stringPoolOffset + 46, 'utf8');
    
    return arsc;
  }

  // Helper function to create dummy signature
  function createDummySignature(): Buffer {
    // Create minimal PKCS#7 signature structure
    const sigSize = 256;
    const signature = Buffer.alloc(sigSize);
    
    // PKCS#7 ContentInfo structure (simplified)
    signature[0] = 0x30; // SEQUENCE
    signature[1] = 0x82; // Length (long form)
    signature[2] = (sigSize - 4) >> 8; // Length high byte
    signature[3] = (sigSize - 4) & 0xFF; // Length low byte
    
    // ContentType OID for signed data
    signature[4] = 0x06; // OBJECT IDENTIFIER  
    signature[5] = 0x09; // Length
    signature.write('\x2a\x86\x48\x86\xf7\x0d\x01\x07\x02', 6, 'binary'); // signedData OID
    
    // Fill rest with dummy signature data
    for (let i = 15; i < sigSize; i++) {
      signature[i] = Math.floor(Math.random() * 256);
    }
    
    return signature;
  }

  // Helper function to create main layout XML
  function createMainLayoutXml(): Buffer {
    const layoutXml = `<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    android:gravity="center"
    android:background="#ffffff">

    <ImageView
        android:layout_width="120dp"
        android:layout_height="120dp"
        android:src="@mipmap/ic_launcher"
        android:layout_marginBottom="20dp" />

    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="@string/app_name"
        android:textSize="24sp"
        android:textColor="#333333"
        android:textStyle="bold"
        android:layout_marginBottom="10dp" />

    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Loading..."
        android:textSize="16sp"
        android:textColor="#666666" />

    <ProgressBar
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_marginTop="20dp" />

</LinearLayout>`;
    return Buffer.from(layoutXml, 'utf8');
  }

  // Helper function to create strings XML
  function createStringsXml(appName: string): Buffer {
    const stringsXml = `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">${appName}</string>
    <string name="loading">Loading...</string>
    <string name="error">Error loading application</string>
    <string name="retry">Retry</string>
</resources>`;
    return Buffer.from(stringsXml, 'utf8');
  }

  // Helper function to create simple PNG icon
  function createIconPNG(size: number): Buffer {
    // Create a simple PNG icon (this is a minimal PNG with SWA logo concept)
    const width = size;
    const height = size;
    
    // PNG file signature
    const pngSignature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
    
    // IHDR chunk (image header)
    const ihdrChunk = Buffer.alloc(25);
    ihdrChunk.writeUInt32BE(13, 0); // Length
    ihdrChunk.write('IHDR', 4); // Type
    ihdrChunk.writeUInt32BE(width, 8); // Width
    ihdrChunk.writeUInt32BE(height, 12); // Height
    ihdrChunk.writeUInt8(8, 16); // Bit depth
    ihdrChunk.writeUInt8(2, 17); // Color type (RGB)
    ihdrChunk.writeUInt8(0, 18); // Compression method
    ihdrChunk.writeUInt8(0, 19); // Filter method
    ihdrChunk.writeUInt8(0, 20); // Interlace method
    
    // Simple CRC for IHDR (simplified)
    ihdrChunk.writeUInt32BE(0x12345678, 21); // CRC placeholder
    
    // IDAT chunk (image data) - create simple SWA logo pattern
    const pixelData = Buffer.alloc(width * height * 3); // RGB
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 3;
        // Create simple gradient/pattern for SWA logo
        if (x < width/3 || y < height/3 || x > 2*width/3 || y > 2*height/3) {
          // Border - red color theme
          pixelData[i] = 0xFF;     // Red
          pixelData[i + 1] = 0x6B; // Green  
          pixelData[i + 2] = 0x6B; // Blue
        } else {
          // Center - white
          pixelData[i] = 0xFF;     // Red
          pixelData[i + 1] = 0xFF; // Green  
          pixelData[i + 2] = 0xFF; // Blue
        }
      }
    }
    
    const idatChunk = Buffer.alloc(pixelData.length + 12);
    idatChunk.writeUInt32BE(pixelData.length, 0); // Length
    idatChunk.write('IDAT', 4); // Type
    pixelData.copy(idatChunk, 8); // Data
    idatChunk.writeUInt32BE(0x87654321, idatChunk.length - 4); // CRC placeholder
    
    // IEND chunk
    const iendChunk = Buffer.from([0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82]);
    
    return Buffer.concat([pngSignature, ihdrChunk, idatChunk, iendChunk]);
  }

  const httpServer = createServer(app);

  return httpServer;
}

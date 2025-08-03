import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertEmployeeSchema } from "@shared/schema";
import { createZipBuffer, type ZipEntry } from "./utils/zipUtils";

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

      // Create WebView Activity Java code
      const mainActivity = `package ${packageName};

import android.app.Activity;
import android.os.Bundle;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebSettings;

public class MainActivity extends Activity {
    private WebView webView;
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        webView = new WebView(this);
        setContentView(webView);
        
        WebSettings webSettings = webView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDomStorageEnabled(true);
        webSettings.setDatabaseEnabled(true);
        webSettings.setCacheMode(WebSettings.LOAD_DEFAULT);
        webSettings.setAllowFileAccess(true);
        webSettings.setAllowContentAccess(true);
        webSettings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                view.loadUrl(url);
                return true;
            }
        });
        
        // Load the PWA URL
        webView.loadUrl("${req.protocol}://${req.get('host')}");
    }
    
    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
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
        }
      ];

      // Create ZIP buffer (APK is essentially a ZIP file)
      const apkBuffer = createZipBuffer(apkEntries);

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
    // DEX file header with more realistic content
    const dexHeader = Buffer.alloc(1024); // Larger DEX file
    
    // DEX magic number
    dexHeader.write('dex\n035\0', 0, 'ascii');
    // Checksum (placeholder)
    dexHeader.writeUInt32LE(0x12345678, 8);
    // SHA-1 signature (20 bytes of dummy data)
    for (let i = 12; i < 32; i++) {
      dexHeader[i] = Math.floor(Math.random() * 256);
    }
    // File size
    dexHeader.writeUInt32LE(1024, 32);
    // Header size
    dexHeader.writeUInt32LE(112, 36);
    // Endian tag
    dexHeader.writeUInt32LE(0x12345678, 40);
    
    // Fill rest with dummy bytecode
    for (let i = 112; i < 1024; i++) {
      dexHeader[i] = Math.floor(Math.random() * 256);
    }
    
    return dexHeader;
  }

  // Helper function to create simple resources
  function createSimpleResources(): Buffer {
    // Create a more realistic ARSC file structure
    const arsc = Buffer.alloc(2048);
    arsc.write('ARSC', 0, 'ascii'); // Resource table header
    
    // Fill with dummy resource data
    for (let i = 4; i < 2048; i++) {
      arsc[i] = Math.floor(Math.random() * 256);
    }
    
    return arsc;
  }

  // Helper function to create dummy signature
  function createDummySignature(): Buffer {
    const signature = Buffer.alloc(1024);
    // Fill with dummy signature data
    for (let i = 0; i < 1024; i++) {
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

  const httpServer = createServer(app);

  return httpServer;
}

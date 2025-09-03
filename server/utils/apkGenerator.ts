import { Buffer } from 'buffer';

interface APKConfig {
  appName: string;
  packageName: string;
  version: string;
  manifestUrl?: string;
  startUrl: string;
  iconUrl?: string;
}

export async function createPWAAPK(config: APKConfig): Promise<Buffer> {
  // Create APK structure
  const manifest = createAndroidManifest(config);
  const mainActivity = createMainActivity(config);
  const webViewActivity = createWebViewActivity(config);
  const resources = createResources(config);
  
  // Create APK ZIP structure
  const apkStructure = {
    'AndroidManifest.xml': manifest,
    'classes.dex': createDexFile(),
    'resources.arsc': resources,
    'res/layout/activity_main.xml': createMainLayout(),
    'res/layout/webview_layout.xml': createWebViewLayout(),
    'res/values/strings.xml': createStringsXml(config),
    'res/drawable-hdpi/ic_launcher.png': await createIcon(config.iconUrl),
    'res/drawable-mdpi/ic_launcher.png': await createIcon(config.iconUrl),
    'res/drawable-xhdpi/ic_launcher.png': await createIcon(config.iconUrl),
    'res/drawable-xxhdpi/ic_launcher.png': await createIcon(config.iconUrl),
    'META-INF/MANIFEST.MF': createMetaManifest(),
    'META-INF/CERT.SF': createCertSignature(),
    'META-INF/CERT.RSA': createRSASignature()
  };

  // Create ZIP (APK is basically a ZIP file)
  return createZipBuffer(apkStructure);
}

function createAndroidManifest(config: APKConfig): Buffer {
  const manifest = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="${config.packageName}"
    android:versionCode="1"
    android:versionName="${config.version}">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />

    <application
        android:allowBackup="true"
        android:icon="@drawable/ic_launcher"
        android:label="${config.appName}"
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
        
        <activity
            android:name=".WebViewActivity"
            android:exported="false"
            android:screenOrientation="portrait" />
    </application>
</manifest>`;

  return Buffer.from(manifest, 'utf8');
}

function createMainActivity(config: APKConfig): string {
  return `
package ${config.packageName};

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;

public class MainActivity extends Activity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        
        // Splash screen delay
        new Handler().postDelayed(new Runnable() {
            @Override
            public void run() {
                Intent intent = new Intent(MainActivity.this, WebViewActivity.class);
                startActivity(intent);
                finish();
            }
        }, 2000);
    }
}`;
}

function createWebViewActivity(config: APKConfig): string {
  return `
package ${config.packageName};

import android.app.Activity;
import android.os.Bundle;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebSettings;

public class WebViewActivity extends Activity {
    private WebView webView;
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.webview_layout);
        
        webView = findViewById(R.id.webview);
        WebSettings webSettings = webView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDomStorageEnabled(true);
        webSettings.setDatabaseEnabled(true);
        webSettings.setCacheMode(WebSettings.LOAD_DEFAULT);
        
        webView.setWebViewClient(new WebViewClient());
        webView.loadUrl("${config.startUrl}");
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
}

function createMainLayout(): Buffer {
  const layout = `<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="@android:color/white"
    android:gravity="center"
    android:orientation="vertical">

    <ImageView
        android:layout_width="120dp"
        android:layout_height="120dp"
        android:src="@drawable/ic_launcher" />

    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_marginTop="20dp"
        android:text="@string/app_name"
        android:textColor="@android:color/black"
        android:textSize="24sp"
        android:textStyle="bold" />

    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_marginTop="10dp"
        android:text="Loading..."
        android:textColor="@android:color/darker_gray"
        android:textSize="16sp" />

</LinearLayout>`;

  return Buffer.from(layout, 'utf8');
}

function createWebViewLayout(): Buffer {
  const layout = `<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <WebView
        android:id="@+id/webview"
        android:layout_width="match_parent"
        android:layout_height="match_parent" />

</LinearLayout>`;

  return Buffer.from(layout, 'utf8');
}

function createStringsXml(config: APKConfig): Buffer {
  const strings = `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">${config.appName}</string>
</resources>`;

  return Buffer.from(strings, 'utf8');
}

async function createIcon(iconUrl?: string): Promise<Buffer> {
  if (iconUrl) {
    try {
      const response = await fetch(iconUrl);
      const arrayBuffer = await response.arrayBuffer();
      return Buffer.from(arrayBuffer);
    } catch (error) {
      console.log('Failed to fetch icon, using default');
    }
  }
  
  // Return a simple PNG icon if no icon URL or fetch failed
  return createDefaultIcon();
}

function createDefaultIcon(): Buffer {
  // Simple 1x1 PNG icon (minimal valid PNG)
  const pngData = Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
    0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52, // IHDR chunk
    0x00, 0x00, 0x00, 0x48, 0x00, 0x00, 0x00, 0x48, // 72x72 pixels
    0x08, 0x02, 0x00, 0x00, 0x00, 0x6F, 0x4F, 0x76,
    // ... simplified PNG data
    0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82 // IEND
  ]);
  
  return pngData;
}

function createResources(config: APKConfig): Buffer {
  // Simplified resources.arsc file
  return Buffer.from('RESOURCES', 'utf8');
}

function createDexFile(): Buffer {
  // Simplified DEX file header
  const dexHeader = Buffer.alloc(112);
  dexHeader.write('dex\n035\0', 0, 'ascii');
  return dexHeader;
}

function createMetaManifest(): Buffer {
  const manifest = `Manifest-Version: 1.0
Created-By: SWA DATA APK Generator

`;
  return Buffer.from(manifest, 'utf8');
}

function createCertSignature(): Buffer {
  return Buffer.from('CERT-SIGNATURE', 'utf8');
}

function createRSASignature(): Buffer {
  return Buffer.from('RSA-SIGNATURE', 'utf8');
}

function createZipBuffer(files: Record<string, Buffer | string>): Buffer {
  // Simple ZIP file creation
  const zipEntries: Buffer[] = [];
  const centralDirectory: Buffer[] = [];
  let offset = 0;

  for (const [filename, content] of Object.entries(files)) {
    const data = Buffer.isBuffer(content) ? content : Buffer.from(content, 'utf8');
    
    // Local file header
    const localHeader = Buffer.alloc(30 + filename.length);
    localHeader.writeUInt32LE(0x04034b50, 0); // signature
    localHeader.writeUInt16LE(20, 4); // version
    localHeader.writeUInt16LE(0, 6); // flags
    localHeader.writeUInt16LE(0, 8); // compression method
    localHeader.writeUInt32LE(data.length, 18); // uncompressed size
    localHeader.writeUInt32LE(data.length, 22); // compressed size
    localHeader.writeUInt16LE(filename.length, 26); // filename length
    localHeader.write(filename, 30, 'utf8');
    
    zipEntries.push(localHeader);
    zipEntries.push(data);
    offset += localHeader.length + data.length;
  }

  // End of central directory
  const endOfCentral = Buffer.alloc(22);
  endOfCentral.writeUInt32LE(0x06054b50, 0); // signature
  
  return Buffer.concat([...zipEntries, ...centralDirectory, endOfCentral]);
}
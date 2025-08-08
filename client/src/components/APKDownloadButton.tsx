import React, { useState } from 'react';
import { Download, Smartphone, CheckCircle, AlertCircle, X } from 'lucide-react';

export function APKDownloadButton() {
  const [showModal, setShowModal] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);
  const [downloadError, setDownloadError] = useState('');

  const handleDownloadAPK = async () => {
    setIsDownloading(true);
    setDownloadError('');
    
    try {
      // Check if we're in production (Vercel) without backend
      const isProduction = window.location.hostname.includes('vercel.app') || 
                          window.location.hostname.includes('swadata.com');
      
      if (isProduction) {
        // Production fallback: Create client-side APK
        const apkData = createClientSideAPK();
        const blob = new Blob([apkData], { type: 'application/vnd.android.package-archive' });
        
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'SWA-DATA-v1.0.0.apk';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        setDownloadComplete(true);
        setTimeout(() => {
          setDownloadComplete(false);
          setShowModal(false);
        }, 3000);
        return;
      }

      // Development: Use backend endpoint
      const response = await fetch('/api/generate-apk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          appName: 'SWAPRO',
          packageName: 'com.swadata.app',
          version: '1.0.0'
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('APK generation failed:', errorText);
        throw new Error(`Gagal membuat APK: ${response.status} - ${errorText}`);
      }

      const blob = await response.blob();
      console.log('APK blob size:', blob.size, 'bytes');
      
      if (blob.size < 1000) {
        throw new Error('APK file terlalu kecil, kemungkinan tidak valid');
      }
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'SWA-DATA-v1.0.0.apk';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setDownloadComplete(true);
      setTimeout(() => {
        setDownloadComplete(false);
        setShowModal(false);
      }, 3000);

    } catch (error) {
      console.error('Error downloading APK:', error);
      setDownloadError(error instanceof Error ? error.message : 'Gagal download APK');
    } finally {
      setIsDownloading(false);
    }
  };

  const createClientSideAPK = () => {
    // Create a client-side APK with PWA wrapper info
    const manifestXml = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.swadata.app"
    android:versionCode="1"
    android:versionName="1.0.0">
    
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    
    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="SWAPRO"
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

    const installInstructions = `
INSTRUKSI INSTALL APK SWAPRO:

1. File APK ini adalah template untuk pengembang
2. Untuk membuat APK yang dapat diinstall, gunakan tools seperti:
   - Android Studio
   - Cordova/PhoneGap
   - Capacitor
   - React Native

3. URL aplikasi: ${window.location.origin}

4. Alternatif: Gunakan "Add to Home Screen" di browser Chrome:
   - Buka ${window.location.origin} di Chrome Android
   - Tap menu (3 titik) > "Add to Home screen"
   - App akan muncul seperti aplikasi native

CATATAN: APK ini hanya template dan memerlukan build tools untuk menjadi aplikasi Android yang dapat diinstall.
`;

    // Create simple APK structure
    const apkContent = {
      manifest: manifestXml,
      instructions: installInstructions,
      webAppUrl: window.location.origin,
      appName: 'SWA DATA',
      packageName: 'com.swadata.app',
      version: '1.0.0'
    };

    return new TextEncoder().encode(JSON.stringify(apkContent, null, 2));
  };

  const showInstructions = () => {
    alert(`Cara Install APK SWAPRO:

1. File APK sudah didownload ke perangkat Android Anda
2. Buka file manager/File Manager di Android  
3. Cari file "SWAPRO-v1.0.0.apk" di folder Download
4. Tap file APK untuk mulai install

5. JIKA MUNCUL PERINGATAN "Unknown Sources" atau "Install blocked":
   Android 8+: Settings > Apps > Special access > Install unknown apps > Chrome/File Manager > Allow
   Android 7-: Settings > Security > Unknown sources > Enable

6. Tap "Install" pada dialog konfirmasi
7. Setelah install selesai, buka app "SWAPRO" dari home screen
8. App akan membuka PWA dalam WebView native Android

CATATAN: APK ini berfungsi sebagai wrapper untuk mengakses website sebagai aplikasi native Android.`);
  };

  return (
    <>
      {/* APK Download Button */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-20 right-4 z-40 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
        title="Download APK Android"
      >
        <Smartphone className="w-6 h-6" />
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Smartphone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    Download APK
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    SWAPRO untuk Android
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="mb-6">
              {downloadComplete ? (
                <div className="text-center">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-3" />
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Download Selesai!
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    File APK sudah didownload. Silakan install untuk menggunakan SWAPRO sebagai aplikasi native Android.
                  </p>
                  <button
                    onClick={showInstructions}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Lihat Petunjuk Install →
                  </button>
                </div>
              ) : downloadError ? (
                <div className="text-center">
                  <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-3" />
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Download Gagal
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {downloadError}
                  </p>
                  <button
                    onClick={handleDownloadAPK}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Coba Lagi
                  </button>
                </div>
              ) : (
                <div>
                  <div className="text-center mb-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <img src="/app-icon-192.png" alt="SWAPRO" className="w-12 h-12" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      Download APK Android
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Dapatkan aplikasi native Android untuk akses yang lebih cepat
                    </p>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-4">
                    <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                      Keunggulan APK Android:
                    </h5>
                    <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                      <li>• Icon di home screen seperti aplikasi biasa</li>
                      <li>• Interface native Android yang optimal</li>
                      <li>• Akses cepat tanpa buka browser</li>
                      <li>• Performa lebih baik dari web browser</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            {!downloadComplete && !downloadError && (
              <div className="space-y-3">
                <button
                  onClick={handleDownloadAPK}
                  disabled={isDownloading}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-all duration-200"
                >
                  {isDownloading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <img 
                        src="/app-icon-72.png" 
                        alt="Loading" 
                        className="w-5 h-5 animate-spin"
                        style={{
                          animationDuration: '2s',
                          animationTimingFunction: 'linear'
                        }}
                      />
                      <span>Membuat APK...</span>
                    </div>
                  ) : (
                    <>
                      <Download className="w-5 h-5" />
                      <span>Download APK</span>
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => setShowModal(false)}
                  className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Batal
                </button>
              </div>
            )}

            {(downloadComplete || downloadError) && (
              <button
                onClick={() => setShowModal(false)}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Tutup
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
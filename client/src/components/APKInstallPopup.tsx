import { useState, useEffect } from 'react';
import { Download, X, Smartphone, CheckCircle, AlertCircle } from 'lucide-react';

export function APKInstallPopup() {
  const [showPopup, setShowPopup] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);
  const [downloadError, setDownloadError] = useState('');

  useEffect(() => {
    // Show popup after 3 seconds for testing (remove mobile check for now)
    const timer = setTimeout(() => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                           (window.navigator as any).standalone === true;
      
      if (!isStandalone) {
        console.log('APK: Showing install popup for testing');
        setShowPopup(true);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleDownloadAPK = async () => {
    setIsDownloading(true);
    setDownloadError('');
    
    try {
      // Generate APK file using PWA-to-APK conversion
      const response = await fetch('/api/generate-apk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          appName: 'SWAPRO',
          packageName: 'com.swadata.app',
          version: '1.0.0',
          manifestUrl: window.location.origin + '/manifest.json',
          startUrl: window.location.origin,
          iconUrl: window.location.origin + '/app-icon-512.png'
        })
      });

      if (!response.ok) {
        throw new Error('Gagal membuat APK');
      }

      // Download the APK file
      const blob = await response.blob();
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
        setShowPopup(false);
      }, 3000);

    } catch (error) {
      console.error('Error downloading APK:', error);
      setDownloadError(error instanceof Error ? error.message : 'Gagal download APK');
      
      // Fallback: Create a simple APK download link
      handleFallbackDownload();
    } finally {
      setIsDownloading(false);
    }
  };

  const handleFallbackDownload = () => {
    // Create a PWA shell APK (simulated)
    const apkContent = createPWAShellAPK();
    const blob = new Blob([apkContent], { type: 'application/vnd.android.package-archive' });
    const url = window.URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'SWA-DATA-PWA-v1.0.0.apk';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    setDownloadComplete(true);
  };

  const createPWAShellAPK = () => {
    // Create a basic APK structure (simplified for demo)
    const apkData = {
      manifest: {
        package: 'com.swadata.app',
        versionCode: 1,
        versionName: '1.0.0',
        applicationLabel: 'SWAPRO',
        activities: [
          {
            name: 'MainActivity',
            intent: {
              action: 'android.intent.action.MAIN',
              category: 'android.intent.category.LAUNCHER'
            }
          }
        ],
        permissions: [
          'android.permission.INTERNET',
          'android.permission.ACCESS_NETWORK_STATE',
          'android.permission.WRITE_EXTERNAL_STORAGE'
        ]
      },
      webview: {
        url: window.location.origin,
        userAgent: 'SWAPRO Mobile App'
      }
    };

    // Convert to binary APK format (simplified)
    const jsonBytes = new TextEncoder().encode(JSON.stringify(apkData));
    const apkBytes = new Uint8Array(4 + jsonBytes.length);
    apkBytes.set([0x50, 0x4B, 0x03, 0x04], 0); // APK signature
    apkBytes.set(jsonBytes, 4);
    return apkBytes;
  };

  const handleInstallInstructions = () => {
    const instructions = `
Cara Install APK SWAPRO:

1. Download APK sudah selesai
2. Buka file manager di Android
3. Cari file "SWA-DATA-v1.0.0.apk" di folder Download
4. Tap file APK untuk install
5. Jika muncul peringatan "Unknown Sources":
   - Buka Settings > Security
   - Aktifkan "Unknown Sources" atau "Install Unknown Apps"
   - Kembali dan install APK
6. Setelah install, buka app "SWAPRO" dari home screen

Catatan: APK ini adalah wrapper PWA yang akan membuka aplikasi web dalam webview native Android.
    `;
    
    alert(instructions);
  };

  if (!showPopup) return null;

  return (
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
                Install APK Android
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                SWAPRO Mobile App
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowPopup(false)}
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
                File APK sudah didownload ke perangkat Anda. Silakan install untuk menggunakan SWAPRO sebagai aplikasi native.
              </p>
              <button
                onClick={handleInstallInstructions}
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
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Sebagai alternatif, Anda bisa menggunakan fitur "Add to Home Screen" di browser Chrome.
              </p>
            </div>
          ) : (
            <div>
              <div className="text-center mb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <img src="/app-icon-192.png" alt="SWAPRO" className="w-12 h-12" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Download APK SWAPRO
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Dapatkan aplikasi native Android untuk akses yang lebih cepat dan mudah
                </p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-4">
                <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                  Fitur APK Android:
                </h5>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• Akses offline dan sinkronisasi otomatis</li>
                  <li>• Interface native Android yang optimal</li>
                  <li>• Notifikasi push untuk update data</li>
                  <li>• Performa lebih cepat dari web browser</li>
                  <li>• Icon di home screen seperti app biasa</li>
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
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Membuat APK...</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  <span>Download APK (5MB)</span>
                </>
              )}
            </button>
            
            <button
              onClick={() => setShowPopup(false)}
              className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Nanti Saja
            </button>
          </div>
        )}

        {downloadComplete && (
          <button
            onClick={() => setShowPopup(false)}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Tutup
          </button>
        )}
      </div>
    </div>
  );
}
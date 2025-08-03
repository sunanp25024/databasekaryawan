import React, { useState, useEffect } from 'react';
import { Plus, Home, Smartphone, Download, X, CheckCircle, Info } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

export function PWAInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState({
    isIOS: false,
    isAndroid: false,
    isDesktop: false,
    browser: ''
  });

  useEffect(() => {
    // Detect device and browser
    const userAgent = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(userAgent);
    const isAndroid = /Android/.test(userAgent);
    const isDesktop = !isIOS && !isAndroid;
    
    let browser = '';
    if (userAgent.includes('Chrome')) browser = 'Chrome';
    else if (userAgent.includes('Firefox')) browser = 'Firefox';
    else if (userAgent.includes('Safari')) browser = 'Safari';
    else if (userAgent.includes('Edge')) browser = 'Edge';
    else browser = 'Browser';

    setDeviceInfo({ isIOS, isAndroid, isDesktop, browser });

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Listen for beforeinstallprompt event (Chrome/Edge)
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if PWA is already installed
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Chrome/Edge - use native install prompt
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
        setShowInstallPrompt(false);
      }
      
      setDeferredPrompt(null);
    } else {
      // Show manual instructions
      setShowModal(true);
    }
  };

  const getInstallInstructions = () => {
    if (deviceInfo.isIOS) {
      return {
        title: "Install SWA DATA di iPhone/iPad",
        steps: [
          "1. Buka Safari browser (harus Safari, bukan Chrome)",
          "2. Kunjungi website ini di Safari",
          "3. Tap tombol 'Share' (kotak dengan panah ke atas)",
          "4. Scroll ke bawah dan pilih 'Add to Home Screen'",
          "5. Ubah nama jika perlu, lalu tap 'Add'",
          "6. App SWA DATA akan muncul di home screen"
        ],
        icon: <Home className="w-8 h-8" />
      };
    } else if (deviceInfo.isAndroid) {
      return {
        title: "Install SWA DATA di Android",
        steps: [
          "1. Buka website ini di Chrome browser",
          "2. Tap menu (3 titik) di pojok kanan atas",
          "3. Pilih 'Add to Home screen' atau 'Install app'",
          "4. Tap 'Add' atau 'Install' pada dialog yang muncul",
          "5. App SWA DATA akan muncul di home screen",
          "6. Buka seperti aplikasi biasa"
        ],
        icon: <Plus className="w-8 h-8" />
      };
    } else {
      return {
        title: "Install SWA DATA di Desktop",
        steps: [
          "1. Buka website ini di Chrome atau Edge",
          "2. Klik icon 'Install' di address bar",
          "3. Atau klik menu (3 titik) > 'Install SWA DATA'",
          "4. Klik 'Install' pada dialog konfirmasi",
          "5. App akan terbuka di window terpisah",
          "6. Bisa diakses dari Start Menu atau Desktop"
        ],
        icon: <Download className="w-8 h-8" />
      };
    }
  };

  if (isInstalled) {
    return (
      <div className="fixed bottom-20 right-4 z-40 bg-green-600 text-white p-3 rounded-full shadow-lg">
        <CheckCircle className="w-6 h-6" />
      </div>
    );
  }

  const instructions = getInstallInstructions();

  return (
    <>
      {/* Install Button */}
      <button
        onClick={handleInstallClick}
        className="fixed bottom-20 right-4 z-40 bg-gradient-to-r from-blue-500 to-green-600 hover:from-blue-600 hover:to-green-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 animate-pulse"
        title="Install SWA DATA sebagai aplikasi"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Install Instructions Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-600 rounded-xl flex items-center justify-center text-white">
                  {instructions.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    Install SWA DATA
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Akses seperti aplikasi native
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

            {/* Instructions */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                {instructions.title}
              </h4>
              
              <div className="space-y-3">
                {instructions.steps.map((step, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      {step.replace(/^\d+\.\s*/, '')}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <h5 className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                  Keuntungan Install PWA:
                </h5>
              </div>
              <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
                <li>• Akses cepat dari home screen</li>
                <li>• Bekerja offline (sebagian fitur)</li>
                <li>• Tampilan full screen seperti app native</li>
                <li>• Tidak memakan storage banyak</li>
                <li>• Update otomatis saat buka internet</li>
              </ul>
            </div>

            {/* Device-specific tip */}
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3">
              <p className="text-xs text-amber-800 dark:text-amber-200">
                <strong>Tip:</strong> {deviceInfo.isIOS ? 
                  "Pastikan menggunakan Safari browser untuk install di iOS" :
                  deviceInfo.isAndroid ?
                  "Gunakan Chrome browser untuk install terbaik di Android" :
                  "Chrome atau Edge memberikan pengalaman install terbaik"
                }
              </p>
            </div>

            {/* Close button */}
            <button
              onClick={() => setShowModal(false)}
              className="w-full mt-6 bg-gradient-to-r from-blue-500 to-green-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-green-700 transition-all duration-200"
            >
              Mengerti, Saya Akan Install
            </button>
          </div>
        </div>
      )}
    </>
  );
}
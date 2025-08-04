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
      return;
    }

    // Check if user already dismissed install popup today
    const dismissedToday = localStorage.getItem('pwa-install-dismissed');
    const today = new Date().toDateString();
    
    // Listen for beforeinstallprompt event (Chrome/Edge)
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
      
      // Auto-show popup if not dismissed today
      if (dismissedToday !== today) {
        setTimeout(() => {
          setShowModal(true);
        }, 2000); // Show popup after 2 seconds
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if PWA is already installed
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
      setShowModal(false);
    });

    // Show popup automatically for all devices if not dismissed today
    if (!isInstalled && dismissedToday !== today) {
      // Show popup after 2.5 seconds for auto-prompt
      const timer = setTimeout(() => {
        console.log('Showing auto PWA install popup');
        setShowModal(true);
      }, 2500);
      
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Chrome/Edge - use native install prompt
      try {
        deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        
        if (choiceResult.outcome === 'accepted') {
          setIsInstalled(true);
          setShowInstallPrompt(false);
          setShowModal(false);
        }
        
        setDeferredPrompt(null);
      } catch (error) {
        console.log('Install prompt failed:', error);
      }
    } else {
      // For browsers without install prompt, show instructions
      setShowModal(true);
    }
  };

  const handleDismiss = () => {
    setShowModal(false);
    // Remember user dismissed popup for today
    const today = new Date().toDateString();
    localStorage.setItem('pwa-install-dismissed', today);
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

      {/* Auto Install Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-sm w-full p-6">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-600 rounded-full flex items-center justify-center text-white mx-auto mb-4">
                <Download className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Install SWA DATA
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Akses aplikasi seperti app native di home screen
              </p>
            </div>

            {/* Install Button */}
            {deferredPrompt ? (
              <button
                onClick={handleInstallClick}
                className="w-full bg-gradient-to-r from-blue-500 to-green-600 text-white py-4 rounded-lg font-semibold hover:from-blue-600 hover:to-green-700 transition-all duration-200 mb-3"
              >
                📱 Install PWA Sekarang
              </button>
            ) : (
              <div className="text-center mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {deviceInfo.isIOS ? 
                    "📱 Safari: Share > Add to Home Screen" :
                    deviceInfo.isAndroid ?
                    "📱 Chrome: Menu (⋮) > Add to Home screen" :
                    "📱 Chrome: Install button di address bar"
                  }
                </p>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg mb-3">
                  <p className="text-xs text-yellow-800 dark:text-yellow-200">
                    💡 Setelah install, aplikasi akan muncul di home screen seperti app biasa!
                  </p>
                </div>
              </div>
            )}

            {/* Dismiss Button */}
            <button
              onClick={handleDismiss}
              className="w-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200"
            >
              Nanti Saja
            </button>
          </div>
        </div>
      )}
    </>
  );
}
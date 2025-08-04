import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms?: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export const PWAInstall: React.FC = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isIOS = (window.navigator as any).standalone === true;
    
    if (isStandalone || isIOS) {
      setIsInstalled(true);
      return;
    }

    // Listen for beforeinstallprompt
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Show popup automatically after 3 seconds if not dismissed today
      const dismissed = localStorage.getItem('pwa-dismissed');
      const today = new Date().toDateString();
      
      if (dismissed !== today) {
        setTimeout(() => {
          setShowPopup(true);
        }, 3000);
      }
    };

    // Listen for app installed
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPopup(false);
      setDeferredPrompt(null);
      console.log('PWA berhasil diinstall!');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // Manual instructions for non-supporting browsers
      alert(`Cara install PWA:
      
📱 Android (Chrome):
1. Buka menu Chrome (3 titik)
2. Pilih "Add to Home screen"
3. Konfirmasi install

📱 iPhone (Safari):  
1. Tap tombol Share
2. Pilih "Add to Home Screen"
3. Konfirmasi install

💻 Desktop (Chrome/Edge):
1. Cari icon install di address bar
2. Klik icon install
3. Konfirmasi install`);
      return;
    }

    try {
      // Show install prompt
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted install');
        setIsInstalled(true);
      } else {
        console.log('User dismissed install');
      }
      
      setDeferredPrompt(null);
      setShowPopup(false);
    } catch (error) {
      console.log('Install failed:', error);
    }
  };

  const handleDismiss = () => {
    setShowPopup(false);
    // Remember dismissal for today
    localStorage.setItem('pwa-dismissed', new Date().toDateString());
  };

  if (isInstalled) {
    return null; // Don't show anything if already installed
  }

  return (
    <>
      {/* Fixed Install Button */}
      <button
        onClick={() => setShowPopup(true)}
        className="fixed bottom-4 right-4 z-40 bg-gradient-to-r from-blue-500 to-green-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 animate-pulse"
        title="Install PWA"
      >
        <Download className="w-6 h-6" />
      </button>

      {/* Install Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-sm w-full p-6 relative">
            {/* Close Button */}
            <button
              onClick={handleDismiss}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-green-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-4">
                <Smartphone className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Install SWA DATA
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Akses seperti aplikasi asli di home screen
              </p>
            </div>

            {/* Benefits */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-6">
              <div className="space-y-2">
                <div className="flex items-center text-blue-800 dark:text-blue-200 text-sm">
                  <span className="mr-2">✓</span>
                  <span>Akses cepat dari home screen</span>
                </div>
                <div className="flex items-center text-blue-800 dark:text-blue-200 text-sm">
                  <span className="mr-2">✓</span>
                  <span>Bekerja offline</span>
                </div>
                <div className="flex items-center text-blue-800 dark:text-blue-200 text-sm">
                  <span className="mr-2">✓</span>
                  <span>Tampilan full screen</span>
                </div>
                <div className="flex items-center text-blue-800 dark:text-blue-200 text-sm">
                  <span className="mr-2">✓</span>
                  <span>Update otomatis</span>
                </div>
              </div>
            </div>

            {/* Install Button */}
            <button
              onClick={handleInstallClick}
              className="w-full bg-gradient-to-r from-blue-500 to-green-600 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-600 hover:to-green-700 transition-all duration-200 transform hover:scale-105 mb-3"
            >
              {deferredPrompt ? '📱 Install Sekarang' : '📋 Lihat Cara Install'}
            </button>

            {/* Dismiss Button */}
            <button
              onClick={handleDismiss}
              className="w-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 rounded-xl font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200"
            >
              Nanti Saja
            </button>
          </div>
        </div>
      )}
    </>
  );
};
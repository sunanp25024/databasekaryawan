import React, { useState, useEffect } from 'react';
import { Download, X, CheckCircle, Smartphone } from 'lucide-react';

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
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
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
        setIsInstalling(true);
        deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        
        if (choiceResult.outcome === 'accepted') {
          setIsInstalled(true);
          setShowInstallPrompt(false);
          setShowModal(false);
        }
        
        setDeferredPrompt(null);
        setIsInstalling(false);
      } catch (error) {
        console.log('Install prompt failed:', error);
        setIsInstalling(false);
      }
    } else {
      // For browsers without install prompt, show manual instructions
      setShowModal(true);
    }
  };

  const handleDismiss = () => {
    setShowModal(false);
    // Remember user dismissed popup for today
    const today = new Date().toDateString();
    localStorage.setItem('pwa-install-dismissed', today);
  };

  const getQuickInstallTip = () => {
    const userAgent = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(userAgent);
    const isAndroid = /Android/.test(userAgent);
    
    if (isIOS) {
      return "Safari: Share ➜ Add to Home Screen";
    } else if (isAndroid) {
      return "Chrome: Menu (⋮) ➜ Add to Home screen";
    } else {
      return "Chrome/Edge: Install button di address bar";
    }
  };

  if (isInstalled) {
    return (
      <div className="fixed bottom-20 right-4 z-40 bg-green-600 text-white p-3 rounded-full shadow-lg">
        <CheckCircle className="w-6 h-6" />
      </div>
    );
  }

  return (
    <>
      {/* Install Button */}
      <button
        onClick={handleInstallClick}
        className="fixed bottom-20 right-4 z-40 bg-gradient-to-r from-blue-500 to-green-600 hover:from-blue-600 hover:to-green-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 animate-pulse"
        title="Install SWAPRO sebagai aplikasi"
      >
        <Download className="w-6 h-6" />
      </button>

      {/* Auto Install Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-sm w-full p-6">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-600 rounded-full flex items-center justify-center text-white mx-auto mb-4">
                <Smartphone className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Install SWAPRO
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Gunakan seperti aplikasi asli di home screen
              </p>
            </div>

            {/* Install Button */}
            {deferredPrompt ? (
              <button
                onClick={handleInstallClick}
                disabled={isInstalling}
                className="w-full bg-gradient-to-r from-blue-500 to-green-600 text-white py-4 rounded-lg font-semibold hover:from-blue-600 hover:to-green-700 transition-all duration-200 mb-3 disabled:opacity-50"
              >
                {isInstalling ? (
                  <div className="flex items-center justify-center space-x-2">
                    <img 
                      src="/app-icon-72.png" 
                      alt="Installing" 
                      className="w-5 h-5 animate-spin"
                      style={{
                        animationDuration: '2s',
                        animationTimingFunction: 'linear'
                      }}
                    />
                    <span>Installing...</span>
                  </div>
                ) : (
                  "📱 Install Sekarang"
                )}
              </button>
            ) : (
              <div className="text-center mb-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4">
                  <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">
                    {getQuickInstallTip()}
                  </p>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  💡 Akan muncul di home screen seperti app asli!
                </p>
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
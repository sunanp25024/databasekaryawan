import { useState, useEffect } from 'react';
import { Download, X, Smartphone, Monitor, Chrome, Variable as Safari } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms?: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function PWAInstall() {
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [deviceType, setDeviceType] = useState<'ios' | 'android' | 'desktop' | 'unknown'>('unknown');

  useEffect(() => {
    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isIOS = (window.navigator as any).standalone === true;
    
    if (isStandalone || isIOS) {
      setIsInstalled(true);
      return;
    }

    // Detect device type
    const userAgent = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(userAgent)) {
      setDeviceType('ios');
    } else if (/android/.test(userAgent)) {
      setDeviceType('android');
    } else {
      setDeviceType('desktop');
    }

    // Listen for beforeinstallprompt (Chrome/Edge on Android/Desktop)
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Show install prompt after 5 seconds if not dismissed today
      const dismissed = localStorage.getItem('pwa-install-dismissed');
      const today = new Date().toDateString();
      
      if (dismissed !== today) {
        setTimeout(() => {
          setShowInstallPrompt(true);
        }, 5000);
      }
    };

    // Listen for app installed
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
      console.log('PWA successfully installed!');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        
        setDeferredPrompt(null);
        setShowInstallPrompt(false);
      } catch (error) {
        console.error('Error during installation:', error);
      }
    }
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    // Remember dismissal for today
    localStorage.setItem('pwa-install-dismissed', new Date().toDateString());
  };

  const getInstallInstructions = () => {
    switch (deviceType) {
      case 'ios':
        return {
          title: 'Install di iPhone/iPad',
          steps: [
            'Buka aplikasi ini di Safari',
            'Tap tombol Share (kotak dengan panah ke atas)',
            'Scroll ke bawah dan tap "Add to Home Screen"',
            'Tap "Add" untuk menginstall'
          ],
          icon: <Safari className="w-6 h-6" />
        };
      case 'android':
        return {
          title: 'Install di Android',
          steps: [
            'Buka aplikasi ini di Chrome',
            'Tap menu (3 titik) di pojok kanan atas',
            'Pilih "Add to Home screen" atau "Install app"',
            'Tap "Install" untuk menginstall'
          ],
          icon: <Chrome className="w-6 h-6" />
        };
      case 'desktop':
        return {
          title: 'Install di Desktop',
          steps: [
            'Buka aplikasi ini di Chrome atau Edge',
            'Klik ikon install di address bar (atau menu)',
            'Klik "Install" untuk menginstall',
            'Aplikasi akan muncul seperti aplikasi desktop'
          ],
          icon: <Monitor className="w-6 h-6" />
        };
      default:
        return {
          title: 'Install Aplikasi',
          steps: [
            'Gunakan browser Chrome atau Edge',
            'Cari opsi "Add to Home Screen" atau "Install"',
            'Ikuti petunjuk untuk menginstall'
          ],
          icon: <Smartphone className="w-6 h-6" />
        };
    }
  };

  if (isInstalled) {
    return null; // Don't show anything if already installed
  }

  if (!showInstallPrompt) {
    return null;
  }

  const instructions = getInstallInstructions();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <img src="/app-icon-192.png" alt="SWAPRO" className="w-12 h-12" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Install SWAPRO
          </h2>
          <p className="text-gray-600 text-sm">
            Akses lebih cepat dengan menginstall sebagai aplikasi
          </p>
        </div>

        {/* Benefits */}
        <div className="bg-blue-50 rounded-xl p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">Keuntungan Install:</h3>
          <div className="space-y-1 text-sm text-blue-800">
            <div className="flex items-center">
              <span className="mr-2">✓</span>
              <span>Akses cepat dari home screen</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2">✓</span>
              <span>Bekerja offline</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2">✓</span>
              <span>Notifikasi push</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2">✓</span>
              <span>Pengalaman seperti aplikasi native</span>
            </div>
          </div>
        </div>

        {/* Install Instructions */}
        <div className="mb-6">
          <div className="flex items-center mb-3">
            {instructions.icon}
            <h3 className="font-semibold text-gray-900 ml-2">{instructions.title}</h3>
          </div>
          <ol className="space-y-2 text-sm text-gray-600">
            {instructions.steps.map((step, index) => (
              <li key={index} className="flex items-start">
                <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-3 mt-0.5 flex-shrink-0">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {deferredPrompt && (
            <button
              onClick={handleInstallClick}
              className="w-full bg-gradient-to-r from-blue-500 to-green-600 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-green-700 transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2"
            >
              <Download className="w-5 h-5" />
              <span>Install Sekarang</span>
            </button>
          )}
          
          <button
            onClick={handleDismiss}
            className="w-full bg-gray-200 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-300 transition-all duration-200"
          >
            Nanti Saja
          </button>
        </div>
      </div>
    </div>
  );
}
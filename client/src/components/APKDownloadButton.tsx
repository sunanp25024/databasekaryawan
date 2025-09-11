import { useState } from 'react';
import { Download, Smartphone, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';

export function APKDownloadButton() {
  const [showInstructions, setShowInstructions] = useState(false);

  const handleAPKDownload = () => {
    setShowInstructions(true);
  };

  const handlePWAInstall = () => {
    // Trigger PWA install prompt
    const event = new CustomEvent('showPWAInstall');
    window.dispatchEvent(event);
  };

  return (
    <>
      <button
        onClick={handleAPKDownload}
        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white text-sm font-bold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
      >
        <Smartphone className="w-4 h-4 mr-2" />
        Download APK
      </button>

      {/* Instructions Modal */}
      {showInstructions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <img src="/app-icon-192.png" alt="SWAPRO" className="w-12 h-12" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Install SWAPRO Mobile
              </h2>
              <p className="text-gray-600 text-sm">
                Pilih metode instalasi yang sesuai untuk perangkat Anda
              </p>
            </div>

            {/* PWA Option (Recommended) */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-green-600 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-bold text-green-900 mb-1">
                    PWA Install (Direkomendasikan)
                  </h3>
                  <p className="text-sm text-green-800 mb-3">
                    Metode paling mudah dan aman. Bekerja di semua perangkat.
                  </p>
                  <button
                    onClick={handlePWAInstall}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                  >
                    Install sebagai PWA
                  </button>
                </div>
              </div>
            </div>

            {/* APK Alternative */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <div className="flex items-start space-x-3">
                <Smartphone className="w-6 h-6 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-bold text-blue-900 mb-1">
                    APK Android (Manual)
                  </h3>
                  <p className="text-sm text-blue-800 mb-3">
                    Untuk pengguna yang memerlukan file APK khusus.
                  </p>
                  <a
                    href="https://www.pwabuilder.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Generate APK di PWABuilder
                  </a>
                  <p className="text-xs text-blue-700 mt-2">
                    Masukkan URL: {window.location.origin}
                  </p>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <h4 className="font-semibold text-gray-900 mb-2">Cara Install PWA:</h4>
              <div className="text-sm text-gray-700 space-y-1">
                <p><strong>Android Chrome:</strong> Menu → "Add to Home screen"</p>
                <p><strong>iPhone Safari:</strong> Share → "Add to Home Screen"</p>
                <p><strong>Desktop:</strong> Address bar → Install icon</p>
              </div>
            </div>

            <button
              onClick={() => setShowInstructions(false)}
              className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </>
  );
}
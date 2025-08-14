import { useState } from 'react';

export function ClientLogoTest() {
  const [testResults, setTestResults] = useState<string[]>([]);

  const testLogo = async (logoPath: string, clientName: string) => {
    try {
      const response = await fetch(logoPath);
      const status = response.ok ? '✅' : '❌';
      const result = `${status} ${clientName}: ${logoPath} (${response.status})`;
      setTestResults(prev => [...prev, result]);
      console.log(result);
    } catch (error) {
      const result = `❌ ${clientName}: ${logoPath} (Error: ${error})`;
      setTestResults(prev => [...prev, result]);
      console.error(result);
    }
  };

  const runTests = () => {
    setTestResults([]);
    testLogo('/adira-logo.png', 'ADIRA');
    testLogo('/megafinance-logo.png', 'MEGAFINANCE');
    testLogo('/smsfinance-logo.png', 'SMS FINANCE');
  };

  return (
    <div className="fixed top-4 right-4 z-50 bg-white p-4 rounded-lg shadow-lg border max-w-sm">
      <h3 className="font-bold mb-2">Logo Test</h3>
      <button 
        onClick={runTests}
        className="bg-blue-500 text-white px-3 py-1 rounded text-sm mb-2"
      >
        Test Logos
      </button>
      <div className="text-xs space-y-1">
        {testResults.map((result, index) => (
          <div key={index} className="font-mono">{result}</div>
        ))}
      </div>
      
      {/* Direct logo tests */}
      <div className="mt-4 space-y-2">
        <div className="text-xs font-bold">Direct Logo Display:</div>
        <div className="flex items-center space-x-2">
          <span className="text-xs">ADIRA:</span>
          <img src="/adira-logo.png" alt="ADIRA" className="h-8 object-contain" />
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs">MACF:</span>
          <img src="/megafinance-logo.png" alt="MEGAFINANCE" className="h-8 object-contain" />
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs">SMSF:</span>
          <img src="/smsfinance-logo.png" alt="SMS FINANCE" className="h-8 object-contain" />
        </div>
      </div>
    </div>
  );
}
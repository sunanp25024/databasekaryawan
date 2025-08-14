// Test component to debug logo loading
export function TestLogo() {
  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: 'white', 
      padding: '10px', 
      border: '1px solid #ccc',
      zIndex: 9999,
      fontSize: '12px'
    }}>
      <div>Direct logo test:</div>
      <img 
        src="/adira-logo.png" 
        alt="ADIRA Direct Test" 
        style={{ height: '30px', margin: '5px 0' }}
        onLoad={() => console.log('✅ Direct ADIRA logo loaded')}
        onError={(e) => console.error('❌ Direct ADIRA logo failed', e)}
      />
      <br />
      <img 
        src="/megafinance-logo.png" 
        alt="MEGA Direct Test" 
        style={{ height: '30px', margin: '5px 0' }}
        onLoad={() => console.log('✅ Direct MEGA logo loaded')}
        onError={(e) => console.error('❌ Direct MEGA logo failed', e)}
      />
      <br />
      <img 
        src="/smsfinance-logo.png" 
        alt="SMS Direct Test" 
        style={{ height: '30px', margin: '5px 0' }}
        onLoad={() => console.log('✅ Direct SMS logo loaded')}
        onError={(e) => console.error('❌ Direct SMS logo failed', e)}
      />
    </div>
  );
}
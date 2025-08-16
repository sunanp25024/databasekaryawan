import { ClientLogo } from './ClientLogo';

export function SimpleLogoTest() {
  console.log('🔥 SimpleLogoTest component rendered');
  
  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      left: '10px', 
      background: 'white',
      border: '2px solid red',
      padding: '10px',
      zIndex: 9999
    }}>
      <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>Logo Test:</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <div>ADIRA: <ClientLogo client="ADIRA" size="sm" /></div>
        <div>MACF: <ClientLogo client="MACF" size="sm" /></div>
        <div>SMSF: <ClientLogo client="SMSF" size="sm" /></div>
      </div>
    </div>
  );
}
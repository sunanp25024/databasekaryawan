// Client logo mapping
export const CLIENT_LOGOS = {
  'ADIRA': '/adira-logo.png',
  'MACF': '/megafinance-logo.png', 
  'SMSF': '/smsfinance-logo.png'
} as const;

export function getClientLogo(client: string): string | null {
  const normalizedClient = client.toUpperCase();
  
  console.log(`getClientLogo: input="${client}", normalized="${normalizedClient}"`);
  
  // Handle different variations
  if (normalizedClient.includes('ADIRA')) {
    console.log('Matched ADIRA, returning:', CLIENT_LOGOS.ADIRA);
    return CLIENT_LOGOS.ADIRA;
  }
  if (normalizedClient.includes('MACF') || normalizedClient.includes('MEGA')) {
    console.log('Matched MACF/MEGA, returning:', CLIENT_LOGOS.MACF);
    return CLIENT_LOGOS.MACF;
  }
  if (normalizedClient.includes('SMSF') || normalizedClient.includes('SMS')) {
    console.log('Matched SMSF/SMS, returning:', CLIENT_LOGOS.SMSF);
    return CLIENT_LOGOS.SMSF;
  }
  
  console.log('No match found for client:', client);
  return null;
}

export function getClientName(client: string): string {
  const normalizedClient = client.toUpperCase();
  
  if (normalizedClient.includes('ADIRA')) return 'ADIRA';
  if (normalizedClient.includes('MACF') || normalizedClient.includes('MEGA')) return 'MEGAFINANCE';
  if (normalizedClient.includes('SMSF') || normalizedClient.includes('SMS')) return 'SMS FINANCE';
  
  return client;
}
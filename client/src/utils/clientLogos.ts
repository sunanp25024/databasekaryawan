// Client logo mapping
export const CLIENT_LOGOS = {
  'ADIRA': '/adira-logo.png',
  'MACF': '/megafinance-logo.png', 
  'SMSF': '/smsfinance-logo.png'
} as const;

export function getClientLogo(client: string): string | null {
  const normalizedClient = client.toUpperCase();
  
  // Handle different variations
  if (normalizedClient.includes('ADIRA')) return CLIENT_LOGOS.ADIRA;
  if (normalizedClient.includes('MACF') || normalizedClient.includes('MEGA')) return CLIENT_LOGOS.MACF;
  if (normalizedClient.includes('SMSF') || normalizedClient.includes('SMS')) return CLIENT_LOGOS.SMSF;
  
  return null;
}

export function getClientName(client: string): string {
  const normalizedClient = client.toUpperCase();
  
  if (normalizedClient.includes('ADIRA')) return 'ADIRA';
  if (normalizedClient.includes('MACF') || normalizedClient.includes('MEGA')) return 'MEGAFINANCE';
  if (normalizedClient.includes('SMSF') || normalizedClient.includes('SMS')) return 'SMS FINANCE';
  
  return client;
}
import { getClientLogo, getClientName } from '../utils/clientLogos';

// ClientLogo component loaded

interface ClientLogoProps {
  client: string;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
  className?: string;
}

export function ClientLogo({ client, size = 'md', showName = false, className = '' }: ClientLogoProps) {
  console.log(`🚀 ClientLogo CALLED with client: "${client}"`);
  
  const logoUrl = getClientLogo(client);
  const clientName = getClientName(client);
  
  console.log(`🔍 ClientLogo: client="${client}", logoUrl="${logoUrl}", clientName="${clientName}"`);
  
  if (!logoUrl) {
    console.warn(`❌ No logo URL found for client: ${client}`);
    // Fallback for unknown clients
    return (
      <div className={`flex items-center ${className}`}>
        <div className={`
          ${size === 'sm' ? 'w-6 h-6 text-xs' : ''}
          ${size === 'md' ? 'w-8 h-8 text-sm' : ''}
          ${size === 'lg' ? 'w-12 h-12 text-base' : ''}
          bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600
        `}>
          {client.charAt(0)}
        </div>
        {showName && (
          <span className={`ml-2 font-medium ${size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-sm'}`}>
            {client}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src={logoUrl} 
        alt={`${clientName} Logo`}
        className={`
          ${size === 'sm' ? 'h-6 w-auto max-w-16' : ''}
          ${size === 'md' ? 'h-8 w-auto max-w-20' : ''}
          ${size === 'lg' ? 'h-12 w-auto max-w-24' : ''}
          object-contain
        `}
        onLoad={() => {
          console.log(`✅ Logo loaded successfully for ${client}: ${logoUrl}`);
        }}
        style={{ display: 'block', maxHeight: '100%', maxWidth: '100%' }}
        onError={(e) => {
          console.error(`❌ Failed to load logo for ${client}:`, logoUrl);
          console.error('Image error event:', e);
          console.error('Error details:', {
            src: (e.target as HTMLImageElement).src,
            naturalWidth: (e.target as HTMLImageElement).naturalWidth,
            naturalHeight: (e.target as HTMLImageElement).naturalHeight,
            complete: (e.target as HTMLImageElement).complete
          });
          // Fallback to initials if image fails to load
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          const parent = target.parentElement;
          if (parent && !parent.querySelector('.fallback-logo')) {
            const fallback = document.createElement('div');
            fallback.className = `fallback-logo ${
              size === 'sm' ? 'w-6 h-6 text-xs' : 
              size === 'md' ? 'w-8 h-8 text-sm' : 
              'w-12 h-12 text-base'
            } bg-red-200 rounded-full flex items-center justify-center font-bold text-red-600`;
            fallback.textContent = client.charAt(0);
            fallback.title = `Failed to load logo: ${logoUrl}`;
            parent.insertBefore(fallback, target);
          }
        }}
      />
      {showName && (
        <span className={`ml-2 font-medium ${size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-sm'}`}>
          {clientName}
        </span>
      )}
    </div>
  );
}
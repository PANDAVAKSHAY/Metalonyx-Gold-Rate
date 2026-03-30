import React, { useEffect, useRef } from 'react';

interface AdSenseBlockProps {
  style?: React.CSSProperties;
  className?: string;
  format?: 'auto' | 'fluid' | 'rectangle';
}

export function AdSenseBlock({ style, className, format = 'auto' }: AdSenseBlockProps) {
  const envClientId = import.meta.env.VITE_ADSENSE_CLIENT_ID;
  const envSlotId = import.meta.env.VITE_ADSENSE_SLOT_ID;
  
  const clientId = envClientId && envClientId !== 'YOUR_ADSENSE_CLIENT_ID' ? envClientId : 'ca-pub-1881759482016320';
  const slotId = envSlotId && envSlotId !== 'YOUR_ADSENSE_SLOT_ID' ? envSlotId : undefined;
  
  const isConfigured = !!clientId;
  const adPushed = useRef(false);

  useEffect(() => {
    if (isConfigured && !adPushed.current) {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        adPushed.current = true;
      } catch (e: any) {
        // Ignore the common React re-render artifact error
        if (!e.message?.includes('already have ads')) {
          console.error('AdSense error:', e);
        }
      }
    }
  }, [isConfigured]);

  if (!isConfigured) {
    return (
      <div 
        className={`bg-charcoal-800 border border-charcoal-700 flex items-center justify-center overflow-hidden ${className || ''}`}
        style={style}
      >
        <span className="text-gray-500 uppercase tracking-widest font-medium text-xs">Ad Placeholder</span>
      </div>
    );
  }

  return (
    <div className={`overflow-hidden ${className || ''}`} style={style}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', ...style }}
        data-ad-client={clientId}
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}

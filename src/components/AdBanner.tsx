import React from 'react';
import { AdSenseBlock } from './AdSenseBlock';

export function AdBanner() {
  return (
    <div className="fixed bottom-16 md:bottom-0 left-0 right-0 h-[50px] bg-charcoal-900 border-t border-charcoal-800 flex items-center justify-center z-40 overflow-hidden">
      <AdSenseBlock style={{ width: '320px', height: '50px' }} />
    </div>
  );
}

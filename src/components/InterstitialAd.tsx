import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AdSenseBlock } from './AdSenseBlock';

interface InterstitialAdProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InterstitialAd({ isOpen, onClose }: InterstitialAdProps) {
  const [timeLeft, setTimeLeft] = useState(5);

  useEffect(() => {
    if (isOpen) {
      setTimeLeft(5);
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal-900"
        >
          <div className="absolute top-4 right-4">
            {timeLeft > 0 ? (
              <div className="w-10 h-10 rounded-full bg-charcoal-800 flex items-center justify-center text-white font-bold border border-charcoal-700">
                {timeLeft}
              </div>
            ) : (
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-charcoal-800 flex items-center justify-center text-white hover:bg-charcoal-700 transition-colors border border-charcoal-700"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          
          <div className="text-center p-8">
            <h2 className="text-2xl font-display font-bold text-white mb-4">Sponsored Message</h2>
            <div className="w-64 h-64 bg-charcoal-800 rounded-2xl border border-charcoal-700 flex items-center justify-center mb-6 mx-auto overflow-hidden">
              <AdSenseBlock style={{ width: '250px', height: '250px' }} format="rectangle" />
            </div>
            <p className="text-gray-400 text-sm max-w-xs mx-auto">
              This app is supported by ads. Thank you for your patience.
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

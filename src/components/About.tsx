import React from 'react';
import { Info, Shield, Mail, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';

export function About() {
  return (
    <div className="flex flex-col gap-6 p-4 pb-32 md:pb-20 max-w-2xl mx-auto w-full">
      <div className="flex items-center gap-3 mb-2">
        <Info className="w-6 h-6 text-gold-500" />
        <h2 className="text-2xl font-display font-bold text-white">About Metalonyx</h2>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-charcoal-800 rounded-3xl p-6 border border-charcoal-700 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

        <div className="space-y-6 relative z-10">
          <div className="text-center pb-6 border-b border-charcoal-700">
            <div className="w-16 h-16 bg-gold-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-gold-500" />
            </div>
            <h3 className="text-xl font-display font-bold text-white mb-2">Premium Jewelry Utility</h3>
            <p className="text-sm text-gray-400">
              Designed for the Indian jewelry market, providing real-time rates and accurate value calculations.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Features</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-gold-500 mt-1.5" />
                <span>Live Gold (24K, 22K, 18K), Silver, and Platinum prices updated regularly.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-gold-500 mt-1.5" />
                <span>Instant value calculation based on weight and purity.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-gold-500 mt-1.5" />
                <span>Optional 3% GST calculation for accurate Indian market pricing.</span>
              </li>
            </ul>
          </div>

          <div className="pt-6 border-t border-charcoal-700 space-y-4">
            <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Support</h4>
            <a href="mailto:support@metalonyx.app" className="flex items-center justify-between p-4 bg-charcoal-900 rounded-xl border border-charcoal-700 hover:border-gold-500 transition-colors group">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400 group-hover:text-gold-500 transition-colors" />
                <span className="text-sm font-medium text-white">Contact Us</span>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-gold-500 transition-colors" />
            </a>
          </div>

          <div className="text-center pt-4">
            <p className="text-xs text-gray-500">Version 1.1.0 &copy; 2026 Metalonyx App</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

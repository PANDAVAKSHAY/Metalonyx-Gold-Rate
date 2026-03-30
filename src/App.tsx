import React, { useState } from 'react';
import { LiveRates } from './components/LiveRates';
import { Calculator } from './components/Calculator';
import { About } from './components/About';
import { Premium } from './components/Premium';
import { AdBanner } from './components/AdBanner';
import { InterstitialAd } from './components/InterstitialAd';
import { LineChart, Calculator as CalcIcon, Info, Crown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SubscriptionProvider, useSubscription } from './contexts/SubscriptionContext';

type Tab = 'live' | 'calculator' | 'premium' | 'about';

function AppContent() {
  const [activeTab, setActiveTab] = useState<Tab>('live');
  const [calcCount, setCalcCount] = useState(0);
  const [showInterstitial, setShowInterstitial] = useState(false);
  const { isPremium } = useSubscription();

  const handleCalculate = () => {
    if (isPremium) return;
    setCalcCount((prev) => {
      const newCount = prev + 1;
      if (newCount % 3 === 0) {
        setShowInterstitial(true);
      }
      return newCount;
    });
  };

  const tabs = [
    { id: 'live', label: 'Live Rates', icon: LineChart },
    { id: 'calculator', label: 'Calculator', icon: CalcIcon },
    { id: 'premium', label: 'Premium', icon: Crown },
    { id: 'about', label: 'About', icon: Info },
  ] as const;

  return (
    <div className="min-h-screen bg-charcoal-900 text-white font-sans flex flex-col relative overflow-hidden">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-charcoal-900/80 backdrop-blur-xl border-b border-charcoal-800 px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gold-500 rounded-lg flex items-center justify-center shadow-lg shadow-gold-500/20">
            <span className="text-charcoal-900 font-display font-bold text-lg leading-none mt-0.5">M</span>
          </div>
          <h1 className="text-xl font-display font-bold tracking-tight text-white">Metalonyx</h1>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`flex items-center gap-2 transition-colors ${
                  isActive ? 'text-gold-500' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'stroke-2' : 'stroke-[1.5]'}`} />
                <span className="text-sm font-medium tracking-wide">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {activeTab === 'live' && <LiveRates />}
            {activeTab === 'calculator' && <Calculator onCalculate={handleCalculate} />}
            {activeTab === 'premium' && <Premium />}
            {activeTab === 'about' && <About />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Ad Banner */}
      {!isPremium && <AdBanner />}

      {/* Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-charcoal-900/90 backdrop-blur-xl border-t border-charcoal-800 flex items-center justify-around px-2 z-50 pb-safe">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                isActive ? 'text-gold-500' : 'text-gray-500 hover:text-gray-400'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-2' : 'stroke-[1.5]'}`} />
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-gold-500 rounded-full"
                  />
                )}
              </div>
              <span className="text-[10px] font-medium tracking-wide">{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Interstitial Ad Overlay */}
      {!isPremium && <InterstitialAd isOpen={showInterstitial} onClose={() => setShowInterstitial(false)} />}
    </div>
  );
}

export default function App() {
  return (
    <SubscriptionProvider>
      <AppContent />
    </SubscriptionProvider>
  );
}

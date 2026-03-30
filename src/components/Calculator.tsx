import React, { useState, useEffect } from 'react';
import { metalPriceService, MetalPrices } from '../services/metalPrices';
import { Calculator as CalcIcon, Percent, Scale, Gem, Layers, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface CalculatorProps {
  onCalculate: () => void;
}

type MetalType = 'gold' | 'silver' | 'platinum';

export function Calculator({ onCalculate }: CalculatorProps) {
  const [prices, setPrices] = useState<MetalPrices | null>(metalPriceService.getCurrentPrices());
  const [metalType, setMetalType] = useState<MetalType>('gold');
  const [weight, setWeight] = useState<string>('');
  const [karat, setKarat] = useState<number>(22);
  const [includeGst, setIncludeGst] = useState<boolean>(true);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  useEffect(() => {
    const unsubscribe = metalPriceService.subscribe(setPrices);
    return unsubscribe;
  }, []);

  useEffect(() => {
    const w = parseFloat(weight);
    if (!isNaN(w) && w > 0 && prices) {
      let baseValue = 0;
      
      if (metalType === 'gold') {
        // Formula: (Live 24K Price / 24) * Selected Karat * Weight
        baseValue = (prices.gold24k / 24) * karat * w;
      } else if (metalType === 'silver') {
        baseValue = prices.silver * w;
      } else if (metalType === 'platinum') {
        baseValue = prices.platinum * w;
      }

      const finalValue = includeGst ? baseValue * 1.03 : baseValue;
      setTotalPrice(finalValue);
    } else {
      setTotalPrice(0);
    }
  }, [weight, karat, includeGst, prices, metalType]);

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWeight(e.target.value);
    if (e.target.value !== '') {
      onCalculate();
    }
  };

  const handleMetalChange = (type: MetalType) => {
    setMetalType(type);
    onCalculate();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (!prices) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
        <div className="w-12 h-12 border-4 border-gold-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-400">Loading calculator...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4 pb-32 md:pb-20 max-w-2xl mx-auto w-full">
      <div className="flex items-center gap-3 mb-2">
        <CalcIcon className="w-6 h-6 text-gold-500" />
        <h2 className="text-2xl font-display font-bold text-white">Value Calculator</h2>
      </div>

      {prices.error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3 mb-2">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="text-sm text-red-200">
            <p className="font-medium mb-1">Live rates unavailable</p>
            <p className="opacity-80">Calculations may not be accurate. {prices.error}</p>
          </div>
        </div>
      )}

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-charcoal-800 rounded-3xl p-6 border border-charcoal-700 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

        <div className="space-y-6 relative z-10">
          {/* Metal Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <Layers className="w-4 h-4" />
              Metal Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['gold', 'silver', 'platinum'] as MetalType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => handleMetalChange(type)}
                  className={`py-2.5 rounded-xl font-medium text-sm capitalize transition-all ${
                    metalType === type
                      ? 'bg-gold-500 text-charcoal-900 shadow-lg shadow-gold-500/20'
                      : 'bg-charcoal-900 text-gray-400 border border-charcoal-700 hover:border-gray-500'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Weight Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <Scale className="w-4 h-4" />
              Weight (Grams)
            </label>
            <div className="relative">
              <input
                type="number"
                value={weight}
                onChange={handleWeightChange}
                placeholder="0.00"
                className="w-full bg-charcoal-900 border border-charcoal-700 rounded-xl py-4 px-4 text-2xl font-display font-bold text-white placeholder-gray-600 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">g</span>
            </div>
          </div>

          {/* Purity Selection (Only for Gold) */}
          {metalType === 'gold' && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-2"
            >
              <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                <Gem className="w-4 h-4" />
                Purity (Karat)
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[18, 20, 22, 24].map((k) => (
                  <button
                    key={k}
                    onClick={() => {
                      setKarat(k);
                      onCalculate();
                    }}
                    className={`py-3 rounded-xl font-medium transition-all ${
                      karat === k
                        ? 'bg-gold-500 text-charcoal-900 shadow-lg shadow-gold-500/20'
                        : 'bg-charcoal-900 text-gray-400 border border-charcoal-700 hover:border-gray-500'
                    }`}
                  >
                    {k}K
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* GST Toggle */}
          <div className="flex items-center justify-between p-4 bg-charcoal-900 rounded-xl border border-charcoal-700">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${includeGst ? 'bg-gold-500/20 text-gold-500' : 'bg-charcoal-800 text-gray-500'}`}>
                <Percent className="w-4 h-4" />
              </div>
              <div>
                <p className="font-medium text-white">Include GST</p>
                <p className="text-xs text-gray-500">Add 3% tax to total</p>
              </div>
            </div>
            <button
              onClick={() => {
                setIncludeGst(!includeGst);
                onCalculate();
              }}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                includeGst ? 'bg-gold-500' : 'bg-charcoal-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  includeGst ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="pt-6 border-t border-charcoal-700">
            <p className="text-sm text-gray-400 mb-2 font-medium uppercase tracking-wider">Estimated Value</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-display font-bold text-gold-500 tracking-tight">
                {formatCurrency(totalPrice)}
              </span>
            </div>
            {includeGst && totalPrice > 0 && (
              <p className="text-xs text-gray-500 mt-2">
                Includes 3% GST ({formatCurrency(totalPrice - (totalPrice / 1.03))})
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

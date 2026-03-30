import React, { useEffect, useState } from 'react';
import { metalPriceService, MetalPrices, HistoricalDataPoint } from '../services/metalPrices';
import { TrendingUp, Clock, ChevronDown, ChevronUp, MapPin, Globe, AlertCircle, RefreshCw, Lock, PlaySquare, X, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useSubscription } from '../contexts/SubscriptionContext';
import { AdSenseBlock } from './AdSenseBlock';

const CITIES = [
  { id: 'mumbai', name: 'Mumbai', multiplier: 1.01 },
  { id: 'delhi', name: 'Delhi', multiplier: 1.005 },
  { id: 'chennai', name: 'Chennai', multiplier: 1.015 },
  { id: 'kolkata', name: 'Kolkata', multiplier: 1.008 },
  { id: 'bangalore', name: 'Bangalore', multiplier: 1.012 },
  { id: 'hyderabad', name: 'Hyderabad', multiplier: 1.011 },
  { id: 'ahmedabad', name: 'Ahmedabad', multiplier: 1.006 },
  { id: 'pune', name: 'Pune', multiplier: 1.01 },
];

export function LiveRates() {
  const [prices, setPrices] = useState<MetalPrices | null>(metalPriceService.getCurrentPrices());
  const [historicalData, setHistoricalData] = useState(metalPriceService.getHistoricalData());
  const [rateType, setRateType] = useState<'marketplace' | 'city'>('marketplace');
  const [selectedCity, setSelectedCity] = useState(CITIES[0]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { isPremium } = useSubscription();
  const [adUnlocked, setAdUnlocked] = useState(false);
  const [showAdModal, setShowAdModal] = useState(false);
  const [isWatchingAd, setIsWatchingAd] = useState(false);
  const [adCountdown, setAdCountdown] = useState(5);

  useEffect(() => {
    const unsubscribe = metalPriceService.subscribe((newPrices) => {
      setPrices(newPrices);
      setHistoricalData(metalPriceService.getHistoricalData());
      setIsRefreshing(false);
    });
    return unsubscribe;
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    metalPriceService.fetchPrices();
  };

  const getAdjustedPrice = (basePrice: number) => {
    if (rateType === 'city' && (isPremium || adUnlocked)) {
      return basePrice * selectedCity.multiplier;
    }
    return basePrice;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const RateCard = ({ title, pricePerGram, dotColor = 'bg-gold-500', history }: { title: string, pricePerGram: number, dotColor?: string, history: HistoricalDataPoint[] | null }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const adjustedPrice = getAdjustedPrice(pricePerGram);

    // Adjust historical data based on city multiplier if needed
    const adjustedHistory = history ? history.map(point => ({
      ...point,
      price: (rateType === 'city' && (isPremium || adUnlocked)) ? point.price * selectedCity.multiplier : point.price
    })) : [];

    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-charcoal-800 rounded-2xl p-4 sm:p-5 border border-charcoal-700 shadow-lg relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-gold-500/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
        
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base sm:text-lg font-medium text-gray-300 flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${dotColor}`} />
            {title}
          </h3>
          <div className="flex items-center gap-3">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-charcoal-700 hover:bg-charcoal-600 text-xs font-medium text-gray-300 hover:text-white transition-colors border border-charcoal-600"
            >
              <Activity className="w-3.5 h-3.5" />
              {isExpanded ? 'Hide Chart' : 'Show Chart'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          <div>
            <p className="text-[10px] sm:text-xs text-gray-500 mb-1 uppercase tracking-wider font-medium">1 Gram</p>
            <p className="text-sm sm:text-lg font-display font-bold text-white tracking-tight">
              {formatPrice(adjustedPrice)}
            </p>
          </div>
          <div className="pl-2 sm:pl-4 border-l border-charcoal-700">
            <p className="text-[10px] sm:text-xs text-gray-500 mb-1 uppercase tracking-wider font-medium">10 Grams</p>
            <p className="text-sm sm:text-lg font-display font-bold text-gold-500 tracking-tight">
              {formatPrice(adjustedPrice * 10)}
            </p>
          </div>
          <div className="pl-2 sm:pl-4 border-l border-charcoal-700">
            <p className="text-[10px] sm:text-xs text-gray-500 mb-1 uppercase tracking-wider font-medium">1 Kg</p>
            <p className="text-sm sm:text-lg font-display font-bold text-gold-400 tracking-tight">
              {formatPrice(adjustedPrice * 1000)}
            </p>
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && adjustedHistory.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-4 pt-4 border-t border-charcoal-700">
                <p className="text-[10px] sm:text-xs text-gray-500 mb-4 uppercase tracking-wider font-medium">7-Day Trend (Per Gram)</p>
                <div className="h-32 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={adjustedHistory} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                      <XAxis dataKey="date" stroke="#6b7280" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis domain={['auto', 'auto']} hide />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1c1c1c', border: '1px solid #2a2a2a', borderRadius: '8px', fontSize: '12px' }}
                        itemStyle={{ color: '#D4AF37' }}
                        formatter={(value: number) => [formatPrice(value), 'Price']}
                        labelStyle={{ color: '#9ca3af', marginBottom: '4px' }}
                      />
                      <Line type="monotone" dataKey="price" stroke="#D4AF37" strokeWidth={2} dot={{ r: 3, fill: '#D4AF37', strokeWidth: 0 }} activeDot={{ r: 5, fill: '#D4AF37', strokeWidth: 0 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  if (!prices) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
        <div className="w-12 h-12 border-4 border-gold-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-400">Fetching live market rates...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4 pb-32 md:pb-20 max-w-7xl mx-auto w-full">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-display font-bold text-white">Live Market</h2>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 bg-charcoal-800 rounded-full border border-charcoal-700 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
          <div className="flex items-center gap-1.5 text-xs text-gray-400 bg-charcoal-800 px-3 py-2 rounded-full border border-charcoal-700">
            <Clock className="w-3.5 h-3.5" />
            <span>{prices.lastUpdated.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
      </div>

      {prices.error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3 mb-2">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="text-sm text-red-200">
            <p className="font-medium mb-1">Could not fetch live rates</p>
            <p className="opacity-80">{prices.error}</p>
          </div>
        </div>
      )}

      {/* Rate Type Toggle */}
      <div className="bg-charcoal-800 p-1 rounded-xl flex items-center border border-charcoal-700 mb-2">
        <button
          onClick={() => setRateType('marketplace')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all ${
            rateType === 'marketplace'
              ? 'bg-charcoal-700 text-white shadow-sm'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          <Globe className="w-4 h-4" />
          Marketplace
        </button>
        <div 
          className="flex-1 relative group cursor-pointer"
          onClick={() => {
            if (!isPremium && !adUnlocked) {
              setShowAdModal(true);
            } else {
              setRateType('city');
            }
          }}
        >
          <button
            disabled={!isPremium && !adUnlocked}
            className={`w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all relative pointer-events-none ${
              rateType === 'city'
                ? 'bg-charcoal-700 text-white shadow-sm'
                : 'text-gray-400 disabled:opacity-50'
            }`}
          >
            <MapPin className="w-4 h-4" />
            City Rates
            {!isPremium && !adUnlocked && (
              <Lock className="w-3 h-3 absolute top-2 right-2 text-gold-500" />
            )}
          </button>
          
          {/* Tooltip */}
          {!isPremium && !adUnlocked && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-charcoal-900 text-xs text-center text-gray-300 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
              Premium feature. Click to unlock.
            </div>
          )}
        </div>
      </div>

      {/* City Selector */}
      <AnimatePresence>
        {rateType === 'city' && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Select City</label>
              <div className="relative">
                <select
                  value={selectedCity.id}
                  onChange={(e) => {
                    const city = CITIES.find(c => c.id === e.target.value);
                    if (city) setSelectedCity(city);
                  }}
                  className="w-full bg-charcoal-800 border border-charcoal-700 text-white rounded-xl px-4 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-gold-500/50"
                >
                  {CITIES.map(city => (
                    <option key={city.id} value={city.id}>{city.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <RateCard title="Gold 24K (99.9%)" pricePerGram={prices.gold24k} history={historicalData?.gold24k || null} />
        <RateCard title="Gold 22K (91.6%)" pricePerGram={prices.gold22k} history={historicalData?.gold22k || null} />
        <RateCard title="Gold 18K (75.0%)" pricePerGram={prices.gold18k} history={historicalData?.gold18k || null} />
        <RateCard title="Platinum (95%)" pricePerGram={prices.platinum} dotColor="bg-slate-300" history={historicalData?.platinum || null} />
        <RateCard title="Silver (99.9%)" pricePerGram={prices.silver} dotColor="bg-gray-300" history={historicalData?.silver || null} />
      </div>

      {/* Ad Modal */}
      <AnimatePresence>
        {showAdModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-charcoal-800 border border-charcoal-700 rounded-2xl p-6 max-w-sm w-full shadow-2xl relative"
            >
              <button 
                onClick={() => !isWatchingAd && setShowAdModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white disabled:opacity-50"
                disabled={isWatchingAd}
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="text-center mb-6">
                {isWatchingAd ? (
                  <div className="w-full h-48 mb-4 rounded-xl overflow-hidden">
                    <AdSenseBlock style={{ width: '100%', height: '100%' }} format="rectangle" />
                  </div>
                ) : (
                  <div className="w-16 h-16 bg-gold-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-8 h-8 text-gold-500" />
                  </div>
                )}
                <h3 className="text-xl font-display font-bold text-white mb-2">
                  {isWatchingAd ? 'Viewing Advertisement' : 'Premium Feature'}
                </h3>
                <p className="text-sm text-gray-400">
                  {isWatchingAd 
                    ? 'Please wait while the ad completes to unlock city rates.'
                    : 'City-wise rates are available for premium subscribers. You can watch a short ad to unlock this feature for your current session.'}
                </p>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setIsWatchingAd(true);
                    setAdCountdown(5);
                    const timer = setInterval(() => {
                      setAdCountdown((prev) => {
                        if (prev <= 1) {
                          clearInterval(timer);
                          setIsWatchingAd(false);
                          setAdUnlocked(true);
                          setShowAdModal(false);
                          setRateType('city');
                          return 0;
                        }
                        return prev - 1;
                      });
                    }, 1000);
                  }}
                  disabled={isWatchingAd}
                  className="w-full py-3 px-4 bg-charcoal-700 hover:bg-charcoal-600 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isWatchingAd ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Watching Ad... ({adCountdown}s)
                    </>
                  ) : (
                    <>
                      <PlaySquare className="w-5 h-5" />
                      Watch Ad to Unlock
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowAdModal(false)}
                  disabled={isWatchingAd}
                  className="w-full py-3 px-4 bg-transparent text-gray-400 hover:text-white rounded-xl font-medium transition-colors disabled:opacity-50"
                >
                  Maybe Later
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

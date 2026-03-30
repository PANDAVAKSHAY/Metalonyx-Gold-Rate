import React from 'react';
import { motion } from 'motion/react';
import { Check, Crown, Star } from 'lucide-react';
import { useSubscription, SubscriptionTier } from '../contexts/SubscriptionContext';

export function Premium() {
  const { tier, setTier, isPremium } = useSubscription();

  const handleSubscribe = (newTier: SubscriptionTier) => {
    setTier(newTier);
    // In a real app, this would integrate with a payment gateway like Stripe or Razorpay
    alert(`Successfully subscribed to ${newTier} plan!`);
  };

  return (
    <div className="p-4 pb-32 md:pb-20 max-w-5xl mx-auto w-full">
      <div className="text-center mb-8 mt-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold-500/10 mb-4">
          <Crown className="w-8 h-8 text-gold-500" />
        </div>
        <h2 className="text-2xl font-display font-bold text-white mb-2">Metalonyx Premium</h2>
        <p className="text-gray-400 text-sm">Remove ads and get the best experience.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Free Plan */}
        <div className={`p-5 rounded-2xl border flex flex-col ${tier === 'free' ? 'border-gold-500 bg-charcoal-800' : 'border-charcoal-700 bg-charcoal-800/50'}`}>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-bold text-white">Free</h3>
              <p className="text-sm text-gray-400">Basic access</p>
            </div>
            <div className="text-right">
              <span className="text-xl font-bold text-white">₹0</span>
            </div>
          </div>
          <ul className="space-y-2 mb-6 flex-1">
            <li className="flex items-center text-sm text-gray-300 gap-2">
              <Check className="w-4 h-4 text-gold-500" /> Live Market Rates
            </li>
            <li className="flex items-center text-sm text-gray-300 gap-2">
              <Check className="w-4 h-4 text-gold-500" /> Basic Calculator
            </li>
            <li className="flex items-center text-sm text-gray-500 gap-2">
              <span className="w-4 h-4 flex items-center justify-center text-xs">✕</span> Contains Ads
            </li>
          </ul>
          {tier === 'free' ? (
            <button disabled className="w-full py-3 rounded-xl bg-charcoal-700 text-gray-400 font-medium text-sm mt-auto">
              Current Plan
            </button>
          ) : (
            <button onClick={() => setTier('free')} className="w-full py-3 rounded-xl bg-charcoal-700 text-white font-medium text-sm hover:bg-charcoal-600 transition-colors mt-auto">
              Downgrade to Free
            </button>
          )}
        </div>

        {/* Monthly Plan */}
        <div className={`p-5 rounded-2xl border relative overflow-hidden flex flex-col ${tier === 'monthly' ? 'border-gold-500 bg-charcoal-800' : 'border-charcoal-700 bg-charcoal-800/50'}`}>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-bold text-white">Monthly</h3>
              <p className="text-sm text-gray-400">Ad-free experience</p>
            </div>
            <div className="text-right">
              <span className="text-xl font-bold text-white">₹99</span>
              <span className="text-xs text-gray-500">/mo</span>
            </div>
          </div>
          <ul className="space-y-2 mb-6 flex-1">
            <li className="flex items-center text-sm text-gray-300 gap-2">
              <Check className="w-4 h-4 text-gold-500" /> Ad-Free Experience
            </li>
            <li className="flex items-center text-sm text-gray-300 gap-2">
              <Check className="w-4 h-4 text-gold-500" /> City-wise Rates
            </li>
            <li className="flex items-center text-sm text-gray-300 gap-2">
              <Check className="w-4 h-4 text-gold-500" /> Priority Support
            </li>
          </ul>
          {tier === 'monthly' ? (
            <button disabled className="w-full py-3 rounded-xl bg-gold-500/20 text-gold-500 font-medium text-sm border border-gold-500/30 mt-auto">
              Current Plan
            </button>
          ) : (
            <button onClick={() => handleSubscribe('monthly')} className="w-full py-3 rounded-xl bg-gold-500 text-charcoal-900 font-bold text-sm hover:bg-gold-400 transition-colors mt-auto">
              Subscribe Monthly
            </button>
          )}
        </div>

        {/* Yearly Plan */}
        <div className={`p-5 rounded-2xl border relative overflow-hidden flex flex-col ${tier === 'yearly' ? 'border-gold-500 bg-charcoal-800' : 'border-gold-500/30 bg-gradient-to-br from-charcoal-800 to-charcoal-800/80'}`}>
          {tier !== 'yearly' && (
            <div className="absolute top-0 right-0 bg-gold-500 text-charcoal-900 text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
              Best Value
            </div>
          )}
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Yearly <Star className="w-4 h-4 text-gold-500 fill-gold-500" />
              </h3>
              <p className="text-sm text-gray-400">Save ~33%</p>
            </div>
            <div className="text-right">
              <span className="text-xl font-bold text-white">₹799</span>
              <span className="text-xs text-gray-500">/yr</span>
            </div>
          </div>
          <ul className="space-y-2 mb-6 flex-1">
            <li className="flex items-center text-sm text-gray-300 gap-2">
              <Check className="w-4 h-4 text-gold-500" /> All Monthly Features
            </li>
            <li className="flex items-center text-sm text-gray-300 gap-2">
              <Check className="w-4 h-4 text-gold-500" /> 2 Months Free
            </li>
            <li className="flex items-center text-sm text-gray-300 gap-2">
              <Check className="w-4 h-4 text-gold-500" /> Premium Badge
            </li>
          </ul>
          {tier === 'yearly' ? (
            <button disabled className="w-full py-3 rounded-xl bg-gold-500/20 text-gold-500 font-medium text-sm border border-gold-500/30 mt-auto">
              Current Plan
            </button>
          ) : (
            <button onClick={() => handleSubscribe('yearly')} className="w-full py-3 rounded-xl bg-gold-500 text-charcoal-900 font-bold text-sm hover:bg-gold-400 transition-colors shadow-lg shadow-gold-500/20 mt-auto">
              Subscribe Yearly
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

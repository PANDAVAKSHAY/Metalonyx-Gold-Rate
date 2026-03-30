import React, { createContext, useContext, useState, ReactNode } from 'react';

export type SubscriptionTier = 'free' | 'monthly' | 'yearly';

interface SubscriptionContextType {
  tier: SubscriptionTier;
  setTier: (tier: SubscriptionTier) => void;
  isPremium: boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [tier, setTier] = useState<SubscriptionTier>('free');

  const isPremium = tier === 'monthly' || tier === 'yearly';

  return (
    <SubscriptionContext.Provider value={{ tier, setTier, isPremium }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}

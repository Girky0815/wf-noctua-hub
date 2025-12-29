import React from 'react';
import type { VoidTrader } from '../../types/warframe';

interface VoidTraderCardProps {
  voidTrader?: VoidTrader;
}

export const VoidTraderCard: React.FC<VoidTraderCardProps> = ({ voidTrader }) => {
  if (!voidTrader) return null;

  const isActive = voidTrader.active;
  const label = isActive ? '現在滞在中' : '到着まで';
  // API returns formatted string like "-2d 4h 5m" or relative string

  // Custom logic to handle time display might be needed depending on exacting string format API returns,
  // usually clients rely on activation/expiry dates and calc diff.
  // For now using provided string but cleaning it if it has negative.

  return (
    <div className="rounded-3xl bg-tertiary-container p-5 text-on-tertiary-container">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold font-display">{voidTrader.character}</h3>
          <p className="text-sm opacity-80">{voidTrader.location}</p>
        </div>
        <div className="text-right">
          <div className="text-xs font-bold uppercase tracking-wide opacity-70">{label}</div>
          <div className="text-xl font-bold font-display">{isActive ? voidTrader.expiry : voidTrader.startString}</div>
        </div>
      </div>
    </div>
  );
};

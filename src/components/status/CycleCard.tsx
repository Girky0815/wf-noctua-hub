import React from 'react';
import type { Cycle } from '../../types/warframe';

interface CycleCardProps {
  name: string;
  cycle?: Cycle;
}

export const CycleCard: React.FC<CycleCardProps> = ({ name, cycle }) => {
  if (!cycle) return <div className="h-24 animate-pulse rounded-2xl bg-surface-container-high" />;

  const isDay = cycle.isDay || cycle.state === 'day' || cycle.state === 'warm' || cycle.state === 'fass';
  const stateLabel = cycle.state === 'warm' ? '温暖' : cycle.state === 'cold' ? '寒冷' : cycle.state === 'day' ? '昼' : cycle.state === 'night' ? '夜' : cycle.state === 'fass' ? 'Fass' : 'Vome';

  // Icon mapping
  const icon = isDay ? 'sunny' : 'bedtime';

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl bg-surface-container-low p-4 text-on-surface">
      <div className="mb-1 text-sm font-medium text-on-surface-variant">{name}</div>
      <div className="flex items-center gap-2">
        <span className={`material-symbols-rounded ${isDay ? 'text-primary' : 'text-tertiary'}`}>
          {icon}
        </span>
        <span className="text-xl font-bold font-display">{stateLabel}</span>
      </div>
      <div className="mt-1 text-xs text-on-surface-variant font-display tracking-wider">
        あと {cycle.timeLeft}
      </div>
    </div>
  );
};

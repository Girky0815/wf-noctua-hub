import React from 'react';
import type { DuviriCycle } from '../../types/warframe';
import { formatTime } from '../../utils/time';
import { useCountdown } from '../../hooks/useCountdown';

import IconVoid from '../../assets/icons/void.png';
import IconHeat from '../../assets/icons/heat.png';
import IconToxin from '../../assets/icons/toxin.png';
import IconCold from '../../assets/icons/cold.png';
import IconElectricity from '../../assets/icons/electricity.png';

interface DuviriCycleCardProps {
  cycle?: DuviriCycle;
}

export const DuviriCycleCard: React.FC<DuviriCycleCardProps> = ({ cycle }) => {
  const timeLeft = useCountdown(cycle?.expiry);

  if (!cycle) return <div className="h-24 animate-pulse rounded-2xl bg-surface-container-high" />;

  const stateKey = cycle.state.toLowerCase();

  let stateLabel = cycle.state;
  let iconSrc = IconVoid;
  let colorClass = 'text-primary';

  switch (stateKey) {
    case 'joy':
      stateLabel = '幸福';
      iconSrc = IconVoid;
      colorClass = 'text-purple-300'; // Void color
      break;
    case 'anger':
      stateLabel = '激怒';
      iconSrc = IconHeat;
      colorClass = 'text-red-500';
      break;
    case 'envy':
      stateLabel = '嫉妬';
      iconSrc = IconToxin;
      colorClass = 'text-green-600';
      break;
    case 'sorrow':
      stateLabel = '悲哀';
      iconSrc = IconCold;
      colorClass = 'text-blue-400';
      break;
    case 'fear':
      stateLabel = '恐怖';
      iconSrc = IconElectricity;
      colorClass = 'text-purple-400';
      break;
  }

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl bg-surface-bright p-4 text-on-surface">
      <div className="mb-1 text-sm font-medium text-on-surface-variant">デュヴィリ</div>
      <div className="flex items-center gap-2">
        <img
          src={iconSrc}
          alt={stateLabel}
          className="w-6 h-6 object-contain"
        />
        <span className="text-xl font-bold font-display">{stateLabel}</span>
      </div>
      <div
        className="mt-1 text-xs text-on-surface-variant font-display tracking-wider"
        style={{ fontFeatureSettings: "'tnum'" }}
      >
        あと {timeLeft || '--'} ({formatTime(cycle.expiry)})
      </div>
    </div>
  );
};

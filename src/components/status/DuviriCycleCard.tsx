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
  isPredicted?: boolean;
}

export const DuviriCycleCard: React.FC<DuviriCycleCardProps> = ({ cycle, isPredicted }) => {
  const timeLeft = useCountdown(cycle?.expiry);

  if (!cycle) return <div className="h-24 animate-pulse rounded-2xl bg-surface-container-high" />;

  const stateKey = cycle.state.toLowerCase();

  let stateLabel = cycle.state;
  let iconSrc = IconVoid;

  switch (stateKey) {
    case 'joy':
      stateLabel = '幸福';
      iconSrc = IconVoid;
      break;
    case 'anger':
      stateLabel = '激怒';
      iconSrc = IconHeat;
      break;
    case 'envy':
      stateLabel = '嫉妬';
      iconSrc = IconToxin;
      break;
    case 'sorrow':
      stateLabel = '悲哀';
      iconSrc = IconCold;
      break;
    case 'fear':
      stateLabel = '恐怖';
      iconSrc = IconElectricity;
      break;
  }

  return (
    <div className="relative flex flex-col items-center justify-center rounded-2xl bg-surface-bright p-4 text-on-surface overflow-hidden">
      {isPredicted && (
        <span className="absolute top-2 right-2 material-symbols-rounded text-[18px] text-on-surface-variant opacity-60" title="自動計算中">
          calculate
        </span>
      )}
      <div className="mb-1 text-sm font-medium text-on-surface-variant">デュヴィリ</div>
      <div className="flex items-center gap-2">
        <img
          src={iconSrc}
          alt={stateLabel}
          className="w-6 h-6 object-contain select-none"
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

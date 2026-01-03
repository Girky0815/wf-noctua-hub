import React from 'react';
import type { ZarimanCycle } from '../../types/warframe';
import { formatTime } from '../../utils/time';
import { useCountdown } from '../../hooks/useCountdown';

import IconGrineer from '../../assets/icons/IconGrineer.png';
import IconCorpus from '../../assets/icons/IconCorpus.png';

interface ZarimanCycleCardProps {
  cycle?: ZarimanCycle;
  isPredicted?: boolean;
}

export const ZarimanCycleCard: React.FC<ZarimanCycleCardProps> = ({ cycle, isPredicted }) => {
  const timeLeft = useCountdown(cycle?.expiry);

  if (!cycle) return <div className="h-24 animate-pulse rounded-2xl bg-surface-container-high" />;

  const isCorpus = cycle.isCorpus || cycle.state === 'corpus';
  const factionLabel = isCorpus ? 'コーパス' : 'クバグリニア';
  const iconSrc = isCorpus ? IconCorpus : IconGrineer;

  return (
    <div className="relative flex flex-col items-center justify-center rounded-2xl bg-surface-bright p-4 text-on-surface overflow-hidden">
      {isPredicted && (
        <span className="absolute top-2 right-2 material-symbols-rounded text-[18px] text-on-surface-variant opacity-60" title="自動計算中">
          calculate
        </span>
      )}
      <div className="mb-1 text-sm font-medium text-on-surface-variant">Zariman</div>
      <div className="flex items-center gap-2">
        <img
          src={iconSrc}
          alt={factionLabel}
          className="w-6 h-6 object-contain"
        />
        <span className="text-xl font-bold font-display">{factionLabel}</span>
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

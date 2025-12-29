import React from 'react';
import type { Sortie } from '../../types/warframe';

interface SortieCardProps {
  sortie?: Sortie;
}

export const SortieCard: React.FC<SortieCardProps> = ({ sortie }) => {
  if (!sortie) return <div className="h-40 animate-pulse rounded-3xl bg-surface-container-high" />;

  return (
    <div className="rounded-3xl bg-surface-container-low p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-on-surface font-display">今日のソーティ</h3>
        <div className="flex items-center gap-2 rounded-full bg-secondary-container px-3 py-1 text-xs font-bold text-on-secondary-container">
          <span>{sortie.boss}</span>
          <span>•</span>
          <span>{sortie.faction}</span>
          <span className="text-on-secondary-container/70 font-display">({sortie.eta})</span>
        </div>
      </div>

      <div className="space-y-1">
        {sortie.variants.map((variant, index) => {
          // Determine border radius class based on index
          const isFirst = index === 0;
          const isLast = index === sortie.variants.length - 1;
          const roundedClass = isFirst ? 'rounded-t-3xl' : isLast ? 'rounded-b-3xl' : 'rounded-sm';

          return (
            <div
              key={`${sortie.id}-${index}`}
              className={`flex flex-col gap-1 bg-surface-container p-4 ${roundedClass} mb-[2px] last:mb-0`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-primary">{variant.missionType}</span>
                <span className="text-xs text-on-surface-variant">{variant.node}</span>
              </div>
              <div className="text-sm text-on-surface">
                <span className="font-bold text-error">{variant.modifier}</span>: {variant.modifierDescription}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

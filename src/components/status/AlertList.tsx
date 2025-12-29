import React from 'react';
import type { Alert } from '../../types/warframe';

interface AlertListProps {
  alerts?: Alert[];
}

export const AlertList: React.FC<AlertListProps> = ({ alerts }) => {
  if (!alerts || alerts.length === 0) return null;

  return (
    <div className="rounded-3xl bg-surface-container-low p-5">
      <h3 className="mb-4 text-lg font-bold text-on-surface font-display">アラート</h3>
      <div className="flex flex-col gap-[2px]">
        {alerts.map((alert, index) => {
          const isFirst = index === 0;
          const isLast = index === alerts.length - 1;
          const roundedClass =
            alerts.length === 1 ? 'rounded-3xl' :
              isFirst ? 'rounded-t-3xl' :
                isLast ? 'rounded-b-3xl' :
                  'rounded-sm';

          return (
            <div key={alert.id} className={`bg-surface-container p-4 ${roundedClass}`}>
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-on-surface">{alert.mission.type}</span>
                  <span className="text-xs text-on-surface-variant font-display">{alert.mission.node}</span>
                </div>
                <div className="text-xs font-bold text-primary font-display">{alert.eta}</div>
              </div>
              <div className="flex items-center gap-2">
                <img src={alert.mission.reward.thumbnail} alt="" className="h-6 w-6 object-contain" onError={(e) => (e.currentTarget.style.display = 'none')} />
                <span className="text-sm font-medium text-on-surface-variant">{alert.mission.reward.asString}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

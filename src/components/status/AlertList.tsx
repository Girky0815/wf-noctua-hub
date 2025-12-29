import React from 'react';
import type { Alert } from '../../types/warframe';
import { translateMissionType } from '../../utils/translations';
import { formatTime } from '../../utils/time';
import { useCountdown } from '../../hooks/useCountdown';

interface AlertListProps {
  alerts?: Alert[];
}

// 個別の Alert 項目コンポーネント (Hooks を使うため分離)
const AlertItem: React.FC<{ alert: Alert; roundedClass: string }> = ({ alert, roundedClass }) => {
  const timeLeft = useCountdown(alert.expiry);
  const formattedTime = `残り ${timeLeft || '--'} (${formatTime(alert.expiry)} 終了)`;

  return (
    <div className={`bg-surface-container p-4 ${roundedClass}`}>
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-bold text-on-surface">{translateMissionType(alert.mission.type)}</span>
          <span className="text-xs text-on-surface-variant font-display">{alert.mission.node}</span>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="material-symbols-rounded text-lg text-secondary">redeem</span>
          <span className="text-sm font-medium text-on-surface">
            {alert.mission?.reward?.asString || '報酬情報なし'}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-on-surface-variant">
          <span className="material-symbols-rounded text-lg">schedule</span>
          <span
            className="font-display tracking-wide"
            style={{ fontFeatureSettings: "'tnum'" }}
          >
            {formattedTime}
          </span>
        </div>
      </div>
    </div>
  );
};

export const AlertList: React.FC<AlertListProps> = ({ alerts }) => {
  if (!alerts || alerts.length === 0) return null;

  return (
    <div className="rounded-3xl bg-surface-bright p-5">
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

          return <AlertItem key={alert.id} alert={alert} roundedClass={roundedClass} />;
        })}
      </div>
    </div>
  );
};

import React from 'react';
import type { Alert } from '../../types/warframe';
import { translateMissionType, translateResource, translateFaction, translateNode } from '../../utils/translations';
import { formatTime } from '../../utils/time';
import { useCountdown } from '../../hooks/useCountdown';
import { ListGroup, ListItem } from '../ui/List';

interface AlertListProps {
  alerts?: Alert[];
}

// 個別の Alert 項目コンポーネント (Hooks を使うため分離)
const AlertItem: React.FC<{ alert: Alert }> = ({ alert }) => {
  const timeLeft = useCountdown(alert.expiry);
  const formattedTime = `残り ${timeLeft || '--'} (${formatTime(alert.expiry)} 終了)`;

  // 報酬表示の構築
  const reward = alert.mission?.reward;
  const rewardText = React.useMemo(() => {
    if (!reward) return '報酬情報なし';

    const parts: string[] = [];

    // クレジット
    if (reward.credits) {
      parts.push(`${reward.credits.toLocaleString()}cr`);
    }

    // 通常アイテム
    if (reward.items && reward.items.length > 0) {
      reward.items.forEach(item => parts.push(translateResource(item)));
    }

    // 個数付きアイテム (countedItems)
    if (reward.countedItems && reward.countedItems.length > 0) {
      reward.countedItems.forEach(item => {
        parts.push(`${translateResource(item.type)} x${item.count}`);
      });
    }

    // 何も情報がない場合のフォールバック (asStringを使うが、asString自体が空のこともある)
    if (parts.length === 0) {
      return reward.asString || '不明な報酬';
    }

    return parts.join(' + ');
  }, [reward]);

  return (
    <ListItem className="p-4">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-bold text-on-surface">{translateMissionType(alert.mission.type)}</span>
          <span className="text-xs text-on-surface-variant font-display">{translateNode(alert.mission.node)}</span>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        {/* 敵情報: 勢力 レベル範囲 */}
        <div className="flex items-center gap-2 text-sm text-on-surface-variant">
          <span className="material-symbols-rounded text-lg">swords</span> {/* または sports_kabaddi, combat */}
          <span>
            {translateFaction(alert.mission.faction)} <span className="text-xs opacity-80">{alert.mission.minEnemyLevel}-{alert.mission.maxEnemyLevel}</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="material-symbols-rounded text-lg text-secondary">redeem</span>
          <span className="text-sm font-medium text-on-surface">
            {rewardText}
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
    </ListItem>
  );
};

export const AlertList: React.FC<AlertListProps> = ({ alerts }) => {
  if (!alerts || alerts.length === 0) {
    return (
      <ListGroup>
        <ListItem className="p-6 text-center text-on-surface-variant">
          <div className="mb-2">
            <span className="material-symbols-rounded text-3xl opacity-50">notifications_off</span>
          </div>
          <p className="text-sm">アラートミッションなし</p>
        </ListItem>
      </ListGroup>
    );
  }

  return (
    <ListGroup>
      {alerts.map((alert) => {
        // 設定画面と同様にリストアイテム自体には角丸クラスをつけない（SettingsGroupがoverflow-hiddenで処理するため）
        // ただし各アイテムの背景色などは維持
        // -> ListItem を使うことで自動的に角丸処理が行われる
        return <AlertItem key={alert.id} alert={alert} />;
      })}
    </ListGroup>
  );
};

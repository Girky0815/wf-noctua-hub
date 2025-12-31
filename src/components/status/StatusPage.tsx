import React from 'react';
import { useWarframeData } from '../../hooks/useWarframeData';
import { CycleCard } from './CycleCard';
import { AlertList } from './AlertList';
import { InvasionList } from './InvasionList';
import { SortieCard } from './SortieCard';
import { VoidTraderCard } from './VoidTraderCard';
import { ResurgenceCard } from './ResurgenceCard';
import { useCountdown } from '../../hooks/useCountdown';
import { getEffectiveCycle } from '../../utils/cycleCalculator';

// セクションタイトルのコンポーネント
const SectionTitle: React.FC<{ title: string; trailing?: React.ReactNode }> = ({ title, trailing }) => (
  <div className="mb-2 ml-4 flex items-center gap-3">
    <span
      className="text-sm font-bold text-primary font-display"
      style={{ fontVariationSettings: "'ROND' 100" }}
    >
      {title}
    </span>
    {trailing}
  </div>
);

// バッジコンポーネント (アルコン名などを表示)
const StatusBadge: React.FC<{
  label: string;
  subLabel?: string;
  variant?: 'secondary' | 'error';
}> = ({ label, subLabel, variant = 'secondary' }) => {
  const containerClass = variant === 'error'
    ? 'bg-error-container text-on-error-container'
    : 'bg-secondary-container text-on-secondary-container';

  return (
    <div className={`flex items-center gap-2 rounded-full px-3 py-0.5 text-xs font-bold ${containerClass}`}>
      <span>{label}</span>
      {subLabel && <span className="opacity-70 font-display">{subLabel}</span>}
    </div>
  );
};

// リサージェンスのカウントダウンバッジ
const ResurgenceTimerBadge: React.FC<{ expiry: string }> = ({ expiry }) => {
  const timeLeft = useCountdown(expiry);

  const isUrgent = React.useMemo(() => {
    if (!expiry) return false;
    const diff = new Date(expiry).getTime() - Date.now();
    return diff > 0 && diff < 24 * 60 * 60 * 1000;
  }, [expiry]);

  return <StatusBadge label={`あと ${timeLeft}`} variant={isUrgent ? 'error' : 'secondary'} />;
};


export const StatusPage: React.FC = () => {
  const { worldState, isLoading, isError } = useWarframeData();

  // データ鮮度チェック (APIのタイムスタンプと比較)
  const isDataStale = React.useMemo(() => {
    if (!worldState?.timestamp) return false;
    const dataTime = new Date(worldState.timestamp).getTime();
    const now = Date.now();
    const diff = now - dataTime;
    return diff > 30 * 60 * 1000; // 30分以上古い場合は警告
  }, [worldState?.timestamp]);

  if (isError) {
    return (
      <div className="flex h-full items-center justify-center p-8 text-error">
        <span className="material-symbols-rounded mr-2">error</span>
        データの取得に失敗しました
      </div>
    );
  }

  if (isLoading || !worldState) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-surface-variant border-t-primary"></div>
      </div>
    );
  }

  // ソーティ/アルコン情報の準備
  const sortie = worldState.sorties?.[0];
  const archonHunt = worldState.archonHunt;

  return (
    <div className="grid gap-6 pb-20 pt-4">
      {/* 警告: データが古い場合 */}
      {isDataStale && (
        <div className="flex items-start gap-3 rounded-2xl bg-error-container p-4 text-on-error-container">
          <span className="material-symbols-rounded mt-0.5">warning</span>
          <div className="flex flex-col text-sm">
            <span className="rounded-full font-bold text-lg">APIデータが更新されていません</span>
            <span className="opacity-90">
              Warframe Status API からの情報が <strong>{Math.floor((Date.now() - new Date(worldState.timestamp).getTime()) / (1000 * 60))} 分</strong>以上遅れています。<br></br>アラート等は更新時点の情報で現在利用可能なものが表示されます。<br></br>APIが正常に利用できるまで、ワールドステータスは正常に表示されません。
            </span>
          </div>
        </div>
      )}

      {/* World Cycles */}
      <div>

        <SectionTitle title="ワールドサイクル" />
        <div className="grid grid-cols-2 gap-4">
          <CycleCard name="エイドロンの草原" cycle={getEffectiveCycle(worldState.cetusCycle, 'cetus')} />
          <CycleCard name="オーブ峡谷" cycle={getEffectiveCycle(worldState.vallisCycle, 'vallis')} />
          <CycleCard name="カンビオン荒地" cycle={getEffectiveCycle(worldState.cambionCycle, 'cambion')} />
        </div>
      </div>

      {/* Alerts */}
      <div>
        <SectionTitle title="アラート" />
        <div>
          <AlertList alerts={worldState.alerts.filter(a => !a.expired && new Date(a.expiry).getTime() > Date.now())} />
        </div>
      </div>

      {/* Invasions */}
      <div>
        <SectionTitle title="侵略ミッション" />
        <div className="">
          <InvasionList invasions={worldState.invasions} />
        </div>
      </div>

      {/* Sortie */}
      {sortie && (
        <div>
          <SectionTitle
            title="今日のソーティ"
            trailing={<StatusBadge label={sortie.boss} subLabel={sortie.eta} />}
          />
          <div className="">
            <SortieCard sortie={sortie} />
          </div>
        </div>
      )}

      {/* Archon Hunt */}
      {archonHunt && (
        <div>
          <SectionTitle
            title="アルコン討伐戦"
            trailing={
              <StatusBadge
                label={archonHunt.boss.replace('Archon ', '')}
                subLabel={archonHunt.eta} // 括弧なしでそのまま表示
              />
            }
          />
          <div className="">
            <SortieCard sortie={archonHunt} />
          </div>
        </div>
      )}

      {/* Prime Resurgence */}
      {worldState.vaultTrader && (
        <div>
          <SectionTitle
            title="Prime Resurgence"
            trailing={<ResurgenceTimerBadge expiry={worldState.vaultTrader.expiry} />}
          />
          <div className="">
            <ResurgenceCard trader={worldState.vaultTrader} />
          </div>
        </div>
      )}

      {/* Void Trader */}
      {worldState.voidTrader && (
        <div>
          <SectionTitle title="Baro Ki'Teer" />
          <div className="">
            <VoidTraderCard voidTrader={worldState.voidTrader} />
          </div>
        </div>
      )}
    </div>
  );
};

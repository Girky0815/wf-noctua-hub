import React from 'react';
import { useWarframeData } from '../../hooks/useWarframeData';
import { CycleCard } from './CycleCard';
import { AlertList } from './AlertList';
import { InvasionList } from './InvasionList';
import { SortieCard } from './SortieCard';
import { VoidTraderCard } from './VoidTraderCard';

// セクションタイトルのコンポーネント
const SectionTitle: React.FC<{ title: string; trailing?: React.ReactNode }> = ({ title, trailing }) => (
  <div className="mb-2 ml-4 flex items-center gap-3">
    <span className="text-sm font-bold text-primary">{title}</span>
    {trailing}
  </div>
);

// バッジコンポーネント (アルコン名などを表示)
const StatusBadge: React.FC<{ label: string; subLabel?: string }> = ({ label, subLabel }) => (
  <div className="flex items-center gap-2 rounded-full bg-secondary-container px-3 py-0.5 text-xs font-bold text-on-secondary-container">
    <span>{label}</span>
    {subLabel && <span className="opacity-70 font-display">{subLabel}</span>}
  </div>
);

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
        <div className="mx-4 flex items-start gap-3 rounded-2xl bg-error-container p-4 text-on-error-container">
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
        <div className="grid grid-cols-2 gap-4 px-4">
          <CycleCard name="エイドロンの草原" cycle={worldState.cetusCycle} />
          <CycleCard name="オーブ峡谷" cycle={worldState.vallisCycle} />
          <CycleCard name="カンビオン荒地" cycle={worldState.cambionCycle} />
        </div>
      </div>

      {/* Alerts */}
      <div>
        <SectionTitle title="アラート" />
        <div className="px-4">
          <AlertList alerts={worldState.alerts.filter(a => !a.expired && new Date(a.expiry).getTime() > Date.now())} />
        </div>
      </div>

      {/* Invasions */}
      <div>
        <SectionTitle title="侵略ミッション" />
        <div className="px-4">
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
          <div className="px-4">
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
          <div className="px-4">
            <SortieCard sortie={archonHunt} />
          </div>
        </div>
      )}

      {/* Void Trader */}
      {worldState.voidTrader && (
        <div>
          <SectionTitle title="Baro Ki'Teer" />
          <div className="px-4">
            <VoidTraderCard voidTrader={worldState.voidTrader} />
          </div>
        </div>
      )}
    </div>
  );
};

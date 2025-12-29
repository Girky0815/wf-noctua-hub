import React from 'react';
import { useWarframeData } from '../../hooks/useWarframeData';
import { CycleCard } from './CycleCard';
import { AlertList } from './AlertList';
import { InvasionList } from './InvasionList';
import { SortieCard } from './SortieCard';
import { VoidTraderCard } from './VoidTraderCard';

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

  return (
    <div className="grid gap-4 pb-20">
      {/* 警告: データが古い場合 */}
      {isDataStale && (
        <div className="flex items-start gap-3 rounded-2xl bg-error-container p-4 text-on-error-container">
          <span className="material-symbols-rounded mt-0.5">warning</span>
          <div className="flex flex-col text-sm">
            <span className="font-bold">APIデータが更新されていません</span>
            <span className="opacity-90">
              Warframe Status API からの情報が {Math.floor((Date.now() - new Date(worldState.timestamp).getTime()) / (1000 * 60 * 60))} 時間以上遅れています。表示されている情報は不正確な可能性があります。
            </span>
          </div>
        </div>
      )}

      {/* Cycles Row */}
      <div className="grid grid-cols-3 gap-2">
        <CycleCard name="エイドロンの草原" cycle={worldState.cetusCycle} />
        <CycleCard name="オーブ峡谷" cycle={worldState.vallisCycle} />
        <CycleCard name="カンビオン荒地" cycle={worldState.cambionCycle} />
      </div>

      {/* Special Events / Prioritized Info */}
      <VoidTraderCard voidTrader={worldState.voidTrader} />

      {/* Alerts */}
      <AlertList alerts={worldState.alerts.filter(a => !a.expired && new Date(a.expiry).getTime() > Date.now())} />

      {/* Invasions */}
      <InvasionList invasions={worldState.invasions} />

      {/* Sortie */}
      <SortieCard sortie={worldState.sorties?.[0]} />

      {/* Archon Hunt (using SortieCard for now layout wise is similar) */}
      {worldState.archonHunt && (
        <div className="mt-2">
          <div className="mb-2 ml-4 text-sm font-bold text-on-surface-variant">アルコン討伐戦</div>
          <SortieCard sortie={worldState.archonHunt} />
        </div>
      )}

      {/* Invasions will go here */}

    </div>
  );
};

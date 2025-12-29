import React from 'react';
import { useWarframeData } from '../../hooks/useWarframeData';
import { CycleCard } from './CycleCard';
import { AlertList } from './AlertList';
import { SortieCard } from './SortieCard';
import { VoidTraderCard } from './VoidTraderCard';

export const StatusPage: React.FC = () => {
  const { worldState, isLoading, isError } = useWarframeData();

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
      {/* Cycles Row */}
      <div className="grid grid-cols-3 gap-2">
        <CycleCard name="地球" cycle={worldState.cetusCycle} />
        <CycleCard name="金星" cycle={worldState.vallisCycle} />
        <CycleCard name="ダイモス" cycle={worldState.cambionCycle} />
      </div>

      {/* Special Events / Prioritized Info */}
      <VoidTraderCard voidTrader={worldState.voidTrader} />

      {/* Alerts */}
      <AlertList alerts={worldState.alerts} />

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

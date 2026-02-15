import React from 'react';
import { useWarframeData } from '../hooks/useWarframeData';
import { CircuitCard } from '../components/status/CircuitCard';
import { SectionTitle } from '../components/ui/SectionTitle';

export const CircuitPage: React.FC = () => {
  const { worldState, isLoading } = useWarframeData();

  if (isLoading || !worldState) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-surface-variant border-t-primary"></div>
      </div>
    );
  }

  const { duviriCycle } = worldState;

  return (
    <div className="flex flex-col gap-6 pb-20 pt-4">
      <SectionTitle title="サーキット報酬" />

      <div className="text-sm text-on-surface-variant opacity-80">
        <p>
          デュヴィリのサーキットでは、毎週異なるWarframeやインカーノン・ジェネシスアダプターが報酬として提供されます。
          <br />
          通常版ではWarframeの設計図一式、鋼の道のりでは既存の武器を強化するアダプターを獲得できます。
        </p>
      </div>

      <div className="bg-surface-container rounded-xl p-2">
        {duviriCycle ? (
          <CircuitCard cycle={duviriCycle} />
        ) : (
          <div className="p-8 text-center text-on-surface-variant">
            データが取得できませんでした
          </div>
        )}
      </div>
    </div>
  );
};

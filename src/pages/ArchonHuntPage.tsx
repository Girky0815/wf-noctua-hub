import React from 'react';
import { useWarframeData } from '../hooks/useWarframeData';
import { SortieCard } from '../components/status/SortieCard';
import { SectionTitle } from '../components/ui/SectionTitle';

export const ArchonHuntPage: React.FC = () => {
  const { worldState, isLoading } = useWarframeData();

  if (isLoading || !worldState) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-surface-variant border-t-primary"></div>
      </div>
    );
  }

  const archonHunt = worldState.archonHunt;

  if (!archonHunt) {
    return (
      <div className="p-4 text-center text-on-surface-variant">
        現在アルコン討伐戦の情報はありません。
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pt-4">
      <div>
        <SectionTitle
          title="アルコン討伐戦"
          trailing={
            <div className="bg-error-container text-on-error-container px-3 py-0.5 rounded-full text-xs font-bold font-display">
              {archonHunt.boss.replace('Archon ', '')}
            </div>
          }
        />
        <div className="mt-2">
          <SortieCard sortie={archonHunt} />
        </div>
      </div>

      <div className="text-sm text-on-surface-variant bg-surface-container-high p-4 rounded-xl">
        <h3 className="font-bold mb-2">概要</h3>
        <p>
          アルコン討伐戦は、ナルメル勢力と戦う高難易度ミッションです。<br />
          通常のソーティと同様に3つのミッションで構成されていますが、より強力な敵や制限が存在します。
          最終ミッションではアルコンとのボス戦が待ち受けています。
        </p>
        <ul className="list-disc list-inside mt-2 space-y-1 opacity-80">
          <li><strong>参加条件:</strong> クエスト「ベールブレイカー」完了</li>
          <li><strong>報酬:</strong> アルコンの欠片 (週1回)</li>
          <li><strong>制限:</strong> 蘇生制限あり、消耗品使用制限あり</li>
        </ul>
      </div>
    </div>
  );
};

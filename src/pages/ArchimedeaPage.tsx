import React from 'react';
import { useWarframeData } from '../hooks/useWarframeData';
import { SectionTitle } from '../components/ui/SectionTitle';
import { ArchimedeaCard } from '../components/status/ArchimedeaCard';
import { StaleDataWarning } from '../components/ui/StaleDataWarning';

export const ArchimedeaPage: React.FC = () => {
  const { worldState, isLoading, isError } = useWarframeData();

  if (isError) {
    return (
      <div className="flex items-center justify-center py-20 text-error">
        <span className="material-symbols-rounded mb-2 text-4xl">error</span>
        <p>データの取得に失敗しました</p>
      </div>
    );
  }

  if (isLoading && !worldState) {
    return (
      <div className="flex items-center justify-center py-20 text-on-surface-variant">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-surface-container-highest border-t-primary" />
      </div>
    );
  }

  const archimedeas = worldState?.archimedeas;

  return (
    <div className="animate-fade-in pb-24">
      {/* Header */}
      <div className="mb-6 flex items-center gap-4 px-4 pt-4">
        <h1 className="text-2xl font-bold text-on-surface font-display" style={{ fontVariationSettings: "'ROND' 100" }}>
          アルキメデア
        </h1>
      </div>

      <div className="px-4 mb-6">
        <p className="text-sm text-on-surface-variant opacity-80">
          毎週更新される高難易度ミッション。深淵と次元の2種類が存在します。
        </p>
      </div>

      {worldState && <StaleDataWarning timestamp={worldState.timestamp} />}

      <div className="space-y-6">
        {archimedeas && archimedeas.length > 0 ? (
          archimedeas.map(a => (
            <div key={a.id}>
              {/* Using SectionTitle as a divider? Or just rely on card headers.
                   ArchimedeaCard has its own header.
               */}
              <ArchimedeaCard archimedea={a} />
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-on-surface-variant bg-surface-container-high rounded-2xl mx-4">
            <span className="material-symbols-rounded text-4xl opacity-50 mb-2">event_busy</span>
            <p>現在アクティブなアルキメデアがありません</p>
          </div>
        )}
      </div>
    </div>
  );
};

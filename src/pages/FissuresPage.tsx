import React from 'react';
import { useWarframeData } from '../hooks/useWarframeData';
import { FissureList } from '../components/fissures/FissureList';

export const FissuresPage: React.FC = () => {
  const { worldState, isLoading, isError } = useWarframeData();
  const [filterMode, setFilterMode] = React.useState<'normal' | 'hard' | 'storm'>('normal');

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-error">
        <span className="material-symbols-rounded mb-2 text-4xl">error</span>
        <p>データの取得に失敗しました</p>
      </div>
    );
  }

  // Filter Logic
  const filteredFissures = React.useMemo(() => {
    if (!worldState?.fissures) return [];
    return worldState.fissures.filter(f => {
      if (filterMode === 'hard') return f.isHard;
      if (filterMode === 'storm') return f.isStorm;
      return !f.isHard && !f.isStorm; // Normal
    });
  }, [worldState?.fissures, filterMode]);

  const toggleFilter = (mode: 'hard' | 'storm') => {
    setFilterMode(current => current === mode ? 'normal' : mode);
  };

  if (isLoading && !worldState) {
    return (
      <div className="flex items-center justify-center py-20 text-on-surface-variant">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-surface-container-highest border-t-primary" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in pb-24">
      <div className="mb-4 flex items-center justify-between px-2">
        <h2 className="text-xl font-display font-bold text-on-surface">亀裂ミッション</h2>

        {/* Filter Toggles */}
        <div className="flex gap-2">
          <button
            onClick={() => toggleFilter('hard')}
            className={`
              flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-medium transition-colors border
              ${filterMode === 'hard'
                ? 'bg-secondary-container text-on-secondary-container border-secondary-container'
                : 'bg-transparent text-on-surface-variant border-outline hover:bg-surface-container-high'
              }
            `}
          >
            <span className="material-symbols-rounded text-[18px]">mode_standby</span>
            鋼の道のり
          </button>

          <button
            onClick={() => toggleFilter('storm')}
            className={`
              flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-medium transition-colors border
              ${filterMode === 'storm'
                ? 'bg-secondary-container text-on-secondary-container border-secondary-container'
                : 'bg-transparent text-on-surface-variant border-outline hover:bg-surface-container-high'
              }
            `}
          >
            <span className="material-symbols-rounded text-[18px]">rocket_launch</span>
            Void嵐
          </button>
        </div>
      </div>

      <FissureList fissures={filteredFissures} />
    </div>
  );
};

import React from 'react';
import { useWarframeData } from '../hooks/useWarframeData';
import { FissureList } from '../components/fissures/FissureList';

import { StaleDataWarning } from '../components/ui/StaleDataWarning';

export const FissuresPage: React.FC = () => {
  const { worldState, isLoading, isError } = useWarframeData();
  const [filterMode, setFilterMode] = React.useState<'normal' | 'hard' | 'storm'>('normal');
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

    // 現在時刻
    const now = Date.now();

    return worldState.fissures.filter(f => {
      // 期限切れを除外
      if (new Date(f.expiry).getTime() <= now) return false;

      if (filterMode === 'hard') return f.isHard;
      if (filterMode === 'storm') return f.isStorm;
      return !f.isHard && !f.isStorm; // Normal
    });
  }, [worldState?.fissures, filterMode]); // NOTE: real-time filtering might require a timer or just rely on re-renders. Since useWarframeData updates every 30s and components re-render, this should be fine for "rough" filtering.

  const isStale = React.useMemo(() => {
    if (!worldState?.timestamp) return false;
    const diff = Date.now() - new Date(worldState.timestamp).getTime();
    return diff > 30 * 60 * 1000;
  }, [worldState?.timestamp]);

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
      {/* Fixed Header */}
      <div className={`fixed top-[76px] left-0 right-0 z-10 border-b transition-colors duration-300 shadow-sm
        ${isScrolled ? 'bg-surface-container-highest border-surface-container-highest' : 'bg-transparent border-transparent'}
      `}>
        <div className="mx-auto flex max-w-2xl items-center justify-between px-6 py-3">
          <h2 className="text-xl font-display font-bold text-on-surface">亀裂ミッション</h2>

          {/* Filter Toggles */}
          <div className="flex gap-2">
            <button
              onClick={() => toggleFilter('hard')}
              className={`
              flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-medium transition-colors border
              ${filterMode === 'hard'
                  ? 'bg-primary-container text-on-primary-container border-primary'
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
                  ? 'bg-primary-container text-on-primary-container border-primary'
                  : 'bg-transparent text-on-surface-variant border-outline hover:bg-surface-container-high'
                }
            `}
            >
              <span className="material-symbols-rounded text-[18px]">rocket_launch</span>
              Void嵐
            </button>
          </div>
        </div>
      </div>

      {/* Spacer for fixed header */}
      <div className="pt-24 space-y-4">
        {/* Stale Data Warning */}
        {worldState && <StaleDataWarning timestamp={worldState.timestamp} />}

        <FissureList fissures={filteredFissures} isStale={isStale} />
      </div>

      <p className="mt-4 px-2 text-center text-xs text-on-surface-variant opacity-70">
        ※ APIの仕様上、敵レベルなどの詳細情報は取得できないため表示していません。
      </p>
    </div>
  );
};

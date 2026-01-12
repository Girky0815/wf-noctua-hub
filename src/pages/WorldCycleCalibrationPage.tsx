import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../contexts/SettingsContext';
import { useWarframeData } from '../hooks/useWarframeData';
import { SectionTitle } from '../components/ui/SectionTitle';
import { CycleCard } from '../components/status/CycleCard';
import { getCetusCycle, getVallisCycle } from '../utils/localCycles';
import type { Cycle } from '../types/warframe';

export const WorldCycleCalibrationPage: React.FC = () => {
  const navigate = useNavigate();
  const { cycleCalibration, updateCycleCalibration } = useSettings();
  const { worldState } = useWarframeData();

  // Helper to calculate cycle with dynamic offset for preview
  const calculateCycle = (type: 'cetus' | 'vallis', offset: number) => {
    const now = Date.now();
    let baseCycle: Cycle;
    let apiData: Cycle | undefined;

    // Use local calculation as base, similar to usePredictedCycles
    if (type === 'cetus') {
      baseCycle = getCetusCycle(now) as Cycle;
      apiData = worldState?.cetusCycle;
    } else {
      baseCycle = getVallisCycle(now) as Cycle;
      apiData = worldState?.vallisCycle;
    }

    // Apply offset
    const offsetMs = offset * 1000;
    const currentExpiry = new Date(baseCycle.expiry).getTime();

    // Check if activation exists in baseCycle (it usually doesn't from localCycles) or apiData
    let currentActivation = baseCycle.activation ? new Date(baseCycle.activation).getTime() : 0;

    if (!currentActivation && apiData?.activation) {
      currentActivation = new Date(apiData.activation).getTime();
    }

    // If still no activation (e.g. no API data), calculate from expiry based on state duration
    if (!currentActivation) {
      let duration = 0;
      if (type === 'cetus') {
        duration = baseCycle.isDay ? 100 * 60 * 1000 : 50 * 60 * 1000;
      } else {
        // Vallis: Warm (6m 40s = 400s) / Cold (20m = 1200s)
        // baseCycle.state might be 'warm' or 'cold'
        duration = baseCycle.state === 'warm' ? 400 * 1000 : 1200 * 1000;
      }
      currentActivation = currentExpiry - duration;
    }

    const newExpiry = new Date(currentExpiry + offsetMs).toISOString();
    const newActivation = new Date(currentActivation + offsetMs).toISOString();

    // Merge with API metadata (like usePredictedCycles)
    return {
      ...apiData,
      ...baseCycle,
      expiry: newExpiry,
      activation: newActivation,
    } as Cycle; // Cast for simplicity
  };

  const renderControl = (
    title: string,
    location: 'cetus' | 'vallis',
    currentOffset: number,
    previewCycle: Cycle
  ) => {
    return (
      <div className="mb-8">
        <SectionTitle title={title} />
        <div className="flex flex-col gap-4">
          {/* Controls */}
          <div className="bg-surface-container-high rounded-3xl p-4 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <span className="font-bold text-on-surface">現在の補正値</span>
              <span className={`font-mono font-bold text-lg ${currentOffset === 0 ? 'text-on-surface-variant' : currentOffset > 0 ? 'text-primary' : 'text-error'}`}>
                {currentOffset > 0 ? '+' : ''}{currentOffset} 秒
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <span className="text-xs text-center text-on-surface-variant">残り時間を減らす</span>
                <div className="flex gap-2 justify-center">
                  <button onClick={() => updateCycleCalibration(location, currentOffset - 10)} className="px-3 py-2 bg-surface-container rounded-lg text-sm font-bold hover:bg-surface-container-highest transition-colors shadow-sm active:scale-95">-10s</button>
                  <button onClick={() => updateCycleCalibration(location, currentOffset - 1)} className="px-3 py-2 bg-surface-container rounded-lg text-sm font-bold hover:bg-surface-container-highest transition-colors shadow-sm active:scale-95">-1s</button>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-xs text-center text-on-surface-variant">残り時間を増やす</span>
                <div className="flex gap-2 justify-center">
                  <button onClick={() => updateCycleCalibration(location, currentOffset + 1)} className="px-3 py-2 bg-surface-container rounded-lg text-sm font-bold hover:bg-surface-container-highest transition-colors shadow-sm active:scale-95">+1s</button>
                  <button onClick={() => updateCycleCalibration(location, currentOffset + 10)} className="px-3 py-2 bg-surface-container rounded-lg text-sm font-bold hover:bg-surface-container-highest transition-colors shadow-sm active:scale-95">+10s</button>
                </div>
              </div>
            </div>

            <div className="text-xs text-on-surface-variant opacity-80 mt-2 bg-surface-container p-3 rounded-xl leading-relaxed">
              <p className="flex items-start gap-2">
                <span className="material-symbols-rounded text-sm mt-0.5">info</span>
                <span>アプリの表示がゲーム内より<strong>長い</strong>場合は「減らす」、<strong>短い</strong>場合は「増やす」を押してください。</span>
              </p>
            </div>
          </div>

          {/* Preview */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2 opacity-60">
              <span className="text-xs font-bold text-on-surface-variant ml-2">補正なし (標準)</span>
              <div>
                <CycleCard name="標準" cycle={calculateCycle(location, 0)} isPredicted={true} />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-primary ml-2">補正あり (現在)</span>
              <div className="ring-2 ring-primary rounded-3xl overflow-hidden">
                <CycleCard name="補正後" cycle={previewCycle} isPredicted={true} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="pb-24 pt-4">
      {/* Header */}
      <div className="mb-6 flex items-center gap-2 px-4">
        <button
          onClick={() => navigate('/settings')}
          className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-on-surface/10"
        >
          <span className="material-symbols-rounded">arrow_back</span>
        </button>
        <h1 className="text-2xl font-display font-medium">ワールドサイクル補正</h1>
      </div>

      <div className="px-4 mb-8 text-sm text-on-surface-variant opacity-90 leading-relaxed">
        ゲーム内のサイクル時間とアプリの表示がずれている場合、ここで手動補正を行うことができます。<br />
        エイドロンの草原とカンビオン荒地は共通の補正値が適用されます。
      </div>

      {renderControl(
        'エイドロン / カンビオン',
        'cetus',
        cycleCalibration.cetus,
        calculateCycle('cetus', cycleCalibration.cetus)
      )}

      {renderControl(
        'オーブ峡谷',
        'vallis',
        cycleCalibration.vallis,
        calculateCycle('vallis', cycleCalibration.vallis)
      )}

      {/* Reset Button */}
      <div className="px-4 mt-8">
        <button
          onClick={() => {
            if (window.confirm('すべての補正値を0に戻しますか？')) {
              updateCycleCalibration('cetus', 0);
              updateCycleCalibration('vallis', 0);
            }
          }}
          className="w-full py-3 rounded-xl border border-error text-error font-bold hover:bg-error-container/20 transition-colors active:scale-95"
        >
          補正値をリセット
        </button>
      </div>

    </div>
  );
};

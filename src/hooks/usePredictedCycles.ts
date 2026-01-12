import { useState, useEffect } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { getEffectiveCycle } from '../utils/cycleCalculator';
import type { WorldState, Cycle, ZarimanCycle, DuviriCycle } from '../types/warframe';

// サイクル計算用ヘルパー
const predictStandardCycle = (lastCycle: Cycle, now: number): Cycle | null => {
  const expiry = new Date(lastCycle.expiry).getTime();
  if (expiry > now) return null; // データが新しい場合は予測しない

  // 期間計算 (Duration)
  const activation = new Date(lastCycle.activation).getTime();
  const duration = expiry - activation;

  if (duration <= 0) return null; // 異常値ガード

  const elapsed = now - expiry;
  const cyclesPassed = Math.floor(elapsed / duration) + 1;

  // 新しい有効期限
  const newExpiryTime = expiry + (duration * cyclesPassed);
  const newActivationTime = newExpiryTime - duration;

  const newState = (cyclesPassed % 2 === 0) ? lastCycle.state : (lastCycle.state === 'day' ? 'night' : 'day');
  const isDay = newState === 'day';

  return {
    ...lastCycle,
    expiry: new Date(newExpiryTime).toISOString(),
    activation: new Date(newActivationTime).toISOString(),
    state: newState,
    isDay: isDay,
    timeLeft: '計算中...',
    shortString: `${newState === 'day' ? 'Day' : 'Night'} (予測)`
  };
};

const predictZarimanCycle = (lastCycle: ZarimanCycle, now: number): ZarimanCycle | null => {
  const expiry = new Date(lastCycle.expiry).getTime();
  if (expiry > now) return null;

  const activation = new Date(lastCycle.activation).getTime();
  let duration = expiry - activation;
  if (duration < 1000 * 60) duration = 2.5 * 60 * 60 * 1000; // Fallback 2.5h

  const elapsed = now - expiry;
  const cyclesPassed = Math.floor(elapsed / duration) + 1;

  const newExpiryTime = expiry + (duration * cyclesPassed);
  const newActivationTime = newExpiryTime - duration;

  const isEven = cyclesPassed % 2 === 0;
  const isCorpus = isEven ? lastCycle.isCorpus : !lastCycle.isCorpus;
  const state = isCorpus ? 'Corpus' : 'Grineer';

  return {
    ...lastCycle,
    expiry: new Date(newExpiryTime).toISOString(),
    activation: new Date(newActivationTime).toISOString(),
    isCorpus,
    state,
    shortString: `${state} (予測)`
  };
};

const DUVIRI_MOODS = ['joy', 'anger', 'envy', 'sorrow', 'fear']; // 順番重要

const predictDuviriCycle = (lastCycle: DuviriCycle, now: number): DuviriCycle | null => {
  const expiry = new Date(lastCycle.expiry).getTime();
  if (expiry > now) return null;

  const activation = new Date(lastCycle.activation).getTime();
  let duration = expiry - activation;
  if (duration < 1000 * 60) duration = 2 * 60 * 60 * 1000; // Fallback 2h

  const elapsed = now - expiry;
  const cyclesPassed = Math.floor(elapsed / duration) + 1;

  const newExpiryTime = expiry + (duration * cyclesPassed);
  const newActivationTime = newExpiryTime - duration;

  const currentMoodIndex = DUVIRI_MOODS.indexOf(lastCycle.state.toLowerCase());
  if (currentMoodIndex === -1) return null;

  const nextMoodIndex = (currentMoodIndex + cyclesPassed) % DUVIRI_MOODS.length;
  const nextMood = DUVIRI_MOODS[nextMoodIndex].charAt(0).toUpperCase() + DUVIRI_MOODS[nextMoodIndex].slice(1);

  return {
    ...lastCycle,
    expiry: new Date(newExpiryTime).toISOString(),
    activation: new Date(newActivationTime).toISOString(),
    state: nextMood,
    choices: lastCycle.choices
  };
};

export const usePredictedCycles = (worldState: WorldState | null | undefined) => {
  const [predictedState, setPredictedState] = useState<{
    earth: Cycle | null;
    cetus: Cycle | null;
    vallis: Cycle | null;
    cambion: Cycle | null;
    zariman: ZarimanCycle | null;
    duviri: DuviriCycle | null;
  }>({
    earth: null, cetus: null, vallis: null, cambion: null, zariman: null, duviri: null
  });

  const { cycleCalibration } = useSettings();

  useEffect(() => {
    if (!worldState) return;

    const updateCycles = () => {
      const now = Date.now();

      // Calibration Offsets (Seconds)
      const cetusOffset = cycleCalibration?.cetus || 0;
      const vallisOffset = cycleCalibration?.vallis || 0;

      // Use getEffectiveCycle for asymmetric cycles (Cetus, Vallis, Cambion)
      // This handles both expiry projection AND future-calibration rewinds
      const predictedCetus = getEffectiveCycle(worldState.cetusCycle, 'cetus', cetusOffset) || null;
      const predictedVallis = getEffectiveCycle(worldState.vallisCycle, 'vallis', vallisOffset) || null;
      // Cambion shares Cetus offset usually, or independent? 
      // User requested Cetus/Cambion logic in previous task, let's assume Cetus offset for Cambion as before
      const predictedCambion = getEffectiveCycle(worldState.cambionCycle, 'cambion', cetusOffset) || null;

      setPredictedState({
        earth: predictStandardCycle(worldState.earthCycle, now),
        cetus: predictedCetus,
        vallis: predictedVallis,
        cambion: predictedCambion,
        zariman: predictZarimanCycle(worldState.zarimanCycle, now),
        duviri: predictDuviriCycle(worldState.duviriCycle, now),
      });
    };

    updateCycles();
    const interval = setInterval(updateCycles, 1000);

    return () => clearInterval(interval);
  }, [worldState, cycleCalibration]);

  return predictedState;
};

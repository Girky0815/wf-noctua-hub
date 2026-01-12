import { useState, useEffect } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import type { WorldState, Cycle, ZarimanCycle, DuviriCycle } from '../types/warframe';
import { getCetusCycle, getVallisCycle, getCambionCycle, getEarthCycle } from '../utils/localCycles';

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

      // ローカル計算 (Local Calculation override)
      const localCetus = getCetusCycle(now);
      const localVallis = getVallisCycle(now);
      const localCambion = getCambionCycle(now);
      const localEarth = getEarthCycle(now);

      // Apply Calibration Offsets (in milliseconds)
      const cetusOffset = (cycleCalibration?.cetus || 0) * 1000;
      const vallisOffset = (cycleCalibration?.vallis || 0) * 1000;

      // Helper to apply offset to a cycle-like object
      const applyOffset = (cycle: Cycle, offset: number) => {
        if (offset === 0) return cycle;
        const newExpiry = new Date(new Date(cycle.expiry).getTime() + offset).toISOString();
        const newActivation = new Date(new Date(cycle.activation).getTime() + offset).toISOString();
        return { ...cycle, expiry: newExpiry, activation: newActivation };
      };

      const calibratedCetus = applyOffset(localCetus as Cycle, cetusOffset);
      const calibratedVallis = applyOffset(localVallis as Cycle, vallisOffset);
      const calibratedCambion = applyOffset(localCambion as Cycle, cetusOffset); // Share Cetus offset

      // マージ: APIデータのメタ情報(idなど)をベースに、ローカル計算結果(expiry, state)を上書き
      const mergedCetus: Cycle = {
        ...worldState.cetusCycle,
        ...calibratedCetus,
        activation: new Date(new Date(calibratedCetus.expiry!).getTime() - (calibratedCetus.isDay ? 100 * 60 * 1000 : 50 * 60 * 1000)).toISOString()
      } as Cycle;

      const mergedVallis: Cycle = {
        ...worldState.vallisCycle,
        ...calibratedVallis,
        activation: new Date(new Date(calibratedVallis.expiry!).getTime() - (calibratedVallis.state === 'warm' ? 400 * 1000 : 1200 * 1000)).toISOString()
      } as Cycle;

      const mergedCambion: Cycle = {
        ...worldState.cambionCycle,
        ...calibratedCambion,
        activation: new Date(new Date(calibratedCambion.expiry!).getTime() - (calibratedCambion.state === 'fass' ? 100 * 60 * 1000 : 50 * 60 * 1000)).toISOString()
      } as Cycle;




      setPredictedState({
        earth: predictStandardCycle(worldState.earthCycle, now),
        cetus: mergedCetus,
        vallis: mergedVallis,
        cambion: mergedCambion,
        // Zariman, Duviri は複雑なため既存の予測ロジック(期限切れ時のみ)を維持
        // 必要に応じてこれらもEpochベースに移行できるが、まずは主要3エリアを修正
        zariman: predictZarimanCycle(worldState.zarimanCycle, now),
        duviri: predictDuviriCycle(worldState.duviriCycle, now),
      });
    };

    updateCycles();
    const interval = setInterval(updateCycles, 1000);

    return () => clearInterval(interval);
  }, [worldState]);

  return predictedState;
};

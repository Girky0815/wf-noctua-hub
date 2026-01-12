import { useState, useEffect } from 'react';
import { useSettings } from '../contexts/SettingsContext';
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

// 非対称サイクル (Cetus: 100m/50m, Vallis: 6m40s/20m) 用の予測
const predictAsymmetricCycle = (lastCycle: Cycle | null, now: number, type: 'cetus' | 'vallis' | 'cambion'): Cycle | null => {
  if (!lastCycle) return null;

  let activation = new Date(lastCycle.activation).getTime();
  let expiry = new Date(lastCycle.expiry).getTime();
  let state = lastCycle.state;
  let isDay = lastCycle.isDay;

  // 既に未来のデータならそのまま返す
  if (expiry > now) {
    return lastCycle;
  }

  // 期限切れの場合、現在時刻を過ぎるまでシミュレート
  while (expiry <= now) {
    let nextDuration = 0;
    let nextState = '';
    let nextIsDay = false;

    if (type === 'cetus') {
      // Current Day(100) -> Next Night(50)
      // Current Night(50) -> Next Day(100)
      if (isDay) {
        // Was Day, becoming Night
        nextState = 'night';
        nextIsDay = false;
        nextDuration = 50 * 60 * 1000; // 50 min
      } else {
        // Was Night, becoming Day
        nextState = 'day';
        nextIsDay = true;
        nextDuration = 100 * 60 * 1000; // 100 min
      }
    } else if (type === 'cambion') {
      // Fass(100) -> Vome(50)
      if (state === 'fass') {
        nextState = 'vome';
        nextIsDay = false; // Vome is night-like
        nextDuration = 50 * 60 * 1000;
      } else {
        nextState = 'fass';
        nextIsDay = true; // Fass is day-like
        nextDuration = 100 * 60 * 1000;
      }
    } else if (type === 'vallis') {
      // Warm(6m40s=400s) -> Cold(20m=1200s)
      if (state === 'warm') {
        nextState = 'cold';
        nextDuration = 1200 * 1000; // 20 min
      } else {
        nextState = 'warm';
        nextDuration = 400 * 1000; // 6 min 40 sec
      }
      nextIsDay = false; // Vallis doesn't use isDay
    }

    activation = expiry;
    expiry = activation + nextDuration;
    state = nextState;
    isDay = nextIsDay;
  }

  return {
    ...lastCycle,
    activation: new Date(activation).toISOString(),
    expiry: new Date(expiry).toISOString(),
    state,
    isDay,
    timeLeft: '計算中...',
    shortString: (type === 'vallis' ? (state === 'warm' ? 'Warm' : 'Cold') :
      type === 'cambion' ? (state === 'fass' ? 'Fass' : 'Vome') :
        (state === 'day' ? 'Day' : 'Night')) + ' (予測)'
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

      // Calibration Offsets
      const cetusOffset = (cycleCalibration?.cetus || 0) * 1000;
      const vallisOffset = (cycleCalibration?.vallis || 0) * 1000;

      // Helper to apply offset
      const applyOffset = (cycle: Cycle | null, offset: number): Cycle | null => {
        if (!cycle) return null;
        if (offset === 0) return cycle;
        const newExpiry = new Date(new Date(cycle.expiry).getTime() + offset).toISOString();
        const newActivation = new Date(new Date(cycle.activation).getTime() + offset).toISOString();
        return { ...cycle, expiry: newExpiry, activation: newActivation };
      };

      // 1. Apply Manual Calibration to Base Data
      // 補正値を適用してから予測計算を行うことで、補正により期限切れとなった場合に即座に次のサイクルへ移行できるようにする
      const offsetCetusBase = applyOffset(worldState.cetusCycle, cetusOffset);
      const offsetVallisBase = applyOffset(worldState.vallisCycle, vallisOffset);
      const offsetCambionBase = applyOffset(worldState.cambionCycle, cetusOffset); // Share Cetus offset

      // 2. Predict based on Calibrated Data (State Machine)
      // predictAsymmetricCycle は渡されたサイクルの expiry を基準に計算するため、
      // 事前に補正済みのサイクルを渡せば、補正後の時刻に基づいて状態遷移判定が行われる
      const predictedCetus = predictAsymmetricCycle(offsetCetusBase, now, 'cetus');
      const predictedVallis = predictAsymmetricCycle(offsetVallisBase, now, 'vallis');
      const predictedCambion = predictAsymmetricCycle(offsetCambionBase, now, 'cambion');

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

import { useState, useEffect } from 'react';
import type { WorldState, Cycle, ZarimanCycle, DuviriCycle } from '../types/warframe';
import { getEffectiveCycle } from '../utils/cycleCalculator';

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
  // expiry + (duration * cyclesPassed)
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
    timeLeft: '計算中...', // UI側で別途計算されるのでここはダミーでも良いが、型合わせ
    shortString: `${newState === 'day' ? 'Day' : 'Night'} (予測)`
  };
};

const predictZarimanCycle = (lastCycle: ZarimanCycle, now: number): ZarimanCycle | null => {
  const expiry = new Date(lastCycle.expiry).getTime();
  if (expiry > now) return null;

  const activation = new Date(lastCycle.activation).getTime();
  let duration = expiry - activation;

  // durationが取得できない/異常な場合のフォールバック
  if (duration < 1000 * 60) duration = 2.5 * 60 * 60 * 1000; // Fallback 2.5h

  const elapsed = now - expiry;
  const cyclesPassed = Math.floor(elapsed / duration) + 1;

  const newExpiryTime = expiry + (duration * cyclesPassed);
  const newActivationTime = newExpiryTime - duration;

  // 占領勢力交代 (Corpus <-> Grineer)
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

  // ムード遷移
  const currentMoodIndex = DUVIRI_MOODS.indexOf(lastCycle.state.toLowerCase());
  if (currentMoodIndex === -1) return null; // 未知のムード

  const nextMoodIndex = (currentMoodIndex + cyclesPassed) % DUVIRI_MOODS.length;
  // 先頭大文字化
  const nextMood = DUVIRI_MOODS[nextMoodIndex].charAt(0).toUpperCase() + DUVIRI_MOODS[nextMoodIndex].slice(1);

  return {
    ...lastCycle,
    expiry: new Date(newExpiryTime).toISOString(),
    activation: new Date(newActivationTime).toISOString(),
    state: nextMood,
    choices: lastCycle.choices // 予測ではChoices(武器候補)は変えられないのでそのまま維持（API復旧待ち）
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

  useEffect(() => {
    if (!worldState) return;

    const updateCycles = () => {
      const now = Date.now();

      // Cetus/Vallis/Cambion: 期限切れの場合のみ getEffectiveCycle の結果を予測値として扱う
      const isCetusStale = new Date(worldState.cetusCycle.expiry).getTime() <= now;
      const isVallisStale = new Date(worldState.vallisCycle.expiry).getTime() <= now;
      const isCambionStale = new Date(worldState.cambionCycle.expiry).getTime() <= now;

      setPredictedState({
        earth: predictStandardCycle(worldState.earthCycle, now),
        cetus: isCetusStale ? (getEffectiveCycle(worldState.cetusCycle, 'cetus') || null) : null,
        vallis: isVallisStale ? (getEffectiveCycle(worldState.vallisCycle, 'vallis') || null) : null,
        cambion: isCambionStale ? (getEffectiveCycle(worldState.cambionCycle, 'cambion') || null) : null,
        zariman: predictZarimanCycle(worldState.zarimanCycle, now),
        duviri: predictDuviriCycle(worldState.duviriCycle, now),
      });
    };

    updateCycles();
    const interval = setInterval(updateCycles, 1000); // 毎秒チェックして更新即時反映

    return () => clearInterval(interval);
  }, [worldState]);

  return predictedState;
};

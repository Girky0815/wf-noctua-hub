import { useState, useEffect } from 'react';
import type { WorldState, Cycle, ZarimanCycle, DuviriCycle } from '../types/warframe';
import { getEffectiveCycle } from '../utils/cycleCalculator';

// サイクル計算用ヘルパー
const predictStandardCycle = (lastCycle: Cycle, now: number): Cycle => {
  const expiry = new Date(lastCycle.expiry).getTime();
  if (expiry > now) return lastCycle;

  // 期間計算 (Duration)
  const activation = new Date(lastCycle.activation).getTime();
  const duration = expiry - activation;

  if (duration <= 0) return lastCycle; // 異常値ガード

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

const predictZarimanCycle = (lastCycle: ZarimanCycle, now: number): ZarimanCycle => {
  const expiry = new Date(lastCycle.expiry).getTime();
  if (expiry > now) return lastCycle;

  const activation = new Date(lastCycle.activation).getTime();
  let duration = expiry - activation;

  // durationが取得できない/異常な場合のフォールバック (Zarimanは通常5時間周期? いやCorpus/Grineerは変動する可能性も。
  // ここでは単純に前回の期間を信用してトグルする)
  // Zariman doesn't swap factions purely on time?
  // Wiki: "The Zariman Ten Zero alternates between Grineer and Corpus control every 2.5 hours." -> Duration 2.5h?
  // Let's assume duration is reliable.
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

const predictDuviriCycle = (lastCycle: DuviriCycle, now: number): DuviriCycle => {
  const expiry = new Date(lastCycle.expiry).getTime();
  if (expiry > now) return lastCycle;

  const activation = new Date(lastCycle.activation).getTime();
  let duration = expiry - activation;
  if (duration < 1000 * 60) duration = 2 * 60 * 60 * 1000; // Fallback 2h

  const elapsed = now - expiry;
  const cyclesPassed = Math.floor(elapsed / duration) + 1;

  const newExpiryTime = expiry + (duration * cyclesPassed);
  const newActivationTime = newExpiryTime - duration;

  // ムード遷移
  const currentMoodIndex = DUVIRI_MOODS.indexOf(lastCycle.state.toLowerCase());
  if (currentMoodIndex === -1) return lastCycle; // 未知のムード

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

      setPredictedState({
        earth: predictStandardCycle(worldState.earthCycle, now),
        // Cetus/Vallis/Cambion も predictStandardCycle でいけるか？
        // Cetus: Day(100m) / Night(50m) -> 非対称なので predictStandardCycle (対称前提) は使えない。
        // Vallis: Warm(6m?) / Cold(20m?) -> 非対称。
        // Cambion: Fass/Vome (cycle?) It's usually symmetric or simpler? Fass/Vome 150m total? 
        // ユーザー要望は「地球森林、Zariman、Duviri」なので、まずはそこを重点対応。
        // Cetus/Vallis/Cambion は既存の getEffectiveCycle がある程度ハンドリングしているかもしれないが、
        // getEffectiveCycle はAPI生データ(Expiry)を見てるだけなら古いまま。
        // 今回はユーザー指定の3つを優先実装。他は一旦そのまま（あるいは同様に拡張）。

        cetus: getEffectiveCycle(worldState.cetusCycle, 'cetus'), // 既存ロジック維持
        vallis: getEffectiveCycle(worldState.vallisCycle, 'vallis'), // 既存ロジック維持
        cambion: getEffectiveCycle(worldState.cambionCycle, 'cambion'), // 既存ロジック維持

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

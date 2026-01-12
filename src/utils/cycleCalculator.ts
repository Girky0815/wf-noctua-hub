import type { Cycle } from '../types/warframe';

/**
 * サイクルタイプ定義
 * - cetus: エイドロンの草原 (昼100分/夜50分 = 150分)
 * - vallis: オーブ峡谷 (寒冷20分/温暖6分40秒 = 26分40秒)
 * - cambion: カンビオン荒地 (Fass 100分/Vome 50分 = 150分)
 */
type CycleType = 'cetus' | 'vallis' | 'cambion';

/**
 * APIデータの有効期限が切れている場合、経過時間から現在のサイクルを計算して返す
 * 有効期限内の場合は、元のデータをそのまま返す
 *
 * @param cycle APIから取得したサイクルデータ
 * @param type サイクルの種類
 * @returns 現在の有効なサイクルデータ
 */
export const getEffectiveCycle = (cycle: Cycle | undefined, type: CycleType, offsetSeconds: number = 0): Cycle | undefined => {
  if (!cycle || !cycle.expiry) return cycle;

  // Apply calibration offset
  // Offset is in seconds. Positive offset means Noctua Hub is "too fast" (expiry is too early), so we extend it.
  // Actually, wait.
  // If Noctua says "30s left" but Game says "60s left", Noctua is 30s ahead.
  // We want to make Noctua say "60s left".
  // Expiry is fixed timestamp from API.
  // timeSinceExpiry = now - expiry.
  // If we want "more time left", we need effective 'now' to be earlier, OR effective 'expiry' to be later.
  // Let's adjust Expiry.
  // adjustedExpiry = expiry + offset.
  // If offset = +30s. Expiry becomes 30s later.
  // timeSinceExpiry = now - (expiry + 30s) = (now - expiry) - 30s.
  // So 'remainder' becomes smaller?
  // Let's think about "Time Left".
  // Time Left = Expiry - Now.
  // New Time Left = (Expiry + Offset) - Now = (Expiry - Now) + Offset.
  // If Offset is +30s, Time Left increases by 30s. Correct.

  const now = Date.now();
  const expiryTime = new Date(cycle.expiry).getTime() + (offsetSeconds * 1000);

  // まだ有効期限内であれば、APIデータをそのまま信頼する
  if (expiryTime > now) {
    return cycle;
  }

  // 期限切れの場合、経過時間を計算
  const timeSinceExpiry = now - expiryTime;

  // 各サイクルの定義 (ミリ秒単位)
  let period1Duration: number; // 最初の状態の期間 (例: Day / Cold / Fass)
  let period2Duration: number; // 次の状態の期間 (例: Night / Warm / Vome)
  let totalDuration: number;

  switch (type) {
    case 'cetus':
      // Day: 100m, Night: 50m
      // APIの状態が isDay=true (Day) なら、次は Night
      period1Duration = 100 * 60 * 1000;
      period2Duration = 50 * 60 * 1000;
      break;
    case 'vallis':
      // Cold: 20m (1200s), Warm: 6m 40s (400s)
      // APIの状態が state='cold' なら、次は Warm
      period1Duration = 20 * 60 * 1000;
      period2Duration = 6 * 60 * 1000 + 40 * 1000; // 6m 40s
      break;
    case 'cambion':
      // Fass: 100m, Vome: 50m
      // APIの状態が state='fass' なら、次は Vome
      period1Duration = 100 * 60 * 1000;
      period2Duration = 50 * 60 * 1000;
      break;
  }

  totalDuration = period1Duration + period2Duration;

  // サイクル内の経過位置を計算
  const remainder = timeSinceExpiry % totalDuration;

  // 期限切れ時点での状態を判定
  let wasState1 = false; // State1 = Day / Cold / Fass

  if (type === 'cetus') {
    // Cetus: expiry は現在の状態の終了時刻
    // isDay=true だった場合、expirationでDay終了 -> Night開始
    // つまり、期限切れ直後は Night (State2) から始まる
    wasState1 = cycle.isDay;
  } else if (type === 'vallis') {
    wasState1 = cycle.state === 'cold';
  } else if (type === 'cambion') {
    wasState1 = cycle.state === 'fass';
  }

  // 現在の状態と次の期限を決定
  // Reminder:
  // if wasState1 (Day終了): 次は Night(State2) -> Day(State1) -> ...
  // if !wasState1 (Night終了): 次は Day(State1) -> Night(State2) -> ...

  let currentStateIsState1: boolean;
  let timeRemainingInCurrentState: number;

  if (wasState1) {
    // 期限切れ時点で State1 (Day/Cold/Fass) が終了した直後
    // シーケンス: [State2 (Night/Warm/Vome)] -> [State1 (Day/Cold/Fass)] -> ...

    if (remainder < period2Duration) {
      // まだ State2 (Night/Warm/Vome) の期間内
      currentStateIsState1 = false;
      timeRemainingInCurrentState = period2Duration - remainder;
    } else {
      // State2 が終わり、State1 (Day/Cold/Fass) に戻っている
      currentStateIsState1 = true;
      timeRemainingInCurrentState = totalDuration - remainder;
    }
  } else {
    // 期限切れ時点で State2 (Night/Warm/Vome) が終了した直後
    // シーケンス: [State1 (Day/Cold/Fass)] -> [State2 (Night/Warm/Vome)] -> ...

    if (remainder < period1Duration) {
      // まだ State1 の期間内
      currentStateIsState1 = true;
      timeRemainingInCurrentState = period1Duration - remainder;
    } else {
      // State1 が終わり、State2 に入っている
      currentStateIsState1 = false;
      timeRemainingInCurrentState = totalDuration - remainder;
    }
  }

  // 新しい Expiry を計算
  const newExpiryDate = new Date(now + timeRemainingInCurrentState);
  const newExpiryString = newExpiryDate.toISOString();

  // 新しい Cycle オブジェクトを構築
  const newCycle: Cycle = {
    ...cycle,
    expiry: newExpiryString,
    timeLeft: 'Calculated', // 表示には使われないが念のため
  };

  // 状態文字列の設定
  if (type === 'cetus') {
    newCycle.isDay = currentStateIsState1;
    newCycle.state = currentStateIsState1 ? 'day' : 'night';
  } else if (type === 'vallis') {
    // Vallis: State1=Cold, State2=Warm
    newCycle.state = currentStateIsState1 ? 'cold' : 'warm';
    newCycle.isDay = false; // Vallis has no 'isDay' concept usually, but keep consistency
  } else if (type === 'cambion') {
    // Cambion: State1=Fass, State2=Vome
    newCycle.state = currentStateIsState1 ? 'fass' : 'vome';
    newCycle.isDay = currentStateIsState1; // Fass is treated like "Day" in UI logic often
  }

  return newCycle;
};

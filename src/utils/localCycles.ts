import type { Cycle } from '../types/warframe';

export interface CycleDefinition {
  epoch: number; // 既知の基準タイムスタンプ (ms)
  totalDuration: number; // サイクル全体の期間 (ms)
}

// 既知の Epoch (Calibration based on User Report 2026-01-06 18:00:00 JST)
// Corrected to be in the past to avoid negative modulo issues.
// Update 2026-01-06 18:20: Adjusted +1s to match official app precision.

// Cetus: Night ends (Day starts) at 18:44:33 next.
// Day duration = 100m.
// So current Day started at 18:44:33 - 100m = 17:04:33.
// 17:04:33 JST = 1767686673000.
// calibration +1s -> 1767686674000
const CETUS_EPOCH = 1767686674000;
const CETUS_CYCLE_MS = 150 * 60 * 1000; // 150 minutes

// Orb Vallis: Cold ends (Warm starts) at 18:06:40.
// So next Warm cycle starts at 18:06:40.
// We need an epoch in the past. 18:06:40 - 26m40s (1600s) = 17:40:00.
// 18:06:40 JST = 1767690400000.
// 1767690400000 - 1600000 = 1767688800000
// calibration +1s -> 1767688801000
// calibration +1s -> 1767688801000
const VALLIS_EPOCH = 1767688801000;
const VALLIS_CYCLE_MS = 1600 * 1000; // 26m 40s (6m40s Warm + 20m Cold)

// Cambion Drift: Synchronized with Cetus (Fass = Day, Vome = Night)
const CAMBION_EPOCH = CETUS_EPOCH;
const CAMBION_CYCLE_MS = 150 * 60 * 1000; // 150 minutes

const EARTH_EPOCH = 1516200600000; // Aligning with Cetus usually works for strict 4h epochs?
// Earth day/night is 4 hours Day, 4 hours Night = 8 hours total?
// No, it's 4h day, 4h night. Total 8h?
// Actually, standard Earth cycle is 4 hours day and 4 hours night.
const EARTH_CYCLE_MS = 8 * 60 * 60 * 1000; // 8 hours

/**
 * 現在時刻に基づいてサイクルを計算する
 */

// Cetus: Day 100m -> Night 50m
export const getCetusCycle = (now: number): Partial<Cycle> => {
  const elapsed = now - CETUS_EPOCH;
  const cycleTime = elapsed % CETUS_CYCLE_MS;

  // Day: 0 - 100m (6,000,000ms)
  // Night: 100m - 150m (9,000,000ms)
  const dayDuration = 100 * 60 * 1000;

  const isDay = cycleTime < dayDuration;
  const timeLeft = isDay ? (dayDuration - cycleTime) : (CETUS_CYCLE_MS - cycleTime);

  // 次の状態への切り替わり時刻 (expiry)
  const expiryTime = now + timeLeft;
  const activationTime = expiryTime - (isDay ? dayDuration : (CETUS_CYCLE_MS - dayDuration));

  return {
    id: `cetus-local-${expiryTime}`,
    activation: new Date(activationTime).toISOString(),
    expiry: new Date(expiryTime).toISOString(),
    isDay,
    state: isDay ? 'day' : 'night',
    timeLeft: new Date(timeLeft).toISOString().substr(11, 8), //簡易フォーマット
    shortString: isDay ? 'Day' : 'Night'
  };
};

// Orb Vallis: Warm 6m 40s -> Cold 20m
// Note: Vallis cycle starts with... actually need to verify alignment.
// According to reliable sources (warframestat.us logic):
// Epoch aligns with Cold start? Or Warm start?
// Usually: Warm (400s) -> Cold (1200s).
// Let's assume Epoch starts at 0 of the cycle.
// Need to calibrate API data if possible or trust known epochs.
// For now, implementing standard logic:
// Cycle starts with Warm (6m 40s) then Cold (20m).
export const getVallisCycle = (now: number): Partial<Cycle> => {
  const elapsed = now - VALLIS_EPOCH;
  const cycleTime = elapsed % VALLIS_CYCLE_MS;

  const warmDuration = 400 * 1000; // 6m 40s

  const isWarm = cycleTime < warmDuration;
  const timeLeft = isWarm ? (warmDuration - cycleTime) : (VALLIS_CYCLE_MS - cycleTime);
  const expiryTime = now + timeLeft;
  const activationTime = expiryTime - (isWarm ? warmDuration : (VALLIS_CYCLE_MS - warmDuration));

  return {
    id: `vallis-local-${expiryTime}`,
    activation: new Date(activationTime).toISOString(),
    expiry: new Date(expiryTime).toISOString(),
    isDay: false, // Not applicable really
    state: isWarm ? 'warm' : 'cold', // 'warm' or 'cold'
    timeLeft: new Date(timeLeft).toISOString().substr(11, 8),
    shortString: isWarm ? 'Warm' : 'Cold'
  };
};

// Cambion Drift: Fass (100m) -> Vome (50m)
// Fass is "Day" equivalent (active), Vome is "Night" equivalent (calm)
export const getCambionCycle = (now: number): Partial<Cycle> => {
  const elapsed = now - CAMBION_EPOCH;
  const cycleTime = elapsed % CAMBION_CYCLE_MS;

  const fassDuration = 100 * 60 * 1000;

  const isFass = cycleTime < fassDuration;
  const timeLeft = isFass ? (fassDuration - cycleTime) : (CAMBION_CYCLE_MS - cycleTime);
  const expiryTime = now + timeLeft;
  const activationTime = expiryTime - (isFass ? fassDuration : (CAMBION_CYCLE_MS - fassDuration));

  return {
    id: `cambion-local-${expiryTime}`,
    activation: new Date(activationTime).toISOString(),
    expiry: new Date(expiryTime).toISOString(),
    // Cambion API uses active: 'fass' | 'vome'
    state: isFass ? 'fass' : 'vome',
    isDay: isFass,
    timeLeft: new Date(timeLeft).toISOString().substr(11, 8),
    shortString: isFass ? 'Fass' : 'Vome'
  };
};

// Earth: Day 4h -> Night 4h
export const getEarthCycle = (now: number): Partial<Cycle> => {
  const elapsed = now - EARTH_EPOCH;
  const cycleTime = elapsed % EARTH_CYCLE_MS;

  const dayDuration = 4 * 60 * 60 * 1000;

  const isDay = cycleTime < dayDuration;
  const timeLeft = isDay ? (dayDuration - cycleTime) : (EARTH_CYCLE_MS - cycleTime);
  const expiryTime = now + timeLeft;
  const activationTime = expiryTime - dayDuration;

  return {
    id: `earth-local-${expiryTime}`,
    activation: new Date(activationTime).toISOString(),
    expiry: new Date(expiryTime).toISOString(),
    isDay,
    state: isDay ? 'day' : 'night',
    timeLeft: new Date(timeLeft).toISOString().substr(11, 8),
    shortString: isDay ? 'Day' : 'Night'
  };
};

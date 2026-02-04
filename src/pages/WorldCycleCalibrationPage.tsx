import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../contexts/SettingsContext';
import { DEFAULT_CYCLE_CALIBRATION } from '../utils/constants';
import { useWarframeData } from '../hooks/useWarframeData';
import { SectionTitle } from '../components/ui/SectionTitle';
import { CycleCard } from '../components/status/CycleCard';
import { getCetusCycle, getVallisCycle } from '../utils/localCycles';
import type { Cycle } from '../types/warframe';

export const WorldCycleCalibrationPage: React.FC = () => {
  const navigate = useNavigate();
  const { cycleCalibration, updateCycleCalibration } = useSettings();
  const { worldState } = useWarframeData();
  const [now, setNow] = useState(() => Date.now());

  // 自動更新: 1秒ごとに現在時刻(now)を更新し、プレビュー表示を再計算させる
  // これにより、補正後の時間が「終了」を迎えた瞬間に自動で表示が切り替わる
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  /**
   * APIから取得した（あるいはローカル計算した）サイクル情報を元に、
   * 指定時間が経過した後のサイクル状態を予測するヘルパー関数
   * (usePredictedCyclesと同じロジックを使用)
   */
  const predictAsymmetricCycle = (lastCycle: Cycle | null, currentTime: number, type: 'cetus' | 'vallis'): Cycle => {
    if (!lastCycle) {
      throw new Error("Cycle required");
    }

    let activation = new Date(lastCycle.activation).getTime();
    let expiry = new Date(lastCycle.expiry).getTime();
    let state = lastCycle.state;
    let isDay = lastCycle.isDay;

    // 1. 未来(activation > now)にある場合、過去に巻き戻す (補正で開始時間が未来になった場合など)
    if (activation > currentTime) {
      while (activation > currentTime) {
        let prevDuration = 0;
        let prevState = '';
        let prevIsDay = false;

        if (type === 'cetus') {
          if (isDay) {
            // Day -> Prev is Night (50m)
            prevState = 'night';
            prevIsDay = false;
            prevDuration = 50 * 60 * 1000;
          } else {
            // Night -> Prev is Day (100m)
            prevState = 'day';
            prevIsDay = true;
            prevDuration = 100 * 60 * 1000;
          }
        } else { // vallis
          if (state === 'warm') {
            // Warm -> Prev is Cold (20m)
            prevState = 'cold';
            prevDuration = 1200 * 1000; // 20 min
          } else {
            // Cold -> Prev is Warm (6m40s)
            prevState = 'warm';
            prevDuration = 400 * 1000; // 6 min 40 sec
          }
          prevIsDay = false;
        }

        expiry = activation;
        activation = expiry - prevDuration;
        state = prevState;
        isDay = prevIsDay;
      }
    }

    // 2. 過去(expiry <= now)にある場合、未来に進める
    if (expiry <= currentTime) {
      while (expiry <= currentTime) {
        let nextDuration = 0;
        let nextState = '';
        let nextIsDay = false;

        if (type === 'cetus') {
          if (isDay) {
            nextState = 'night';
            nextIsDay = false;
            nextDuration = 50 * 60 * 1000;
          } else {
            nextState = 'day';
            nextIsDay = true;
            nextDuration = 100 * 60 * 1000;
          }
        } else { // vallis
          if (state === 'warm') {
            nextState = 'cold';
            nextDuration = 1200 * 1000;
          } else {
            nextState = 'warm';
            nextDuration = 400 * 1000;
          }
          nextIsDay = false;
        }
        activation = expiry;
        expiry = activation + nextDuration;
        state = nextState;
        isDay = nextIsDay;
      }
    }

    return {
      ...lastCycle,
      activation: new Date(activation).toISOString(),
      expiry: new Date(expiry).toISOString(),
      state,
      isDay
    };
  };

  /**
   * 補正値(offset)を適用したサイクル状態を計算する
   * 1. 基準となるデータ(API or ローカル)を取得
   * 2. 基準データの時刻(activation/expiry)に補正値(秒)を加算
   * 3. 加算後の時刻を元に、現在時刻(now)時点での正しい状態(昼/夜など)を再予測
   */
  const calculateCycle = (type: 'cetus' | 'vallis', offset: number) => {
    // 1. ベースとなるAPIデータを取得
    const apiData = type === 'cetus' ? worldState?.cetusCycle : worldState?.vallisCycle;

    // APIデータがない場合（リロード直後やエラー時）は、ローカル計算でフォールバックしてクラッシュを防ぐ
    const baseData = apiData || (type === 'cetus' ? getCetusCycle(now) : getVallisCycle(now)) as Cycle;

    // 2. 補正値を先に適用 ("有効な"タイムラインを作成する)
    const offsetMs = offset * 1000;

    // 補正値を加えた一時的なサイクルデータを作成
    // これにより、例えば「本当はもう夜になっているはず」という時間をシミュレートできる
    const offsetActivation = new Date(new Date(baseData.activation).getTime() + offsetMs).toISOString();
    const offsetExpiry = new Date(new Date(baseData.expiry).getTime() + offsetMs).toISOString();

    const offsetBaseData = {
      ...baseData,
      activation: offsetActivation,
      expiry: offsetExpiry
    };

    // 3. 補正後のタイムライン上で、現在時刻(now)における状態を予測する
    return predictAsymmetricCycle(offsetBaseData, now, type);
  };

  const renderControl = (
    title: string,
    location: 'cetus' | 'vallis',
    currentOffset: number,
    previewCycle: Cycle
  ) => {
    const defaultOffset = DEFAULT_CYCLE_CALIBRATION[location];

    return (
      <div className="mb-8">
        <SectionTitle title={title} />
        <div className="flex flex-col gap-4">
          {/* Controls */}
          <div className="bg-surface-container-high rounded-3xl p-4 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <span className="font-bold text-on-surface">現在の補正値</span>
              <div className="flex items-center gap-3">
                <span className={`font-mono font-bold text-lg ${currentOffset === 0 ? 'text-on-surface-variant' : currentOffset > 0 ? 'text-primary' : 'text-error'}`}>
                  {currentOffset > 0 ? '+' : ''}{currentOffset} 秒
                </span>
                {currentOffset === defaultOffset ? (
                  <span className="text-xs px-2 py-1 rounded-md bg-surface-container text-on-surface-variant font-medium">標準</span>
                ) : (
                  <button
                    onClick={() => updateCycleCalibration(location, defaultOffset)}
                    className="text-xs px-2 py-1 rounded-md bg-surface-container-highest text-on-surface hover:bg-surface-variant transition-colors"
                  >
                    リセット
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <span className="text-xs text-center text-on-surface-variant">残り時間を減らす</span>
                <div className="flex gap-2 justify-center flex-wrap">
                  <button onClick={() => updateCycleCalibration(location, currentOffset - 60)} className="px-3 py-2 bg-surface-container rounded-lg text-sm font-bold hover:bg-surface-container-highest transition-colors shadow-sm active:scale-95">-60s</button>
                  <button onClick={() => updateCycleCalibration(location, currentOffset - 10)} className="px-3 py-2 bg-surface-container rounded-lg text-sm font-bold hover:bg-surface-container-highest transition-colors shadow-sm active:scale-95">-10s</button>
                  <button onClick={() => updateCycleCalibration(location, currentOffset - 1)} className="px-3 py-2 bg-surface-container rounded-lg text-sm font-bold hover:bg-surface-container-highest transition-colors shadow-sm active:scale-95">-1s</button>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-xs text-center text-on-surface-variant">残り時間を増やす</span>
                <div className="flex gap-2 justify-center flex-wrap">
                  <button onClick={() => updateCycleCalibration(location, currentOffset + 1)} className="px-3 py-2 bg-surface-container rounded-lg text-sm font-bold hover:bg-surface-container-highest transition-colors shadow-sm active:scale-95">+1s</button>
                  <button onClick={() => updateCycleCalibration(location, currentOffset + 10)} className="px-3 py-2 bg-surface-container rounded-lg text-sm font-bold hover:bg-surface-container-highest transition-colors shadow-sm active:scale-95">+10s</button>
                  <button onClick={() => updateCycleCalibration(location, currentOffset + 60)} className="px-3 py-2 bg-surface-container rounded-lg text-sm font-bold hover:bg-surface-container-highest transition-colors shadow-sm active:scale-95">+60s</button>
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
        エイドロンの草原とカンビオン荒地は共通の補正値が適用されます。<br />
        初期値ではおすすめの値がセットされています。通信環境などによってはずれることもありますので、必要に応じて調整してください。
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
            if (window.confirm('すべての補正値を初期値（標準）に戻しますか？')) {
              updateCycleCalibration('cetus', DEFAULT_CYCLE_CALIBRATION.cetus);
              updateCycleCalibration('vallis', DEFAULT_CYCLE_CALIBRATION.vallis);
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

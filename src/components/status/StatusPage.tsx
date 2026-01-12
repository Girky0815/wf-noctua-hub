import React from 'react';
import { useWarframeData } from '../../hooks/useWarframeData';
import { useSettings } from '../../contexts/SettingsContext';
import { CycleCard } from './CycleCard';
import { ZarimanCycleCard } from './ZarimanCycleCard';
import { DuviriCycleCard } from './DuviriCycleCard';
import { AlertList } from './AlertList';
import { InvasionList } from './InvasionList';
import { SortieCard } from './SortieCard';
import { VoidTraderCard } from './VoidTraderCard';
import { ResurgenceCard } from './ResurgenceCard';
import { ArchimedeaCard } from './ArchimedeaCard';
import { useCountdown } from '../../hooks/useCountdown';
import { getEffectiveCycle } from '../../utils/cycleCalculator';
import { SectionTitle } from '../ui/SectionTitle';
import { StaleDataWarning } from '../ui/StaleDataWarning';
import { usePredictedCycles } from '../../hooks/usePredictedCycles';

// バッジコンポーネント (アルコン名などを表示)
const StatusBadge: React.FC<{
  label: string;
  subLabel?: string;
  variant?: 'secondary' | 'error';
}> = ({ label, subLabel, variant = 'secondary' }) => {
  const containerClass = variant === 'error'
    ? 'bg-error-container text-on-error-container'
    : 'bg-secondary-container text-on-secondary-container';

  return (
    <div className={`flex items-center gap-2 rounded-full px-3 py-0.5 text-xs font-bold ${containerClass}`}>
      <span>{label}</span>
      {subLabel && <span className="opacity-70 font-display">{subLabel}</span>}
    </div>
  );
};

// リサージェンスのカウントダウンバッジ
const ResurgenceTimerBadge: React.FC<{ expiry: string }> = ({ expiry }) => {
  const timeLeft = useCountdown(expiry);

  // useMemo removed to allow recalculation on re-renders (triggered by useCountdown)
  // as Date.now() changes.
  const isUrgent = (() => {
    if (!expiry) return false;
    // eslint-disable-next-line react-hooks/purity
    const diff = new Date(expiry).getTime() - Date.now();
    return diff > 0 && diff < 24 * 60 * 60 * 1000;
  })();

  return <StatusBadge label={`あと ${timeLeft}`} variant={isUrgent ? 'error' : 'secondary'} />;
};

export const StatusPage: React.FC = () => {
  const { worldState, isLoading, isError } = useWarframeData();
  const { dashboardConfig } = useSettings();

  // サイクル予測フックの使用
  const predicted = usePredictedCycles(worldState);

  if (isError) {
    // Determine error type
    const status = isError.status;

    if (status) {
      // API Error (404, 502, etc.)
      return (
        <div className="flex h-full items-center justify-center p-8">
          <div className="flex items-start gap-3 rounded-2xl bg-error-container p-6 text-on-error-container max-w-2xl w-full">
            <span className="material-symbols-rounded mt-1 text-2xl">dns</span>
            <div className="flex flex-col">
              <span className="font-bold text-xl mb-2">API がダウンしています! ({status})</span>
              <span className="opacity-90 leading-relaxed">
                Warframe Status API がエラーを返しました。<br />
                現在サーバーがダウンしているか、メンテナンス中の可能性があります。<br />
                <br />
                <strong>対応策:</strong>
                <ul className="list-disc list-inside ml-2 mt-1">
                  <li>しばらく時間を置いてからページを再読み込みしてください</li>
                  <li>APIのサーバーステータスを確認してください</li>
                </ul>
              </span>
            </div>
          </div>
        </div>
      );
    } else {
      // Network Error (No Internet, DNS failure, etc.)
      return (
        <div className="flex h-full items-center justify-center p-8">
          <div className="flex items-start gap-3 rounded-2xl bg-surface-container-highest p-6 text-on-surface max-w-2xl w-full border border-outline/20">
            <span className="material-symbols-rounded mt-1 text-2xl">wifi_off</span>
            <div className="flex flex-col">
              <span className="font-bold text-xl mb-2">通信エラー</span>
              <span className="opacity-90 leading-relaxed">
                API サーバーに接続できませんでした。<br />
                インターネット接続を確認してください。<br />
                <br />
                <strong>確認事項:</strong>
                <ul className="list-disc list-inside ml-2 mt-1">
                  <li>Wi-Fi やモバイルデータ通信が有効になっているか</li>
                  <li>機内モードになっていないか</li>
                </ul>
              </span>
            </div>
          </div>
        </div>
      );
    }
  }

  if (isLoading || !worldState) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-surface-variant border-t-primary"></div>
      </div>
    );
  }

  // ソーティ/アルコン/アルキメデア情報の準備
  const sortie = worldState.sorties?.[0] || worldState.sortie;
  const archonHunt = worldState.archonHunt;
  const archimedeas = worldState.archimedeas;

  // ウィジェットのレンダリング関数
  const renderWidget = (id: string) => {
    switch (id) {
      case 'cycles':
        return (
          <div key={id}>
            <SectionTitle title="ワールドサイクル" />
            <div className="grid grid-cols-2 gap-4">
              {/* 予測されたサイクルを使用 */}
              <CycleCard name="地球 (森林)" cycle={predicted.earth || worldState.earthCycle} isPredicted={!!predicted.earth} />
              <CycleCard name="エイドロンの草原" cycle={predicted.cetus || getEffectiveCycle(worldState.cetusCycle, 'cetus')} isPredicted={!!predicted.cetus} />
              <CycleCard name="オーブ峡谷" cycle={predicted.vallis || getEffectiveCycle(worldState.vallisCycle, 'vallis')} isPredicted={!!predicted.vallis} />
              <CycleCard name="カンビオン荒地" cycle={predicted.cambion || getEffectiveCycle(worldState.cambionCycle, 'cambion')} isPredicted={!!predicted.cambion} />
              <DuviriCycleCard cycle={predicted.duviri || worldState.duviriCycle} isPredicted={!!predicted.duviri} />
              <ZarimanCycleCard cycle={predicted.zariman || worldState.zarimanCycle} isPredicted={!!predicted.zariman} />
            </div>
          </div>
        );
      case 'alerts':
        return (
          <div key={id}>
            <SectionTitle title="アラート" />
            <div>
              <AlertList alerts={worldState.alerts.filter(a => !a.expired && new Date(a.expiry).getTime() > Date.now())} />
            </div>
          </div>
        );
      case 'invasions':
        return (
          <div key={id}>
            <SectionTitle title="侵略ミッション" />
            <div>
              <InvasionList invasions={worldState.invasions} />
            </div>
          </div>
        );
      case 'sortie':
        return sortie ? (
          <div key={id}>
            <SectionTitle
              title="今日のソーティ"
              trailing={<StatusBadge label={sortie.boss} subLabel={sortie.eta} />}
            />
            <div>
              <SortieCard sortie={sortie} />
            </div>
          </div>
        ) : null;
      case 'archonHunt':
        return archonHunt ? (
          <div key={id}>
            <SectionTitle
              title="アルコン討伐戦"
              trailing={
                <StatusBadge
                  label={archonHunt.boss.replace('Archon ', '')}
                  subLabel={archonHunt.eta}
                />
              }
            />
            <div>
              <SortieCard sortie={archonHunt} />
            </div>
          </div>
        ) : null;
      case 'archimedea':
        return archimedeas && archimedeas.length > 0 ? (
          <div key={id}>
            {archimedeas.map(a => (
              <div key={a.id} className="mb-6">
                {/* ArchimedeaCard internally handles title/header because of the switch. 
                     However, if we want consistency, we might want a SectionTitle here.
                     But ArchimedeaCard has a title inside.
                     Let's leave it as is, or separate Title? 
                     Archimedea is split into Deep and Dimensional.
                     Each Archimedea object is one entry.
                     ArchimedeaCard renders a list group.
                     It seems fine to just render the card.
                 */}
                <ArchimedeaCard archimedea={a} />
              </div>
            ))}
          </div>
        ) : null;
      case 'resurgence':
        return worldState.vaultTrader ? (
          <div key={id}>
            <SectionTitle
              title="Prime Resurgence"
              trailing={<ResurgenceTimerBadge expiry={worldState.vaultTrader.expiry} />}
            />
            <div>
              <ResurgenceCard trader={worldState.vaultTrader} />
            </div>
          </div>
        ) : null;
      case 'voidTrader':
        return worldState.voidTrader ? (
          <div key={id}>
            <SectionTitle title="Baro Ki'Teer" />
            <div>
              <VoidTraderCard voidTrader={worldState.voidTrader} />
            </div>
          </div>
        ) : null;
      default:
        return null;
    }
  };

  // 表示設定に基づいてソート・フィルタリング
  const activeWidgets = dashboardConfig
    .filter(widget => widget.visible)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="grid gap-6 pb-20 pt-4">
      {/* 警告: データが古い場合 (Component化) */}
      <StaleDataWarning timestamp={worldState.timestamp} />

      {/* 動的レンダリング */}
      {activeWidgets.map(widget => renderWidget(widget.id))}
    </div>
  );
};

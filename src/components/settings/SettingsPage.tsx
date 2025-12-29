import React from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import { ThemeSelector } from '../ThemeSelector';

export const SettingsPage: React.FC = () => {
  const { resetSettings } = useSettings();

  const handleReset = () => {
    if (window.confirm('すべての設定をリセットして初期状態に戻しますか？')) {
      resetSettings();
      window.location.reload();
    }
  };

  return (
    <div className="flex flex-col gap-4 pb-20">
      {/* テーマ設定 */}
      <section className="rounded-3xl bg-surface-bright p-5">
        <h3 className="mb-4 text-lg font-bold text-on-surface font-display">
          外観
        </h3>
        <ThemeSelector />
      </section>

      {/* アプリ情報 */}
      <section className="rounded-3xl bg-surface-bright p-5">
        <h3 className="mb-4 text-lg font-bold text-on-surface font-display">
          アプリについて
        </h3>
        <div className="space-y-3 text-sm text-on-surface-variant">
          <div className="flex justify-between">
            <span>バージョン</span>
            <span className="font-display">v0.1.0 (Alpha)</span>
          </div>
          <div className="flex justify-between">
            <span>開発</span>
            <span>Gemini 3 Pro + Antigravity</span>
          </div>
          <p className="mt-4 pt-4 border-t border-outline-variant text-xs leading-relaxed">
            Noctua Hub は Warframe の非公式ファンメイドアプリです。
            Digital Extremes Ltd. とは提携していません。
            ゲーム内のデータは Warframe の利用規約に従って使用されています。
          </p>
        </div>
      </section>

      {/* データ管理 */}
      <section className="rounded-3xl bg-surface-bright p-5">
        <h3 className="mb-4 text-lg font-bold text-on-surface font-display">
          データ管理
        </h3>
        <button
          onClick={handleReset}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-error-container p-4 text-on-error-container transition-colors hover:bg-opacity-80 active:bg-opacity-60"
        >
          <span className="material-symbols-rounded">delete_forever</span>
          <span className="font-bold">設定をリセット</span>
        </button>
        <p className="mt-2 text-center text-xs text-on-surface-variant">
          ※ オンボーディング（初回ガイド）も再表示されます
        </p>
      </section>
    </div>
  );
};

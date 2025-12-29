import React, { useState } from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import { ThemeSelector } from '../ThemeSelector';
import { SettingsSection, SettingsGroup, SettingsTile } from './SettingsCommon';

export const SettingsPage: React.FC = () => {
  const { resetSettings } = useSettings();
  const [showCredits, setShowCredits] = useState(false);

  const handleReset = () => {
    if (window.confirm('すべての設定をリセットして初期状態に戻しますか？')) {
      resetSettings();
      window.location.reload();
    }
  };

  return (
    <div className="flex flex-col pb-24 pt-4">
      {/* 外観 */}
      <SettingsSection title="外観">
        <SettingsGroup>
          <SettingsTile
            icon="palette"
            title="テーマ"
            subtitle="アプリの配色を変更します"
            trailing={<ThemeSelector />}
          />
        </SettingsGroup>
      </SettingsSection>

      {/* 概要 */}
      <SettingsSection title="概要">
        <SettingsGroup>
          <SettingsTile
            icon="info"
            title="Noctua Hub"
            subtitle="v0.1.0 (Alpha)"
            onClick={() => {/* 将来的に詳細画面へ */ }}
          />
          <SettingsTile
            icon="description"
            title="クレジット & ライセンス"
            subtitle="利用しているオープンソースライブラリなど"
            trailing={<span className="material-symbols-rounded text-on-surface-variant">chevron_right</span>}
            onClick={() => setShowCredits(!showCredits)}
          />
        </SettingsGroup>
      </SettingsSection>

      {/* クレジット詳細表示エリア (簡易的展開) */}
      {showCredits && (
        <div className="mb-6 animate-fade-in px-4">
          <div className="rounded-3xl bg-surface-container-high p-5 text-sm">
            <div className="space-y-4">
              <div>
                <div className="mb-1 text-xs font-bold text-primary">Data Source</div>
                <ul className="pl-2 text-on-surface-variant">
                  <li><a href="https://warframestat.us/" target="_blank" rel="noreferrer" className="underline decoration-dotted">Warframe Status API</a></li>
                </ul>
              </div>
              <div>
                <div className="mb-1 text-xs font-bold text-primary">Libraries</div>
                <div className="text-on-surface-variant">React, Vite, Tailwind CSS, SWR, React Router</div>
              </div>
              <div>
                <div className="mb-1 text-xs font-bold text-primary">Fonts</div>
                <ul className="space-y-1 pl-2 text-on-surface-variant text-xs">
                  <li>GenJyuuGothicX (SIL OFL 1.1)</li>
                  <li>Google Sans Flex (Google)</li>
                  <li>Noto Sans JP (Google)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* データ管理 */}
      <SettingsSection title="データ管理">
        <SettingsGroup>
          <SettingsTile
            icon="delete_forever"
            title="設定をリセット"
            subtitle="テーマ設定や初回完了状態を初期化します"
            destructive
            onClick={handleReset}
          />
        </SettingsGroup>
      </SettingsSection>

      <div className="px-4 text-center text-xs text-on-surface-variant opacity-60">
        <p>Noctua Hub is a fan-made app.</p>
        <p>Not affiliated with Digital Extremes Ltd.</p>
      </div>
    </div>
  );
};

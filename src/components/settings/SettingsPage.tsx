import React, { useState } from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import { ThemeSelector } from '../ThemeSelector';
import { useWarframeData } from '../../hooks/useWarframeData';
import { SettingsSection, SettingsGroup, SettingsTile } from './SettingsCommon';

export const SettingsPage: React.FC = () => {
  const { resetSettings } = useSettings();
  const [showCredits, setShowCredits] = useState(false);
  const [showRawData, setShowRawData] = useState(false);
  const { worldState, isLoading, isError } = useWarframeData();

  const handleReset = () => {
    if (window.confirm('すべての設定をリセットして初期状態に戻しますか？')) {
      resetSettings();
      window.location.reload();
    }
  };

  // APIステータスの判定
  const apiStatus = isError ? 'エラー' : isLoading && !worldState ? '読み込み中...' : '正常';
  const apiTimestamp = worldState?.timestamp ? new Date(worldState.timestamp).toLocaleString() : '-';
  const timeDiff = worldState?.timestamp
    ? Math.floor((Date.now() - new Date(worldState.timestamp).getTime()) / 60000)
    : 0; // 分単位の差分

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

      {/* API情報 */}
      <SettingsSection title="API情報">
        <SettingsGroup>
          <SettingsTile
            icon="api"
            title="ステータス"
            subtitle={apiStatus}
            trailing={
              <span className={`text-xs font-bold px-2 py-1 rounded-md ${isError ? 'bg-error text-on-error' : 'bg-primary-container text-on-primary-container'
                }`}>
                {isError ? '失敗' : '接続中'}
              </span>
            }
          />
          <SettingsTile
            icon="schedule"
            title="データ更新日時"
            subtitle={
              <span>
                {apiTimestamp}
                {worldState?.timestamp && (
                  <span className={`ml-2 text-xs ${timeDiff > 30 ? 'text-error font-bold' : 'opacity-70'}`}>
                    ({timeDiff} 分前)
                  </span>
                )}
              </span>
            }
          />
          <SettingsTile
            icon="code"
            title="JSONレスポンス"
            subtitle="取得した生データを確認"
            trailing={<span className="material-symbols-rounded text-on-surface-variant">terminal</span>}
            onClick={() => setShowRawData(true)}
          />
        </SettingsGroup>
      </SettingsSection>

      {/* Raw Data Modal */}
      {
        showRawData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fade-in">
            <div className="flex max-h-[80vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-surface-container-high shadow-xl">
              <div className="flex items-center justify-between border-b border-outline-variant p-4">
                <h3 className="font-display font-bold text-on-surface">API Response (WorldState)</h3>
                <button
                  onClick={() => setShowRawData(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-on-surface/10"
                >
                  <span className="material-symbols-rounded">close</span>
                </button>
              </div>
              <div className="flex-1 overflow-auto bg-surface-container-lowest p-4 font-mono text-xs text-on-surface">
                <pre>
                  {worldState ? JSON.stringify(worldState, null, 2) : 'No Data'}
                </pre>
              </div>
              <div className="border-t border-outline-variant p-4">
                <button
                  onClick={() => setShowRawData(false)}
                  className="w-full rounded-xl bg-primary p-3 font-bold text-on-primary hover:bg-opacity-90"
                >
                  閉じる
                </button>
              </div>
            </div>
          </div>
        )
      }

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
    </div >
  );
};

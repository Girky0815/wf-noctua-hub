import React, { useState } from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import { ThemeSelector } from '../ThemeSelector';
import { useWarframeData } from '../../hooks/useWarframeData';
import { SettingsSection, SettingsGroup, SettingsTile } from './SettingsCommon';

import { useNavigate } from 'react-router-dom';

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
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
  const timeDiff = worldState?.timestamp
    ? Math.floor((Date.now() - new Date(worldState.timestamp).getTime()) / 60000)
    : 0; // 分単位の差分

  const isStale = timeDiff > 30; // 30分以上で遅延とみなす

  let apiStatus = '正常';
  let badgeText = '接続中';
  let badgeClass = 'bg-primary-container text-on-primary-container';

  if (isError) {
    apiStatus = 'エラー';
    badgeText = '失敗';
    badgeClass = 'bg-error text-on-error';
  } else if (isLoading && !worldState) {
    apiStatus = '読み込み中...';
  } else if (isStale) {
    apiStatus = '接続OK (最新データ利用不可)';
    badgeText = '遅延';
    badgeClass = 'bg-error-container text-on-error-container';
  }

  const apiTimestamp = worldState?.timestamp ? new Date(worldState.timestamp).toLocaleString() : '-';

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

      {/* API情報 */}
      <SettingsSection title="API情報">
        <SettingsGroup>
          <SettingsTile
            icon="api"
            title="ステータス"
            subtitle={apiStatus}
            trailing={
              <span className={`text-xs font-bold px-2 py-1 rounded-md ${badgeClass}`}>
                {badgeText}
              </span>
            }
          />
          <SettingsTile
            icon="schedule"
            title="API データ最終更新日時"
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
            title="API レスポンス(JSON)"
            subtitle="APIから取得した生データを見る"
            trailing={<span className="material-symbols-rounded text-on-surface-variant">terminal chevron_right</span>}
            onClick={() => setShowRawData(true)}
          />
        </SettingsGroup>
      </SettingsSection>

      {/* Raw Data Modal */}
      {
        showRawData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fade-in">
            <div className="flex max-h-[80vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-secondary-container shadow-xl">
              <div className="flex items-center justify-between border-b border-outline-variant p-4">
                <h3 className="font-display font-bold text-on-surface">API レスポンス (WorldState)</h3>
                <button
                  onClick={() => setShowRawData(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-on-surface/10"
                >
                  <span className="material-symbols-rounded">close</span>
                </button>
              </div>
              <div className="flex-1 overflow-auto bg-surface-container p-4 font-mono text-xs text-on-surface">
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

      {/* 概要 */}
      <SettingsSection title="概要">
        <SettingsGroup>
          <SettingsTile
            icon="info"
            title="Noctua Hub"
            subtitle={`v${__APP_VERSION__}`}
            onClick={() => {/* 将来的に詳細画面へ */ }}
          />
          <SettingsTile
            icon="code"
            title="GitHub リポジトリ"
            subtitle="アプリの情報やソースコードを確認する"
            trailing={<span className="material-symbols-rounded text-on-surface-variant">open_in_new</span>}
            onClick={() => window.open('https://github.com/Girky0815/wf-noctua-hub', '_blank')}
          />
          <SettingsTile
            icon="help"
            title="ヘルプ (GitHub Wiki)"
            subtitle="使い方の確認・トラブルシューティング"
            trailing={<span className="material-symbols-rounded text-on-surface-variant">open_in_new</span>}
            onClick={() => window.open('https://github.com/Girky0815/wf-noctua-hub/wiki', '_blank')}
          />
          <SettingsTile
            icon="description"
            title="クレジット & ライセンス"
            subtitle="利用しているAPIやオープンソースライブラリ"
            trailing={<span className="material-symbols-rounded text-on-surface-variant">chevron_right</span>}
            onClick={() => navigate('/credits')}
          />
        </SettingsGroup>
      </SettingsSection>

      {/* クレジット詳細表示エリア (簡易的展開) */}
      {showCredits && (
        <div className="mb-6 animate-fade-in px-4">
          <div className="rounded-3xl bg-secondary-container p-5 text-sm">
            <div className="space-y-4">
              <div>
                <div className="mb-1 text-xs font-bold text-primary">情報源</div>
                <ul className="pl-2 text-on-surface-variant">
                  <li><a href="https://warframestat.us/" target="_blank" rel="noreferrer" className="underline decoration-dotted">Warframe Status API</a></li>
                </ul>
              </div>
              <div>
                <div className="mb-1 text-xs font-bold text-primary">ライブラリ</div>
                <ul className="pl-2 text-on-surface-variant">
                  <li>React, Vite, Tailwind CSS, SWR, React Router</li>
                </ul>
              </div>
              <div>
                <div className="mb-1 text-xs font-bold text-primary">フォント</div>
                <ul className="space-y-1 pl-2 text-on-surface-variant text-xs">
                  <li>源柔ゴシックX (SIL OFL 1.1)</li>
                  <li>Google Sans Flex (Google)</li>
                  <li>Noto Sans JP (Google)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="px-4 text-center text-xs text-on-surface-variant opacity-60">
        <p>© 2025 Noctua Hub</p>
        <p>Noctua Hub はファンメイドのアプリです。</p>
        <p>Digital Extremes Ltd.とは全く関係ありません。</p>
        <p>Noctua Hub is a fan-made app.</p>
        <p>Not affiliated with Digital Extremes Ltd.</p>
      </div>
    </div >
  );
};

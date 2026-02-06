import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../contexts/SettingsContext';
import { useWarframeData } from '../hooks/useWarframeData';
import { ThemeSelector } from '../components/ThemeSelector';
import { SectionTitle } from '../components/ui/SectionTitle';
import { ListGroup, ListTile, ListItem } from '../components/ui/List';
import { SettingsImportExport } from '../components/settings/SettingsImportExport';


export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { resetSettings } = useSettings();
  const [showCredits] = useState(false); // Used in render (conditional check), but if setter is unused, maybe it's meant to be static or toggled? Wait, earlier code had setShowCredits.
  // Actually, showCredits is used in JSX: {showCredits && (...)}. But setShowCredits was unused.
  // If the user wants to toggle it, they need the setter.
  // Looking at the code: "credits" link navigates to '/credits'. The in-page credits block was seemingly abandoned or hidden?
  // The lint says "setShowCredits is assigned but never used".
  // I will check if there is a button to toggle it.
  // The code has: onClick={() => navigate('/credits')}. So the inline block is likely dead code or for debugging.
  // I will keep showCredits state as false (const) or just remove the block if I'm confident.
  // But safest is to remove the unused setter.
  const [showRawData, setShowRawData] = useState(false);
  const [showImportExport, setShowImportExport] = useState(false);
  const { worldState, isLoading, isError } = useWarframeData();

  // Time tracking for stale data check
  const [now] = useState(() => Date.now()); // Initial check is enough for settings page, or update?
  // Settings page usually doesn't need real-time update of "minutes ago" unless user stares at it.
  // I'll keep it simple: just one-time check on mount is fine to fix purity.

  const handleReset = () => {
    if (window.confirm('すべての設定をリセットして初期状態に戻します。\nこの操作は取り消せません。\nこうかいしませんね?')) {
      resetSettings();
      window.location.reload();
    }
  };

  // APIステータスの判定
  const timeDiff = worldState?.timestamp
    ? Math.floor((now - new Date(worldState.timestamp).getTime()) / 60000)
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
      {/* ダッシュボード設定へのリンク */}
      <div className="mb-6">
        <SectionTitle title="カスタマイズ" />
        <ListGroup>
          <ListTile
            icon="dashboard_customize"
            title="ダッシュボード設定"
            subtitle="表示項目の選択・並び替え"
            trailing={<span className="material-symbols-rounded text-on-surface-variant">chevron_right</span>}
            onClick={() => navigate('/settings/dashboard')}
          />
          <ListTile
            icon="tune"
            title="ワールドサイクル補正"
            subtitle="サイクル時間のズレを手動で調整"
            trailing={<span className="material-symbols-rounded text-on-surface-variant">chevron_right</span>}
            onClick={() => navigate('/settings/calibration')}
          />
        </ListGroup>
      </div>

      {/* 外観設定 */}
      <div className="mb-6">
        <SectionTitle title="外観設定" />
        <div className="overflow-hidden rounded-[20px] bg-surface-bright">
          <div className="bg-surface-bright px-6 py-4">
            <div className="flex items-center gap-3 mb-1">
              <span className="material-symbols-rounded text-primary text-xl">palette</span>
              <span className="font-bold text-lg font-display">テーマ</span>
            </div>
            <p className="text-sm text-on-surface-variant opacity-80 pl-8">
              アプリ全体の配色やモードを設定
            </p>
          </div>
          <div className="p-6">
            <ThemeSelector />
          </div>
        </div>
      </div>

      {/* API情報 */}
      <div className="mb-6">
        <SectionTitle title="API情報" />
        <ListGroup>
          <ListTile
            icon="api"
            title="ステータス"
            subtitle={apiStatus}
            trailing={
              <span className={`text-xs font-bold px-2 py-1 rounded-md ${badgeClass}`}>
                {badgeText}
              </span>
            }
          />
          <ListTile
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
          <ListTile
            icon="code"
            title="API レスポンス(JSON)"
            subtitle="APIから取得した生データを見る"
            trailing={
              <div className="flex items-center gap-1 text-on-surface-variant">
                <span className="material-symbols-rounded">terminal</span>
                <span className="material-symbols-rounded">chevron_right</span>
              </div>
            }
            onClick={() => setShowRawData(true)}
          />
        </ListGroup>
      </div>

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
      <div className="mb-6">
        <SectionTitle title="データ管理" />
        <ListGroup>
          <ListTile
            icon="save"
            title="バックアップと復元"
            subtitle="設定の保存(エクスポート)・読み込み(インポート)"
            trailing={<span className="material-symbols-rounded text-on-surface-variant">open_in_browser</span>}
            onClick={() => setShowImportExport(true)}
          />
          <ListTile
            icon="delete_forever"
            title="設定をリセット"
            subtitle="テーマ設定や初回完了状態を初期化します"
            destructive
            onClick={handleReset}
          />
        </ListGroup>
      </div>

      {/* Import/Export Modal */}
      {showImportExport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fade-in">
          <div className="flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl bg-secondary-container shadow-xl animate-in zoom-in-95 duration-200">
            <div className="bg-secondary-container px-6 py-4 border-b border-outline-variant/50 flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg font-bold text-on-surface">バックアップと復元</h3>
                <p className="text-xs text-on-surface-variant opacity-80 mt-1">
                  JSON形式で設定を管理します
                </p>
              </div>
              <button
                onClick={() => setShowImportExport(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-on-surface/10 transition-colors"
              >
                <span className="material-symbols-rounded">close</span>
              </button>
            </div>

            <div className="p-6 overflow-y-auto bg-surface-container">
              <SettingsImportExport />
            </div>
          </div>
        </div>
      )}

      {/* 概要 */}
      <div className="mb-6">
        <SectionTitle title="概要" />
        <ListGroup>
          <ListTile
            icon="info"
            title="Noctua Hub"
            subtitle={`v${__APP_VERSION__}`}
            onClick={() => {
              console.log('Version clicked: Forcing reset and reload (Direct localStorage)');
              try {
                // Reactの状態更新を介さず、直接localStorageを書き換えてリロードすることで
                // リロード前のモーダル表示（チラつき）を防ぐ
                const SETTINGS_KEY = 'noctua-hub-settings';
                const saved = localStorage.getItem(SETTINGS_KEY);
                if (saved) {
                  const parsed = JSON.parse(saved);
                  parsed.lastSeenVersion = '0.0.0';
                  localStorage.setItem(SETTINGS_KEY, JSON.stringify(parsed));
                }

                // 少しだけ待ってからリロード
                setTimeout(() => {
                  window.location.reload();
                }, 100);
              } catch (e) {
                console.error('Debug trigger failed:', e);
              }
            }}
          />
          <ListTile
            icon="code"
            title="GitHub リポジトリ"
            subtitle="アプリの情報やソースコードを確認する"
            trailing={<span className="material-symbols-rounded text-on-surface-variant">open_in_new</span>}
            onClick={() => window.open('https://github.com/Girky0815/wf-noctua-hub', '_blank')}
          />
          <ListTile
            icon="help"
            title="ヘルプ (GitHub Wiki)"
            subtitle="使い方の確認・トラブルシューティング"
            trailing={<span className="material-symbols-rounded text-on-surface-variant">open_in_new</span>}
            onClick={() => window.open('https://github.com/Girky0815/wf-noctua-hub/wiki', '_blank')}
          />
          <ListTile
            icon="description"
            title="クレジット & ライセンス"
            subtitle="利用しているAPIやオープンソースライブラリ"
            trailing={<span className="material-symbols-rounded text-on-surface-variant">chevron_right</span>}
            onClick={() => navigate('/credits')}
          />
        </ListGroup>
      </div>

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

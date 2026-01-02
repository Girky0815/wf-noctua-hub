import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../contexts/SettingsContext';
import { SectionTitle } from '../components/ui/SectionTitle';
import { ListGroup, ListItem } from '../components/ui/List';
import { Switch } from '../components/ui/Switch';

const WIDGET_NAMES: Record<string, string> = {
  cycles: 'ワールドサイクル',
  alerts: 'アラート',
  invasions: '侵略ミッション',
  sortie: '今日のソーティ',
  archonHunt: 'アルコン討伐戦',
  resurgence: 'Prime Resurgence',
  voidTrader: "Baro Ki'Teer",
};

export const DashboardSettingsPage: React.FC = () => {
  const { dashboardConfig, updateDashboardConfig } = useSettings();
  const navigate = useNavigate();

  // orderでソートされた設定を取得
  const sortedConfig = [...dashboardConfig].sort((a, b) => a.order - b.order);

  const handleToggle = (id: string) => {
    const newConfig = dashboardConfig.map((item) =>
      item.id === id ? { ...item, visible: !item.visible } : item
    );
    updateDashboardConfig(newConfig);
  };

  const handleMove = (index: number, direction: 'up' | 'down', e: React.MouseEvent) => {
    e.stopPropagation(); // タイトルクリックでのトグル動作などを防ぐ場合
    const newConfig = [...sortedConfig];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newConfig.length) return;

    // 要素の入れ替え
    [newConfig[index], newConfig[targetIndex]] = [newConfig[targetIndex], newConfig[index]];

    // orderの再割り当て
    const reorderedConfig = newConfig.map((item, idx) => ({
      ...item,
      order: idx,
    }));

    updateDashboardConfig(reorderedConfig);
  };

  return (
    <div className="flex flex-col pb-24 pt-4">
      {/* Header */}
      <div className="mb-6 flex items-center gap-4 px-4">
        <button
          onClick={() => navigate('/settings')}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-high text-on-surface hover:bg-surface-container-highest transition-colors"
        >
          <span className="material-symbols-rounded">arrow_back</span>
        </button>
        <h1 className="text-2xl font-bold text-on-surface font-display" style={{ fontVariationSettings: "'ROND' 100" }}>
          ダッシュボード設定
        </h1>
      </div>

      {/* ヒント */}
      <div className="mb-4 px-4">
        <div className="rounded-2xl bg-secondary-container p-4 text-sm text-on-secondary-container">
          <div className="flex items-start gap-3">
            <span className="material-symbols-rounded mt-0.5">info</span>
            <div className="flex flex-col gap-1">
              <p className="font-bold">ダッシュボードの表示をカスタマイズ</p>
              <p className="opacity-90">
                トグルスイッチで各項目の表示/非表示を切り替えられます。<br />
                各項目「▲」「▼」ボタンで表示順序を並び替えることができます。<br />
                設定した内容はホーム画面の「ダッシュボード」タブに反映されます。
              </p>
            </div>
          </div>
        </div>
      </div>

      <ListGroup>
        {sortedConfig.map((widget, index) => (
          <ListItem
            key={widget.id}
            className={!widget.visible ? 'opacity-75' : ''}
          >
            <div className="flex items-center justify-between px-4 py-3 w-full">
              <div className="flex items-center gap-4">
                {/* 並び替えボタン */}
                <div className="flex flex-col gap-1">
                  <button
                    onClick={(e) => handleMove(index, 'up', e)}
                    disabled={index === 0}
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container disabled:opacity-30 disabled:cursor-not-allowed hover:bg-opacity-80 transition-opacity"
                  >
                    <span className="material-symbols-rounded text-base">arrow_drop_up</span>
                  </button>
                  <button
                    onClick={(e) => handleMove(index, 'down', e)}
                    disabled={index === sortedConfig.length - 1}
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container disabled:opacity-30 disabled:cursor-not-allowed hover:bg-opacity-80 transition-opacity"
                  >
                    <span className="material-symbols-rounded text-base">arrow_drop_down</span>
                  </button>
                </div>

                <span className={`font-medium text-base font-display ${widget.visible ? 'text-on-surface' : 'text-on-surface-variant'}`} style={{ fontVariationSettings: "'ROND' 100" }}>
                  {WIDGET_NAMES[widget.id] || widget.id}
                </span>
              </div>

              <Switch
                checked={widget.visible}
                onChange={() => handleToggle(widget.id)}
              />
            </div>
          </ListItem>
        ))}
      </ListGroup>
    </div>
  );
};

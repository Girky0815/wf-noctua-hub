import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SectionTitle } from '../ui/SectionTitle';
import { ListGroup, ListTile } from '../ui/List';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SideMenu: React.FC<SideMenuProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  // アニメーション制御: isOpenが変わったら少し送らせてDOMの表示/非表示を切り替える...
  // いや、Tailwindのtransitionを使うなら常にレンダリングしておいて、opacity/translateを切り替えるのが楽。
  // ただし、ポインターイベントの制御が必要。

  // 単純化: 常にレンダリングし、クラスで制御

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 bottom-0 z-50 w-full md:w-120 bg-surface-container transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full'
          }`}
      >
        <div className="flex flex-col h-full overflow-y-auto pb-safe pt-safe">
          {/* Header Area inside Drawer */}
          <div className="p-4 flex items-center justify-start gap-4 border-b border-outline-variant/10">
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-on-surface/10 text-on-surface-variant"
            >
              <span className="material-symbols-rounded text-2xl">menu_open</span>
            </button>
            <span className="text-xl font-display font-medium text-on-surface">メニュー</span>
          </div>

          <div className="flex-1 p-4 flex flex-col gap-6">
            {/* Warframe ステータス */}
            <div>
              <SectionTitle title="Warframe ステータス" />
              <ListGroup>
                <ListTile
                  icon="dashboard"
                  title="ダッシュボード"
                  subtitle="ワールドサイクル、侵略、ソーティなど"
                  trailing={<span className="material-symbols-rounded text-on-surface-variant">chevron_right</span>}
                  onClick={() => handleNavigation('/')}
                />
                <ListTile
                  icon="filter_drama"
                  title="亀裂ミッション"
                  subtitle="Void 亀裂、Void 嵐の情報"
                  trailing={<span className="material-symbols-rounded text-on-surface-variant">chevron_right</span>}
                  onClick={() => handleNavigation('/fissures')}
                />
              </ListGroup>
            </div>

            <div>
              <SectionTitle title="中級者向け" />
              <ListGroup>
                <ListTile
                  icon="token"
                  title="サーキット"
                  subtitle="サーキットの報酬を見る"
                  trailing={<span className="material-symbols-rounded text-on-surface-variant">chevron_right</span>}
                  onClick={() => handleNavigation('/circuit')}
                />
              </ListGroup>
            </div>

            {/* 上級者向け */}
            <div>
              <SectionTitle title="上級者向け" />
              <ListGroup>
                <ListTile
                  icon="science"
                  title="アルキメデア"
                  subtitle="深淵 / 次元アルキメデア"
                  trailing={<span className="material-symbols-rounded text-on-surface-variant">chevron_right</span>}
                  onClick={() => handleNavigation('/archimedea')}
                />
                <ListTile
                  icon="diamond"
                  title="アルコン討伐戦"
                  subtitle="対ナルメル・アルコン戦"
                  trailing={<span className="material-symbols-rounded text-on-surface-variant">chevron_right</span>}
                  onClick={() => handleNavigation('/archon-hunt')}
                />
              </ListGroup>
            </div>

            {/* お役立ち */}
            <div>
              <SectionTitle title="お役立ち" />
              <ListGroup>
                <ListTile
                  icon="change_history"
                  title="レリックシミュレーター"
                  subtitle="レリックの中身やドロップ率を確認"
                  trailing={<span className="material-symbols-rounded text-on-surface-variant">chevron_right</span>}
                  onClick={() => handleNavigation('/relics')}
                />
                <ListTile
                  icon="link"
                  title="リンク集"
                  subtitle="公式サイト、Wiki、役立つツール"
                  trailing={<span className="material-symbols-rounded text-on-surface-variant">chevron_right</span>}
                  onClick={() => handleNavigation('/links')}
                />
              </ListGroup>
            </div>

            {/* 設定 */}
            <div>
              <SectionTitle title="設定" />
              <ListGroup>
                <ListTile
                  icon="settings"
                  title="設定"
                  subtitle="アプリの挙動設定、データ管理、API情報"
                  trailing={<span className="material-symbols-rounded text-on-surface-variant">chevron_right</span>}
                  onClick={() => handleNavigation('/settings')}
                />
              </ListGroup>
            </div>
          </div>

          <div className="p-4 text-center text-xs text-on-surface-variant opacity-60">
            <p>© 2025 Noctua Hub</p>
          </div>
        </div>
      </div>
    </>
  );
};

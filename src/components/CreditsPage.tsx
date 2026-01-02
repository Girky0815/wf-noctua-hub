import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SectionTitle } from './ui/SectionTitle';
import { ListGroup, ListTile } from './ui/List';

export const CreditsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col pb-24 pt-4 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex items-center gap-4 px-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-on-surface/10 transition-colors"
        >
          <span className="material-symbols-rounded text-on-surface">arrow_back</span>
        </button>
        <span className="text-2xl font-bold font-display text-on-surface" style={{ fontVariationSettings: "'ROND' 100" }}>
          クレジット & ライセンス
        </span>
      </div>

      <div className="px-4 mb-8">
        <div className="p-4 rounded-2xl bg-error-container text-on-error-container text-sm leading-relaxed">
          <p>
            Noctua Hub は、Warframe の公開データや有志開発者コミュニティが提供する情報を利用して開発された非公式のコンパニオンアプリです。<br />
            Digital Extremes Ltd. とは提携・関係していません。
          </p>
        </div>
      </div>

      <div className="mb-6">
        <SectionTitle title="データソース (API)" />
        <ListGroup>
          <ListTile
            icon="dns"
            title="Warframe Status API"
            subtitle="Warframeのリアルタイム情報"
            onClick={() => window.open('https://warframestat.us/', '_blank')}
            trailing={<span className="material-symbols-rounded text-on-surface-variant font-display text-xs">api.warframestat.us/pc</span>}
          />
          <ListTile
            icon="database"
            title="Warframe Items API"
            subtitle="レリック、MOD、武器などの静的アイテムデータ"
            onClick={() => window.open('https://docs.warframestat.us/', '_blank')}
            trailing={<span className="material-symbols-rounded text-on-surface-variant font-display text-xs">api.warframestat.us/items</span>}
          />
          <ListTile
            icon="opacity"
            title="Warframe Drops API"
            subtitle="ミッション報酬、レリックの中身、ドロップ率データ"
            onClick={() => window.open('https://warframestat.us/', '_blank')}
            trailing={<span className="material-symbols-rounded text-on-surface-variant font-display text-xs">api.warframestat.us/drops</span>}
          />
        </ListGroup>
      </div>

      <div className="mb-6">
        <SectionTitle title="情報源 (Resources)" />
        <ListGroup>
          <ListTile
            icon="web"
            title="Warframe Wiki (JP)"
            subtitle="Prime装備・Warframeの詳細情報リンク先"
            onClick={() => window.open('https://wikiwiki.jp/warframe/', '_blank')}
            trailing={<span className="text-xs text-on-surface-variant">wikiwiki.jp</span>}
          />
        </ListGroup>
      </div>

      <div className="mb-6">
        <SectionTitle title="アセット & フォント" />
        <ListGroup>
          <ListTile
            icon="image"
            title="Warframe Assets"
            subtitle="Game Assets / Images"
            trailing={<span className="text-xs text-on-surface-variant">© Digital Extremes Ltd.</span>}
          />
          <ListTile
            icon="text_fields"
            title="源柔ゴシックX (GenJyuuGothicX)"
            subtitle="自家製フォント工房 (MM)"
            trailing={<span className="text-xs text-on-surface-variant">SIL OFL 1.1</span>}
            onClick={() => window.open('http://jikasei.me/font/genjyuu/', '_blank')}
          />
          <ListTile
            icon="text_fields"
            title="Google Sans Flex"
            subtitle="Google Fonts"
            trailing={<span className="text-xs text-on-surface-variant">SIL OFL 1.1</span>}
            onClick={() => window.open('https://fonts.google.com/specimen/Google+Sans+Flex', '_blank')}
          />
          <ListTile
            icon="text_fields"
            title="Noto Sans JP"
            subtitle="Google Fonts"
            trailing={<span className="text-xs text-on-surface-variant">SIL OFL 1.1</span>}
            onClick={() => window.open('https://fonts.google.com/specimen/Noto+Sans+JP', '_blank')}
          />
          <ListTile
            icon="text_fields"
            title="Material Symbols"
            subtitle="Google Fonts"
            trailing={<span className="text-xs text-on-surface-variant">Apache 2.0</span>}
            onClick={() => window.open('https://fonts.google.com/icons', '_blank')}
          />
        </ListGroup>
      </div>

      <div className="mb-6">
        <SectionTitle title="ライブラリ (Open Source)" />
        <ListGroup>
          <ListTile
            icon="code_blocks"
            title="React"
            subtitle="UI Framework"
            trailing={<span className="text-xs text-on-surface-variant">MIT</span>}
          />
          <ListTile
            icon="bolt"
            title="Vite"
            subtitle="Build Tool"
            trailing={<span className="text-xs text-on-surface-variant">MIT</span>}
          />
          <ListTile
            icon="style"
            title="Tailwind CSS"
            subtitle="Utility-first な CSS フレームワーク"
            trailing={<span className="text-xs text-on-surface-variant">MIT</span>}
          />
          <ListTile
            icon="sync"
            title="SWR"
            subtitle="APIデータ取得用の React Hooks"
            trailing={<span className="text-xs text-on-surface-variant">MIT</span>}
          />
        </ListGroup>
      </div>

      <div className="mt-8 px-6 text-center text-xs text-on-surface-variant/60 space-y-1">
        <p>Built with passion for the Tenno by a Tenno.</p>
        <p>© 2025 Noctua Hub</p>
      </div>
    </div>
  );
};

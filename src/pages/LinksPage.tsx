import React from 'react';
import { SectionTitle } from '../components/ui/SectionTitle';
import { ListGroup, ListTile } from '../components/ui/List';

export const LinksPage: React.FC = () => {
  const openLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="animate-fade-in pb-24 max-w-2xl mx-auto p-4 space-y-6">
      <div className="space-y-2 mb-6">
        <h1 className="text-3xl font-display font-bold text-on-surface">リンク集</h1>
        <p className="text-on-surface-variant text-sm">
          Origin 太陽系の冒険に役立つ公式サイトやコミュニティサイトのリンク集です。
        </p>
      </div>

      {/* 公式サイト */}
      <div>
        <SectionTitle title="公式サイト" />
        <ListGroup>
          <ListTile
            icon="language"
            title="Warframe 公式Webサイト"
            subtitle="ゲームのダウンロードやニュースの閲覧はこちら。"
            trailing={<span className="material-symbols-rounded text-on-surface-variant">open_in_new</span>}
            onClick={() => openLink('https://www.warframe.com/ja')}
          />
          <ListTile
            icon="forum"
            title="Warframe 公式フォーラム"
            subtitle="パッチノートや公式からのアナウンス、ユーザーからのフィードバック。"
            trailing={<span className="material-symbols-rounded text-on-surface-variant">open_in_new</span>}
            onClick={() => openLink('https://forums.warframe.com/')}
          />
          <ListTile
            icon="translate"
            title="Warframe 公式フォーラム 日本語版"
            subtitle="翻訳されたパッチノートやアナウンスを見ることができる。"
            trailing={<span className="material-symbols-rounded text-on-surface-variant">open_in_new</span>}
            onClick={() => openLink('https://forums.warframe.com/forum/124-%E6%97%A5%E6%9C%AC%E8%AA%9E/')}
          />
          <ListTile
            icon="table_chart"
            title="公式ドロップテーブル"
            subtitle="DEが公開しているアイテムドロップ率 (Ctrl+F推奨)。"
            trailing={<span className="material-symbols-rounded text-on-surface-variant">open_in_new</span>}
            onClick={() => openLink('https://warframe-web-assets.nyc3.cdn.digitaloceanspaces.com/uploads/cms/hnfvc0o3jnfvc873njb03enrf56.html')}
          />
        </ListGroup>
      </div>

      {/* Wiki */}
      <div>
        <SectionTitle title="Wiki" />
        <ListGroup>
          <ListTile
            icon="menu_book"
            title="Warframe Wiki 日本語版"
            subtitle="日本語版Wiki。日本人テンノ必携の分厚い教科書。"
            trailing={<span className="material-symbols-rounded text-on-surface-variant">open_in_new</span>}
            onClick={() => openLink('https://wikiwiki.jp/warframe/')}
          />
          <ListTile
            icon="auto_stories"
            title="Warframe Wiki 英語版"
            subtitle="日本語版よりも詳細な情報が入手できる。"
            trailing={<span className="material-symbols-rounded text-on-surface-variant">open_in_new</span>}
            onClick={() => openLink('https://wiki.warframe.com/')}
          />
        </ListGroup>
      </div>

      {/* コミュニティサイト */}
      <div>
        <SectionTitle title="コミュニティサイト" />
        <ListGroup>
          <ListTile
            icon="build"
            title="Overframe"
            subtitle="装備のビルドシミュレーター。有志のビルドも閲覧可能。"
            trailing={<span className="material-symbols-rounded text-on-surface-variant">open_in_new</span>}
            onClick={() => openLink('https://overframe.gg/?hl=ja')}
          />
          <ListTile
            icon="shopping_cart"
            title="Warframe Market"
            subtitle="プライムパーツやMODのトレード相場確認・相手探し。"
            trailing={<span className="material-symbols-rounded text-on-surface-variant">open_in_new</span>}
            onClick={() => openLink('https://warframe.market/')}
          />
        </ListGroup>
      </div>

      {/* SNS */}
      <div>
        <SectionTitle title="SNS" />
        <ListGroup>
          <ListTile
            icon="rss_feed" // X icon fallback
            title="日本語公式 Twitter (X)"
            subtitle="@WarframeJPN"
            trailing={<span className="material-symbols-rounded text-on-surface-variant">open_in_new</span>}
            onClick={() => openLink('https://x.com/WarframeJPN')}
          />
          <ListTile
            icon="cloud" // Bluesky fallback
            title="日本語公式 Bluesky"
            subtitle="公式アカウント"
            trailing={<span className="material-symbols-rounded text-on-surface-variant">open_in_new</span>}
            onClick={() => openLink('https://bsky.app/profile/did:plc:34zar7aejni5maxrfgmf4jnj')}
          />
          <ListTile
            icon="video_library"
            title="公式YouTube アカウント"
            subtitle="公式トレーラーや過去の動画など。"
            trailing={<span className="material-symbols-rounded text-on-surface-variant">open_in_new</span>}
            onClick={() => openLink('https://www.youtube.com/@Warframe')}
          />
          <ListTile
            icon="live_tv"
            title="公式Twitchチャンネル"
            subtitle="DevStreamなどの公式生配信。Drops対応。"
            trailing={<span className="material-symbols-rounded text-on-surface-variant">open_in_new</span>}
            onClick={() => openLink('https://ja.twitch.tv/Warframe')}
          />
        </ListGroup>
      </div>
    </div>
  );
};

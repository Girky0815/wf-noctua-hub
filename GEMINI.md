# Noctua Hub 開発ガイドライン (for Gemini)

このドキュメントは、**Noctua Hub** の開発・保守を行うAIアシスタント (Gemini) 向けの包括的な仕様書兼指示書です。
将来のセッションでこのプロジェクトを扱う際は、まずこのファイルを読み込んでコンテキストを理解してください。

---

## 1. プロジェクト概要

**Noctua Hub** は、Digital Extremes社のオンラインゲーム『Warframe』の情報を表示・活用するためのファンメイドWebアプリケーションです。
スマートフォン（PWA想定）およびPCブラウザでの利用を想定し、モダンで直感的なUIを提供します。

- **リポジトリ**: [Girky0815/wf-noctua-hub](https://github.com/Girky0815/wf-noctua-hub)
- **公開URL**: GitHub Pages (Base URL: `/wf-noctua-hub/`)
- **API**: [Warframe Status API](https://warframestat.us/)

## 2. 技術スタック

- **Framework**: React
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS (with Material 3 Expressive design token)
- **State Management**: React Context (`SettingsContext`), SWR (Data Fetching)
- **Routing**: React Router v6
- **Deployment**: GitHub Actions -> GitHub Pages

## 3. ディレクトリ構成

```
src/
├── assets/          # 静的リソース
├── components/      # Reactコンポーネント
│   ├── navigation/  # サイドメニュー (SideMenu.tsx) など
│   ├── settings/    # 設定関連 (DashboardSettings.tsx)
│   ├── status/      # ステータス表示用 (SortieCard, FissureList etc.)
│   └── ui/          # 汎用UI (List.tsx, SectionTitle.tsx, Tooltip.tsx)
├── contexts/        # グローバル状態 (SettingsContext, ThemeContext)
├── data/            # 固定データ (updates.ts: 更新履歴)
├── hooks/           # カスタムフック (useWarframeData.ts)
├── pages/           # ページコンポーネント (StatusPage, SettingsPage etc.)
├── types/           # TypeScript型定義 (warframe.ts: API型定義)
└── utils/           # ユーティリティ (translations.ts: 翻訳データ)
```

## 4. UI/UX デザインガイドライン

本アプリは **Material 3 Expressive** デザインシステムをベースにしていますが、独自の調整が含まれています。

### フォント構成
`src/index.css` にて定義・適用されています。

1.  **Google Sans Flex**
    - **用途**: 英数字用
    - **設定**: Variable Fontとして読み込み、`font-variation-settings: 'ROND' 100` を適用することで、独特の丸みを表現します。
    - **適用範囲**: `h1`～`h6`, `.font-bold`, `strong`, `b` に対してROND 100を適用。

2.  **GenJyuuGothicX (源柔ゴシックX)**
    - **用途**: 日本語テキスト強調部分(Google Sans Flex でROND 100を設定した箇所のフォールバック)。
    - **ソース**: `src/assets/fonts/` にSubset化されたTTF (Regular, Medium, Bold) を配置し、`@font-face` で定義。
    - **特徴**: 丸ゴシック体で、全体的な柔らかいデザイン言語と調和します。

3.  **Noto Sans JP**
    - **用途**: 上記フォントでカバーできない文字や通常の日本語文字用のフォールバック。

#### 実装詳細 (`index.css`)
```css
/* 見出しや太字には丸み設定(ROND 100)と源柔ゴシックを強制 */
h1, h2, h3, h4, h5, h6, .font-bold, strong, b {
  font-family: 'Google Sans Flex', 'GenJyuuGothicX', 'Noto Sans JP', sans-serif;
  font-variation-settings: 'ROND' 100;
}
```

### カラーパレット
Material 3 Design Token に基づくセマンティックな色定義を使用しています。
直接的な色指定（例: `bg-green-500`）は避け、以下の役割（Role）に基づくクラスを使用してください。

| Role | Token Name | 用途 |
| :--- | :--- | :--- |
| **Primary** | `primary` / `on-primary` | ブランドカラー（緑）。主要なアクションボタン、アクティブ状態。 |
| **Secondary** | `secondary` / `secondary-container` | `primary` より控えめな強調。ヘッダー背景、トーンダウンしたボタンなど。 |
| **Base Background** | `surface-container-high` | アプリ全体のベース背景色。`surface` や `background` は使用しない。 |
| **List Surface** | `surface-bright` | リストアイテム(`ListItem`)の背景色。 |
| **Error** | `error` / `error-container` | エラーや警告（赤）。 |
| **Outline** | `outline` / `variant` | 境界線や区切り線。 |

#### テーマ設定
`src/index.css` の `:root` 定義により、以下の3つのテーマを切り替えます。
1.  **Light**: 自然な緑を基調とした明るいテーマ（デフォルト）。
2.  **Dark**: 暗いグレーのテーマ。
3.  **Black**: 完全な黒(`nanoleaf`等 OLED向け)。`surface` 系がすべて `#000000` になる。

### アイコン
- **Material Symbols Rounded** を使用。
- **実装**: `index.html` で Google Fonts から読み込み。
- **アクティブ表現**: ナビゲーションバーなどでは `font-variation-settings: 'FILL' 1` を適用して「塗りつぶし」スタイルに切り替える演出を行う。

### コンポーネントルール
- **リスト**: `src/components/ui/List.tsx` の `ListGroup` と `ListTile` を使用する。
  - `ListGroup`: `gap-[2px]` で区切られたカード群。
  - `ListTile`: アイコン、タイトル、サブタイトル、右側のアクションを持つ標準行。
- **ナビゲーションバー**: 下部固定。スクロールによるガタつき防止のため `html { scrollbar-gutter: stable; }` が適用済み。
- **サイドメニュー**: ハンバーガーメニューから展開。アプリ全体の機能へのアクセスポイント。

## 5. 主要機能と実装詳細

### ダッシュボード (StatusPage)
- ユーザーがカスタマイズ可能なウィジェット形式。
- `SettingsContext` 内の `dashboardConfig` で表示項目の順序と表示/非表示を管理。

### 更新通知システム
- **データソース**: `src/data/updates.ts`
  - Markdown記法で記載。`UpdateNotificationModal.tsx` がこれをパースして表示。
- **トリガー**: `package.json` のバージョンと `localStorage` の `lastSeenVersion` を比較。
- **リリースフロー**:
  1. `src/data/updates.ts` に追記。
  2. `npm version [patch/minor/major]` でバージョン上げ。
  3. `git push origin main --tags` でGitHub Actionsが起動し、自動デプロイ＆リリース作成。

### その他機能
- **亀裂 (Fissures)**: ティアごとにグループ化して表示。
- **レリックシミュレーター**: `RelicSimulatorPage` (実装予定/簡易実装)。
- **リンク集**: `LinksPage`。

## 6. 開発ワークフロー

### コマンド (`COMMANDS.md` 参照)
- 開発サーバー: `npm run dev`
- ビルド: `npm run build`
- リント: `npm run lint`

### リファクタリング・修正時の注意

#### 1. 翻訳・ローカライズ (`src/utils/translations.ts`)
ゲーム内の専門用語（ミッション名、敵勢力、レリック、ソーティのデバフなど）は、APIから英語で返却されます。
これらを日本語で表示するため、必ず `src/utils/translations.ts` を経由してください。

- **辞書**: `missionTypes`, `factionTypes`, `sortieModifiers` などの定数オブジェクトで管理。
- **関数**: `translateMissionType(key)`, `translateSortieModifier(key)` などのヘルパー関数を使用。
- **新規追加**: 辞書にキーがない場合は英語がそのまま表示されます。見つけ次第、辞書に追記してください。

#### 2. 型定義 (`src/types/warframe.ts`)
API (`WarframeStatus API`) のレスポンス型はすべてここで定義されています。
`any` 型の使用は禁止です。不明なプロパティがある場合は、インターフェースを拡張してください。

#### 3. データ取得 (SWR)
データフェッチには `SWR` (`useWarframeData` hook) を使用しています。
- **キャッシュ**: データは自動的にキャッシュされ、フォーカス時に再検証されます。
- **更新間隔**: デフォルトで30秒ごとにポーリングを行います。

#### 4. レイアウト & モバイルレスポンシブ
- **共通ラッパー**: `App.tsx` 側でメインコンテンツ全体を `<main className="mx-auto max-w-2xl p-4">` でラップしています。
- **ページ実装**: そのため、各ページコンポーネント（`LinksPage.tsx`など）内で再度 `max-w-2xl` や `mx-auto`、`p-4` を定義しないでください（二重余白や幅縮小の原因になります）。
- **デスクトップ表示**: 常に「モバイルアプリ風」の中央寄せ・最大幅固定レイアウトを維持します。

---
このファイルはプロジェクトの「信頼できる情報源 (Single Source of Truth)」の一部として扱い、大きな変更があった場合は適宜更新してください。

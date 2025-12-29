# Noctua Hub (仮)

Warframe のワールドステート（ミッション情報やイベント状況）などをリアルタイムで(かつゲームプレイ中などにでも)確認できる、シンプルでモダンな Web アプリケーションです。

## 概要
Noctua Hub は、Warframe の公開 API を利用して、現在発生しているアラート、侵略、ソーティミッションなどの情報を可視化します。
インストール不要で、PC・スマホのブラウザからすぐにアクセスできます。

長時間耐久などで星系マップが見られない場合や、
サクッとゲームプレイ中に(=Warframeコンパニオンアプリにログインできない状況で)ステータスを見たい時にどうぞ。

> ### 注意事項
> 
> - このアプリは開発中のアルファ版です。
> - 本アプリの挙動は Warframe Status API に依存しています。 API の状態によっては、データの反映が遅れたり、正しく表示されない場合があります。
> - 作者および本アプリはDigital Extremes Ltd.とは一切関係ありません。

## 特徴
- **Material 3 Expressive Design**: 最新のモダンな UI デザインを採用し、視認性と操作性を重視しています。
- **Web App**: インストール不要。ブラウザでブックマークするだけで使えます。
- **完全無料・広告なし**: **作者は課金要素や広告表示を好みません**。画面を占有する邪魔なバナーは一切ありません。
- **オープンソース**: 透明性の高い開発を行っています。

## 機能
### 現時点で利用可能 (v0.1.0-alpha)
- 🌍 **ワールドステート表示**: 
  - アラートミッション (報酬、残り時間)
  - 侵略の進行状況と報酬
  - アルコン討伐戦のミッション内容と状態異常
- 🌙 **Cycle 表示**: 地球・エイドロン・オーブ峡谷・カンビオン荒地の昼夜サイクル
  - APIが不安定なため正しく表示できない可能性があります。
- 🤝 **Baro Ki'Teer 情報**: 到着確認とインベントリ
  - 動作未検証
- 🎨 **カスタマイズ**:

  - ダークモード/ライトモード (システム設定に追従)

### 今後実装予定

- 裂け目 (Fissure) ミッションの一覧
  - 作成時点でAPIが不安定なため実装できていない
- レリックシミュレーター
- ニュースフィードの表示
- テーマカラーの変更 (ダイナミックカラーへの対応)
- PWA (Progressive Web App) 対応: ホーム画面への追加とオフライン対応強化

## できること / できないこと

### ✅ できること
- 現在のアラート、侵略、ソーティ情報の確認
- アプリの見た目のカスタマイズ (テーマ変更)
- API 生データの確認 (デバッグ用)

### ❌ できないこと
- **ゲーム内データへのアクセス**: 自分の所持アイテム、MOD、クレジット等の確認・操作はできません。
- **ゲームプレイへの干渉**: 製作の開始、装備の変更、トレードなどはできません。
- **アカウント連携**: Warframe アカウントでのログイン機能はありません。

## 使用しているライブラリ・データ
このアプリは以下のオープンソース技術とデータを利用して構築されています。

### データソース
- **[Warframe Status API](https://warframestat.us/)**: Warframe ファンコミュニティによって維持されている信頼性の高い API

### ライブラリ
- React / React DOM
- Vite
- TypeScript
- Tailwind CSS
- SWR (データフェッチ)
- React Router

### フォント
- **源柔ゴシックX (GenJyuuGothicX)**: SIL Open Font License 1.1
- **Google Sans Flex**: Google
- **Noto Sans JP**: Google

## 免責事項
Noctua Hub はテンノが作ったファンメイドの非公式アプリケーションです。
開発者および本アプリは、Warframe の開発元である **Digital Extremes Ltd.** とは一切関係ありません。

本アプリの使用によって生じたいかなる不利益や損害についても、開発者は責任を負いかねます。
API の仕様変更や、不具合などにより、予告なく利用できなくなる可能性があります。

---
<!--
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

\`\`\`js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
\`\`\`

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

\`\`\`js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
\`\`\`
-->

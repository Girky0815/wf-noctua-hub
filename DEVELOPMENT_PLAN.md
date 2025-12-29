# プロジェクト名: Noctua Hub (wf-noctua-hub)
## 概要
Warframe のプレイヤー（テンノ）が、ゲームを起動しなくても片手で星系の状態を確認できる、Material 3 Expressive デザインを採用した高機能コンパニオン Web アプリ。

## 開発・動作環境
- フレームワーク: React + Vite (TypeScript)
- スタイリング: Tailwind CSS
- UI デザイン: Material 3 Expressive (Android 16 QPR1 スタイル)
- 言語: すべて日本語 (UI、出力、コード内コメント)
- デプロイ: GitHub Pages (GitHub Actions 経由)
- その他: PWA 対応 (vite-plugin-pwa)

## デザイン定義 (重要)
デザインの実装は nsh07/Tomato のUIが Android 16 QPR1 風に最も近似なため、これを参考にする。
以下のリポジトリでの実装を参考に、Android 16 QPR1 のデザインを実装すること(このリポジトリはKotlinだが、模倣できる場所はなるべく模倣すること)。
リポジトリURL: https://github.com/nsh07/Tomato
1. リスト UI (Android 16 QPR1 風):
   - コンテナの隙間 (gap) は 2px。
   - リストの最初の要素は角丸 28px (rounded-t-3xl)。
   - リストの最後の要素は角丸 28px (rounded-b-3xl)。
   - 中間の要素は最小限の角丸。
2. フォント設定:
   - 源柔ゴシック以外はGoogle Fontsから利用できる。
   - Google Sans Flex + Noto Sans JP: `@import url('https://fonts.googleapis.com/css2?family=Google+Sans+Flex:opsz,slnt,wdth,wght,GRAD,ROND@6..144,-10..0,25..151,1..1000,0..100,0..100&family=Noto+Sans+JP:wght@100..900&display=swap');`
   - 英数字: Google Sans Flex (ROND 100 を強調箇所に使用)
   - 日本語: Noto Sans JP (フォールバック)、および 源柔ゴシックX
     - 源柔ゴシックXはGoogle Sans FlexでROND 100を設定した箇所のフォールバックとして使用する。~~ttf をプロジェクト内のどこに配置すればよいかを提示すること~~src/assets/fonts/に配置済
   - アイコン: Material Symbols Rounded (Fill/Non-fill を使い分け)
3. カラースキーム
   - アプリの背景色は`Surface Container High`を使用する。
     - Material 3(旧UI)との差別化を行うために、`Surface` の利用は不可
   - リストUIの背景色は`Surface Bright`を使用する。
   - ナビゲーションレール(PC)やナビゲーションバー(スマートフォン)は背景色を`Secondary Container`を、アクセント(現在有効なモード)は`Primary`を使用する。
4. テーマ:
   - ライト / ダーク / ブラック (OLED用完全黒) の3種類を切り替え可能。
     - ブラックモードは使用する背景色をすべてまとめて真っ黒(#000000)にする。

## 実装機能リスト
1. 初回起動画面 (オンボーディング):
   - LocalStorage に訪問済みフラグがない場合、**メイン画面を表示する前に**この画面を強制的に表示する。
   - 以下の順で設定・確認を行わせるウィザード形式、または1画面のモーダル。
     1. **免責事項の確認:** 「Warframe公式ではない」「API状況により機能しない可能性がある」「作者は損害を保証しない」「Gemini 3 Pro で開発されておりバグを含む可能性がある」ことへの同意。
     2. **テーマ設定:** ライト/ダーク/ブラック の中から好みを選択させる（デフォルトで決定させない）。
   - 完了ボタンで LocalStorage にフラグを保存し、メイン画面へ遷移する。
2. ステータス画面: 
   - Warframe Status API (PC版) からのアラート、侵略、ワールドサイクル、ソーティ、仲裁、アルコン討伐戦(手に入るアルコンの欠片、ミッション)、バロ吉(=Void 商人)、Prime リサージェンス情報などの表示。
      - Void レリックは不要(レリック亀裂画面へ)
   - 報酬が良いアイテム（フォーマ、アダプター等）の視覚的強調。
3. Void レリック亀裂画面:
   - ティア別 (Lith, Meso, Neo, Axi/バンガード, オムニア) のグループ表示。
   - 通常 / 鋼の道のり / Void 嵐 のフィルタリング。
4. レリックシミュレーター:
   - レリック選択、精錬度設定、試行回数に基づくドロップシミュレーション。
   - 期待値および最低保証確率(レリックを何個開ければ95%ほどで目当てのアイテムが少なくとも1個出るか。いわゆる「天井」システムはないので期待値的に計算する)の算出。
5. 設定画面:
   - カラースキーム変更、テーマ切り替え、ワールドステータス機能の表示項目のON/OFF、設定リセット。
   - バージョン情報、使用ライブラリの表示。
6. その他:
   - リンク集、ヘルプ (GitHub Wiki 連携)。

## 技術的制約・ルール
1. API 通信: 
   - `https://api.warframestat.us/pc` をメインエンドポイントとする。
2. データ永続化 (設定保存):
   - `SettingsContext` (Context API) と `useSettings` (Custom Hook) を作成し、アプリ全体の設定（テーマ、表示項目、初回訪問フラグ等）を一元管理すること。
   - 設定値が変更されたら、自動的に LocalStorage へ同期・保存される仕組みにすること。
3. 時刻同期: 
   - 可能であれば正確な時刻同期ロジックを実装し、サイクルの残り時間を正確に表示する。
4. デプロイフロー (GitHub Actions):
   - `v*.*.*` 形式のバージョンタグがプッシュされた時のみ、ビルドおよび GitHub Pages へのデプロイを実行するワークフローを構成すること。
5. Antigravity への指示:
   - 実装は常に日本語で行うこと。
   - コメントを適宜日本語で書き込む。
   - コード修正時は、修正が必要な部分のみを出力する。

## 開発の第一歩
まずは、このコンテキストに基づき以下の環境設定ファイルを生成せよ。
1. Material 3 Expressive の色定義を含む `tailwind.config.js`
   - 以下の「デフォルト色定義」を使用し、ブラックモード用の設定もダークテーマをベースに追加すること。
2. Google Sans Flex と角丸ルールを定義した `src/index.css`
3. アプリ全体のレイアウトを管理する `App.tsx`、`SettingsContext.tsx`、`ThemeContext.tsx`
   - `App.tsx` 内で初回起動フラグをチェックし、未設定ならオンボーディングを表示するロジックを含めること。
4. `index.html` (Material Symbols Rounded の読み込みタグを追加)

## デフォルト色定義
### デフォルトカラー(緑)
ライトテーマ
```css
:root {
  /* Primary */
  --primary: #286A56;
  --on-primary: #E4FFF2;
  --primary-container: #AEF0D7;
  --on-primary-container: #175C49;
  --inverse-primary: #B9FCE2;

  /* Secondary */
  --secondary: #4C645A;
  --on-secondary: #E4FFF2;
  --secondary-container: #CEE9DC;
  --on-secondary-container: #3F574D;

  /* Tertiary */
  --tertiary: #2E6771;
  --on-tertiary: #EDFBFF;
  --tertiary-container: #B7EFFB;
  --on-tertiary-container: #215B65;

  /* Error */
  --error: #A83836;
  --on-error: #FFF7F6;
  --error-container: #FA746F;
  --on-error-container: #6E0A12;

  /* Background & Surface */
  --background: #F6FAF6;
  --on-background: #2B3530;
  --surface: #F6FAF6;
  --on-surface: #2B3530;
  --surface-variant: #DAE5DF;
  --on-surface-variant: #57615C;
  --inverse-surface: #0B0F0D;
  --inverse-on-surface: #999E9B;

  /* Surface Containers (M3E) */
  --surface-container-lowest: #FFFFFF;
  --surface-container-low: #EFF5F0;
  --surface-container: #E8F0EA;
  --surface-container-high: #E1EAE4;
  --surface-container-highest: #DAE5DF;
  --surface-dim: #D2DDD6;
  --surface-bright: #F6FAF6;

  /* Outline & Scrim */
  --outline: #737D78;
  --outline-variant: #AAB4AE;
  --scrim: #000000;
}
```
ダークテーマ
```css
:root {
  /* Primary */
  --primary: #9FD1BD;
  --on-primary: #174839;
  --primary-container: #2C5B4B;
  --on-primary-container: #BCEED9;
  --inverse-primary: #396858;

  /* Secondary */
  --secondary: #B2CCC0;
  --on-secondary: #2E453C;
  --secondary-container: #294037;
  --on-secondary-container: #ABC5B9;

  /* Tertiary */
  --tertiary: #DDF9FF;
  --on-tertiary: #2B636E;
  --tertiary-container: #B7EFFB;
  --on-tertiary-container: #205B65;

  /* Error */
  --error: #FA746F;
  --on-error: #490006;
  --error-container: #871F21;
  --on-error-container: #FF9993;

  /* Background & Surface */
  --background: #0B0F0D;
  --on-background: #DDE8E1;
  --surface: #0B0F0D;
  --on-surface: #DDE8E1;
  --surface-variant: #1E2824;
  --on-surface-variant: #A3AEA8;
  --inverse-surface: #F6FAF6;
  --inverse-on-surface: #515653;

  /* Surface Containers (M3E) */
  --surface-container-lowest: #000000;
  --surface-container-low: #0E1512;
  --surface-container: #141B18;
  --surface-container-high: #19211E;
  --surface-container-highest: #1E2824;
  --surface-dim: #0B0F0D;
  --surface-bright: #242E2A;

  /* Outline & Scrim */
  --outline: #6D7872;
  --outline-variant: #404A45;
  --scrim: #000000;
}
```

## 追加情報:レリックの精錬度とドロップ率の関係
- 参照: https://wikiwiki.jp/warframe/VOID%E3%83%AC%E3%83%AA%E3%83%83%E3%82%AF
### Void レリックとは:
- Prime パーツを入手するために、これを所持してVoid亀裂ミッションをプレイし、ミッションを完了/(エンドレスミッション)ラウンド完了でレリックに設定されている報酬の中から確率で1つPrime パーツまたはフォーマ設計図を入手する。
- レリックの内容物にはコモン/アンコモン/レアの報酬が設定されている。
  - コモンは3つの報酬が均等確率で設定されている
  - アンコモンは2つの報酬が均等確率で設定されている
  - レアは1つの報酬が設定されている

### 精錬とは:
- Void トレースを消費して、レリックの精錬度を上げ、アンコモン/レアのドロップ率を上げること。
- 精錬度は **無傷な**/**特別な**/**完璧な**/**光輝な** の順で高くなっていき、レアパーツのドロップ率が高くなる

### 精錬度とVoid トレースの消費量:
- **無傷な**(Intact)
  - 必要 Void トレース: 0(特殊な場合を除き、入手したときはこの精錬度となる)
  - コモン: 各25.33 %(計 約76%)
  - アンコモン: 各 11.00 %(計 22%)
  - レア: 2.00 %
- **特別な**(Exceptional)
  - 必要 Void トレース: 25
  - コモン: 各 23.33%(計 約70%)
  - アンコモン: 各 13.00%(計 26%)
  - レア: 4.00%
- **完璧な**(Flawless)
  - 必要 Void トレース: (**無傷な** から)50、(**特別な** から)25
  - コモン: 各 20.00%(計 60%)
  - アンコモン: 各 17.00%(計 34%)
  - レア: 6.00%
- **光輝な**(Radiant)
  - 必要 Void トレース: (**無傷な** から)100、(**特別な** から)75、(**完璧な** から)50
  - コモン: 各 16.67%(計 約50%)
  - アンコモン: 各 20.00%(計 40%)
  - レア: 10.00%(計 10%)
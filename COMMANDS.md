# 開発・運用コマンド一覧

このプロジェクトの開発、バージョン更新、デプロイに関するコマンド集です。

## 1. 開発関連 (基本)

### ローカルサーバー起動
開発用サーバーを立ち上げます。
```bash
npm run dev
```

### リント (静的解析)
コードの品質チェックを行います。
```bash
npm run lint
```

### ビルド (本番用)
TypeScriptの型チェックとビルドを行い、`dist` フォルダに出力します。
```bash
npm run build
```

---

## 2. バージョン更新 & デプロイ

このプロジェクトでは `npm version` コマンドでバージョンを管理し、GitタグのプッシュをトリガーにしてGitHub Pagesへ自動デプロイします。

### 手順 1: リリース文の準備
デプロイ前に、更新通知用のリリース文を作成します。
`src/data/updates.ts` を開き、templateをコピーして新しいバージョンのエントリを追加してください。
**注意:** ここで記述した `content` 部分（Markdown）が、GitHub Release の本文として自動抽出されます。

### 手順 2: バージョンを上げる
いずれかのコマンドを実行すると、`package.json` のバージョンが更新されます。

**パッチ (バグ修正など) : 0.1.0 -> 0.1.1**
```bash
npm version patch
```

**マイナー (機能追加など) : 0.1.0 -> 0.2.0**
```bash
npm version minor
```

**メジャー (大規模更新) : 0.1.0 -> 1.0.0**
```bash
npm version major
```

**特定のバージョンを指定 (プレリリース版など)**
```bash
npm version 0.2.0-beta
```

### 手順 3: GitHubへ反映してデプロイ開始
`npm version` コマンドを実行すると、自動的に git commit と git tag の作成が行われます。
あとは以下のコマンドでGitHubにプッシュするだけでデプロイが開始されます。

```bash
# 作成されたタグとコミットをプッシュ
git push origin main --tags
```

> **Note:**
> もし `npm version` で作成されたコミットを取り消したい場合は `git reset --soft HEAD~1` 、タグを消したい場合は `git tag -d v0.1.0` (バージョンは適宜変更) を使用します。

---
## 3. GitHub Pages 設定確認
デプロイが動かない場合は、GitHubリポジトリの以下を確認してください。

Settings > Pages > Build and deployment > Source
**"GitHub Actions"** に設定されている必要があります。

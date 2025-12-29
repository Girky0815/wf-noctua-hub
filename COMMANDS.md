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

### 手順 1: バージョンを上げる
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

### 手順 2: GitHubへ反映してデプロイ開始
バージョン変更をコミットし、タグを作成してプッシュします。

```bash
# 変更をステージング
git add .

# メッセージを付けてコミット
git commit -m "chore: アプリバージョンアップ"

# バージョンタグを作成 (例: v0.1.1)
# ※ package.json のバージョンと合わせる必要があります
git tag v0.1.1

# GitHubへプッシュ (デプロイが自動開始されます)
git push origin main --tags
```
> **Note:**
> `npm version` コマンドはデフォルトで git commit と git tag を自動作成しますが、現在の設定では `--no-git-tag-version` オプションなどは付けていないため、標準挙動に従います。もし `npm version` だけで完結させたい場合は、設定調整も可能です。現状は手動コミットも考慮した手順を記載しています。

---
## 3. GitHub Pages 設定確認
デプロイが動かない場合は、GitHubリポジトリの以下を確認してください。

Settings > Pages > Build and deployment > Source
**"GitHub Actions"** に設定されている必要があります。

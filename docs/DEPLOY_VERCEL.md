# Vercelへのデプロイ手順

このドキュメントでは、TrenpickをVercelにデプロイする手順を説明します。

## 📋 前提条件

- Vercelアカウント（[vercel.com](https://vercel.com)で作成）
- GitHubアカウント（コードをリポジトリにプッシュ済み）
- Supabaseプロジェクトが作成済み

## 🚀 デプロイ手順

### 1. GitHubにリポジトリをプッシュ

まず、プロジェクトをGitHubにプッシュします：

```bash
# リポジトリを初期化（まだの場合）
git init

# リモートリポジトリを追加
git remote add origin https://github.com/your-username/trenpick.git

# ファイルをコミット
git add .
git commit -m "Initial commit"

# メインブランチにプッシュ
git branch -M main
git push -u origin main
```

### 2. Vercelにプロジェクトをインポート

1. [Vercel Dashboard](https://vercel.com/dashboard)にログイン
2. 「Add New...」→「Project」をクリック
3. GitHubリポジトリから「trenpick」を選択
4. 「Import」をクリック

### 3. プロジェクト設定

#### 3.1 基本設定

- **Framework Preset**: Next.js（自動検出されるはず）
- **Root Directory**: `./`（デフォルト）
- **Build Command**: `npm run build`（デフォルト）
- **Output Directory**: `.next`（デフォルト）
- **Install Command**: `npm install`（デフォルト）

#### 3.2 環境変数の設定

「Environment Variables」セクションで以下の環境変数を追加：

| 名前 | 値 | 環境 |
|------|-----|------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://your-project.supabase.co` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `your-anon-key` | Production, Preview, Development |

**環境変数の取得方法：**
1. Supabaseダッシュボードにログイン
2. プロジェクトの「Settings」→「API」を開く
3. 「Project URL」と「anon public」キーをコピー

### 4. デプロイの実行

1. 「Deploy」ボタンをクリック
2. ビルドが完了するまで待機（通常1-3分）
3. デプロイが完了すると、URLが表示されます

### 5. Supabaseの設定を更新

デプロイ後、Supabaseの認証設定を更新する必要があります：

1. Supabaseダッシュボードにログイン
2. 「Authentication」→「URL Configuration」を開く
3. **Site URL** をVercelのURLに設定：
   ```
   https://your-project.vercel.app
   ```
4. **Redirect URLs** に以下を追加：
   ```
   https://your-project.vercel.app/dashboard
   https://your-project.vercel.app/**
   ```

### 6. データベースマイグレーションの実行

SupabaseのSQL Editorでマイグレーションファイルを実行：

1. Supabaseダッシュボードの「SQL Editor」を開く
2. `supabase/migrations/0000_init.sql` の内容をコピーして実行
3. `supabase/migrations/0001_add_profiles_insert_policy.sql` の内容をコピーして実行

## 🔄 継続的デプロイ（CD）

Vercelは自動的にGitHubリポジトリと連携します：

- **mainブランチへのpush**: 本番環境に自動デプロイ
- **その他のブランチへのpush**: プレビュー環境に自動デプロイ
- **Pull Request**: プレビュー環境が自動的に作成される

## 🛠 トラブルシューティング

### ビルドエラーが発生する場合

1. **環境変数が設定されているか確認**
   - Vercelダッシュボードの「Settings」→「Environment Variables」を確認

2. **ビルドログを確認**
   - デプロイページの「Build Logs」タブでエラーを確認

3. **ローカルでビルドが通るか確認**
   ```bash
   npm run build
   ```

### 認証が動作しない場合

1. **SupabaseのURL設定を確認**
   - Site URLとRedirect URLsが正しく設定されているか確認

2. **環境変数が正しいか確認**
   - Vercelの環境変数がSupabaseの値と一致しているか確認

3. **ブラウザのコンソールでエラーを確認**
   - 開発者ツールのコンソールタブでエラーメッセージを確認

### データベースエラーが発生する場合

1. **マイグレーションが実行されているか確認**
   - SupabaseのSQL Editorでテーブルが作成されているか確認

2. **RLSポリシーが設定されているか確認**
   - Supabaseの「Authentication」→「Policies」で確認

## 📝 カスタムドメインの設定（オプション）

1. Vercelダッシュボードでプロジェクトを開く
2. 「Settings」→「Domains」を開く
3. ドメイン名を入力して「Add」をクリック
4. 表示されるDNSレコードをドメインのDNS設定に追加

## 🔐 セキュリティのベストプラクティス

- 環境変数はVercelの環境変数設定で管理（`.env.local`をコミットしない）
- SupabaseのRLSポリシーを適切に設定
- 本番環境ではSupabaseの「anon key」のみを使用（service role keyは使用しない）

## 📚 参考リンク

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Supabase Documentation](https://supabase.com/docs)


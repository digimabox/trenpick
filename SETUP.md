# Trenpick セットアップガイド

## 📋 必要な環境

- Node.js 18以上
- npm または yarn
- Supabaseアカウント

## 🚀 セットアップ手順

### 1. 依存関係のインストール

```bash
npm install
```

### 2. Supabaseプロジェクトの作成

1. [Supabase](https://supabase.com)にアクセスしてアカウントを作成
2. 新しいプロジェクトを作成
3. プロジェクトのSettings > APIから以下を取得：
   - Project URL
   - anon/public key

### 3. 環境変数の設定

プロジェクトルートに `.env.local` ファイルを作成：

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. データベースのセットアップ

SupabaseのSQL Editorで `supabase/migrations/0000_init.sql` の内容を実行してください。

または、Supabase CLIを使用している場合：

```bash
supabase db push
```

### 5. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

## 🧪 テスト手順

1. **アカウント作成**
   - `/signup` にアクセス
   - メールアドレスとパスワードを入力して新規登録

2. **ダミーデータの投入**
   - ダッシュボードにログイン後、「ダミーデータを投入」ボタンをクリック
   - トレンド一覧にデータが表示されることを確認

3. **通知設定**
   - `/settings` にアクセス
   - Discord Webhook URLを入力して設定を保存

4. **通知APIのテスト**
   ```bash
   curl http://localhost:3000/api/cron/notify
   ```

## 📦 インストール済みパッケージ

以下のパッケージがインストール済みです：

```json
{
  "dependencies": {
    "@supabase/ssr": "^0.8.0",
    "@supabase/supabase-js": "^2.86.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "lucide-react": "^0.555.0",
    "next": "16.0.7",
    "react": "19.2.0",
    "react-dom": "19.2.0",
    "react-hook-form": "^7.x",
    "@hookform/resolvers": "^3.x",
    "zod": "^3.x",
    "tailwind-merge": "^3.4.0"
  }
}
```

## 🔧 トラブルシューティング

### ビルドエラーが発生する場合

環境変数が正しく設定されているか確認してください：

```bash
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### 認証が動作しない場合

1. SupabaseのAuthentication設定でEmail認証が有効になっているか確認
2. `.env.local` の環境変数が正しいか確認
3. ブラウザのコンソールでエラーを確認

### データベースエラーが発生する場合

1. SQL Editorでマイグレーションが正しく実行されたか確認
2. RLS (Row Level Security) ポリシーが正しく設定されているか確認

## 📝 次のステップ

- [ ] TikTok Shopからの実データ取得の実装
- [ ] メール通知の実装（SendGrid/Resend等）
- [ ] Cron Jobの設定（Vercel Cron等）
- [ ] より詳細なフィルタリング機能
- [ ] 通知履歴の表示


# Trenpick - TikTok Shop バズ通知ツール

TikTok Shop でバズり始めた商品を自動検知し、クリエイターやアフィリエイターに通知するマイクロ SaaS の MVP です。

## 🚀 機能

- **認証システム**: Supabase 認証によるログイン・サインアップ
- **トレンド一覧**: 今日のトレンド商品を一覧表示
- **通知設定**: Discord Webhook またはメールでの通知設定
- **通知 API**: 成長率が高い商品を自動検知して通知

## 🛠 技術スタック

- **フレームワーク**: Next.js 14 (App Router)
- **言語**: TypeScript
- **UI**: Tailwind CSS + shadcn/ui
- **認証・DB**: Supabase
- **通知**: Discord Webhook

## 📦 セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.local` ファイルを作成し、以下の環境変数を設定してください：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Supabase のセットアップ

1. [Supabase](https://supabase.com)でプロジェクトを作成
2. SQL Editor で `supabase/migrations/0000_init.sql` の内容を実行
3. 環境変数にプロジェクト URL と Anon Key を設定

### 4. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

## 📁 プロジェクト構造

```
trenpick/
├── app/
│   ├── (auth)/          # 認証ページ
│   │   ├── login/
│   │   └── signup/
│   ├── (dashboard)/     # ダッシュボード（認証必須）
│   │   ├── dashboard/   # トレンド一覧
│   │   └── settings/    # 通知設定
│   └── api/
│       └── cron/
│           └── notify/  # 通知API
├── components/
│   ├── ui/              # shadcn/uiコンポーネント
│   └── alert-settings-form.tsx
├── lib/
│   ├── supabase/        # Supabaseクライアント
│   ├── actions.ts       # Server Actions
│   └── notifications/   # 通知機能
├── types/               # 型定義
└── supabase/
    └── migrations/      # DBマイグレーション
```

## 🗄 データベーススキーマ

### profiles

- `id`: UUID (PK, auth.users 参照)
- `email`: TEXT
- `plan`: TEXT (default: 'free')
- `created_at`: TIMESTAMPTZ

### alert_settings

- `id`: UUID (PK)
- `user_id`: UUID (FK profiles.id)
- `notification_channel`: TEXT ('discord' | 'email')
- `discord_webhook_url`: TEXT
- `email_address`: TEXT
- `category`: TEXT
- `created_at`: TIMESTAMPTZ

### trends

- `id`: UUID (PK)
- `name`: TEXT
- `url`: TEXT
- `category`: TEXT
- `views_today`: INTEGER
- `views_yesterday`: INTEGER
- `growth_rate`: NUMERIC
- `created_at`: TIMESTAMPTZ
- `trend_date`: DATE

## 🔔 通知 API

通知 API は `/api/cron/notify` でアクセスできます。

```bash
curl http://localhost:3000/api/cron/notify
```

この API は以下の処理を行います：

1. 今日のトレンドデータから `growth_rate > 1.2` の商品を取得
2. 通知設定を持つ全ユーザーを取得
3. 各ユーザーの設定に基づいて Discord Webhook またはメールで通知

## 🧪 ダミーデータの投入

ダッシュボードページの「ダミーデータを投入」ボタンをクリックするか、以下の SQL を実行してダミーデータを投入できます：

```sql
-- 今日の日付でダミーデータを投入
INSERT INTO trends (name, url, category, views_today, views_yesterday, growth_rate, trend_date)
VALUES
  ('【人気急上昇】スマホスタンド 折りたたみ式', 'https://www.tiktokshop.com/product/example1', 'ガジェット', 125000, 45000, 2.78, CURRENT_DATE),
  ('LEDミラーリングライト 3色調光', 'https://www.tiktokshop.com/product/example2', '美容', 98000, 32000, 3.06, CURRENT_DATE);
```

## 📝 今後の実装予定

- [ ] TikTok Shop からの実データ取得（スクレイピング）
- [ ] メール通知の実装（SendGrid/Resend 等）
- [ ] 定期実行（Cron Job）
- [ ] より詳細なフィルタリング機能
- [ ] 通知履歴の表示

## 📄 ライセンス

Copyright (c) 2025 Trenpick. All Rights Reserved.

このソフトウェアおよび関連するドキュメントファイル（以下「ソフトウェア」）は、プロプライエタリソフトウェアです。無断での複製、配布、使用、変更は禁止されています。

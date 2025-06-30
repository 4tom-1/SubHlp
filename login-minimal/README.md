# ログイン機能 ミニマル版

このプロジェクトは、Firebase Authenticationを使用したログイン機能の最小限の実装です。

## 機能

- メール/パスワードでのログイン・サインアップ
- Googleサインイン
- パスワードリセット
- 認証状態の管理

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. Firebase設定

`.env.local`ファイルを作成し、Firebase設定を追加してください：

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 3. 開発サーバーの起動

```bash
npm run dev
```

## 使用方法

1. ブラウザで `http://localhost:3000` にアクセス
2. ログインページが表示されます
3. メール/パスワードまたはGoogleでログイン
4. ログイン成功後、ホームページにリダイレクトされます

## ファイル構成

```
login-minimal/
├── app/
│   ├── contexts/
│   │   └── AuthContext.tsx      # 認証コンテキスト
│   ├── login/
│   │   └── page.tsx             # ログインページ
│   ├── globals.css              # グローバルスタイル
│   ├── layout.tsx               # ルートレイアウト
│   └── page.tsx                 # ホームページ
├── components/
│   ├── ui/                      # UIコンポーネント
│   │   ├── alert.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── google-icon.tsx
│   │   ├── input.tsx
│   │   └── label.tsx
│   ├── auth.tsx                 # 認証コンポーネント
│   └── google-signin-button.tsx # Googleサインインボタン
├── lib/
│   ├── firebase.ts              # Firebase設定
│   └── utils.ts                 # ユーティリティ関数
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.mjs
├── postcss.config.mjs
└── components.json
```

## 技術スタック

- Next.js 15
- React 18
- TypeScript
- Tailwind CSS
- Firebase Authentication
- shadcn/ui コンポーネント 
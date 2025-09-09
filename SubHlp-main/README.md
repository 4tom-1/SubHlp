# サブ助 - サブスクリプション管理アプリ

*Developed using [v0.dev](https://v0.dev) and deployed via [Vercel](https://vercel.com)*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/ruzarohs-projects/v0-web)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.dev-black?style=for-the-badge)](https://v0.dev/chat/projects/kmMZjhLz5mh)

## 📝 概要

**サブ助**は、複数のサブスクリプション契約を一元管理し、ユーザーが月額・年額支出の可視化、無駄な支払いの見直し、類似サービスの比較まで行える生活支援型Webアプリです。

- 開発：学生チーム「Riora」
- 対象：U22プログラミングコンテスト応募作品
- 使用技術：v0.dev（AI UI生成） × Firebase × Vercel

## 🛠️ 開発・編集ページ

AIベースで作成されたUIの編集は以下から行えます：

✏️ **[https://v0.dev/chat/projects/kmMZjhLz5mh](https://v0.dev/chat/projects/kmMZjhLz5mh)**

## 🚀 機能一覧

- 📋 サブスクリプションの追加・一覧・削除
- 📊 月額・年額合計の自動算出
- 🟣 アクティブサービス数のカウント
- 🔔 通知設定（支払い日リマインドなど）
- 🔍 類似サービスの比較・節約提案（開発中）
- 🔐 多様な認証方式
  - メール・パスワード認証
  - Googleログイン
  - Microsoftログイン
  - X（旧Twitter）ログイン
- 🛡️ セキュリティ機能
  - ログイン試行回数制限
  - アカウントロックアウト
  - アカウント連携機能
  - 多要素認証（未実装）

## 📦 技術スタック

- フロントエンド：HTML / CSS / JavaScript（v0.devによる自動生成）
- バックエンド：Firebase（Firestore / Hosting / Authentication）
- デプロイ：Vercel
- 開発補助：ChatGPT / Figma

## 🔧 セットアップ

### Firebase設定

1. Firebaseコンソールでプロジェクトを作成
2. Authenticationを有効化し、以下のプロバイダーを設定：
   - Email/Password
   - Google
   - Microsoft
   - Twitter（X）
3. 環境変数を設定：
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

## ⚠️ よくある問題と対処法

### 認証エラー：`auth/account-exists-with-different-credential`

このエラーは、同じメールアドレスで異なる認証プロバイダー（Google、Microsoft、Xなど）でアカウントが既に存在する場合に発生します。

**対処方法：**
- 既にGoogleで登録済みの場合 → Googleログインを使用
- 既にMicrosoftで登録済みの場合 → Microsoftログインを使用
- 既にXで登録済みの場合 → Xログインを使用
- メール・パスワードで登録済みの場合 → メール・パスワードでログイン

**注意：** Firebaseでは、同じメールアドレスで複数の認証プロバイダーを使用することはできません。元の認証方法でログインしてください。

## 📄 ライセンス

このプロジェクトは教育目的で開発されたものであり、現在はオープンソースライセンスの対象外です。

---

**開発：チーム Riora（橋本・足立・アヤズ）**  
U22応募向けプロジェクトとして2025年夏に開発中。

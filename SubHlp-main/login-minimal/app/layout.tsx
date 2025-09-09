import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/app/contexts/AuthContext'

export const metadata: Metadata = {
  title: 'ログインアプリ',
  description: 'ログイン機能のデモ',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}

import type { Metadata } from 'next'
import './globals.css'
import { Auth } from '@/components/auth'
import { AuthProvider } from '@/app/contexts/AuthContext'

export const metadata: Metadata = {
  title: 'SM App',
  description: 'Created with v0',
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
          <div className="min-h-screen">
            <main className="container mx-auto px-4 py-8">
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}

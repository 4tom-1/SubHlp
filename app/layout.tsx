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
          <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <main className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-0">
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}

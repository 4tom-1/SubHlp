import type { Metadata } from 'next'
import './globals.css'
import { Auth } from '@/components/auth'

export const metadata: Metadata = {
  title: 'v0 App',
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
        <div className="min-h-screen">
          <header className="border-b">
            <div className="container mx-auto px-4 py-4 flex justify-end">
              <Auth />
            </div>
          </header>
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Nav from '@/components/Nav'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Epistemic Atlas',
  description: 'A structured protocol for converting real-world epistemic disputes into queryable knowledge bases.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Nav />
        <main className="min-h-screen">
          {children}
        </main>
        <footer className="border-t border-page-border mt-24 py-8">
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
            <span className="text-xs text-ink-faint uppercase tracking-wide">
              Epistemic Atlas -- FLF Epistemic Case Study Competition
            </span>
            <span className="text-xs text-ink-faint">
              Schema v2 -- Data status: partial
            </span>
          </div>
        </footer>
      </body>
    </html>
  )
}

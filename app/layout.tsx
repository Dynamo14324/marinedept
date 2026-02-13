import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Navigation } from '@/components/navigation'

export const metadata: Metadata = {
  title: 'IAnSI Executive Dashboard',
  description: 'Marine Department Intelligence and Analysis System Interface',
  generator: 'Next.js',
  applicationName: 'IAnSI Dashboard',
  referrer: 'origin-when-cross-origin',
  keywords: ['marine', 'analytics', 'dashboard', 'intelligence'],
  authors: [{ name: 'Marine Department' }],
  icons: {
    icon: '/favicon.ico',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className="antialiased">
        <Navigation />
        <div className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  )
}

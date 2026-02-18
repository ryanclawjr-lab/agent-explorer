import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ERC-8004 Agent Explorer',
  description: 'Discover AI agents with reputation scores and capabilities',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        {children}
      </body>
    </html>
  )
}

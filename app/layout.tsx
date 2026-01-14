import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Red Bull Cross-Media Campaign Optimizer',
  description: 'TV + Digital Attribution Optimizer',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: 'FreeSlot - Professional Availability Scheduling',
  description: 'Share your availability and schedule meetings faster. FreeSlot helps executive assistants coordinate meetings effortlessly.',
  keywords: ['scheduling', 'availability', 'calendar', 'meetings', 'executive assistant'],
  authors: [{ name: 'FreeSlot' }],
  openGraph: {
    title: 'FreeSlot - Professional Availability Scheduling',
    description: 'Share your availability and schedule meetings faster.',
    type: 'website',
    locale: 'en_US',
    siteName: 'FreeSlot'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FreeSlot - Professional Availability Scheduling',
    description: 'Share your availability and schedule meetings faster.'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'

export const metadata: Metadata = {
  title: 'HomeworkSathi — AI Homework Helper for Nepal',
  description: 'Solve any homework question instantly with step-by-step AI explanations. Available in English and Nepali for Grade 8–12 students.',
  keywords: ['homework', 'Nepal', 'AI', 'study', 'Grade 8-12', 'SEE', 'NEB'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}
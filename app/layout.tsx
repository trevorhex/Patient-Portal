import { ReactNode } from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

// import { Geist, Geist_Mono } from 'next/font/google'
// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// })
// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// })
// className={`${geistSans.variable} ${geistMono.variable} antialiased`}

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Patient Portal',
  description: 'A secure and user-friendly patient portal for managing your healthcare needs.'
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased flex flex-col min-h-screen`}>
        <Toaster
          position="top-right"
          toastOptions={{ ariaProps: { role: 'status', 'aria-live': 'polite' } }}
        />
        {children}
      </body>
    </html>
  )
}

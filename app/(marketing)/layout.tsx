import { ReactNode } from 'react'

import { Header } from './components/Header'
import { Footer } from './components/Footer'

export default function MarketingLayout ({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex flex-col flex-1">{children}</main>
      <Footer />
    </div>
  )
}

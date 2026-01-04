import { ReactNode } from 'react'

import { SkipLink } from '../components/SkipLink'
import { Header } from './components/Header'
import { Footer } from './components/Footer'

export default function MarketingLayout ({ children }: { children: ReactNode }) {
  return <>
    <SkipLink href="#main_content">Skip to main content</SkipLink>
    <Header />
    <main id="main_content" tabIndex={-1} className="flex flex-col flex-1 focus:outline-none">
      {children}
    </main>
    <Footer />
  </>
}

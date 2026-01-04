import { ReactNode } from 'react'
import { SkipLink } from '../components/SkipLink'
import { Navigation } from './components/Navigation'

export default function PortalLayout({ children }: { children: ReactNode }) {
  return <>
    <SkipLink href="#main_content">Skip to main content</SkipLink>
    <Navigation />
    <main id="main_content" tabIndex={-1} className="pl-16 md:pl-64 pt-0 min-h-screen focus:outline-none">
      <div className="max-w-6xl mx-auto p-4 md:p-8">{children}</div>
    </main>
  </>
}

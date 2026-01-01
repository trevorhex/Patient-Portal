import { ReactNode } from 'react'
import { Navigation } from './components/Navigation'

export default function PortalLayout({ children }: { children: ReactNode }) {
  return <>
    <Navigation />
    <main className="pl-16 md:pl-64 pt-0 min-h-screen">
      <div className="max-w-6xl mx-auto p-4 md:p-8">{children}</div>
    </main>
  </>
}

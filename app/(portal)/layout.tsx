import { ReactNode } from 'react'
import { Navigation } from './components/Navigation'
import { PortalMain } from './components/PortalMain'

export default function PortalLayout({ children }: { children: ReactNode }) {
  return <>
    <Navigation />
    <PortalMain>{children}</PortalMain>
  </>
}

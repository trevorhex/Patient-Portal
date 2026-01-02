'use client'

import { ReactNode, useRef, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useFocus } from '@/hooks/useFocus'

export const MAIN = 'main-portal'

export const PortalMain = ({ children }: { children: ReactNode }) => {
  const mainRef = useRef<HTMLElement>(null)
  const pathname = usePathname()
  const { focusElement, shouldFocus, resetFocus } = useFocus()

  useEffect(() => {
    if (mainRef.current && shouldFocus && focusElement === MAIN) {
      mainRef.current.focus()
      resetFocus()
    }
  }, [pathname, shouldFocus, resetFocus, focusElement])

  return (
    <main 
      ref={mainRef}
      className="pl-16 md:pl-64 pt-0 min-h-screen"
      tabIndex={-1}
      style={{ outline: 'none' }}
    >
      <div className="max-w-6xl mx-auto p-4 md:p-8">{children}</div>
    </main>
  )
}

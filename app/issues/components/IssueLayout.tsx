'use client'

import { ReactNode, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowLeftIcon } from 'lucide-react'
import { ROUTES } from '@/config/routes'
import { useFocus } from '@/hooks/useFocus'

export const MAIN = 'main-issue'

export interface IssueLayoutProps {
  children?: ReactNode
  heading?: string | ReactNode
  buttons?: ReactNode
}

export const IssueLayout = ({ heading, children = null, buttons = null }: IssueLayoutProps) => {
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
    <main ref={mainRef} className="w-full max-w-3xl mx-auto px-4 py-6 md:py-16">
      <div className="mb-6">
        <Link
          href={ROUTES.issues.base.href}
          className="inline-flex items-center text-sm text-gray-400 hover:text-gray-200 transition-colors"
        >
          <ArrowLeftIcon size={16} className="mr-1" />
          Back to Issues
        </Link>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-4">
          {typeof heading === 'string' && <h1 className="text-2xl font-bold">{heading}</h1>}
          {typeof heading === 'object' && heading}
          {buttons && <div className="flex items-center space-x-2">{buttons}</div>}
        </div>
      </div>
      {children}
    </main>
  )
}

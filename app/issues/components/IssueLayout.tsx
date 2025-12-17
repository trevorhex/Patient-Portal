import { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowLeftIcon } from 'lucide-react'
import { ROUTES } from '@/config/routes'

export interface IssueLayoutProps {
  children?: ReactNode
  heading?: string
  buttons?: ReactNode
}

export const IssueLayout = ({ heading, children = null, buttons = null }: IssueLayoutProps) => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-6 md:py-16">
      <div className="mb-6">
        <Link
          href={ROUTES.dashboard.href}
          className="inline-flex items-center text-sm text-gray-400 hover:text-gray-200 transition-colors"
        >
          <ArrowLeftIcon size={16} className="mr-1" />
          Back to Dashboard
        </Link>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-4">
          {heading && <h1 className="text-2xl font-bold">{heading}</h1>}
          {buttons && <div className="flex items-center space-x-2">{buttons}</div>}
        </div>
      </div>
      {children}
    </div>
  )
}

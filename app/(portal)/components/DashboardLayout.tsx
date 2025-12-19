import { ReactNode } from 'react'

export interface DashboardLayoutProps {
  children?: ReactNode
  heading?: string | ReactNode
  buttons?: ReactNode
}

export const DashboardLayout = ({ heading, children = null, buttons = null }: DashboardLayoutProps) => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between min-h-11">
        {typeof heading === 'string' && <h1 className="text-2xl font-bold">{heading}</h1>}
        {typeof heading === 'object' && heading}
        {buttons && <div className="flex items-center space-x-2">{buttons}</div>}
      </div>
      {children}
    </div>
  )
}

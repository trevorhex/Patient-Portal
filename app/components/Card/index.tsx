import { forwardRef, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface CardProps {
  children: ReactNode
  className?: string
  tabIndex?: number
}

export const Card = forwardRef<HTMLDivElement, CardProps>(({ children, className = '', tabIndex }, ref) => (
  <div
    ref={ref}
    className={cn(
      'bg-zinc-900 border border-zinc-700 rounded-lg shadow-sm p-6',
      'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-500',
      className
    )}
    tabIndex={tabIndex}
  >
    {children}
  </div>
))

Card.displayName = 'Card'

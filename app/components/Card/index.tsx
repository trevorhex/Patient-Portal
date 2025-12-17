import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface CardProps {
  children: ReactNode
  className?: string
}

export const Card = ({ children, className = '' }: CardProps) => (
  <div className={cn('bg-zinc-900 border border-zinc-700 rounded-lg shadow-sm p-6', className)}>
    {children}
  </div>
)

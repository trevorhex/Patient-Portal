import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { ButtonSize, ButtonVariant } from '../Button'
import { baseStyles, variants, sizes } from '../Button/styles'

export interface SkipLinkProps {
  href: string
  children: ReactNode
  className?: string
  size?: ButtonSize
  variant?: ButtonVariant
}

export const SkipLink = ({ href, children, className, size = 'md', variant = 'primary' }: SkipLinkProps) => (
  <a
    href={href}
    className={cn(
      'sr-only focus:not-sr-only',
      'absolute! top-1.5 left-1.5 z-50',
      baseStyles,
      variants[variant],
      sizes[size],
      className
    )}
  >
    {children}
  </a>
)

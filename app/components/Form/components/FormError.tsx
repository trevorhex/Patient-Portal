import { ReactNode, HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface FormErrorProps extends HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode
}

export const FormError = ({ className, children, ...props }: FormErrorProps) => (
  <p
    className={cn(
      'text-xs font-medium text-red-500',
      className
    )}
    {...props}
  >
    {children}
  </p>
)

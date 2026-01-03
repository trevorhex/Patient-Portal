import { ReactNode, HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { errorClass } from '../styles'

export interface FormErrorProps extends HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode
}

export const FormError = ({ className, children, ...props }: FormErrorProps) => (
  <p
    className={cn(
      'font-medium',
      errorClass,
      className
    )}
    {...props}
    area-live="polite"
  >
    {children}
  </p>
)

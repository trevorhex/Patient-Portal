import { ReactNode, HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface FormDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode
}

export const FormDescription = ({ className, children, ...props }: FormDescriptionProps) => (
  <p
    className={cn(
      'text-xs text-gray-500 dark:text-gray-400',
      className
    )}
    {...props}
  >
    {children}
  </p>
)

import { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface FormGroupProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export const FormGroup = ({ className, children, ...props }: FormGroupProps) => (
  <div
    className={cn(
      'flex flex-col gap-1',
      className
    )}
    {...props}
  >
    {children}
  </div>
)

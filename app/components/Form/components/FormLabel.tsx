import { ReactNode, LabelHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface FormLabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  children: ReactNode
}

export const FormLabel = ({ className, children, ...props }: FormLabelProps) => (
  <label
    className={cn(
      'text-sm font-medium text-gray-700 dark:text-gray-300',
      className
    )}
    {...props}
  >
    {children}
  </label>
)

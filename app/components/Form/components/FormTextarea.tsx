import { forwardRef, TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { baseStyles } from '../styles'

export type FormTextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        baseStyles,
        'min-h-20',
        className
      )}
      {...props}
    />
  )
)

FormTextarea.displayName = 'FormTextarea'

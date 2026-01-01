import { forwardRef, InputHTMLAttributes } from 'react'
import { Input } from '@headlessui/react'
import { cn } from '@/lib/utils'
import { baseStyles } from '../styles'

export type FormInputProps = InputHTMLAttributes<HTMLInputElement>

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ className, ...props }, ref) => (
    <Input
      ref={ref}
      className={cn(
        baseStyles,
        className
      )}
      {...props}
    />
  )
)

FormInput.displayName = 'FormInput'

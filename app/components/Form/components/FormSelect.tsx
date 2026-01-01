import { forwardRef, SelectHTMLAttributes } from 'react'
import { Select } from '@headlessui/react'
import { cn } from '@/lib/utils'
import { baseStyles } from '../styles'

export interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options?: Array<{ label: string; value: string | number }>
}

export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ className, children, options, ...props }, ref) => (
    <Select
      ref={ref}
      className={cn(
        baseStyles,
        'cursor-pointer',
        className
      )}
      {...props}
    >
      {options
        ? options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))
        : children}
    </Select>
  )
)

FormSelect.displayName = 'FormSelect'

import { ReactNode, FormHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export * from './components/FormDescription'
export * from './components/FormError'
export * from './components/FormInput'
export * from './components/FormSelect'
export * from './components/FormTextarea'
export * from './styles'

export interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  children: ReactNode
}

export const Form = ({ className, children, ...props }: FormProps) => (
  <form
    className={cn(
      'space-y-5',
      className
    )}
    {...props}
  >
    {children}
  </form>
)

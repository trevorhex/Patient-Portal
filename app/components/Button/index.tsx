import { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

import { baseStyles, variants, sizes } from './styles'
import { LoadingWheel } from './components/LoadingWheel'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

export const Button = ({
  className,
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  ...props
}: ButtonProps) => {
  const classNames = cn(
    baseStyles,
    variants[variant],
    sizes[size],
    isLoading && 'opacity-70 cursor-not-allowed',
    className
  )
  
  return (
    <button className={classNames} disabled={disabled || isLoading} {...props}>
      {isLoading ? <LoadingWheel /> : children}
    </button>
  )
}

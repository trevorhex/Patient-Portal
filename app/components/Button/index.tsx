import { ButtonHTMLAttributes } from 'react'
import Link from 'next/link'
import { Button as UIButton } from '@headlessui/react'
import { cn } from '@/lib/utils'
import { baseStyles, variants, sizes } from './styles'
import { LoadingWheel } from './components/LoadingWheel'

export type ButtonVariant = 'primary' | 'secondary' | 'muted' | 'outline' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  fullWidth?: boolean,
  href?: string
}

export const Button = ({
  className,
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  fullWidth = false,
  href,
  ...props
}: ButtonProps) => {
  const classNames = cn(
    baseStyles,
    variants[variant],
    sizes[size],
    isLoading && 'opacity-70 cursor-not-allowed',
    fullWidth && 'w-full',
    href && 'inline-block',
    className
  )

  const content = isLoading ? <LoadingWheel /> : children

  if (href) {
    return <Link href={href} className={classNames}>{content}</Link>
  }
  
  return (
    <UIButton className={classNames} disabled={disabled || isLoading} {...props}>
      {isLoading ? <LoadingWheel /> : children}
    </UIButton>
  )
}

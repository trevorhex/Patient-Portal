import { forwardRef, Ref, KeyboardEvent, ButtonHTMLAttributes } from 'react'
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
  onKeyDown?: (e: KeyboardEvent) => void
}

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  ({
    className,
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    disabled = false,
    fullWidth = false,
    href,
    onKeyDown,
    ...props
  }, ref) => {
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
      return <Link
        ref={ref as Ref<HTMLAnchorElement>}
        href={href} className={classNames}
        onKeyDown={onKeyDown}
      >{content}</Link>
    }
    
    return (
      <UIButton
        ref={ref as Ref<HTMLButtonElement>}
        className={classNames}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? <LoadingWheel /> : children}
      </UIButton>
    )
  } 
)

Button.displayName = 'Button'

import { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { baseStyles, variants, statusVariants, priorityVariants } from './styles'

export type BadgeVariant = 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'danger'
export type BadgeStatus = 'backlog' | 'todo' | 'in_progress' | 'done'
export type BadgePriority = 'low' | 'medium' | 'high'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  status?: BadgeStatus
  priority?: BadgePriority
}

export const Badge = ({
  className,
  variant,
  children,
  status,
  priority,
  ...props
}: BadgeProps) => {
  const badgeStatus = statusVariants[status as BadgeStatus]
  const badgePriority = priorityVariants[priority as BadgePriority]
  const badgeVariant: BadgeVariant = variant ?? badgeStatus ?? badgePriority ?? 'default'

  return (
    <span
      className={cn(
        baseStyles,
        variants[badgeVariant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

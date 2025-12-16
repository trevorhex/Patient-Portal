import { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { Status, Priority } from '@/types/Issue'
import { baseStyles, variants, statusVariants, priorityVariants } from './styles'

export type BadgeVariant = 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'danger'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  status?: Status
  priority?: Priority
}

export const Badge = ({
  className,
  variant,
  children,
  status,
  priority,
  ...props
}: BadgeProps) => {
  const badgeStatus = statusVariants[status as Status]
  const badgePriority = priorityVariants[priority as Priority]
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

import { BadgeVariant, BadgeStatus, BadgePriority } from './index'

export const baseStyles = `
  inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full
`

export const variants: { [K in BadgeVariant]: string } = {
  default: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  secondary: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  outline: 'border border-gray-200 text-gray-800 dark:border-dark-border-medium dark:text-gray-300',
  success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  danger: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
}

export const statusVariants: { [K in BadgeStatus]: BadgeVariant } = {
  backlog: 'secondary',
  todo: 'default',
  in_progress: 'warning',
  done: 'success'
}

export const priorityVariants: { [K in BadgePriority]: BadgeVariant } = {
  low: 'secondary',
  medium: 'default',
  high: 'danger'
}

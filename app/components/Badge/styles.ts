import { Status, Priority } from '@/types/issue'
import { BadgeVariant } from './index'

export const baseStyles = `
  inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full
`

export const variants: { [K in BadgeVariant]: string } = {
  default: 'bg-purple-900 text-purple-300',
  secondary: 'bg-gray-700 text-gray-300',
  outline: 'border border-gray-200 text-gray-300',
  success: 'bg-green-900 text-green-300',
  warning: 'bg-yellow-900 text-yellow-300',
  danger: 'bg-red-900 text-red-300',
}

export const statusVariants: { [K in Status]: BadgeVariant } = {
  backlog: 'secondary',
  todo: 'default',
  in_progress: 'warning',
  done: 'success'
}

export const priorityVariants: { [K in Priority]: BadgeVariant } = {
  low: 'secondary',
  medium: 'default',
  high: 'danger'
}

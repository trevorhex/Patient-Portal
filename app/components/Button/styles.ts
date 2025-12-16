import { ButtonVariant, ButtonSize } from './index'

export const baseStyles = `
  font-medium
  transition-colors
  cursor-pointer
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
  disabled:opacity-50 disabled:pointer-events-none
`

export const variants: { [K in ButtonVariant]: string } = {
  primary: 'bg-purple-600 text-white hover:bg-purple-700 active:bg-purple-800',
  secondary: 'bg-green-600 text-white hover:bg-green-700 active:bg-green-800',
  muted: 'bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600',
  outline: `
    border border-gray-300 bg-transparent hover:bg-gray-100
    dark:border-dark-border-medium dark:hover:bg-gray-900 dark:hover:text-gray-100 dark:text-gray-100
  `,
  ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-zinc-800 dark:hover:text-gray-100 dark:text-gray-100',
  danger: 'bg-red-600 text-white hover:bg-red-700'
}

export const sizes: { [K in ButtonSize]: string } = {
  sm: 'px-4 py-2 text-xs rounded-md',
  md: 'px-5 py-3 text-sm rounded-md',
  lg: 'px-6 py-3 text-base rounded-lg'
}

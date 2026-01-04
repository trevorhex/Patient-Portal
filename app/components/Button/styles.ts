import { ButtonVariant, ButtonSize } from './index'

export const baseStyles = `
  font-medium transition-colors cursor-pointer
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-color-white
  disabled:opacity-50 disabled:pointer-events-none
`

export const variants: { [K in ButtonVariant]: string } = {
  primary: 'bg-purple-600 text-white hover:bg-purple-700 active:bg-purple-800',
  secondary: 'bg-green-600 text-white hover:bg-green-700 active:bg-green-800',
  muted: 'bg-gray-700 text-gray-100 hover:bg-gray-600',
  outline: 'bg-transparent border border-zinc-700 hover:bg-zinc-800 text-gray-100',
  ghost: 'bg-transparent hover:bg-zinc-800 text-gray-100',
  danger: 'bg-red-600 text-white hover:bg-red-700'
}

export const sizes: { [K in ButtonSize]: string } = {
  sm: 'px-4! py-2! text-xs rounded-md',
  md: 'px-5! py-3! text-sm rounded-md',
  lg: 'px-6! py-3! text-base rounded-lg'
}

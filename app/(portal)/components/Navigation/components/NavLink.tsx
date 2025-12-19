import { cn } from '@/lib/utils'
import Link from 'next/link'

export interface NavLinkProps {
  href: string
  icon: React.ReactNode
  label: string
  isActive?: boolean
  size?: 'sm' | 'md'
}

export const NavLink = ({ href, icon, label, isActive, size }: NavLinkProps) => (
  <Link
    href={href}
    className={cn(
      'flex items-center px-2 rounded-md group transition-colors',
      size === 'sm' ? 'py-2 text-sm' : 'py-3 text-base',
      isActive
        ? 'bg-purple-600 text-white hover:bg-purple-700'
        : 'text-gray-300 hover:bg-zinc-800'
    )}
  >
    <span className={cn('mr-3', isActive ? 'text-white' : 'text-gray-500')}>{icon}</span>
    <span className="hidden md:inline">{label}</span>
  </Link>
)

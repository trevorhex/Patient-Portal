import { cn } from '@/lib/utils'
import Link from 'next/link'

export interface NavLinkProps {
  href: string
  icon: React.ReactNode
  label: string
  isActive?: boolean
}

export const NavLink = ({ href, icon, label, isActive }: NavLinkProps) => (
  <Link
    href={href}
    className={cn(
      'flex items-center px-2 py-3 text-sm font-medium rounded-md group transition-colors',
      isActive
        ? 'bg-purple-600 text-white hover:bg-purple-700'
        : 'dark:text-gray-300 dark:hover:bg-zinc-800'
    )}
  >
    <span className={cn('mr-3', isActive ? 'text-white' : 'dark:text-gray-500')}>{icon}</span>
    <span className="hidden md:inline">{label}</span>
  </Link>
)

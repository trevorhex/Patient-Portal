'use client'

import { usePathname } from 'next/navigation'
import { HomeIcon, PlusIcon } from 'lucide-react'
import { ROUTES } from '@/config/routes'
import { NavLink } from './NavLink'

export const NavMenu = () => {
  const pathname = usePathname()

  return (
    <nav className="flex-1 flex flex-col space-y-1">
      <NavLink
        href={ROUTES.dashboard.href}
        icon={<HomeIcon size={20} />}
        label="Dashboard"
        isActive={pathname === ROUTES.dashboard.href}
      />
      <NavLink
        href={ROUTES.issues.new.href}
        icon={<PlusIcon size={20} />}
        label="New Issue"
        isActive={pathname === ROUTES.issues.new.href}
      />
    </nav>
  )
}

'use client'

import { usePathname } from 'next/navigation'
import { HomeIcon, PlusIcon, List, ScanHeart } from 'lucide-react'
import { ROUTES } from '@/config/routes'
import { NavLink } from './NavLink'

export const NavMenu = () => {
  const pathname = usePathname()

  return (
    <nav className="flex-1 space-y-1">
      <NavLink
        href={ROUTES.dashboard.href}
        icon={<HomeIcon size={20} />}
        label={ROUTES.dashboard.name!}
        isActive={pathname === ROUTES.dashboard.href}
      />
      <NavLink
        href={ROUTES.profile.base.href}
        icon={<ScanHeart size={20} />}
        label={ROUTES.profile.base.name!}
        isActive={pathname === ROUTES.profile.base.href}
      />
      <NavLink
        href={ROUTES.issues.base.href}
        icon={<List size={20} />}
        label={ROUTES.issues.base.name!}
        isActive={pathname === ROUTES.issues.base.href}
      />
      <NavLink
        href={ROUTES.issues.new.href}
        icon={<PlusIcon size={20} />}
        label={ROUTES.issues.new.name!}
        isActive={pathname === ROUTES.issues.new.href}
      />
    </nav>
  )
}

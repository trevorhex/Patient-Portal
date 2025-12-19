'use client'

import { ROUTES } from '@/config/routes'
import { usePathname } from 'next/navigation'
import { Settings } from 'lucide-react'
import { NavLink } from './NavLink'

export const UserMenu = () => {
  const pathname = usePathname()
  return (
    <div className="space-y-1">
      <NavLink
        href={ROUTES.account.href}
        icon={<Settings size={20} />}
        label={ROUTES.account.name!}
        isActive={pathname === ROUTES.account.href}
        size="sm"
      />
    </div>
  )
}
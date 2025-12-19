import Link from 'next/link'
import { ROUTES } from '@/config/routes'
import { NavMenu } from './components/NavMenu'
import { UserNav } from './components/UserNav'

export const Navigation = () => (
  <aside
    className={`
      fixed inset-y-0 left-0 w-16 md:w-64 bg-zinc-900 border-r border-zinc-700
      flex flex-col py-4 px-2 md:px-4
    `}
  >
    <div className="flex items-center justify-center md:justify-start mb-8 px-2">
      <Link
        href={ROUTES.dashboard.href}
        className="text-xl font-bold tracking-tight"
      >
        <span className="hidden md:inline">Patient Portal</span>
        <span className="md:hidden">PP</span>
      </Link>
    </div>

    <NavMenu />

    <div className="pt-4 border-t border-zinc-700">
      <UserNav />
    </div>
  </aside>
)

import Link from 'next/link'
import { ROUTES } from '@/config/routes'
import { NavMenu } from './components/NavMenu'
import { UserEmail } from './components/UserEmail'

export const Navigation = () => (
  <aside
    className={`
      fixed inset-y-0 left-0 w-16 md:w-64 dark:bg-zinc-900 border-r dark:border-zinc-800
      flex flex-col py-4 px-2 md:px-4
    `}
  >
    <div className="flex items-center justify-center md:justify-start mb-8 px-2">
      <Link
        href={ROUTES.dashboard.href}
        className="text-xl font-bold tracking-tight text-gray-900 dark:text-white"
      >
        <span className="hidden md:inline">Patient Portal</span>
        <span className="md:hidden">PP</span>
      </Link>
    </div>

    <NavMenu />

    <div className="pt-4 border-t border-zync-600 dark:border-zinc-800">
      <UserEmail />
    </div>
  </aside>
)

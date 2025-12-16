import Link from 'next/link'
import { ROUTES } from '@/config/routes'
import { Button } from '../../components/Button'

export const Header = () => (
  <header className="border-b border-zinc-800">
    <div className="container mx-auto flex h-16 items-center justify-between px-4">
      <div className="flex items-center gap-8">
        <Link href="/" className="text-xl font-bold">
          Patient Portal
        </Link>
        <nav className="hidden md:flex gap-10 md:ml-4">
          {ROUTES.marketing.product.map(({ href, name }, i) => <Link
            key={i}
            href={href}
            className="text-sm font-medium hover:text-green-400 transition-colors"
          >
            {name}
          </Link>)}
        </nav>
      </div>
      <div className="flex items-center space-x-6">
        <Link href={ROUTES.auth.login.href}>
          <Button variant="outline">{ROUTES.auth.login.name}</Button>
        </Link>
        <Link href={ROUTES.auth.signup.href}>
          <Button>{ROUTES.auth.signup.name}</Button>
        </Link>
      </div>
    </div>
  </header>
)

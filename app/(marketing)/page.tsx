import Link from 'next/link'
import { ROUTES } from '@/config/routes'
import { Button } from '../components/Button'

export default function LandingPage() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 justify-center flex flex-col flex-1">
      <div className="text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight">
          Patient management <br className="hidden sm:block" />
          <span className="text-purple-600 dark:text-purple-400">
            simplified
          </span>
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-gray-600 dark:text-gray-300">
          An elegant patient management tool for modern practices.
        </p>
        <div className="mt-10">
          <Link href={ROUTES.auth.signup.href}>
            <Button size="lg">Get Started</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

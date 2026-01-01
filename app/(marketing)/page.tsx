import { ROUTES } from '@/config/routes'
import { Button } from '../components/Button'

export default function LandingPage() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 flex flex-col flex-1 justify-center text-center">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
        Health management <br className="hidden sm:block" />
        <span className="text-purple-400">simplified</span>
      </h1>
      <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-gray-400">
        Making healthcare accessible to all.
      </p>
      <div className="mt-10">
        <Button size="lg" href={ROUTES.auth.signup.href}>
          Get Started
        </Button>
      </div>
    </section>
  )
}

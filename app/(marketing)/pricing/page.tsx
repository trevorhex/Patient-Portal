import { Button } from '@/app/components/Button'
import { PricingCard } from './components/PricingCard'
import { pricingPlans } from './config'

export default function PricingPage() {
  return (
    <div className="container mx-auto px-4 py-16 text-white">
      <div className="max-w-2xl mx-auto text-center mb-18">
        <h1 className="text-4xl font-bold mb-4 text-white">
          Simple, Transparent Pricing
        </h1>
        <p className="text-xl text-gray-400 dark:text-gray-300">
          Choose the plan that&apos;s right for you and your family.
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-18">
        {pricingPlans.map((plan, i) => <PricingCard key={i} {...plan} />)}
      </div>

      <div className="max-w-3xl mx-auto mt-16 text-center bg-gray-800 rounded-lg p-10">
        <h2 className="text-2xl font-bold mb-4 text-white">
          Need a custom solution?
        </h2>
        <p className="text-lg text-gray-400 dark:text-gray-300 mb-8">
          Contact our sales team to discuss your specific requirements.
        </p>
        <a href="mailto:sales@linearclone.com">
          <Button size="lg">Contact Sales</Button>
        </a>
      </div>
    </div>
  )
}

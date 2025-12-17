import { Button } from '@/app/components/Button'
import { Card } from '@/app/components/Card'
import { MarketingLayout } from '../components/MarketingLayout'
import { PricingCard } from './components/PricingCard'
import { pricingPlans } from './config'

export default function PricingPage() {
  return (
    <MarketingLayout
      heading="Simple, Transparent Pricing"
      description="Choose the plan that&apos;s right for you and your family."
    ><>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-18">
        {pricingPlans.map((plan, i) => <PricingCard key={i} {...plan} />)}
      </div>

      <Card className="max-w-3xl mx-auto text-center p-10 border-transparent">
        <h2 className="text-2xl font-bold mb-4">
          Need a custom solution?
        </h2>
        <p className="text-lg text-gray-400 mb-8">
          Contact our sales team to discuss your specific requirements.
        </p>
        <a href="mailto:sales@patientportal.med">
          <Button size="lg">Contact Sales</Button>
        </a>
      </Card>
    </></MarketingLayout>
  )
}

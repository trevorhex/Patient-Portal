import { MarketingLayout } from '../components/MarketingLayout'
import { FeatureCard } from './components/FeatureCard'
import { features } from './config'

export default function FeaturesPage() {
  return (
    <MarketingLayout
      heading="Features"
      description="Discover how Patient Portal can help you manage your healthcare."
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, i) => <FeatureCard key={i} {...feature} />)}
      </div>
    </MarketingLayout>
  )
}

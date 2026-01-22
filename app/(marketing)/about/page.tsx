import { MarketingLayout } from '../components/MarketingLayout'
import { Virus } from './components/Virus'
import { Hero } from './components/Hero'
import { Mission } from './components/Mission'

export default function AboutPage() {
  return (
    <MarketingLayout className="flex flex-col flex-1">
      <Virus />
      <div className="relative z-10 pb-[20vh]">
        <Hero />
        <Mission />
      </div>
    </MarketingLayout>
  )
}

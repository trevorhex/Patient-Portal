import { MarketingLayout } from '../components/MarketingLayout'
import { FAQItem } from './components/FAQItem'
import { faqItems } from './config'

export default function FAQPage() {
  return (
    <MarketingLayout heading="Frequently Asked Questions">
      <div className="space-y-14 max-w-4xl mx-auto">
        {faqItems.map((item, i) => <FAQItem key={i} {...item} />)}
      </div>
    </MarketingLayout>
  )
}


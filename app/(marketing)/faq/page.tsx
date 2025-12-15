import { FAQItem } from './components/FAQItem'
import { faqItems } from './config'

export default function FAQPage() {
  return (
    <div className="max-w-9xl mx-auto px-4 py-16 text-white">
      <h2 className="text-4xl font-bold mb-16 text-center text-white">
        Frequently Asked Questions
      </h2>
      <div className="space-y-14">
        {faqItems.map((item, i) => <FAQItem key={i} {...item} />)}
      </div>
    </div>
  )
}

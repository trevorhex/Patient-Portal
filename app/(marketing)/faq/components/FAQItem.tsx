export interface FAQItemProps {
  question: string
  answer: string
}

export const FAQItem = ({ question, answer }: FAQItemProps) => (
  <div className="flex flex-col gap-2">
    <h4 className="text-xl font-semibold mb-2">{question}</h4>
    <p className="text-gray-400">{answer}</p>
  </div>
)

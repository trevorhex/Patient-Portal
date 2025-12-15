export interface FAQItemProps {
  question: string
  answer: string
}

export const FAQItem = ({ question, answer }: FAQItemProps) => (
  <div className="flex flex-col gap-2">
    <h4 className="text-xl font-semibold mb-2 text-white">{question}</h4>
    <p className="text-gray-400 dark:text-gray-300">{answer}</p>
  </div>
)

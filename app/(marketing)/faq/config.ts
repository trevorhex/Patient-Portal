import { FAQItemProps } from './components/FAQItem'

export const faqItems: FAQItemProps[] = [
  {
    question: 'What is Patient Portal?',
    answer: 'Patient Portal is a health management tool. It helps families organize, track, and manage their health in a simple and efficient way.'
  },
  {
    question: 'What technologies does Patient Portal use?',
    answer:
      'Patient Portal is built with Next.js, TypeScript, Tailwind CSS, and uses a PostgreSQL database. It leverages the latest features of Next.js App Router for optimal performance.'
  },
  {
    question: 'How do I create an account?',
    answer:
      'You can create an account by clicking the \'Sign Up\' button in the top navigation bar. You\'ll need to provide an email address and create a password.'
  },
  {
    question: 'Is it free to use?',
    answer: 'Yes, Patient Portal is completely free to use as it\'s an open-source project. You can even download the source code and host it yourself.'
  },
  {
    question: 'Can I contribute to the project?',
    answer: 'Absolutely! Patient Portalis open-source and contributions are welcome. Check out our GitHub repository to get started.'
  },
  {
    question: 'How do I report bugs or request features?',
    answer: 'You can report bugs or request features by opening an issue on our GitHub repository. We appreciate your feedback and contributions!'
  }
]

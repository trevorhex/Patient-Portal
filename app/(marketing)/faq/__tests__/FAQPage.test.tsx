import { ReactNode } from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import FAQPage from '../page'
import { faqItems as faqItemsConfig } from '../config'

vi.mock('../components/FAQItem', () => ({
  FAQItem: ({ question, answer }: { question: string; answer: string }) => (
    <div data-testid="faq-item"><h3>{question}</h3><p>{answer}</p></div>
  )
}))

vi.mock('../../components/MarketingLayout', () => ({
  MarketingLayout: ({ heading, children }: { heading: string; children: ReactNode }) => (
    <div data-testid="marketing-layout"><h1>{heading}</h1>{children}</div>
  )
}))

describe('FAQPage', () => {
  const renderComponent = () => render(<FAQPage />)

  it('renders all FAQ items', () => {
    renderComponent()
    
    const faqItems = screen.getAllByTestId('faq-item')
    expect(faqItems).toHaveLength(faqItemsConfig.length)
  })

  it('renders FAQ items with correct content', () => {
    renderComponent()

    faqItemsConfig.forEach(item => {
      expect(screen.getByText(item.question)).toBeInTheDocument()
      expect(screen.getByText(item.answer)).toBeInTheDocument()
    })
  })
})

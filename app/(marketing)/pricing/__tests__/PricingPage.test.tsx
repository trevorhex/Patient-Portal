import { ReactNode } from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import PricingPage from '../page'
import { PricingCardProps } from '../components/PricingCard'
import { pricingPlans as pricingConfig } from '../config'

vi.spyOn(console, 'error').mockImplementation(() => {})

const transformProps = (props: PricingCardProps) => Object.keys(props).reduce((propsObj, key) => ({
  ...propsObj,
  [key.toLowerCase()]: (props as any)[key].toString()
}), {} as Record<string, boolean>)

vi.mock('../components/PricingCard', () => ({
  PricingCard: (props: PricingCardProps) => <div data-testid="pricing-card" {...transformProps(props)} />
}))

vi.mock('../../components/MarketingLayout', () => ({
  MarketingLayout: ({ heading, children }: { heading: string; children: ReactNode }) => (
    <div data-testid="marketing-layout"><h1>{heading}</h1>{children}</div>
  )
}))

describe('PricingPage', () => {
  const renderComponent = () => render(<PricingPage />)

  it('renders all feature cards', () => {
    renderComponent()
    
    const pricingCards = screen.getAllByTestId('pricing-card')
    expect(pricingCards).toHaveLength(pricingConfig.length)
  })

  it('renders features cards with correct content', () => {
    renderComponent()

    const pricingCards = screen.getAllByTestId('pricing-card')

    pricingCards.forEach((card, i) => Object.keys(pricingConfig[i]).forEach(k => {
      const key = k.toLowerCase()
      switch (key) {
        case 'features':
          expect(card).toHaveAttribute(key, (pricingConfig[i] as any)[key].map(() => '[object Object]').join(','))
          break
        case 'disabled':
          expect(card).toHaveAttribute(key, '')
          break
        case 'highlighted':
          expect(card).toHaveAttribute(key, 'true')
          break
        default:
          expect(card).toHaveAttribute(key, (pricingConfig[i] as any)[key])
      }
    }))
  })

  it ('renders CTA content', () => {
    renderComponent()

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Need a custom solution?')
    expect(screen.getByText('Contact our sales team to discuss your specific requirements.')).toBeInTheDocument()
    expect(screen.getByRole('link')).toHaveTextContent('Contact Sales')
    expect(screen.getByRole('link')).toHaveAttribute('href', 'mailto:sales@patientportal.med')
  })
})

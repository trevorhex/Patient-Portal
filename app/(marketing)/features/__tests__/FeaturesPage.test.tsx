import { ReactNode } from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import FeaturesPage from '../page'
import { features as featuresConfig } from '../config'

vi.mock('../components/FeatureCard', () => ({
  FeatureCard: ({ title, description }: { title: string; description: string }) => (
    <div data-testid="feature-card"><h3>{title}</h3><p>{description}</p></div>
  )
}))

vi.mock('../../components/MarketingLayout', () => ({
  MarketingLayout: ({ heading, children }: { heading: string; children: ReactNode }) => (
    <div data-testid="marketing-layout"><h1>{heading}</h1>{children}</div>
  )
}))

describe('FAQPage', () => {
  const renderComponent = () => render(<FeaturesPage />)

  it('renders all feature cards', () => {
    renderComponent()
    
    const features = screen.getAllByTestId('feature-card')
    expect(features).toHaveLength(featuresConfig.length)
  })

  it('renders features cards with correct content', () => {
    renderComponent()

    featuresConfig.forEach(card => {
      expect(screen.getByText(card.title)).toBeInTheDocument()
      expect(screen.getByText(card.description)).toBeInTheDocument()
    })
  })
})

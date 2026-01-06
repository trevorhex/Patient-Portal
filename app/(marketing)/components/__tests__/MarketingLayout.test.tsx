import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MarketingLayout } from '../MarketingLayout'

describe('MarketingLayout', () => {
  const renderComponent = (props = {}) => render(<MarketingLayout {...props}><div data-testid="children" /></MarketingLayout>)

  it('renders children correctly', () => {
    renderComponent()
    
    expect(screen.getByTestId('children')).toBeInTheDocument()
  })

  it('renders heading when provided', () => {
    const heading = 'Test Heading'
    renderComponent({ heading })
    
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(heading)
  })

  it('renders description when provided', () => {
    const description = 'Test Description'
    renderComponent({ description })
    
    expect(screen.getByText(description)).toBeInTheDocument()
  })

  it('renders both heading and description when provided', () => {
    const heading = 'Test Heading'
    const description = 'Test Description'
    
    renderComponent({ heading, description })
    
    expect(screen.getByText(heading)).toBeInTheDocument()
    expect(screen.getByText(description)).toBeInTheDocument()
  })

  it('does not render heading/description when not provided', () => {
    const { container } = renderComponent()
    
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
    expect(container.querySelector('p')).toBeNull()
  })
})

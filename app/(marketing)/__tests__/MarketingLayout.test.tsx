import { vi, describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import MarketingLayout from '../layout'

vi.mock('../../components/SkipLink', () => ({ SkipLink: () => <a href="/#main_content" data-testid="skiplink" /> }))
vi.mock('../components/Header', () => ({ Header: () => <header data-testid="header" /> }))
vi.mock('../components/Footer', () => ({ Footer: () => <footer data-testid="footer" /> }))

describe('MarketingLayout', () => {
  const renderComponent = () => render(<MarketingLayout><div data-testid="children" /></MarketingLayout>)

  it('renders components', () => {
    renderComponent()
    expect(screen.getByTestId('skiplink')).toBeInTheDocument()
    expect(screen.getByTestId('header')).toBeInTheDocument()
    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getByTestId('footer')).toBeInTheDocument()
  })

  it('renders children the main element', () => {
    renderComponent()

    expect(screen.getByRole('main')).toContainElement(screen.getByTestId('children'))
  })
})

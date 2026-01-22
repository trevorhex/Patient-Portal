import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ROUTES } from '@/config/routes'
import { Header } from '../index'

vi.mock('../AuthButtons', () => ({ AuthButtons: () => <div data-testid="auth-buttons" /> }))

describe('Header', () => {
  const renderComponent = () => render(<Header />)

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the header element with correct styling', () => {
    renderComponent()

    expect(screen.getByRole('banner')).toBeInTheDocument()
  })

  it('renders the brand logo with correct link and text', () => {
    renderComponent()
    
    const brandLink = screen.getByRole('link', { name: 'Patient Portal' })
    expect(brandLink).toBeInTheDocument()
    expect(brandLink).toHaveAttribute('href', '/')
  })

  it('renders navigation menu with correct accessibility attributes', () => {
    renderComponent()
    
    const nav = screen.getByRole('navigation', { name: 'Main navigation menu' })
    expect(nav).toBeInTheDocument()
    expect(nav).toHaveAttribute('aria-label', 'Main navigation menu')
  })

  it('renders all navigation links from ROUTES config with correct href', () => {
    renderComponent()

    ROUTES.marketing.product.forEach(({ name, href }) => {
      const link = screen.getByRole('link', { name })
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', href)
    })
  })

  it('renders AuthButtons component', () => {
    render(<Header />)
    
    const authButtons = screen.getByTestId('auth-buttons')
    expect(authButtons).toBeInTheDocument()
  })
})

import { ReactNode } from 'react'
import { vi, describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ROUTES } from '@/config/routes'
import LandingPage from '../page'

vi.mock('../../components/Button', () => ({
  Button: ({ children, href, size }: { children: ReactNode; href: string; size: string }) => (
    <a href={href} data-size={size} data-testid="cta-button">{children}</a>
  )
}))

describe('LandingPage', () => {
  const renderComponent = () => render(<LandingPage />)

  it('renders the main heading', () => {
    renderComponent()
    
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Health management simplified')
  })

  it('renders the subtitle text', () => {
    renderComponent()
    
    expect(screen.getByText('Making healthcare accessible to all.')).toBeInTheDocument()
  })

  it('renders the CTA button', () => {
    renderComponent()
    
    const ctaButton = screen.getByTestId('cta-button')
    expect(ctaButton).toHaveTextContent('Get Started')
    expect(ctaButton).toHaveAttribute('href', ROUTES.auth.signup.href)
    expect(ctaButton).toHaveAttribute('data-size', 'lg')
  })
})
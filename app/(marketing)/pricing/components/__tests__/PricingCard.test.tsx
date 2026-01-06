import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PricingCard, PricingCardProps, PricingFeature } from '../PricingCard'

vi.mock('@/app/components/Button', () => ({
  Button: ({ children, variant, href, fullWidth, disabled, className }: any) => (
    <button data-variant={variant} data-href={href} data-fullwidth={fullWidth} disabled={disabled} className={className}>
      {children}
    </button>
  )
}))
vi.mock('@/app/components/Badge', () => ({ Badge: ({ children, className }: any) => <div data-testid="badge" className={className}>{children}</div> }))
vi.mock('@/app/components/Card', () => ({ Card: ({ children, className }: any) => <div data-testid="card" className={className}>{children}</div> }))
vi.mock('lucide-react', () => ({
  CheckCircle2: ({ className }: any) => <div data-testid="check-icon" className={className} />,
  XCircle: ({ className }: any) => <div data-testid="x-icon" className={className} />
}))

const mockFeatures: PricingFeature[] = [
  { name: 'Feature 1', included: true },
  { name: 'Feature 2', included: false },
  { name: 'Feature 3', included: true }
]

const defaultProps: PricingCardProps = {
  title: 'Basic Plan',
  price: '$29',
  description: 'Perfect for small teams',
  features: mockFeatures,
  buttonText: 'Get Started',
  buttonLink: '/signup'
}

describe('PricingCard', () => {
  const renderComponent = (props: Partial<PricingCardProps> = {}) => render(<PricingCard {...defaultProps} {...props} />)

  describe('basic rendering', () => {
    it('should render all required props correctly', () => {
      renderComponent()
      
      expect(screen.getByText('Basic Plan')).toBeInTheDocument()
      expect(screen.getByText('$29')).toBeInTheDocument()
      expect(screen.getByText('Perfect for small teams')).toBeInTheDocument()
      expect(screen.getByText('Get Started')).toBeInTheDocument()
    })

    it('should display default period when not provided', () => {
      renderComponent()
      expect(screen.getByText('per month')).toBeInTheDocument()
    })

    it('should display custom period when provided', () => {
      renderComponent({ period: 'per year' })
      expect(screen.getByText('per year')).toBeInTheDocument()
    })

    it('should not display period for custom pricing', () => {
      renderComponent({ price: 'Custom' })
      expect(screen.queryByText('per month')).not.toBeInTheDocument()
    })
  })

  describe('features', () => {
    it('should render all features with correct icons', () => {
      renderComponent()
      
      expect(screen.getByText('Feature 1')).toBeInTheDocument()
      expect(screen.getByText('Feature 2')).toBeInTheDocument()
      expect(screen.getByText('Feature 3')).toBeInTheDocument()

      expect(screen.getAllByTestId('check-icon')).toHaveLength(2)
      expect(screen.getAllByTestId('x-icon')).toHaveLength(1)
    })

    it('should apply correct styling for included features', () => {
      renderComponent()
      
      expect(screen.getByText('Feature 1')).toHaveClass('text-white')
      expect(screen.getByText('Feature 2')).toHaveClass('text-gray-500')
    })

    it('should handle empty features array', () => {
      renderComponent({ features: [] })
      
      expect(screen.queryByText('Feature 1')).not.toBeInTheDocument()
      expect(screen.queryByText('Feature 2')).not.toBeInTheDocument()
      expect(screen.queryByText('Feature 3')).not.toBeInTheDocument()

      expect(screen.queryByTestId('check-icon')).not.toBeInTheDocument()
      expect(screen.queryByTestId('x-icon')).not.toBeInTheDocument()
    })
  })

  describe('Button Configuration', () => {
    it('should render button with correct props for non-highlighted card', () => {
      renderComponent()
      
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('data-variant', 'outline')
      expect(button).toHaveAttribute('data-href', '/signup')
      expect(button).toHaveAttribute('data-fullwidth', 'true')
    })

    it('should render button with primary variant for highlighted card', () => {
      renderComponent({ highlighted: true })
      
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('data-variant', 'primary')
    })

    it('should disable button when disabled prop is true', () => {
      renderComponent({ disabled: true })
      
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
      expect(button).toHaveClass('pointer-events-none')
    })
  })

  describe('highlighting', () => {
    it('should apply highlighted styles when highlighted is true', () => {
      renderComponent({ highlighted: true })
      
      const card = screen.getByTestId('card')
      expect(card).toHaveClass('bg-purple-950 border-2 border-purple-600 shadow-md relative')
    })

    it('should not apply highlighted styles when highlighted is false', () => {
      renderComponent({ highlighted: false })
      
      const card = screen.getByTestId('card')
      expect(card).not.toHaveClass('bg-purple-950')
    })

    it('should render badge when provided', () => {
      renderComponent({ badge: 'Most Popular' })
      
      const badge = screen.getByTestId('badge')
      expect(badge).toBeInTheDocument()
      expect(badge).toHaveTextContent('Most Popular')
    })

    it('should not render badge when not provided', () => {
      renderComponent()
      
      expect(screen.queryByTestId('badge')).not.toBeInTheDocument()
    })
  })
})
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '../index'
import { baseStyles, variants, sizes } from '../styles'

vi.mock('../components/LoadingWheel', () => ({
  LoadingWheel: () => <div data-testid="loading-wheel">Loading...</div>
}))

describe('Button', () => {
  const renderComponent = (props: any = {}) => render(<Button {...props}>{props.children ?? 'Mock Button'}</Button>)

  describe('basic rendering', () => {
    it('renders children correctly', () => {
      renderComponent({ children: 'Click me' })
      expect(screen.getByText('Click me')).toBeInTheDocument()
    })

    it('applies base styles', () => {
      renderComponent()
      const button = screen.getByRole('button')
      expect(button).toHaveClass(...baseStyles.trim().split(' '))
    })

    it('applies default variant and size classes', () => {
      renderComponent()
      const button = screen.getByRole('button')
      expect(button).toHaveClass(...variants['primary'].split(' '))
      expect(button).toHaveClass(...sizes['md'].split(' '))
    })

    it('applies custom className', () => {
      renderComponent({ className: 'custom-class' })
      const button = screen.getByRole('button')
      expect(button).toHaveClass('custom-class')
    })

    it('forwards ref correctly', () => {
      const ref = vi.fn()
      renderComponent({ ref })
      expect(ref).toHaveBeenCalled()
    })
  })

  describe('variants', () => {
    it('renders primary variant correctly', () => {
      renderComponent({ variant: 'primary' })
      const button = screen.getByRole('button')
      expect(button).toHaveClass(...variants['primary'].split(' '))
    })

    it('renders secondary variant correctly', () => {
      renderComponent({ variant: 'secondary' })
      const button = screen.getByRole('button')
      expect(button).toHaveClass(...variants['secondary'].split(' '))
    })

    it('renders muted variant correctly', () => {
      renderComponent({ variant: 'muted' })
      const button = screen.getByRole('button')
      expect(button).toHaveClass(...variants['muted'].split(' '))
    })

    it('renders outline variant correctly', () => {
      renderComponent({ variant: 'outline' })
      const button = screen.getByRole('button')
      expect(button).toHaveClass(...variants['outline'].split(' '))
    })

    it('renders ghost variant correctly', () => {
      renderComponent({ variant: 'ghost' })
      const button = screen.getByRole('button')
      expect(button).toHaveClass(...variants['ghost'].split(' '))
    })

    it('renders danger variant correctly', () => {
      renderComponent({ variant: 'danger' })
      const button = screen.getByRole('button')
      expect(button).toHaveClass(...variants['danger'].split(' '))
    })
  })

  describe('sizes', () => {
    it('renders small size correctly', () => {
      renderComponent({ size: 'sm' })
      const button = screen.getByRole('button')
      expect(button).toHaveClass(...sizes['sm'].split(' '))
    })

    it('renders medium size correctly (default)', () => {
      renderComponent({ size: 'md' })
      const button = screen.getByRole('button')
      expect(button).toHaveClass(...sizes['md'].split(' '))
    })

    it('renders large size correctly', () => {
      renderComponent({ size: 'lg' })
      const button = screen.getByRole('button')
      expect(button).toHaveClass(...sizes['lg'].split(' '))
    })
  })

  describe('loading state', () => {
    it('shows loading wheel when isLoading is true', () => {
      renderComponent({ isLoading: true, children: 'Loading Button' })
      expect(screen.getByTestId('loading-wheel')).toBeInTheDocument()
      expect(screen.queryByText('Loading Button')).not.toBeInTheDocument()
    })

    it('applies loading styles when isLoading is true', () => {
      renderComponent({ isLoading: true })
      const button = screen.getByRole('button')
      expect(button).toHaveClass('opacity-70', 'cursor-not-allowed')
    })

    it('disables button when isLoading is true', () => {
      renderComponent({ isLoading: true })
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
    })
  })

  describe('disabled state', () => {
    it('disables button when disabled prop is true', () => {
      renderComponent({ disabled: true })
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
    })

    it('disables button when both disabled and isLoading are true', () => {
      renderComponent({ disabled: true, isLoading: true })
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
    })
  })

  describe('full width', () => {
    it('does not apply full width class by default', () => {
      renderComponent()
      const button = screen.getByRole('button')
      expect(button).not.toHaveClass('w-full')
    })

    it('applies full width class when fullWidth is true', () => {
      renderComponent({ fullWidth: true })
      const button = screen.getByRole('button')
      expect(button).toHaveClass('w-full')
    })
  })

  describe('link functionality', () => {
    it('renders as Link when href is provided', () => {
      renderComponent({ href: '/test' })
      const link = screen.getByRole('link')
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', '/test')
    })

    it('applies inline-block class when href is provided', () => {
      renderComponent({ href: '/test' })
      const link = screen.getByRole('link')
      expect(link).toHaveClass('inline-block')
    })

    it('shows loading wheel in link when isLoading is true', () => {
      renderComponent({ href: '/test', isLoading: true, children: 'Loading Link' })
      expect(screen.getByTestId('loading-wheel')).toBeInTheDocument()
      expect(screen.queryByText('Loading Link')).not.toBeInTheDocument()
    })

    it('forwards ref correctly for link', () => {
      const ref = vi.fn()
      renderComponent({ href: '/test', ref })
      expect(ref).toHaveBeenCalled()
    })
  })

  describe('event handling', () => {
    it('handles click events correctly', () => {
      const handleClick = vi.fn()
      renderComponent({ onClick: handleClick })
      
      fireEvent.click(screen.getByRole('button'))
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('handles keydown events correctly', () => {
      const handleKeyDown = vi.fn()
      renderComponent({ onKeyDown: handleKeyDown })
      
      fireEvent.keyDown(screen.getByRole('button'), { key: 'Enter' })
      expect(handleKeyDown).toHaveBeenCalledTimes(1)
    })

    it('handles keydown events on links correctly', () => {
      const handleKeyDown = vi.fn()
      renderComponent({ href: '/test', onKeyDown: handleKeyDown })
      
      fireEvent.keyDown(screen.getByRole('link'), { key: 'Enter' })
      expect(handleKeyDown).toHaveBeenCalledTimes(1)
    })

    it('does not trigger click when disabled', () => {
      const handleClick = vi.fn()
      renderComponent({ disabled: true, onClick: handleClick })
      
      fireEvent.click(screen.getByRole('button'))
      expect(handleClick).not.toHaveBeenCalled()
    })

    it('does not trigger click when loading', () => {
      const handleClick = vi.fn()
      renderComponent({ isLoading: true, onClick: handleClick })
      
      fireEvent.click(screen.getByRole('button'))
      expect(handleClick).not.toHaveBeenCalled()
    })
  })

  describe('HTML attributes', () => {
    it('passes through additional button props', () => {
      renderComponent({
        type: 'submit',
        id: 'test-button',
        'data-testid': 'custom-button',
        'aria-label': 'Custom button'
      })
      
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('type', 'submit')
      expect(button).toHaveAttribute('id', 'test-button')
      expect(button).toHaveAttribute('data-testid', 'custom-button')
      expect(button).toHaveAttribute('aria-label', 'Custom button')
    })
  })

  describe('complex combinations', () => {
    it('renders loading secondary button with large size and full width', () => {
      renderComponent({ variant: 'secondary', size: 'lg', isLoading: true, fullWidth: true, className: 'extra-class' })
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass(...variants['secondary'].split(' '))
      expect(button).toHaveClass(...sizes['lg'].split(' '))
      expect(button).toHaveClass('opacity-70', 'cursor-not-allowed', 'w-full', 'extra-class')
      expect(button).toBeDisabled()
      expect(screen.getByTestId('loading-wheel')).toBeInTheDocument()
    })

    it('renders danger variant link with small size', () => {
      renderComponent({ href: '/danger', variant: 'danger', size: 'sm' })
      
      const link = screen.getByRole('link')
      expect(link).toHaveClass(...variants['danger'].split(' '))
      expect(link).toHaveClass(...sizes['sm'].split(' '))
      expect(link).toHaveAttribute('href', '/danger')
    })
  })

  describe('display name', () => {
    it('has correct display name', () => {
      expect(Button.displayName).toBe('Button')
    })
  })
})

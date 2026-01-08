import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { NavLink, NavLinkProps } from '../NavLink'
import { ROUTES } from '@/config/routes'

const defaultProps: NavLinkProps = {
  href: '/dashboard',
  icon: <svg data-testid="nav-icon" />,
  label: 'Dashboard',
  isActive: false,
  size: 'md'
}

describe('NavLink', () => {
  const renderComponent = (props: Partial<NavLinkProps> = {}) => render(<NavLink {...defaultProps} {...props} />)

  describe('rendering', () => {
    it('should render with required props', () => {
      renderComponent()
      
      const link = screen.getByRole('link')
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', ROUTES.dashboard.href)
      expect(screen.getByTestId('nav-icon')).toBeInTheDocument()
      expect(screen.getByText('Dashboard')).toBeInTheDocument()
    })

    it('should render icon and label correctly', () => {
      renderComponent({
        icon: <svg data-testid="user-icon" />,
        label: 'Profile'
      })

      expect(screen.getByTestId('user-icon')).toBeInTheDocument()
      expect(screen.getByText('Profile')).toBeInTheDocument()
    })

    it('should render with custom href', () => {
      renderComponent({ href: '/settings' })
      
      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('href', '/settings')
    })
  })

  describe('active state', () => {
    it('should apply active styles when isActive is true', () => {
      renderComponent({ isActive: true })
      
      const link = screen.getByRole('link')
      expect(link).toHaveClass('bg-purple-600', 'text-white', 'hover:bg-purple-700')
      expect(link).not.toHaveClass('text-gray-300', 'hover:bg-zinc-800')
    })

    it('should apply inactive styles when isActive is false', () => {
      renderComponent({ isActive: false })
      
      const link = screen.getByRole('link')
      expect(link).toHaveClass('text-gray-300', 'hover:bg-zinc-800')
      expect(link).not.toHaveClass('bg-purple-600', 'text-white', 'hover:bg-purple-700')
    })

    it('should apply inactive styles when isActive is undefined', () => {
      renderComponent({ isActive: undefined })
      
      const link = screen.getByRole('link')
      expect(link).toHaveClass('text-gray-300', 'hover:bg-zinc-800')
    })

    it('should apply correct icon color when active', () => {
      renderComponent({ isActive: true })
      
      const iconSpan = screen.getByTestId('nav-icon').parentElement
      expect(iconSpan).toHaveClass('text-white')
    })

    it('should apply correct icon color when inactive', () => {
      renderComponent({ isActive: false })
      
      const iconSpan = screen.getByTestId('nav-icon').parentElement
      expect(iconSpan).toHaveClass('text-gray-500')
    })
  })

  describe('sizes', () => {
    it('should apply small size styles when size is "sm"', () => {
      renderComponent({ size: 'sm' })
      
      const link = screen.getByRole('link')
      expect(link).toHaveClass('py-2', 'text-sm')
      expect(link).not.toHaveClass('py-3', 'text-base')
    })

    it('should apply medium size styles when size is "md"', () => {
      renderComponent({ size: 'md' })
      
      const link = screen.getByRole('link')
      expect(link).toHaveClass('py-3', 'text-base')
      expect(link).not.toHaveClass('py-2', 'text-sm')
    })

    it('should default to medium size when size is undefined', () => {
      renderComponent({ size: undefined })
      
      const link = screen.getByRole('link')
      expect(link).toHaveClass('py-3', 'text-base')
    })
  })

  describe('accessibility', () => {
    it('should have proper link role', () => {
      renderComponent()
      
      const link = screen.getByRole('link')
      expect(link).toBeInTheDocument()
    })

    it('should be accessible by label text', () => {
      renderComponent({ label: 'My Custom Label' })
      
      expect(screen.getByText('My Custom Label')).toBeInTheDocument()
    })

    it('should maintain proper link semantics', () => {
      renderComponent()
      
      const link = screen.getByRole('link')
      expect(link.tagName.toLowerCase()).toBe('a')
    })
  })

  describe('edge cases', () => {
    it('should handle empty string href', () => {
      renderComponent({ href: '' })
      
      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('href', '')
    })

    it('should handle special characters in label', () => {
      renderComponent({ label: 'Test & More > Special <chars>' })
      
      expect(screen.getByText('Test & More > Special <chars>')).toBeInTheDocument()
    })

    it('should handle null icon gracefully', () => {
      renderComponent({ icon: null })
      
      const link = screen.getByRole('link')
      expect(link).toBeInTheDocument()
      expect(screen.getByText('Dashboard')).toBeInTheDocument()
    })

    it('should handle complex icon elements', () => {
      const ComplexIcon = () => (
        <div data-testid="complex-icon">
          <span>Icon</span>
          <span>Text</span>
        </div>
      )
      
      renderComponent({ icon: <ComplexIcon /> })
      
      expect(screen.getByTestId('complex-icon')).toBeInTheDocument()
    })
  })

  describe('props', () => {
    it('should render correctly with all props active and small size', () => {
      renderComponent({
        href: '/profile',
        icon: <svg data-testid="profile-icon" />,
        label: 'Profile',
        isActive: true,
        size: 'sm'
      })
      
      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('href', '/profile')
      expect(link).toHaveClass('py-2', 'text-sm', 'bg-purple-600', 'text-white')
      expect(screen.getByTestId('profile-icon')).toBeInTheDocument()
      expect(screen.getByText('Profile')).toBeInTheDocument()
    })

    it('should render correctly with inactive state and medium size', () => {
      renderComponent({
        href: '/settings',
        isActive: false,
        size: 'md'
      })
      
      const link = screen.getByRole('link')
      expect(link).toHaveClass('py-3', 'text-base', 'text-gray-300')
    })
  })
})

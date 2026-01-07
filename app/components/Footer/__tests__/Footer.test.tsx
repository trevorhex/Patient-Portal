import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Footer, FooterProps } from '../index'

vi.mock('../components/TimeStamp', () => ({ TimeStamp: () => '2026' }))

describe('Footer', () => {
  const renderComponent = (props: Partial<FooterProps> = {}) => render(<Footer {...props} />)

  it('renders without crashing', () => {
    renderComponent()
    const footer = screen.getByRole('contentinfo')
    expect(footer).toBeInTheDocument()
  })

  it('renders the copyright text with timestamp', () => {
    renderComponent()
    expect(screen.getByText(/© 2026 Patient Portal. All rights reserved./)).toBeInTheDocument()
  })

  it('applies custom className when provided', () => {
    renderComponent({ className: 'custom-footer-class' })
    const footer = screen.getByRole('contentinfo')
    expect(footer).toHaveClass('custom-footer-class')
  })

  it('does not apply className when not provided', () => {
    renderComponent()
    const footer = screen.getByRole('contentinfo')
    expect(footer).not.toHaveAttribute('class')
  })

  it('renders children when provided', () => {
    const testContent = 'Custom footer content'
    renderComponent({ children: testContent })
    expect(screen.getByText(testContent)).toBeInTheDocument()
  })

  it('renders multiple children correctly', () => {
    const children = <>
      <div>First child</div>
      <div>Second child</div>
    </>
    renderComponent({ children })
    expect(screen.getByText('First child')).toBeInTheDocument()
    expect(screen.getByText('Second child')).toBeInTheDocument()
  })

  it('renders without children when children prop is null', () => {
    renderComponent({ children: null })
    const footer = screen.getByRole('contentinfo')
    expect(footer).toBeInTheDocument()
    expect(screen.getByText(/© 2026 Patient Portal. All rights reserved./)).toBeInTheDocument()
  })

  it('renders without children when children prop is undefined', () => {
    renderComponent({ children: undefined })
    const footer = screen.getByRole('contentinfo')
    expect(footer).toBeInTheDocument()
    expect(screen.getByText(/© 2026 Patient Portal. All rights reserved./)).toBeInTheDocument()
  })

  it('combines children with copyright section', () => {
    const customContent = 'Additional footer links'
    renderComponent({ children: customContent })
    
    expect(screen.getByText(customContent)).toBeInTheDocument()
    expect(screen.getByText(/© 2026 Patient Portal. All rights reserved./)).toBeInTheDocument()
  })

  it('renders Timestamp component', () => {
    renderComponent()
    expect(screen.getByText(/2026/)).toBeInTheDocument()
  })

  describe('props interface', () => {
    it('accepts all valid FooterProps', () => {
      const props: FooterProps = {
        children: <div>Test child</div>,
        className: 'test-class'
      }
      
      renderComponent(props)
      expect(screen.getByText('Test child')).toBeInTheDocument()
      expect(screen.getByRole('contentinfo')).toHaveClass('test-class')
    })

    it('works with minimal props', () => {
      const props: FooterProps = {}
      renderComponent(props)
      expect(screen.getByRole('contentinfo')).toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    it('uses semantic footer element', () => {
      renderComponent()
      expect(screen.getByRole('contentinfo')).toBeInTheDocument()
    })

    it('has accessible copyright text', () => {
      renderComponent()
      const copyrightText = screen.getByText(/© 2026 Patient Portal. All rights reserved./)
      expect(copyrightText).toBeInTheDocument()
      expect(copyrightText.tagName).toBe('P')
    })
  })

  describe('edge cases', () => {
    it('handles empty string as children', () => {
      renderComponent({ children: '' })
      expect(screen.getByRole('contentinfo')).toBeInTheDocument()
      expect(screen.getByText(/© 2026 Patient Portal. All rights reserved./)).toBeInTheDocument()
    })

    it('handles empty string as className', () => {
      renderComponent({ className: '' })
      const footer = screen.getByRole('contentinfo')
      expect(footer).toHaveAttribute('class', '')
    })
  })
})

import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { baseStyles, variants, sizes } from '../../Button/styles'
import { SkipLink, SkipLinkProps } from '../index'

const defaultProps = {
  href: '#main-content',
  children: 'Skip to main content'
}

describe('SkipLink', () => {
  const renderComponent = (props: Partial<SkipLinkProps> = {}) => render(<SkipLink {...defaultProps} {...props} />)

  it('renders with required props', () => {
    renderComponent()
    
    const link = screen.getByRole('link')
    expect(link).toBeInTheDocument()
    expect(link).toHaveTextContent('Skip to main content')
    expect(link).toHaveAttribute('href', '#main-content')
  })

  it('applies default size and variant when not specified', () => {
    renderComponent()
    
    const link = screen.getByRole('link')
    expect(link).toHaveClass(...variants['primary'].split(' '))
    expect(link).toHaveClass(...sizes['md'].split(' '))
  })

  it('applies custom size when provided', () => {
    renderComponent({ size: 'lg' })
    
    const link = screen.getByRole('link')
    expect(link).toHaveClass(...sizes['lg'].split(' '))
  })

  it('applies custom variant when provided', () => {
    renderComponent({ variant: 'secondary' })
    
    const link = screen.getByRole('link')
    expect(link).toHaveClass(...variants['secondary'].split(' '))
  })

  it('applies custom className when provided', () => {
    renderComponent({ className: 'custom-class' })
    
    const link = screen.getByRole('link')
    expect(link).toHaveClass('custom-class')
  })

  it('applies all required CSS classes for skip link functionality', () => {
    renderComponent()
    
    const link = screen.getByRole('link')
    expect(link).toHaveClass('sr-only', 'focus:not-sr-only')
  })

  it('applies base button styles', () => {
    renderComponent()
    
    const link = screen.getByRole('link')
    expect(link).toHaveClass(...baseStyles.trim().split(' '))
  })

  it('renders different href values correctly', () => {
    const { rerender } = renderComponent({ href: '#navigation' })
    
    let link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '#navigation')

    rerender(<SkipLink {...defaultProps} href="/page" />)
    link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/page')
  })

  it('renders different children content', () => {
    const { rerender } = renderComponent({ href: '#main', children: 'Skip to content' })
    
    let link = screen.getByRole('link')
    expect(link).toHaveTextContent('Skip to content')

    rerender(<SkipLink href="#main">Custom skip text</SkipLink>)
    link = screen.getByRole('link')
    expect(link).toHaveTextContent('Custom skip text')
  })

  it('combines all variant and size combinations correctly', () => {
    Object.keys(variants).forEach(variant => {
      Object.keys(sizes).forEach(size => {
        const { unmount } = renderComponent({ variant, size } as any)
        
        const link = screen.getByRole('link')
        expect(link).toHaveClass(...variants[variant as keyof typeof variants].split(' '))
        expect(link).toHaveClass(...sizes[size as keyof typeof sizes].split(' '))
        
        unmount()
      })
    })
  })

  it('maintains accessibility attributes', () => {
    renderComponent()
    
    const link = screen.getByRole('link')
    expect(link.tagName).toBe('A')
    expect(link).toHaveAttribute('href')
  })

  it('handles complex children elements', () => {
    const children = <>
      <span>Skip to </span>
      <strong>main content</strong>
    </>
    renderComponent({ href: '#main', children })
    
    const link = screen.getByRole('link')
    expect(link).toHaveTextContent('Skip to main content')
    expect(link.querySelector('span')).toBeInTheDocument()
    expect(link.querySelector('strong')).toBeInTheDocument()
  })

  it('preserves href with query parameters and fragments', () => {
    renderComponent({ href: '#main?param=value&other=test' })
    
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '#main?param=value&other=test')
  })
})

import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { FormDescription, FormDescriptionProps } from '../FormDescription'

describe('FormDescription', () => {
  const renderComponent = (props: Partial<FormDescriptionProps> = {}) => render(<FormDescription {...props}>{props.children ?? 'Mock'}</FormDescription>)

  it('renders children correctly', () => {
    renderComponent()
    expect(screen.getByText('Mock')).toBeInTheDocument()
  })

  it('renders as a paragraph element', () => {
    renderComponent()
    
    const element = screen.getByText('Mock')
    expect(element.tagName).toBe('P')
  })

  it('applies default classes', () => {
    renderComponent()
    
    const element = screen.getByRole('paragraph')
    expect(element).toHaveClass('text-xs', 'text-gray-400')
  })

  it('merges custom className with default classes', () => {
    renderComponent({ className: 'custom-class' })
    
    const element = screen.getByRole('paragraph')
    expect(element).toHaveClass('text-xs', 'text-gray-400', 'custom-class')
  })

  it('passes through HTML attributes', () => {
    renderComponent({ id: 'test-id', 'data-testid': 'form-description', role: 'note', children: 'Test description' } as any)
    
    const element = screen.getByText('Test description')
    expect(element).toHaveAttribute('id', 'test-id')
    expect(element).toHaveAttribute('data-testid', 'form-description')
    expect(element).toHaveAttribute('role', 'note')
  })

  it('renders complex children', () => {
    renderComponent({ children: <><span>Complex</span> <strong>description</strong> content</> })
    
    expect(screen.getByText('Complex')).toBeInTheDocument()
    expect(screen.getByText('description')).toBeInTheDocument()
    expect(screen.getByText('content')).toBeInTheDocument()
  })

  it('handles null className', () => {
    renderComponent({ className: null } as any)
    
    const element = screen.getByRole('paragraph')
    expect(element).toHaveClass('text-xs', 'text-gray-400')
  })

  it('handles multiple custom classes', () => {
    renderComponent({ className: 'class1 class2 class3' })
    
    const element = screen.getByRole('paragraph')
    expect(element).toHaveClass('text-xs', 'text-gray-400', 'class1', 'class2', 'class3')
  })

  it('applies inline styles correctly', () => {
    renderComponent({ style: { fontSize: '14px', color: 'rgb(255, 0, 0)' } })
    
    const element = screen.getByRole('paragraph')
    expect(element).toHaveStyle({ fontSize: '14px', color: 'rgb(255, 0, 0)' })
  })

  it('maintains accessibility with aria attributes', () => {
    renderComponent({ 'aria-describedby': 'field-id', 'aria-label': 'Field description' })
    
    const element = screen.getByRole('paragraph')
    expect(element).toHaveAttribute('aria-describedby', 'field-id')
    expect(element).toHaveAttribute('aria-label', 'Field description')
  })

  it('handles long text content', () => {
    const longText = 'This is a very long description that might wrap to multiple lines and should still be handled correctly by the component.'.repeat(5)
    renderComponent({ children: longText })
    
    expect(screen.getByText(longText)).toBeInTheDocument()
  })
})

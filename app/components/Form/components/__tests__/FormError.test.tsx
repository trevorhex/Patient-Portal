import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { FormError, FormErrorProps } from '../FormError'
import { errorClass } from '../../styles'

describe('FormError', () => {
  const renderComponent = (props: Partial<FormErrorProps> = {}) => render(<FormError {...props}>{props.children ?? 'Mock error'}</FormError>)

  it('renders children correctly', () => {
    renderComponent()
    expect(screen.getByText('Mock error')).toBeInTheDocument()
  })

  it('renders as a paragraph element', () => {
    renderComponent()
    
    const element = screen.getByText('Mock error')
    expect(element.tagName).toBe('P')
  })

  it('has alert role by default', () => {
    renderComponent()
    
    const element = screen.getByRole('alert')
    expect(element).toBeInTheDocument()
  })

  it('applies default classes including errorClass', () => {
    renderComponent()
    
    const element = screen.getByRole('alert')
    expect(element).toHaveClass('font-medium', errorClass)
  })

  it('merges custom className with default classes', () => {
    renderComponent({ className: 'custom-class' })
    
    const element = screen.getByRole('alert')
    expect(element).toHaveClass('font-medium', errorClass, 'custom-class')
  })

  it('passes through HTML attributes', () => {
    renderComponent({ id: 'test-id', 'data-testid': 'form-error', children: 'Test error message' } as any)
    
    const element = screen.getByText('Test error message')
    expect(element).toHaveAttribute('id', 'test-id')
    expect(element).toHaveAttribute('data-testid', 'form-error')
    expect(element).toHaveAttribute('role', 'alert')
  })

  it('maintains alert role even when custom role is provided', () => {
    renderComponent({ role: 'status', children: 'Custom role test' })
    
    const element = screen.getByText('Custom role test')
    expect(element).toHaveAttribute('role', 'alert')
  })

  it('renders complex children', () => {
    renderComponent({ children: <><span>Error:</span> <strong>Field is required</strong></> })
    
    expect(screen.getByText('Error:')).toBeInTheDocument()
    expect(screen.getByText('Field is required')).toBeInTheDocument()
  })

  it('handles null className', () => {
    renderComponent({ className: null } as any)
    
    const element = screen.getByRole('alert')
    expect(element).toHaveClass('font-medium', errorClass)
  })

  it('handles undefined className', () => {
    renderComponent({ className: undefined })
    
    const element = screen.getByRole('alert')
    expect(element).toHaveClass('font-medium', errorClass)
  })

  it('handles multiple custom classes', () => {
    renderComponent({ className: 'class1 class2 class3' })
    
    const element = screen.getByRole('alert')
    expect(element).toHaveClass('font-medium', errorClass, 'class1', 'class2', 'class3')
  })

  it('applies inline styles correctly', () => {
    renderComponent({ style: { fontSize: '16px', color: 'rgb(255, 0, 0)' } })
    
    const element = screen.getByRole('alert')
    expect(element).toHaveStyle({ fontSize: '16px', color: 'rgb(255, 0, 0)' })
  })

  it('handles long error messages', () => {
    const longError = 'This is a very long error message that might wrap to multiple lines and should still be handled correctly by the component.'.repeat(3)
    renderComponent({ children: longError })
    
    expect(screen.getByText(longError)).toBeInTheDocument()
  })

  it('handles empty children', () => {
    renderComponent({ children: '' })
    
    const element = screen.getByRole('alert')
    expect(element).toBeInTheDocument()
    expect(element).toBeEmptyDOMElement()
  })

  it('supports common validation error messages', () => {
    const errorMessages = [
      'This field is required',
      'Please enter a valid email address',
      'Password must be at least 8 characters',
      'Passwords do not match'
    ]

    errorMessages.forEach(message => {
      const { unmount } = renderComponent({ children: message })
      expect(screen.getByText(message)).toBeInTheDocument()
      expect(screen.getByRole('alert')).toBeInTheDocument()
      unmount()
    })
  })

  it('maintains accessibility with aria attributes', () => {
    renderComponent({ 'aria-describedby': 'field-id', 'aria-label': 'Validation error', children: 'Field validation failed' })
    
    const element = screen.getByRole('alert')
    expect(element).toHaveAttribute('aria-describedby', 'field-id')
    expect(element).toHaveAttribute('aria-label', 'Validation error')
  })

  it('preserves semantic meaning for screen readers', () => {
    renderComponent({ children: 'Critical validation error' })
    
    const element = screen.getByText('Critical validation error')
    expect(element).toBeInTheDocument()
    expect(element).toHaveAttribute('role', 'alert')
  })
})

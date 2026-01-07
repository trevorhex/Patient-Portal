import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { Card, CardProps } from '../index'

describe('Card', () => {
  const renderComponent = (props: Partial<CardProps> = {}) => render(<Card {...props}>{props.children ?? 'Mock Card'}</Card>)

  describe('rendering', () => {
    it('renders children correctly', () => {
      renderComponent({ children: 'Test content' })
      expect(screen.getByText('Test content')).toBeInTheDocument()
    })

    it('applies custom className alongside default classes', () => {
      const { container } = renderComponent({ className: 'custom-class' })
      const card = container.firstChild as HTMLElement
      
      expect(card).toHaveClass('custom-class')
      expect(card).toHaveClass('bg-zinc-900') // should still have default classes
    })

    it('renders as a div element', () => {
      const { container } = renderComponent()
      expect(container.firstChild).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('props', () => {
    it('applies tabIndex when provided', () => {
      const { container } = renderComponent({ tabIndex: 0 })
      const card = container.firstChild as HTMLElement
      expect(card).toHaveAttribute('tabIndex', '0')
    })

    it('does not apply tabIndex when not provided', () => {
      const { container } = renderComponent()
      const card = container.firstChild as HTMLElement
      expect(card).not.toHaveAttribute('tabIndex')
    })

    it('handles undefined className gracefully', () => {
      const { container } = renderComponent({ className: undefined })
      const card = container.firstChild as HTMLElement
      expect(card).toHaveClass('bg-zinc-900') // should still have default classes
    })

    it('handles empty string className', () => {
      const { container } = renderComponent({ className: '' })
      const card = container.firstChild as HTMLElement
      expect(card).toHaveClass('bg-zinc-900') // should still have default classes
    })
  })

  describe('ref forwarding', () => {
    it('forwards ref correctly', () => {
      const ref = createRef<HTMLDivElement>()
      renderComponent({ ref, children: 'Content' } as any)
      
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
      expect(ref.current).toHaveTextContent('Content')
    })

    it('works without ref', () => {
      expect(renderComponent).not.toThrow()
    })
  })

  describe('accessibility', () => {
    it('is focusable when tabIndex is provided', () => {
      renderComponent({ tabIndex: 0, children: 'Focusable content' })
      const card = screen.getByText('Focusable content')
      
      card.focus()
      expect(card).toHaveFocus()
    })

    it('has correct focus styles applied via classes', () => {
      const { container } = renderComponent({ tabIndex: 0 })
      const card = container.firstChild as HTMLElement
      
      expect(card).toHaveClass('focus-visible:outline-none')
      expect(card).toHaveClass('focus-visible:ring-1')
      expect(card).toHaveClass('focus-visible:ring-zinc-500')
    })
  })

  describe('complex children', () => {
    it('renders nested JSX elements', () => {
      const children = <>
        <h2>Title</h2>
        <p>Description</p>
        <button>Action</button>
      </>
      renderComponent({ children })
      
      expect(screen.getByText('Title')).toBeInTheDocument()
      expect(screen.getByText('Description')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument()
    })

    it('handles array of children', () => {
      const children = ['Item 1', 'Item 2', 'Item 3'].map((item, index) => <div key={index}>{item}</div>) 
      renderComponent({ children })

      expect(screen.getByText('Item 1')).toBeInTheDocument()
      expect(screen.getByText('Item 2')).toBeInTheDocument()
      expect(screen.getByText('Item 3')).toBeInTheDocument()
    })
  })

  describe('Component display name', () => {
    it('has correct displayName', () => {
      expect(Card.displayName).toBe('Card')
    })
  })
})

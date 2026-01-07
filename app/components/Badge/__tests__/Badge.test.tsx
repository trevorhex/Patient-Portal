import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Badge, BadgeVariant } from '../index'
import { baseStyles, variants, statusVariants, priorityVariants } from '../styles'

const mockStatus = [
  { value: 'backlog' as const, expectedClasses: variants[statusVariants.backlog].split(' ') },
  { value: 'todo' as const, expectedClasses: variants[statusVariants.todo].split(' ') },
  { value: 'in_progress' as const, expectedClasses: variants[statusVariants.in_progress].split(' ') },
  { value: 'done' as const, expectedClasses: variants[statusVariants.done].split(' ') }
]

const mockPriority = [
  { value: 'low' as const, expectedClasses: variants[priorityVariants.low].split(' ') },
  { value: 'medium' as const, expectedClasses: variants[priorityVariants.medium].split(' ') },
  { value: 'high' as const, expectedClasses: variants[priorityVariants.high].split(' ') }
]

const expectedClasses = (mockArray: Array<{ value: string, expectedClasses: string[] }>, key: string) =>
  mockArray.find(({ value }) => value === key)?.expectedClasses || []

describe('Badge', () => {
  const renderComponent = (props: any = {}) => render(<Badge {...props}>{props.children ?? 'Mock'}</Badge>)

  it('renders children correctly', () => {
    renderComponent()
    expect(screen.getByText('Mock')).toBeInTheDocument()
  })

  it('applies default variant when no variant is specified', () => {
    renderComponent()
    const badge = screen.getByText('Mock')
    expect(badge).toHaveClass(...variants['default'].split(' '))
  })

  it('applies correct variant classes', () => {
    renderComponent({ variant: 'success' })
    const badge = screen.getByText('Mock')
    expect(badge).toHaveClass(...variants['success'].split(' '))
  })

  it('applies all variant styles correctly', () => {
    Object.keys(variants)
      .map(variant => ({
        variant: variant as BadgeVariant,
        classes: variants[variant as keyof typeof variants].split(' ')
      }))
      .forEach(({ variant, classes }) => {
        const { unmount } = renderComponent({ variant, children: variant })
        const badge = screen.getByText(variant)
        classes.forEach(className => {
          expect(badge).toHaveClass(className)
        })
        unmount()
      })
  })

  it('applies base styles to all badges', () => {
    renderComponent()
    const badge = screen.getByText('Mock')
    expect(badge).toHaveClass(...baseStyles.trim().split(' '))
  })

  it('applies status variants correctly', () => {
    mockStatus.forEach(({ value: status, expectedClasses }) => {
      const { unmount } = renderComponent({ status, children: status })
      const badge = screen.getByText(status)
      expectedClasses.forEach(className => {
        expect(badge).toHaveClass(className)
      })
      unmount()
    })
  })

  it('applies priority variants correctly', () => {
    mockPriority.forEach(({ value: priority, expectedClasses }) => {
      const { unmount } = renderComponent({ priority, children: priority })
      const badge = screen.getByText(priority)
      expectedClasses.forEach(className => {
        expect(badge).toHaveClass(className)
      })
      unmount()
    })
  })

  it('prioritizes variant over status and priority', () => {
    renderComponent({ variant: 'danger', status: 'done', priority: 'low' })
    const badge = screen.getByText('Mock')
    expect(badge).toHaveClass(...expectedClasses(mockPriority, 'high'))
    expect(badge).not.toHaveClass(...expectedClasses(mockStatus, 'done'))
    expect(badge).not.toHaveClass(...expectedClasses(mockPriority, 'low'))
  })

  it('prioritizes status over priority when variant is not provided', () => {
    renderComponent({ status: 'done', priority: 'high' })
    const badge = screen.getByText('Mock')
    expect(badge).toHaveClass(...expectedClasses(mockStatus, 'done'))
    expect(badge).not.toHaveClass(...expectedClasses(mockPriority, 'high'))
  })

  it('applies custom className alongside variant classes', () => {
    renderComponent({ className: 'custom-class', variant: 'success' })
    const badge = screen.getByText('Mock')
    expect(badge).toHaveClass('custom-class')
    expect(badge).toHaveClass(...variants.success.split(' '))
  })

  it('forwards HTML attributes to the span element', () => {
    renderComponent({ 'data-testid': 'test-badge', id: 'badge-id', title: 'Badge title' })
    const badge = screen.getByTestId('test-badge')
    expect(badge).toHaveAttribute('id', 'badge-id')
    expect(badge).toHaveAttribute('title', 'Badge title')
  })

  it('renders as a span element', () => {
    renderComponent()
    const badge = screen.getByText('Mock')
    expect(badge.tagName).toBe('SPAN')
  })
})

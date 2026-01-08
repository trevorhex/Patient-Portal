import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { PortalLayout, PortalLayoutProps } from '../PortalLayout'

describe('PortalLayout', () => {
  const renderComponent = (props: Partial<PortalLayoutProps> = {}) => render(<PortalLayout {...props} />)

  it('renders with minimal props', () => {
    renderComponent()
    
    const container = screen.getAllByRole('generic')[1]
    expect(container).toHaveClass('space-y-8')
  })

  it('renders string heading as h1 element', () => {
    const headingText = 'Test Heading'
    renderComponent({ heading: headingText })
    
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toBeInTheDocument()
    expect(heading).toHaveTextContent(headingText)
    expect(heading).toHaveClass('text-2xl', 'font-bold')
  })

  it('renders ReactNode heading without h1 wrapper', () => {
    const customHeading = <div data-testid="custom-heading">Custom Header</div>
    renderComponent({ heading: customHeading })
    
    const customHeadingElement = screen.getByTestId('custom-heading')
    expect(customHeadingElement).toBeInTheDocument()
    
    const h1 = screen.queryByRole('heading', { level: 1 })
    expect(h1).not.toBeInTheDocument()
  })

  it('renders children content', () => {
    const childContent = <div data-testid="child-content">Child Content</div>
    renderComponent({ children: childContent })
    
    const child = screen.getByTestId('child-content')
    expect(child).toBeInTheDocument()
  })

  it('renders buttons in correct container', () => {
    const buttonElements = <>
      <button>Button 1</button>
      <button>Button 2</button>
    </>
    renderComponent({ buttons: buttonElements })
    
    const button1 = screen.getByRole('button', { name: 'Button 1' })
    const button2 = screen.getByRole('button', { name: 'Button 2' })
    
    expect(button1).toBeInTheDocument()
    expect(button2).toBeInTheDocument()
    
    const buttonsContainer = button1.parentElement
    expect(buttonsContainer).toHaveClass('flex', 'items-center', 'space-x-2')
  })

  it('renders complete layout with all props', () => {
    const heading = 'Complete Layout'
    const children = <main data-testid="main-content">Main Content</main>
    const buttons = <button data-testid="action-button">Action</button>
    
    renderComponent({ heading, children, buttons })
    
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(heading)
    expect(screen.getByTestId('main-content')).toBeInTheDocument()
    expect(screen.getByTestId('action-button')).toBeInTheDocument()
  })

  it('has correct header layout structure', () => {
    renderComponent({ heading: 'Test Header', buttons: <button>Click Me</button> })
    
    const headerContainer = screen.getByRole('heading').parentElement
    expect(headerContainer).toHaveClass('flex', 'items-center', 'justify-between', 'min-h-11')
  })

  it('handles undefined children gracefully', () => {
    renderComponent({ heading: 'Test', children: undefined })
    
    expect(screen.getByRole('heading')).toBeInTheDocument()
  })

  it('handles null heading gracefully', () => {
    renderComponent({ heading: null })
    
    const heading = screen.queryByRole('heading')
    expect(heading).not.toBeInTheDocument()
  })

  it('handles undefined heading gracefully', () => {
    renderComponent()
    
    const heading = screen.queryByRole('heading')
    expect(heading).not.toBeInTheDocument()
  })

  it('handles empty string heading', () => {
    renderComponent({ heading: '' })
    
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toBeInTheDocument()
    expect(heading).toHaveTextContent('')
  })

  it('handles complex ReactNode heading with nested elements', () => {
    const complexHeading = (
      <div data-testid="complex-header">
        <span>Part 1</span>
        <strong>Part 2</strong>
      </div>
    )
    renderComponent({ heading: complexHeading })
    
    const headerElement = screen.getByTestId('complex-header')
    expect(headerElement).toBeInTheDocument()
    expect(screen.getByText('Part 1')).toBeInTheDocument()
    expect(screen.getByText('Part 2')).toBeInTheDocument()
  })

  it('handles multiple children elements', () => {
    const multipleChildren = <>
      <div data-testid="child-1">Child 1</div>
      <div data-testid="child-2">Child 2</div>
      <div data-testid="child-3">Child 3</div>
    </>
    renderComponent({ children: multipleChildren })
    
    expect(screen.getByTestId('child-1')).toBeInTheDocument()
    expect(screen.getByTestId('child-2')).toBeInTheDocument()
    expect(screen.getByTestId('child-3')).toBeInTheDocument()
  })
})

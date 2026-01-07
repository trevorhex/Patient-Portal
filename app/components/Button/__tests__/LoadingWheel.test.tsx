import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { LoadingWheel } from '../components/LoadingWheel'

describe('LoadingWheel', () => {
  const renderComponent = () => render(<LoadingWheel />)

  it('renders the loading wheel component', () => {
    renderComponent()
    
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('renders the SVG spinner', () => {
    const { container } = renderComponent()
    
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveAttribute('xmlns', 'http://www.w3.org/2000/svg')
  })

  it('has reduce motion class on spinner animation', () => {
    const { container } = renderComponent()
    
    const svg = container.querySelector('svg')
    expect(svg).toHaveClass('animate-spin', 'motion-reduce:hidden')
  })

  it('has accessible loading text', () => {
    renderComponent()
    
    const loadingText = screen.getByText('Loading...')
    expect(loadingText).toBeVisible()
  })
})

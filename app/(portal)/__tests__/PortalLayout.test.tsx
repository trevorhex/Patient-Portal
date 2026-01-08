import { vi, describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import PortalLayout from '../layout'

vi.mock('../../components/SkipLink', () => ({ SkipLink: () => <a href="/#main_content" data-testid="skiplink" /> }))
vi.mock('../components/Navigation', () => ({ Navigation: () => <aside data-testid="navigation" /> }))

describe('PortalLayout', () => {
  const renderComponent = () => render(<PortalLayout><div data-testid="children" /></PortalLayout>)

  it('renders components', () => {
    renderComponent()
    expect(screen.getByTestId('skiplink')).toBeInTheDocument()
    expect(screen.getByTestId('navigation')).toBeInTheDocument()
    expect(screen.getByRole('main')).toBeInTheDocument()
  })

  it('renders children the main element', () => {
    renderComponent()

    expect(screen.getByRole('main')).toContainElement(screen.getByTestId('children'))
  })
})

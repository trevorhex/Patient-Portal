import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Navigation } from '../index'
import { ROUTES } from '@/config/routes'

vi.mock('../components/NavMenu', () => ({ NavMenu: () => <nav data-testid="nav-menu" /> }))
vi.mock('../components/UserNav', () => ({ UserNav: () => <div data-testid="user-nav" /> }))

describe('Navigation', () => {
  const renderComponent = () => render(<Navigation />)

  it('renders the navigation aside element with correct classes', () => {
    renderComponent()
    
    const aside = screen.getByRole('complementary')
    expect(aside).toBeInTheDocument()
  })

  it('renders the logo link with correct href', () => {
    renderComponent()
    
    const logoLink = screen.getByRole('link')
    expect(logoLink).toHaveAttribute('href', ROUTES.dashboard.href)
  })

  it('displays full logo text "Patient Portal" on desktop', () => {
    renderComponent()
    
    const fullLogoText = screen.getByText('Patient Portal')
    expect(fullLogoText).toBeInTheDocument()
    expect(fullLogoText).toHaveClass('hidden', 'md:inline')
  })

  it('displays abbreviated logo text "PP" on mobile', () => {
    renderComponent()
    
    const abbreviatedLogoText = screen.getByText('PP')
    expect(abbreviatedLogoText).toBeInTheDocument()
    expect(abbreviatedLogoText).toHaveClass('md:hidden')
  })

  it('renders the NavMenu component', () => {
    renderComponent()
    
    const navMenu = screen.getByTestId('nav-menu')
    expect(navMenu).toBeInTheDocument()
  })

  it('renders the UserNav component', () => {
    renderComponent()
    
    const userNav = screen.getByTestId('user-nav')
    expect(userNav).toBeInTheDocument()
  })

  it('has correct layout structure', () => {
    renderComponent()
    
    const aside = screen.getByRole('complementary')
    const logoContainer = aside.querySelector('.flex.items-center')
    const navMenu = screen.getByTestId('nav-menu')
    const userNavContainer = aside.querySelector('.pt-4.border-t')
    
    expect(logoContainer).toBeInTheDocument()
    expect(logoContainer).toHaveClass('flex', 'items-center', 'justify-center', 'md:justify-start')
    expect(navMenu).toBeInTheDocument()
    expect(userNavContainer).toBeInTheDocument()
  })

  it('renders components in correct order', () => {
    renderComponent()
    
    const aside = screen.getByRole('complementary')
    const children = Array.from(aside.children)
    
    expect(children[0]).toHaveClass('flex', 'items-center')
    expect(children[1]).toContainElement(screen.getByTestId('nav-menu'))
    expect(children[2]).toHaveClass('pt-4', 'border-t', 'border-zinc-700')
    expect(children[2]).toContainElement(screen.getByTestId('user-nav'))
  })
})

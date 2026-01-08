import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { UserMenu } from '../UserMenu'
import { ROUTES } from '@/config/routes'

vi.mock('next/navigation', () => ({ usePathname: vi.fn() }))

vi.mock('../NavLink', () => ({
  NavLink: ({ href, icon, label, isActive, size }: { href: string, icon: ReactNode, label: string, isActive: boolean, size: string }) => (
    <a href={href} data-testid="nav-link"  data-active={isActive} data-size={size}>
      <span data-testid="nav-icon">{icon}</span>
      <span data-testid="nav-label">{label}</span>
    </a>
  )
}))

vi.mock('lucide-react', () => ({ Settings: ({ size }: { size: number }) => <svg data-testid="settings-icon" data-size={size} /> }))

const mockedUsePathname = vi.mocked(usePathname)

describe('UserMenu', () => {
  const renderComponent = () => render(<UserMenu />)

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the UserMenu component', () => {
    renderComponent()
    
    expect(screen.getByTestId('nav-link')).toBeInTheDocument()
  })

  it('renders with correct container styling', () => {
    const { container } = renderComponent()
    const userMenu = container.firstChild as HTMLElement
    
    expect(userMenu).toHaveClass('space-y-1')
  })

  it('renders NavLink with correct props when pathname matches account route', () => {
    mockedUsePathname.mockReturnValueOnce(ROUTES.account.href)

    renderComponent()
    
    const navLink = screen.getByTestId('nav-link')
    expect(navLink).toHaveAttribute('href', ROUTES.account.href)
    expect(navLink).toHaveAttribute('data-active', 'true')
    expect(navLink).toHaveAttribute('data-size', 'sm')
    expect(navLink).toHaveTextContent(ROUTES.account.name!)
  })

  it('renders NavLink with isActive false when pathname does not match account route', () => {
    renderComponent()
    
    const navLink = screen.getByTestId('nav-link')
    expect(navLink).toHaveAttribute('href', ROUTES.account.href)
    expect(navLink).toHaveAttribute('data-active', 'false')
    expect(navLink).toHaveAttribute('data-size', 'sm')
  })

  it('renders Settings icon with correct size', () => {
    renderComponent()
    
    const settingsIcon = screen.getByTestId('settings-icon')
    expect(settingsIcon).toBeInTheDocument()
    expect(settingsIcon).toHaveAttribute('data-size', '20')
  })

  it('passes correct label from ROUTES config', () => {
    renderComponent()
    
    expect(screen.getByTestId('nav-link')).toHaveTextContent(ROUTES.account.name!)
  })

  it('uses correct href from ROUTES config', () => {
    renderComponent()
    
    const navLink = screen.getByTestId('nav-link')
    expect(navLink).toHaveAttribute('href', ROUTES.account.href)
  })
})

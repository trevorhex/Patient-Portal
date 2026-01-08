import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { NavMenu } from '../NavMenu'
import { ROUTES } from '@/config/routes'

vi.mock('../NavLink', () => ({
  NavLink: ({ href, icon, label, isActive }: { href: string, icon: ReactNode, label: string, isActive: boolean }) => (
    <a href={href} data-testid={`nav-link-${href}`} data-active={isActive} aria-current={isActive ? 'page' : undefined}>
      <span data-testid="nav-icon">{icon}</span>
      <span data-testid="nav-label">{label}</span>
    </a>
  )
}))

vi.mock('lucide-react', () => ({
  HomeIcon: ({ size }: { size: number }) => <span data-testid="home-icon" data-size={size} />,
  PlusIcon: ({ size }: { size: number }) => <span data-testid="plus-icon" data-size={size} />,
  List: ({ size }: { size: number }) => <span data-testid="list-icon" data-size={size} />,
  ScanHeart: ({ size }: { size: number }) => <span data-testid="scan-heart-icon" data-size={size} />
}))

vi.mock('next/navigation', async () => {
  const actual = await vi.importActual('next/navigation')
  return { ...actual, usePathname: vi.fn() }
})

const mockUsePathname = vi.mocked(usePathname)

describe('NavMenu', () => {
  const renderComponent = () => render(<NavMenu />)

  beforeEach(() => {
    vi.clearAllMocks()
    mockUsePathname.mockReturnValue('/')
  })

  describe('rendering', () => {
    it('renders the navigation menu with correct structure', () => {
      renderComponent()

      const nav = screen.getByRole('navigation', { name: 'Main navigation menu' })
      expect(nav).toBeInTheDocument()
      expect(nav).toHaveClass('flex-1', 'space-y-1')
    })

    it('renders all navigation links with correct labels', () => {
      renderComponent()

      expect(screen.getByText('Dashboard')).toBeInTheDocument()
      expect(screen.getByText('Patient Profile')).toBeInTheDocument()
      expect(screen.getByText('Issues')).toBeInTheDocument()
      expect(screen.getByText('New Issue')).toBeInTheDocument()
    })

    it('renders all navigation links with correct href attributes', () => {
      renderComponent()

      expect(screen.getByTestId(`nav-link-${ROUTES.dashboard.href}`)).toHaveAttribute('href', ROUTES.dashboard.href)
      expect(screen.getByTestId(`nav-link-${ROUTES.profile.base.href}`)).toHaveAttribute('href', ROUTES.profile.base.href)
      expect(screen.getByTestId(`nav-link-${ROUTES.issues.base.href}`)).toHaveAttribute('href', ROUTES.issues.base.href)
      expect(screen.getByTestId(`nav-link-${ROUTES.issues.new.href}`)).toHaveAttribute('href', ROUTES.issues.new.href)
    })

    it('renders all icons with correct size', () => {
      renderComponent()

      const homeIcon = screen.getByTestId('home-icon')
      const scanHeartIcon = screen.getByTestId('scan-heart-icon')
      const listIcon = screen.getByTestId('list-icon')
      const plusIcon = screen.getByTestId('plus-icon')

      expect(homeIcon).toHaveAttribute('data-size', '20')
      expect(scanHeartIcon).toHaveAttribute('data-size', '20')
      expect(listIcon).toHaveAttribute('data-size', '20')
      expect(plusIcon).toHaveAttribute('data-size', '20')
    })
  })

  describe('active state', () => {
    it('marks dashboard link as active when on dashboard page', () => {
      mockUsePathname.mockReturnValue(ROUTES.dashboard.href)
      renderComponent()

      const dashboardLink = screen.getByTestId(`nav-link-${ROUTES.dashboard.href}`)
      expect(dashboardLink).toHaveAttribute('data-active', 'true')
      expect(dashboardLink).toHaveAttribute('aria-current', 'page')

      expect(screen.getByTestId(`nav-link-${ROUTES.profile.base.href}`)).toHaveAttribute('data-active', 'false')
      expect(screen.getByTestId(`nav-link-${ROUTES.issues.base.href}`)).toHaveAttribute('data-active', 'false')
      expect(screen.getByTestId(`nav-link-${ROUTES.issues.new.href}`)).toHaveAttribute('data-active', 'false')
    })

    it('marks profile link as active when on profile page', () => {
      mockUsePathname.mockReturnValue(ROUTES.profile.base.href)
      renderComponent()

      const profileLink = screen.getByTestId(`nav-link-${ROUTES.profile.base.href}`)
      expect(profileLink).toHaveAttribute('data-active', 'true')
      expect(profileLink).toHaveAttribute('aria-current', 'page')

      expect(screen.getByTestId(`nav-link-${ROUTES.dashboard.href}`)).toHaveAttribute('data-active', 'false')
      expect(screen.getByTestId(`nav-link-${ROUTES.issues.base.href}`)).toHaveAttribute('data-active', 'false')
      expect(screen.getByTestId(`nav-link-${ROUTES.issues.new.href}`)).toHaveAttribute('data-active', 'false')
    })

    it('marks issues link as active when on issues page', () => {
      mockUsePathname.mockReturnValue(ROUTES.issues.base.href)
      renderComponent()

      const issuesLink = screen.getByTestId(`nav-link-${ROUTES.issues.base.href}`)
      expect(issuesLink).toHaveAttribute('data-active', 'true')
      expect(issuesLink).toHaveAttribute('aria-current', 'page')

      expect(screen.getByTestId(`nav-link-${ROUTES.dashboard.href}`)).toHaveAttribute('data-active', 'false')
      expect(screen.getByTestId(`nav-link-${ROUTES.profile.base.href}`)).toHaveAttribute('data-active', 'false')
      expect(screen.getByTestId(`nav-link-${ROUTES.issues.new.href}`)).toHaveAttribute('data-active', 'false')
    })

    it('marks new issue link as active when on new issue page', () => {
      mockUsePathname.mockReturnValue(ROUTES.issues.new.href)
      renderComponent()

      const newIssueLink = screen.getByTestId(`nav-link-${ROUTES.issues.new.href}`)
      expect(newIssueLink).toHaveAttribute('data-active', 'true')
      expect(newIssueLink).toHaveAttribute('aria-current', 'page')

      expect(screen.getByTestId(`nav-link-${ROUTES.dashboard.href}`)).toHaveAttribute('data-active', 'false')
      expect(screen.getByTestId(`nav-link-${ROUTES.profile.base.href}`)).toHaveAttribute('data-active', 'false')
      expect(screen.getByTestId(`nav-link-${ROUTES.issues.base.href}`)).toHaveAttribute('data-active', 'false')
    })

    it('does not mark any link as active when on unknown page', () => {
      mockUsePathname.mockReturnValue('/unknown-page')
      renderComponent()

      expect(screen.getByTestId(`nav-link-${ROUTES.dashboard.href}`)).toHaveAttribute('data-active', 'false')
      expect(screen.getByTestId(`nav-link-${ROUTES.profile.base.href}`)).toHaveAttribute('data-active', 'false')
      expect(screen.getByTestId(`nav-link-${ROUTES.issues.base.href}`)).toHaveAttribute('data-active', 'false')
      expect(screen.getByTestId(`nav-link-${ROUTES.issues.new.href}`)).toHaveAttribute('data-active', 'false')
    })
  })

  describe('accessibility', () => {
    it('has proper navigation landmark with aria-label', () => {
      renderComponent()

      const nav = screen.getByRole('navigation')
      expect(nav).toHaveAttribute('aria-label', 'Main navigation menu')
    })

    it('sets aria-current="page" for active links', () => {
      mockUsePathname.mockReturnValue(ROUTES.dashboard.href)
      renderComponent()

      const activeLink = screen.getByTestId(`nav-link-${ROUTES.dashboard.href}`)
      expect(activeLink).toHaveAttribute('aria-current', 'page')

      const inactiveLinks = [
        screen.getByTestId(`nav-link-${ROUTES.profile.base.href}`),
        screen.getByTestId(`nav-link-${ROUTES.issues.base.href}`),
        screen.getByTestId(`nav-link-${ROUTES.issues.new.href}`)
      ]

      inactiveLinks.forEach(link => {
        expect(link).not.toHaveAttribute('aria-current', 'page')
      })
    })
  })

  describe('hooks', () => {
    it('calls usePathname hook to get current pathname', () => {
      mockUsePathname.mockReturnValue('/test-path')

      renderComponent()

      expect(mockUsePathname).toHaveBeenCalledTimes(1)
    })

    it('reacts to pathname changes', () => {
      const { rerender } = renderComponent()

      expect(screen.getByTestId(`nav-link-${ROUTES.dashboard.href}`)).toHaveAttribute('data-active', 'false')

      mockUsePathname.mockReturnValue(ROUTES.dashboard.href)
      rerender(<NavMenu />)

      expect(screen.getByTestId(`nav-link-${ROUTES.dashboard.href}`)).toHaveAttribute('data-active', 'true')
    })
  })
})

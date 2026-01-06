import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, act } from '@testing-library/react'
import { AuthButtons, AuthButtonsComponent } from '../AuthButtons'
import { getAuthenticatedUser } from '@/dal/user'
import { ROUTES } from '@/config/routes'

vi.spyOn(console, 'error').mockImplementation(() => {})
vi.mock('@/dal/user')
vi.mock('@/app/components/Button', () => ({
  Button: ({ children, href, variant, ...props }: { children: React.ReactNode, href: string, variant?: string }) => (
    <a href={href} data-variant={variant} {...props}>{children}</a>
  )
}))

const mockGetAuthenticatedUser = vi.mocked(getAuthenticatedUser)
const mockUser = { id: '1', email: 'user@email.com', password: '', createdAt: new Date() }

describe('AuthButtons', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('AuthButtonsComponent', () => {
    const renderComponent = async () => render(await AuthButtonsComponent())

    it('should render dashboard button when user is authenticated', async () => {
      mockGetAuthenticatedUser.mockResolvedValue(mockUser)

      await renderComponent()

      expect(screen.getByRole('link', { name: 'Dashboard' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveAttribute('href', ROUTES.dashboard.href)
    })

    it('should render login and signup buttons when user is not authenticated', async () => {
      mockGetAuthenticatedUser.mockResolvedValue(null)

      await renderComponent()

      const loginButton = screen.getByRole('link', { name: 'Log in' })
      const signupButton = screen.getByRole('link', { name: 'Sign up' })

      expect(loginButton).toBeInTheDocument()
      expect(loginButton).toHaveAttribute('href', ROUTES.auth.login.href)
      expect(loginButton).toHaveAttribute('data-variant', 'outline')

      expect(signupButton).toBeInTheDocument()
      expect(signupButton).toHaveAttribute('href', ROUTES.auth.signup.href)
      expect(signupButton).not.toHaveAttribute('data-variant')
    })

    it('should call getAuthenticatedUser', async () => {
      mockGetAuthenticatedUser.mockResolvedValue(null)

      await renderComponent()

      expect(mockGetAuthenticatedUser).toHaveBeenCalledOnce()
    })
  })

  describe('AuthButtons', () => {
    const renderComponent = async () => render(AuthButtons())

    it('should show fallback and then render login buttons when user is not authenticated', async () => {
      let resolveAuth: (value: any) => void
      mockGetAuthenticatedUser.mockReturnValue(new Promise(resolve => { resolveAuth = resolve }))

      await act(async () => {
        renderComponent()
      })
      
      expect(screen.getByRole('presentation')).toBeInTheDocument()
      expect(screen.getByRole('presentation')).toHaveClass('h-16')
      expect(screen.queryByRole('link')).not.toBeInTheDocument()

      resolveAuth!(null)

      await waitFor(() => {
        expect(screen.getByRole('link', { name: 'Log in' })).toBeInTheDocument()
      })

      expect(screen.getByRole('link', { name: 'Sign up' })).toBeInTheDocument()
      expect(screen.queryByRole('presentation')).not.toBeInTheDocument()
    })

    it('should show fallback and then render dashboard when user is authenticated', async () => {
      let resolveAuth: (value: any) => void
      mockGetAuthenticatedUser.mockReturnValue(new Promise(resolve => { resolveAuth = resolve }))

      await act(async () => {
        renderComponent()
      })

      expect(screen.getByRole('presentation')).toBeInTheDocument()
      expect(screen.queryByRole('link')).not.toBeInTheDocument()

      resolveAuth!(mockUser)

      await waitFor(() => {
        expect(screen.getByRole('link', { name: 'Dashboard' })).toBeInTheDocument()
      })

      expect(screen.queryByRole('presentation')).not.toBeInTheDocument()
    })

    it('should render content immediately when promise resolves synchronously', async () => {
      mockGetAuthenticatedUser.mockResolvedValue(null)

      await act(async () => {
        await renderComponent()
      })

      await waitFor(() => {
        expect(screen.getByRole('link', { name: 'Log in' })).toBeInTheDocument()
      })

      expect(screen.getByRole('link', { name: 'Sign up' })).toBeInTheDocument()
    })
  })
})

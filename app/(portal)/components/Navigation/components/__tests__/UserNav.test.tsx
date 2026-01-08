import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, act } from '@testing-library/react'
import { UserNav } from '../UserNav'
import { getAuthenticatedUser } from '@/dal/user'

vi.spyOn(console, 'error').mockImplementation(() => {})
vi.mock('@/dal/user')
vi.mock('lucide-react', () => ({
  UserIcon: ({ size, className }: { size: number, className: string }) => <div data-testid="user-icon" data-size={size} className={className} />
}))
vi.mock('../UserMenu', () => ({ UserMenu: () => <div data-testid="user-menu" /> }))
vi.mock('../SignOutButton', () => ({ SignOutButton: () => <button data-testid="sign-out-button">Sign Out</button> }))

const mockGetAuthenticatedUser = vi.mocked(getAuthenticatedUser)
const mockUser = { id: '1', email: 'user@example.com', password: '', createdAt: new Date() }

describe('UserNav', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render skeleton while loading', async () => {
    let resolveAuth: (value: any) => void
    mockGetAuthenticatedUser.mockReturnValue(new Promise(resolve => { resolveAuth = resolve }))

    await act(async () => {
      render(UserNav())
    })

    expect(screen.getAllByRole('generic')[0].children[0]).toHaveClass('animate-pulse', 'flex', 'flex-col', 'space-y-5', 'py-3')
    expect(screen.getAllByRole('generic')).toHaveLength(5)
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()

    resolveAuth!(mockUser)

    await waitFor(() => {
      expect(screen.getByRole('navigation')).toBeInTheDocument()
    })
  })

  it('should render user navigation when user is loaded', async () => {
    mockGetAuthenticatedUser.mockResolvedValue(mockUser)

    await act(async () => {
      render(UserNav())
    })

    await waitFor(() => {
      expect(screen.getByRole('navigation', { name: 'User menu' })).toBeInTheDocument()
    })

    expect(screen.getByText(mockUser.email)).toBeInTheDocument()
    expect(screen.getByTestId('user-icon')).toBeInTheDocument()
    expect(screen.getByTestId('user-menu')).toBeInTheDocument()
    expect(screen.getByTestId('sign-out-button')).toBeInTheDocument()
  })

  it('should render user icon with correct props', async () => {
    mockGetAuthenticatedUser.mockResolvedValue(mockUser)

    await act(async () => {
      render(UserNav())
    })

    await waitFor(() => {
      const userIcon = screen.getByTestId('user-icon')
      expect(userIcon).toHaveAttribute('data-size', '20')
      expect(userIcon).toHaveClass('text-gray-500', 'mr-2')
    })
  })

  it('should render user email with correct styling', async () => {
    mockGetAuthenticatedUser.mockResolvedValue(mockUser)

    await act(async () => {
      render(UserNav())
    })

    await waitFor(() => {
      const emailSpan = screen.getByText(mockUser.email)
      expect(emailSpan).toHaveClass('hidden', 'md:inline', 'text-sm', 'text-gray-300', 'truncate')
    })
  })

  it('should handle null user gracefully', async () => {
    mockGetAuthenticatedUser.mockResolvedValue(null)

    await act(async () => {
      render(UserNav())
    })

    await waitFor(() => {
      expect(screen.getByRole('navigation')).toBeInTheDocument()
    })

    expect(screen.getByTestId('user-icon')).toBeInTheDocument()
    expect(screen.queryByText(mockUser.email)).not.toBeInTheDocument()
  })

  it('should call getAuthenticatedUser', async () => {
    mockGetAuthenticatedUser.mockResolvedValue(mockUser)

    await act(async () => {
      render(UserNav())
    })

    await waitFor(() => {
      expect(screen.getByRole('navigation')).toBeInTheDocument()
    })

    expect(mockGetAuthenticatedUser).toHaveBeenCalled()
  })

  it('should render content immediately when promise resolves synchronously', async () => {
    mockGetAuthenticatedUser.mockResolvedValue(mockUser)

    await act(async () => {
      render(UserNav())
    })

    await waitFor(() => {
      expect(screen.getByRole('navigation')).toBeInTheDocument()
    })

    expect(screen.getByText(mockUser.email)).toBeInTheDocument()
  })

  it('should have correct navigation structure and classes', async () => {
    mockGetAuthenticatedUser.mockResolvedValue(mockUser)

    await act(async () => {
      render(UserNav())
    })

    await waitFor(() => {
      const nav = screen.getByRole('navigation')
      expect(nav).toHaveClass('space-y-1')
      expect(nav).toHaveAttribute('aria-label', 'User menu')
    })

    const userInfoDiv = screen.getByText(mockUser.email).closest('div')
    expect(userInfoDiv).toHaveClass('flex', 'items-center', 'justify-start', 'px-2', 'py-2')
  })
})

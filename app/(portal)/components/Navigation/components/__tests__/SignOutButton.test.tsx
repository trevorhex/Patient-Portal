import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { logOut } from '@/actions/auth'
import { SignOutButton } from '../SignOutButton'

vi.spyOn(console, 'error').mockImplementation(() => {})
vi.mock('@/actions/auth', () => ({ logOut: vi.fn() }))
vi.mock('lucide-react', () => ({
  LogOutIcon: ({ size, className }: { size?: number; className?: string }) => (
    <svg data-testid="logout-icon" width={size} height={size} className={className} />
  )
}))

const mockLogOut = vi.mocked(logOut)

describe('SignOutButton', () => {
  const renderComponent = () => render(<SignOutButton />)

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the sign out button with correct text and icon', () => {
    renderComponent()
    
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent('Sign Out')
    expect(screen.getByTestId('logout-icon')).toBeInTheDocument()
  })

  it('renders logout icon with correct props', () => {
    renderComponent()
    
    const icon = screen.getByTestId('logout-icon')
    expect(icon).toHaveAttribute('width', '20')
    expect(icon).toHaveAttribute('height', '20')
    expect(icon).toHaveClass('mr-2')
  })

  it('is not disabled initially', () => {
    renderComponent()
    
    const button = screen.getByRole('button')
    expect(button).not.toBeDisabled()
  })

  it('calls logOut action when clicked', async () => {
    mockLogOut.mockResolvedValue(undefined)
    renderComponent()
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    expect(mockLogOut).toHaveBeenCalledTimes(1)
  })

  it('shows pending state when sign out is in progress', async () => {
    let resolveLogOut: () => void
    const logOutPromise = new Promise<void>((resolve) => { resolveLogOut = resolve })
    mockLogOut.mockReturnValue(logOutPromise)

    renderComponent()
    
    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(button).toBeDisabled()
    expect(button).toHaveTextContent('Signing out...')

    resolveLogOut!()

    await waitFor(() => {
      expect(button).not.toBeDisabled()
      expect(button).toHaveTextContent('Sign Out')
    })
  })

  it('prevents multiple simultaneous sign out attempts', async () => {
    let resolveLogOut: () => void
    const logOutPromise = new Promise<void>((resolve) => { resolveLogOut = resolve })
    mockLogOut.mockReturnValue(logOutPromise)

    renderComponent()
    
    const button = screen.getByRole('button')
    
    fireEvent.click(button)
    expect(button).toBeDisabled()
    
    fireEvent.click(button)
    
    expect(mockLogOut).toHaveBeenCalledTimes(1)
    
    resolveLogOut!()

    await waitFor(() => {
      expect(button).not.toBeDisabled()
    })
  })

  it('maintains accessibility attributes', () => {
    renderComponent()

    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute('type', 'button')
  })

  it('updates button text during transition states', async () => {
    let resolveLogOut: () => void
    const logOutPromise = new Promise<void>((resolve) => { resolveLogOut = resolve })
    mockLogOut.mockReturnValue(logOutPromise)

    renderComponent()
    
    const button = screen.getByRole('button')
    expect(button).toHaveTextContent('Sign Out')

    fireEvent.click(button)

    expect(button).toHaveTextContent('Signing out...')

    resolveLogOut!()

    await waitFor(() => {
      expect(button).toHaveTextContent('Sign Out')
    })
  })

  it('handles rapid successive clicks correctly', async () => {
    mockLogOut.mockResolvedValue(undefined)
    
    renderComponent()
    
    const button = screen.getByRole('button')

    fireEvent.click(button)
    fireEvent.click(button)
    fireEvent.click(button)

    await waitFor(() => {
      expect(mockLogOut).toHaveBeenCalledTimes(1)
    })
  })
})

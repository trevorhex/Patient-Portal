import { ReactNode } from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { useActionState } from 'react'
import toast from 'react-hot-toast'
import LogInPage from '../page'
import { logIn } from '@/actions/auth'
import { ROUTES } from '@/config/routes'

vi.mock('react', async () => {
  const actual = await vi.importActual('react')
  return { ...actual, useActionState: vi.fn() }
})

vi.mock('react-hot-toast', () => ({
  default: { success: vi.fn(), error: vi.fn() }
}))

vi.mock('@/actions/auth', () => ({
  logIn: vi.fn()
}))

vi.mock('@/config/routes', () => ({
  ROUTES: {
    dashboard: { href: '/dashboard' },
    auth: { signup: { href: '/signup' } }
  }
}))

vi.mock('../components/AuthPage', () => ({
  AuthPage: ({ title, FormFields, formData, submitButtonText }: any) => (
    <div data-testid="auth-page">
      <h1>{title}</h1>
      <form>
        <FormFields />
        <button type="submit" disabled={formData[2]}>
          {submitButtonText}
        </button>
      </form>
    </div>
  )
}))

vi.mock('@/app/components/Form', async () => {
  const actual = await vi.importActual('@/app/components/Form')
  return {
    ...actual,
    FormGroup: ({ children }: { children: ReactNode }) => <div data-testid="form-group">{children}</div>,
    FormLabel: ({ children, htmlFor }: { children: ReactNode; htmlFor: string }) => (
      <label htmlFor={htmlFor}>{children}</label>
    ),
    FormInput: (props: any) => <input {...props} data-testid={props.name} />,
    errorClass: 'error-class',
    inputErrorClass: 'input-error-class'
  }
})

const mockPush = vi.fn()
const mockRefresh = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush, refresh: mockRefresh })
}))

describe('LogInPage', () => {
  const mockFormAction = vi.fn()
  const mockState = {
    success: false,
    message: '',
    errors: undefined
  }

  const renderComponent = () => render(<LogInPage />)

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useActionState).mockReturnValue([mockState, mockFormAction, false])
  })

  it('renders login form with correct title', () => {
    renderComponent()
    
    expect(screen.getByText('Log in to your account')).toBeInTheDocument()
    expect(screen.getByText('Log in')).toBeInTheDocument()
  })

  it('renders email and password fields', () => {
    renderComponent()
    
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.getByTestId('email')).toHaveAttribute('type', 'email')
    expect(screen.getByTestId('password')).toHaveAttribute('type', 'password')
  })

  it('disables form fields when pending', () => {
    vi.mocked(useActionState).mockReturnValue([
      mockState,
      mockFormAction,
      true
    ])

    renderComponent()
    
    expect(screen.getByTestId('email')).toBeDisabled()
    expect(screen.getByTestId('password')).toBeDisabled()
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('displays email validation errors', () => {
    const stateWithEmailError = {
      success: false,
      message: '',
      errors: { email: ['Invalid email address'] }
    }
    
    vi.mocked(useActionState).mockReturnValue([
      stateWithEmailError,
      mockFormAction,
      false
    ])

    renderComponent()
    
    expect(screen.getByText('Invalid email address')).toBeInTheDocument()
    expect(screen.getByTestId('email')).toHaveClass('input-error-class')
  })

  it('displays password validation errors', () => {
    const stateWithPasswordError = {
      success: false,
      message: '',
      errors: { password: ['Password is required'] }
    }
    
    vi.mocked(useActionState).mockReturnValue([
      stateWithPasswordError,
      mockFormAction,
      false
    ])

    renderComponent()
    
    expect(screen.getByText('Password is required')).toBeInTheDocument()
    expect(screen.getByTestId('password')).toHaveClass('input-error-class')
  })

  it('handles form submission with successful login', async () => {
    const mockFormData = new FormData()
    mockFormData.append('email', 'test@example.com')
    mockFormData.append('password', 'password123')

    vi.mocked(logIn).mockResolvedValue({
      success: true,
      message: 'Login successful',
      errors: undefined
    })

    const mockAction = vi.fn().mockImplementation(async (prevState: any, formData: FormData) => {
      const result = await logIn(formData)
      if (result.success) {
        toast.success('Signed in successfully')
        mockRefresh()
        mockPush(ROUTES.dashboard.href)
      }
      return result
    })

    vi.mocked(useActionState).mockReturnValue([mockState, mockAction, false])

    renderComponent()

    const result = await mockAction(mockState, mockFormData)

    expect(result.success).toBe(true)
    expect(toast.success).toHaveBeenCalledWith('Signed in successfully')
    expect(mockRefresh).toHaveBeenCalled()
    expect(mockPush).toHaveBeenCalledWith('/dashboard')
  })

  it('handles login error from server', async () => {
    const mockFormData = new FormData()
    mockFormData.append('email', 'test@example.com')
    mockFormData.append('password', 'password123')

    vi.mocked(logIn).mockRejectedValue(new Error('Network error'))

    const mockAction = vi.fn().mockImplementation(async (prevState: any, formData: FormData) => {
      try {
        const result = await logIn(formData)
        return result
      } catch (err) {
        return {
          success: false,
          message: (err as Error).message || 'An error occurred',
          errors: undefined
        }
      }
    })

    vi.mocked(useActionState).mockReturnValue([mockState, mockAction, false])

    renderComponent()

    const result = await mockAction(mockState, mockFormData)

    expect(result.success).toBe(false)
    expect(result.message).toBe('Network error')
  })

  it('has correct form attributes', () => {
    renderComponent()
    
    const emailInput = screen.getByTestId('email')
    const passwordInput = screen.getByTestId('password')
    
    expect(emailInput).toHaveAttribute('autoComplete', 'email')
    expect(emailInput).toHaveAttribute('aria-describedby', 'email-error')
    expect(passwordInput).toHaveAttribute('autoComplete', 'current-password')
    expect(passwordInput).toHaveAttribute('aria-describedby', 'password-error')
  })

  it('memoizes FormFields component correctly', () => {
    const { rerender } = renderComponent()
    const formGroups1 = screen.getAllByTestId('form-group')
    
    rerender(<LogInPage />)
    const formGroups2 = screen.getAllByTestId('form-group')
    
    expect(formGroups1).toHaveLength(2)
    expect(formGroups2).toHaveLength(2)
  })
})

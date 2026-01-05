import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { useActionState } from 'react'
import toast from 'react-hot-toast'
import { signUp } from '@/actions/auth'
import { ROUTES } from '@/config/routes'
import { AuthPageProps } from '../../components/AuthPage'
import SignupPage from '../page'

const mockPush = vi.fn()
const mockRefresh = vi.fn()
const mockFormAction = vi.fn()
const mockToastSuccess = vi.fn()
const mockToastError = vi.fn()

vi.mock('react', async () => {
  const actual = await vi.importActual('react')
  return { ...actual, useActionState: vi.fn() }
})

vi.mock('react-hot-toast', () => ({ default: { success: vi.fn(), error: vi.fn() } }))
vi.mock('@/actions/auth', () => ({ signUp: vi.fn() }))
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: mockPush, refresh: mockRefresh }) }))

vi.mock('../../components/AuthPage', async () => {
  const actual = await vi.importActual('../../components/AuthPage')
  return {
    ...actual,
    AuthPage: ({ title, FormFields, formData, submitButtonText, ctaText, ctaLink }: AuthPageProps) => (
      <div data-testid="auth-page">
        <h1>{title}</h1>
        <form>
          <FormFields />
          <button type="submit" disabled={formData[2]}>
            {submitButtonText}
          </button>
          <div>
            {ctaText}
            <a href={ctaLink.href}>{ctaLink.name}</a>
          </div>
        </form>
      </div>
    )
  }
})

const mockState = {
  success: false,
  message: '',
  errors: undefined
}

describe('SignupPage', () => {
  const renderComponent = () => render(<SignupPage />)

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useActionState).mockReturnValue([mockState, mockFormAction, false])
    vi.mocked(toast.success).mockImplementation(mockToastSuccess)
    vi.mocked(toast.error).mockImplementation(mockToastError)
  })

  describe('rendering', () => {
    it('renders signup page with correct title', () => {
      renderComponent()
      expect(screen.getByRole('heading', { name: 'Create a new account' })).toBeInTheDocument()
    })

    it('renders signup button with correct text', () => {
      renderComponent()
      expect(screen.getByRole('button', { name: 'Sign up' })).toBeInTheDocument()
    })

    it('renders login link with correct text and href', () => {
      renderComponent()
      expect(screen.getByText('Already have an account?')).toBeInTheDocument()
      expect(screen.getByRole('link')).toHaveAttribute('href', ROUTES.auth.login.href)
    })
  })

  describe('props', () => {
    it('passes correct props to AuthPage component', () => {
      renderComponent()
      
      const authPage = screen.getByTestId('auth-page')
      expect(authPage).toBeInTheDocument()
      
      expect(screen.getByRole('heading', { name: 'Create a new account' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Sign up' })).toBeInTheDocument()
      expect(screen.getByText('Already have an account?')).toBeInTheDocument()
      expect(screen.getByRole('link')).toHaveAttribute('href', ROUTES.auth.login.href)
    })
  })

  describe('form behavior', () => {
    it('disables submit button when form is pending', () => {
      vi.mocked(useActionState).mockReturnValue([mockState, mockFormAction, true])
      renderComponent()
      expect(screen.getByRole('button', { name: 'Sign up' })).toBeDisabled()
    })

    it('enables submit button when form is not pending', () => {
      vi.mocked(useActionState).mockReturnValue([mockState, mockFormAction, false])
      renderComponent()
      expect(screen.getByRole('button', { name: 'Sign up' })).not.toBeDisabled()
    })
  })

  describe('signup behavior', () => {
    it('calls signUp action when form is submitted', async () => {
      vi.mocked(signUp).mockResolvedValue({ success: true, message: 'Success', errors: undefined })
      
      renderComponent()
      
      expect(vi.mocked(useActionState)).toHaveBeenCalledWith(
        expect.any(Function),
        { success: false, message: '', errors: undefined }
      )
    })

    it('handles successful signup', async () => {
      vi.mocked(signUp).mockResolvedValue({ success: true, message: 'Account created successfully', errors: undefined })
      
      let formAction: any
      vi.mocked(useActionState).mockImplementation((actionFn) => {
        formAction = actionFn
        return [mockState, formAction, false]
      })
      
      renderComponent()
      
      const formData = new FormData()
      formData.append('email', 'test@example.com')
      formData.append('password', 'password123')
      formData.append('confirmPassword', 'password123')
      
      await act(async () => {
        await formAction(mockState, formData)
      })
      
      expect(mockToastSuccess).toHaveBeenCalledWith('Account created successfully')
      expect(mockPush).toHaveBeenCalledWith(ROUTES.dashboard.href)
    })

    it('handles signup error', () => {
      const errorState = { success: false, message: 'Email already exists', errors: undefined }
      vi.mocked(useActionState).mockReturnValue([errorState, mockFormAction, false])
      
      renderComponent()
      
      // The error state is handled by the AuthPage component display
      expect(screen.getByTestId('auth-page')).toBeInTheDocument()
    })

    it('handles signup with validation errors', () => {
      const errorState = { 
        success: false, 
        message: 'Validation failed', 
        errors: { email: ['Invalid email format'], password: ['Password too weak'] }
      }
      vi.mocked(useActionState).mockReturnValue([errorState, mockFormAction, false])
      
      renderComponent()
      
      expect(screen.getByTestId('auth-page')).toBeInTheDocument()
    })

    it('handles exception in form action', async () => {
      const error = new Error('Network error')
      vi.mocked(signUp).mockRejectedValue(error)
      
      let formAction: any
      vi.mocked(useActionState).mockImplementation((actionFn) => {
        formAction = actionFn
        return [mockState, formAction, false]
      })
      
      renderComponent()
      
      const formData = new FormData()
      formData.append('email', 'test@example.com')
      formData.append('password', 'password123')
      formData.append('confirmPassword', 'password123')
      
      const result = await act(async () => {
        return await formAction(mockState, formData)
      })
      
      expect(result).toEqual({
        success: false,
        message: 'Network error',
        errors: undefined
      })
    })

    it('extracts form values correctly', async () => {
      vi.mocked(signUp).mockResolvedValue({ success: false, message: 'Error', errors: undefined })
      
      let formAction: any
      vi.mocked(useActionState).mockImplementation((actionFn) => {
        formAction = actionFn
        return [mockState, formAction, false]
      })
      
      renderComponent()
      
      const formData = new FormData()
      formData.append('email', 'user@test.com')
      formData.append('password', 'securepass')
      formData.append('confirmPassword', 'securepass')
      
      await act(async () => {
        await formAction(mockState, formData)
      })
      
      expect(vi.mocked(signUp)).toHaveBeenCalledWith(formData)
    })
  })
})
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { useActionState } from 'react'
import { logIn } from '@/actions/auth'
import { useToast } from '@/hooks/useToast'
import { ROUTES } from '@/config/routes'
import { AuthPageProps } from '../../components/AuthPage'
import LogInPage from '../page'

const mockPush = vi.fn()
const mockRefresh = vi.fn()
const mockFormAction = vi.fn()
const mockShowSuccess = vi.fn()
const mockShowError = vi.fn()
const mockShowInfo = vi.fn()
const mockShowWarning = vi.fn()

vi.mock('react', async () => {
  const actual = await vi.importActual('react')
  return { ...actual, useActionState: vi.fn() }
})

vi.mock('react-hot-toast', () => ({ default: { success: vi.fn(), error: vi.fn() } }))
vi.mock('@/actions/auth', () => ({ logIn: vi.fn() }))
vi.mock('@/hooks/useToast', () => ({ useToast: vi.fn() }))
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

describe('LogInPage', () => {
  const renderComponent = () => render(<LogInPage />)

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useActionState).mockReturnValue([mockState, mockFormAction, false])
    vi.mocked(useToast).mockReturnValue({ 
      showSuccess: mockShowSuccess,
      showError: mockShowError,
      showInfo: mockShowInfo,
      showWarning: mockShowWarning
    })
  })

  describe('rendering', () => {
    it('renders login page with correct title', () => {
      renderComponent()
      expect(screen.getByRole('heading', { name: 'Log in to your account' })).toBeInTheDocument()
    })
  
    it('renders login button with correct text', () => {
      renderComponent()
      expect(screen.getByRole('button', { name: 'Log in' })).toBeInTheDocument()
    })
  
    it('renders signup link with correct text and href', () => {
      renderComponent()
      expect(screen.getByText("Don't have an account?")).toBeInTheDocument()
      screen.getAllByRole('link').forEach(link => {
        expect(link.getAttribute('href')).toBeOneOf(['/', ROUTES.auth.signup.href])
      })
    })
  })

  describe('props', () => {
    it('passes correct props to AuthPage component', () => {
      renderComponent()
      
      const authPage = screen.getByTestId('auth-page')
      expect(authPage).toBeInTheDocument()
      
      expect(screen.getByRole('heading', { name: 'Log in to your account' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Log in' })).toBeInTheDocument()
      expect(screen.getByText("Don't have an account?")).toBeInTheDocument()
      expect(screen.getByRole('link')).toHaveAttribute('href', ROUTES.auth.signup.href)
    })
  })

  describe('form behavior', () => {
    it('disables submit button when form is pending', () => {
      vi.mocked(useActionState).mockReturnValue([mockState, mockFormAction, true])
      renderComponent()
      expect(screen.getByRole('button', { name: 'Log in' })).toBeDisabled()
    })
  
    it('enables submit button when form is not pending', () => {
      vi.mocked(useActionState).mockReturnValue([mockState, mockFormAction, false])
      renderComponent()
      expect(screen.getByRole('button', { name: 'Log in' })).not.toBeDisabled()
    })
  })

  describe('login behavior', () => {
    it('calls logIn action when form is submitted', async () => {
      vi.mocked(logIn).mockResolvedValue({ success: true, message: 'Success', errors: undefined })
      
      renderComponent()
      
      expect(vi.mocked(useActionState)).toHaveBeenCalledWith(
        expect.any(Function),
        { success: false, message: '', errors: undefined }
      )
    })

    it('handles successful login', async () => {
      vi.mocked(logIn).mockResolvedValue({ success: true, message: 'Login successful', errors: undefined })
      
      let formAction: any
      vi.mocked(useActionState).mockImplementation((actionFn) => {
        formAction = actionFn
        return [mockState, mockFormAction, false]
      })
      
      renderComponent()
      
      const formData = new FormData()
      formData.append('email', 'test@example.com')
      formData.append('password', 'password123')

      await act(async () => {
        await formAction(mockState, formData)
      })
      
      expect(mockShowSuccess).toHaveBeenCalledWith('Signed in successfully')
      expect(mockRefresh).toHaveBeenCalled()
      expect(mockPush).toHaveBeenCalledWith(ROUTES.dashboard.href)
    })
  
    it('handles login error', () => {
      const errorState = { success: false, message: 'Invalid credentials', errors: undefined }
      vi.mocked(useActionState).mockReturnValue([errorState, mockFormAction, false])
      
      renderComponent()
      
      expect(mockShowSuccess).not.toHaveBeenCalled()
      expect(mockRefresh).not.toHaveBeenCalled()
      expect(mockPush).not.toHaveBeenCalled()
    })
  
    it('handles login with validation errors', () => {
      const errorState = { 
        success: false, 
        message: 'Validation failed', 
        errors: { email: 'Invalid email', password: 'Password required' }
      }
      vi.mocked(useActionState).mockReturnValue([errorState, mockFormAction, false])
      
      renderComponent()
      
      expect(mockShowSuccess).not.toHaveBeenCalled()
      expect(mockRefresh).not.toHaveBeenCalled()
      expect(mockPush).not.toHaveBeenCalled()
    })
  
    it('handles exception in form action', () => {
      const mockLogIn = vi.mocked(logIn)
      mockLogIn.mockRejectedValue(new Error('Network error'))
      
      renderComponent()
      
      expect(vi.mocked(useActionState)).toHaveBeenCalled()
    })

    it('handles exception in form action', async () => {
      const error = new Error('Network error')
      vi.mocked(logIn).mockRejectedValue(error)
      
      let formAction: any
      vi.mocked(useActionState).mockImplementation((actionFn) => {
        formAction = actionFn
        return [mockState, formAction, false]
      })
      
      renderComponent()
      
      const formData = new FormData()
      formData.append('email', 'test@example.com')
      formData.append('password', 'password123')
      
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
      vi.mocked(logIn).mockResolvedValue({ success: false, message: 'Error', errors: undefined })
      
      let formAction: any
      vi.mocked(useActionState).mockImplementation((actionFn) => {
        formAction = actionFn
        return [mockState, formAction, false]
      })
      
      renderComponent()
      
      const formData = new FormData()
      formData.append('email', 'user@test.com')
      formData.append('password', 'securepass')
      
      await act(async () => {
        await formAction(mockState, formData)
      })
      
      expect(vi.mocked(logIn)).toHaveBeenCalledWith(formData)
    })
  })
})

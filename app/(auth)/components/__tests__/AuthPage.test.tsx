import { ReactNode } from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ButtonProps } from '@/app/components/Button'
import { FormProps} from '@/app/components/Form'
import { AuthPage, AuthPageProps } from '../AuthPage'

vi.mock('@/app/components/Button', () => ({
  Button: ({ children, type, isLoading, fullWidth, className, ...props }: ButtonProps) => (
    <button type={type} disabled={isLoading} className={`${className} ${fullWidth ? 'w-full' : ''}`} {...props} role="button">
      {isLoading ? 'Loading...' : children}
    </button>
  ),
}))

vi.mock('@/app/components/Form', () => ({
  Form: ({ children, action }: FormProps) => <form onSubmit={(e) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    typeof action === 'function' && action(formData)
  }}>{children}</form>,
  FormError: ({ children }: { children: ReactNode }) => <div role="alert" className="error">{children}</div>
}))

const mockFormAction = vi.fn()
const MockFormFields = () => <input name="email" placeholder="Email" />
const defaultProps: AuthPageProps = {
  title: 'Sign In',
  ctaText: "Don't have an account?",
  ctaLink: { href: '/register', name: 'Sign up' },
  submitButtonText: 'Sign In',
  formData: [{ success: false, message: '' }, mockFormAction, false],
  FormFields: MockFormFields
}

describe('AuthPage', () => {
  const renderComponent = (props: Partial<AuthPageProps> = {}) => render(<AuthPage {...defaultProps} {...props} />)

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('renders the auth page with all required elements', () => {
      renderComponent()
      
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Patient Portal')
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(defaultProps.title)
      expect(screen.getByRole('button', { name: defaultProps.submitButtonText })).toBeInTheDocument()
      expect(screen.getByText('Don\'t have an account?')).toBeInTheDocument()
      expect(screen.getByRole('link', { name: defaultProps.ctaLink.name })).toHaveAttribute('href', defaultProps.ctaLink.href)
    })

    it('renders the home link correctly', () => {
      renderComponent()
      
      const homeLink = screen.getByRole('link', { name: 'Patient Portal' })
      expect(homeLink).toHaveAttribute('href', '/')
    })

    it('renders custom form fields', () => {
      renderComponent()
      
      expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
    })

    it('renders FormFields component inside the form', () => {
      renderComponent()
      
      const form = screen.getByRole('button').closest('form')
      const emailInput = screen.getByPlaceholderText('Email')
      
      expect(form).toContainElement(emailInput)
    })
  })

  describe('form state', () => {
    it('displays error message when state has error', () => {
      renderComponent({
        ...defaultProps,
        formData: [{ success: false, message: 'Invalid credentials' }, mockFormAction, false]
      })
      
      expect(screen.getByRole('alert')).toHaveTextContent('Invalid credentials')
    })

    it('does not display error when state is successful', () => {
      renderComponent({
        ...defaultProps,
        formData: [{ success: true, message: 'Success message' }, mockFormAction, false]
      })
      
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })

    it('does not display error when message is empty', () => {
      renderComponent({
        ...defaultProps,
        formData: [{ success: false, message: '' }, mockFormAction, false]
      })
      
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })

    it('does not render FormError when state is null', () => {
      renderComponent({
        ...defaultProps,
        formData: [null as any, mockFormAction, false]
      })
      
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })

    it('does not render FormError when state.message is null', () => {
      renderComponent({
        ...defaultProps,
        formData: [{ success: false, message: null as any }, mockFormAction, false]
      })
      
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })

    it('shows loading state on submit button when pending', () => {
      renderComponent({
        ...defaultProps,
        formData: [{ success: false, message: '' }, mockFormAction, true]
      })
      
      const submitButton = screen.getByRole('button')
      expect(submitButton).toHaveTextContent('Loading...')
      expect(submitButton).toBeDisabled()
    })
  })

  describe('props', () => {
    it('renders different titles correctly', () => {
      renderComponent({
        ...defaultProps,
        title: 'Create Account'
      })
      
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Create Account')
    })

    it('renders different CTA text and links', () => {
      renderComponent({
        ...defaultProps,
        ctaText: 'Already have an account?',
        ctaLink: { href: '/login', name: 'Sign in' }
      })
      
      expect(screen.getByText('Already have an account?')).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Sign in' })).toHaveAttribute('href', '/login')
    })

    it('renders different submit button text', () => {
      const customProps: AuthPageProps = {
        ...defaultProps,
        submitButtonText: 'Create Account'
      }
      
      render(<AuthPage {...customProps} />)
      
      expect(screen.getByRole('button', { name: 'Create Account' })).toBeInTheDocument()
    })

    it('passes isLoading state correctly to Button', () => {
      renderComponent({
        ...defaultProps,
        formData: [{ success: false, message: '' }, mockFormAction, true]
      })
      
      const submitButton = screen.getByRole('button')
      expect(submitButton).toBeDisabled()
    })
  })

  describe('props edge cases', () => {
    it('handles undefined formData gracefully', () => {
      const propsWithoutFormData: AuthPageProps = ({
        ...defaultProps,
        formData: undefined as any
      })
      
      expect(() => renderComponent(propsWithoutFormData)).not.toThrow()
    })

    it('handles null formData gracefully', () => {
      const propsWithNullFormData: AuthPageProps = {
        ...defaultProps,
        formData: null as any
      }
      
      expect(() => renderComponent(propsWithNullFormData)).not.toThrow()
    })

    it('handles formData with missing elements', () => {
      const propsWithIncompleteFormData: AuthPageProps = {
        ...defaultProps,
        formData: [{ success: false, message: '' }] as any
      }
      
      expect(() => renderComponent(propsWithIncompleteFormData)).not.toThrow()
    })

    it('renders with default FormFields when not provided', () => {
      const propsWithoutFormFields: AuthPageProps = {
        ...defaultProps,
        FormFields: undefined as any
      }
      
      expect(() => renderComponent(propsWithoutFormFields)).not.toThrow()
    })
  })

  describe('form submission', () => {
    it('passes FormData object to form action when form is submitted', () => {
      renderComponent()
      
      const emailInput = screen.getByPlaceholderText('Email')
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
      
      const form = screen.getByRole('button').closest('form')
      fireEvent.submit(form!)
      
      expect(mockFormAction).toHaveBeenCalledWith(expect.any(FormData))
    })

    it('handles form submission when formAction is not a function', () => {
      renderComponent({
        ...defaultProps,
        formData: [{ success: false, message: '' }, 'not-a-function' as any, false]
      })
      
      const form = screen.getByRole('button').closest('form')
      
      expect(() => fireEvent.submit(form!)).not.toThrow()
    })
  })

  describe('Accessibility', () => {
    it('has proper heading hierarchy', () => {
      renderComponent()
      
      const h1 = screen.getByRole('heading', { level: 1 })
      const h2 = screen.getByRole('heading', { level: 2 })
      
      expect(h1).toBeInTheDocument()
      expect(h2).toBeInTheDocument()
    })

    it('submit button has correct type', () => {
      renderComponent()
      
      const submitButton = screen.getByRole('button')
      expect(submitButton).toHaveAttribute('type', 'submit')
    })

    it('has proper aria-label for authentication form section', () => {
      renderComponent()
      
      const section = screen.getByLabelText('Authentication Form')
      expect(section).toBeInTheDocument()
      expect(section.tagName).toBe('SECTION')
    })
  })
})

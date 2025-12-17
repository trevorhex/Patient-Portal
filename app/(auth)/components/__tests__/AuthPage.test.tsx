import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { AuthPage, AuthPageProps } from '../AuthPage'

vi.mock('@/app/components/Button', () => ({
  Button: ({ children, type, isLoading, fullWidth, className, ...props }: any) => (
    <button type={type} disabled={isLoading} className={`${className} ${fullWidth ? 'w-full' : ''}`} {...props} role="button">
      {isLoading ? 'Loading...' : children}
    </button>
  ),
}))

vi.mock('@/app/components/Form', () => ({
  Form: ({ children, action }: any) => <form onSubmit={action}>{children}</form>,
  FormError: ({ children }: any) => <div role="alert" className="error">{children}</div>
}))

const MockFormFields = () => <input name="email" placeholder="Email" />

describe('AuthPage', () => {
  const mockFormAction = vi.fn()
  
  const defaultProps: AuthPageProps = {
    title: 'Sign In',
    ctaText: "Don't have an account?",
    ctaLink: { href: '/register', name: 'Sign up' },
    submitButtonText: 'Sign In',
    formData: [{ success: false, message: '' }, mockFormAction, false],
    FormFields: MockFormFields
  }

  const renderComponent = (props: Partial<AuthPageProps> = {}) => render(<AuthPage {...defaultProps} {...props} />)

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders the auth page with all required elements', () => {
      renderComponent()
      
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Patient Portal')
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(defaultProps.title)
      expect(screen.getByRole('button', { name: defaultProps.submitButtonText })).toBeInTheDocument()
      expect(screen.getByText("Don't have an account?")).toBeInTheDocument()
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
  })

  describe('Form State Handling', () => {
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

  describe('Form Interaction', () => {
    it('calls form action on form submission', () => {
      renderComponent()
      
      const form = screen.getByRole('button').closest('form')
      fireEvent.submit(form!)
      
      expect(mockFormAction).toHaveBeenCalled()
    })
  })

  describe('Props Variations', () => {
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

    it('handles undefined formData gracefully', () => {
      const propsWithoutFormData: AuthPageProps = ({
        ...defaultProps,
        formData: undefined as any
      })
      
      expect(() => renderComponent(propsWithoutFormData)).not.toThrow()
    })

    it('renders with default FormFields when not provided', () => {
      const propsWithoutFormFields: AuthPageProps = {
        ...defaultProps,
        FormFields: undefined as any
      }
      
      expect(() => renderComponent(propsWithoutFormFields)).not.toThrow()
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
  })
})

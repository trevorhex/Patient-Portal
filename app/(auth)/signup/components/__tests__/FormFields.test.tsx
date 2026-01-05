import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FormFields, FormFieldsProps } from '../FormFields'
import { FormDataType } from '@/app/components/Form/types'
import { FormInput } from '@/app/components/Form'

vi.mock('@/app/components/Form', async () => {
  const actual = await vi.importActual('@/app/components/Form')
  return {
    ...actual,
    FormInput: vi.fn(({ label, invalid, ...props }) => (
      <div data-testid={`form-input-${props.name}`}>
        <label>{label}</label>
        <input {...props} invalid={invalid?.toString()} />
      </div>
    ))
  }
})

const mockFormData: FormDataType = [{ success: false, message: '' }, vi.fn(), false]
const mockValues = { email: 'test@example.com', password: 'password123', confirmPassword: 'password123' }
const defaultProps: FormFieldsProps = { formData: mockFormData, values: mockValues }

describe('FormFields', () => {
  const renderComponent = (props: FormFieldsProps = defaultProps) => render(<FormFields {...props} />)

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render email, password, and confirm password input fields', () => {
    renderComponent()

    expect(screen.getByTestId('form-input-email')).toBeInTheDocument()
    expect(screen.getByTestId('form-input-password')).toBeInTheDocument()
    expect(screen.getByTestId('form-input-confirmPassword')).toBeInTheDocument()
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByText('Password')).toBeInTheDocument()
    expect(screen.getByText('Confirm Password')).toBeInTheDocument()
  })

  it('should pass correct props to email input', () => {
    renderComponent()

    expect(FormInput).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        type: 'email',
        name: 'email',
        autoComplete: 'email',
        label: 'Email',
        defaultValue: 'test@example.com',
        disabled: false,
        invalid: false,
        hint: undefined,
        required: true
      }),
      undefined
    )
  })

  it('should pass correct props to password input', () => {
    renderComponent()

    expect(FormInput).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        type: 'password',
        name: 'password',
        autoComplete: 'new-password',
        label: 'Password',
        defaultValue: 'password123',
        disabled: false,
        invalid: false,
        hint: undefined,
        required: true
      }),
      undefined
    )
  })

  it('should pass correct props to confirm password input', () => {
    renderComponent()

    expect(FormInput).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({
        type: 'password',
        name: 'confirmPassword',
        autoComplete: 'new-password',
        label: 'Confirm Password',
        defaultValue: 'password123',
        disabled: false,
        invalid: false,
        hint: undefined,
        required: true
      }),
      undefined
    )
  })

  it('should handle empty values gracefully', () => {
    renderComponent({ ...defaultProps, values: {} })

    expect(FormInput).toHaveBeenNthCalledWith(1, expect.objectContaining({ name: 'email', defaultValue: '' }), undefined)
    expect(FormInput).toHaveBeenNthCalledWith(2, expect.objectContaining({ name: 'password', defaultValue: '' }), undefined)
    expect(FormInput).toHaveBeenNthCalledWith(3, expect.objectContaining({ name: 'confirmPassword', defaultValue: '' }), undefined)
  })

  it('should disable inputs when isPending is true', () => {
    renderComponent({ ...defaultProps, formData: [{ success: false, message: '' }, vi.fn(), true] })

    expect(FormInput).toHaveBeenNthCalledWith(1, expect.objectContaining({ name: 'email', disabled: true }), undefined)
    expect(FormInput).toHaveBeenNthCalledWith(2, expect.objectContaining({ name: 'password', disabled: true }), undefined)
    expect(FormInput).toHaveBeenNthCalledWith(3, expect.objectContaining({ name: 'confirmPassword', disabled: true }), undefined)
  })

  it('should show email error state when email errors exist', () => {
    const errorState = { errors: { email: ['Invalid email address'] } }
    renderComponent({ ...defaultProps, formData: [{ success: false, message: '', ...errorState }, vi.fn(), false] })

    expect(FormInput).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        name: 'email',
        invalid: true,
        hint: 'Invalid email address'
      }),
      undefined
    )
  })

  it('should show password error state when password errors exist', () => {
    const errorState = { errors: { password: ['Password too short'] } }
    renderComponent({ ...defaultProps, formData: [{ success: false, message: '', ...errorState }, vi.fn(), false] })

    expect(FormInput).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        name: 'password',
        invalid: true,
        hint: 'Password too short'
      }),
      undefined
    )
  })

  it('should show confirm password error state when confirm password errors exist', () => {
    const errorState = { errors: { confirmPassword: ['Passwords do not match'] } }
    renderComponent({ ...defaultProps, formData: [{ success: false, message: '', ...errorState }, vi.fn(), false] })

    expect(FormInput).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({
        name: 'confirmPassword',
        invalid: true,
        hint: 'Passwords do not match'
      }),
      undefined
    )
  })

  it('should handle multiple errors and show first error message', () => {
    const errorState = { 
      errors: { 
        email: ['Invalid email', 'Email required'], 
        password: ['Password too short', 'Password required'],
        confirmPassword: ['Passwords do not match', 'Confirm password required']
      } 
    }
    renderComponent({ ...defaultProps, formData: [{ success: false, message: '', ...errorState }, vi.fn(), false] })

    expect(FormInput).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        name: 'email',
        invalid: true,
        hint: 'Invalid email'
      }),
      undefined
    )

    expect(FormInput).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        name: 'password',
        invalid: true,
        hint: 'Password too short'
      }),
      undefined
    )

    expect(FormInput).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({
        name: 'confirmPassword',
        invalid: true,
        hint: 'Passwords do not match'
      }),
      undefined
    )
  })

  it('should handle partial values object', () => {
    renderComponent({ ...defaultProps, values: { email: 'test@example.com' } })

    expect(FormInput).toHaveBeenNthCalledWith(1, expect.objectContaining({ name: 'email', defaultValue: 'test@example.com' }), undefined)
    expect(FormInput).toHaveBeenNthCalledWith(2, expect.objectContaining({ name: 'password', defaultValue: '' }), undefined)
    expect(FormInput).toHaveBeenNthCalledWith(3, expect.objectContaining({ name: 'confirmPassword', defaultValue: '' }), undefined)
  })

  it('should handle state without errors property', () => {
    renderComponent({ ...defaultProps, formData: [{ success: false, message: 'Some error' }, vi.fn(), false] })

    expect(FormInput).toHaveBeenNthCalledWith(1, expect.objectContaining({ invalid: false, hint: undefined }), undefined)
    expect(FormInput).toHaveBeenNthCalledWith(2, expect.objectContaining({ invalid: false, hint: undefined }), undefined)
    expect(FormInput).toHaveBeenNthCalledWith(3, expect.objectContaining({ invalid: false, hint: undefined }), undefined)
  })

  it('should use new-password autocomplete for both password fields', () => {
    renderComponent()

    expect(FormInput).toHaveBeenNthCalledWith(2, expect.objectContaining({ autoComplete: 'new-password' }), undefined)
    expect(FormInput).toHaveBeenNthCalledWith(3, expect.objectContaining({ autoComplete: 'new-password' }), undefined)
  })

  it('should render all fields with required attribute', () => {
    renderComponent()

    expect(FormInput).toHaveBeenNthCalledWith(1, expect.objectContaining({ required: true }), undefined)
    expect(FormInput).toHaveBeenNthCalledWith(2, expect.objectContaining({ required: true }), undefined)
    expect(FormInput).toHaveBeenNthCalledWith(3, expect.objectContaining({ required: true }), undefined)
  })
})
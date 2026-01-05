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
const mockValues = { email: 'test@example.com', password: 'password123' }
const defaultProps: FormFieldsProps = { formData: mockFormData, values: mockValues }

describe('FormFields', () => {
  const renderComponent = (props: FormFieldsProps = defaultProps) => render(<FormFields {...props} />)

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render email and password input fields', () => {
    renderComponent()

    expect(screen.getByTestId('form-input-email')).toBeInTheDocument()
    expect(screen.getByTestId('form-input-password')).toBeInTheDocument()
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByText('Password')).toBeInTheDocument()
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
        autoComplete: 'current-password',
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
  
  it('should handle empty values gracefully', () => {
    renderComponent({ ...defaultProps, values: {} })
  
    expect(FormInput).toHaveBeenNthCalledWith(1, expect.objectContaining({ name: 'email', defaultValue: '' }), undefined)
    expect(FormInput).toHaveBeenNthCalledWith(2, expect.objectContaining({ name: 'password', defaultValue: '' }), undefined)
  })
  
  it('should disable inputs when isPending is true', () => {
    renderComponent({ ...defaultProps, formData: [{ success: false, message: '' }, vi.fn(), true] })
  
    expect(FormInput).toHaveBeenNthCalledWith(1, expect.objectContaining({ name: 'email', disabled: true }), undefined)
    expect(FormInput).toHaveBeenNthCalledWith(2, expect.objectContaining({ name: 'password', disabled: true }), undefined)
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
  
  it('should handle multiple errors and show first error message', () => {
    const errorState = { errors: { email: ['Invalid email', 'Email required'], password: ['Password too short', 'Password required'] } }
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
  })
})

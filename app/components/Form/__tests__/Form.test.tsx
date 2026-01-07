import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Form, FormProps } from '../index'

const defaultProps: FormProps = {
  children: <input data-testid="test-input" />
}

describe('Form Component', () => {
  const renderComponent = (props: Partial<FormProps> = {}) => render(<Form role="form" {...defaultProps} {...props} />)

  it('renders form element with children', () => {
    renderComponent()
    
    const form = screen.getByRole('form')
    const input = screen.getByTestId('test-input')
    
    expect(form).toBeInTheDocument()
    expect(input).toBeInTheDocument()
    expect(form).toContainElement(input)
  })

  it('applies default className', () => {
    renderComponent()
    
    const form = screen.getByRole('form')
    expect(form).toHaveClass('space-y-5')
  })

  it('merges custom className with default className', () => {
    renderComponent({ className: 'custom-class' })
    
    const form = screen.getByRole('form')
    expect(form).toHaveClass('space-y-5 custom-class')
  })

  it('handles undefined className', () => {
    renderComponent({ className: undefined })
    
    const form = screen.getByRole('form')
    expect(form).toHaveClass('space-y-5')
  })

  it('forwards form HTML attributes', () => {
    renderComponent({ method: 'POST', action: '/submit', id: 'test-form' })

    const form = screen.getByRole('form')
    expect(form).toHaveAttribute('method', 'POST')
    expect(form).toHaveAttribute('action', '/submit')
    expect(form).toHaveAttribute('id', 'test-form')
  })

  it('handles form submission', () => {
    const onSubmit = vi.fn((e) => e.preventDefault())
    renderComponent({ onSubmit, children: <button type="submit">Submit</button> })
    
    const submitButton = screen.getByRole('button', { name: 'Submit' })
    
    fireEvent.click(submitButton)
    expect(onSubmit).toHaveBeenCalledTimes(1)
  })

  it('supports form validation attributes', () => {
    renderComponent({ noValidate: true })
    
    const form = screen.getByRole('form')
    expect(form).toHaveAttribute('noValidate')
  })

  it('renders multiple children correctly', () => {
    const children = <>
      <input data-testid="input-1" />
      <input data-testid="input-2" />
      <button data-testid="button-1">Submit</button>
    </>
    renderComponent({ children })
    
    const form = screen.getByRole('form')
    const input1 = screen.getByTestId('input-1')
    const input2 = screen.getByTestId('input-2')
    const button = screen.getByTestId('button-1')
    
    expect(form).toContainElement(input1)
    expect(form).toContainElement(input2)
    expect(form).toContainElement(button)
  })

  it('handles complex children structures', () => {
    const children = <>
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" data-testid="email-input" />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input id="password" type="password" data-testid="password-input" />
      </div>
    </>
    renderComponent({ children })
    
    const form = screen.getByRole('form')
    const emailInput = screen.getByTestId('email-input')
    const passwordInput = screen.getByTestId('password-input')
    const emailLabel = screen.getByText('Email')
    const passwordLabel = screen.getByText('Password')
    
    expect(form).toContainElement(emailInput)
    expect(form).toContainElement(passwordInput)
    expect(form).toContainElement(emailLabel)
    expect(form).toContainElement(passwordLabel)
  })

  it('supports all standard form events', () => {
    const onReset = vi.fn()
    const onChange = vi.fn()
    const onFocus = vi.fn()
    const onBlur = vi.fn()
    const children = <>
      <input data-testid="input" />
      <button type="reset">Reset</button>
    </>
    renderComponent({ onReset, onChange, onFocus, onBlur, children })
    
    const form = screen.getByRole('form')
    const input = screen.getByTestId('input')
    
    fireEvent.focus(form)
    expect(onFocus).toHaveBeenCalledTimes(1)
    
    fireEvent.blur(form)
    expect(onBlur).toHaveBeenCalledTimes(1)
    
    fireEvent.change(input, { target: { value: 'test' } })
    expect(onChange).toHaveBeenCalledTimes(1)
    
    fireEvent.reset(form)
    expect(onReset).toHaveBeenCalledTimes(1)
  })

  it('maintains semantic HTML structure', () => {
    const children = <fieldset>
      <legend>Personal Information</legend>
      <input name="name" data-testid="name-input" />
    </fieldset>
    renderComponent({ children })
    
    const form = screen.getByRole('form')
    const fieldset = screen.getByRole('group', { name: 'Personal Information' })
    const input = screen.getByTestId('name-input')
    
    expect(form).toContainElement(fieldset)
    expect(fieldset).toContainElement(input)
  })
})

import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { createRef } from 'react'
import { FormInput, FormInputProps } from '../FormInput'
import * as styles from '../../styles'

const baseStyles = styles.baseStyles.trim().split(/\s+/)
const labelStyles = styles.labelStyles.trim().split(/\s+/)
const inputErrorClass = styles.inputErrorClass
const errorClass = styles.errorClass

vi.spyOn(console, 'error').mockImplementation(() => {})
vi.mock('@headlessui/react', async (importActual) => {
  const actual = await importActual<typeof import('@headlessui/react')>()
  return {
    ...actual,
    Input: ({ ...props }: any) => <input {...props} />,
  }
})

describe('FormInput', () => {
  const renderComponent = (props: Partial<FormInputProps> = {}) => render(<FormInput {...props} />)

  describe('basic rendering', () => {
    it('renders an input element', () => {
      renderComponent()
      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })

    it('renders with default text type', () => {
      renderComponent()
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('type', 'text')
    })

    it('applies base styles to input', () => {
      renderComponent()
      const input = screen.getByRole('textbox')
      expect(input).toHaveClass(...baseStyles)
    })
  })

  describe('label', () => {
    it('renders label when provided', () => {
      renderComponent({ label: 'Username' })
      expect(screen.getByText('Username')).toBeInTheDocument()
    })

    it('does not render label when not provided', () => {
      renderComponent()
      expect(screen.queryByRole('textbox')).toBeInTheDocument()
      expect(screen.queryByText('Username')).not.toBeInTheDocument()
    })

    it('applies label styles', () => {
      renderComponent({ label: 'Username' })
      const label = screen.getByText('Username')
      expect(label).toHaveClass(...labelStyles)
    })

    it('applies custom label className', () => {
      renderComponent({ label: 'Username', labelClassName: 'custom-label' })
      const label = screen.getByText('Username')
      expect(label).toHaveClass(...labelStyles, 'custom-label')
    })
  })

  describe('description', () => {
    it('renders description when provided', () => {
      renderComponent({ description: 'Enter your username' })
      expect(screen.getByText('Enter your username')).toBeInTheDocument()
    })

    it('does not render description when not provided', () => {
      renderComponent()
      expect(screen.queryByText('Enter your username')).not.toBeInTheDocument()
    })

    it('applies custom description className', () => {
      renderComponent({ description: 'Enter your username', descriptionClassName: 'custom-desc' })
      const description = screen.getByText('Enter your username')
      expect(description).toHaveClass('custom-desc')
    })
  })

  describe('hint', () => {
    it('renders hint when provided', () => {
      renderComponent({ hint: 'This field is required' })
      expect(screen.getByText('This field is required')).toBeInTheDocument()
    })

    it('does not render hint when not provided', () => {
      renderComponent()
      expect(screen.queryByText('This field is required')).not.toBeInTheDocument()
    })

    it('connects hint to input via aria-describedby', () => {
      renderComponent({ hint: 'This field is required' })
      const input = screen.getByRole('textbox')
      const hint = screen.getByText('This field is required')
      
      expect(input).toHaveAttribute('aria-describedby')
      expect(hint).toHaveAttribute('id')
      expect(input.getAttribute('aria-describedby')).toBe(hint.getAttribute('id'))
    })

    it('does not set aria-describedby when no hint', () => {
      renderComponent()
      const input = screen.getByRole('textbox')
      expect(input).not.toHaveAttribute('aria-describedby')
    })
  })

  describe('input types', () => {
    it('renders password input when type is password', () => {
      const { container } = renderComponent({ type: 'password' })
      expect(container.querySelector('input[type="password"]')).toBeInTheDocument()
    })

    it('renders email input when type is email', () => {
      renderComponent({ type: 'email' })
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('type', 'email')
    })

    it('renders number input when type is number', () => {
      renderComponent({ type: 'number' })
      const input = screen.getByRole('spinbutton')
      expect(input).toHaveAttribute('type', 'number')
    })
  })

  describe('invalid state', () => {
    it('applies error class when invalid is true', () => {
      renderComponent({ invalid: true })
      const input = screen.getByRole('textbox')
      expect(input).toHaveClass(inputErrorClass)
    })

    it('does not apply error class when invalid is false', () => {
      renderComponent({ invalid: false })
      const input = screen.getByRole('textbox')
      expect(input).toHaveClass(...baseStyles)
      expect(input).not.toHaveClass(inputErrorClass)
    })

    it('applies error class to hint when invalid', () => {
      renderComponent({ hint: 'Error message', invalid: true })
      const hint = screen.getByText('Error message')
      expect(hint).toHaveClass('text-xs', errorClass)
    })

    it('does not apply error class to hint when valid', () => {
      renderComponent({ hint: 'Helper message', invalid: false })
      const hint = screen.getByText('Helper message')
      expect(hint).toHaveClass('text-xs')
      expect(hint).not.toHaveClass(errorClass)
    })
  })

  describe('disabled state', () => {
    it('disables the field when disabled prop is true', () => {
      renderComponent({ disabled: true })
      const input = screen.getByRole('textbox')
      expect(input).toBeDisabled()
    })

    it('enables the field when disabled prop is false', () => {
      renderComponent({ disabled: false })
      const input = screen.getByRole('textbox')
      expect(input).toBeEnabled()
    })
  })

  describe('custom classes', () => {
    it('applies custom className to input', () => {
      renderComponent({ className: 'custom-input' })
      const input = screen.getByRole('textbox')
      expect(input).toHaveClass(...baseStyles, 'custom-input')
    })

    it('applies custom fieldClassName to field wrapper', () => {
      renderComponent({ fieldClassName: 'custom-field' })
      const field = screen.getByRole('textbox').closest('div')
      expect(field).toHaveClass('flex', 'flex-col', 'gap-1', 'custom-field')
    })
  })

  describe('HTML attributes', () => {
    it('passes through HTML input attributes', () => {
      renderComponent({ placeholder: 'Enter text', maxLength: 100, required: true })
      const input = screen.getByRole('textbox')
      
      expect(input).toHaveAttribute('placeholder', 'Enter text')
      expect(input).toHaveAttribute('maxLength', '100')
      expect(input).toHaveAttribute('required')
    })

    it('passes through value and onChange', () => {
      const handleChange = vi.fn()
      renderComponent({ value: 'test value', onChange: handleChange })
      const input = screen.getByRole('textbox')
      
      expect(input).toHaveValue('test value')
      expect(input).toHaveAttribute('value', 'test value')

      fireEvent.change(input, { target: { value: 'test' } })
      expect(handleChange).toHaveBeenCalled()
    })

    it('passes through name attribute', () => {
      renderComponent({ name: 'username' })
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('name', 'username')
    })
  })

  describe('ref forwarding', () => {
    it('forwards ref to input element', () => {
      const ref = createRef<HTMLInputElement>()
      renderComponent({ ref } as any)
      
      expect(ref.current).toBeInstanceOf(HTMLInputElement)
      expect(ref.current).toBe(screen.getByRole('textbox'))
    })
  })

  describe('accessibility', () => {
    it('generates unique id for hint connection', () => {
      const { container: container1 } = renderComponent({ hint: 'First hint' })
      const { container: container2 } = renderComponent({ hint: 'Second hint' })
      
      const firstHint = container1.querySelector('p[id]') as HTMLElement
      const firstInput = container1.querySelector('input') as HTMLInputElement
      const firstHintId = firstHint.getAttribute('id')
      
      const secondHint = container2.querySelector('p[id]') as HTMLElement
      const secondInput = container2.querySelector('input') as HTMLInputElement
      const secondHintId = secondHint.getAttribute('id')
      
      expect(firstHintId).not.toBe(secondHintId)
      expect(firstInput.getAttribute('aria-describedby')).toBe(firstHintId)
      expect(secondInput.getAttribute('aria-describedby')).toBe(secondHintId)
    })
  
    it('connects hint to input with proper aria-describedby', () => {
      renderComponent({ hint: 'This field is required' })
      const input = screen.getByRole('textbox')
      const hint = screen.getByText('This field is required')
      
      expect(input).toHaveAttribute('aria-describedby')
      expect(hint).toHaveAttribute('id')
      expect(input.getAttribute('aria-describedby')).toBe(hint.getAttribute('id'))
    })
  })

  describe('props', () => {
    it('renders form input with all props', () => {
      renderComponent({
        label: 'Email Address',
        description: 'We\'ll never share your email',
        hint: 'Please enter a valid email',
        type: 'email',
        placeholder: 'user@example.com',
        required: true,
        invalid: false,
        className: 'custom-input',
        labelClassName: 'custom-label',
        descriptionClassName: 'custom-desc',
        fieldClassName: 'custom-field'
      })

      expect(screen.getByText('Email Address')).toBeInTheDocument()
      expect(screen.getByText('We\'ll never share your email')).toBeInTheDocument()
      expect(screen.getByText('Please enter a valid email')).toBeInTheDocument()
      expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email')
      expect(screen.getByRole('textbox')).toHaveAttribute('placeholder', 'user@example.com')
      expect(screen.getByRole('textbox')).toHaveAttribute('required')
    })
  })

  describe('display name', () => {
    it('has correct displayName', () => {
      expect(FormInput.displayName).toBe('FormInput')
    })
  })
})

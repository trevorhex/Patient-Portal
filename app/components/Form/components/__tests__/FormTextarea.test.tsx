import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { createRef } from 'react'
import { FormTextarea, FormTextareaProps } from '../FormTextarea'
import * as styles from '../../styles'

const baseStyles = styles.baseStyles.replace('h-10', '').trim().split(/\s+/)
const labelStyles = styles.labelStyles.trim().split(/\s+/)
const inputErrorClass = styles.inputErrorClass
const errorClass = styles.errorClass

vi.mock('@headlessui/react', async (importActual) => {
  const actual = await importActual<typeof import('@headlessui/react')>()
  return {
    ...actual,
    Textarea: ({ ...props }: any) => <textarea {...props} />
  }
})

describe('FormTextarea', () => {
  const renderComponent = (props: Partial<FormTextareaProps> = {}) => render(<FormTextarea {...props} />)

  describe('basic rendering', () => {
    it('renders a textarea element', () => {
      renderComponent()
      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })

    it('applies base styles to textarea', () => {
      renderComponent()
      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveClass(...baseStyles, 'h-auto', 'min-h-20')
    })
  })

  describe('label', () => {
    it('renders label when provided', () => {
      renderComponent({ label: 'Description' })
      expect(screen.getByText('Description')).toBeInTheDocument()
    })

    it('does not render label when not provided', () => {
      renderComponent()
      expect(screen.queryByRole('textbox')).toBeInTheDocument()
      expect(screen.queryByText('Description')).not.toBeInTheDocument()
    })

    it('applies label styles', () => {
      renderComponent({ label: 'Description' })
      const label = screen.getByText('Description')
      expect(label).toHaveClass(...labelStyles)
    })

    it('applies custom label className', () => {
      renderComponent({ label: 'Description', labelClassName: 'custom-label' })
      const label = screen.getByText('Description')
      expect(label).toHaveClass(...labelStyles, 'custom-label')
    })
  })

  describe('description', () => {
    it('renders description when provided', () => {
      renderComponent({ description: 'Enter your description here' })
      expect(screen.getByText('Enter your description here')).toBeInTheDocument()
    })

    it('does not render description when not provided', () => {
      renderComponent()
      expect(screen.queryByText('Enter your description here')).not.toBeInTheDocument()
    })

    it('applies custom description className', () => {
      renderComponent({ description: 'Enter your description here', descriptionClassName: 'custom-desc' })
      const description = screen.getByText('Enter your description here')
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

    it('connects hint to textarea via aria-describedby', () => {
      renderComponent({ hint: 'This field is required' })
      const textarea = screen.getByRole('textbox')
      const hint = screen.getByText('This field is required')
      
      expect(textarea).toHaveAttribute('aria-describedby')
      expect(hint).toHaveAttribute('id')
      expect(textarea.getAttribute('aria-describedby')).toBe(hint.getAttribute('id'))
    })

    it('does not set aria-describedby when no hint', () => {
      renderComponent()
      const textarea = screen.getByRole('textbox')
      expect(textarea).not.toHaveAttribute('aria-describedby')
    })
  })

  describe('invalid state', () => {
    it('applies error class when invalid is true', () => {
      renderComponent({ invalid: true })
      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveClass(inputErrorClass)
    })

    it('does not apply error class when invalid is false', () => {
      renderComponent({ invalid: false })
      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveClass(...baseStyles, 'h-auto', 'min-h-20')
      expect(textarea).not.toHaveClass(inputErrorClass)
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
      const textarea = screen.getByRole('textbox')
      expect(textarea).toBeDisabled()
    })

    it('enables the field when disabled prop is false', () => {
      renderComponent({ disabled: false })
      const textarea = screen.getByRole('textbox')
      expect(textarea).toBeEnabled()
    })
  })

  describe('custom classes', () => {
    it('applies custom className to textarea', () => {
      renderComponent({ className: 'custom-textarea' })
      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveClass(...baseStyles, 'h-auto', 'min-h-20', 'custom-textarea')
    })

    it('applies custom fieldClassName to field wrapper', () => {
      renderComponent({ fieldClassName: 'custom-field' })
      const field = screen.getByRole('textbox').closest('div')
      expect(field).toHaveClass('flex', 'flex-col', 'gap-1', 'custom-field')
    })
  })

  describe('HTML attributes', () => {
    it('passes through HTML textarea attributes', () => {
      renderComponent({ placeholder: 'Enter text', maxLength: 500, required: true, rows: 5 })
      const textarea = screen.getByRole('textbox')
      
      expect(textarea).toHaveAttribute('placeholder', 'Enter text')
      expect(textarea).toHaveAttribute('maxLength', '500')
      expect(textarea).toHaveAttribute('required')
      expect(textarea).toHaveAttribute('rows', '5')
    })

    it('passes through value and onChange', () => {
      const handleChange = vi.fn()
      renderComponent({ value: 'test value', onChange: handleChange })
      const textarea = screen.getByRole('textbox')
      
      expect(textarea).toHaveValue('test value')

      fireEvent.change(textarea, { target: { value: 'test' } })
      expect(handleChange).toHaveBeenCalled()
    })

    it('passes through name attribute', () => {
      renderComponent({ name: 'description' })
      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveAttribute('name', 'description')
    })
  })

  describe('ref forwarding', () => {
    it('forwards ref to textarea element', () => {
      const ref = createRef<HTMLTextAreaElement>()
      renderComponent({ ref } as any)
      
      expect(ref.current).toBeInstanceOf(HTMLTextAreaElement)
      expect(ref.current).toBe(screen.getByRole('textbox'))
    })
  })

  describe('accessibility', () => {
    it('generates unique id for hint connection', () => {
      const { container: container1 } = renderComponent({ hint: 'First hint' })
      const { container: container2 } = renderComponent({ hint: 'Second hint' })
      
      const firstHint = container1.querySelector('p[id]') as HTMLElement
      const firstTextarea = container1.querySelector('textarea') as HTMLTextAreaElement
      const firstHintId = firstHint.getAttribute('id')
      
      const secondHint = container2.querySelector('p[id]') as HTMLElement
      const secondTextarea = container2.querySelector('textarea') as HTMLTextAreaElement
      const secondHintId = secondHint.getAttribute('id')
      
      expect(firstHintId).not.toBe(secondHintId)
      expect(firstTextarea.getAttribute('aria-describedby')).toBe(firstHintId)
      expect(secondTextarea.getAttribute('aria-describedby')).toBe(secondHintId)
    })
  
    it('connects hint to textarea with proper aria-describedby', () => {
      renderComponent({ hint: 'This field is required' })
      const textarea = screen.getByRole('textbox')
      const hint = screen.getByText('This field is required')
      
      expect(textarea).toHaveAttribute('aria-describedby')
      expect(hint).toHaveAttribute('id')
      expect(textarea.getAttribute('aria-describedby')).toBe(hint.getAttribute('id'))
    })
  })

  describe('textarea-specific styling', () => {
    it('applies textarea-specific height classes', () => {
      renderComponent()
      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveClass('h-auto', 'min-h-20')
    })

    it('maintains textarea height classes with custom className', () => {
      renderComponent({ className: 'custom-class' })
      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveClass(...baseStyles, 'h-auto', 'min-h-20', 'custom-class')
    })
  })

  describe('props', () => {
    it('renders form textarea with all props', () => {
      renderComponent({
        label: 'Comments',
        description: 'Please provide detailed feedback',
        hint: 'Maximum 500 characters',
        placeholder: 'Enter your comments here...',
        required: true,
        invalid: false,
        rows: 6,
        className: 'custom-textarea',
        labelClassName: 'custom-label',
        descriptionClassName: 'custom-desc',
        fieldClassName: 'custom-field'
      })

      expect(screen.getByText('Comments')).toBeInTheDocument()
      expect(screen.getByText('Please provide detailed feedback')).toBeInTheDocument()
      expect(screen.getByText('Maximum 500 characters')).toBeInTheDocument()
      expect(screen.getByRole('textbox')).toHaveAttribute('placeholder', 'Enter your comments here...')
      expect(screen.getByRole('textbox')).toHaveAttribute('required')
      expect(screen.getByRole('textbox')).toHaveAttribute('rows', '6')
    })
  })

  describe('display name', () => {
    it('has correct displayName', () => {
      expect(FormTextarea.displayName).toBe('FormTextarea')
    })
  })
})

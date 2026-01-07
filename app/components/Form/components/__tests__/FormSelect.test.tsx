import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { FormSelect, FormSelectProps } from '../FormSelect'
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
    Field: (props: any) => <div {...props} />,
    Label: (props: any) => <label {...props} />,
    Description: (props: any) => <div {...props} />,
    Listbox: ({ children, value, onChange, ...props }: any) => (
      <select {...props} value={value} onChange={(e) => onChange(e.target.value)}>
        {typeof children === 'function' ? children({ open: false }) : children}
      </select>
    ),
    ListboxButton: (props: any) => <button {...props} />,
    ListboxOptions: (props: any) => <div {...props} />,
    ListboxOption: ({ children, value, ...props }: any) => (
      <option {...props} value={value}>
        {typeof children === 'function' ? children({ focus: false, selected: false }) : children}
      </option>
    ),
  }
})

vi.mock('lucide-react', () => ({
  CheckIcon: ({ ...props }: any) => <span data-testid="check-icon" {...props} />,
  ChevronDownIcon: ({ ...props }: any) => <span data-testid="chevron-down-icon" {...props} />
}))

const defaultOptions = [
  { label: 'Option 1', value: '1' },
  { label: 'Option 2', value: '2' },
  { label: 'Option 3', value: '3' }
]

describe('FormSelect', () => {
  const renderComponent = (props: Partial<FormSelectProps> = {}) => render(<FormSelect options={defaultOptions} {...props} />)

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('basic rendering', () => {
    it('renders a select element', () => {
      renderComponent()
      expect(screen.getByRole('combobox')).toBeInTheDocument()
    })

    it('renders with first option selected by default', () => {
      renderComponent()
      const select = screen.getByRole('combobox')
      expect(select.querySelector('button')).toHaveTextContent('Option 1')
    })

    it('applies base styles to select button', () => {
      renderComponent()
      const button = screen.getByRole('button')
      expect(button).toHaveClass(...baseStyles)
    })
  })

  describe('label', () => {
    it('renders label when provided', () => {
      renderComponent({ label: 'Select Option' })
      expect(screen.getByText('Select Option')).toBeInTheDocument()
    })

    it('does not render label when not provided', () => {
      renderComponent()
      expect(screen.queryByText('Select Option')).not.toBeInTheDocument()
    })

    it('applies label styles', () => {
      renderComponent({ label: 'Select Option' })
      const label = screen.getByText('Select Option')
      expect(label).toHaveClass(...labelStyles)
    })

    it('applies custom label className', () => {
      renderComponent({ label: 'Select Option', labelClassName: 'custom-label' })
      const label = screen.getByText('Select Option')
      expect(label).toHaveClass(...labelStyles, 'custom-label')
    })
  })

  describe('description', () => {
    it('renders description when provided', () => {
      renderComponent({ description: 'Choose an option' })
      expect(screen.getByText('Choose an option')).toBeInTheDocument()
    })

    it('does not render description when not provided', () => {
      renderComponent()
      expect(screen.queryByText('Choose an option')).not.toBeInTheDocument()
    })

    it('applies custom description className', () => {
      renderComponent({ description: 'Choose an option', descriptionClassName: 'custom-desc' })
      const description = screen.getByText('Choose an option')
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

    it('connects hint to select via aria-describedby', () => {
      renderComponent({ hint: 'This field is required' })
      const button = screen.getByRole('button')
      const hint = screen.getByText('This field is required')
      
      expect(button).toHaveAttribute('aria-describedby')
      expect(hint).toHaveAttribute('id')
      expect(button.getAttribute('aria-describedby')).toBe(hint.getAttribute('id'))
    })

    it('does not set aria-describedby when no hint', () => {
      renderComponent()
      const button = screen.getByRole('button')
      expect(button).not.toHaveAttribute('aria-describedby')
    })
  })

  describe('options', () => {
    it('renders all provided options', () => {
      renderComponent()
      const select = screen.getByRole('combobox')
      expect(select.querySelectorAll('option')).toHaveLength(3)
      expect(screen.getAllByText('Option 1')).toHaveLength(2)
      expect(screen.getByText('Option 2')).toBeInTheDocument()
      expect(screen.getByText('Option 3')).toBeInTheDocument()
    })

    it('displays selected option label in button', () => {
      renderComponent({ defaultValue: '2' })
      const button = screen.getByRole('button')
      expect(button).toHaveTextContent('Option 2')
    })

    it('renders empty button text when no options provided', () => {
      renderComponent({ options: [] })
      const button = screen.getByRole('button')
      expect(button).toHaveTextContent('')
    })

    it('handles numeric option values', () => {
      const options = [
        { label: 'First', value: 1 },
        { label: 'Second', value: 2 },
      ]
      renderComponent({ options })
      const select = screen.getByRole('combobox')
      expect(select.querySelectorAll('option')).toHaveLength(2)
      expect(screen.getAllByText('First')).toHaveLength(2)
      expect(screen.getByText('Second')).toBeInTheDocument()
    })
  })

  describe('invalid state', () => {
    it('applies error class when invalid is true', () => {
      renderComponent({ invalid: true })
      const button = screen.getByRole('button')
      expect(button).toHaveClass(inputErrorClass)
    })

    it('does not apply error class when invalid is false', () => {
      renderComponent({ invalid: false })
      const button = screen.getByRole('button')
      expect(button).toHaveClass(...baseStyles)
      expect(button).not.toHaveClass(inputErrorClass)
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
      const field = screen.getByRole('combobox').closest('div')
      expect(field).toHaveAttribute('disabled')
    })

    it('enables the field when disabled prop is false', () => {
      renderComponent({ disabled: false })
      const field = screen.getByRole('combobox').closest('div')
      expect(field).not.toHaveAttribute('disabled')
    })
  })

  describe('custom classes', () => {
    it('applies custom className to select button', () => {
      renderComponent({ className: 'custom-select' })
      const button = screen.getByRole('button')
      expect(button).toHaveClass(...baseStyles, 'custom-select')
    })

    it('applies custom fieldClassName to field wrapper', () => {
      renderComponent({ fieldClassName: 'custom-field' })
      const field = screen.getByRole('combobox').closest('div')
      expect(field).toHaveClass('flex', 'flex-col', 'gap-1', 'custom-field')
    })
  })

  describe('default value', () => {
    it('uses provided defaultValue', () => {
      renderComponent({ defaultValue: '3' })
      expect(screen.getAllByText('Option 3')).toHaveLength(2)
    })

    it('uses first option value when no defaultValue provided', () => {
      renderComponent()
      expect(screen.getAllByText('Option 1')).toHaveLength(2)
    })
  })

  describe('icons', () => {
    it('renders chevron down icon', () => {
      renderComponent()
      expect(screen.getByTestId('chevron-down-icon')).toBeInTheDocument()
    })

    it('renders check icon for options', () => {
      renderComponent()
      expect(screen.getAllByTestId('check-icon')).toHaveLength(defaultOptions.length)
    })
  })

  describe('children rendering', () => {
    it('renders children when no options provided', () => {
      const children = <>
        <option value="child1">Child Option 1</option>
        <option value="child2">Child Option 2</option>
      </>
      const { container } = renderComponent({ children, options: undefined })

      expect(container.querySelector('option[value="child1"]')).toBeInTheDocument()
      expect(container.querySelector('option[value="child2"]')).toBeInTheDocument()
    })
  })

  describe('HTML attributes', () => {
    it('passes through HTML select attributes', () => {
      renderComponent({ name: 'test-select', required: true })
      const select = screen.getByRole('combobox')
      expect(select).toHaveAttribute('name', 'test-select')
      expect(select).toHaveAttribute('required')
    })
  })

  describe('ref forwarding', () => {
    it('forwards ref to select element', () => {
      const ref = vi.fn()
      renderComponent({ ref } as any)
      expect(ref).toHaveBeenCalled()
    })
  })

  describe('accessibility', () => {
    it('generates unique id for hint connection', () => {
      renderComponent({ hint: 'Test hint' })
      const hint = screen.getByText('Test hint')
      expect(hint).toHaveAttribute('id')
      expect(hint.getAttribute('id')).toMatch(/-hint$/)
    })

    it('connects hint to select with proper aria-describedby', () => {
      renderComponent({ hint: 'Test hint' })
      const button = screen.getByRole('button')
      const hint = screen.getByText('Test hint')
      expect(button.getAttribute('aria-describedby')).toBe(hint.getAttribute('id'))
    })

    it('sets aria-hidden on chevron icon', () => {
      renderComponent()
      const chevronIcon = screen.getByTestId('chevron-down-icon')
      expect(chevronIcon).toHaveAttribute('aria-hidden', 'true')
    })
  })

  describe('props', () => {
    it('renders form select with all props', () => {
      renderComponent({
        label: 'Test Label',
        description: 'Test Description',
        hint: 'Test Hint',
        invalid: true,
        disabled: false,
        className: 'custom-class',
        labelClassName: 'custom-label',
        descriptionClassName: 'custom-desc',
        fieldClassName: 'custom-field',
        defaultValue: '2',
        options: defaultOptions
      })
      
      expect(screen.getByText('Test Label')).toBeInTheDocument()
      expect(screen.getByText('Test Description')).toBeInTheDocument()
      expect(screen.getByText('Test Hint')).toBeInTheDocument()
      expect(screen.getAllByText('Option 2')).toHaveLength(2)
    })
  })

  describe('display name', () => {
    it('has correct displayName', () => {
      expect(FormSelect.displayName).toBe('FormSelect')
    })
  })
})

import { forwardRef, SelectHTMLAttributes, useId, useState, Fragment } from 'react'
import { Field, Label, Description, Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { CheckIcon, ChevronDownIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { baseStyles, labelStyles, errorClass, inputErrorClass } from '../styles'

export interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  description?: string
  labelClassName?: string
  descriptionClassName?: string
  fieldClassName?: string
  invalid?: boolean
  hint?: string
  options?: Array<{ label: string; value: string | number }>
}

export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  ({
    label,
    description,
    className,
    labelClassName,
    descriptionClassName,
    fieldClassName,
    hint,
    options,
    children,
    defaultValue,
    ...props
  }, ref) => {
    const id = useId()
    const hintId = `${id}-hint`
    const [value, setValue] = useState(defaultValue ?? options?.[0]?.value ?? '')

    return (
      <Field disabled={props.disabled} className={cn('flex flex-col gap-1', fieldClassName)}>
        {label && <Label className={cn(labelStyles, labelClassName)}>{label}</Label>}
        {description && <Description className={descriptionClassName}>{description}</Description>}
        <Listbox ref={ref} {...props} value={value} onChange={setValue} defaultValue={defaultValue}>
          {({ open }) => <div>
          <ListboxButton
              className={cn(
                baseStyles,
                'relative cursor-pointer',
                props.invalid && inputErrorClass,
                open && 'ring-2 ring-green-400 border-transparent',
                className
              )}
              aria-describedby={hint ? hintId : undefined}
            >
              {options?.find(o => o.value === value)?.label ?? ''}
              <ChevronDownIcon
                size={16}
                className={cn(
                  'pointer-events-none absolute top-2.5 right-2.5 text-zinc-400 transition-transform',
                  open && 'rotate-180'
                )}
                aria-hidden="true"
              />
            </ListboxButton>
            <ListboxOptions anchor="bottom" transition className={cn(
              'w-(--button-width) rounded-md border border-zinc-700 bg-zinc-900 p-1.5 [--anchor-gap:--spacing(1)] focus:outline-none',
              'transition duration-100 ease-in data-leave:data-closed:opacity-0'
            )}>
              {options
                ? options.map((option) => (
                    <ListboxOption key={option.value} value={option.value} as={Fragment}>
                      {({ focus, selected }) => (
                        <div className={cn(
                          'flex items-center gap-2 px-3 py-1.5 cursor-pointer',
                          focus && 'bg-purple-600'
                        )}>
                          <CheckIcon size={18} className={cn(!selected && 'invisible')} />
                          {option.label}
                        </div>
                      )}
                    </ListboxOption>
                  ))
                : children}
            </ListboxOptions>
          </div>}
        </Listbox>
        {hint && <p id={hintId} className={cn('text-xs', props.invalid && errorClass)}>{hint}</p>}
      </Field>
    )
  }
)

FormSelect.displayName = 'FormSelect'

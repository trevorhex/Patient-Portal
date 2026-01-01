import { forwardRef, InputHTMLAttributes, useId } from 'react'
import { Field, Input, Label, Description } from '@headlessui/react'
import { cn } from '@/lib/utils'
import { baseStyles, labelStyles, errorClass, inputErrorClass } from '../styles'

export interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  description?: string
  labelClassName?: string
  descriptionClassName?: string
  fieldClassName?: string
  invalid?: boolean
  hint?: string
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({
    label,
    description,
    className,
    labelClassName,
    descriptionClassName,
    fieldClassName,
    hint,
    type = 'text',
    ...props
  }, ref) => {
    const id = useId()
    const hintId = `${id}-hint`

    return (
      <Field disabled={props.disabled} className={cn('flex flex-col gap-1', fieldClassName)}>
      {label && <Label className={cn(labelStyles, labelClassName)}>{label}</Label>}
      {description && <Description className={descriptionClassName}>{description}</Description>}
      <Input
        ref={ref}
        type={type}
        className={cn(baseStyles, props.invalid && inputErrorClass, className)}
        aria-describedby={hint ? hintId : undefined}
        {...props}
      />
      {hint && <p id={hintId} className={cn('text-xs', props.invalid && errorClass)}>{hint}</p>}
    </Field>
    )
  }
)

FormInput.displayName = 'FormInput'

import { forwardRef, TextareaHTMLAttributes, useId } from 'react'
import { Field, Textarea, Label, Description } from '@headlessui/react'
import { cn } from '@/lib/utils'
import { baseStyles, labelStyles, errorClass, inputErrorClass } from '../styles'

export interface FormTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  description?: string
  labelClassName?: string
  descriptionClassName?: string
  fieldClassName?: string
  invalid?: boolean
  hint?: string
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({
    label,
    description,
    className,
    labelClassName,
    descriptionClassName,
    fieldClassName,
    hint,
    ...props
  }, ref) => {
    const id = useId()
    const hintId = `${id}-hint`

    return (
      <Field disabled={props.disabled} className={cn('flex flex-col gap-1', fieldClassName)}>
        {label && <Label className={cn(labelStyles, labelClassName)}>{label}</Label>}
        {description && <Description className={descriptionClassName}>{description}</Description>}
        <Textarea
          ref={ref}
          className={cn(baseStyles, 'h-auto min-h-20', props.invalid && inputErrorClass, className)}
          aria-describedby={hint ? hintId : undefined}
          {...props}
        />
        {hint && <p id={hintId} className={cn('text-xs', props.invalid && errorClass)}>{hint}</p>}
      </Field>
    )
  }
)

FormTextarea.displayName = 'FormTextarea'

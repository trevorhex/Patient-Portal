import { FormInput, FormSelect, FormTextarea } from '@/app/components/Form'
import { FormField as FormFieldType } from '@/app/components/Form/types'

export const FormField = ({ type, ...props }: FormFieldType) => {
  if (type === 'text' || type === 'email' || type === 'tel' || type === 'date') {
    return <FormInput id={props.name} {...props} />
  }

  if (type === 'select') {
    return <FormSelect id={props.name} {...props} />
  }

  if (type === 'textarea') {
    return <FormTextarea id={props.name} {...props} />
  }

  return null
}

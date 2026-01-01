import { FormInput, FormSelect, FormTextarea } from '@/app/components/Form'
import { FormField as FormFieldType } from '@/app/components/Form/types'

export const FormField = ({ type, ...props }: FormFieldType) => {
  if (type === 'text' || type === 'email' || type === 'tel' || type === 'date') {
    return <FormInput {...props} />
  }

  if (type === 'select') {
    return <FormSelect {...props} />
  }

  if (type === 'textarea') {
    return <FormTextarea {...props} />
  }

  return null
}

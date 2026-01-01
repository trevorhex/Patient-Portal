import { ActionResponse } from '@/actions/auth'

export type FormDataType = [
  state: ActionResponse,
  formAction: (payload: FormData) => void, 
  isPending: boolean
]

export type FormField = {
  name: string
  label: string
  placeholder?: string
  fieldClassName?: string
} & (
  | {
      type: 'text' | 'email' | 'tel' | 'date'
    }
  | {
      type: 'textarea'
      rows?: number
    }
  | {
      type: 'select' | 'radio' | 'checkbox'
      options: Array<{ label: string, value: string | number }>
    })

export type FormPage = {
  title: string
  description: string
  fields: FormField[]
}

export type TextInput = {
  name: string
  label: string
  type: 'text' | 'email' | 'tel' | 'date'
  placeholder?: string
}

export type SelectInput = {
  name: string
  label: string
  type: 'select' | 'radio' | 'checkbox'
  options: Array<{
    label: string
    value: string | number
  }>
}
export type FormPage = {
  title: string
  description: string
  fields: Array<TextInput | SelectInput>
}

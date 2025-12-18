import { FormGroup, FormLabel, FormInput, errorClass, inputErrorClass } from '@/app/components/Form'
import { FormDataType } from '@/app/components/Form/types'

export type FormFieldsProps = { formData: FormDataType }

export const FormFields = ({ formData: [state, formAction, isPending] }: FormFieldsProps) => <>
  <FormGroup>
    <FormLabel htmlFor="email">Email</FormLabel>
    <FormInput
      id="email"
      name="email"
      type="email"
      autoComplete="email"
      required
      disabled={isPending}
      aria-describedby="email-error"
      className={state?.errors?.email ? inputErrorClass : ''}
    />
    {state?.errors?.email &&
      <p id="email-error" className={errorClass}>{state.errors.email[0]}</p>}
  </FormGroup>

  <FormGroup>
    <FormLabel htmlFor="password">Password</FormLabel>
    <FormInput
      id="password"
      name="password"
      type="password"
      autoComplete="current-password"
      required
      disabled={isPending}
      aria-describedby="password-error"
      className={state?.errors?.password ? inputErrorClass : ''}
    />
    {state?.errors?.password &&
      <p id="password-error" className={errorClass}>{state.errors.password[0]}</p>}
  </FormGroup>
</>

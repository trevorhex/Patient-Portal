import { FormGroup, FormLabel, FormInput, errorClass, inputErrorClass } from '@/app/components/Form'
import { FormDataType } from '@/app/components/Form/types'

export type FormFieldsProps = { formData: FormDataType }

export const FormFields = ({ formData: [state, , isPending] }: FormFieldsProps) => <>
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
      autoComplete="new-password"
      required
      disabled={isPending}
      aria-describedby="password-error"
      className={state?.errors?.password ? inputErrorClass : ''}
    />
    {state?.errors?.password &&
      <p id="password-error" className={errorClass}>{state.errors.password[0]}</p>}
  </FormGroup>

  <FormGroup>
    <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
    <FormInput
      id="confirmPassword"
      name="confirmPassword"
      type="password"
      autoComplete="new-password"
      required
      disabled={isPending}
      aria-describedby="confirmPassword-error"
      className={state?.errors?.confirmPassword ? inputErrorClass : ''}
    />
    {state?.errors?.confirmPassword &&
      <p id="confirmPassword-error" className={errorClass}>{state.errors.confirmPassword[0]}</p>}
  </FormGroup>
</>

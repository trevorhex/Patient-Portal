import { FormInput } from '@/app/components/Form'
import { FormDataType } from '@/app/components/Form/types'

export interface FormFieldsProps {
  formData: FormDataType
  values: Record<string, string>
}

export const FormFields = ({ formData: [state, , isPending], values }: FormFieldsProps) => <>
  <FormInput
    type="email"
    name="email"
    autoComplete="email"
    label="Email"
    defaultValue={values.email ?? ''}
    disabled={isPending}
    invalid={!!state?.errors?.email}
    hint={state.errors?.email?.[0]}
    required
  />

  <FormInput
    type="password"
    name="password"
    autoComplete="new-password"
    label="Password"
    defaultValue={values.password ?? ''}
    disabled={isPending}
    invalid={!!state?.errors?.password}
    hint={state.errors?.password?.[0]}
    required
  />

  <FormInput
    type="password"
    name="confirmPassword"
    autoComplete="new-password"
    label="Confirm Password"
    defaultValue={values.confirmPassword ?? ''}
    disabled={isPending}
    invalid={!!state?.errors?.confirmPassword}
    hint={state.errors?.confirmPassword?.[0]}
    required
  />
</>

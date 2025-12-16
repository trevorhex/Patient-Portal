'use client'

import { useMemo, useActionState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

import { FormGroup, FormLabel, FormInput, errorClass, inputErrorClass } from '@/app/components/Form'
import { logIn, ActionResponse } from '@/actions/auth'
import { ROUTES } from '@/config/routes'
import { AuthPage } from '../components/AuthPage'

const initialState: ActionResponse = {
  success: false,
  message: '',
  errors: undefined
}

export default function LogInPage() {
  const router = useRouter()

  const formData = useActionState<ActionResponse, FormData>(
    async (prevState: ActionResponse, formData: FormData) => {
      try {
        const result = await logIn(formData)

        if (result.success) {
          toast.success('Signed in successfully')
          router.push(ROUTES.dashboard.href)
          router.refresh()
        }

        return result
      } catch (err) {
        return {
          success: false,
          message: (err as Error).message || 'An error occurred',
          errors: undefined
        }
      }
    },
    initialState
  )
  const [state, formAction, isPending] = formData

  const FormFields = useMemo(() => () => <>
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
  </>, [
    state?.errors?.email?.toString(),
    state?.errors?.password?.toString(),
    isPending
  ])

  return (
    <AuthPage
      title="Log in to your account"
      ctaText="Don't have an account? "
      ctaLink={ROUTES.auth.signup}
      formData={formData}
      FormFields={FormFields}
      submitButtonText="Log in"
    />
  )
}

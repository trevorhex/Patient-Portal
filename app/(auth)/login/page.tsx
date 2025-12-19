'use client'

import { useActionState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

import { logIn, ActionResponse } from '@/actions/auth'
import { ROUTES } from '@/config/routes'
import { AuthPage } from '../components/AuthPage'
import { FormFields } from './components/FormFields'

const initialState: ActionResponse = {
  success: false,
  message: '',
  errors: undefined
}

export default function LoginPage() {
  const router = useRouter()

  const formData = useActionState<ActionResponse, FormData>(
    async (prevState: ActionResponse, formData: FormData) => {
      try {
        const result = await logIn(formData)

        if (result.success) {
          toast.success('Signed in successfully')
          router.refresh()
          router.push(ROUTES.dashboard.href)
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

  const LogInFormFields = () => <FormFields formData={formData} />

  return (
    <AuthPage
      title="Log in to your account"
      ctaText="Don't have an account? "
      ctaLink={ROUTES.auth.signup}
      formData={formData}
      FormFields={LogInFormFields}
      submitButtonText="Log in"
    />
  )
}

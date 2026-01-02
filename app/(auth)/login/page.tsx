'use client'

import { useActionState, useState } from 'react'
import { useRouter } from 'next/navigation'

import { logIn, ActionResponse } from '@/actions/auth'
import { ROUTES } from '@/config/routes'
import { useToast } from '@/hooks/useToast'
import { AuthPage } from '../components/AuthPage'
import { FormFields } from './components/FormFields'

const initialState: ActionResponse = {
  success: false,
  message: '',
  errors: undefined
}

export default function LoginPage() {
  const router = useRouter()
  const [formValues, setFormValues] = useState<Record<string, string>>({})
  const { showSuccess } = useToast()


  const formData = useActionState<ActionResponse, FormData>(
    async (prevState: ActionResponse, formData: FormData) => {
      try {
        const values = {
          email: formData.get('email') as string,
          password: formData.get('password') as string
        }
        setFormValues(values)

        const result = await logIn(formData)

        if (result.success) {
          setFormValues({})
          showSuccess('Signed in successfully')
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

  const LogInFormFields = () => <FormFields formData={formData} values={formValues} />

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

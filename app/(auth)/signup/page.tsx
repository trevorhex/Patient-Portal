'use client'

import { useActionState, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

import { signUp, ActionResponse } from '@/actions/auth'
import { ROUTES } from '@/config/routes'
import { AuthPage } from '../components/AuthPage'
import { FormFields } from './components/FormFields'

const initialState: ActionResponse = {
  success: false,
  message: '',
  errors: undefined
}

export default function SignupPage() {
  const router = useRouter()
  const [formValues, setFormValues] = useState<Record<string, string>>({})

  const formData = useActionState<ActionResponse, FormData>(
    async (prevState: ActionResponse, formData: FormData) => {
      try {
        const values = {
          email: formData.get('email') as string,
          password: formData.get('password') as string,
          confirmPassword: formData.get('confirmPassword') as string
        }
        setFormValues(values)

        const result = await signUp(formData)

        if (result.success) {
          setFormValues({})
          toast.success('Account created successfully')
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

  const SignUpFormFields = () => <FormFields formData={formData} values={formValues} />

  return (
    <AuthPage
      title="Create a new account"
      ctaText="Already have an account? "
      ctaLink={ROUTES.auth.login}
      formData={formData}
      FormFields={SignUpFormFields}
      submitButtonText="Sign up"
    />
  )
}

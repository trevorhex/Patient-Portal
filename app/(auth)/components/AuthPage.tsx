import { ComponentType } from 'react'
import Link from 'next/link'

import { Button } from '@/app/components/Button'
import { Form, FormError } from '@/app/components/Form'
import { ActionResponse } from '@/actions/auth'

export interface AuthPageProps {
  title: string
  ctaText: string
  ctaLink: { href: string, name?: string }
  submitButtonText: string
  formData: [state: ActionResponse, dispatch: (payload: FormData) => void, isPending: boolean]
  FormFields: ComponentType
}

export const AuthPage = ({
  title,
  ctaText,
  ctaLink,
  submitButtonText,
  formData,
  FormFields = () => null
}: AuthPageProps) => {
  const [state, formAction, isPending] = formData ?? [{ success: false, message: '' }, () => {}, false]
  return (
    <div className="min-h-screen flex flex-col gap-8 justify-center py-12 sm:px-6 lg:px-8 bg-[#121212]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-4xl font-extrabold text-gray-900 dark:text-white">
          <Link href="/">Patient Portal</Link>
        </h1>
        <h2 className="mt-4 text-center text-xl font-bold text-gray-900 dark:text-white">
          {title}
        </h2>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col gap-6 px-6">
        <Form action={formAction}>
          {state?.message && !state.success && (
            <FormError>{state.message}</FormError>
          )}
          <FormFields />
          <Button type="submit" isLoading={isPending} fullWidth className="mt-1">{submitButtonText}</Button>
        </Form>

        <div
          className={`
            dark:bg-zinc-900 py-4 px-4 shadow sm:rounded-lg sm:px-8
            border border-gray-600 dark:border-zinc-800 text-center  
          `}
        >
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {ctaText}
            <Link
              href={ctaLink.href}
              className="font-medium text-gray-900 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
            >
              {ctaLink.name}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

import { ComponentType } from 'react'
import Link from 'next/link'

import { Button } from '@/app/components/Button'
import { Form, FormError } from '@/app/components/Form'
import { Card } from '@/app/components/Card'
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
    <main className="min-h-screen flex flex-col gap-8 justify-center py-12 sm:px-6 lg:px-8">
      <header className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-4xl font-extrabold text-white">
          <Link href="/">Patient Portal</Link>
        </h1>
        <h2 className="text-center text-xl font-bold text-white mt-4">
          {title}
        </h2>
      </header>

      <section className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col gap-6 px-6" aria-label="Authentication Form">
        <Form action={formAction}>
          {state?.message && !state.success && (
            <FormError>{state.message}</FormError>
          )}
          <FormFields />
          <Button type="submit" isLoading={isPending} fullWidth className="mt-1">{submitButtonText}</Button>
        </Form>

        <Card className="p-4 sm:px-8 border-zinc-800">
          <p className="text-sm text-gray-400 flex justify-center gap-2">
            {ctaText}
            <Link href={ctaLink.href} className="font-medium text-gray-300 hover:text-gray-100 transition-colors">
              {ctaLink.name}
            </Link>
          </p>
        </Card>
      </section>
    </main>
  )
}

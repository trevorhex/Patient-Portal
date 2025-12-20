import { Suspense } from 'react'
import Link from 'next/link'
import { Button } from '@/app/components/Button'
import { ROUTES } from '@/config/routes'
import { getAuthenticatedUser } from '@/dal/user'

export const AuthButtonsComponent = async () => {
  const user = await getAuthenticatedUser()

  if (user) {
    return (
      <Link href={ROUTES.dashboard.href}>
        <Button>{ROUTES.dashboard.name}</Button>
      </Link>
    )
  }

  return <>
    <Link href={ROUTES.auth.login.href}>
      <Button variant="outline">{ROUTES.auth.login.name}</Button>
    </Link>
    <Link href={ROUTES.auth.signup.href}>
      <Button>{ROUTES.auth.signup.name}</Button>
    </Link>
  </>
}

export const AuthButtons = () => <Suspense fallback={<div className="h-16" />}>
  <AuthButtonsComponent />
</Suspense>

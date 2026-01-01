import { Suspense } from 'react'
import { Button } from '@/app/components/Button'
import { ROUTES } from '@/config/routes'
import { getAuthenticatedUser } from '@/dal/user'

export const AuthButtonsComponent = async () => {
  const user = await getAuthenticatedUser()

  if (user) {
    return (
      <Button href={ROUTES.dashboard.href}>
        {ROUTES.dashboard.name}
      </Button>
    )
  }

  return <>
    <Button variant="outline" href={ROUTES.auth.login.href}>
      {ROUTES.auth.login.name}
    </Button>
    <Button href={ROUTES.auth.signup.href}>
      {ROUTES.auth.signup.name}
    </Button>
  </>
}

export const AuthButtons = () => <Suspense fallback={<div className="h-16" />}>
  <AuthButtonsComponent />
</Suspense>

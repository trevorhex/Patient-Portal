import { Suspense } from 'react'
import { getAccountSettings } from '@/dal/account'
import { Card } from '@/app/components/Card'

const AccountSettingsComponent = async () => {
  const accountSettings = await getAccountSettings()
  console.log(accountSettings)

  return <p>Manage your account settings and preferences here.</p>
}

const AccountSettingsSkeleton = () => (
  <Card>
    <div className="animate-pulse space-y-4">
      <div className="h-6 bg-zinc-800 rounded w-1/3"></div>
      <div className="h-4 bg-zinc-800 rounded w-1/2"></div>
      <div className="h-4 bg-zinc-800 rounded w-2/3"></div>
      <div className="h-4 bg-zinc-800 rounded w-1/4"></div>
    </div>
  </Card>
)

export const AccountSettings = async () => <Suspense fallback={<AccountSettingsSkeleton />}>
  <AccountSettingsComponent />
</Suspense>

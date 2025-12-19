import { Suspense } from 'react'
import { getProfile } from '@/dal/profile'
import { Card } from '@/app/components/Card'

const ProfileComponent = async () => {
  const profile = await getProfile()

  return <div />
}

const ProfileSkeleton = () => (
  <Card>
    <div className="animate-pulse space-y-4">
      <div className="h-6 bg-zinc-700 rounded w-1/3"></div>
      <div className="h-4 bg-zinc-700 rounded w-1/2"></div>
      <div className="h-4 bg-zinc-700 rounded w-2/3"></div>
      <div className="h-4 bg-zinc-700 rounded w-1/4"></div>
    </div>
  </Card>
)

export const Profile = async () => <Suspense fallback={<ProfileSkeleton />}>
  <ProfileComponent />
</Suspense>

import { Suspense } from 'react'
import { getProfile } from '@/dal/profile'
import { Card } from '@/app/components/Card'
import { ProfileProvider } from '../../store'
import { ProfileContent } from './components/ProfileContent'
import { Wizard } from '../Wizard'

const ProfileComponent = async () => {
  const profile = await getProfile()
  if (!profile) return null 

  return (
    <ProfileProvider profile={profile}>
      <Wizard />
      <ProfileContent />
    </ProfileProvider>
  )
}

const ProfileSkeleton = () => <Card>
  <div className="animate-pulse space-y-4">

  </div>
</Card>

export const Profile = async () => <Suspense fallback={<ProfileSkeleton />}>
  <ProfileComponent />
</Suspense>

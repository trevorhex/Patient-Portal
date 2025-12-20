import { Suspense, use } from 'react'
import { getProfile } from '@/dal/profile'
import { Card } from '@/app/components/Card'
import { WizardProvider } from '../Wizard/store/provider'
import { ProfileProvider } from './store/provider'
import { ProfileContent } from './components/ProfileContent'
import { Wizard } from '../Wizard'

const ProfileComponent = async () => {
  const profile = await getProfile()
  if (!profile) return null 

  return <ProfileProvider profile={profile}>
    <WizardProvider>
      <Wizard />
      <ProfileContent />
    </WizardProvider>
  </ProfileProvider>
}

const ProfileSkeleton = () => <Card>
  <div className="animate-pulse space-y-4">

  </div>
</Card>

export const Profile = async () => <Suspense fallback={<ProfileSkeleton />}>
  <ProfileComponent />
</Suspense>

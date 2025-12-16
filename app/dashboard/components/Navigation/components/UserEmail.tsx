import { Suspense } from 'react'
import { getCurrentUser } from '@/lib/dal'
import { UserIcon } from 'lucide-react'
import { SignOutButton } from './SignOutButton'

const UserEmailComponent = async () => {
  const user = await getCurrentUser()

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-start px-2 py-2">
        <UserIcon size={20} className="text-gray-500 mr-2" />
        <span className="hidden md:inline text-sm text-gray-300 truncate">{user?.email}</span>
      </div>
      <SignOutButton />
    </div>
  )
}

const UserEmailSkeleton = () => (
  <div className="animate-pulse flex flex-col space-y-5 py-3">
    <div className="h-4 bg-gray-600 rounded" />
    <div className="h-4 bg-gray-600 rounded" />
  </div>
)

export const UserEmail = () => <Suspense fallback={<UserEmailSkeleton />}>
  <UserEmailComponent />
</Suspense>

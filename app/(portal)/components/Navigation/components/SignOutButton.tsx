'use client'

import { LogOutIcon } from 'lucide-react'
import { useTransition } from 'react'
import { Button } from '@headlessui/react'
import { logOut } from '@/actions/auth'

export const SignOutButton = () => {
  const [isPending, startTransition] = useTransition()

  const handleSignOut = () => {
    startTransition(async () => {
      await logOut()
    })
  }

  return (
    <Button
      onClick={handleSignOut}
      disabled={isPending}
      className={`
        flex items-center w-full p-2 text-sm text-gray-300
        hover:bg-zinc-800 rounded-md transition-colors cursor-pointer
      `}
    >
      <LogOutIcon size={20} className="mr-2" />
      <span>{isPending ? 'Signing out...' : 'Sign Out'}</span>
    </Button>
  )
}

'use client'

import { use } from 'react'
import { ProfileContext } from '../store/provider'

export const ProfileContent = () => {
  const { profile, state } = use(ProfileContext)
  console.log('profile:', profile, 'state:', state)
  return (
    <div>
      Profile Content
    </div> 
  )
}

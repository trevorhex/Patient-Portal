'use client'

import { use } from 'react'
import { ProfileContext } from '../../../store'

export const ProfileContent = () => {
  const { profile } = use(ProfileContext)
  console.log('Profile:', profile)

  return (
    <div />
  )
}

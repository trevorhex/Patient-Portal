'use client'

import { use } from 'react'
import { ProfileContext } from '../store/provider'

export const ProfileContent = () => {
  const { profile, state } = use(ProfileContext)

  return (
    <div />
  )
}

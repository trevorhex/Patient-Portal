'use client'

import { createContext, useReducer, ReactNode } from 'react'
import { Profile } from '@/db/types'
import { ProfileState, ProfileAction, ProfileStatus } from './types'
import { reducer } from './reducer'

export const initialState = {
  status: ProfileStatus.NotStarted
}

export type ProfileContextType = {
  profile: Profile
  state: ProfileState
  dispatch: (action: ProfileAction) => void
}

export const ProfileContext = createContext<ProfileContextType>({
  profile: {} as Profile,
  state: initialState,
  dispatch: () => {}
})

export const ProfileProvider = ({ children, profile }: { children: ReactNode, profile: Profile }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <ProfileContext.Provider value={{ profile, state, dispatch }}>
      {children}
    </ProfileContext.Provider>
  )
}

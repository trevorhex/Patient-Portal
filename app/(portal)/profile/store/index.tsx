'use client'

import { createContext, useReducer, ReactNode } from 'react'
import { Profile } from '@/db/types'
import { wizardFormPages } from '../components/Wizard/config'
import { reducer } from './reducer'
import { WizardState, WizardAction, WizardStatus } from './types'

export const initialWizardState: WizardState = {
  status: WizardStatus.NotStarted,
  currentStep: 0,
  totalSteps: wizardFormPages.length
}

export type ProfileContextType = {
  profile: Profile
  wizard: {
    state: WizardState
    dispatch: (action: WizardAction) => void
  }
}

export const ProfileContext = createContext<ProfileContextType>({
  profile: {} as Profile,
  wizard: {
    state: initialWizardState,
    dispatch: () => {}
  }
})

export const ProfileProvider = ({ children, profile }: { children: ReactNode, profile: Profile }) => {
  const [state, dispatch] = useReducer(reducer, initialWizardState)

  return (
    <ProfileContext.Provider value={{ profile, wizard: { state, dispatch } }}>
      {children}
    </ProfileContext.Provider>
  )
}

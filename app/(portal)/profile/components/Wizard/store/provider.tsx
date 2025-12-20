'use client'

import { createContext, useReducer, ReactNode } from 'react'
import { WizardState, WizardAction, WizardStatus } from './types'
import { reducer } from './reducer'

export const initialState = {
  status: WizardStatus.NotStarted,
  currentStep: 0,
  totalSteps: 0
}

export type WizardContextType = {
  state: WizardState
  dispatch: (action: WizardAction) => void
}

export const WizardContext = createContext<WizardContextType>({
  state: initialState,
  dispatch: () => {}
})

export const WizardProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <WizardContext.Provider value={{ state, dispatch }}>
      {children}
    </WizardContext.Provider>
  )
}

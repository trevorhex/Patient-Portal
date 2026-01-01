'use client'

import { createContext, use, useState, ReactNode } from 'react'

type FocusState = {
  shouldFocus: boolean
  focusElement?: string
}

type FocusContextType = FocusState & {
  triggerFocus: (focusElement?: string) => void
  resetFocus: () => void
}


const FocusContext = createContext<FocusContextType | undefined>(undefined)

export const FocusProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<FocusState>({ shouldFocus: false, focusElement: undefined })

  const triggerFocus = (focusElement?: string) => setState({ shouldFocus: true, focusElement })
  const resetFocus = () => setState({ shouldFocus: false, focusElement: undefined })

  return (
    <FocusContext.Provider value={{ ...state, triggerFocus, resetFocus }}>
      {children}
    </FocusContext.Provider>
  )
}

export const useFocus = () => {
  const context = use(FocusContext)
  if (!context) {
    throw new Error('useFocus must be used within a FocusProvider')
  }
  return context
}

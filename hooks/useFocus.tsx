'use client'

import { createContext, use, useState, ReactNode, KeyboardEvent } from 'react'
import { useRouter } from 'next/navigation'

type FocusState = {
  shouldFocus: boolean
  focusElement?: string
}

type FocusContextType = FocusState & {
  triggerFocus: (focusElement?: string) => void
  resetFocus: () => void
  focusOnKeyDown: (e: KeyboardEvent, focusEl?: string, href?: string) => void
}


const FocusContext = createContext<FocusContextType | undefined>(undefined)

export const FocusProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter()
  const [state, setState] = useState<FocusState>({ shouldFocus: false, focusElement: undefined })

  const triggerFocus = (focusElement?: string) => setState({ shouldFocus: true, focusElement })
  const resetFocus = () => setState({ shouldFocus: false, focusElement: undefined })

    const focusOnKeyDown = (e: KeyboardEvent, focusEl?: string, href?: string, keys: string[] = ['Enter', ' ']) => {
      if (keys.includes(e.key)) {
        e.preventDefault()
        focusEl && triggerFocus(focusEl)
        href && router.push(href)
      }
    }

  const value = {
    ...state,
    triggerFocus,
    resetFocus,
    focusOnKeyDown
  }

  return (
    <FocusContext.Provider value={value}>
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

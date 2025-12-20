'use client'

import { use } from 'react'
import { WizardContext } from './store/provider'

export const Wizard = () => {
  const { state } = use(WizardContext)

  console.log('Wizard State:', state)
  return (
    <div>Wizard Component</div>
  )
}

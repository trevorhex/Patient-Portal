'use client'

import { use } from 'react'
import { Button } from '@/app/components/Button'
import { WizardActionType } from './store/types'
import { WizardContext } from './store/provider'
import { Progress } from './components/Progress'

export const Wizard = () => {
  const { dispatch } = use(WizardContext)
  return (
    <div>
      <Progress />
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => dispatch({ type: WizardActionType.PreviousStep })}>Previous Page</Button>
        <Button onClick={() => dispatch({ type: WizardActionType.NextStep })}>Next Page</Button>
      </div>
    </div>
  )
}

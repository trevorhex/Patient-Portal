'use client'

import { use } from 'react'
import { Button } from '@/app/components/Button'
import { WizardActionType, WizardStatus } from '../../store/types'
import { ProfileContext } from '../../store'
import { Progress } from './components/Progress'
import { GetStarted } from './components/GetStarted'
import { FormPage } from './components/FormPage'

export const Wizard = () => {
  const { state: { status, currentStep, totalSteps }, dispatch } = use(ProfileContext).wizard

  if (status === WizardStatus.NotStarted) return <GetStarted />
  if (status === WizardStatus.Complete) return null

  return (
    <div className="space-y-8">
      <Progress />
      <FormPage />
      <div className="flex justify-between">
        {currentStep < 1
          ? <Button variant="outline" onClick={() => dispatch({ type: WizardActionType.Cancel })}>Cancel</Button>
          : <Button variant="outline" onClick={() => dispatch({ type: WizardActionType.PreviousStep })}>Previous Page</Button>}

        {currentStep === totalSteps - 1
          ? <Button onClick={() => dispatch({ type: WizardActionType.Complete })}>Complete</Button>
          : <Button onClick={() => dispatch({ type: WizardActionType.NextStep })}>Next Page</Button>}
      </div>
    </div>
  )
}

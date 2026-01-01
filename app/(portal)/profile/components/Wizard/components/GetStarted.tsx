'use client'

import { use } from 'react'
import { Card } from '@/app/components/Card'
import { Button } from '@/app/components/Button'
import { ProfileContext } from '../../../store'
import { WizardActionType } from '../../../store/types'

export const GetStarted = () => {
  const { wizard } = use(ProfileContext)
  return (
    <Card className="space-y-4 text-center py-10">
      <h2 className="text-xl font-bold mb-4">Welcome to the Profile Setup Wizard</h2>
      <p className="">This wizard will guide you through setting up your profile.</p>
      <Button className="mt-6" onClick={() => wizard.dispatch({ type: WizardActionType.Start })}>Get Started</Button>
    </Card>
  )
}

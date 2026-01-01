export enum WizardStatus {
  NotStarted = 'not-started',
  InProgress = 'in-progress',
  Complete = 'complete'
}

export enum WizardActionType {
  Cancel = 'cancel',
  Start = 'start',
  NextStep = 'next-step',
  PreviousStep = 'previous-step',
  Complete = 'complete',
  Reset = 'reset' // for demo purposes
}

export type WizardState = {
  status: WizardStatus
  currentStep: number
  totalSteps: number
}

export type WizardAction = {
  type: WizardActionType
  step?: number
}

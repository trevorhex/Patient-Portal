import { WizardState, WizardAction } from './types'
import { WizardActionType } from './types'

export const reducer = (state: WizardState, action: WizardAction): WizardState => {
  switch (action.type) {
    case WizardActionType.NextStep:
      return {
        ...state,
        currentStep: Math.min(state.currentStep + 1, state.totalSteps - 1)
      }
    case WizardActionType.PreviousStep:
      return {
        ...state,
        currentStep: Math.max(state.currentStep - 1, 0)
      }
    default:
      return state
  }
}

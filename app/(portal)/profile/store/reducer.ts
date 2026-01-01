import { WizardState, WizardAction, WizardStatus, WizardActionType } from './types'

export const reducer = (state: WizardState, action: WizardAction): WizardState => {
  switch (action.type) {
    case WizardActionType.Cancel:
      if (state.status !== WizardStatus.InProgress) return state

      return {
        ...state,
        status: WizardStatus.NotStarted
      }
    case WizardActionType.Start:
      if (state.status !== WizardStatus.NotStarted) return state

      return {
        ...state,
        status: WizardStatus.InProgress,
        currentStep: action.step ?? 0
      }
    case WizardActionType.NextStep:
      if (state.status !== WizardStatus.InProgress) return state

      return {
        ...state,
        currentStep: Math.min(state.currentStep + 1, state.totalSteps - 1)
      }
    case WizardActionType.PreviousStep:
      if (state.status !== WizardStatus.InProgress) return state

      return {
        ...state,
        currentStep: Math.max(state.currentStep - 1, 0)
      }
    case WizardActionType.Complete:
      if (state.status !== WizardStatus.InProgress) return state

      return {
        ...state,
        status: WizardStatus.Complete
      }
    default:
      return state
  }
}

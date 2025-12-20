export enum ProfileStatus {
  NotStarted = 'not-started',
  InProgress = 'in-progress',
  Complete = 'complete'
}

export enum ProfileActionType {
  Start = 'start',
  Complete = 'complete',
  Reset = 'reset' // for demo purposes
}

export type ProfileState = {
  status: ProfileStatus
}

export type ProfileAction = {
  type: ProfileActionType
}

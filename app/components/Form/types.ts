import { ActionResponse } from '@/actions/auth'

export type FormDataType = [
  state: ActionResponse,
  formAction: (payload: FormData) => void, 
  isPending: boolean
]

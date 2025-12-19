import * as Schema from '@/db/types'
import { User } from './user'

export type Issue = Schema.Issue
export type IssueWithUser = Issue & { user: User }

export type Status = Schema.Issue['status']
export type Priority = Schema.Issue['priority']

import * as Schema from '@/db/schema'
import { User } from '@/types/User'

export type Issue = Schema.Issue

export type Status = Schema.Issue['status']
export type Priority = Schema.Issue['priority']

export type IssueWithUser = Issue & { user: User }

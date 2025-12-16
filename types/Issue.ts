import * as Schema from '@/db/schema'
import { User } from '@/types/User'

export type Issue = Schema.Issue

export type Status = 'backlog' | 'todo' | 'in_progress' | 'done'
export type Priority = 'low' | 'medium' | 'high'

export type IssueWithUser = Issue & {
  user: User
}

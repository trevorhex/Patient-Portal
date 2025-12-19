import { users, issues } from '@/db/schema'
import { InferSelectModel } from 'drizzle-orm'

export const issueStatus = ['backlog', 'todo', 'in_progress', 'done'] as const
export const issuePriority = ['low', 'medium', 'high'] as const

export const ISSUE_STATUS: IssueStatus = {
  backlog: { label: 'Backlog', value: issueStatus[0] },
  todo: { label: 'Todo', value: issueStatus[1] },
  in_progress: { label: 'In Progress', value: issueStatus[2] },
  done: { label: 'Done', value: issueStatus[3] }
}

export const ISSUE_PRIORITY: IssuePriority = {
  low: { label: 'Low', value: issuePriority[0] },
  medium: { label: 'Medium', value: issuePriority[1] },
  high: { label: 'High', value: issuePriority[2] }
}

export type IssueStatus = Record<typeof issueStatus[number], { label: string; value: typeof issueStatus[number] }>
export type IssuePriority = Record<typeof issuePriority[number], { label: string; value: typeof issuePriority[number] }>

export type Issue = InferSelectModel<typeof issues>
export type User = InferSelectModel<typeof users>

import { InferSelectModel, relations } from 'drizzle-orm'
import { pgTable, serial, text, timestamp, pgEnum } from 'drizzle-orm/pg-core'

export const status: [string, ...string[]] = ['backlog', 'todo', 'in_progress', 'done']
export const priority: [string, ...string[]] = ['low', 'medium', 'high']

const statusEnum = pgEnum('status', status)
const priorityEnum = pgEnum('priority', priority)

export const issues = pgTable('issues', {
  id: serial('id')
    .primaryKey(),
  title: text('title')
    .notNull(),
  description: text('description'),
  status: statusEnum('status')
    .default('backlog')
    .notNull(),
  priority: priorityEnum('priority')
    .default('medium')
    .notNull(),
  createdAt: timestamp('created_at')
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull(),
  userId: text('user_id')
    .notNull()
})

export const users = pgTable('users', {
  id: text('id')
    .primaryKey(),
  email: text('email')
    .notNull()
    .unique(),
  password: text('password')
    .notNull(),
  createdAt: timestamp('created_at')
    .defaultNow()
    .notNull()
})

export const issuesRelations = relations(issues, ({ one }) => ({
  user: one(users, { fields: [issues.userId], references: [users.id] })
}))

export const usersRelations = relations(users, ({ many }) => ({
  issues: many(issues)
}))

export const ISSUE_STATUS: IssueStatus = {
  backlog: { label: 'Backlog', value: status[0] },
  todo: { label: 'Todo', value: status[1] },
  in_progress: { label: 'In Progress', value: status[2] },
  done: { label: 'Done', value: status[3] }
}

export const ISSUE_PRIORITY: IssuePriority = {
  low: { label: 'Low', value: priority[0] },
  medium: { label: 'Medium', value: priority[1] },
  high: { label: 'High', value: priority[2] }
}

export type IssueStatus = Record<typeof status[number], { label: string; value: typeof status[number] }>
export type IssuePriority = Record<typeof priority[number], { label: string; value: typeof priority[number] }>

export const getOptions = (value: IssueStatus | IssuePriority) => Object.values(value).map(
  ({ label, value }: { label: string, value: string }) => ({ label, value })
)

export type Issue = InferSelectModel<typeof issues>
export type User = InferSelectModel<typeof users>

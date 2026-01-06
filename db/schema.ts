import { relations } from 'drizzle-orm'
import { pgTable, serial, text, boolean, timestamp, pgEnum } from 'drizzle-orm/pg-core'

import { IssueStatus, IssuePriority, issueStatus, issuePriority } from '@/db/types'

export * from '@/db/types'

export const issueStatusEnum = pgEnum('issue_status', issueStatus)
export const issuePriorityEnum = pgEnum('issue_priority', issuePriority)

export const issues = pgTable('issues', {
  id: serial('id')
    .primaryKey(),
  title: text('title')
    .notNull(),
  description: text('description'),
  status: issueStatusEnum('status')
    .default('backlog')
    .notNull(),
  priority: issuePriorityEnum('priority')
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

export const profiles = pgTable('profiles', {
  id: serial('id')
    .primaryKey(),
  userId: text('user_id')
    .notNull()
    .unique(),
  firstName: text('first_name')
    .notNull(),
  lastName: text('last_name')
    .notNull(),
  phoneNumber: text('phone_number'),
  address: text('address'),
  createdAt: timestamp('created_at')
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
})

export const accountSettings = pgTable('account_settings', {
  id: serial('id')
    .primaryKey(),
  userId: text('user_id')
    .notNull()
    .unique(),
  notificationsEnabled: boolean('notifications_enabled')
    .default(true)
    .notNull(),
  createdAt: timestamp('created_at')
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
})

export const issuesRelations = relations(issues, ({ one }) => ({
  user: one(users, { fields: [issues.userId], references: [users.id] })
}))

export const usersRelations = relations(users, ({ many, one }) => ({
  issues: many(issues),
  profile: one(profiles, { fields: [users.id], references: [profiles.userId] }),
  accountSettings: one(accountSettings, { fields: [users.id], references: [accountSettings.userId] })
}))

export const profileRelations = relations(profiles, ({ one }) => ({
  user: one(users, { fields: [profiles.userId], references: [users.id] })
}))


export const accountSettingsRelations = relations(accountSettings, ({ one }) => ({
  user: one(users, { fields: [accountSettings.userId], references: [users.id] })
}))

export const getOptions = (value: IssueStatus | IssuePriority) => Object.values(value).map(
  ({ label, value }: { label: string, value: string }) => ({ label, value })
)

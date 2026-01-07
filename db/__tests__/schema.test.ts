import { describe, it, expect } from 'vitest'
import { 
  issues, 
  users, 
  profiles, 
  accountSettings,
  issueStatusEnum,
  issuePriorityEnum,
  getOptions,
  IssueStatus,
  IssuePriority
} from '../schema'

describe('db schema', () => {
  describe('enums', () => {
    it('should define issue status enum correctly', () => {
      expect(issueStatusEnum.enumName).toBe('issue_status')
      expect(issueStatusEnum.enumValues).toEqual(['backlog', 'todo', 'in_progress', 'done'])
    })

    it('should define issue priority enum correctly', () => {
      expect(issuePriorityEnum.enumName).toBe('issue_priority')
      expect(issuePriorityEnum.enumValues).toEqual(['low', 'medium', 'high'])
    })
  })

  describe('db tables', () => {
    describe('issues table', () => {
      it('should have correct table name', () => {
        expect((issues as any)[Symbol.for('drizzle:Name')]).toBe('issues')
      })

      it('should have all required columns with correct types', () => {
        const columns = Object.keys(issues)
        expect(columns).toContain('id')
        expect(columns).toContain('title')
        expect(columns).toContain('description')
        expect(columns).toContain('status')
        expect(columns).toContain('priority')
        expect(columns).toContain('createdAt')
        expect(columns).toContain('updatedAt')
        expect(columns).toContain('userId')
      })

      it('should have correct column configurations', () => {
        expect(issues.id.primary).toBe(true)
        expect(issues.title.notNull).toBe(true)
        expect(issues.status.notNull).toBe(true)
        expect(issues.status.default).toBe('backlog')
        expect(issues.priority.notNull).toBe(true)
        expect(issues.priority.default).toBe('medium')
        expect(issues.createdAt.notNull).toBe(true)
        expect(issues.updatedAt.notNull).toBe(true)
        expect(issues.userId.notNull).toBe(true)
      })
    })

    describe('users table', () => {
      it('should have correct table name', () => {
        expect((users as any)[Symbol.for('drizzle:Name')]).toBe('users')
      })

      it('should have all required columns', () => {
        const columns = Object.keys(users)
        expect(columns).toContain('id')
        expect(columns).toContain('email')
        expect(columns).toContain('password')
        expect(columns).toContain('createdAt')
      })

      it('should have correct column configurations', () => {
        expect(users.id.primary).toBe(true)
        expect(users.email.notNull).toBe(true)
        expect(users.email.isUnique).toBe(true)
        expect(users.password.notNull).toBe(true)
        expect(users.createdAt.notNull).toBe(true)
      })
    })

    describe('profiles table', () => {
      it('should have correct table name', () => {
        expect((profiles as any)[Symbol.for('drizzle:Name')]).toBe('profiles')
      })

      it('should have all required columns', () => {
        const columns = Object.keys(profiles)
        expect(columns).toContain('id')
        expect(columns).toContain('userId')
        expect(columns).toContain('firstName')
        expect(columns).toContain('lastName')
        expect(columns).toContain('phoneNumber')
        expect(columns).toContain('address')
        expect(columns).toContain('createdAt')
        expect(columns).toContain('updatedAt')
      })

      it('should have correct column configurations', () => {
        expect(profiles.id.primary).toBe(true)
        expect(profiles.userId.notNull).toBe(true)
        expect(profiles.userId.isUnique).toBe(true)
        expect(profiles.firstName.notNull).toBe(true)
        expect(profiles.lastName.notNull).toBe(true)
        expect(profiles.createdAt.notNull).toBe(true)
        expect(profiles.updatedAt.notNull).toBe(true)
      })
    })

    describe('accountSettings table', () => {
      it('should have correct table name', () => {
        expect((accountSettings as any)[Symbol.for('drizzle:Name')]).toBe('account_settings')
      })

      it('should have all required columns', () => {
        const columns = Object.keys(accountSettings)
        expect(columns).toContain('id')
        expect(columns).toContain('userId')
        expect(columns).toContain('notificationsEnabled')
        expect(columns).toContain('createdAt')
        expect(columns).toContain('updatedAt')
      })

      it('should have correct column configurations', () => {
        expect(accountSettings.id.primary).toBe(true)
        expect(accountSettings.userId.notNull).toBe(true)
        expect(accountSettings.userId.isUnique).toBe(true)
        expect(accountSettings.notificationsEnabled.notNull).toBe(true)
        expect(accountSettings.notificationsEnabled.default).toBe(true)
        expect(accountSettings.createdAt.notNull).toBe(true)
        expect(accountSettings.updatedAt.notNull).toBe(true)
      })
    })
  })

  describe('getOptions function', () => {
    it('should convert IssueStatus enum to options array', () => {
      const mockIssueStatus: IssueStatus = {
        backlog: { label: 'Backlog', value: 'backlog' },
        todo: { label: 'To Do', value: 'todo' },
        in_progress: { label: 'In Progress', value: 'in_progress' },
        done: { label: 'Done', value: 'done' }
      }

      const result = getOptions(mockIssueStatus)

      expect(result).toHaveLength(4)
      expect(result).toEqual([
        { label: 'Backlog', value: 'backlog' },
        { label: 'To Do', value: 'todo' },
        { label: 'In Progress', value: 'in_progress' },
        { label: 'Done', value: 'done' }
      ])
    })

    it('should convert IssuePriority enum to options array', () => {
      const mockIssuePriority: IssuePriority = {
        low: { label: 'Low', value: 'low' },
        medium: { label: 'Medium', value: 'medium' },
        high: { label: 'High', value: 'high' }
      }

      const result = getOptions(mockIssuePriority)

      expect(result).toHaveLength(3)
      expect(result).toEqual([
        { label: 'Low', value: 'low' },
        { label: 'Medium', value: 'medium' },
        { label: 'High', value: 'high' }
      ])
    })

    it('should handle empty enum object', () => {
      const emptyEnum = {} as IssueStatus

      const result = getOptions(emptyEnum)

      expect(result).toEqual([])
    })

    it('should handle single item enum', () => {
      const singleItemEnum = {
        backlog: { label: 'Backlog', value: 'backlog' }
      } as IssueStatus

      const result = getOptions(singleItemEnum)

      expect(result).toEqual([{ label: 'Backlog', value: 'backlog' }])
    })

    it('should preserve label and value properties correctly', () => {
      const testEnum = {
        backlog: { label: 'Backlog', value: 'backlog' },
        todo: { label: 'Todo', value: 'todo' }
      } as IssueStatus

      const result = getOptions(testEnum)

      expect(result[0]).toHaveProperty('label', 'Backlog')
      expect(result[0]).toHaveProperty('value', 'backlog')
      expect(result[1]).toHaveProperty('label', 'Todo')
      expect(result[1]).toHaveProperty('value', 'todo')
    })
  })

  describe('default values', () => {
    it('should have correct default values for issue fields', () => {
      expect(issues.status.default).toBe('backlog')
      expect(issues.priority.default).toBe('medium')
    })

    it('should have correct default values for account settings', () => {
      expect(accountSettings.notificationsEnabled.default).toBe(true)
    })

    it('should have defaultNow for timestamp fields', () => {
      expect(issues.createdAt.hasDefault).toBe(true)
      expect(issues.updatedAt.hasDefault).toBe(true)
      expect(users.createdAt.hasDefault).toBe(true)
      expect(profiles.createdAt.hasDefault).toBe(true)
      expect(profiles.updatedAt.hasDefault).toBe(true)
      expect(accountSettings.createdAt.hasDefault).toBe(true)
      expect(accountSettings.updatedAt.hasDefault).toBe(true)
    })
  })
})

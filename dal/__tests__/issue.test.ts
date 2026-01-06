import { describe, it, expect, vi, beforeEach } from 'vitest'
import { cacheTag } from 'next/cache'
import { eq, and } from 'drizzle-orm'
import { 
  getUserIssueById, 
  getIssue, 
  getIssuesByUserId, 
  getIssues,
  ISSUES_BY_USER_ID_CACHE_TAG,
  USER_ISSUE_BY_ID_CACHE_TAG
} from '../issue'
import { db } from '@/db'
import { issueStatus, issuePriority } from '@/db/types'
import { getAuthenticatedUser } from '../user'

vi.spyOn(console, 'error').mockImplementation(() => {})
vi.mock('next/cache', () => ({ cacheTag: vi.fn() }))
vi.mock('@/db', () => ({ db: { query: { issues: { findFirst: vi.fn(), findMany: vi.fn() } } } }))
vi.mock('../user', () => ({ getAuthenticatedUser: vi.fn() }))
vi.mock('drizzle-orm', async () => {
  const actual = await vi.importActual('drizzle-orm')
  return { ...actual, eq: vi.fn(), and: vi.fn() }
})

const mockUser = { id: 'user123', email: 'test@example.com', password: '', createdAt: new Date() }
const mockIssue = {
  id: 1,
  userId: 'user123',
  title: 'Test Issue',
  description: 'Test description',
  status: issueStatus[0],
  priority: issuePriority[1],
  createdAt: new Date(),
  updatedAt: new Date(),
  user: mockUser
}
const mockIssues = [
  { ...mockIssue, id: 1 },
  { ...mockIssue, id: 2, title: 'Second Issue' }
]

describe('issue DAL helpers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getUserIssueById', () => {
    it('should return issue when found', async () => {
      vi.mocked(db.query.issues.findFirst).mockResolvedValue(mockIssue)

      const result = await getUserIssueById(mockIssue.userId, mockIssue.id)

      expect(result).toEqual(mockIssue)
      expect(cacheTag).toHaveBeenCalledWith(`${USER_ISSUE_BY_ID_CACHE_TAG}${mockIssue.userId}-${mockIssue.id}`)
      expect(db.query.issues.findFirst).toHaveBeenCalledWith({
        where: and(eq(expect.anything(), mockIssue.userId), eq(expect.anything(), mockIssue.id)),
        with: { user: true }
      })
    })

    it('should return undefined when issue not found', async () => {
      vi.mocked(db.query.issues.findFirst).mockResolvedValue(undefined)

      const result = await getUserIssueById(mockIssue.userId, 999)

      expect(result).toBeUndefined()
      expect(cacheTag).toHaveBeenCalledWith(`${USER_ISSUE_BY_ID_CACHE_TAG}${mockIssue.userId}-999`)
    })

    it('should apply correct cache tag with userId and id', async () => {
      vi.mocked(db.query.issues.findFirst).mockResolvedValue(mockIssue)

      await getUserIssueById('user456', 42)

      expect(cacheTag).toHaveBeenCalledWith(`${USER_ISSUE_BY_ID_CACHE_TAG}user456-42`)
    })

    it('should throw error when database query fails', async () => {
      const dbError = new Error('Database connection failed')
      vi.mocked(db.query.issues.findFirst).mockRejectedValue(dbError)

      await expect(getUserIssueById(mockIssue.userId, mockIssue.id)).rejects.toThrow('Failed to fetch issue')
      expect(console.error).toHaveBeenCalledWith('Error fetching issue:', dbError)
    })

    it('should call database with correct query parameters', async () => {
      vi.mocked(db.query.issues.findFirst).mockResolvedValue(mockIssue)
      const mockAnd = vi.fn()
      const mockEq1 = vi.fn()
      const mockEq2 = vi.fn()
      vi.mocked(and).mockReturnValue(mockAnd as any)
      vi.mocked(eq).mockReturnValueOnce(mockEq1 as any).mockReturnValueOnce(mockEq2 as any)

      await getUserIssueById('user123', 1)

      expect(db.query.issues.findFirst).toHaveBeenCalledWith({
        where: mockAnd,
        with: { user: true }
      })
    })
  })

  describe('getIssue', () => {
    it('should return issue when user is authenticated and issue exists', async () => {
      vi.mocked(getAuthenticatedUser).mockResolvedValue(mockUser)
      vi.mocked(db.query.issues.findFirst).mockResolvedValue(mockIssue)

      const result = await getIssue(mockIssue.id)

      expect(result).toEqual(mockIssue)
      expect(getAuthenticatedUser).toHaveBeenCalled()
    })

    it('should return undefined when user is not authenticated', async () => {
      vi.mocked(getAuthenticatedUser).mockResolvedValue(null)

      const result = await getIssue(mockIssue.id)

      expect(result).toBeUndefined()
      expect(db.query.issues.findFirst).not.toHaveBeenCalled()
    })

    it('should return undefined when user authentication fails', async () => {
      const authError = new Error('Authentication failed')
      vi.mocked(getAuthenticatedUser).mockRejectedValue(authError)

      const result = await getIssue(mockIssue.id)

      expect(result).toBeUndefined()
      expect(console.error).toHaveBeenCalledWith('Error fetching issue:', authError)
    })

    it('should handle getUserIssueById errors gracefully', async () => {
      vi.mocked(getAuthenticatedUser).mockResolvedValue(mockUser)
      vi.mocked(db.query.issues.findFirst).mockRejectedValue(new Error('DB Error'))

      const result = await getIssue(mockIssue.id)

      expect(result).toBeUndefined()
      expect(console.error).toHaveBeenCalledWith('Error fetching issue:', expect.any(Error))
    })
  })

  describe('getIssuesByUserId', () => {
    it('should return issues when found', async () => {
      vi.mocked(db.query.issues.findMany).mockResolvedValue(mockIssues)

      const result = await getIssuesByUserId(mockUser.id)

      expect(result).toEqual(mockIssues)
      expect(cacheTag).toHaveBeenCalledWith(`${ISSUES_BY_USER_ID_CACHE_TAG}${mockUser.id}`)
      expect(db.query.issues.findMany).toHaveBeenCalledWith({
        where: eq(expect.anything(), mockUser.id),
        with: { user: true },
        orderBy: expect.any(Function)
      })
    })

    it('should return empty array when no issues found', async () => {
      vi.mocked(db.query.issues.findMany).mockResolvedValue([])

      const result = await getIssuesByUserId(mockUser.id)

      expect(result).toEqual([])
      expect(cacheTag).toHaveBeenCalledWith(`${ISSUES_BY_USER_ID_CACHE_TAG}${mockUser.id}`)
    })

    it('should apply correct cache tag with userId', async () => {
      vi.mocked(db.query.issues.findMany).mockResolvedValue(mockIssues)

      await getIssuesByUserId('user789')

      expect(cacheTag).toHaveBeenCalledWith(`${ISSUES_BY_USER_ID_CACHE_TAG}user789`)
    })

    it('should throw error when database query fails', async () => {
      const dbError = new Error('Database connection failed')
      vi.mocked(db.query.issues.findMany).mockRejectedValue(dbError)

      await expect(getIssuesByUserId(mockUser.id)).rejects.toThrow('Failed to fetch issues')
      expect(console.error).toHaveBeenCalledWith('Error fetching issues:', dbError)
    })

    it('should include orderBy clause for createdAt desc', async () => {
      vi.mocked(db.query.issues.findMany).mockResolvedValue(mockIssues)

      await getIssuesByUserId('user123')

      const callArgs = vi.mocked(db.query.issues.findMany).mock.calls[0][0]
      expect(callArgs!.orderBy).toBeInstanceOf(Function)
    })
  })

  describe('getIssues', () => {
    it('should return issues when user is authenticated', async () => {
      vi.mocked(getAuthenticatedUser).mockResolvedValue(mockUser)
      vi.mocked(db.query.issues.findMany).mockResolvedValue(mockIssues)

      const result = await getIssues()

      expect(result).toEqual(mockIssues)
      expect(getAuthenticatedUser).toHaveBeenCalled()
    })

    it('should return empty array when user is not authenticated', async () => {
      vi.mocked(getAuthenticatedUser).mockResolvedValue(null)

      const result = await getIssues()

      expect(result).toEqual([])
      expect(db.query.issues.findMany).not.toHaveBeenCalled()
    })

    it('should return empty array when authentication fails', async () => {
      const authError = new Error('Authentication failed')
      vi.mocked(getAuthenticatedUser).mockRejectedValue(authError)

      const result = await getIssues()

      expect(result).toEqual([])
      expect(console.error).toHaveBeenCalledWith('Error fetching issues:', authError)
    })

    it('should return empty array when getIssuesByUserId fails', async () => {
      vi.mocked(getAuthenticatedUser).mockResolvedValue(mockUser)
      vi.mocked(db.query.issues.findMany).mockRejectedValue(new Error('DB Error'))

      const result = await getIssues()

      expect(result).toEqual([])
      expect(console.error).toHaveBeenCalledWith('Error fetching issues:', expect.any(Error))
    })

    it('should call getIssuesByUserId with correct user id', async () => {
      const customUser = { id: 'custom-user-id', email: 'custom@example.com', password: '', createdAt: new Date() }
      vi.mocked(getAuthenticatedUser).mockResolvedValue(customUser)
      vi.mocked(db.query.issues.findMany).mockResolvedValue(mockIssues)

      await getIssues()

      expect(cacheTag).toHaveBeenCalledWith(`${ISSUES_BY_USER_ID_CACHE_TAG}custom-user-id`)
    })
  })

  describe('cache constants', () => {
    it('should have correct cache tag constants', () => {
      expect(ISSUES_BY_USER_ID_CACHE_TAG).toBe('get-issues-by-user-id-')
      expect(USER_ISSUE_BY_ID_CACHE_TAG).toBe('get-user-issue-by-id-')
    })
  })
})

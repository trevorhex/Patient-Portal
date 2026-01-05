import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { revalidateTag, revalidatePath } from 'next/cache'
import { db } from '@/db'
import { issues } from '@/db/schema'
import { getAuthenticatedUser } from '@/dal/user'
import { ISSUES_BY_USER_ID_CACHE_TAG, USER_ISSUE_BY_ID_CACHE_TAG } from '@/dal/issue'
import { ROUTES } from '@/config/routes'
import { createMockInsert, createMockSelect, createMockSelectReject, createMockUpdate, createMockDelete } from '@/lib/test'
import { createIssue, updateIssue, deleteIssue, IssueData } from '../issues'

vi.mock('next/cache', () => ({ revalidateTag: vi.fn(), revalidatePath: vi.fn() }))
vi.mock('@/db', () => ({
  db: { insert: vi.fn(), select: vi.fn(), update: vi.fn(), delete: vi.fn() }
}))
vi.mock('@/dal/user', () => ({ getAuthenticatedUser: vi.fn() }))

const mockDb = vi.mocked(db)
const mockGetAuthenticatedUser = vi.mocked(getAuthenticatedUser)
const mockRevalidateTag = vi.mocked(revalidateTag)
const mockRevalidatePath = vi.mocked(revalidatePath)
const mockUpdate = vi.fn()
const mockValues = vi.fn()

const mockUser = { id: 'user-123', email: 'test@example.com', password: '', createdAt: new Date() }

const validIssueData: IssueData = {
  title: 'Test Issue',
  description: 'Test description',
  status: 'todo',
  priority: 'medium',
  userId: 'user-123'
}

describe('issues actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetAuthenticatedUser.mockResolvedValue(mockUser)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('createIssue', () => {
    it('should create an issue successfully with valid data', async () => {
      mockDb.insert.mockReturnValue(createMockInsert(mockValues) as any)
  
      const result = await createIssue(validIssueData)
  
      expect(result).toEqual({ success: true, message: 'Issue created successfully' })
      expect(mockDb.insert).toHaveBeenCalledWith(issues)
      expect(mockValues).toHaveBeenCalledWith({
        title: validIssueData.title,
        description: validIssueData.description,
        status: validIssueData.status,
        priority: validIssueData.priority,
        userId: validIssueData.userId
      })
      expect(mockRevalidateTag).toHaveBeenCalledWith(`${ISSUES_BY_USER_ID_CACHE_TAG}${mockUser.id}`, 'max')
    })

    it('should handle null description', async () => {
      mockDb.insert.mockReturnValue(createMockInsert(mockValues) as any)
  
      const result = await createIssue({ ...validIssueData, description: null })
  
      expect(result.success).toBe(true)
      expect(mockValues).toHaveBeenCalledWith(expect.objectContaining({ description: null }))
    })

    it('should return validation errors for invalid title (too short)', async () => {
      const result = await createIssue({ ...validIssueData, title: 'ab' })

      expect(result).toEqual({ success: false, message: 'Validation failed', errors: { title: ['Title must be at least 3 characters'] } })
      expect(mockDb.insert).not.toHaveBeenCalled()
    })

    it('should return validation errors for invalid title (too long)', async () => {
      const result = await createIssue({ ...validIssueData, title: 'a'.repeat(101) })

      expect(result).toEqual({ success: false, message: 'Validation failed', errors: { title: ['Title must be less than 100 characters'] } })
    })

    it('should return validation errors for invalid status', async () => {
      const result = await createIssue({ ...validIssueData, status: 'invalid-status' as any })

      expect(result).toEqual({ success: false, message: 'Validation failed', errors: { status: ['Please select a valid status'] } })
    })

    it('should return validation errors for invalid priority', async () => {
      const result = await createIssue({ ...validIssueData, priority: 'invalid-priority' as any })

      expect(result).toEqual({ success: false, message: 'Validation failed', errors: { priority: ['Please select a valid priority'] } })
    })

    it('should return validation errors for missing userId', async () => {
      const invalidData = { ...validIssueData, userId: '' }
      const result = await createIssue(invalidData)

      expect(result).toEqual({ success: false, message: 'Validation failed', errors: { userId: ['User ID is required'] } })
    })

    it('should handle database errors gracefully', async () => {
      const mockedValues = vi.fn().mockRejectedValue(new Error('Database error'))
      mockDb.insert.mockReturnValue(createMockInsert(mockedValues) as any)
      
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const result = await createIssue(validIssueData)

      expect(result).toEqual({ success: false, message: 'An error occurred while creating the issue', error: 'Failed to create issue' })
      expect(consoleSpy).toHaveBeenCalledWith('Error creating issue:', expect.any(Error))
      
      consoleSpy.mockRestore()
    })
  })

  describe('updateIssue', () => {
    const mockExistingIssue = [{ id: 1, userId: 'user-123', title: 'Existing Issue' }]

    beforeEach(() => {
      mockDb.select.mockReturnValue(createMockSelect(mockExistingIssue) as any)
    })

    it('should update an issue successfully', async () => {
      mockDb.update.mockReturnValue(createMockUpdate(mockUpdate) as any)

      const updateData = { title: 'Updated Title', status: 'todo' as const }
      const result = await updateIssue(1, updateData)

      expect(result).toEqual({ success: true, message: 'Issue updated successfully' })
      expect(mockRevalidateTag).toHaveBeenCalledWith(`${USER_ISSUE_BY_ID_CACHE_TAG}${mockUser.id}-1`, 'max')
      expect(mockRevalidateTag).toHaveBeenCalledWith(`${ISSUES_BY_USER_ID_CACHE_TAG}${mockUser.id}`, 'max')
      expect(mockRevalidatePath).toHaveBeenCalledWith(ROUTES.issues.base.href)
    })

    it('should return error when issue not found', async () => {
      mockDb.select.mockReturnValue(createMockSelect([]) as any)

      const result = await updateIssue(999, { title: 'New Title' })

      expect(result).toEqual({ success: false, message: 'Issue not found', error: 'Issue does not exist' })
      expect(mockDb.update).not.toHaveBeenCalled()
    })

    it('should return error when user tries to update another users issue', async () => {
      const otherUserIssue = [{ id: 1, userId: 'other-user', title: 'Other User Issue' }]
      mockDb.select.mockReturnValue(createMockSelect(otherUserIssue) as any)

      const result = await updateIssue(1, { title: 'Hacked Title' })

      expect(result).toEqual({ success: false, message: 'You can only update your own issues', error: 'Forbidden' })
      expect(mockDb.update).not.toHaveBeenCalled()
    })

    it('should return validation errors for invalid data', async () => {
      const result = await updateIssue(1, { title: 'ab' })

      expect(result).toEqual({ success: false, message: 'Validation failed', errors: { title: ['Title must be at least 3 characters'] } })
    })

    it('should handle empty update data gracefully', async () => {
      mockDb.update.mockReturnValue(createMockUpdate(mockUpdate) as any)

      const result = await updateIssue(1, {})

      expect(result).toEqual({ success: true, message: 'Issue updated successfully' })
      expect(mockDb.update).not.toHaveBeenCalled()
    })

    it('should handle database errors gracefully', async () => {
      mockDb.select.mockReturnValue(createMockSelectReject(new Error('Database error')) as any)
      
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const result = await updateIssue(1, { title: 'Test' })

      expect(result).toEqual({ success: false, message: 'An error occurred while updating the issue', error: 'Failed to update issue' })
      expect(consoleSpy).toHaveBeenCalledWith('Error updating issue:', expect.any(Error))
      consoleSpy.mockRestore()
    })
  })

  describe('deleteIssue', () => {
    const mockIssue = [{ id: 1, userId: 'user-123', title: 'Issue to Delete' }]

    beforeEach(() => {
      mockDb.select.mockReturnValue(createMockSelect(mockIssue) as any)
    })

    it('should delete an issue successfully', async () => {
      mockDb.delete.mockReturnValue(createMockDelete() as any)

      const result = await deleteIssue(1)

      expect(result).toEqual({ success: true, message: 'Issue deleted successfully' })
      expect(mockDb.delete).toHaveBeenCalledWith(issues)
      expect(mockRevalidateTag).toHaveBeenCalledWith(`${ISSUES_BY_USER_ID_CACHE_TAG}${mockUser.id}`, 'max')
    })

    it('should return error when issue not found', async () => {
      mockDb.select.mockReturnValue(createMockSelect([]) as any)

      const result = await deleteIssue(999)

      expect(result).toEqual({ success: false, message: 'Issue not found', error: 'Issue does not exist' })
      expect(mockDb.delete).not.toHaveBeenCalled()
    })

    it('should return error when user tries to delete another user\'s issue', async () => {
      const otherUserIssue = [{ id: 1, userId: 'other-user', title: 'Other User Issue' }]
      mockDb.select.mockReturnValue(createMockSelect(otherUserIssue) as any)

      const result = await deleteIssue(1)

      expect(result).toEqual({ success: false, message: 'You can only delete your own issues', error: 'Forbidden' })
      expect(mockDb.delete).not.toHaveBeenCalled()
    })

    it('should handle database errors gracefully', async () => {
      mockDb.select.mockReturnValue(createMockSelectReject(new Error('Database error')) as any)
      
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const result = await deleteIssue(1)

      expect(result).toEqual({ success: false, message: 'An error occurred while deleting the issue', error: 'Failed to delete issue' })
      expect(consoleSpy).toHaveBeenCalledWith('Error deleting issue:', expect.any(Error))
      consoleSpy.mockRestore()
    })
  })

  describe('authentication edge cases', () => {
    it('should handle null user in createIssue', async () => {
      mockGetAuthenticatedUser.mockResolvedValue(null)
      
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  
      const result = await createIssue(validIssueData)
  
      expect(result).toEqual({ success: false, message: 'An error occurred while creating the issue', error: 'Failed to create issue' })
      expect(consoleSpy).toHaveBeenCalledWith('Error creating issue:', expect.any(Error))
      expect(mockDb.insert).not.toHaveBeenCalled()
      expect(mockRevalidateTag).not.toHaveBeenCalled()
      
      consoleSpy.mockRestore()
    })
  
    it('should handle null user in updateIssue', async () => {
      mockGetAuthenticatedUser.mockResolvedValue(null)
      
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const result = await updateIssue(1, { title: 'Updated' })
  
      expect(result).toEqual({ success: false, message: 'An error occurred while updating the issue', error: 'Failed to update issue' })
      expect(consoleSpy).toHaveBeenCalledWith('Error updating issue:', expect.any(Error))
      expect(mockDb.select).not.toHaveBeenCalled()
      expect(mockDb.update).not.toHaveBeenCalled()
      expect(mockRevalidateTag).not.toHaveBeenCalled()
      
      consoleSpy.mockRestore()
    })
  
    it('should handle null user in deleteIssue', async () => {
      mockGetAuthenticatedUser.mockResolvedValue(null)
      
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const result = await deleteIssue(1)
  
      expect(result).toEqual({ success: false, message: 'An error occurred while deleting the issue', error: 'Failed to delete issue' })
      expect(consoleSpy).toHaveBeenCalledWith('Error deleting issue:', expect.any(Error))
      expect(mockDb.select).not.toHaveBeenCalled()
      expect(mockDb.delete).not.toHaveBeenCalled()
      expect(mockRevalidateTag).not.toHaveBeenCalled()
      
      consoleSpy.mockRestore()
    })
  
    it('should handle authentication error in createIssue', async () => {
      mockGetAuthenticatedUser.mockRejectedValue(new Error('Authentication failed'))
      
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const result = await createIssue(validIssueData)
  
      expect(result).toEqual({ success: false, message: 'An error occurred while creating the issue', error: 'Failed to create issue' })
      expect(consoleSpy).toHaveBeenCalledWith('Error creating issue:', expect.any(Error))
      
      consoleSpy.mockRestore()
    })
  })
})

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { cacheTag } from 'next/cache'
import { eq } from 'drizzle-orm'
import { getUserById, getAuthenticatedUser, getUserByEmail, USER_BY_ID_CACHE_TAG } from '../user'
import { db } from '@/db'
import { users } from '@/db/schema'
import { getSession } from '@/lib/session'

vi.spyOn(console, 'error').mockImplementation(() => {})
vi.mock('@/db', () => ({ db: { query: { users: { findFirst: vi.fn() } } } }))
vi.mock('@/lib/session', () => ({ getSession: vi.fn() }))
vi.mock('next/cache', () => ({ cacheTag: vi.fn() }))
vi.mock('drizzle-orm', async () => {
  const actual = await vi.importActual('drizzle-orm')
  return { ...actual, eq: vi.fn().mockReturnValue(vi.fn()) }
})

const mockUser = { id: '123', email: 'test@example.com', password: '', createdAt: new Date() }
const mockSession = { userId: mockUser.id }

describe('user DAL helpers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getUserById', () => {
    it('should return user when found', async () => {
      const mockQuery = vi.mocked(db.query.users.findFirst)
      mockQuery.mockResolvedValue(mockUser)

      const result = await getUserById(mockUser.id)

      expect(result).toEqual(mockUser)
      expect(mockQuery).toHaveBeenCalledWith({ where: expect.anything() })
      expect(eq).toHaveBeenCalledWith(users.id, mockUser.id)
      expect(cacheTag).toHaveBeenCalledWith(`${USER_BY_ID_CACHE_TAG}${mockUser.id}`)
    })

    it('should return null when user not found', async () => {
      const mockQuery = vi.mocked(db.query.users.findFirst)
      mockQuery.mockResolvedValue(undefined)

      const result = await getUserById('nonexistent')

      expect(result).toBeUndefined()
      expect(mockQuery).toHaveBeenCalledWith({ where: expect.anything() })
    })

    it('should return null and log error when database query fails', async () => {
      const mockError = new Error('Database connection failed')
      const mockQuery = vi.mocked(db.query.users.findFirst)
      mockQuery.mockRejectedValue(mockError)

      const result = await getUserById(mockUser.id)

      expect(result).toBeNull()
      expect(console.error).toHaveBeenCalledWith(mockError)
    })

    it('should handle empty userId', async () => {
      const mockQuery = vi.mocked(db.query.users.findFirst)
      mockQuery.mockResolvedValue(undefined)

      const result = await getUserById('')

      expect(result).toBeUndefined()
      expect(eq).toHaveBeenCalledWith(users.id, '')
    })

    it('should handle null userId', async () => {
      const mockQuery = vi.mocked(db.query.users.findFirst)
      mockQuery.mockResolvedValue(undefined)

      const result = await getUserById(null as any)

      expect(result).toBeUndefined()
      expect(eq).toHaveBeenCalledWith(users.id, null)
    })
  })

  describe('getAuthenticatedUser', () => {
    it('should return user when session exists and user is found', async () => {
      vi.mocked(getSession).mockResolvedValue(mockSession)
      vi.mocked(db.query.users.findFirst).mockResolvedValue(mockUser)

      const result = await getAuthenticatedUser()

      expect(result).toEqual(mockUser)
      expect(getSession).toHaveBeenCalled()
      expect(db.query.users.findFirst).toHaveBeenCalledWith({ where: expect.anything() })
    })

    it('should return null when no session exists', async () => {
      vi.mocked(getSession).mockResolvedValue(null)

      const result = await getAuthenticatedUser()

      expect(result).toBeNull()
      expect(getSession).toHaveBeenCalled()
      expect(db.query.users.findFirst).not.toHaveBeenCalled()
    })

    it('should return null when session exists but user not found', async () => {
      vi.mocked(getSession).mockResolvedValue(mockSession)
      vi.mocked(db.query.users.findFirst).mockResolvedValue(undefined)

      const result = await getAuthenticatedUser()

      expect(result).toBeUndefined()
      expect(getSession).toHaveBeenCalled()
      expect(db.query.users.findFirst).toHaveBeenCalledWith({ where: expect.anything() })
    })

    it('should return null and log error when getSession fails', async () => {
      const mockError = new Error('Session error')
      vi.mocked(getSession).mockRejectedValue(mockError)

      const result = await getAuthenticatedUser()

      expect(result).toBeNull()
      expect(console.error).toHaveBeenCalledWith(mockError)
      expect(db.query.users.findFirst).not.toHaveBeenCalled()
    })

    it('should return null and log error when getUserById fails', async () => {
      const mockSession = { userId: mockUser.id }
      const mockError = new Error('Database error')
      
      vi.mocked(getSession).mockResolvedValue(mockSession)
      vi.mocked(db.query.users.findFirst).mockRejectedValue(mockError)

      const result = await getAuthenticatedUser()

      expect(result).toBeNull()
      expect(console.error).toHaveBeenCalledWith(mockError)
    })

    it('should handle session with undefined userId', async () => {
      vi.mocked(getSession).mockResolvedValue(null)
      vi.mocked(db.query.users.findFirst).mockResolvedValue(undefined)

      const result = await getAuthenticatedUser()

      expect(result).toBeNull()
      expect(eq).not.toHaveBeenCalled()
    })
  })

  describe('getUserByEmail', () => {
    it('should return user when found by email', async () => {
      const mockQuery = vi.mocked(db.query.users.findFirst)
      mockQuery.mockResolvedValue(mockUser)

      const result = await getUserByEmail(mockUser.email)

      expect(result).toEqual(mockUser)
      expect(mockQuery).toHaveBeenCalledWith({ where: expect.anything() })
      expect(eq).toHaveBeenCalledWith(users.email, mockUser.email)
    })

    it('should return null when user not found by email', async () => {
      const mockQuery = vi.mocked(db.query.users.findFirst)
      mockQuery.mockResolvedValue(undefined)

      const result = await getUserByEmail('notfound@example.com')

      expect(result).toBeUndefined()
      expect(mockQuery).toHaveBeenCalledWith({ where: expect.anything() })
      expect(eq).toHaveBeenCalledWith(users.email, 'notfound@example.com')
    })

    it('should return null and log error when database query fails', async () => {
      const mockError = new Error('Database connection failed')
      const mockQuery = vi.mocked(db.query.users.findFirst)
      mockQuery.mockRejectedValue(mockError)

      const result = await getUserByEmail(mockUser.email)

      expect(result).toBeNull()
      expect(console.error).toHaveBeenCalledWith(mockError)
    })

    it('should handle empty email', async () => {
      const mockQuery = vi.mocked(db.query.users.findFirst)
      mockQuery.mockResolvedValue(undefined)

      const result = await getUserByEmail('')

      expect(result).toBeUndefined()
      expect(eq).toHaveBeenCalledWith(users.email, '')
    })

    it('should handle null email', async () => {
      const mockQuery = vi.mocked(db.query.users.findFirst)
      mockQuery.mockResolvedValue(undefined)

      const result = await getUserByEmail(null as any)

      expect(result).toBeUndefined()
      expect(eq).toHaveBeenCalledWith(users.email, null)
    })

    it('should handle malformed email', async () => {
      const mockQuery = vi.mocked(db.query.users.findFirst)
      mockQuery.mockResolvedValue(undefined)

      const result = await getUserByEmail('invalid-email')

      expect(result).toBeUndefined()
      expect(eq).toHaveBeenCalledWith(users.email, 'invalid-email')
    })
  })

  describe('cache constants', () => {
    it('should have correct cache tag constants', () => {
      expect(USER_BY_ID_CACHE_TAG).toBe('get-user-by-id-')
    })
  })
})

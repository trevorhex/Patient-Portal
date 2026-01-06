import { cacheTag } from 'next/cache'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getProfileByUserId, getProfile, PROFILE_BY_USER_ID_CACHE_TAG } from '../profile'
import { db } from '@/db'
import { getSession } from '@/lib/session'

vi.spyOn(console, 'error').mockImplementation(() => {})
vi.mock('next/cache', () => ({ cacheTag: vi.fn() }))
vi.mock('@/db', () => ({ db: { query: { profiles: { findFirst: vi.fn() } } } }))
vi.mock('@/lib/session', () => ({ getSession: vi.fn() }))
vi.mock('drizzle-orm', async () => {
  const actual = await vi.importActual('drizzle-orm')
  return { ...actual, eq: vi.fn().mockReturnValue(vi.fn()) }
})

const mockProfile = {
  id: 1,
  userId: 'user123',
  firstName: 'John',
  lastName: 'Doe',
  phoneNumber: '1234567890',
  address: '123 Main St',
  createdAt: new Date(),
  updatedAt: new Date()
}
const mockSession = { userId: mockProfile.userId }

describe('profile DAL helpers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getProfileByUserId', () => {
    it('should return profile when found', async () => {
      vi.mocked(db.query.profiles.findFirst).mockResolvedValue(mockProfile)

      const result = await getProfileByUserId(mockProfile.userId)

      expect(result).toEqual(mockProfile)
      expect(cacheTag).toHaveBeenCalledWith(`${PROFILE_BY_USER_ID_CACHE_TAG}${mockProfile.userId}`)
    })

    it('should return null when profile not found', async () => {
      vi.mocked(db.query.profiles.findFirst).mockResolvedValue(undefined)

      const result = await getProfileByUserId(mockProfile.userId)

      expect(result).toBeUndefined()
    })

    it('should return null and log error when database query fails', async () => {
      const error = new Error('Database error')
      vi.mocked(db.query.profiles.findFirst).mockRejectedValue(error)

      const result = await getProfileByUserId(mockProfile.userId)

      expect(result).toBeNull()
      expect(console.error).toHaveBeenCalledWith(error)
    })

    it('should call cacheTag with correct cache key', async () => {
      vi.mocked(db.query.profiles.findFirst).mockResolvedValue(undefined)

      await getProfileByUserId('user456')

      expect(cacheTag).toHaveBeenCalledWith(`${PROFILE_BY_USER_ID_CACHE_TAG}user456`)
    })
  })

  describe('getProfile', () => {
    it('should return profile when session exists', async () => {
      vi.mocked(getSession).mockResolvedValue(mockSession)
      vi.mocked(db.query.profiles.findFirst).mockResolvedValue(mockProfile)

      const result = await getProfile()

      expect(result).toEqual(mockProfile)
    })

    it('should return null when no session exists', async () => {
      vi.mocked(getSession).mockResolvedValue(null)

      const result = await getProfile()

      expect(result).toBeNull()
    })

    it('should return null when getSession throws error', async () => {
      const error = new Error('Session error')
      vi.mocked(getSession).mockRejectedValue(error)

      const result = await getProfile()

      expect(result).toBeNull()
      expect(console.error).toHaveBeenCalledWith(error)
    })

    it('should return null when getProfileByUserId fails', async () => {
      const error = new Error('DB error')
      vi.mocked(getSession).mockResolvedValue(mockSession)
      vi.mocked(db.query.profiles.findFirst).mockRejectedValue(error)

      const result = await getProfile()

      expect(result).toBeNull()
      expect(console.error).toHaveBeenCalledWith(error)
    })

    it('should call getProfileByUserId with correct userId from session', async () => {
      const mockSessionOther = { userId: 'user789' }
      vi.mocked(getSession).mockResolvedValue(mockSessionOther)
      vi.mocked(db.query.profiles.findFirst).mockResolvedValue(undefined)

      await getProfile()

      expect(cacheTag).toHaveBeenCalledWith(`${PROFILE_BY_USER_ID_CACHE_TAG}${mockSessionOther.userId}`)
    })
  })

  describe('cache constants', () => {
    it('should have correct cache tag constants', () => {
      expect(PROFILE_BY_USER_ID_CACHE_TAG).toBe('get-profile-by-user-id-')
    })
  })
})

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { cacheTag } from 'next/cache'
import { getAccountSettingsByUserId, getAccountSettings, ACCOUNT_SETTINGS_BY_USER_ID_CACHE_TAG } from '../account'
import { db } from '@/db'
import { getSession } from '@/lib/session'

vi.spyOn(console, 'error').mockImplementation(() => {})
vi.mock('@/db', () => ({ db: { query: { accountSettings: { findFirst: vi.fn() } } } }))
vi.mock('@/lib/session', () => ({ getSession: vi.fn() }))
vi.mock('next/cache', () => ({ cacheTag: vi.fn() }))

const mockAccountSettings = {
  id: 1,
  userId: 'user123',
  notificationsEnabled: true,
  createdAt: new Date(),
  updatedAt: new Date()
}
const mockSession = { userId: mockAccountSettings.userId } 

describe('account DAL functions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getAccountSettingsByUserId', () => {
    it('should return account settings when found', async () => {      
      vi.mocked(db.query.accountSettings.findFirst).mockResolvedValue(mockAccountSettings)

      const result = await getAccountSettingsByUserId(mockAccountSettings.userId)

      expect(result).toEqual(mockAccountSettings)
      expect(db.query.accountSettings.findFirst).toHaveBeenCalledWith({ where: expect.any(Object) })
      expect(cacheTag).toHaveBeenCalledWith(`${ACCOUNT_SETTINGS_BY_USER_ID_CACHE_TAG}${mockAccountSettings.userId}`)
    })

    it('should return empty object when no account settings found', async () => {
      vi.mocked(db.query.accountSettings.findFirst).mockResolvedValue(undefined)

      const result = await getAccountSettingsByUserId(mockAccountSettings.userId)

      expect(result).toEqual({})
    })

    it('should return null when database query throws error', async () => {
      const error = new Error('Database connection failed')
      vi.mocked(db.query.accountSettings.findFirst).mockRejectedValue(error)

      const result = await getAccountSettingsByUserId(mockAccountSettings.userId)

      expect(result).toBeNull()
      expect(console.error).toHaveBeenCalledWith(error)
    })

    it('should handle empty userId string', async () => {
      vi.mocked(db.query.accountSettings.findFirst).mockResolvedValue(mockAccountSettings)

      const result = await getAccountSettingsByUserId('')

      expect(result).toEqual(mockAccountSettings)
    })
  })

  describe('getAccountSettings', () => {
    it('should return account settings when session exists', async () => {
      vi.mocked(getSession).mockResolvedValue(mockSession)
      vi.mocked(db.query.accountSettings.findFirst).mockResolvedValue(mockAccountSettings)

      const result = await getAccountSettings()

      expect(result).toEqual(mockAccountSettings)
      expect(getSession).toHaveBeenCalled()
    })

    it('should return null when no session exists', async () => {
      vi.mocked(getSession).mockResolvedValue(null)

      const result = await getAccountSettings()

      expect(result).toBeNull()
      expect(db.query.accountSettings.findFirst).not.toHaveBeenCalled()
    })

    it('should return null when getSession throws error', async () => {
      const error = new Error('Session retrieval failed')
      vi.mocked(getSession).mockRejectedValue(error)

      const result = await getAccountSettings()

      expect(result).toBeNull()
      expect(console.error).toHaveBeenCalledWith(error)
    })

    it('should return null when getAccountSettingsByUserId fails', async () => {
      const error = new Error('Database query failed')
      
      vi.mocked(getSession).mockResolvedValue(mockSession)
      vi.mocked(db.query.accountSettings.findFirst).mockRejectedValue(error)

      const result = await getAccountSettings()

      expect(result).toBeNull()
      expect(console.error).toHaveBeenCalledWith(error)
    })

    it('should return empty object when account settings not found for user', async () => {
      vi.mocked(getSession).mockResolvedValue(mockSession)
      vi.mocked(db.query.accountSettings.findFirst).mockResolvedValue(undefined)

      const result = await getAccountSettings()

      expect(result).toEqual({})
    })
  })

  describe('cache constants', () => {
    it('should have correct cache tag constants', () => {
      expect(ACCOUNT_SETTINGS_BY_USER_ID_CACHE_TAG).toBe('get-account-by-user-id-')
    })
  })
})

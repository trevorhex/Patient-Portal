import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as bcrypt from 'bcrypt'
import { nanoid } from 'nanoid'
import { cookies } from 'next/headers'
import * as jose from 'jose'
import { db } from '@/db'
import {
  hashPassword,
  verifyPassword,
  createUser,
  generateJWT,
  verifyJWT,
  shouldRefreshToken,
  createSession,
  getSession,
  deleteSession,
  type JWTPayload
} from '../session'

vi.spyOn(console, 'error').mockImplementation(() => {})
vi.mock('bcrypt')
vi.mock('nanoid')
vi.mock('next/headers')
vi.mock('jose', () => ({ SignJWT: vi.fn(), jwtVerify: vi.fn() }))
vi.mock('react', () => ({ cache: (fn: any) => fn }))

const mockedBcrypt = vi.mocked(bcrypt)
const mockedNanoid = vi.mocked(nanoid)
const mockedCookies = vi.mocked(cookies)
const mockedDb = vi.mocked(db)
const uint8Array = new TextEncoder().encode('')

describe('session functions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubEnv('JWT_SECRET', 'test-secret')
    vi.stubEnv('NODE_ENV', 'test')
  })

  describe('hashPassword', () => {
    it('should hash password with bcrypt', async () => {
      const password = 'testpassword'
      const hashedPassword = 'hashed-password'
      
      mockedBcrypt.hash.mockResolvedValue(hashedPassword as never)
      
      const result = await hashPassword(password)
      
      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10)
      expect(result).toBe(hashedPassword)
    })
  })

  describe('verifyPassword', () => {
    it('should verify password correctly', async () => {
      const password = 'testpassword'
      const hashedPassword = 'hashed-password'
      
      mockedBcrypt.compare.mockResolvedValue(true as never)
      
      const result = await verifyPassword(password, hashedPassword)
      
      expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword)
      expect(result).toBe(true)
    })

    it('should return false for incorrect password', async () => {
      const password = 'wrongpassword'
      const hashedPassword = 'hashed-password'
      
      mockedBcrypt.compare.mockResolvedValue(false as never)
      
      const result = await verifyPassword(password, hashedPassword)
      
      expect(result).toBe(false)
    })
  })

  describe('createUser', () => {
    it('should create user successfully', async () => {
      const email = 'test@example.com'
      const password = 'testpassword'
      const userId = 'test-user-id'
      const hashedPassword = 'hashed-password'

      mockedBcrypt.hash.mockResolvedValue(hashedPassword as never)
      mockedNanoid.mockReturnValue(userId)
      
      const mockInsertUsers = {
        insert: vi.fn().mockReturnThis(),
        values: vi.fn().mockResolvedValue(undefined)
      }
      
      const mockInsertProfiles = {
        insert: vi.fn().mockReturnThis(),
        values: vi.fn().mockResolvedValue(undefined)
      }
      
      const mockTransaction = vi.fn().mockImplementation(async (callback) => {
        const mockTx = {
          insert: vi.fn()
            .mockReturnValueOnce(mockInsertUsers)
            .mockReturnValueOnce(mockInsertProfiles)
        }
        await callback(mockTx)
      })
      
      mockedDb.transaction = mockTransaction

      const result = await createUser(email, password)

      expect(nanoid).toHaveBeenCalled()
      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10)
      expect(mockTransaction).toHaveBeenCalled()
      expect(result).toEqual({ id: userId, email })
    })

    it('should return null on database error', async () => {
      const email = 'test@example.com'
      const password = 'testpassword'
      
      mockedBcrypt.hash.mockResolvedValue('hashed' as never)
      mockedNanoid.mockReturnValue('id')
      
      const mockTransaction = vi.fn().mockRejectedValue(new Error('DB Error'))
      mockedDb.transaction = mockTransaction

      const result = await createUser(email, password)

      expect(result).toBeNull()
      expect(console.error).toHaveBeenCalledWith('Error creating user:', expect.any(Error))
    })
  })

  describe('generateJWT', () => {
    it('should generate JWT token', async () => {
      const payload: JWTPayload = { userId: 'test-user' }
      const token = 'jwt-token'

      const mockSignJWT = {
        setProtectedHeader: vi.fn().mockReturnThis(),
        setIssuedAt: vi.fn().mockReturnThis(),
        setExpirationTime: vi.fn().mockReturnThis(),
        sign: vi.fn().mockResolvedValue(token)
      }
      vi.mocked(jose.SignJWT).mockImplementation(function () { return mockSignJWT } as any)

      const result = await generateJWT(payload)

      expect(jose.SignJWT).toHaveBeenCalledWith(payload)
      expect(mockSignJWT.setProtectedHeader).toHaveBeenCalledWith({ alg: 'HS256' })
      expect(mockSignJWT.setIssuedAt).toHaveBeenCalled()
      expect(mockSignJWT.setExpirationTime).toHaveBeenCalledWith('7d')
      expect(result).toBe(token)
    })
  })

  describe('verifyJWT', () => {
    it('should verify valid JWT token', async () => {
      const token = 'valid-token'
      const payload: JWTPayload = { userId: 'test-user' }
    
      vi.mocked(jose.jwtVerify).mockResolvedValue({ payload } as any)
    
      const result = await verifyJWT(token)
    
      expect(jose.jwtVerify).toHaveBeenCalledWith(token, uint8Array)
      expect(result).toEqual(payload)
    })
    
    it('should return null for invalid token', async () => {
      const token = 'invalid-token'
    
      vi.mocked(jose.jwtVerify).mockRejectedValue(new Error('Invalid token'))
    
      const result = await verifyJWT(token)
    
      expect(result).toBeNull()
      expect(console.error).toHaveBeenCalledWith('JWT verification failed:', expect.any(Error))
    })
  })

  describe('shouldRefreshToken', () => {
    it('should return true when token needs refresh', async () => {
      const token = 'token-to-refresh'
      const now = Math.floor(Date.now() / 1000)
      const exp = now + 1000

      vi.mocked(jose.jwtVerify).mockResolvedValue({  payload: { exp } } as any)

      const result = await shouldRefreshToken(token)

      expect(jose.jwtVerify).toHaveBeenCalledWith(token, uint8Array, { clockTolerance: 15 })
      expect(result).toBe(true)
    })

    it('should return false when token does not need refresh', async () => {
      const token = 'fresh-token'
      const now = Math.floor(Date.now() / 1000)
      const exp = now + (25 * 60 * 60)

      vi.mocked(jose.jwtVerify).mockResolvedValue({ 
        payload: { exp } 
      } as any)

      const result = await shouldRefreshToken(token)

      expect(result).toBe(false)
    })

    it('should return false on verification error', async () => {
      const token = 'invalid-token'

      vi.mocked(jose.jwtVerify).mockRejectedValue(new Error('Invalid'))

      const result = await shouldRefreshToken(token)

      expect(result).toBe(false)
    })
  })

  describe('createSession', () => {
    it('should create session successfully in test environment', async () => {
      const userId = 'test-user'
      const token = 'jwt-token'

      const mockSignJWT = {
        setProtectedHeader: vi.fn().mockReturnThis(),
        setIssuedAt: vi.fn().mockReturnThis(),
        setExpirationTime: vi.fn().mockReturnThis(),
        sign: vi.fn().mockResolvedValue(token)
      }
      vi.mocked(jose.SignJWT).mockImplementation(function () { return mockSignJWT } as any)

      const mockCookieStore = { set: vi.fn() }
      mockedCookies.mockResolvedValue(mockCookieStore as any)

      const result = await createSession(userId)

      expect(mockCookieStore.set).toHaveBeenCalledWith({
        name: 'auth_token',
        value: token,
        httpOnly: true,
        secure: false,
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
        sameSite: 'lax'
      })
      expect(result).toBe(true)
    })

    it('should set secure cookie in production', async () => {
      vi.stubEnv('NODE_ENV', 'production')
      
      const userId = 'test-user'
      const token = 'jwt-token'

      const mockSignJWT = {
        setProtectedHeader: vi.fn().mockReturnThis(),
        setIssuedAt: vi.fn().mockReturnThis(),
        setExpirationTime: vi.fn().mockReturnThis(),
        sign: vi.fn().mockResolvedValue(token)
      }

      vi.mocked(jose.SignJWT).mockImplementation(function () { return mockSignJWT } as any)

      const mockCookieStore = { set: vi.fn() }
      mockedCookies.mockResolvedValue(mockCookieStore as any)

      const result = await createSession(userId)

      expect(mockCookieStore.set).toHaveBeenCalledWith({
        name: 'auth_token',
        value: token,
        httpOnly: true,
        secure: true,
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
        sameSite: 'lax'
      })
      expect(result).toBe(true)
    })

    it('should return false on error', async () => {
      const userId = 'test-user'

      mockedCookies.mockRejectedValue(new Error('Cookie error'))

      const result = await createSession(userId)

      expect(result).toBe(false)
      expect(console.error).toHaveBeenCalledWith('Error creating session:', expect.any(Error))
    })
  })

  describe('getSession', () => {
    it('should get session successfully', async () => {
      const token = 'valid-token'
      const userId = 'test-user'

      const mockCookieStore = { get: vi.fn().mockReturnValue({ value: token }) }

      mockedCookies.mockResolvedValue(mockCookieStore as any)
      vi.mocked(jose.jwtVerify).mockResolvedValue({ 
        payload: { userId } 
      } as any)

      const result = await getSession()

      expect(mockCookieStore.get).toHaveBeenCalledWith('auth_token')
      expect(result).toEqual({ userId })
    })

    it('should return null when no token', async () => {
      const mockCookieStore = { get: vi.fn().mockReturnValue(undefined) }

      mockedCookies.mockResolvedValue(mockCookieStore as any)

      const result = await getSession()

      expect(result).toBeNull()
    })

    it('should return null when token exists but verification fails', async () => {
      const token = 'invalid-token'

      const mockCookieStore = { get: vi.fn().mockReturnValue({ value: token }) }

      mockedCookies.mockResolvedValue(mockCookieStore as any)
      vi.mocked(jose.jwtVerify).mockResolvedValue({ payload: null } as any)

      const result = await getSession()

      expect(result).toBeNull()
    })

    it('should return null during prerendering', async () => {
      const prerenderError = new Error('During prerendering, `cookies()` rejects')
      mockedCookies.mockRejectedValue(prerenderError)

      const result = await getSession()

      expect(result).toBeNull()
    })

    it('should handle other errors', async () => {
      mockedCookies.mockRejectedValue(new Error('Other error'))

      const result = await getSession()

      expect(result).toBeNull()
      expect(console.error).toHaveBeenCalledWith('Error getting session:', expect.any(Error))
    })
  })

  describe('deleteSession', () => {
    it('should delete session cookie', async () => {
      const mockCookieStore = { delete: vi.fn() }

      mockedCookies.mockResolvedValue(mockCookieStore as any)

      await deleteSession()

      expect(mockCookieStore.delete).toHaveBeenCalledWith('auth_token')
    })
  })
})

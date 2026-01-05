import { describe, it, expect, vi, beforeEach } from 'vitest'
import { logIn, signUp, logOut } from '../auth'
import { redirect } from 'next/navigation'
import { revalidateTag } from 'next/cache'
import { verifyPassword, createSession, createUser, deleteSession } from '@/lib/session'
import { getAuthenticatedUser, getUserByEmail, USER_BY_ID_CACHE_TAG } from '@/dal/user'
import { ROUTES } from '@/config/routes'

vi.spyOn(console, 'error').mockImplementation(() => {})
vi.mock('next/navigation', () => ({ redirect: vi.fn() }))
vi.mock('next/cache', () => ({ revalidateTag: vi.fn() }))
vi.mock('@/lib/session', () => ({
  verifyPassword: vi.fn(),
  createSession: vi.fn(),
  createUser: vi.fn(),
  deleteSession: vi.fn()
}))

vi.mock('@/dal/user', () => ({
  getAuthenticatedUser: vi.fn(),
  getUserByEmail: vi.fn(),
  USER_BY_ID_CACHE_TAG: 'user-by-id-'
}))

const createFormData = (email: string, password: string) => {
  const formData = new FormData()
  formData.append('email', email)
  formData.append('password', password)
  return formData
}

const mockUser = { id: '1', email: 'test@example.com', password: 'hashedpassword', createdAt: new Date() }

describe('Auth Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.clearAllTimers()
  })

  describe('logIn', () => {
    it('should successfully log in with valid credentials', async () => {
      vi.mocked(getUserByEmail).mockResolvedValue(mockUser)
      vi.mocked(verifyPassword).mockResolvedValue(true)
      vi.mocked(createSession).mockResolvedValue(false)

      const formData = createFormData('test@example.com', 'password123')
      const result = await logIn(formData)

      expect(result).toEqual({ success: true, message: 'Signed in successfully' })
      expect(getUserByEmail).toHaveBeenCalledWith('test@example.com')
      expect(verifyPassword).toHaveBeenCalledWith('password123', 'hashedpassword')
      expect(createSession).toHaveBeenCalledWith('1')
    })

    it('should return validation error for missing email', async () => {
      const formData = createFormData('', 'password123')
      const result = await logIn(formData)

      expect(result).toEqual({ success: false, message: 'Validation failed', errors: { email: ['Email is required', 'Invalid email format'] } })
      expect(getUserByEmail).not.toHaveBeenCalled()
    })

    it('should return validation error for invalid email format', async () => {
      const formData = createFormData('invalid-email', 'password123')
      const result = await logIn(formData)

      expect(result).toEqual({ success: false, message: 'Validation failed', errors: { email: ['Invalid email format'] } })
      expect(getUserByEmail).not.toHaveBeenCalled()
    })

    it('should return validation error for missing password', async () => {
      const formData = createFormData('test@example.com', '')
      const result = await logIn(formData)

      expect(result).toEqual({ success: false, message: 'Validation failed', errors: { password: ['Password is required'] } })
      expect(getUserByEmail).not.toHaveBeenCalled()
    })

    it('should return error for non-existent user', async () => {
      vi.mocked(getUserByEmail).mockResolvedValue(null)

      const formData = createFormData('nonexistent@example.com', 'password123')
      const result = await logIn(formData)

      expect(result).toEqual({ success: false, message: 'Invalid email or password', errors: { email: ['Invalid email or password'] } })
      expect(verifyPassword).not.toHaveBeenCalled()
    })

    it('should return error for invalid password', async () => {
      vi.mocked(getUserByEmail).mockResolvedValue(mockUser)
      vi.mocked(verifyPassword).mockResolvedValue(false)

      const formData = createFormData('test@example.com', 'wrongpassword')
      const result = await logIn(formData)

      expect(result).toEqual({ success: false, message: 'Invalid email or password', errors: { password: ['Invalid email or password'] } })
      expect(createSession).not.toHaveBeenCalled()
    })

    it('should handle unexpected errors gracefully', async () => {
      vi.mocked(getUserByEmail).mockRejectedValue(new Error('Database error'))

      const formData = createFormData('test@example.com', 'password123')
      const result = await logIn(formData)

      expect(result).toEqual({ success: false, message: 'An error occurred while Logging in', error: 'Failed to sign in' })
    })
  })

  describe('signUp', () => {
    const createSignUpFormData = (email: string, password: string, confirmPassword: string) => {
      const formData = new FormData()
      formData.append('email', email)
      formData.append('password', password)
      formData.append('confirmPassword', confirmPassword)
      return formData
    }

    it('should successfully create account with valid data', async () => {
      vi.mocked(getUserByEmail).mockResolvedValue(null)
      vi.mocked(createUser).mockResolvedValue(mockUser)
      vi.mocked(createSession).mockResolvedValue(false)

      const formData = createSignUpFormData('newuser@example.com', 'password123', 'password123')
      const result = await signUp(formData)

      expect(result).toEqual({ success: true, message: 'Account created successfully' })
      expect(getUserByEmail).toHaveBeenCalledWith('newuser@example.com')
      expect(createUser).toHaveBeenCalledWith('newuser@example.com', 'password123')
      expect(createSession).toHaveBeenCalledWith('1')
    })

    it('should return validation error for missing email', async () => {
      const formData = createSignUpFormData('', 'password123', 'password123')
      const result = await signUp(formData)

      expect(result).toEqual({ success: false, message: 'Validation failed', errors: { email: ['Email is required', 'Invalid email format'] } })
    })

    it('should return validation error for short password', async () => {
      const formData = createSignUpFormData('test@example.com', '12345', '12345')
      const result = await signUp(formData)

      expect(result).toEqual({
        success: false,
        message: 'Validation failed',
        errors: { password: ['Password must be at least 6 characters'] }
      })
    })

    it('should return validation error for mismatched passwords', async () => {
      const formData = createSignUpFormData('test@example.com', 'password123', 'differentpassword')
      const result = await signUp(formData)

      expect(result).toEqual({
        success: false,
        message: 'Validation failed',
        errors: { password: ['Passwords don\'t match'], confirmPassword: ['Passwords don\'t match'] }
      })
    })

    it('should return error for existing user', async () => {
      vi.mocked(getUserByEmail).mockResolvedValue(mockUser)

      const formData = createSignUpFormData(mockUser.email, 'password123', 'password123')
      const result = await signUp(formData)

      expect(result).toEqual({ success: false, message: 'User with this email already exists', errors: { email: ['User with this email already exists'] } })
      expect(createUser).not.toHaveBeenCalled()
    })

    it('should return error when user creation fails', async () => {
      vi.mocked(getUserByEmail).mockResolvedValue(null)
      vi.mocked(createUser).mockResolvedValue(null)

      const formData = createSignUpFormData('test@example.com', 'password123', 'password123')
      const result = await signUp(formData)

      expect(result).toEqual({ success: false, message: 'Failed to create user', error: 'Failed to create user' })
    })

    it('should handle unexpected errors gracefully', async () => {
      vi.mocked(getUserByEmail).mockRejectedValue(new Error('Database error'))

      const formData = createSignUpFormData('test@example.com', 'password123', 'password123')
      const result = await signUp(formData)

      expect(result).toEqual({ success: false, message: 'An error occurred while creating your account', error: 'Failed to create account' })
    })
  })

  describe('logOut', () => {
    it('should successfully log out user', async () => {
      vi.mocked(getAuthenticatedUser).mockResolvedValue(mockUser)
      vi.mocked(deleteSession).mockResolvedValue(undefined)

      await logOut()

      expect(deleteSession).toHaveBeenCalled()
      expect(revalidateTag).toHaveBeenCalledWith(`${USER_BY_ID_CACHE_TAG}1`, 'max')
      expect(redirect).toHaveBeenCalledWith(ROUTES.auth.login.href)
    })

    it('should handle logout with no authenticated user', async () => {
      vi.mocked(getAuthenticatedUser).mockResolvedValue(null)
      vi.mocked(deleteSession).mockResolvedValue(undefined)

      await logOut()

      expect(deleteSession).toHaveBeenCalled()
      expect(revalidateTag).toHaveBeenCalledWith(`${USER_BY_ID_CACHE_TAG}undefined`, 'max')
      expect(redirect).toHaveBeenCalledWith(ROUTES.auth.login.href)
    })

    it('should handle session deletion errors and still redirect', async () => {
      vi.mocked(getAuthenticatedUser).mockResolvedValue(mockUser)
      vi.mocked(deleteSession).mockRejectedValue(new Error('Session error'))

      await expect(logOut()).rejects.toThrow('Failed to sign out')

      expect(deleteSession).toHaveBeenCalled()
      expect(revalidateTag).toHaveBeenCalledWith(`${USER_BY_ID_CACHE_TAG}1`, 'max')
      expect(redirect).toHaveBeenCalledWith(ROUTES.auth.login.href)
    })
  })
})

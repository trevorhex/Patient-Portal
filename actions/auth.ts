'use server'

import { redirect } from 'next/navigation'
import { revalidateTag } from 'next/cache'
import { z } from 'zod'
import { verifyPassword, createSession, createUser, deleteSession } from '@/lib/session'
import { getAuthenticatedUser, getUserByEmail, USER_BY_ID_CACHE_TAG } from '@/dal/user'
import { ROUTES } from '@/config/routes'

const LogInSchema = z.object({
  email: z.string()
    .min(1, 'Email is required')
    .email('Invalid email format'),
  password: z.string()
    .min(1, 'Password is required')
})

const SignUpSchema = z
  .object({
    email: z.string()
      .min(1, 'Email is required')
      .email('Invalid email format'),
    password: z.string()
      .min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string()
      .min(1, 'Please confirm your password')
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords don\'t match',
    path: ['password']
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords don\'t match',
    path: ['confirmPassword']
  })

export type LogInData = z.infer<typeof LogInSchema>
export type SignUpData = z.infer<typeof SignUpSchema>

export type ActionResponse = {
  success: boolean
  message: string
  token?: string
  errors?: Record<string, string[]>
  error?: string
}

export const logIn = async (formData: FormData): Promise<ActionResponse> => {
  try {
    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string
    }

    const validationResult = LogInSchema.safeParse(data)
    if (!validationResult.success) {
      return {
        success: false,
        message: 'Validation failed',
        errors: validationResult.error.flatten().fieldErrors
      }
    }

    const user = await getUserByEmail(data.email)
    if (!user) {
      return {
        success: false,
        message: 'Invalid email or password',
        errors: { email: ['Invalid email or password'] }
      }
    }

    const isPasswordValid = await verifyPassword(data.password, user.password)
    if (!isPasswordValid) {
      return {
        success: false,
        message: 'Invalid email or password',
        errors: { password: ['Invalid email or password'] }
      }
    }

    const token = await createSession(user.id)

    if (!token) {
      return {
        success: false,
        message: 'Failed to create session',
        error: 'Failed to sign in'
      }
    }

    return {
      success: true,
      message: 'Signed in successfully',
      token
    }
  } catch (e) {
    console.error('Sign in error:', e)
    return {
      success: false,
      message: 'An error occurred while Logging in',
      error: 'Failed to sign in'
    }
  }
}

export const signUp = async (formData: FormData): Promise<ActionResponse> => {
  try {
    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      confirmPassword: formData.get('confirmPassword') as string
    }

    const validationResult = SignUpSchema.safeParse(data)
    if (!validationResult.success) {
      return {
        success: false,
        message: 'Validation failed',
        errors: validationResult.error.flatten().fieldErrors
      }
    }

    const existingUser = await getUserByEmail(data.email)
    if (existingUser) {
      return {
        success: false,
        message: 'User with this email already exists',
        errors: { email: ['User with this email already exists'] }
      }
    }

    const user = await createUser(data.email, data.password)
    if (!user) {
      return {
        success: false,
        message: 'Failed to create user',
        error: 'Failed to create user'
      }
    }

    const token = await createSession(user.id)

    if (!token) {
      return {
        success: false,
        message: 'Failed to create session',
        error: 'Failed to sign in'
      }
    }

    return {
      success: true,
      message: 'Account created successfully',
      token
    }
  } catch (e) {
    console.error('Sign up error:', e)
    return {
      success: false,
      message: 'An error occurred while creating your account',
      error: 'Failed to create account'
    }
  }
}

export const logOut = async (): Promise<void> => {
  const user = await getAuthenticatedUser()
  try {
    await deleteSession()
  } catch (e) {
    console.error('Sign out error:', e)
    throw new Error('Failed to sign out')
  } finally {
    revalidateTag(`${USER_BY_ID_CACHE_TAG}${user?.id}`, 'max')
    redirect(ROUTES.auth.login.href)
  }
}

import { compare, hash } from 'bcrypt'
import { nanoid } from 'nanoid'
import { cookies } from 'next/headers'
import { db } from '@/db'
import { users } from '@/db/schema'
import * as jose from 'jose'
import { cache } from 'react'

export interface JWTPayload {
  userId: string
  [key: string]: string | number | boolean | null | undefined
}

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET)
const JWT_EXPIRATION = '7d'
const REFRESH_THRESHOLD = 24 * 60 * 60 // 24 hours

export const hashPassword = async (password: string) => hash(password, 10)

export const verifyPassword = async (password: string, hashedPassword: string) => compare(password, hashedPassword)

export const createUser = async (email: string, password: string) => {
  const hashedPassword = await hashPassword(password)
  const id = nanoid()

  try {
    await db.insert(users).values({
      id,
      email,
      password: hashedPassword,
    })

    return { id, email }
  } catch (error) {
    console.error('Error creating user:', error)
    return null
  }
}

export const generateJWT = async (payload: JWTPayload) =>
  await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRATION)
    .sign(JWT_SECRET)


export const verifyJWT = async (token: string): Promise<JWTPayload | null> => {
  try {
    const { payload } = await jose.jwtVerify(token, JWT_SECRET)
    return payload as JWTPayload
  } catch (error) {
    console.error('JWT verification failed:', error)
    return null
  }
}

export const shouldRefreshToken = async (token: string): Promise<boolean> => {
  try {
    const { payload } = await jose.jwtVerify(token, JWT_SECRET, { clockTolerance: 15 })
    const exp = payload.exp as number
    const now = Math.floor(Date.now() / 1000)

    return exp - now < REFRESH_THRESHOLD
  } catch {
    return false
  }
}

export const createSession = async (userId: string) => {
  try {
    const token = await generateJWT({ userId })

    const cookieStore = await cookies()
    cookieStore.set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
      sameSite: 'lax',
    })

    return true
  } catch (error) {
    console.error('Error creating session:', error)
    return false
  }
}

export const getSession = cache(async () => {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth_token')?.value

    if (!token) return null
    const payload = await verifyJWT(token)

    return payload ? { userId: payload.userId } : null
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes('During prerendering, `cookies()` rejects')
    ) {
      console.log('Cookies not available during prerendering, returning null session')
      return null
    }

    console.error('Error getting session:', error)
    return null
  }
})

export const deleteSession = async () => {
  const cookieStore = await cookies()
  cookieStore.delete('auth_token')
}

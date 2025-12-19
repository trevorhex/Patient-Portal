import { cacheTag } from 'next/cache'
import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { users } from '@/db/schema'
import { getSession } from '@/lib/session'

export const USER_BY_ID_CACHE_TAG = 'get-user-by-id-'

/*
* Get User
*/

export const getUserById = async (userId: string) => {
  'use cache'
  cacheTag(`${USER_BY_ID_CACHE_TAG}${userId}`)

  try {
    return await db.query.users.findFirst({ where: eq(users.id, userId) })
  } catch (e) {
    console.error(e)
    return null
  }
}

export const getAuthenticatedUser = async () => {
  try {
    const session = await getSession()
    if (!session) return null

    return await getUserById(session.userId)
  } catch (e) {
    console.error(e)
    return null
  }
}

export const getUserByEmail = async (email: string) => {
  try {
    return await db.query.users.findFirst({ where: eq(users.email, email) })
  } catch (e) {
    console.error(e)
    return null
  }
}

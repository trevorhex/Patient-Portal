import { cacheTag } from 'next/cache'
import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { profiles } from '@/db/schema'
import { getSession } from '@/lib/session'

export const PROFILE_BY_USER_ID_CACHE_TAG = 'get-profile-by-user-id-'

/*
* Get Profile
*/

export const getProfileByUserId = async (userId: string) => {
  'use cache'
  cacheTag(`${PROFILE_BY_USER_ID_CACHE_TAG}${userId}`)

  try {
    return await db.query.profiles.findFirst({ where: eq(profiles.userId, userId) })
  } catch (e) {
    console.error(e)
    return null
  }
}

export const getProfile = async () => {
  try {
    const session = await getSession()
    if (!session) return null

    return await getProfileByUserId(session.userId)
  } catch (e) {
    console.error(e)
    return null
  }
}

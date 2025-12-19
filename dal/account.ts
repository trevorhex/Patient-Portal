import { cacheTag } from 'next/cache'
import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { accountSettings } from '@/db/schema'
import { getSession } from '@/lib/session'

export const ACCOUNT_SETTINGS_BY_USER_ID_CACHE_TAG = 'get-account-by-user-id-'

/*
* Get Account
*/

export const getAccountSettingsByUserId = async (userId: string) => {
  'use cache'
  cacheTag(`${ACCOUNT_SETTINGS_BY_USER_ID_CACHE_TAG}${userId}`)

  try {
    return await db.query.accountSettings.findFirst({ where: eq(accountSettings.userId, userId) }) ?? {}
  } catch (e) {
    console.error(e)
    return null
  }
}

export const getAccountSettings = async () => {
  try {
    const session = await getSession()
    if (!session) return null

    return await getAccountSettingsByUserId(session.userId)
  } catch (e) {
    console.error(e)
    return null
  }
}

import { cacheTag } from 'next/cache'
import { eq, and } from 'drizzle-orm'
import { db } from '@/db'
import { users, issues } from '@/db/schema'
import { getSession } from './session'

export const USER_BY_ID_CACHE_TAG = 'get-user-by-id-'
export const ISSUES_BY_USER_ID_CACHE_TAG = 'get-issues-by-user-id-'
export const USER_ISSUE_BY_ID_CACHE_TAG = 'get-user-issue-by-id-'

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

export const getCurrentUser = async () => {
  const session = await getSession()
  if (!session) return null

  try {
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

/*
* Get Issues
*/

export const getIssuesByUserId = async (userId: string) => {
  'use cache'
  cacheTag(`${ISSUES_BY_USER_ID_CACHE_TAG}${userId}`)

  try {
    return await db.query.issues.findMany({
      where: eq(issues.userId, userId),
      with: { user: true },
      orderBy: (issues, { desc }) => [desc(issues.createdAt)]
    })
  } catch (e) {
    console.error('Error fetching issues:', e)
    throw new Error('Failed to fetch issues')
  }
}

export const getIssues = async () => {
  const currentUser = await getCurrentUser()
  if (!currentUser) throw new Error('User not authenticated')

  return await getIssuesByUserId(currentUser.id)
}

/*
* Get Issue
*/

export const getUserIssueById = async (userId: string, id: number) => {
  'use cache'
  cacheTag(`${USER_ISSUE_BY_ID_CACHE_TAG}${userId}-${id}`)

  try {
    return await db.query.issues.findFirst({
      where: and(
        eq(issues.userId, userId),
        eq(issues.id, id)
      ),
      with: { user: true }
    })
  } catch (e) {
    console.error('Error fetching issue:', e)
    throw new Error('Failed to fetch issue')
  }
}

export const getIssue = async (id: number) => {
  const currentUser = await getCurrentUser()
  if (!currentUser) throw new Error('User not authenticated')

  return await getUserIssueById(currentUser.id, id)
}

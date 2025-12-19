import { cacheTag } from 'next/cache'
import { eq, and } from 'drizzle-orm'
import { db } from '@/db'
import { issues } from '@/db/schema'
import { getAuthenticatedUser } from './user'

export const ISSUES_BY_USER_ID_CACHE_TAG = 'get-issues-by-user-id-'
export const USER_ISSUE_BY_ID_CACHE_TAG = 'get-user-issue-by-id-'

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
  try {
    const currentUser = await getAuthenticatedUser()
    if (currentUser) return await getUserIssueById(currentUser.id, id)
  } catch (e) {
    console.error('Error fetching issue:', e)
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
  try {
    const currentUser = await getAuthenticatedUser()
    return currentUser
      ? await getIssuesByUserId(currentUser.id)
      : []
  } catch (e) {
    console.error('Error fetching issues:', e)
    return []
  }
}

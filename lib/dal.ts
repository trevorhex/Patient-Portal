import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { users, issues } from '@/db/schema'
import { getSession } from './session'

export const getCurrentUser = async () => {
  const session = await getSession()
  if (!session) return null

  try {
    const results = await db
      .select()
      .from(users)
      .where(eq(users.id, session.userId))

    return results[0] ?? null
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

export const getIssues = async () => {
  const currentUser = await getCurrentUser()
  if (!currentUser) throw new Error('User not authenticated')

  try {
    const result = await db.query.issues.findMany({
      where: eq(issues.userId, currentUser.id),
      with: { user: true },
      orderBy: (issues, { desc }) => [desc(issues.createdAt)]
    })
    return result
  } catch (error) {
    console.error('Error fetching issues:', error)
    throw new Error('Failed to fetch issues')
  }
}

export const getIssue = async (id: number) => {
  try {
    return await db.query.issues.findFirst({ where: eq(issues.id, id), with: { user: true } })
  } catch (error) {
    console.error('Error fetching issue:', error)
    throw new Error('Failed to fetch issue')
  }
}

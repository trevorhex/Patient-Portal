'use server'

import { revalidateTag, revalidatePath } from 'next/cache'
import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { issues } from '@/db/schema'
import { issueStatus, issuePriority } from '@/db/types'
import { ISSUES_BY_USER_ID_CACHE_TAG, USER_ISSUE_BY_ID_CACHE_TAG } from '@/dal/issue'
import { getAuthenticatedUser } from '@/dal/user'
import { ROUTES } from '@/config/routes'

const IssueSchema = z.object({
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters'),
  description: z.string()
    .optional()
    .nullable(),
  status: z.enum(issueStatus,
    { errorMap: () => ({ message: 'Please select a valid status' }) }),
  priority: z.enum(issuePriority,
    { errorMap: () => ({ message: 'Please select a valid priority' }) }),
  userId: z.string()
    .min(1, 'User ID is required')
})

export type IssueData = z.infer<typeof IssueSchema>

export type ActionResponse = {
  success: boolean
  message: string
  errors?: Record<string, string[]>
  error?: string
}

export const createIssue = async (data: IssueData): Promise<ActionResponse> => {
  try {
    const user = await getAuthenticatedUser()

    const validationResult = IssueSchema.safeParse(data)
    if (!validationResult.success) {
      return {
        success: false,
        message: 'Validation failed',
        errors: validationResult.error.flatten().fieldErrors
      }
    }

    const validatedData = validationResult.data
    await db.insert(issues).values({
      title: validatedData.title,
      description: validatedData.description ?? null,
      status: validatedData.status,
      priority: validatedData.priority,
      userId: validatedData.userId
    })

    revalidateTag(`${ISSUES_BY_USER_ID_CACHE_TAG}${user?.id}`, 'max')

    return { success: true, message: 'Issue created successfully' }
  } catch (e) {
    console.error('Error creating issue:', e)
    return {
      success: false,
      message: 'An error occurred while creating the issue',
      error: 'Failed to create issue'
    }
  }
}

export const updateIssue = async (id: number, data: Partial<IssueData>): Promise<ActionResponse> => {
  try {
    const user = await getAuthenticatedUser()

    const IssueSchemaPartial = IssueSchema.partial()
    const validationResult = IssueSchemaPartial.safeParse(data)

    if (!validationResult.success) {
      return {
        success: false,
        message: 'Validation failed',
        errors: validationResult.error.flatten().fieldErrors
      }
    }

    const existingIssue = await db.select().from(issues).where(eq(issues.id, id)).limit(1)
    
    if (!existingIssue.length) {
      return {
        success: false,
        message: 'Issue not found',
        error: 'Issue does not exist'
      }
    }

    if (existingIssue[0].userId !== user?.id) {
      return {
        success: false,
        message: 'You can only update your own issues',
        error: 'Forbidden'
      }
    }

    const validatedData = validationResult.data
    const updateData = Object.fromEntries(
      Object.entries(validatedData).filter(([_, value]) => value !== undefined)
    )

    if (Object.keys(updateData).length) {
      await db.update(issues).set(updateData).where(eq(issues.id, id))

      revalidateTag(`${USER_ISSUE_BY_ID_CACHE_TAG}${user.id}-${id}`, 'max')
      revalidateTag(`${ISSUES_BY_USER_ID_CACHE_TAG}${user.id}`, 'max')
      revalidatePath(ROUTES.issues.base.href)
    }

    return { success: true, message: 'Issue updated successfully' }
  } catch (e) {
    console.error('Error updating issue:', e)
    return {
      success: false,
      message: 'An error occurred while updating the issue',
      error: 'Failed to update issue'
    }
  }
}

export const deleteIssue = async (id: number) => {
  try {
    const user = await getAuthenticatedUser()

    const existingIssue = await db.select().from(issues).where(eq(issues.id, id)).limit(1)
    
    if (!existingIssue.length) {
      return {
        success: false,
        message: 'Issue not found',
        error: 'Issue does not exist'
      }
    }

    if (existingIssue[0].userId !== user?.id) {
      return {
        success: false,
        message: 'You can only delete your own issues',
        error: 'Forbidden'
      }
    }

    await db.delete(issues).where(eq(issues.id, id))

    revalidateTag(`${ISSUES_BY_USER_ID_CACHE_TAG}${user?.id}`, 'max')

    return { success: true, message: 'Issue deleted successfully' }
  } catch (e) {
    console.error('Error deleting issue:', e)
    return {
      success: false,
      message: 'An error occurred while deleting the issue',
      error: 'Failed to delete issue'
    }
  }
}

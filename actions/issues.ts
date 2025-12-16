'use server'

import { z } from 'zod'
import { db } from '@/db'
import { issues } from '@/db/schema'
import { getCurrentUser } from '@/lib/dal'
import { status, priority } from '@/db/schema'

const IssueSchema = z.object({
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters'),
  description: z.string()
    .optional()
    .nullable(),
  status: z.enum(status,
    { errorMap: () => ({ message: 'Please select a valid status' }) }),
  priority: z.enum(priority,
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
    const user = await getCurrentUser()
    if (!user) {
      return {
        success: false,
        message: 'Unauthorized access',
        error: 'Unauthorized'
      }
    }

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

    return { success: true, message: 'Issue created successfully' }
  } catch (error) {
    console.error('Error creating issue:', error)
    return {
      success: false,
      message: 'An error occurred while creating the issue',
      error: 'Failed to create issue'
    }
  }
}

export const updateIssue = async () => {}

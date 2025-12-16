import { db } from '@/db'
import { getSession } from './session'
import { eq } from 'drizzle-orm'
import { cache } from 'react'
import { issues, users } from '@/db/schema'
import { mockDelay } from './utils'

export const getUserByEmail = (): Promise<any> => new Promise((resolve) => resolve(null))

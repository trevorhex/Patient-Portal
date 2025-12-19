import { db } from '@/db'
import { issues } from '@/db/schema'
import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/dal/user'

export const GET = async (req: NextRequest) => {
  try {
    const issues = await db.query.issues.findMany({})
    return NextResponse.json({ data: { issues } })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Application Error' }, { status: 500 })
  }
}

export const POST = async (req: NextRequest) => {
  try {
    const user = await getAuthenticatedUser()
    const values = await req.json()
    const [newIssue] = await db.insert(issues).values({ userId: user?.id, ...values }).returning()

    return NextResponse.json({ data: newIssue })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Application Error' }, { status: 500 })
  }
}

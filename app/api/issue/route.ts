import { db } from '@/db'
import { issues } from '@/db/schema'
import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/dal/user'

export const GET = async () => {
  try {
    const issues = await db.query.issues.findMany({})
    return NextResponse.json({ success: true, data: { issues } }, { status: 200 })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ success: false, error: 'Application Error' }, { status: 500 })
  }
}

export const POST = async (req: NextRequest) => {
  try {
    const user = await getAuthenticatedUser()
    const values = await req.json()
    const [newIssue] = await db.insert(issues).values({ userId: user?.id, ...values }).returning()

    return NextResponse.json({ success: true, data: newIssue }, { status: 201 })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ success: false, error: 'Application Error' }, { status: 500 })
  }
}

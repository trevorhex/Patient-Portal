import { db } from '@/db'
import { issues } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/dal/user'

/*
* GET /api/issues/[id]
* Get issue
*/
export const GET = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const user = await getAuthenticatedUser()
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const issue = await db.query.issues.findFirst({ where: eq(issues.id, parseInt(id)) && eq(issues.userId, user.id) })

    if (!issue) return NextResponse.json({ success: false, error: 'Issue not found' }, { status: 404 })

    return NextResponse.json({ success: true, data: issue }, { status: 200 })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ success: false, error: 'Application Error' }, { status: 500 })
  }
}

/*
* PUT /api/issues/[id]
* Handle updating an issue
*/
export const PUT = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const user = await getAuthenticatedUser()
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const values = await req.json()
    const { ...updateData } = values

    if (!id) return NextResponse.json({ success: false, error: 'Issue ID is required' }, { status: 400 })

    const [updatedIssue] = await db
      .update(issues)
      .set(updateData)
      .where(eq(issues.id, parseInt(id)) && eq(issues.userId, user.id))
      .returning()

    if (!updatedIssue) return NextResponse.json({ success: false, error: 'Issue not found' }, { status: 404 })

    return NextResponse.json({ success: true, data: updatedIssue }, { status: 200 })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ success: false, error: 'Application Error' }, { status: 500 })
  }
}

/*
* DELETE /api/issues/[id]
* Handle deleting an issue
*/
export const DELETE = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const user = await getAuthenticatedUser()
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    
    if (!id) return NextResponse.json({ success: false, error: 'Issue ID is required' }, { status: 400 })

    const [deletedIssue] = await db
      .delete(issues)
      .where(eq(issues.id, parseInt(id)) && eq(issues.userId, user.id))
      .returning()

    if (!deletedIssue) return NextResponse.json({ success: false, error: 'Issue not found' }, { status: 404 })

    return NextResponse.json({ success: true, data: deletedIssue }, { status: 200 })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ success: false, error: 'Application Error' }, { status: 500 })
  }
}

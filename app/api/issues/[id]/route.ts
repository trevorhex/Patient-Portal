import { NextRequest, NextResponse } from 'next/server'
import { getIssue } from '@/dal/issue'
import { updateIssue, deleteIssue } from '@/actions/issues'

/*
* GET /api/issues/[id]
* Get issue
*/
export const GET = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params
    const issueId = parseInt(id)
    
    if (isNaN(issueId)) return NextResponse.json({ success: false, error: 'Invalid issue ID' }, { status: 400 })

    const issue = await getIssue(issueId)

    if (!issue) return NextResponse.json({ success: false, error: 'Issue not found' }, { status: 404 })

    return NextResponse.json({ issue }, { status: 200 })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Application Error' }, { status: 500 })
  }
}

/*
* PUT /api/issues/[id]
* Handle updating an issue
*/
export const PUT = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params
    const issueId = parseInt(id)
    
    if (isNaN(issueId)) return NextResponse.json({ success: false, error: 'Invalid issue ID' }, { status: 400 })

    const updateData = await req.json()
    const result = await updateIssue(issueId, updateData)

    if (!result.success) {
      const status = result.error
        ? { 'Forbidden': 403, 'Issue does not exist': 404 }[result.error] ?? 400
        : 400
      return NextResponse.json(result, { status })
    }

    const issue = await getIssue(issueId)

    return NextResponse.json({ issue }, { status: 200 })
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
    const { id } = await params
    const issueId = parseInt(id)
    
    if (isNaN(issueId)) return NextResponse.json({ success: false, error: 'Invalid issue ID' }, { status: 400 })

    const result = await deleteIssue(issueId)

    if (!result.success) {
      const status = result.error
        ? { 'Forbidden': 403, 'Issue does not exist': 404 }[result.error] ?? 400
        : 400
      return NextResponse.json(result, { status })
    }

    return NextResponse.json({ id }, { status: 200 })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ success: false, error: 'Application Error' }, { status: 500 })
  }
}

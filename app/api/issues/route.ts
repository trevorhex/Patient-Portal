import { NextRequest, NextResponse } from 'next/server'
import { getIssues } from '@/dal/issue'
import { createIssue } from '@/actions/issues'

/*
* GET /api/issues
* Get authenticated user's issues
*/
export const GET = async () => {
  try {
    const userIssues = await getIssues()

    return NextResponse.json({ success: true, data: { issues: userIssues } }, { status: 200 })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ success: false, error: 'Application Error' }, { status: 500 })
  }
}

/*
* POST /api/issues
* Handle creating new issue
*/
export const POST = async (req: NextRequest) => {
  try {
    const values = await req.json()
    const result = await createIssue(values)

    if (!result.success) return NextResponse.json(result, { status: 400 })

    return NextResponse.json(result, { status: 201 })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ success: false, error: 'Application Error' }, { status: 500 })
  }
}

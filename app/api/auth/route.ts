import { NextRequest, NextResponse } from 'next/server'
import { logIn, signUp, logOut } from '@/actions/auth'
import { refreshAuthToken } from '@/lib/session'

/*
* POST /api/auth
* Handle login/signup/refresh
*/
export async function POST(req: NextRequest) {
  try {
    const { action, ...data } = await req.json()

    if (!action) {
      return NextResponse.json({
        success: false,
        message: 'Action is required'
      }, { status: 400 })
    }

    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => typeof value === 'string' &&  formData.append(key, value))

    let result

    switch (action) {
      case 'login':
        result = await logIn(formData)
        break

      case 'signup':
        result = await signUp(formData)
        break

      case 'refresh':
        const authHeader = req.headers.get('authorization')
        if (!authHeader) {
          return NextResponse.json({
            success: false,
            message: 'No token provided'
          }, { status: 401 })
        }
        const token = await refreshAuthToken(authHeader.substring(7))
        if (!token) {
          return NextResponse.json({
            success: false,
            message: 'Invalid token'
          }, { status: 401 })
        }
        return NextResponse.json({
          success: true,
          token
        }, { status: 200 })
      default:
        return NextResponse.json({
          success: false,
          message: 'Invalid action'
        }, { status: 400 })
    }

    return NextResponse.json(result, { status: result.success ? 200 : 400 })
  } catch (error) {
    console.error('API auth error:', error)
    return NextResponse.json({
      success: false,
      message: 'Application Error'
    }, { status: 500 })
  }
}

/*
* DELETE /api/auth
* Handle logout
*/
export async function DELETE() {
  try {
    await logOut()
    
    return NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    }, { status: 200 })
  } catch (error) {
    console.error('API logout error:', error)
    return NextResponse.json({
      success: false,
      message: 'Application Error'
    }, { status: 500 })
  }
}

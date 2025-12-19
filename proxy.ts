import { NextResponse, NextRequest } from 'next/server'
import { verifyJWT } from '@/lib/session'
import { ROUTES } from '@/config/routes'

const PROTECTED_ROUTES = [
  ROUTES.api.href,
  ROUTES.dashboard.href,
  ROUTES.issues.base.href
] as const

export const proxy = async (request: NextRequest) => {
  const { pathname } = request.nextUrl
  const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route))
  const isApiRoute = pathname.startsWith(ROUTES.api.href)

  if (!isProtectedRoute) return NextResponse.next()

  const token = request.cookies.get('auth_token')?.value

  if (isApiRoute && !token) {
    return NextResponse.json(
      { success: false, message: 'Authentication required' },
      { status: 401 }
    )
  }

  if (!token) return NextResponse.redirect(new URL(ROUTES.auth.login.href, request.url))

  const payload = await verifyJWT(token)

  if (isApiRoute && !payload) {
    return NextResponse.json(
      { success: false, message: 'Invalid or expired token' },
      { status: 401 }
    )
  }
  
  if (!payload) return NextResponse.redirect(new URL(ROUTES.auth.login.href, request.url))

  return NextResponse.next()
}



export const config = {
  matcher: [
    '/api/:path*',
    '/dashboard/:path*',
    '/issues/:path*'
  ]
}

import { NextResponse, NextRequest } from 'next/server'
import { verifyJWT } from '@/lib/session'
import { ROUTES } from '@/config/routes'

export const proxy = async (request: NextRequest) => {
  const { pathname } = request.nextUrl
  const isProtectedRoute = config.matcher.some(route => pathname.startsWith(route))

  if (!isProtectedRoute) return NextResponse.next()

  const token = request.cookies.get('auth_token')?.value

  if (pathname.startsWith(ROUTES.api.href)) return apiProxy(token)

  if (!token) return NextResponse.redirect(new URL(ROUTES.auth.login.href, request.url))

  const payload = await verifyJWT(token)
  if (!payload) return NextResponse.redirect(new URL(ROUTES.auth.login.href, request.url))

  return NextResponse.next()
}

const apiProxy = async (token: string | undefined) => {
  if (!token) return NextResponse.json(
    { success: false, message: 'Authentication required' },
    { status: 401 }
  )

  const payload = await verifyJWT(token)
  if (!payload) return NextResponse.json(
    { success: false, message: 'Invalid or expired token' },
    { status: 401 }
  )

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/api/:path*',
    '/dashboard/:path*',
    '/issues/:path*',
    '/profile/:path*',
    '/account/:path*'
  ]
}

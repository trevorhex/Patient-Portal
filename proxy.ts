import { NextResponse, NextRequest } from 'next/server'
import { verifyJWT, verifyAuthToken, shouldRefreshToken } from '@/lib/session'
import { ROUTES } from '@/config/routes'

export const proxy = async (req: NextRequest) => {
  const authHeader = req.headers.get('authorization')
  const { pathname } = req.nextUrl
  const isProtectedRoute = config.matcher.some(route => pathname.startsWith(route.replace('/:path*', '')))

  if (!isProtectedRoute) return NextResponse.next()

  if (pathname.startsWith(ROUTES.api.href)) return apiProxy(authHeader)

  const token = req.cookies.get('auth_token')?.value

  if (!token) return NextResponse.redirect(new URL(ROUTES.auth.login.href, req.url))

  const payload = await verifyJWT(token)
  if (!payload) return NextResponse.redirect(new URL(ROUTES.auth.login.href, req.url))

  const shouldRefresh = await shouldRefreshToken(token)
  if (shouldRefresh) {
    const response = NextResponse.next()
    response.headers.set('X-Refresh-Token', 'true')
    return response
  }

  return NextResponse.next()
}

const apiProxy = async (authHeader: string | null) => {
  if (!authHeader) return NextResponse.json(
    { success: false, message: 'Authentication token required' },
    { status: 401 }
  )

  const payload = await verifyAuthToken(authHeader)
  if (!payload) return NextResponse.json(
    { success: false, message: 'Invalid or expired token' },
    { status: 401 }
  )

  const token = authHeader.substring(7)
  const shouldRefresh = await shouldRefreshToken(token)
  if (shouldRefresh) {
    const response = NextResponse.next()
    response.headers.set('X-Token-Refresh-Suggested', 'true')
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/api/issues/:path*',
    '/dashboard/:path*',
    '/issues/:path*',
    '/profile/:path*',
    '/account/:path*'
  ]
}

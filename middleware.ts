import { NextResponse, NextRequest } from 'next/server'
import { headers } from 'next/headers'

export const middleware = async (request: NextRequest) => {
  if (request.nextUrl.pathname.startsWith('/api')) {
    const authHeader = (await headers()).get('Authorization')

    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: 'Authorization header is required' },
        { status: 401 }
      )
    }
  }

  // return NextResponse.next()
  return NextResponse.json({}) // disable api routes
}

export const config = {
  matcher: '/api/:path*'
}

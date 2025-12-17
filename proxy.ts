import { NextResponse, NextRequest } from 'next/server'
import { headers } from 'next/headers'

export const proxy = async (request: NextRequest) => {
  if (request.nextUrl.pathname.startsWith('/api')) {
    const authHeader = (await headers()).get('Authorization')
    // validate authHeader
    return NextResponse.json(
      { success: false, message: 'Authorization header is required' },
      { status: 401 }
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/api/:path*'
}

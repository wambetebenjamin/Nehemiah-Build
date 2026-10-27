import { NextResponse, type NextRequest } from 'next/server'
import { decode } from '@auth/core/jwt'
import { authConfig } from '@/lib/auth.config'

/**
 * Optimistic auth gate for the homeowner area (Next 16 renamed middleware to
 * proxy, and it runs on the Node.js runtime). A valid session cookie lets the
 * request through; anything else is bounced to /login with a return path.
 *
 * This is a redirect helper, not a security boundary: every protected page and
 * every mutating route re-checks the session server side via lib/auth.ts.
 */
const PROTECTED = [/^\/dashboard(\/|$)/, /^\/post-project$/, /^\/quotes$/]

const secureCookie = (url: NextRequest) => url.nextUrl.protocol === 'https:'

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  if (!PROTECTED.some((pattern) => pattern.test(pathname))) return NextResponse.next()

  const cookieName = `${secureCookie(request) ? '__Secure-' : 'authjs.'}session-token`
  const token = request.cookies.get(cookieName)?.value ?? request.cookies.get('authjs.session-token')?.value

  if (token) {
    try {
      const decoded = await decode({
        token,
        secret: process.env.NEXTAUTH_SECRET || 'nehemiah-build-development-secret',
        salt: secureCookie(request) ? cookieName : 'authjs.session-token',
      })
      if (decoded?.email) {
        return NextResponse.next()
      }
    } catch {
      /* fall through to the redirect below */
    }
  }

  const loginUrl = new URL('/login', request.url)
  loginUrl.searchParams.set('callbackUrl', `${pathname}${search}`)
  loginUrl.searchParams.set('reason', 'auth-required')
  return NextResponse.redirect(loginUrl)
}

/** Pages router style matcher: only the homeowner area pays for the check. */
export const config = {
  matcher: ['/dashboard/:path*', '/post-project', '/quotes', '/quotes/:path*'],
}

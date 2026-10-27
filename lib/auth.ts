import NextAuth from 'next-auth'
import type { NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import { authConfig } from '@/lib/auth.config'
import { verifyCredentials, publicUser, DEMO_ACCOUNT } from '@/lib/users'

/**
 * NextAuth v5 (Auth.js) setup for homeowners.
 *
 * Two ways in: email and password against the identity store, or Google OAuth
 * when GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are configured. A demo
 * account is seeded by lib/users.ts so a fresh clone can see a populated
 * dashboard; remove it before production.
 */
const providers: NextAuthConfig['providers'] = [
  Credentials({
    id: 'credentials',
    name: 'Email and password',
    credentials: {
      email: { label: 'Email', type: 'email' },
      password: { label: 'Password', type: 'password' },
    },
    async authorize(raw) {
      const email = String(raw?.email ?? '').trim()
      const password = String(raw?.password ?? '')
      if (!email || !password) return null

      const result = await verifyCredentials(email, password)
      if (!result.ok) return null

      const user = await publicUser(result.user)
      return { id: user.id, name: user.name, email: user.email }
    },
  }),
]

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  )
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers,
  secret: process.env.NEXTAUTH_SECRET || 'nehemiah-build-development-secret',
})

export const demoCredentials = DEMO_ACCOUNT

import type { NextAuthConfig } from 'next-auth'

/**
 * Edge-safe slice of the NextAuth config, imported by proxy.ts. It deliberately
 * contains no database, mail or crypto heavy code so request interception stays
 * cheap; full sign-in logic lives in lib/auth.ts.
 */
export const authConfig = {
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: { strategy: 'jwt' },
  trustHost: true,
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          {
            id: 'google',
            name: 'Google',
            type: 'oauth' as const,
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          },
        ]
      : []),
  ],
  callbacks: {
    jwt({ token, user, trigger, session }: any) {
      if (user) {
        token.id = user.id
        token.name = user.name
        token.email = user.email
      }
      if (trigger === 'update' && session?.name) {
        token.name = session.name
      }
      return token
    },
    session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id ?? token.sub
        session.user.name = token.name ?? session.user.name
        session.user.email = token.email ?? session.user.email
      }
      return session
    },
  },
} satisfies NextAuthConfig

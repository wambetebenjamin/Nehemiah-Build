'use server'

import { redirect } from 'next/navigation'
import { signIn, signOut } from '@/lib/auth'
import { safeTarget } from '@/lib/redirects'

/**
 * Server actions behind the sign in and sign out forms. Keeping the auth call on
 * the server means the browser never sees a secret, and the redirect target stays
 * under our control instead of whatever the query string carries. Every export in
 * this file has to be an async function, which is why the target validator lives
 * in lib/redirects.ts.
 */

/**
 * A failed sign in cannot render a message from a server action without leaking
 * state, so it comes back through the query string: /login?error=..., which the
 * page reads on the next render.
 */
export async function signInWithPassword(formData: FormData): Promise<void> {
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')
  const target = safeTarget(formData.get('callbackUrl'))

  if (!email || !password) {
    redirect(`/login?error=missing&callbackUrl=${encodeURIComponent(target)}`)
  }

  try {
    await signIn('credentials', { email, password, redirectTo: target })
  } catch (error) {
    const name = error instanceof Error ? error.name : ''
    if (name === 'RedirectError') throw error
    redirect(`/login?error=credentials&callbackUrl=${encodeURIComponent(target)}`)
  }

  redirect(target)
}

export async function signOutNow(): Promise<void> {
  await signOut({ redirectTo: '/' })
}

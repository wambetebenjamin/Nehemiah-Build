import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowRight, Info, KeyRound, ShieldCheck } from 'lucide-react'
import { signInWithPassword } from '@/lib/auth-actions'
import { safeTarget } from '@/lib/redirects'
import { auth, demoCredentials } from '@/lib/auth'
import { SITE } from '@/lib/site'
import { PexImage } from '@/components/pex-image'
import { PICTURES } from '@/lib/images'

export const metadata: Metadata = {
  title: 'Sign in',
  description: 'Sign in to your Nehemiah Build account to compare quotes, run your projects and approve milestones.',
  alternates: { canonical: '/login' },
}

const REASONS: Record<string, string> = {
  'auth-required': 'That page belongs to an account. Sign in and we will take you straight back to it.',
  'accept-quote': 'Accepting a quote releases your contact details to one contractor, so it needs an account.',
  'milestone-approval': 'Approving a phase is the step that queues a payment, so we only allow it from a signed in account.',
  review: 'Reviews are limited to homeowners who ran a project here. Sign in and you will be sent back to the profile.',
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const session = await auth()
  const callbackUrl = typeof params.callbackUrl === 'string' ? params.callbackUrl : ''
  const target = safeTarget(callbackUrl)

  if (session?.user) redirect(target)

  const reason = typeof params.reason === 'string' ? REASONS[params.reason] : undefined
  const failed = typeof params.error === 'string' ? params.error : null

  return (
    <section className="section !py-12 sm:!py-16">
      <div className="w-full max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card grid grid-cols-1 overflow-hidden lg:grid-cols-2">
          <div className="relative isolate order-2 min-h-[220px] lg:order-1">
            <PexImage picture={PICTURES.slideBlueprints} alt="" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
            <span className="absolute inset-0 -z-[1] bg-[color:var(--nb-secondary)]/70" aria-hidden="true" />
            <div className="relative flex h-full flex-col justify-between gap-8 p-6 sm:p-10">
              <div>
                <span className="subheading !text-white">Your projects, your quotes</span>
                <h1 className="mb-3 text-[30px] font-black uppercase leading-none text-white sm:text-[38px]">
                  Sign in to {SITE.name}
                </h1>
                <p className="mb-0 max-w-md text-[15px] leading-relaxed text-white/85">
                  The dashboard is where quotes land, where milestone photos are kept, and where your approvals are
                  recorded. Nothing is visible to a contractor until you say so.
                </p>
              </div>
              <ul className="mb-0 grid list-none gap-3 p-0 text-[14px] text-white/85">
                <li className="flex items-start gap-2">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--nb-primary)]" aria-hidden="true" />
                  Your phone number is shared only with the contractor whose quote you accept.
                </li>
                <li className="flex items-start gap-2">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--nb-primary)]" aria-hidden="true" />
                  {SITE.name} never holds your money: milestone payments stay between you and the contractor.
                </li>
              </ul>
            </div>
          </div>

          <div className="order-1 p-6 sm:p-10 lg:order-2">
            {reason ? (
              <p className="mb-5 rounded-[3px] bg-[color:var(--nb-primary)]/10 p-4 text-[14px] leading-relaxed text-[color:var(--gray-dark)]">
                {reason}
              </p>
            ) : null}

            <form action={signInWithPassword} className="max-w-[420px]" noValidate>
              <input type="hidden" name="callbackUrl" value={target} />

              <h2 className="mb-1 flex items-center gap-2 text-[22px] font-bold text-[color:var(--nb-secondary)]">
                <KeyRound className="h-5 w-5 text-[color:var(--nb-primary)]" aria-hidden="true" />
                Email and password
              </h2>
              <p className="mb-6 text-[14px] leading-relaxed text-[color:var(--gray)]">
                No password yet?{' '}
                <Link href="/register" className="font-semibold text-[color:var(--nb-primary)] underline">
                  Create an account in under a minute
                </Link>
                .
              </p>

              <div className="mb-5">
                <label htmlFor="login-email" className="label">
                  Email
                </label>
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="you@example.co.ke"
                  className="field"
                  required
                />
              </div>

              <div className="mb-5">
                <label htmlFor="login-password" className="label">
                  Password
                </label>
                <input
                  id="login-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Your password"
                  className="field"
                  required
                />
                <p className="help">Ten characters or more, with a number.</p>
              </div>

              {failed ? (
                <p role="alert" className="error mb-5">
                  {failed === 'missing'
                    ? 'Enter both your email and your password.'
                    : 'We could not sign you in with those details. Check the address and try again.'}
                </p>
              ) : null}

              <button type="submit" className="btn btn-primary mt-2 inline-flex min-h-[48px] w-full items-center justify-center gap-2 px-6 py-3">
                Sign in
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>

              <p className="mt-4 mb-0 text-[13px] leading-relaxed text-[color:var(--gray)]">
                By signing in you accept our{' '}
                <Link href="/legal/terms" className="underline">
                  terms
                </Link>{' '}
                and{' '}
                <Link href="/legal/privacy-policy" className="underline">
                  privacy notice
                </Link>
                .
              </p>
            </form>

            <div className="mt-8 rounded-[3px] border border-dashed border-black/15 p-4">
              <p className="mb-1 text-[12px] font-bold uppercase tracking-[0.1em] text-[color:var(--gray)]">
                Demo account on this deployment
              </p>
              <p className="mb-0 text-[14px] leading-relaxed text-[color:var(--gray-dark)]">
                {demoCredentials.email} &middot; {demoCredentials.password}
                <br />
                It opens a sample project with milestones already running, so you can see the whole flow.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

'use client'

import Link from 'next/link'
import { AlertTriangle, Home, MessageCircle, PhoneCall, RefreshCw } from 'lucide-react'
import { SITE, WHATSAPP_HREF } from '@/lib/site'

/**
 * Branded error screen (also used by /error). The number that matters is on the
 * page: a homeowner mid build should never have to hunt for a human.
 */
export function ServerErrorPanel({ onRetry, bare = false }: { onRetry?: () => void; bare?: boolean }) {
  return (
    <section className="section">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card mx-auto max-w-2xl p-8 text-center sm:p-14">
          <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[color:var(--nb-primary)]/10 text-[color:var(--nb-primary)]">
            <AlertTriangle className="h-7 w-7" aria-hidden="true" />
          </span>
          <p className="mb-2 text-[13px] font-bold uppercase tracking-[0.18em] text-[color:var(--nb-primary)]">
            Error 500
          </p>
          <h1 className="mb-4 text-[32px] font-black uppercase leading-tight text-[color:var(--nb-secondary)] sm:text-[44px]">
            Something collapsed on our side
          </h1>
          <p className="mb-8 text-[15px] leading-relaxed text-[color:var(--gray)] sm:text-base">
            The page failed to load, not your project. Anything you had already posted or approved is saved. If you are
            mid way through approving a milestone, do not send money again until you can see the milestone status.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
            {onRetry ? (
              <button type="button" onClick={onRetry} className="btn btn-primary w-full sm:w-auto px-6 py-3">
                <RefreshCw className="h-4 w-4" aria-hidden="true" />
                Try again
              </button>
            ) : null}
            <a href={WHATSAPP_HREF} className="btn btn-secondary w-full sm:w-auto px-6 py-3">
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              WhatsApp +{SITE.whatsappNumber}
            </a>
            <a href={`tel:+${SITE.whatsappNumber}`} className="btn btn-ghost w-full sm:w-auto px-6 py-3">
              <PhoneCall className="h-4 w-4" aria-hidden="true" />
              Call the project desk
            </a>
          </div>

          {!bare ? (
            <p className="mt-8 mb-0 text-[13px] text-[color:var(--gray)]">
              Or go back to the{' '}
              <Link href="/" className="inline-flex min-h-[32px] items-center font-semibold text-[color:var(--nb-primary)]">
                <Home className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
                start of {SITE.name}
              </Link>
            </p>
          ) : (
            <p className="mt-8 mb-0 text-[13px] text-[color:var(--gray)]">
              {SITE.name} &middot; {SITE.tagline}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}

export default ServerErrorPanel

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Loader2, LogIn } from 'lucide-react'
import Link from 'next/link'
import type { Quote } from '@/lib/types'
import { useCaptchaForm } from '@/lib/api-client'
import { formatKES, SITE } from '@/lib/site'

/**
 * Accepting a quote is the one action on the page with money attached, so it is
 * captcha protected, needs a signed in homeowner, and never claims a payment has
 * moved: Nehemiah Build records the agreement, the transfer is yours to make.
 */
export function QuoteAcceptButton({
  quote,
  signedIn,
  onChanged,
}: {
  quote: Quote
  signedIn: boolean
  onChanged?: () => void
}) {
  const router = useRouter()
  const [note, setNote] = useState<string | null>(null)
  const { submit, result, pending } = useCaptchaForm<{
    redirectTo?: string
    milestoneDraft?: Array<{ name: string; amount: number }>
    paymentMessage?: string
  }>('quote-accept', '/api/quotes/accept', 'PUT')

  if (quote.status === 'Accepted') {
    return (
      <Link href={`/dashboard/project/${quote.projectSlug}`} className="btn btn-secondary inline-flex min-h-[44px] items-center gap-2 px-4 py-2 text-[13px]">
        <Check className="h-4 w-4" aria-hidden="true" />
        Accepted
      </Link>
    )
  }

  if (quote.status === 'Declined') {
    return <span className="text-[13px] text-[color:var(--gray)]">Declined</span>
  }

  if (!signedIn) {
    return (
      <Link
        href={`/login?callbackUrl=${encodeURIComponent('/quotes')}&reason=accept-quote`}
        className="btn btn-outline inline-flex min-h-[44px] items-center gap-2 px-4 py-2 text-[13px]"
      >
        <LogIn className="h-4 w-4" aria-hidden="true" />
        Sign in to accept
      </Link>
    )
  }

  return (
    <div className="flex flex-col items-stretch gap-2">
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          void submit({ quoteId: quote.id, projectId: quote.projectSlug }).then((response) => {
            if (response.ok) {
              setNote(
                response.data?.paymentMessage
                  ? `${SITE.name} is not a payment processor. ${response.data.paymentMessage}`
                  : 'Recorded. The contractor has been notified.',
              )
              onChanged?.()
              if (response.data?.redirectTo) {
                window.setTimeout(() => router.push(response.data!.redirectTo!), 1400)
              }
            } else {
              setNote(response.message)
            }
          })
        }}
        className="btn btn-primary inline-flex min-h-[44px] items-center justify-center gap-2 px-4 py-2 text-[13px]"
      >
        {pending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Recording
          </>
        ) : (
          <>
            <Check className="h-4 w-4" aria-hidden="true" />
            Accept {formatKES(quote.amount).replace('KES ', '')}
          </>
        )}
      </button>

      {note ? (
        <p role="status" className="mb-0 max-w-[240px] text-[12px] leading-snug text-[color:var(--gray-dark)]">
          {note}
        </p>
      ) : null}
    </div>
  )
}

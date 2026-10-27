'use client'

import { useEffect, useState } from 'react'
import { Check, ShieldCheck, X } from 'lucide-react'
import { useConsentStore, type ConsentCategories } from '@/lib/stores'
import { SITE } from '@/lib/site'
import Link from 'next/link'

/**
 * Bottom fixed, full width cookie banner plus a manage preferences modal,
 * written for the KDPA 2019: consent is asked before anything optional is
 * switched on, Necessary is locked, the choice is stored locally under
 * nehemiah-build-cookie-consent, and it can be changed again from the policy
 * pages.
 */
export function CookieConsent() {
  const [mounted, setMounted] = useState(false)
  const stored = useConsentStore((state) => state.stored)
  const open = useConsentStore((state) => state.openPreferences)
  const acceptAll = useConsentStore((state) => state.acceptAll)
  const rejectOptional = useConsentStore((state) => state.rejectOptional)
  const setOpenPreferences = useConsentStore((state) => state.setOpenPreferences)
  const hydrate = useConsentStore((state) => state.hydrate)

  useEffect(() => {
    hydrate()
    setMounted(true)
  }, [hydrate])

  if (!mounted || stored) return null

  return (
    <>
      <div
        role="region"
        aria-label="Cookie consent"
        className="fixed inset-x-0 bottom-0 z-[9997] border-t border-[color:var(--nb-border)] bg-white/95 pt-6 pb-4 shadow-[0_-12px_36px_-18px_rgba(0,0,0,0.35)] backdrop-blur pb-safe"
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-1 h-6 w-6 shrink-0 text-[color:var(--nb-primary)]" aria-hidden="true" />
              <p className="mb-0 text-[14px] leading-relaxed text-[color:var(--gray-dark)]">
                We use cookies to keep you signed in, remember your project drafts, and understand which contractor
                categories Kenyan homeowners search for most. Only necessary cookies run by default. Read the{' '}
                <Link href="/legal/cookie-policy" className="font-semibold text-[color:var(--nb-primary)] underline">
                  Cookie Policy
                </Link>{' '}
                or the{' '}
                <Link href="/legal/privacy-policy" className="font-semibold text-[color:var(--nb-primary)] underline">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <button type="button" onClick={() => setOpenPreferences(true)} className="btn btn-ghost w-full sm:w-auto">
                Manage Preferences
              </button>
              <button type="button" onClick={rejectOptional} className="btn btn-secondary w-full sm:w-auto">
                Reject Optional
              </button>
              <button type="button" onClick={acceptAll} className="btn btn-primary w-full sm:w-auto">
                Accept All
              </button>
            </div>
          </div>
        </div>
      </div>

      <PreferencesModal open={open} onClose={() => setOpenPreferences(false)} />
    </>
  )
}

function PreferencesModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const categories = useConsentStore((state) => state.categories)
  const save = useConsentStore((state) => state.save)
  const [draft, setDraft] = useState<Omit<ConsentCategories, 'necessary'>>(categories)

  useEffect(() => {
    if (!open) return
    setDraft({ functional: categories.functional, analytics: categories.analytics, marketing: categories.marketing })
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, categories, onClose])

  if (!open) return null

  const rows = [
    {
      key: 'necessary' as const,
      title: 'Necessary',
      text: 'Sign in state, CSRF protection, the milestone forms you fill in, and this consent choice. Cannot be switched off.',
      locked: true,
    },
    {
      key: 'functional' as const,
      title: 'Functional',
      text: 'Remembers your county, the trades you browse, and reopens a half finished project post.',
      locked: false,
    },
    {
      key: 'analytics' as const,
      title: 'Analytics',
      text: 'Anonymous page and completion counts, so we know where homeowners drop off before they get a quote.',
      locked: false,
    },
    {
      key: 'marketing' as const,
      title: 'Marketing',
      text: 'Lets us measure contractor campaigns and avoid promoting trades that are already saturated in your county.',
      locked: false,
    },
  ] as const

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="nb-cookie-modal-title"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className="max-h-[92vh] w-full overflow-y-auto rounded-t-2xl bg-white shadow-[var(--nb-shadow-loader)] sm:max-w-[560px] sm:rounded-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-[color:var(--nb-border)] p-5 sm:p-6">
          <div>
            <h2 id="nb-cookie-modal-title" className="text-[20px] font-bold text-[color:var(--nb-secondary)]">
              Cookie preferences
            </h2>
            <p className="mb-0 mt-1 text-[13px] text-[color:var(--gray)]">
              Choices are stored on this device under nehemiah-build-cookie-consent.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close cookie preferences"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--nb-border)] text-[color:var(--nb-primary)]"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="space-y-4 p-5 sm:p-6">
          {rows.map((row) => {
            const checked = row.locked ? true : Boolean(draft[row.key])
            return (
              <div key={row.key} className="flex items-start justify-between gap-4 border-b border-[color:var(--nb-light)] pb-4">
                <div>
                  <h3 className="text-[15px] font-bold text-[color:var(--nb-secondary)]">{row.title}</h3>
                  <p className="mb-0 mt-1 text-[13px] leading-relaxed text-[color:var(--gray)]">{row.text}</p>
                </div>
                <label className="flex shrink-0 cursor-pointer items-center gap-2">
                  <span className="sr-only">{`Turn ${row.title} cookies ${checked ? 'off' : 'on'}`}</span>
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={checked}
                    disabled={row.locked}
                    onChange={(event) =>
                      setDraft((value) => ({ ...value, [row.key]: event.target.checked }))
                    }
                  />
                  <span
                    aria-hidden="true"
                    className="relative flex h-6 w-11 items-center rounded-full bg-[color:var(--nb-border)] px-1 transition-colors peer-checked:bg-[color:var(--nb-primary)] peer-disabled:opacity-70"
                  >
                    <span
                      className={`flex h-4 w-4 items-center justify-center rounded-full bg-white transition-transform ${
                        checked ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    >
                      {checked ? <Check className="h-3 w-3 text-[color:var(--nb-primary)]" aria-hidden="true" /> : null}
                    </span>
                  </span>
                </label>
              </div>
            )
          })}
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-[color:var(--nb-border)] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <p className="mb-0 text-[12px] text-[color:var(--gray)]">
            Withdraw any time from {SITE.name}&rsquo;s cookie policy page.
          </p>
          <div className="flex flex-col-reverse gap-3 sm:flex-row">
            <button type="button" onClick={onClose} className="btn btn-ghost w-full sm:w-auto">
              Cancel
            </button>
            <button
              type="button"
              onClick={() => save({ functional: draft.functional, analytics: draft.analytics, marketing: draft.marketing })}
              className="btn btn-primary w-full sm:w-auto"
            >
              Save choices
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CookieConsent

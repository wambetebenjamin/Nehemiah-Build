'use client'

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { useCaptchaStore } from '@/lib/stores'

/**
 * reCAPTCHA v3 (invisible) wired to every form on the site.
 *
 * - The v3 api is loaded only when NEXT_PUBLIC_RECAPTCHA_SITE_KEY exists; with
 *   no key configured the helpers resolve to an empty token and the server
 *   skips verification, so the product stays usable in development.
 * - A visible v2 checkbox is rendered on demand when the server reports a v3
 *   score below 0.5 (see components/captcha-challenge.tsx).
 */

type Win = Window & {
  grecaptcha?: {
    ready: (cb: () => void) => void
    execute: (siteKey: string, options: { action: string }) => Promise<string>
    render: (
      container: HTMLElement,
      options: {
        sitekey: string
        callback: (token: string) => void
        'expired-callback'?: () => void
        theme?: 'light' | 'dark'
        size?: 'normal' | 'compact' | 'invisible'
      },
    ) => number
    reset: (widgetId?: number) => void
  }
  __nbRecaptchaV3?: Promise<void>
  __nbRecaptchaV2?: Promise<void>
}

const w = () => window as Win

export function loadV3(siteKey: string): Promise<void> {
  const win = w()
  if (win.__nbRecaptchaV3) return win.__nbRecaptchaV3
  win.__nbRecaptchaV3 = new Promise<void>((resolve, reject) => {
    const start = () => {
      const script = document.createElement('script')
      script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}`
      script.async = true
      script.defer = true
      script.onload = () => resolve()
      script.onerror = () => reject(new Error('recaptcha-v3-load-failed'))
      document.head.appendChild(script)
    }
    if (win.grecaptcha) resolve()
    else start()
  })
  return win.__nbRecaptchaV3
}

export function loadV2(siteKey: string): Promise<void> {
  const win = w()
  if (win.__nbRecaptchaV2) return win.__nbRecaptchaV2
  win.__nbRecaptchaV2 = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = `https://www.google.com/recaptcha/api.js?onload=__nbRecaptchaV2Onload&render=explicit`
    script.async = true
    script.defer = true
    ;(win as unknown as Record<string, () => void>).__nbRecaptchaV2Onload = () => resolve()
    script.onerror = () => reject(new Error('recaptcha-v2-load-failed'))
    window.setTimeout(() => {
      if (win.grecaptcha) resolve()
    }, 2500)
    document.head.appendChild(script)
  })
  return win.__nbRecaptchaV2
}

export function RecaptchaProvider({
  siteKey,
  children,
}: {
  siteKey: string | null
  children: ReactNode
}) {
  const configure = useCaptchaStore((state) => state.configure)
  const mounted = useRef(false)

  useEffect(() => {
    if (mounted.current) return
    mounted.current = true

    if (!siteKey) {
      configure({ siteKey: null, execute: async () => '' })
      return
    }

    void loadV3(siteKey).catch(() => {
      /* offline or blocked: execute() below resolves empty and the server skips */
    })

    configure({
      siteKey,
      execute: async (action: string) => {
        try {
          await loadV3(siteKey)
          const grecaptcha = w().grecaptcha
          if (!grecaptcha) return ''
          return await new Promise<string>((resolve) => {
            let settled = false
            const finish = (value: string) => {
              if (settled) return
              settled = true
              resolve(value)
            }
            grecaptcha.ready(() => {
              grecaptcha
                .execute(siteKey, { action })
                .then((token) => finish(token))
                .catch(() => finish(''))
            })
            window.setTimeout(() => finish(''), 6000)
          })
        } catch {
          return ''
        }
      },
    })
  }, [siteKey, configure])

  return <>{children}</>
}

/** Grab a fresh v3 token for an action. Returns '' when captcha is disabled. */
export function useCaptchaToken() {
  const execute = useCaptchaStore((state) => state.execute)
  return useCallback(
    async (action: string) => {
      if (!execute) return ''
      return execute(action)
    },
    [execute],
  )
}

export function useCaptchaSiteKey(): string | null {
  return useCaptchaStore((state) => state.siteKey)
}

/**
 * Renders the explicit v2 checkbox used as the low-score fallback. Mount it
 * whenever `active` is true; the token is handed back through onChange.
 */
export function RecaptchaV2Widget({
  active,
  onChange,
}: {
  active: boolean
  onChange: (token: string) => void
}) {
  const siteKey = useCaptchaSiteKey()
  const hostRef = useRef<HTMLDivElement | null>(null)
  const widgetRef = useRef<number | null>(null)
  const [state, setState] = useState<'idle' | 'loading' | 'ready' | 'unavailable'>('idle')

  useEffect(() => {
    if (!active || !siteKey) return
    let cancelled = false
    setState('loading')

    void loadV2(siteKey)
      .then(() => {
        if (cancelled || !hostRef.current) return
        const grecaptcha = w().grecaptcha
        if (!grecaptcha) {
          setState('unavailable')
          return
        }
        grecaptcha.ready(() => {
          if (cancelled || !hostRef.current) return
          hostRef.current.innerHTML = ''
          widgetRef.current = grecaptcha.render(hostRef.current, {
            sitekey: siteKey,
            theme: 'light',
            size: 'normal',
            callback: (token: string) => onChange(token),
            'expired-callback': () => onChange(''),
          })
          setState('ready')
        })
      })
      .catch(() => {
        if (!cancelled) setState('unavailable')
      })

    return () => {
      cancelled = true
    }
  }, [active, siteKey, onChange])

  if (!active || !siteKey) return null

  return (
    <div
      className="rounded-[3px] border border-[color:var(--nb-border)] bg-[color:var(--nb-light)] p-4"
      role="group"
      aria-label="Confirm you are not a robot"
    >
      <p className="mb-3 text-[13px] leading-relaxed text-[color:var(--gray-dark)]">
        Our automated check could not confirm this submission was human, so please tick the box below.
      </p>
      <div ref={hostRef} className="min-h-[78px]" />
      {state === 'loading' && (
        <p className="help">Loading the captcha. If it does not appear, check your network and reload.</p>
      )}
      {state === 'unavailable' && (
        <p className="error">
          The captcha service could not be reached. Please reload the page, or send your request on WhatsApp and we
          will pick it up from there.
        </p>
      )}
    </div>
  )
}

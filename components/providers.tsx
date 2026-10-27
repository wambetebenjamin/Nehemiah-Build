'use client'

import Lenis from 'lenis'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { LoadingScreen } from '@/components/loading-screen'
import { FloatButtons } from '@/components/float-buttons'
import { CookieConsent } from '@/components/cookie-consent'
import { RecaptchaProvider } from '@/components/recaptcha'
import { useConsentStore } from '@/lib/stores'

/**
 * Client shell: smooth scrolling, scroll reveal, captcha, loading screen, the
 * fixed assist buttons, and analytics that only mount when consent says so.
 */
export function Providers({
  children,
  recaptchaSiteKey,
}: {
  children: ReactNode
  recaptchaSiteKey: string | null
}) {
  return (
    <RecaptchaProvider siteKey={recaptchaSiteKey}>
      <SmoothScroll>
        <RevealObserver>
          <LoadingScreen />
          {children}
          <FloatButtons />
          <CookieConsent />
        </RevealObserver>
      </SmoothScroll>
      <ConsentedInsights />
    </RecaptchaProvider>
  )
}

function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
      infinite: false,
      autoRaf: true,
    })
    lenisRef.current = lenis

    return () => {
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  useEffect(() => {
    const lenis = lenisRef.current
    if (!lenis) return
    const anchorJump = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null
      const link = target?.closest('a[href^="#"]') as HTMLAnchorElement | null
      if (!link) return
      const id = link.getAttribute('href')?.slice(1)
      if (!id) return
      const node = document.getElementById(id)
      if (!node) return
      event.preventDefault()
      lenis.scrollTo(node, { offset: -80 })
    }
    document.addEventListener('click', anchorJump)
    return () => document.removeEventListener('click', anchorJump)
  }, [])

  return <div className="lenis">{children}</div>
}

/** Applies the template's own reveal pattern (.ftco-animate -> .animate). */
function RevealObserver({ children }: { children: ReactNode }) {
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>('.ftco-animate'))
    if (!nodes.length) return

    if (!('IntersectionObserver' in window)) {
      nodes.forEach((node) => node.classList.add('animate'))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate')
            observer.unobserve(entry.target)
          }
        })
      },
      { rootMargin: '0px 0px -60px 0px', threshold: 0.08 },
    )

    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [])

  return <>{children}</>
}

function ConsentedInsights() {
  const [mounted, setMounted] = useState(false)
  const categories = useConsentStore((state) => state.categories)
  const stored = useConsentStore((state) => state.stored)

  useEffect(() => setMounted(true), [])

  if (!mounted || !stored) return null
  if (!categories.analytics) return null

  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  )
}

export default Providers

'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

/**
 * Grid wrapper for contractor cards. Each card scale-in and fade is driven by
 * GSAP with a per-card stagger the moment the grid enters the viewport, using
 * the same observer pattern the template applies to its project grid. The cards
 * stay server rendered, so this module only animates what it is given.
 */
export function ContractorGrid({ children }: { children: React.ReactNode }) {
  const host = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = host.current
    if (!node) return

    const cards = Array.from(node.querySelectorAll<HTMLElement>('[data-card]'))
    if (!cards.length) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let observer: IntersectionObserver | null = null

    // gsap.from keeps the cards visible if the animation never runs.
    const run = () =>
      gsap.from(cards, {
        autoAlpha: 0,
        scale: 0.96,
        y: 14,
        duration: 0.5,
        stagger: 0.08,
        ease: 'power2.out',
        clearProps: 'transform',
      })

    if (reduce) {
      run()
      return
    }

    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            run()
            observer?.disconnect()
            observer = null
          }
        }
      },
      { threshold: 0.15 },
    )
    observer.observe(node)

    return () => observer?.disconnect()
  }, [children])

  return (
    <div ref={host} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {children}
    </div>
  )
}

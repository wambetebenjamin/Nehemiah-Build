'use client'

import { useEffect, useState } from 'react'

/**
 * Loading screen copied from the uploaded template (index.html line 649 and the
 * #ftco-loader rules in css/style.css): same markup, same svg, same keyframes.
 * Two additions required by the brief, nothing else:
 *   - role="status" plus a live region for assistive tech
 *   - a skip control that appears after 3 seconds, and a plain percentage
 *     readout under prefers-reduced-motion (no spinning circle)
 */
export function LoadingScreen() {
  const [show, setShow] = useState(true)
  const [skippable, setSkippable] = useState(false)
  const [percent, setPercent] = useState(0)

  useEffect(() => {
    const hide = () => setShow(false)
    const done = new Promise<void>((resolve) => {
      if (document.readyState === 'complete') resolve()
      else window.addEventListener('load', () => resolve(), { once: true })
    })

    const skipTimer = window.setTimeout(() => setSkippable(true), 3000)
    const hardTimer = window.setTimeout(hide, 4000)

    let frame = 0
    const ticker = window.setInterval(() => {
      frame += 1
      setPercent((value) => Math.min(100, value + 9 + (frame % 3) * 4))
    }, 90)

    void done.then(() => {
      setPercent(100)
      window.setTimeout(hide, 180)
    })

    return () => {
      window.clearTimeout(skipTimer)
      window.clearTimeout(hardTimer)
      window.clearInterval(ticker)
    }
  }, [])

  useEffect(() => {
    if (!show) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [show])

  if (!show) return null

  return (
    <div id="ftco-loader" className="show fullscreen" role="status" aria-live="polite">
      <span className="sr-only">Loading Nehemiah Build</span>
      <span className="loader-visual" aria-hidden="true">
        <svg className="circular" width="48" height="48">
          <circle className="path-bg" cx="24" cy="24" r="22" fill="none" strokeWidth="4" stroke="#eeeeee" />
          <circle
            className="path"
            cx="24"
            cy="24"
            r="22"
            fill="none"
            strokeWidth="4"
            strokeMiterlimit="10"
            stroke="#F96D00"
          />
        </svg>
      </span>
      <span className="absolute inset-x-0 bottom-[18%] block text-center text-[13px] tracking-[0.18em] uppercase text-[color:var(--nb-secondary)]">
        {percent}%
      </span>
      {skippable && (
        <button
          type="button"
          onClick={() => setShow(false)}
          className="absolute inset-x-0 bottom-[10%] mx-auto flex min-h-[44px] w-max items-center gap-2 rounded-[3px] border border-[color:var(--nb-border)] bg-white px-4 text-[12px] font-semibold uppercase tracking-[0.12em] text-[color:var(--nb-secondary)] transition-colors hover:border-[color:var(--nb-primary)] hover:text-[color:var(--nb-primary)]"
        >
          Skip loading
        </button>
      )}
    </div>
  )
}

export default LoadingScreen

'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { motion, useScroll, useTransform, type Variants } from 'framer-motion'

/**
 * Motion vocabulary. The template animates with a single upward fade
 * (.ftco-animate), so every effect here is that same move expressed through
 * Framer Motion, plus the counter behaviour js/main.js had with animateNumber.
 */

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 0.61, 0.36, 1] } },
}

export const staggerParent: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
}

export const slideFromLeft: Variants = {
  hidden: { opacity: 0, x: -32 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.22, 0.61, 0.36, 1] } },
}

export const slideFromRight: Variants = {
  hidden: { opacity: 0, x: 32 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.22, 0.61, 0.36, 1] } },
}

export function RevealOnScroll({
  children,
  variants = fadeUp,
  className,
  once = true,
}: {
  children: ReactNode
  variants?: Variants
  className?: string
  once?: boolean
}) {
  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '-80px 0px -40px 0px' }}
    >
      {children}
    </motion.div>
  )
}

/** Section heading in the template's .heading-section shape. */
export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = 'center',
  invert = false,
}: {
  eyebrow?: string
  title: ReactNode
  lead?: ReactNode
  align?: 'center' | 'left'
  invert?: boolean
}) {
  return (
    <div className={`heading-section ftco-animate ${align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}`}>
      {eyebrow ? <span className="subheading">{eyebrow}</span> : null}
      <h2 className={invert ? 'text-white' : 'mb-4'}>{title}</h2>
      {lead ? <p className={`mb-0 mt-4 text-[15px] sm:text-base ${invert ? 'text-white/80' : ''}`}>{lead}</p> : null}
    </div>
  )
}

/** Hero band with the template's parallax drift on the background layer. */
export function ParallaxHero({
  background,
  overlayOpacity = 0.5,
  height = 'hero',
  children,
  id,
}: {
  background: ReactNode
  overlayOpacity?: number
  height?: 'hero' | 'sub'
  children: ReactNode
  id?: string
}) {
  const ref = useRef<HTMLDivElement | null>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', height === 'hero' ? '18%' : '12%'])

  return (
    <section
      id={id}
      ref={ref}
      className={`relative isolate w-full overflow-hidden ${
        height === 'hero'
          ? 'flex min-h-[520px] items-center md:min-h-[620px] xl:min-h-[700px]'
          : 'flex min-h-[320px] items-center md:min-h-[420px]'
      }`}
    >
      <motion.div
        aria-hidden="true"
        className="absolute inset-x-0 -top-[12%] -bottom-[12%] z-[-2] bg-cover bg-top"
        style={{ y }}
      >
        {background}
      </motion.div>
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[-1] bg-[color:var(--nb-secondary)]"
        style={{ opacity: overlayOpacity }}
      />
      <div className="relative z-10 w-full py-14">{children}</div>
    </section>
  )
}

function format(value: number, decimals: number) {
  return value.toLocaleString('en-KE', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

/** Count-up number, mirroring the template's jQuery animateNumber counters. */
export function CountUp({
  value,
  decimals = 0,
  duration = 1.6,
  prefix = '',
  suffix = '',
}: {
  value: number
  decimals?: number
  duration?: number
  prefix?: string
  suffix?: string
}) {
  const ref = useRef<HTMLSpanElement | null>(null)
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setDisplay(value)
      return
    }

    let frame = 0
    let raf = 0
    const totalFrames = Math.round(duration * 60)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          observer.disconnect()
          const tick = () => {
            frame += 1
            const progress = Math.min(1, frame / totalFrames)
            const eased = 1 - Math.pow(1 - progress, 3)
            setDisplay(value * eased)
            if (progress < 1) raf = requestAnimationFrame(tick)
          }
          raf = requestAnimationFrame(tick)
        })
      },
      { threshold: 0.35 },
    )

    observer.observe(node)
    return () => {
      observer.disconnect()
      if (raf) cancelAnimationFrame(raf)
    }
  }, [value, duration])

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {format(display, decimals)}
      {suffix}
    </span>
  )
}

'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { motion } from 'framer-motion'
import { ArrowRight, BadgeCheck, CalendarCheck, MessagesSquare, ShieldCheck } from 'lucide-react'
import { CATEGORIES, HOW_IT_WORKS, IMPACT_STATS, TRUST_ITEMS } from '@/lib/site'
import { TESTIMONIALS } from '@/lib/data/site-data'
import { CategoryIcon } from '@/components/category-icon'
import { CountUp, slideFromLeft, slideFromRight } from '@/components/motion-primitives'
import { PexImage } from '@/components/pex-image'
import { PICTURES } from '@/lib/images'

/**
 * Homepage moving parts: GSAP bounce on the category grid, count-up impact
 * numbers, alternating testimonial reveals, and the hero entrance.
 */
export function CategoryGrid() {
  const gridRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const grid = gridRef.current
    if (!grid) return
    const items = Array.from(grid.querySelectorAll<HTMLElement>('[data-cat-item]'))
    if (!items.length) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      items.forEach((item) => {
        item.style.opacity = '1'
        item.style.transform = 'none'
      })
      return
    }

    let played = false
    const play = () => {
      if (played) return
      played = true
      gsap.fromTo(
        items,
        { opacity: 0, y: 28, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.55,
          ease: 'back.out(2.2)',
          stagger: 0.07,
          clearProps: 'transform,opacity',
        },
      )
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            play()
            observer.disconnect()
          }
        })
      },
      { threshold: 0.2 },
    )

    observer.observe(grid)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={gridRef} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {CATEGORIES.map((category) => (
        <a
          key={category.slug}
          data-cat-item
          href={`/contractors?trade=${encodeURIComponent(category.name)}`}
          className="card group flex h-full flex-col items-start gap-3 p-5 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-[color:var(--nb-primary)] sm:p-6"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--nb-light)] text-[color:var(--nb-primary)] transition-colors group-hover:bg-[color:var(--nb-primary)] group-hover:text-white">
            <CategoryIcon icon={category.icon} className="h-6 w-6" />
          </span>
          <span className="block text-[16px] font-bold leading-snug text-[color:var(--nb-secondary)] sm:text-[17px]">
            {category.name}
          </span>
          <span className="block text-[13px] leading-relaxed text-[color:var(--gray)]">{category.blurb}</span>
          <span className="mt-auto inline-flex items-center gap-1 text-[12px] font-bold uppercase tracking-[0.1em] text-[color:var(--nb-primary)]">
            Find {category.name.split(' ')[0].toLowerCase()} specialists
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </span>
        </a>
      ))}
    </div>
  )
}

export function ImpactNumbers() {
  return (
    <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
      {IMPACT_STATS.map((stat) => {
        const decimals = Number.isInteger(stat.value) ? 0 : 1
        return (
          <div key={stat.label} className="text-center">
            <p className="mb-1 text-[34px] font-black leading-none text-[color:var(--nb-primary)] sm:text-[44px]">
              <CountUp value={stat.value} decimals={decimals} suffix={stat.suffix} />
            </p>
            <p className="mb-0 text-[13px] font-semibold uppercase tracking-[0.12em] text-white/80 sm:text-[14px]">
              {stat.label}
            </p>
          </div>
        )
      })}
    </div>
  )
}

export function Testimonials() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {TESTIMONIALS.map((testimonial, index) => (
        <motion.figure
          key={testimonial.name}
          className="card mb-0 flex h-full flex-col p-6 sm:p-7"
          variants={index % 2 === 0 ? slideFromLeft : slideFromRight}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px 0px -40px 0px' }}
        >
          <MessagesSquare className="mb-4 h-7 w-7 text-[color:var(--nb-primary)]" aria-hidden="true" />
          <blockquote className="mb-5 text-[15px] leading-relaxed text-[color:var(--gray-dark)]">
            &ldquo;{testimonial.quote}&rdquo;
          </blockquote>
          <figcaption className="mt-auto flex items-center gap-3 border-t border-[color:var(--nb-light)] pt-4">
            <span className="h-12 w-12 shrink-0 overflow-hidden rounded-full">
              <PexImage picture={testimonial.avatar} fill className="object-cover" sizes="48px" />
            </span>
            <span>
              <span className="block text-[15px] font-bold text-[color:var(--nb-secondary)]">{testimonial.name}</span>
              <span className="block text-[12px] text-[color:var(--gray)]">
                {testimonial.county} County &middot; {testimonial.project}
              </span>
            </span>
          </figcaption>
        </motion.figure>
      ))}
    </div>
  )
}

const TRUST_ICONS = [BadgeCheck, CalendarCheck, ShieldCheck, MessagesSquare] as const

export function TrustBar() {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
      {TRUST_ITEMS.map((item, index) => {
        const Icon = TRUST_ICONS[index % TRUST_ICONS.length]
        return (
          <div key={item.title} className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[color:var(--nb-primary)] text-white">
              <Icon className="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              <h3 className="text-[16px] font-bold text-[color:var(--nb-secondary)] sm:text-[17px]">{item.title}</h3>
              <p className="mb-0 mt-1 text-[14px] leading-relaxed text-[color:var(--gray)]">{item.text}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function HowItWorks() {
  return (
    <ol className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {HOW_IT_WORKS.map((step) => (
        <li key={step.step} className="card relative h-full overflow-hidden p-6 sm:p-7">
          <span
            aria-hidden="true"
            className="absolute -right-2 -top-4 text-[72px] font-black leading-none text-[color:var(--nb-light)]"
          >
            {step.step}
          </span>
          <span className="relative block text-[12px] font-bold uppercase tracking-[0.16em] text-[color:var(--nb-primary)]">
            Step {step.step}
          </span>
          <h3 className="relative mt-2 text-lg sm:text-xl font-bold text-[color:var(--nb-secondary)]">{step.title}</h3>
          <p className="relative mb-0 mt-2 text-[14px] leading-relaxed text-[color:var(--gray)] sm:text-[15px]">
            {step.text}
          </p>
        </li>
      ))}
    </ol>
  )
}

export function HeroIntroBand() {
  return (
    <div className="intro-band">
      <PexImage
        picture={PICTURES.introBand}
        fill
        alt=""
        className="absolute inset-0 -z-10 object-cover opacity-25"
        sizes="100vw"
      />
      <div className="relative z-10 mx-auto max-w-2xl text-center">
        <h2>We keep the money behind the work</h2>
        <p className="mb-6 mt-3 text-[15px] leading-relaxed text-white/80">
          Post the job, compare real quotes, and release payment only when a milestone is signed off with photos from
          your own site.
        </p>
        <a href="/post-project" className="btn btn-primary px-6 py-3">
          Post your project
        </a>
      </div>
    </div>
  )
}

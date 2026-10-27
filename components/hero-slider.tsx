'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Pause, Play } from 'lucide-react'
import { PexImage } from '@/components/pex-image'
import type { PictureSpec } from '@/lib/images'

export type Slide = {
  id: string
  eyebrow: string
  title: string
  text: string
  href: string
  cta: string
  picture: PictureSpec
}

const INTERVAL_MS = 6000

/**
 * Home slider. The template drives its hero with an owl carousel; that plugin is
 * not shipped with this build, so the same markup and the same visual rules
 * (.hero-wrap background, .overlay tint, .slider-text content, .bread heading)
 * are driven by a small interval instead. Autoplay pauses on hover, on focus
 * inside the slide, and whenever the visitor prefers reduced motion.
 */
export function HeroSlider({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const host = useRef<HTMLDivElement>(null)

  const go = useCallback((next: number, total: number) => {
    setIndex(((next % total) + total) % total)
  }, [])

  const reduce =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const running = !paused && !reduce && slides.length > 1

  useEffect(() => {
    if (!running) return
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % slides.length), INTERVAL_MS)
    return () => window.clearInterval(timer)
  }, [running, slides.length])

  useEffect(() => {
    const node = host.current
    if (!node) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') go(index + 1, slides.length)
      if (event.key === 'ArrowLeft') go(index - 1, slides.length)
    }
    node.addEventListener('keydown', onKey)
    return () => node.removeEventListener('keydown', onKey)
  }, [go, index, slides.length])

  if (!slides.length) return null

  return (
    <div
      ref={host}
      className="nb-slider"
      role="region"
      aria-roledescription="carousel"
      aria-label="What Nehemiah Build does"
      tabIndex={0}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {slides.map((slide, slideIndex) => (
        <div
          key={slide.id}
          className="nb-slider__slide"
          data-active={slideIndex === index}
          aria-hidden={slideIndex === index ? undefined : true}
        >
          <PexImage
            picture={slide.picture}
            alt={slide.picture.alt}
            fill
            priority={slideIndex === 0}
            sizes="100vw"
            className="object-cover"
          />
          <span className="nb-slider__tint" aria-hidden="true" />

          <div className="relative z-[2] flex min-h-[420px] items-center py-20 md:min-h-[560px] lg:min-h-[660px]">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="slider-text max-w-2xl">
                <p className="breadcrumbs mb-3">{slide.eyebrow}</p>
                <h1 className={`bread ${slideIndex === index ? 'is-current' : ''}`}>{slide.title}</h1>
                <p className="mb-7 max-w-xl text-[15px] leading-relaxed text-white/85 sm:text-[17px]">{slide.text}</p>
                <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                  <Link href={slide.href} className="btn btn-primary w-full sm:w-auto px-6 py-3">
                    {slide.cta}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                  <Link href="/contractors" className="btn btn-white w-full sm:w-auto px-6 py-3">
                    Browse contractors
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="nb-slider__nav">
        {slides.map((slide, dotIndex) => (
          <button
            key={slide.id}
            type="button"
            className="nb-slider__dot"
            aria-current={dotIndex === index}
            aria-label={`Show slide ${dotIndex + 1}: ${slide.eyebrow}`}
            onClick={() => go(dotIndex, slides.length)}
          />
        ))}
        <button
          type="button"
          className="float-button !static !h-11 !w-11 !rounded-full !bg-white/15 !text-white backdrop-blur-[2px]"
          onClick={() => setPaused((value) => !value)}
          aria-label={paused ? 'Resume the slider' : 'Pause the slider'}
        >
          {paused ? <Play className="h-4 w-4" aria-hidden="true" /> : <Pause className="h-4 w-4" aria-hidden="true" />}
        </button>
      </div>
    </div>
  )
}

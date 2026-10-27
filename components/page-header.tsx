import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { PexImage } from '@/components/pex-image'
import type { PictureSpec } from '@/lib/images'

/**
 * Interior page banner, the template's .hero-wrap.hero-wrap-2 with its
 * .breadcrumbs / .bread treatment: dark scrim over a full bleed photo, uppercase
 * heading, small caps trail above it.
 */
export function PageHeader({
  eyebrow,
  title,
  intro,
  picture,
  crumbs = [],
  children,
}: {
  eyebrow?: string
  title: string
  intro?: string
  picture: PictureSpec
  crumbs?: Array<{ label: string; href?: string }>
  children?: React.ReactNode
}) {
  return (
    <section className="hero-wrap hero-wrap-2">
      <PexImage picture={picture} alt={picture.alt} fill priority sizes="100vw" className="object-cover" />
      <div className="overlay" aria-hidden="true" />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="slider-text max-w-3xl">
          {eyebrow ? <span className="subheading">{eyebrow}</span> : null}
          <h1 className="bread mb-4">{title}</h1>
          {intro ? (
            <p className="mb-6 max-w-2xl text-[15px] leading-relaxed text-white/85 sm:text-[17px]">{intro}</p>
          ) : null}

          <nav aria-label="Breadcrumb">
            <ol className="breadcrumbs mb-0 flex flex-wrap items-center gap-x-2 gap-y-1 list-none p-0">
              <li>
                <Link href="/" className="inline-flex min-h-[32px] items-center gap-1">
                  Home
                </Link>
              </li>
              {crumbs.map((crumb) => (
                <li key={crumb.label} className="flex items-center gap-2">
                  <ChevronRight className="h-3 w-3 opacity-60" aria-hidden="true" />
                  {crumb.href ? (
                    <Link href={crumb.href} className="inline-flex min-h-[32px] items-center">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span aria-current="page" className="text-white">
                      {crumb.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>

          {children ? <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:gap-4">{children}</div> : null}
        </div>
      </div>
    </section>
  )
}

/** Standard content band, the template's .ftco-section rhythm. */
export function Section({
  children,
  tone = 'white',
  className = '',
  id,
}: {
  children: React.ReactNode
  tone?: 'white' | 'light' | 'dark'
  className?: string
  id?: string
}) {
  const background =
    tone === 'light'
      ? 'bg-[color:var(--nb-light)]'
      : tone === 'dark'
        ? 'bg-[color:var(--nb-secondary)] text-white'
        : 'bg-white'
  return (
    <section id={id} className={`section ${background} ${className}`}>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  )
}

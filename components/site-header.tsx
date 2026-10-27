import Link from 'next/link'
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Twitter } from 'lucide-react'
import { auth, signOut } from '@/lib/auth'
import { NAV_LINKS, SITE, WHATSAPP_HREF } from '@/lib/site'
import { NavControls } from '@/components/mobile-nav'

/**
 * Header rebuilt from the template's three row structure in index.html: a thin
 * top bar (email, social, primary action), a brand row (icon wordmark, call
 * card, location card), and the dark navbar that carries the nav links.
 */
export async function SiteHeader() {
  const session = await auth()
  const user = session?.user

  return (
    <header className="relative z-30">
      <div className="bg-[color:var(--nb-light)] py-3">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="mb-0 flex items-center gap-2 text-[13px] text-[color:var(--gray-dark)]">
              <Mail className="h-4 w-4 text-[color:var(--nb-primary)]" aria-hidden="true" />
              <a href="mailto:hello@nehemia.build" className="hover:text-[color:var(--nb-primary)]">
                hello@nehemia.build
              </a>
            </p>

            <div className="flex items-center justify-between gap-4 sm:justify-end">
              <div className="flex items-center gap-1">
                {[
                  { label: 'Facebook', href: 'https://www.facebook.com/', Icon: Facebook },
                  { label: 'X', href: 'https://x.com/', Icon: Twitter },
                  { label: 'Instagram', href: 'https://www.instagram.com/', Icon: Instagram },
                  { label: 'LinkedIn', href: 'https://www.linkedin.com/', Icon: Linkedin },
                ].map(({ label, href, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={`${SITE.name} on ${label}`}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/70 text-[color:var(--nb-primary)] transition-colors hover:bg-[color:var(--nb-primary)] hover:text-white"
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </a>
                ))}
              </div>

              <div className="flex items-center gap-2">
                {user ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="text-[13px] font-semibold uppercase tracking-wide text-[color:var(--nb-secondary)] hover:text-[color:var(--nb-primary)]"
                    >
                      Dashboard
                    </Link>
                    <form
                      action={async () => {
                        'use server'
                        await signOut({ redirectTo: '/' })
                      }}
                    >
                      <button type="submit" className="btn btn-ghost !min-h-[36px] !px-3 !py-1 !text-[12px]">
                        Sign out
                      </button>
                    </form>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="text-[13px] font-semibold uppercase tracking-wide text-[color:var(--nb-secondary)] hover:text-[color:var(--nb-primary)]"
                    >
                      Sign in
                    </Link>
                    <Link href="/register" className="btn btn-primary !min-h-[36px] !px-3 !py-1 !text-[12px]">
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-6 sm:py-8">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <Link href="/" className="flex items-center gap-3" aria-label={`${SITE.name} home`}>
              <span
                className="flaticon flaticon-crane text-[34px] leading-none text-[color:var(--nb-primary)]"
                aria-hidden="true"
              />
              <span className="text-[24px] font-black uppercase leading-none text-[color:var(--nb-secondary)]">
                {SITE.name}
                <span className="mt-1 block text-[11px] font-normal normal-case tracking-[0.16em] text-[color:var(--gray)]">
                  {SITE.tagline}
                </span>
              </span>
            </Link>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[color:var(--nb-light)] text-[color:var(--nb-primary)]">
                  <Phone className="h-5 w-5" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-[12px] uppercase tracking-[0.12em] text-[color:var(--gray)]">
                    Project desk
                  </span>
                  <a
                    href={WHATSAPP_HREF}
                    className="block text-[15px] font-bold text-[color:var(--nb-secondary)] hover:text-[color:var(--nb-primary)]"
                  >
                    +{SITE.whatsappNumber}
                  </a>
                </span>
              </div>

              <div className="flex items-center gap-3 sm:border-l sm:border-[color:var(--nb-border)] sm:pl-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[color:var(--nb-light)] text-[color:var(--nb-primary)]">
                  <MapPin className="h-5 w-5" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-[12px] uppercase tracking-[0.12em] text-[color:var(--gray)]">
                    Where we work
                  </span>
                  <span className="block text-[15px] font-bold text-[color:var(--nb-secondary)]">
                    All 47 counties, from Nairobi to Turkana
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <nav aria-label="Main" className="sticky top-0 z-40 bg-[color:var(--nb-secondary)] shadow-[0_6px_24px_-12px_rgba(0,0,0,0.45)]">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <NavLinks links={NAV_LINKS.map((link) => ({ href: link.href, label: link.label }))} />
        </div>
      </nav>
    </header>
  )
}

async function NavLinks({ links }: { links: ReadonlyArray<{ href: string; label: string }> }) {
  const session = await auth()
  return (
    <NavControls
      links={[...links, { href: '/contractor-apply', label: 'For Contractors' }]}
      signedIn={Boolean(session?.user)}
      name={session?.user?.name ?? null}
    />
  )
}

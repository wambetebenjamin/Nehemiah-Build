'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'

type NavItem = { href: string; label: string }

/**
 * Navbar controls: desktop links (hidden below md, per the template's own
 * collapse point), plus the hamburger panel used under md.
 */
export function NavControls({
  links,
  signedIn,
  name,
}: {
  links: NavItem[]
  signedIn: boolean
  name: string | null
}) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href))

  return (
    <div className="flex items-center justify-between gap-3 py-1">
      <ul className="hidden md:flex md:items-center">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="nav-link-nb"
              data-active={isActive(link.href) ? 'true' : undefined}
              aria-current={isActive(link.href) ? 'page' : undefined}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      <div className="hidden md:flex md:items-center md:gap-3">
        <SiteSearch />
        <Link href="/post-project" className="btn btn-primary !min-h-[40px] !px-4 !py-2 !text-[12px]">
          Post a Project
        </Link>
        {signedIn ? (
          <Link href="/dashboard" className="nav-link-nb" title={name ? `Signed in as ${name}` : undefined}>
            My Dashboard
          </Link>
        ) : (
          <Link href="/login" className="nav-link-nb">
            Sign in
          </Link>
        )}
      </div>

      <button
        type="button"
        className="flex min-h-[44px] items-center gap-2 px-1 text-[14px] uppercase tracking-[0.1em] text-white/90 md:hidden"
        aria-controls="nb-mobile-nav"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
        <span>{open ? 'Close' : 'Menu'}</span>
      </button>

      <div
        id="nb-mobile-nav"
        hidden={!open}
        className="absolute inset-x-0 top-full border-t border-white/10 bg-[color:var(--nb-secondary)] md:hidden"
      >
        <nav aria-label="Mobile" className="w-full max-w-7xl mx-auto px-4 py-3">
          <ul className="flex flex-col">
            {links.map((link) => (
              <li key={link.href} className="border-b border-white/5">
                <Link
                  href={link.href}
                  className="nav-link-nb w-full"
                  data-active={isActive(link.href) ? 'true' : undefined}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="border-b border-white/5">
              <Link href={signedIn ? '/dashboard' : '/login'} className="nav-link-nb w-full" onClick={() => setOpen(false)}>
                {signedIn ? 'My Dashboard' : 'Sign in'}
              </Link>
            </li>
          </ul>
          <div className="mt-4 flex flex-col gap-3 pb-2">
            <SiteSearch onDone={() => setOpen(false)} />
            <Link href="/register" className="btn btn-white w-full" onClick={() => setOpen(false)}>
              Create an account
            </Link>
            <Link href="/post-project" className="btn btn-primary w-full" onClick={() => setOpen(false)}>
              Post a Project
            </Link>
          </div>
        </nav>
      </div>
    </div>
  )
}

function SiteSearch({ onDone }: { onDone?: () => void }) {
  const [term, setTerm] = useState('')

  return (
    <form
      role="search"
      action="/contractors"
      method="get"
      className="flex items-center gap-2"
      onSubmit={() => onDone?.()}
    >
      <label className="sr-only" htmlFor="nb-search">
        Search contractors
      </label>
      <input
        id="nb-search"
        name="q"
        type="search"
        value={term}
        onChange={(event) => setTerm(event.target.value)}
        placeholder="Search trade or county"
        className="field !h-[40px] !w-[190px] !py-1 !text-[13px] placeholder:text-black/60"
      />
      <button type="submit" className="btn btn-white !min-h-[40px] !px-3 !py-1 !text-[11px]">
        Search
      </button>
    </form>
  )
}

export default NavControls

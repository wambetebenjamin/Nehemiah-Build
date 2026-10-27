import Link from 'next/link'
import { ArrowLeft, Home, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <section className="section">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card mx-auto max-w-2xl p-8 text-center sm:p-14">
          <p className="mb-2 text-[13px] font-bold uppercase tracking-[0.18em] text-[color:var(--nb-primary)]">
            Error 404
          </p>
          <h1 className="mb-4 text-[44px] font-black uppercase leading-none text-[color:var(--nb-secondary)] sm:text-[72px]">
            This page was never built
          </h1>
          <p className="mb-8 text-[15px] leading-relaxed text-[color:var(--gray)] sm:text-base">
            The link you followed does not exist, or a project that used to live here has been closed. Nothing is lost
            on your side: your posted projects and quotes are still in your dashboard.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
            <Link href="/" className="btn btn-primary w-full sm:w-auto px-6 py-3">
              <Home className="h-4 w-4" aria-hidden="true" />
              Back to home
            </Link>
            <Link href="/contractors" className="btn btn-ghost w-full sm:w-auto px-6 py-3">
              <Search className="h-4 w-4" aria-hidden="true" />
              Browse contractors
            </Link>
          </div>
          <p className="mt-8 mb-0 text-[13px] text-[color:var(--gray)]">
            Looking for a project you posted?{' '}
            <Link href="/dashboard" className="inline-flex min-h-[32px] items-center font-semibold text-[color:var(--nb-primary)]">
              Open your dashboard
              <ArrowLeft className="ml-1 h-3.5 w-3.5 rotate-180" aria-hidden="true" />
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, ClipboardList, Scale, ShieldCheck } from 'lucide-react'
import { PageHeader, Section } from '@/components/page-header'
import { QuoteTable } from '@/components/quote-table'
import { QuotesExportButton } from '@/components/quotes-export'
import { allQuotes, DEMO_OWNER } from '@/lib/quotes-store'
import { storedProjects } from '@/lib/projects-store'
import { getDemoProject } from '@/lib/data/site-data'
import { auth } from '@/lib/auth'
import { BUDGET_BANDS, SITE, formatKES } from '@/lib/site'
import { PICTURES } from '@/lib/images'
import type { Quote } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Compare quotes',
  description:
    'Read every quote against the same numbers: amount, programme, the contractor record, and the milestone schedule each one implies. Export the comparison as a PDF.',
  alternates: { canonical: '/quotes' },
}

export default async function QuotesPage() {
  const session = await auth()
  const owner = session?.user?.email ?? DEMO_OWNER
  const [quotes, projects] = await Promise.all([allQuotes(owner), storedProjects(owner)])

  const groups = new Map<string, Quote[]>()
  for (const quote of quotes) {
    const list = groups.get(quote.projectSlug) ?? []
    list.push(quote)
    groups.set(quote.projectSlug, list)
  }

  const sections = [...groups.entries()].map(([projectId, list]) => {
    const stored = projects.find((project) => project.id === projectId)
    const demo = getDemoProject(projectId)
    const budgetLabel =
      BUDGET_BANDS.find((band) => band.value === (stored?.budgetBand ?? demo?.budgetBand))?.label ??
      'Band not published'

    return {
      projectId,
      title: list[0]?.projectTitle ?? demo?.title ?? 'Posted project',
      county: stored?.county ?? demo?.county ?? 'Kenya',
      postedOn: stored?.createdAt?.slice(0, 10) ?? demo?.startDate ?? list[0]?.createdAt ?? '',
      budgetLabel,
      homeowner: stored?.contactName ?? session?.user?.name ?? 'Homeowner',
      quotes: [...list].sort((a, b) => a.amount - b.amount),
      projectHref: demo || stored ? `/dashboard/project/${projectId}` : null,
    }
  })

  const cheapest = sections[0]?.quotes[0]

  return (
    <>
      <PageHeader
        eyebrow="Quote comparison"
        title="Read them side by side, then choose"
        intro="A quote is only useful next to two others. Same project, same budget band, same programme expectations, so the difference you see is the contractor, not the formatting."
        picture={PICTURES.quoteCover}
        crumbs={[{ label: 'Quotes' }]}
      >
        <Link href="/post-project" className="btn btn-white w-full px-6 py-3 sm:w-auto">
          Post another project
        </Link>
      </PageHeader>

      <Section>
        {!session?.user ? (
          <div className="card mb-8 flex flex-col items-start gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[color:var(--nb-primary)]" aria-hidden="true" />
              <div>
                <p className="mb-1 text-[16px] font-bold text-[color:var(--nb-secondary)]">
                  You are looking at the sample inbox
                </p>
                <p className="mb-0 text-[14px] leading-relaxed text-[color:var(--gray-dark)]">
                  Sign in to see the quotes on your own projects and to accept one. Accepting is the step that releases
                  your contact details to a contractor, so it needs an account.
                </p>
              </div>
            </div>
            <Link
              href={`/login?callbackUrl=${encodeURIComponent('/quotes')}`}
              className="btn btn-primary inline-flex min-h-[48px] shrink-0 items-center gap-2 px-5 py-2 text-[13px]"
            >
              Sign in
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        ) : null}

        {sections.length === 0 ? (
          <div className="card p-8 text-center sm:p-14">
            <ClipboardList className="mx-auto mb-4 h-10 w-10 text-[color:var(--nb-primary)]" aria-hidden="true" />
            <h2 className="mb-3 text-[26px] font-bold text-[color:var(--nb-secondary)]">No quotes in your inbox yet</h2>
            <p className="mx-auto mb-6 max-w-xl text-[15px] leading-relaxed text-[color:var(--gray)]">
              Quotes appear once a project is live. Post one, or if you posted it minutes ago, contractors are still
              reading the drawings and the site photos.
            </p>
            <Link href="/post-project" className="btn btn-primary px-6 py-3">
              Post a project
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        ) : (
          sections.map((section) => (
            <article key={section.projectId} className="mb-14 last:mb-0">
              <header className="mb-6 flex flex-col gap-4 border-b border-black/5 pb-5 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <span className="subheading mb-2">{section.county}</span>
                  <h2 className="mb-2 text-[26px] font-bold leading-tight text-[color:var(--nb-secondary)] sm:text-[32px]">
                    {section.title}
                  </h2>
                  <p className="mb-0 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-[color:var(--gray)]">
                    <span>Reference {section.projectId}</span>
                    <span>Posted {formatDate(section.postedOn)}</span>
                    <span>{section.budgetLabel}</span>
                    <span>{section.quotes.length} quotes in</span>
                  </p>
                </div>
                <div className="flex flex-col items-start gap-2 lg:items-end">
                  {section.projectHref ? (
                    <Link
                      href={section.projectHref}
                      className="btn btn-ghost inline-flex min-h-[44px] items-center gap-2 px-4 py-2 text-[13px]"
                    >
                      Open the project file
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  ) : null}
                  <QuotesExportButton
                    sheet={{
                      projectTitle: section.title,
                      projectId: section.projectId,
                      county: section.county,
                      budgetLabel: section.budgetLabel,
                      postedOn: formatDate(section.postedOn),
                      homeowner: section.homeowner,
                      quotes: section.quotes.map((quote) => ({
                        contractorCompany: quote.contractorCompany,
                        trade: quote.trade,
                        amount: quote.amount,
                        timelineWeeks: quote.timelineWeeks,
                        status: quote.status,
                        headline: quote.message.split('.')[0] + '.',
                      })),
                    }}
                  />
                </div>
              </header>

              <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <Callout
                  icon={Scale}
                  label="Lowest quote"
                  value={formatKES(Math.min(...section.quotes.map((quote) => quote.amount)))}
                  note={
                    cheapest && cheapest.projectSlug === section.projectId
                      ? `${cheapest.contractorCompany}, ${cheapest.timelineWeeks} weeks`
                      : 'Read the scope before the number'
                  }
                />
                <Callout
                  icon={ClipboardList}
                  label="Spread"
                  value={formatKES(
                    Math.max(...section.quotes.map((q) => q.amount)) - Math.min(...section.quotes.map((q) => q.amount)),
                  )}
                  note="A wide spread usually means the quotes are not for the same work."
                />
                <Callout
                  icon={ShieldCheck}
                  label="Verification"
                  value={`${section.quotes.filter((quote) => quote.contractorSlug).length} of ${section.quotes.length}`}
                  note="Every quoting company has an NCA number on file with us."
                />
              </div>

              <QuoteTable quotes={section.quotes} signedIn={Boolean(session?.user)} />

              <p className="mt-6 mb-0 rounded-[3px] bg-[color:var(--nb-light)] p-4 text-[13px] leading-relaxed text-[color:var(--gray-dark)]">
                Accepting a quote tells {SITE.name} to record it and notifies the contractor. It does not move money and
                it is not a construction contract: the binding document is the milestone schedule both sides sign, which
                is generated the moment you accept. Payment pending bank transfer confirmation.
              </p>
            </article>
          ))
        )}
      </Section>
    </>
  )
}

function Callout({
  icon: Icon,
  label,
  value,
  note,
}: {
  icon: typeof Scale
  label: string
  value: string
  note: string
}) {
  return (
    <div className="card p-4">
      <p className="mb-1 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.1em] text-[color:var(--gray)]">
        <Icon className="h-3.5 w-3.5 text-[color:var(--nb-primary)]" aria-hidden="true" />
        {label}
      </p>
      <p className="mb-1 text-[19px] font-black leading-none text-[color:var(--nb-secondary)]">{value}</p>
      <p className="mb-0 text-[13px] leading-snug text-[color:var(--gray)]">{note}</p>
    </div>
  )
}

function formatDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime()) || !value) return 'recently'
  return date.toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' })
}

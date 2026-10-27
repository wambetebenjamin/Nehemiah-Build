import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, SearchX } from 'lucide-react'
import { CONTRACTORS } from '@/lib/data/contractors'
import { CONTRACTOR_TRADES } from '@/lib/data/contractors'
import { ContractorCard } from '@/components/contractor-card'
import { ContractorGrid } from '@/components/contractor-grid'
import { ContractorFilters } from '@/components/contractor-filters'
import { PageHeader, Section } from '@/components/page-header'
import { COUNTIES, SITE } from '@/lib/site'
import { PICTURES } from '@/lib/images'

export const metadata: Metadata = {
  title: 'Verified contractors in Kenya',
  description:
    'Browse architects, structural engineers, roofers, plumbers, electricians, tilers, painters and interior designers registered with the NCA and rated by homeowners on Nehemiah Build.',
  alternates: { canonical: '/contractors' },
}

const SORTS = ['rating', 'projects', 'years', 'county'] as const
type Sort = (typeof SORTS)[number]

export default async function ContractorsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const q = text(params.q)
  const trade = text(params.trade)
  const county = text(params.county)
  const verifiedOnly = text(params.verified) === 'yes'
  const sort = (SORTS as readonly string[]).includes(text(params.sort)) ? (text(params.sort) as Sort) : 'rating'

  const matches = CONTRACTORS.filter((contractor) => {
    if (trade && !sameTrade(contractor.trade, trade)) return false
    if (county && contractor.county.toLowerCase() !== county.toLowerCase()) {
      const coversServiceArea = contractor.serviceAreas.some(
        (area) => area.toLowerCase() === county.toLowerCase(),
      )
      if (!coversServiceArea) return false
    }
    if (verifiedOnly && !contractor.verified) return false
    if (q) {
      const haystack = [
        contractor.company,
        contractor.owner,
        contractor.trade,
        contractor.county,
        contractor.bio,
        contractor.serviceAreas.join(' '),
        ...contractor.reviews.map((review) => `${review.title} ${review.body}`),
      ]
        .join(' ')
        .toLowerCase()
      if (!haystack.includes(q.toLowerCase())) return false
    }
    return true
  }).sort((a, b) => {
    switch (sort) {
      case 'projects':
        return b.completedProjects - a.completedProjects
      case 'years':
        return b.yearsInOperation - a.yearsInOperation
      case 'county':
        return a.county.localeCompare(b.county) || b.rating - a.rating
      default:
        return b.rating - a.rating || b.reviewCount - a.reviewCount
    }
  })

  return (
    <>
      <PageHeader
        eyebrow="The directory"
        title="Verified contractors, county by county"
        intro="Every profile here has an NCA number we can look up, a trade, and reviews from homeowners who used the platform for a real project. Search by trade, county, or a phrase from a review."
        picture={PICTURES.quoteCover}
        crumbs={[{ label: 'Contractors' }]}
      >
        <Link href="/post-project" className="btn btn-primary w-full px-6 py-3 sm:w-auto">
          Post a project instead
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
        <Link href="/contractor-apply" className="btn btn-white w-full px-6 py-3 sm:w-auto">
          Join as a contractor
        </Link>
      </PageHeader>

      <Section>
        <div className="heading-section ftco-animate mb-8 max-w-3xl">
          <span className="subheading">
            {CONTRACTORS.length} companies &middot; {SITE.name}
          </span>
          <h2 className="mb-4">Who is working in your county this month</h2>
          <p className="mb-0">
            The list is ranked by rating, then by how many projects they have closed. Verified means their NCA
            registration and at least two completed sites were checked by our desk, not that they paid us anything.
          </p>
        </div>

        <ContractorFilters trades={CONTRACTOR_TRADES} counties={COUNTIES} resultCount={matches.length} />

        {matches.length ? (
          <ContractorGrid>
            {matches.map((contractor) => (
              <ContractorCard key={contractor.slug} contractor={contractor} />
            ))}
          </ContractorGrid>
        ) : (
          <div className="card p-8 text-center sm:p-14">
            <SearchX className="mx-auto mb-4 h-10 w-10 text-[color:var(--nb-primary)]" aria-hidden="true" />
            <h3 className="mb-2 text-[22px] font-bold text-[color:var(--nb-secondary)]">
              Nobody matches that search yet
            </h3>
            <p className="mx-auto mb-6 max-w-xl text-[15px] leading-relaxed text-[color:var(--gray)]">
              The directory is deliberately small: we only publish a company after their registration and two completed
              sites have been checked. Clear a filter, or post the project and let the right contractor come to you.
            </p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
              <Link href="/contractors" className="btn btn-outline px-6 py-3">
                Reset the filters
              </Link>
              <Link href="/post-project" className="btn btn-primary px-6 py-3">
                Post a project
              </Link>
            </div>
          </div>
        )}

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {COUNTIES.slice(0, 4).map((name) => {
            const count = CONTRACTORS.filter(
              (contractor) =>
                contractor.county === name || contractor.serviceAreas.includes(name),
            ).length
            return (
              <Link
                key={name}
                href={`/contractors?county=${encodeURIComponent(name)}`}
                className="card flex min-h-[44px] items-center justify-between gap-3 p-4 transition-shadow hover:shadow-[color:var(--nb-shadow-card)]"
              >
                <span className="text-[15px] font-bold text-[color:var(--nb-secondary)]">{name}</span>
                <span className="text-[13px] text-[color:var(--gray)]">
                  {count} contractor{count === 1 ? '' : 's'}
                </span>
              </Link>
            )
          })}
        </div>
      </Section>
    </>
  )
}

function text(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? ''
  return value ?? ''
}

function sameTrade(trade: string, wanted: string): boolean {
  const normalized = wanted.toLowerCase().replace(/[_-]/g, ' ').trim()
  const direct = trade.toLowerCase() === normalized
  const contains = normalized.length > 3 && trade.toLowerCase().includes(normalized)
  return direct || contains
}

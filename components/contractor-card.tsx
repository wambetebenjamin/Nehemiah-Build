import Link from 'next/link'
import { BadgeCheck, ArrowRight, MapPin } from 'lucide-react'
import type { Contractor } from '@/lib/types'
import { PexImage } from '@/components/pex-image'
import { Stars } from '@/components/rating'

/** Directory grid: staggered scale-in as the row enters the viewport. */
export function ContractorCard({ contractor }: { contractor: Contractor }) {
  return (
    <div data-card className="card group flex h-full flex-col overflow-hidden">
      <div className="relative h-40 w-full overflow-hidden sm:h-56">
        <PexImage
          picture={contractor.cover}
          alt={`${contractor.company} recent work in ${contractor.county}`}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          sizes="(min-width: 1024px) 33vw, (min-width: 576px) 50vw, 100vw"
        />
        <span className="absolute left-3 top-3 rounded-[3px] bg-[color:var(--nb-secondary)]/90 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-white">
          {contractor.trade}
        </span>
        {contractor.verified ? (
          <span className="badge-verify absolute right-3 top-3 bg-white/95">
            <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
            Verified
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="-mt-12 mb-3 flex items-end gap-3">
          <span className="h-16 w-16 shrink-0 overflow-hidden rounded-full border-4 border-white shadow-[var(--nb-shadow-card)] sm:h-20 sm:w-20">
            <PexImage
              picture={contractor.avatar}
              alt={`${contractor.owner}, ${contractor.company}`}
              fill
              className="object-cover"
              sizes="80px"
            />
          </span>
        </div>

        <h3 className="text-lg sm:text-xl font-bold text-[color:var(--nb-secondary)]">{contractor.company}</h3>
        <p className="mb-2 mt-1 text-[13px] text-[color:var(--gray)]">
          Led by {contractor.owner}
        </p>

        <p className="mb-3 flex items-center gap-1.5 text-[13px] text-[color:var(--gray-dark)]">
          <MapPin className="h-4 w-4 text-[color:var(--nb-primary)]" aria-hidden="true" />
          {contractor.county} County
          <span className="text-[color:var(--gray)]">
            &middot; {contractor.yearsInOperation} year{contractor.yearsInOperation === 1 ? '' : 's'} in operation
          </span>
        </p>

        <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2">
          <Stars value={contractor.rating} />
          <span className="text-[13px] text-[color:var(--gray)]">
            {contractor.reviewCount} review{contractor.reviewCount === 1 ? '' : 's'}
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-[color:var(--nb-light)] pt-4">
          <span className="text-[13px] text-[color:var(--gray)]">
            {contractor.completedProjects} projects completed
          </span>
          <Link
            href={`/contractor/${contractor.slug}`}
            className="btn btn-primary !min-h-[40px] !px-4 !py-2 !text-[12px]"
            aria-label={`View profile for ${contractor.company}`}
          >
            View Profile
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ContractorCard

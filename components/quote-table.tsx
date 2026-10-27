import Link from 'next/link'
import { ArrowUpRight, BadgeCheck, Clock3 } from 'lucide-react'
import type { Quote } from '@/lib/types'
import { getContractor } from '@/lib/data/contractors'
import { formatKES } from '@/lib/site'
import { Stars } from '@/components/rating'
import { QuoteAcceptButton } from '@/components/quote-accept-button'

/**
 * Quote comparison. Mobile gets stacked cards; from md up the same data becomes
 * the side by side table, because comparing line by line is the whole point of
 * the page. Horizontal scrolling is on the table shell, never the page.
 */
export function QuoteTable({
  quotes,
  signedIn,
  onChanged,
}: {
  quotes: Quote[]
  signedIn: boolean
  onChanged?: () => void
}) {
  return (
    <>
      {/* Mobile: cards */}
      <ul className="grid grid-cols-1 gap-4 md:hidden">
        {quotes.map((quote) => (
          <li key={quote.id}>
            <QuoteCard quote={quote} signedIn={signedIn} onChanged={onChanged} />
          </li>
        ))}
      </ul>

      {/* md and up: comparison table */}
      <div className="table-scroll hidden md:block">
        <table className="table-nb">
          <caption className="sr-only">
            Quotes compared by amount, programme and contractor record. Use the horizontal scroll to see the decision
            column.
          </caption>
          <thead>
            <tr>
              <th scope="col">Contractor</th>
              <th scope="col">Trade</th>
              <th scope="col" className="text-right">
                Amount
              </th>
              <th scope="col" className="text-right">
                Programme
              </th>
              <th scope="col">Record</th>
              <th scope="col">Status</th>
              <th scope="col">
                <span className="sr-only">Decision</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {quotes.map((quote) => {
              const contractor = getContractor(quote.contractorSlug)
              return (
                <tr key={quote.id}>
                  <th scope="row" className="font-normal">
                    <Link
                      href={`/contractor/${quote.contractorSlug}`}
                      className="inline-flex min-h-[44px] items-center gap-1 font-bold text-[color:var(--nb-secondary)] hover:text-[color:var(--nb-primary)]"
                    >
                      {quote.contractorCompany}
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                    {contractor ? (
                      <p className="mt-1 mb-0 text-[13px] font-normal text-[color:var(--gray)]">
                        {contractor.owner} &middot; {contractor.county} &middot; NCA {contractor.ncaNumber}
                      </p>
                    ) : null}
                  </th>
                  <td className="text-[14px]">{quote.trade}</td>
                  <td className="text-right text-[15px] font-bold text-[color:var(--nb-secondary)]">
                    {formatKES(quote.amount)}
                  </td>
                  <td className="text-right text-[14px]">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock3 className="h-3.5 w-3.5 text-[color:var(--gray)]" aria-hidden="true" />
                      {quote.timelineWeeks} weeks
                    </span>
                  </td>
                  <td>
                    {contractor ? (
                      <div className="flex flex-col gap-1">
                        <Stars value={contractor.rating} size="sm" />
                        <span className="text-[12px] text-[color:var(--gray)]">
                          {contractor.completedProjects} completed &middot; {contractor.yearsInOperation} years
                        </span>
                      </div>
                    ) : (
                      <span className="text-[13px] text-[color:var(--gray)]">Profile not published</span>
                    )}
                  </td>
                  <td>
                    <QuoteStatus status={quote.status} />
                  </td>
                  <td className="text-right">
                    <QuoteAcceptButton quote={quote} signedIn={signedIn} onChanged={onChanged} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}

export function QuoteStatus({ status }: { status: Quote['status'] }) {
  const className =
    status === 'Accepted'
      ? 'badge-approved'
      : status === 'Declined'
        ? 'badge-pending'
        : status === 'Viewed'
          ? 'badge-progress'
          : 'badge-status'
  return <span className={className}>{status}</span>
}

function QuoteCard({
  quote,
  signedIn,
  onChanged,
}: {
  quote: Quote
  signedIn: boolean
  onChanged?: () => void
}) {
  const contractor = getContractor(quote.contractorSlug)

  return (
    <article className="card h-full p-5">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="mb-1 text-[17px] font-bold leading-snug text-[color:var(--nb-secondary)]">
            <Link href={`/contractor/${quote.contractorSlug}`} className="hover:text-[color:var(--nb-primary)]">
              {quote.contractorCompany}
            </Link>
          </h3>
          <p className="mb-0 text-[13px] text-[color:var(--gray)]">
            {quote.trade} &middot; {contractor?.county ?? 'Kenya'}
          </p>
        </div>
        {contractor?.verified ? (
          <span className="badge-verify shrink-0">
            <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
            Verified
          </span>
        ) : null}
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3 rounded-[3px] bg-[color:var(--nb-light)] p-4">
        <div>
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[color:var(--gray)]">Amount</p>
          <p className="mb-0 text-[18px] font-black text-[color:var(--nb-secondary)]">{formatKES(quote.amount)}</p>
        </div>
        <div>
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[color:var(--gray)]">
            Programme
          </p>
          <p className="mb-0 text-[18px] font-black text-[color:var(--nb-secondary)]">{quote.timelineWeeks} weeks</p>
        </div>
      </div>

      <p className="mb-4 text-[14px] leading-relaxed text-[color:var(--gray-dark)]">{quote.message}</p>

      {contractor ? (
        <div className="mb-4 flex items-center gap-2 text-[13px] text-[color:var(--gray)]">
          <Stars value={contractor.rating} size="sm" />
          <span>
            {contractor.completedProjects} projects &middot; NCA {contractor.ncaNumber}
          </span>
        </div>
      ) : null}

      <div className="flex items-center justify-between gap-3">
        <QuoteStatus status={quote.status} />
        <QuoteAcceptButton quote={quote} signedIn={signedIn} onChanged={onChanged} />
      </div>
    </article>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { SlidersHorizontal, X } from 'lucide-react'

/**
 * Directory filter bar. It is a plain GET form so the state lives in the url:
 * every filter combination is linkable and shareable, and the page still works
 * before hydration. Applying a filter writes the query string, the server does
 * the matching.
 */
export function ContractorFilters({
  trades,
  counties,
  resultCount,
}: {
  trades: readonly string[]
  counties: readonly string[]
  resultCount: number
}) {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()
  const [open, setOpen] = useState(false)

  const trade = params.get('trade') ?? ''
  const county = params.get('county') ?? ''
  const q = params.get('q') ?? ''
  const verified = params.get('verified') ?? ''
  const sort = params.get('sort') ?? 'rating'

  const [draft, setDraft] = useState({ trade, county, q, verified, sort })

  useEffect(() => {
    setDraft({ trade, county, q, verified, sort })
  }, [trade, county, q, verified, sort])

  const active = [trade, county, q, verified].filter(Boolean).length

  const apply = (next: Partial<typeof draft>) => {
    const merged = { ...draft, ...next }
    const search = new URLSearchParams()
    if (merged.trade) search.set('trade', merged.trade)
    if (merged.county) search.set('county', merged.county)
    if (merged.q) search.set('q', merged.q)
    if (merged.verified) search.set('verified', merged.verified)
    if (merged.sort && merged.sort !== 'rating') search.set('sort', merged.sort)
    const query = search.toString()
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }

  const clear = () => {
    setDraft({ trade: '', county: '', q: '', verified: '', sort: 'rating' })
    router.replace(pathname, { scroll: false })
  }

  return (
    <div className="card mb-8 p-4 sm:p-5">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="nb-filters"
          className="btn btn-outline inline-flex min-h-[44px] items-center gap-2 px-4 py-2 text-[13px]"
        >
          <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
          Filters
          {active ? (
            <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[color:var(--nb-primary)] px-1.5 text-[11px] font-bold text-white">
              {active}
            </span>
          ) : null}
        </button>

        <p className="mb-0 text-[14px] text-[color:var(--gray-dark)]">
          <strong className="font-bold text-[color:var(--nb-secondary)]">{resultCount}</strong> contractor
          {resultCount === 1 ? '' : 's'} match this search
        </p>

        {active ? (
          <button
            type="button"
            onClick={clear}
            className="inline-flex min-h-[44px] items-center gap-1 text-[13px] font-semibold text-[color:var(--nb-primary)]"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
            Clear filters
          </button>
        ) : null}

        <div className="ml-auto flex items-center gap-2">
          <label htmlFor="nb-sort" className="text-[12px] font-semibold uppercase tracking-wide text-[color:var(--gray)]">
            Sort
          </label>
          <select
            id="nb-sort"
            value={sort}
            onChange={(event) => apply({ sort: event.target.value })}
            className="field !mb-0 !h-11 !w-[170px] !py-0 text-[14px]"
          >
            <option value="rating">Best rated</option>
            <option value="projects">Most completed</option>
            <option value="years">Longest in operation</option>
            <option value="county">County A to Z</option>
          </select>
        </div>
      </div>

      {open ? (
        <div id="nb-filters" className="mt-4 grid grid-cols-1 gap-x-4 border-t border-black/5 pt-4 sm:grid-cols-2 lg:grid-cols-4">
          <FieldSelect
            label="Search"
            name="q"
            value={draft.q}
            onChange={(value) => apply({ q: value })}
            placeholder="Company, owner or a phrase from a review"
          />

          <FilterSelect label="Trade" name="trade" value={draft.trade} options={trades} onChange={(value) => apply({ trade: value })} />
          <FilterSelect label="County" name="county" value={draft.county} options={counties} onChange={(value) => apply({ county: value })} />

          <div className="mb-5">
            <span className="label">Verification</span>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'yes', label: 'Verified only' },
                { value: '', label: 'All contractors' },
              ].map((option) => (
                <button
                  key={option.label}
                  type="button"
                  onClick={() => apply({ verified: option.value })}
                  aria-pressed={verified === option.value}
                  className={`inline-flex min-h-[44px] items-center rounded-[30px] border px-4 text-[13px] font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--nb-primary)] ${
                    verified === option.value
                      ? 'border-[color:var(--nb-primary)] bg-[color:var(--nb-primary)] text-white'
                      : 'border-black/10 bg-black/5 text-[color:var(--gray-dark)]'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function FilterSelect({
  label,
  name,
  value,
  options,
  onChange,
}: {
  label: string
  name: string
  value: string
  options: readonly string[]
  onChange: (value: string) => void
}) {
  return (
    <div className="mb-5">
      <label htmlFor={`flt-${name}`} className="label">
        {label}
      </label>
      <select
        id={`flt-${name}`}
        data-field={name}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="field"
      >
        <option value="">Any {label.toLowerCase()}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  )
}

function FieldSelect({
  label,
  name,
  value,
  onChange,
  placeholder,
}: {
  label: string
  name: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
}) {
  const [local, setLocal] = useState(value)
  useEffect(() => setLocal(value), [value])

  return (
    <div className="mb-5">
      <label htmlFor={`flt-${name}`} className="label">
        {label}
      </label>
      <input
        id={`flt-${name}`}
        data-field={name}
        type="search"
        className="field"
        placeholder={placeholder}
        value={local}
        onChange={(event) => {
          setLocal(event.target.value)
          onChange(event.target.value)
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault()
            onChange(local)
          }
        }}
      />
    </div>
  )
}

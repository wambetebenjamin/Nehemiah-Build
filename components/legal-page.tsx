'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, CheckCheck, Printer } from 'lucide-react'
import { POLICIES, LEGAL_UPDATED, type LegalBlock, type LegalSection } from '@/lib/legal'
import { SITE } from '@/lib/site'

/**
 * Renders one of the three policies from `lib/legal.ts`. Contents sit in a sticky
 * index on desktop so a long document can be entered at the section you need, and
 * every heading is an anchor a court letter can quote.
 */
export function LegalPage({ policy }: { policy: keyof typeof POLICIES }) {
  const document_ = POLICIES[policy]

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-14">
        <LegalIndex sections={document_.sections} />

        <div className="min-w-0">
          <p className="mb-2 inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.12em] text-[color:var(--gray)]">
            <CheckCheck className="h-4 w-4 text-[color:var(--nb-primary)]" aria-hidden="true" />
            Last updated {LEGAL_UPDATED}
          </p>
          <h1 className="mb-4 text-[32px] font-black uppercase leading-none text-[color:var(--nb-secondary)] sm:text-[44px]">
            {document_.title}
          </h1>
          <p className="mb-8 max-w-3xl text-[16px] leading-relaxed text-[color:var(--gray-dark)]">{document_.intro}</p>

          <div className="card mb-10 p-5 sm:p-6">
            <p className="mb-3 text-[12px] font-bold uppercase tracking-[0.12em] text-[color:var(--nb-primary)]">
              If you read nothing else
            </p>
            <ul className="mb-0 grid gap-2 p-0 pl-4 text-[15px] leading-relaxed text-[color:var(--gray-dark)]">
              {document_.summary.map((line) => (
                <li key={line} className="list-disc">
                  {line}
                </li>
              ))}
            </ul>
          </div>

          {document_.sections.map((section) => (
            <section key={section.id} id={section.id} className="mb-10 scroll-mt-28">
              <h2 className="mb-4 text-[22px] font-bold leading-snug text-[color:var(--nb-secondary)] sm:text-[26px]">
                {section.heading}
              </h2>
              {section.blocks.map((block, index) => (
                <Block key={`${section.id}-${index}`} block={block} />
              ))}
            </section>
          ))}

          <div className="card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <p className="mb-0 text-[14px] leading-relaxed text-[color:var(--gray-dark)]">
              Questions about this document, or a request about your data: hello@nehemia.build, or WhatsApp the project
              desk from the button in the corner of the page.
            </p>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="btn btn-ghost inline-flex min-h-[44px] items-center gap-2 px-4 py-2 text-[13px]"
              >
                <Printer className="h-4 w-4" aria-hidden="true" />
                Print
              </button>
              <Link href="/" className="btn btn-outline inline-flex min-h-[44px] items-center gap-2 px-4 py-2 text-[13px]">
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Back to site
              </Link>
            </div>
          </div>

          <p className="mt-6 mb-0 text-[13px] leading-relaxed text-[color:var(--gray)]">
            {SITE.name}, {SITE.tagline}. This document is written in English and is provided for information: it is
            not legal advice, and it does not replace the contract you sign with a contractor.
          </p>
        </div>
      </div>
    </div>
  )
}

function Block({ block }: { block: LegalBlock }) {
  if (block.kind === 'p') {
    return <p className="mb-4 max-w-3xl text-[15px] leading-relaxed text-[color:var(--gray-dark)]">{block.text}</p>
  }

  if (block.kind === 'note') {
    return (
      <p className="mb-4 max-w-3xl rounded-[3px] border-l-4 border-[color:var(--nb-primary)] bg-[color:var(--nb-light)] p-4 text-[15px] leading-relaxed text-[color:var(--gray-dark)]">
        {block.text}
      </p>
    )
  }

  if (block.kind === 'list') {
    const List = block.ordered ? 'ol' : 'ul'
    return (
      <List className="mb-4 max-w-3xl grid gap-2 p-0 pl-5 text-[15px] leading-relaxed text-[color:var(--gray-dark)]">
        {block.items.map((item, index) => (
          <li key={index} className={block.ordered ? 'list-decimal' : 'list-disc'}>
            {item}
          </li>
        ))}
      </List>
    )
  }

  return (
    <div className="table-scroll mb-4">
      <table className="table-nb">
        <thead>
          <tr>
            {block.head.map((cell) => (
              <th key={cell} scope="col">
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {block.rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} scope={cellIndex === 0 ? 'row' : undefined}>
                  {cellIndex === 0 ? (
                    <span className="block break-words font-semibold text-[color:var(--nb-secondary)]">{cell}</span>
                  ) : (
                    <span className="block break-words">{cell}</span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function LegalIndex({ sections }: { sections: LegalSection[] }) {
  const [active, setActive] = useState(sections[0]?.id ?? '')

  useEffect(() => {
    const nodes = sections
      .map((section) => document.getElementById(section.id))
      .filter((node): node is HTMLElement => Boolean(node))
    if (!nodes.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-96px 0px -70% 0px', threshold: [0, 1] },
    )

    for (const node of nodes) observer.observe(node)
    return () => observer.disconnect()
  }, [sections])

  return (
    <nav aria-label="Contents" className="lg:sticky lg:top-24">
      <p className="mb-3 text-[12px] font-bold uppercase tracking-[0.12em] text-[color:var(--gray)]">In this document</p>
      <ol className="mb-0 grid gap-1 list-none p-0">
        {sections.map((section, index) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              aria-current={active === section.id ? 'true' : undefined}
              className={`flex min-h-[44px] items-center gap-2 rounded-[3px] px-3 text-[14px] leading-snug transition-colors ${
                active === section.id
                  ? 'bg-[color:var(--nb-primary)]/10 font-semibold text-[color:var(--nb-secondary)]'
                  : 'text-[color:var(--gray)] hover:bg-black/5'
              }`}
            >
              <span className="text-[12px] font-bold text-[color:var(--nb-primary)]">{index + 1}</span>
              <span className="min-w-0 truncate">{section.heading.replace(/^\d+\.\s*/, '')}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}

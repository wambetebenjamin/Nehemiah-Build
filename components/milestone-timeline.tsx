'use client'

import { useRef, useState } from 'react'
import { Camera, CheckCircle2, Clock3, Loader2, Lock, Send } from 'lucide-react'
import { LogIn } from 'lucide-react'
import { PexImage } from '@/components/pex-image'
import { sitePicture, type PexelsKey } from '@/lib/images'
import type { Milestone } from '@/lib/types'
import type { PictureSpec } from '@/lib/images'
import { formatKES } from '@/lib/site'
import { useCaptchaForm } from '@/lib/api-client'
import Link from 'next/link'

/**
 * Milestone timeline. Vertical on phones (a short list of cards you scroll
 * through), horizontal on md and up, where the phases sit on one line and the
 * row scrolls sideways instead of the page.
 */
export function MilestoneTimeline({
  projectId,
  milestones,
  signedIn,
  onChanged,
}: {
  projectId: string
  milestones: Milestone[]
  signedIn: boolean
  onChanged?: () => void
}) {
  const host = useRef<HTMLOListElement>(null)

  const scrollBy = (direction: 1 | -1) => {
    const node = host.current
    if (!node) return
    const amount = Math.min(node.clientWidth * 0.85, 420)
    node.scrollBy({ left: direction * amount, behavior: 'smooth' })
  }

  return (
    <div className="relative">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="mb-0 text-[13px] text-[color:var(--gray)]">
          {milestones.filter((milestone) => milestone.status === 'Approved').length} of {milestones.length} phases
          signed off. Approval releases nothing automatically: you still make the transfer yourself.
        </p>
        <div className="hidden gap-2 md:flex">
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            aria-label="Scroll the timeline left"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-black/5 text-[color:var(--nb-secondary)] transition-colors hover:bg-[color:var(--nb-primary)] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--nb-primary)]"
          >
            <span aria-hidden="true" className="text-[18px] leading-none">
              &#8249;
            </span>
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            aria-label="Scroll the timeline right"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-black/5 text-[color:var(--nb-secondary)] transition-colors hover:bg-[color:var(--nb-primary)] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--nb-primary)]"
          >
            <span aria-hidden="true" className="text-[18px] leading-none">
              &#8250;
            </span>
          </button>
        </div>
      </div>

      <ol
        ref={host}
        className="flex flex-col gap-4 md:flex-row md:overflow-x-auto md:pb-3 md:[scrollbar-width:thin]"
      >
        {milestones.map((milestone, index) => (
          <li
            key={milestone.id}
            className="w-full shrink-0 md:w-[300px] lg:w-[320px] md:snap-start"
            aria-label={`Phase ${index + 1}: ${milestone.name}`}
          >
            <article className={`timeline-card h-full card p-5 ${milestone.status === 'Approved' ? 'is-done' : ''}`}>
              <header className="mb-3 flex items-start justify-between gap-2">
                <span className="text-[12px] font-bold uppercase tracking-[0.12em] text-[color:var(--gray)]">
                  Phase {index + 1}
                </span>
                <MilestoneBadge status={milestone.status} />
              </header>

              <span className="timeline-node" aria-hidden="true" data-state={milestone.status}>
                {index + 1}
              </span>

              <h3 className="mb-2 mt-3 text-[17px] font-bold leading-snug text-[color:var(--nb-secondary)]">
                {milestone.name}
              </h3>

              <dl className="mb-4 grid grid-cols-2 gap-y-2 text-[13px]">
                <dt className="text-[color:var(--gray)]">Due</dt>
                <dd className="mb-0 flex items-center gap-1 font-semibold text-[color:var(--gray-dark)]">
                  <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
                  {formatDate(milestone.dueDate)}
                </dd>
                <dt className="text-[color:var(--gray)]">Value</dt>
                <dd className="mb-0 font-bold text-[color:var(--nb-secondary)]">{formatKES(milestone.amount)}</dd>
              </dl>

              <MilestonePhotos milestone={milestone} index={index} />

              <div className="mt-4 border-t border-black/5 pt-4">
                <ApproveControl
                  projectId={projectId}
                  milestone={milestone}
                  signedIn={signedIn}
                  onChanged={onChanged}
                />
              </div>
            </article>
          </li>
        ))}
      </ol>
    </div>
  )
}

const DEMO_EVIDENCE: PexelsKey[][] = [
  ['blueprintReview', 'urbanDig'],
  ['masonryHands', 'layingBricks'],
  ['welders', 'scaffoldingSky'],
  ['rooftopGear', 'craneWorker'],
  ['interiorAfrican', 'modernInterior'],
]

function MilestoneBadge({ status }: { status: Milestone['status'] }) {
  const className =
    status === 'Approved'
      ? 'badge-approved'
      : status === 'Completed'
        ? 'badge-completed'
        : status === 'In Progress'
          ? 'badge-progress'
          : 'badge-pending'
  return <span className={className}>{status}</span>
}

function MilestonePhotos({ milestone, index }: { milestone: Milestone; index: number }) {
  // A phase that is finished or running always carries evidence: the photos the
  // contractor uploaded, otherwise the site record for that stage.
  const specs: PictureSpec[] = milestone.progressPhotos.length
    ? milestone.progressPhotos
    : milestone.status === 'Pending'
      ? []
      : DEMO_EVIDENCE[index % DEMO_EVIDENCE.length].map((key) =>
          sitePicture(key, `Progress photo: ${milestone.name}`),
        )

  if (!specs.length) {
    return (
      <p className="mb-0 flex items-center gap-2 rounded-[3px] bg-[color:var(--nb-light)] px-3 py-2 text-[12px] text-[color:var(--gray)]">
        <Camera className="h-3.5 w-3.5" aria-hidden="true" />
        No progress photos on this phase yet
      </p>
    )
  }

  return (
    <ul className="mb-0 flex gap-2 overflow-x-auto p-0 md:grid md:grid-cols-2">
      {specs.map((picture, pictureIndex) => (
        <li key={`${milestone.id}-${pictureIndex}`} className="relative h-20 w-28 shrink-0 overflow-hidden rounded-[3px] md:w-full">
          <PexImage
            picture={picture}
            alt={`Progress photo uploaded for ${milestone.name}`}
            fill
            sizes="160px"
            className="object-cover"
          />
        </li>
      ))}
    </ul>
  )
}

function ApproveControl({
  projectId,
  milestone,
  signedIn,
  onChanged,
}: {
  projectId: string
  milestone: Milestone
  signedIn: boolean
  onChanged?: () => void
}) {
  const [note, setNote] = useState('')
  const [outcome, setOutcome] = useState<string | null>(null)
  const { submit, pending } = useCaptchaForm<{
    approved?: boolean
    message?: string
    paymentMessage?: string
    totalApproved?: number
  }>('milestone-approval', '/api/milestones/approve', 'PUT')

  if (milestone.status === 'Approved') {
    return (
      <p className="mb-0 flex items-center gap-2 text-[13px] font-semibold text-[color:var(--green)]">
        <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
        Signed off, payment recorded
      </p>
    )
  }

  if (!signedIn) {
    return (
      <Link
        href={`/login?callbackUrl=${encodeURIComponent(`/dashboard/project/${projectId}`)}&reason=milestone-approval`}
        className="btn btn-outline inline-flex min-h-[44px] w-full items-center justify-center gap-2 px-4 py-2 text-[13px]"
      >
        <LogIn className="h-4 w-4" aria-hidden="true" />
        Sign in to approve
      </Link>
    )
  }

  if (milestone.status !== 'Completed') {
    return (
      <p className="mb-0 flex items-start gap-2 text-[12px] leading-snug text-[color:var(--gray)]">
        <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        {milestone.status === 'In Progress'
          ? 'The contractor is still working. Approval opens when they mark the phase complete and upload closing photos.'
          : 'This phase has not started yet.'}
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <label className="text-[12px] font-semibold uppercase tracking-wide text-[color:var(--gray)]">
        Note for the file (optional)
        <textarea
          value={note}
          onChange={(event) => setNote(event.target.value)}
          rows={2}
          className="field mt-1 !text-[14px]"
          placeholder="Anything you want recorded with this approval"
        />
      </label>
      <button
        type="button"
        disabled={pending}
        className="btn btn-primary inline-flex min-h-[44px] items-center justify-center gap-2 px-4 py-2 text-[13px]"
        onClick={() => {
          void submit({ projectId, milestoneId: milestone.id, note }).then((response) => {
            setOutcome(
              response.ok
                ? response.data?.paymentMessage ?? 'Approval recorded.'
                : response.message,
            )
            if (response.ok) onChanged?.()
          })
        }}
      >
        {pending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Recording
          </>
        ) : (
          <>
            <Send className="h-4 w-4" aria-hidden="true" />
            Approve and release
          </>
        )}
      </button>
      {outcome ? (
        <p role="status" className="mb-0 text-[12px] leading-snug text-[color:var(--gray-dark)]">
          {outcome}
        </p>
      ) : null}
    </div>
  )
}

function formatDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })
}

import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, CalendarClock, Camera, ShieldCheck, Wallet } from 'lucide-react'
import { PageHeader, Section } from '@/components/page-header'
import { MilestoneTimeline } from '@/components/milestone-timeline'
import { MessagesPanel } from '@/components/messages-panel'
import { PexImage } from '@/components/pex-image'
import { DashboardCharts } from '@/components/dashboard-charts-async'
import { DEMO_MESSAGES, DEMO_PROJECTS, SPEND_BY_CATEGORY, SPEND_OVER_TIME, getDemoProject } from '@/lib/data/site-data'
import { getContractor } from '@/lib/data/contractors'
import { auth } from '@/lib/auth'
import { DEMO_OWNER, allQuotes } from '@/lib/quotes-store'
import { readProject, toProjectView } from '@/lib/projects-store'
import { PICTURES } from '@/lib/images'
import { SITE, formatKES } from '@/lib/site'
import type { Project } from '@/lib/types'

export const dynamic = 'force-dynamic'

export function generateStaticParams() {
  return DEMO_PROJECTS.map((project) => ({ id: project.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const project = getDemoProject(id)
  if (!project) return { title: 'Project not found' }
  return {
    title: project.title,
    description: `${project.currentPhase}. ${project.progress}% complete, next date ${project.nextMilestoneDate}.`,
    robots: { index: false, follow: false },
  }
}

export default async function ProjectFilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  const owner = session?.user?.email ?? DEMO_OWNER

  const demo = getDemoProject(id)
  const stored = await readProject(owner, id)
  if (!demo && !stored) notFound()

  const quotes = await allQuotes(owner)
  const projectList = demo ? [demo] : [toProjectView(stored!, quotes.filter((quote) => quote.projectSlug === id).length)]
  const project = projectList[0]

  const contractor = project.contractorSlug ? getContractor(project.contractorSlug) : undefined
  const quotesForThis = quotes.filter((quote) => quote.projectSlug === id)
  const approved = project.milestones.filter((milestone) => milestone.status === 'Approved')
  const remaining = project.milestones
    .filter((milestone) => milestone.status !== 'Approved')
    .reduce((sum, milestone) => sum + milestone.amount, 0)
  const due = project.milestones.find((milestone) => milestone.status !== 'Approved')

  return (
    <>
      <PageHeader
        eyebrow={`${project.county} · ${project.category}`}
        title={project.title}
        intro={project.description}
        picture={contractor?.cover ?? PICTURES.projectFallback}
        crumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Project file' },
        ]}
      >
        <Link
          href="/dashboard"
          className="btn btn-white inline-flex w-full items-center justify-center gap-2 px-6 py-3 sm:w-auto"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to dashboard
        </Link>
        {quotesForThis.length ? (
          <Link href={`/quotes`} className="btn btn-primary w-full px-6 py-3 sm:w-auto">
            {quotesForThis.length} quote{quotesForThis.length === 1 ? '' : 's'} on this project
          </Link>
        ) : null}
      </PageHeader>

      <Section>
        <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat
            icon={CalendarClock}
            label="Next date"
            value={due ? formatDate(due.dueDate) : 'Handover complete'}
            note={due ? due.name : 'Every phase on this file is signed off'}
          />
          <Stat icon={Wallet} label="Approved to date" value={formatKES(project.spent)} note={`${approved.length} phases paid`} />
          <Stat icon={ShieldCheck} label="Still to release" value={formatKES(remaining)} note="Held by you, not by us" />
          <Stat
            icon={Camera}
            label="Evidence on file"
            value={`${project.milestones.reduce((sum, milestone) => sum + milestone.progressPhotos.length, 0)} photos`}
            note={due ? `Next upload expected by ${formatDate(due.dueDate)}` : 'Archive'}
          />
        </div>

        <div className="heading-section ftco-animate mb-6">
          <span className="subheading">Milestone timeline</span>
          <h2 className="mb-4">Phase by phase, with the money attached to each one</h2>
          <p className="mb-0 max-w-3xl">
            Approve a phase only when the photos in it match what you agreed. On a phone the phases stack; from tablet up
            they run across the page so you can read the whole programme at once.
          </p>
        </div>

        <MilestoneTimeline
          projectId={project.id}
          milestones={project.milestones}
          signedIn={Boolean(session?.user)}
        />

        <div className="mt-12 grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-10">
          <div className="flex flex-col gap-6">
            <DashboardCharts spend={SPEND_OVER_TIME} categories={SPEND_BY_CATEGORY} />

            <div className="card p-5 sm:p-6">
              <h2 className="mb-4 text-[19px] font-bold text-[color:var(--nb-secondary)]">The agreement in one paragraph</h2>
              <ul className="mb-0 grid grid-cols-1 gap-3 list-none p-0 text-[14px] leading-relaxed text-[color:var(--gray-dark)] sm:grid-cols-2">
                <li className="rounded-[3px] bg-[color:var(--nb-light)] p-4">
                  <strong className="mb-1 block text-[color:var(--nb-secondary)]">Who is on site</strong>
                  {contractor
                    ? `${contractor.company}, ${contractor.owner}, team of ${contractor.teamSize}, NCA ${contractor.ncaNumber}.`
                    : `Not yet appointed. Accept a quote and the schedule below becomes the working document.`}
                </li>
                <li className="rounded-[3px] bg-[color:var(--nb-light)] p-4">
                  <strong className="mb-1 block text-[color:var(--nb-secondary)]">Programme</strong>
                  {formatDate(project.startDate)} to {formatDate(project.expectedCompletion)}. Slippage on an approved
                  phase moves the dates after it, never the amount owed for work already signed off.
                </li>
                <li className="rounded-[3px] bg-[color:var(--nb-light)] p-4">
                  <strong className="mb-1 block text-[color:var(--nb-secondary)]">Payment</strong>
                  {formatKES(
                    project.milestones.reduce((sum, milestone) => sum + milestone.amount, 0),
                  )}{' '}
                  across {project.milestones.length} phases. Payment pending bank transfer confirmation: {SITE.name} holds
                  the record, you hold the money.
                </li>
                <li className="rounded-[3px] bg-[color:var(--nb-light)] p-4">
                  <strong className="mb-1 block text-[color:var(--nb-secondary)]">Disputes</strong>
                  A phase in disagreement is frozen, not deducted. Both sides upload evidence and the technical desk
                  visits the site when photographs are not enough.
                </li>
              </ul>
            </div>
          </div>

          <div id="thread" className="scroll-mt-24">
            <MessagesPanel
              projectId={project.id}
              contractorName={contractor?.company ?? 'the project desk'}
              signedIn={Boolean(session?.user)}
              seed={demo ? DEMO_MESSAGES : []}
            />
          </div>
        </div>
      </Section>
    </>
  )
}

function Stat({
  icon: Icon,
  label,
  value,
  note,
}: {
  icon: typeof Wallet
  label: string
  value: string
  note: string
}) {
  return (
    <div className="card p-4 sm:p-5">
      <p className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.1em] text-[color:var(--gray)]">
        <Icon className="h-4 w-4 text-[color:var(--nb-primary)]" aria-hidden="true" />
        {label}
      </p>
      <p className="mb-1 text-[20px] font-black leading-none text-[color:var(--nb-secondary)] sm:text-[24px]">{value}</p>
      <p className="mb-0 text-[12px] leading-snug text-[color:var(--gray)]">{note}</p>
    </div>
  )
}

function formatDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })
}

import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ArrowRight,
  Building2,
  CalendarClock,
  CheckCircle2,
  LayoutList,
  MessagesSquare,
  Scale,
  Wallet,
} from 'lucide-react'
import { PageHeader, Section } from '@/components/page-header'
import { DashboardCharts } from '@/components/dashboard-charts-async'
import { auth } from '@/lib/auth'
import { DEMO_OWNER, allQuotes } from '@/lib/quotes-store'
import { storedProjects, toProjectView } from '@/lib/projects-store'

import { DEMO_PROJECTS, SPEND_BY_CATEGORY, SPEND_OVER_TIME } from '@/lib/data/site-data'
import { PICTURES } from '@/lib/images'
import { SITE, formatKES } from '@/lib/site'
import type { Project } from '@/lib/types'

export const metadata: Metadata = {
  title: 'My dashboard',
  description:
    'Every project you are running on Nehemiah Build: current phase, money approved, the next milestone date and what needs your decision today.',
  alternates: { canonical: '/dashboard' },
}

export default async function DashboardPage() {
  const session = await auth()
  const owner = session?.user?.email ?? DEMO_OWNER

  const [projects, quotes] = await Promise.all([storedProjects(owner), allQuotes(owner)])

  const posted: Project[] = projects.map((record) =>
    toProjectView(record, quotes.filter((quote) => quote.projectSlug === record.id).length),
  )
  const all = [...posted, ...DEMO_PROJECTS]

  const totalValue = all.reduce((sum, project) => sum + project.milestones.reduce((s, m) => s + m.amount, 0), 0)
  const totalSpent = all.reduce((sum, project) => sum + project.spent, 0)
  const awaiting = all.reduce(
    (sum, project) => sum + project.milestones.filter((milestone) => milestone.status === 'Completed').length,
    0,
  )
  const nextUp = all
    .flatMap((project) =>
      project.milestones
        .filter((milestone) => milestone.status !== 'Approved')
        .map((milestone) => ({ project, milestone })),
    )
    .sort((a, b) => (a.milestone.dueDate < b.milestone.dueDate ? -1 : 1))
    .slice(0, 4)
  const newQuotes = quotes.filter((quote) => quote.status === 'New').length

  const firstName = (session?.user?.name ?? 'there').split(' ')[0]

  return (
    <>
      <PageHeader
        eyebrow="Project control"
        title={`Good afternoon, ${firstName}`}
        intro="Here is every build you are running, the money approved against it, and the decisions sitting on your side of the table."
        picture={PICTURES.aboutInset}
        crumbs={[{ label: 'Dashboard' }]}
      >
        <Link href="/post-project" className="btn btn-white w-full px-6 py-3 sm:w-auto">
          Post a new project
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
        <Link href="/quotes" className="btn btn-primary w-full px-6 py-3 sm:w-auto">
          Compare quotes
          {newQuotes ? (
            <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-white/20 px-1.5 text-[11px] font-bold">
              {newQuotes}
            </span>
          ) : null}
        </Link>
      </PageHeader>

      <Section>
        <ul className="mb-8 grid grid-cols-2 gap-3 list-none p-0 lg:grid-cols-4">
          <Kpi icon={Building2} label="Projects running" value={String(all.length)} note={`${posted.length} posted from this device`} />
          <Kpi icon={Wallet} label="Approved to date" value={formatKES(totalSpent)} note={`of ${formatKES(totalValue)} programmed`} />
          <Kpi icon={Scale} label="Quotes in your inbox" value={String(quotes.length)} note={`${newQuotes} you have not opened`} />
          <Kpi
            icon={CheckCircle2}
            label="Waiting on your sign off"
            value={String(awaiting)}
            note={awaiting ? 'A phase is complete and needs you' : 'Nothing blocked on you today'}
            accent={awaiting > 0}
          />
        </ul>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-10">
          <div>
            <div className="heading-section ftco-animate mb-6 flex items-end justify-between gap-4">
              <div>
                <span className="subheading">Your projects</span>
                <h2 className="mb-0">Where each site stands</h2>
              </div>
              <Link
                href="/quotes"
                className="hidden min-h-[44px] items-center gap-1 text-[13px] font-semibold text-[color:var(--nb-primary)] sm:inline-flex"
              >
                All quotes
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>

            <ul className="grid grid-cols-1 gap-4 list-none p-0">
              {all.map((project) => (
                <li key={project.id}>
                  <ProjectRow project={project} />
                </li>
              ))}
            </ul>

            <div className="card mt-6 flex flex-col items-start gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="mb-0 text-[14px] leading-relaxed text-[color:var(--gray-dark)]">
                Nothing here yet? A posted project takes about four minutes and starts collecting quotes the same day.
              </p>
              <Link href="/post-project" className="btn btn-primary inline-flex min-h-[48px] items-center gap-2 px-5 py-2 text-[13px]">
                <LayoutList className="h-4 w-4" aria-hidden="true" />
                Post a project
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <DashboardCharts spend={SPEND_OVER_TIME} categories={SPEND_BY_CATEGORY} />

            <div className="card p-5 sm:p-6">
              <h2 className="mb-1 text-[19px] font-bold text-[color:var(--nb-secondary)]">Next dates to hold</h2>
              <p className="mb-4 text-[13px] leading-relaxed text-[color:var(--gray)]">
                Milestones due in the coming weeks, soonest first.
              </p>
              <ol className="mb-0 grid grid-cols-1 gap-3 list-none p-0">
                {nextUp.length ? (
                  nextUp.map(({ project, milestone }) => (
                    <li key={`${project.id}-${milestone.id}`}>
                      <Link
                        href={`/dashboard/project/${project.id}`}
                        className="flex min-h-[44px] items-start gap-3 rounded-[3px] p-2 transition-colors hover:bg-[color:var(--nb-light)]"
                      >
                        <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[color:var(--nb-primary)]/12 text-[color:var(--nb-primary)]">
                          <CalendarClock className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-[14px] font-bold text-[color:var(--nb-secondary)]">
                            {milestone.name}
                          </span>
                          <span className="block truncate text-[13px] text-[color:var(--gray)]">
                            {formatDate(milestone.dueDate)} &middot; {formatKES(milestone.amount)} &middot;{' '}
                            {project.title}
                          </span>
                        </span>
                      </Link>
                    </li>
                  ))
                ) : (
                  <li className="text-[14px] text-[color:var(--gray)]">Every phase on your projects is signed off.</li>
                )}
              </ol>
            </div>

            <div className="card p-5 sm:p-6">
              <h2 className="mb-3 flex items-center gap-2 text-[19px] font-bold text-[color:var(--nb-secondary)]">
                <MessagesSquare className="h-5 w-5 text-[color:var(--nb-primary)]" aria-hidden="true" />
                Open threads
              </h2>
              <p className="mb-4 text-[13px] leading-relaxed text-[color:var(--gray)]">
                Messages with your contractors live on each project file, so the agreement and the conversation stay in
                one place.
              </p>
              <ul className="mb-0 grid grid-cols-1 gap-2 list-none p-0">
                {all.slice(0, 3).map((project) => (
                  <li key={project.id}>
                    <Link
                      href={`/dashboard/project/${project.id}#thread`}
                      className="flex min-h-[44px] items-center justify-between gap-3 rounded-[3px] bg-[color:var(--nb-light)] px-3 py-2 text-[14px] font-semibold text-[color:var(--nb-secondary)] transition-colors hover:bg-[color:var(--nb-primary)]/10"
                    >
                      <span className="truncate">{project.contractorCompany ?? project.title}</span>
                      <ArrowRight className="h-4 w-4 shrink-0 text-[color:var(--nb-primary)]" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Section>

      {!session?.user ? (
        <Section tone="light" className="!py-10 sm:!py-12">
          <p className="mx-auto mb-0 max-w-3xl text-center text-[14px] leading-relaxed text-[color:var(--gray-dark)]">
            You are seeing sample projects for {SITE.name}. Anything you post from this browser is stored against your
            own account and appears here alongside them.
          </p>
        </Section>
      ) : null}
    </>
  )
}

function ProjectRow({ project }: { project: Project }) {
  const approved = project.milestones.filter((milestone) => milestone.status === 'Approved').length
  const needsYou = project.milestones.some((milestone) => milestone.status === 'Completed')

  return (
    <article className="card p-5 sm:p-6">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="badge-status">{project.county}</span>
            {needsYou ? <span className="badge-progress">Needs your sign off</span> : null}
            <span className="text-[12px] text-[color:var(--gray)]">{project.id}</span>
          </div>
          <h3 className="mb-1 text-[19px] font-bold leading-snug text-[color:var(--nb-secondary)]">
            <Link href={`/dashboard/project/${project.id}`} className="hover:text-[color:var(--nb-primary)]">
              {project.title}
            </Link>
          </h3>
          <p className="mb-0 text-[14px] text-[color:var(--gray)]">
            {project.contractorCompany ? `${project.contractorCompany} · ` : ''}
            {project.currentPhase}
          </p>
        </div>
        <Link
          href={`/dashboard/project/${project.id}`}
          className="btn btn-outline inline-flex min-h-[44px] shrink-0 items-center justify-center gap-2 px-4 py-2 text-[13px]"
        >
          Open file
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      <div className="mb-3">
        <div className="mb-1 flex items-center justify-between text-[13px]">
          <span className="font-semibold text-[color:var(--nb-secondary)]">{project.progress}% complete</span>
          <span className="text-[color:var(--gray)]">
            {approved} of {project.milestones.length} phases approved
          </span>
        </div>
        <div className="progress-track" role="img" aria-label={`${project.progress} per cent complete`}>
          <span className="progress-bar-nb" style={{ width: `${project.progress}%` }} />
        </div>
      </div>

      <dl className="mb-0 grid grid-cols-2 gap-3 text-[13px] sm:grid-cols-4">
        <div>
          <dt className="text-[color:var(--gray)]">Approved spend</dt>
          <dd className="mb-0 text-[15px] font-bold text-[color:var(--nb-secondary)]">{formatKES(project.spent)}</dd>
        </div>
        <div>
          <dt className="text-[color:var(--gray)]">Next date</dt>
          <dd className="mb-0 text-[15px] font-bold text-[color:var(--nb-secondary)]">
            {formatDate(project.nextMilestoneDate)}
          </dd>
        </div>
        <div>
          <dt className="text-[color:var(--gray)]">Started</dt>
          <dd className="mb-0 text-[15px] font-bold text-[color:var(--nb-secondary)]">{formatDate(project.startDate)}</dd>
        </div>
        <div>
          <dt className="text-[color:var(--gray)]">Handover</dt>
          <dd className="mb-0 text-[15px] font-bold text-[color:var(--nb-secondary)]">
            {formatDate(project.expectedCompletion)}
          </dd>
        </div>
      </dl>
    </article>
  )
}

function Kpi({
  icon: Icon,
  label,
  value,
  note,
  accent = false,
}: {
  icon: typeof Building2
  label: string
  value: string
  note: string
  accent?: boolean
}) {
  return (
    <li className={`card p-4 sm:p-5 ${accent ? 'ring-1 ring-[color:var(--nb-primary)]' : ''}`}>
      <p className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.1em] text-[color:var(--gray)]">
        <Icon className={`h-4 w-4 ${accent ? 'text-[color:var(--nb-primary)]' : ''}`} aria-hidden="true" />
        {label}
      </p>
      <p className="mb-1 text-[22px] font-black leading-none text-[color:var(--nb-secondary)] sm:text-[26px]">
        {value}
      </p>
      <p className="mb-0 text-[12px] leading-snug text-[color:var(--gray)]">{note}</p>
    </li>
  )
}

function formatDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })
}

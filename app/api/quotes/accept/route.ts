import { guard, ok, fail } from '@/lib/api'
import { acceptQuoteSchema } from '@/lib/validation'
import { auth } from '@/lib/auth'
import { CONTRACTORS } from '@/lib/data/contractors'
import { DEMO_OWNER, allQuotes, updateQuote } from '@/lib/quotes-store'
import { readProject, writeProject } from '@/lib/projects-store'
import type { Milestone } from '@/lib/types'
import { sendMail } from '@/lib/mailer'
import { SITE } from '@/lib/site'

export const runtime = 'nodejs'

/** PUT /api/quotes/accept, homeowner accepts a contractor quote. */
export async function PUT(request: Request) {
  const session = await auth()
  if (!session?.user) return fail('Sign in to accept a quote.', { code: 'AUTH_REQUIRED' }, 401)

  const result = await guard({ request, schema: acceptQuoteSchema, action: 'quote-accept' })
  if (!result.data) return result.response

  const owner = session.user.email ?? DEMO_OWNER
  const { quoteId } = result.data

  const quotes = await allQuotes(owner)
  const quote = quotes.find((item) => item.id === quoteId)
  if (!quote) return fail('That quote is no longer in your inbox. Refresh and try again.', {}, 404)
  if (quote.status === 'Accepted') {
    return fail('You already accepted this quote.', { code: 'ALREADY_ACCEPTED' }, 409)
  }

  const contractor = CONTRACTORS.find((item) => item.slug === quote.contractorSlug)

  await updateQuote(owner, quoteId, { status: 'Accepted' })
  for (const other of quotes) {
    if (other.id !== quoteId && other.projectSlug === quote.projectSlug) {
      await updateQuote(owner, other.id, { status: 'Declined' })
    }
  }

  // Accepting a quote turns the project file into a running project: the
  // contractor is attached and the phase schedule they will be paid against is
  // written now, so the timeline on the dashboard is the same one they quoted.
  const stored = await readProject(owner, quote.projectSlug)
  if (stored && !stored.contractorSlug) {
    const milestones = buildMilestones(quote.amount).map((milestone, index, list) => ({
      id: `m${index + 1}`,
      name: milestone.name,
      dueDate: dueDateFor(index, list.length, stored.startDate, stored.deadline),
      amount: milestone.amount,
      status: (index === 0 ? 'In Progress' : 'Pending'),
      progressPhotos: [],
    })) satisfies Milestone[]

    await writeProject(owner, {
      ...stored,
      contractorSlug: quote.contractorSlug,
      contractorCompany: quote.contractorCompany,
      milestones,
      status: 'In progress',
      progress: 0,
      spent: 0,
    })
  }

  const mail = await sendMail({
    to: session.user.email ?? '',
    subject: `Quote accepted: ${quote.projectTitle}`,
    heading: 'Your acceptance is recorded',
    intro:
      'The contractor has been notified. The next step happens off the quote thread: they send a milestone schedule, you approve it, and only then does the first payment band go live.',
    lines: [
      ['Project', quote.projectTitle],
      ['Contractor', quote.contractorCompany],
      ['Trade', quote.trade],
      ['Accepted amount', `KES ${quote.amount.toLocaleString('en-KE')}`],
      ['Programme', `${quote.timelineWeeks} weeks`],
      ['NCA number', contractor?.ncaNumber ?? 'On file'],
    ],
    note: `${SITE.name} is not a payment processor. Money moves between you and the contractor; we hold the milestone record that both sides agreed to.`,
  })

  return ok({
    quoteId,
    status: 'Accepted',
    contractorSlug: quote.contractorSlug,
    milestoneDraft: contractor
      ? buildMilestones(quote.amount)
      : [
          { name: 'Mobilisation and setting out', share: 0.1 },
          { name: 'Foundation complete', share: 0.25 },
          { name: 'Superstructure to lintel', share: 0.3 },
          { name: 'Roof covered and watertight', share: 0.2 },
          { name: 'Handover and snag list', share: 0.15 },
        ],
    mail: { queued: mail.queued, skipped: mail.skipped },
    redirectTo: `/dashboard/project/${quote.projectSlug}`,
  })
}

/** Spread the programme evenly between the first day on site and handover. */
function dueDateFor(index: number, total: number, start: string, end: string): string {
  const from = new Date(start).getTime()
  const to = new Date(end).getTime()
  if (Number.isNaN(from) || Number.isNaN(to) || to <= from) {
    const base = Date.now() + (index + 1) * 30 * 86_400_000
    return new Date(base).toISOString().slice(0, 10)
  }
  const at = from + ((to - from) * (index + 1)) / total
  return new Date(at).toISOString().slice(0, 10)
}

function buildMilestones(amount: number) {
  const plan = [
    { name: 'Mobilisation and setting out', share: 0.1 },
    { name: 'Foundation complete', share: 0.25 },
    { name: 'Superstructure to lintel', share: 0.3 },
    { name: 'Roof covered and watertight', share: 0.2 },
    { name: 'Handover and snag list', share: 0.15 },
  ]
  return plan.map((item) => ({
    name: item.name,
    amount: Math.round((amount * item.share) / 1000) * 1000,
  }))
}

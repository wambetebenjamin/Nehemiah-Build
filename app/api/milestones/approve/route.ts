import { guard, ok, fail } from '@/lib/api'
import { approveMilestoneSchema } from '@/lib/validation'
import { auth } from '@/lib/auth'
import { readProject, writeProject } from '@/lib/projects-store'
import { store, KEYS } from '@/lib/kv'
import { sendMail } from '@/lib/mailer'
import { DEMO_OWNER } from '@/lib/quotes-store'
import { formatKES, SITE } from '@/lib/site'
import { DEMO_PROJECTS } from '@/lib/data/site-data'

export const runtime = 'nodejs'

/**
 * PUT /api/milestones/approve.
 *
 * Approving a milestone records the sign off and starts the payment release
 * queue. Nehemiah Build is not a payment processor, so no money moves here: the
 * response carries the bank transfer instructions the homeowner uses to pay.
 */
export async function PUT(request: Request) {
  const session = await auth()
  if (!session?.user) return fail('Sign in to approve a milestone.', { code: 'AUTH_REQUIRED' }, 401)

  const result = await guard({ request, schema: approveMilestoneSchema, action: 'milestone-approval' })
  if (!result.data) return result.response

  const { projectId, milestoneId, note } = result.data
  const owner = session.user.email ?? DEMO_OWNER

  const stored = await readProject(owner, projectId)
  const demo = DEMO_PROJECTS.find((item) => item.id === projectId)

  if (!stored && !demo) return fail('That project is not in your account.', {}, 404)

  if (demo && !stored) {
    // Seed a stored copy from the demo fixture so approvals persist.
    await writeProject(owner, {
      id: demo.id,
      title: demo.title,
      projectType: 'New house build',
      description: demo.description,
      county: demo.county,
      sizeValue: '50 by 100',
      sizeUnit: 'plot',
      startDate: demo.startDate,
      deadline: demo.expectedCompletion,
      flexibility: 'slight',
      budgetBand: demo.budgetBand,
      budgetLabel: demo.budgetBand,
      contactName: session.user.name ?? 'Homeowner',
      contactPhone: '+254 712 345 678',
      contactEmail: owner,
      photoUrls: [],
      owner,
      createdAt: new Date().toISOString(),
      status: 'In progress',
      contractorSlug: demo.contractorSlug,
      contractorCompany: demo.contractorCompany,
      milestones: demo.milestones,
      progress: demo.progress,
      spent: demo.spent,
    })
  }

  const record = await readProject(owner, projectId)
  if (!record) return fail('Could not load that project. Try again.', {}, 500)

  const milestones = record.milestones ?? []
  const index = milestones.findIndex((milestone) => milestone.id === milestoneId)
  if (index === -1) return fail('That milestone is no longer on the project. Refresh the page.', {}, 404)

  const milestone = milestones[index]
  if (milestone.status === 'Approved') {
    return fail('That milestone is already approved and paid.', { code: 'ALREADY_APPROVED' }, 409)
  }
  if (milestone.status !== 'Completed') {
    return ok({
      projectId,
      milestoneId,
      status: milestone.status,
      approved: false,
      message:
        'Only a milestone the contractor has marked as complete can be approved. Ask them to upload the closing photos for this phase.',
    })
  }

  milestones[index] = { ...milestone, status: 'Approved' }
  const approvedValue = milestones
    .filter((item) => item.status === 'Approved')
    .reduce((sum, item) => sum + item.amount, 0)

  await writeProject(owner, {
    ...record,
    milestones,
    spent: approvedValue,
    progress: Math.round((milestones.filter((m) => m.status === 'Approved').length / milestones.length) * 100),
    status: milestones.every((item) => item.status === 'Approved') ? 'Handed over' : 'In progress',
  })

  if (note?.trim()) {
    const thread = await store.readJson<unknown[]>(KEYS.messages(projectId), [])
    await store.writeJson(KEYS.messages(projectId), [
      ...thread,
      {
        id: `msg-${Date.now().toString(36)}`,
        from: 'homeowner',
        author: session.user.name ?? 'Homeowner',
        body: `Milestone note: ${note.trim()}`,
        at: new Date().toISOString(),
      },
    ])
  }

  const mail = await sendMail({
    to: owner,
    subject: `Milestone approved: ${milestone.name}`,
    heading: 'Milestone approved, payment queued',
    intro:
      'Your approval is recorded against the project. Because Nehemiah Build does not move money, the release happens as a bank transfer you make yourself, using the details below.',
    lines: [
      ['Project', record.title],
      ['Milestone', milestone.name],
      ['Amount due', formatKES(milestone.amount)],
      ['Approved on', new Date().toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' })],
      ['Total approved so far', formatKES(approvedValue)],
    ],
    note: 'Payment pending bank transfer confirmation.',
  })

  return ok({
    projectId,
    milestoneId,
    approved: true,
    status: 'Approved',
    amount: milestone.amount,
    totalApproved: approvedValue,
    paymentMessage: 'Payment pending bank transfer confirmation.',
    mail: { queued: mail.queued, skipped: mail.skipped },
    supportHref: `https://wa.me/${SITE.whatsappNumber}`,
  })
}

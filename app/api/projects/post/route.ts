import { guard, ok, unauthorized } from '@/lib/api'
import { postProjectSchema } from '@/lib/validation'
import { auth } from '@/lib/auth'
import { store, KEYS } from '@/lib/kv'
import { sendMail } from '@/lib/mailer'
import { quotesForProject } from '@/lib/quotes'
import { DEMO_OWNER } from '@/lib/quotes-store'
import { SITE, BUDGET_BANDS, COUNTIES } from '@/lib/site'

export const runtime = 'nodejs'

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 60)
}

/** POST /api/projects/post, protected. reCAPTCHA v3 first, then Zod, then mail. */
export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user) return unauthorized('Sign in before posting a project.')

  const result = await guard({ request, schema: postProjectSchema, action: 'post-project' })
  if (!result.data) return result.response

  const data = result.data
  const owner = session.user.email ?? DEMO_OWNER
  const id = `prj-${slugify(data.title)}-${Date.now().toString(36).slice(-4)}`
  const now = new Date().toISOString()

  const countyLabel = COUNTIES.find((county) => county.toLowerCase() === data.county.toLowerCase()) ?? data.county
  const budgetLabel = BUDGET_BANDS.find((band) => band.value === data.budgetBand)?.label ?? data.budgetBand

  const record = {
    id,
    title: data.title,
    projectType: data.projectType,
    description: data.description,
    county: countyLabel,
    sizeValue: data.sizeValue,
    sizeUnit: data.sizeUnit,
    startDate: data.startDate,
    deadline: data.deadline,
    flexibility: data.flexibility,
    budgetBand: data.budgetBand,
    budgetLabel,
    contactName: data.contactName,
    contactPhone: data.contactPhone,
    contactEmail: data.contactEmail,
    photoUrls: data.photoUrls ?? [],
    owner,
    createdAt: now,
    status: 'Open for quotes',
  }

  const existing = await store.readJson<unknown[]>(KEYS.projects(owner), [])
  await store.writeJson(KEYS.projects(owner), [record, ...existing])

  const quotes = quotesForProject({
    id,
    title: data.title,
    projectType: data.projectType,
    county: countyLabel,
    budgetBand: data.budgetBand,
  })
  await store.writeJson(KEYS.quotes(owner, id), quotes)

  const mail = await sendMail({
    to: data.contactEmail,
    subject: `Your project is live: ${data.title}`,
    heading: 'Your project is open for quotes',
    intro:
      'We published your project to verified contractors whose trade and county match what you posted. You will start seeing quotes in your inbox; you are never obliged to accept any of them.',
    lines: [
      ['Project reference', id],
      ['Project', data.title],
      ['Type', data.projectType],
      ['County', countyLabel],
      ['Budget band', budgetLabel],
      ['Target start', data.startDate],
      ['Target completion', data.deadline],
      ['Quotes released to', `${quotes.length} contractors`],
    ],
    note: `Keep this reference. If anything looks wrong on the ${SITE.name} side, quote it when you contact us and we will find the file immediately.`,
  })

  return ok({
    projectId: id,
    quotesReleased: quotes.length,
    mail: { queued: mail.queued, skipped: mail.skipped },
    redirectTo: `/quotes?project=${id}`,
  })
}

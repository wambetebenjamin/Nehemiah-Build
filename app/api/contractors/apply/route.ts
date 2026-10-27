import { guard, ok, fail } from '@/lib/api'
import { contractorApplicationSchema } from '@/lib/validation'
import { store, KEYS } from '@/lib/kv'
import { sendMail } from '@/lib/mailer'
import { formatKES, SITE } from '@/lib/site'

export const runtime = 'nodejs'

type Application = {
  id: string
  company: string
  owner: string
  trade: string
  county: string
  ncaNumber: string
  yearsInOperation: number
  phone: string
  email: string
  portfolioDescription: string
  photoUrls: string[]
  status: 'Submitted' | 'Under review' | 'Verified' | 'Rejected'
  createdAt: string
}

/**
 * POST /api/contractors/apply, public. reCAPTCHA v3 first, then Zod, then the
 * application is queued for the verification desk and confirmed by email.
 */
export async function POST(request: Request) {
  const result = await guard({ request, schema: contractorApplicationSchema, action: 'contractor-application' })
  if (!result.data) return result.response

  const data = result.data

  const existingIndex = await store.readJson<Application[]>(KEYS.applications(), [])
  const duplicate = existingIndex.find(
    (item) =>
      item.ncaNumber.toLowerCase() === data.ncaNumber.toLowerCase() ||
      item.email.toLowerCase() === data.email.toLowerCase(),
  )

  if (duplicate) {
    return fail(
      'We already have an application under that NCA number or email. Reply to the confirmation email instead of applying twice.',
      { code: 'DUPLICATE_APPLICATION', applicationId: duplicate.id },
      409,
    )
  }

  const application: Application = {
    id: `NB-APP-${Date.now().toString(36).toUpperCase().slice(-6)}`,
    company: data.company,
    owner: data.owner,
    trade: data.trade,
    county: data.county,
    ncaNumber: data.ncaNumber,
    yearsInOperation: data.yearsInOperation,
    phone: data.phone,
    email: data.email,
    portfolioDescription: data.portfolioDescription,
    photoUrls: data.photoUrls,
    status: 'Submitted',
    createdAt: new Date().toISOString(),
  }

  await store.writeJson(KEYS.applications(), [application, ...existingIndex])

  const mail = await sendMail({
    to: application.email,
    subject: `Application received: ${application.company}`,
    heading: 'Your application is with the verification desk',
    intro:
      'We check three things before your profile goes live: NCA registration status, your national ID, and at least two completed sites we can visit or call. Most applications finish this in five working days.',
    lines: [
      ['Application reference', application.id],
      ['Company', application.company],
      ['Trade', application.trade],
      ['County', application.county],
      ['NCA number', application.ncaNumber],
      ['Portfolio images', `${application.photoUrls.length} uploaded`],
    ],
    note: `Nothing is published while your file is open. When it clears, your profile appears in the directory and you can quote on projects in ${application.county}. Questions about your file: WhatsApp ${SITE.whatsappNumber} with your reference. There is no joining fee, and no commission on any quote you win.`,
  })

  return ok({
    applicationId: application.id,
    status: application.status,
    photoCount: application.photoUrls.length,
    mail: { queued: mail.queued, skipped: mail.skipped },
  })
}

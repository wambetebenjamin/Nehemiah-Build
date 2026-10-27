import { guard, ok } from '@/lib/api'
import { enquirySchema } from '@/lib/validation'
import { store, KEYS } from '@/lib/kv'
import { sendMail } from '@/lib/mailer'
import { SITE } from '@/lib/site'

export const runtime = 'nodejs'

/** POST /api/send-enquiry, public "Inquire Now" form. reCAPTCHA v3 then Zod. */
export async function POST(request: Request) {
  const result = await guard({ request, schema: enquirySchema, action: 'enquiry' })
  if (!result.data) return result.response

  const data = result.data
  const enquiryId = `NB-ENQ-${Date.now().toString(36).toUpperCase().slice(-6)}`

  const index = await store.readJson<unknown[]>(KEYS.enquiries(), [])
  await store.writeJson(KEYS.enquiries(), [
    { id: enquiryId, ...data, createdAt: new Date().toISOString() },
    ...index,
  ])

  const mail = await sendMail({
    to: process.env.SMTP_USER || 'hello@nehemia.build',
    subject: `New enquiry ${enquiryId}: ${data.service}`,
    heading: 'A homeowner needs an answer',
    intro: `${data.firstName} ${data.lastName ?? ''}`.trim() + ' sent this from the site. Reply on the phone number and copy the email if there is one.',
    lines: [
      ['Reference', enquiryId],
      ['Name', `${data.firstName} ${data.lastName ?? ''}`.trim()],
      ['Phone', data.phone],
      ['Email', data.email || 'Not given'],
      ['Need', data.service],
      ['Message', data.message],
    ],
    note: `Target: same working day. ${SITE.name} project desk.`,
  })

  return ok({
    enquiryId,
    mail: { queued: mail.queued, skipped: mail.skipped },
    replyOn: data.phone,
    whatsapp: `https://wa.me/${SITE.whatsappNumber}`,
  })
}

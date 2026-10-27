import { guard, ok, fail } from '@/lib/api'
import { registerSchema } from '@/lib/validation'
import { createUser, userExists } from '@/lib/users'
import { sendMail } from '@/lib/mailer'
import { SITE } from '@/lib/site'

export const runtime = 'nodejs'

/** POST /api/auth/register, homeowner sign up. reCAPTCHA v3 then Zod. */
export async function POST(request: Request) {
  const result = await guard({ request, schema: registerSchema, action: 'register' })
  if (!result.data) return result.response

  const { name, email, password, county, phone } = result.data

  if (await userExists(email)) {
    return fail('An account already uses that email. Sign in instead, or reset the password.', {
      code: 'EMAIL_TAKEN',
      issues: [{ field: 'email', message: 'That email is already registered.' }],
    })
  }

  const user = await createUser({ name, email, password, county, phone })

  const mail = await sendMail({
    to: email,
    subject: `Welcome to ${SITE.name}, ${name.split(' ')[0]}`,
    heading: 'Your account is open',
    intro:
      'You can now post a project and start receiving quotes from verified contractors. Keep this email: the link to your dashboard is in every message we send from now on.',
    lines: [
      ['Name', name],
      ['County', county],
      ['Phone', phone],
      ['Account reference', user.id],
    ],
    note: 'If you did not create this account, tell us on the number in this email so we can lock it.',
  })

  return ok({
    userId: user.id,
    email: user.email,
    name: user.name,
    county: user.county,
    mail: { queued: mail.queued, skipped: mail.skipped },
    redirectTo: '/post-project',
  })
}

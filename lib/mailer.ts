import { SITE } from '@/lib/site'

/**
 * Transactional email (Nodemailer over SMTP).
 *
 * Confirmation mail for new projects, contractor applications and enquiries is
 * sent through the SMTP_* variables. When SMTP_HOST is empty we do not throw:
 * the payload is returned as `queued: false` so the API can still confirm to
 * the user that the application was recorded, and the message lands in the
 * server log for debugging.
 */

export type MailInput = {
  to: string
  subject: string
  heading: string
  intro: string
  lines?: Array<[label: string, value: string]>
  note?: string
}

export type MailResult = { queued: boolean; skipped?: boolean; error?: string }

const smtpConfigured = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER)

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function render(input: MailInput): { text: string; html: string } {
  const rows = (input.lines ?? [])
    .map(
      ([label, value]) =>
        `<tr><td style="padding:6px 14px 6px 0;color:#6c757d;font-size:14px;">${escapeHtml(label)}</td><td style="padding:6px 0;color:#040e26;font-weight:700;font-size:14px;">${escapeHtml(value)}</td></tr>`,
    )
    .join('')

  const text = [
    input.intro,
    ...(input.lines ?? []).map(([label, value]) => `${label}: ${value}`),
    input.note ?? '',
    SITE.tagline,
  ]
    .filter(Boolean)
    .join('\n\n')

  const html = `<!doctype html><html><body style="margin:0;background:#f8f9fa;padding:24px;font-family:Roboto,Arial,sans-serif;">
  <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:6px;overflow:hidden;box-shadow:0 10px 34px -15px rgba(0,0,0,0.24);">
    <div style="background:#040e26;padding:24px 28px;">
      <span style="display:inline-block;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#fc5e28;font-weight:600;">${escapeHtml(SITE.name)}</span>
      <h1 style="margin:8px 0 0;color:#ffffff;font-size:22px;font-weight:700;line-height:1.3;">${escapeHtml(input.heading)}</h1>
    </div>
    <div style="padding:24px 28px;">
      <p style="margin:0 0 16px;color:#495057;font-size:15px;line-height:1.8;">${escapeHtml(input.intro)}</p>
      ${rows ? `<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;background:#f8f9fa;border-radius:4px;padding:8px 0;">${rows}</table>` : ''}
      ${input.note ? `<p style="margin:16px 0 0;color:#6c757d;font-size:13px;line-height:1.8;">${escapeHtml(input.note)}</p>` : ''}
      <p style="margin:24px 0 0;color:#040e26;font-size:14px;font-weight:700;">${escapeHtml(SITE.tagline)}</p>
    </div>
  </div>
  </body></html>`

  return { text, html }
}

export async function sendMail(input: MailInput): Promise<MailResult> {
  const from = process.env.SMTP_FROM || process.env.SMTP_USER || `Nehemiah Build <no-reply@${'localhost'}>`

  if (!smtpConfigured) {
    // eslint-disable-next-line no-console
    console.info(`[mail:skipped] ${input.subject} -> ${input.to}`)
    return { queued: false, skipped: true }
  }

  try {
    const nodemailer = (await import('nodemailer')) as unknown as {
      createTransport: (options: Record<string, unknown>) => {
        sendMail: (message: Record<string, unknown>) => Promise<unknown>
      }
    }
    const transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 465),
      secure: Number(process.env.SMTP_PORT || 465) === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    })

    const { text, html } = render(input)

    await transport.sendMail({
      from,
      to: input.to,
      subject: input.subject,
      text,
      html,
    })

    return { queued: true }
  } catch (error) {
    return {
      queued: false,
      error: error instanceof Error ? error.message : 'Mail delivery failed',
    }
  }
}

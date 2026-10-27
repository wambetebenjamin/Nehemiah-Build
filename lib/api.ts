import { NextResponse } from 'next/server'
import { ZodError, type ZodSchema } from 'zod'
import { verifyRecaptcha, type CaptchaAction } from '@/lib/captcha'

/** Consistent JSON envelope for every API route. */
export function ok<T extends Record<string, unknown>>(data: T, init?: ResponseInit) {
  return NextResponse.json({ success: true, ...data }, init)
}

export function fail(message: string, extra?: Record<string, unknown>, status = 400) {
  return NextResponse.json({ success: false, error: message, ...extra }, { status })
}

export function unauthorized(message = 'Sign in to continue.') {
  return fail(message, { code: 'AUTH_REQUIRED' }, 401)
}

export function parseBody<T>(schema: ZodSchema<T>, payload: unknown) {
  const result = schema.safeParse(payload)
  if (result.success) return { data: result.data, issues: undefined }
  return {
    data: undefined,
    issues: flattenIssues(result.error),
  }
}

export function flattenIssues(error: ZodError): Array<{ field: string; message: string }> {
  return error.issues.map((issue) => ({
    field: issue.path.join('.') || 'form',
    message: issue.message,
  }))
}

/**
 * Every POST route runs captcha first, then Zod. If the v3 score is too low the
 * client is told to render a visible challenge instead of being rejected outright.
 */
export type GuardResult<T> =
  | { data: T; challenge: false; response?: undefined }
  | { data: undefined; challenge: boolean; response: NextResponse }

export async function guard<T>(params: {
  request: Request
  schema: ZodSchema<T>
  action: CaptchaAction
}): Promise<GuardResult<T>> {
  let payload: unknown = null
  try {
    payload = await params.request.json()
  } catch {
    payload = null
  }

  const body = (payload ?? {}) as Record<string, unknown>
  const captcha = await verifyRecaptcha(body.recaptchaToken, params.action)

  if (!captcha.success) {
    const challenge = captcha.lowScore
    return {
      data: undefined,
      challenge,
      response: fail(
        captcha.lowScore
          ? 'Please confirm you are not a robot in the box below the form.'
          : captcha.error ?? 'Security check failed. Please try again.',
        {
          code: captcha.lowScore ? 'CAPTCHA_CHALLENGE_REQUIRED' : 'CAPTCHA_FAILED',
          ...(captcha.lowScore ? { challengeRequired: true } : {}),
        },
        captcha.lowScore ? 200 : 400,
      ),
    }
  }

  const parsed = parseBody(params.schema, body)
  if (!parsed.data) {
    return {
      data: undefined,
      challenge: false,
      response: fail('Some fields need attention.', { issues: parsed.issues }, 422),
    }
  }

  return { data: parsed.data, challenge: false }
}

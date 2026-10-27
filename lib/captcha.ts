/**
 * Server side reCAPTCHA verification.
 *
 * RECAPTCHA_SECRET_KEY is server only and never shipped to the browser. When
 * it is absent (fresh clone, CI preview) verification is skipped so the product
 * remains testable; that skip is logged and never inferred on the client.
 */

const VERIFY_ENDPOINT = 'https://www.google.com/recaptcha/api/siteverify'
export const MIN_SCORE = 0.5

export type CaptchaAction =
  | 'post-project'
  | 'review'
  | 'contractor-application'
  | 'register'
  | 'enquiry'
  | 'message'
  | 'milestone-approval'
  | 'quote-accept'

export type CaptchaResult =
  | { success: true; score?: number; skipped: boolean; lowScore: false; error?: undefined }
  | { success: false; lowScore: boolean; skipped: boolean; score?: number; error?: string }

export const captchaAction = {
  postProject: 'post-project' as CaptchaAction,
  review: 'review' as CaptchaAction,
  application: 'contractor-application' as CaptchaAction,
  register: 'register' as CaptchaAction,
  enquiry: 'enquiry' as CaptchaAction,
}

const secret = process.env.RECAPTCHA_SECRET_KEY

export async function verifyRecaptcha(token: unknown, action?: CaptchaAction): Promise<CaptchaResult> {
  if (!secret) {
    return { success: true, skipped: true, lowScore: false }
  }

  if (typeof token !== 'string' || token.length === 0) {
    return {
      success: false,
      lowScore: false,
      skipped: false,
      error: 'Missing captcha token. Please reload the page and try again.',
    }
  }

  try {
    const response = await fetch(VERIFY_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: token }),
      cache: 'no-store',
    })

    if (!response.ok) {
      return {
        success: false,
        lowScore: false,
        skipped: false,
        error: 'The security service is unreachable. Please try again in a moment.',
      }
    }

    const payload = (await response.json()) as {
      success: boolean
      score?: number
      action?: string
      'error-codes'?: string[]
    }

    if (!payload.success) {
      return {
        success: false,
        lowScore: false,
        skipped: false,
        error: 'Security check failed. Please reload and try again.',
      }
    }

    if (action && payload.action && payload.action !== action) {
      return {
        success: false,
        lowScore: false,
        skipped: false,
        error: 'Security check did not match this form. Please try again.',
      }
    }

    if (typeof payload.score === 'number' && payload.score < MIN_SCORE) {
      return { success: false, lowScore: true, skipped: false, score: payload.score }
    }

    return { success: true, score: payload.score, skipped: false, lowScore: false }
  } catch {
    return {
      success: false,
      lowScore: false,
      skipped: false,
      error: 'The security service is unreachable. Please try again in a moment.',
    }
  }
}

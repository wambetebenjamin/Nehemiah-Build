'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useCaptchaStore } from '@/lib/stores'
import { useCaptchaToken } from '@/components/recaptcha'

/**
 * Shared form plumbing: one submit path that always (a) mints a reCAPTCHA v3
 * token, (b) posts JSON, and (c) upgrades to a visible v2 challenge when the
 * server asks for it.
 */

export type ApiResult<T = Record<string, unknown>> = {
  ok: boolean
  status: number
  data: (T & { success?: boolean; error?: string; issues?: FieldIssue[]; challengeRequired?: boolean }) | null
  message: string
  issues: FieldIssue[]
}

export type FieldIssue = { field: string; message: string }

export async function apiRequest<T>(
  url: string,
  options: { method?: 'POST' | 'PUT' | 'GET'; body?: unknown; token?: string; challengeToken?: string },
): Promise<ApiResult<T>> {
  const method = options.method ?? 'POST'
  const payload = options.body ?? {}

  let response: Response
  try {
    response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: method === 'GET' ? undefined : JSON.stringify(payload),
      credentials: 'same-origin',
    })
  } catch {
    return {
      ok: false,
      status: 0,
      data: null,
      message: 'We could not reach the server. Check your connection and try again.',
      issues: [],
    }
  }

  let json: Record<string, unknown> | null = null
  try {
    json = (await response.json()) as Record<string, unknown>
  } catch {
    json = null
  }

  const data = (json ?? null) as ApiResult<T>['data']
  const message =
    (data?.error as string | undefined) ??
    (response.ok ? 'Done.' : `The server responded with ${response.status}. Please try again.`)

  return {
    ok: response.ok && Boolean(data?.success ?? true),
    status: response.status,
    data,
    message,
    issues: Array.isArray(data?.issues) ? (data!.issues as FieldIssue[]) : [],
  }
}

export type SubmitOutcome = 'success' | 'error' | 'idle'

export function useCaptchaForm<T>(action: string, endpoint: string, method: 'POST' | 'PUT' = 'POST') {
  const getToken = useCaptchaToken()
  const [result, setResult] = useState<ApiResult<T> | null>(null)
  const [pending, setPending] = useState(false)
  const [challengeOpen, setChallengeOpen] = useState(false)
  const [challengeToken, setChallengeToken] = useState('')
  const challengeResolve = useRef<((token: string) => void) | null>(null)

  useEffect(() => {
    if (!challengeOpen) return
    useCaptchaStore.getState().setChallengeRequired(true)
    return () => useCaptchaStore.getState().setChallengeRequired(false)
  }, [challengeOpen])

  const submit = useCallback(
    async (values: Record<string, unknown>) => {
      setPending(true)
      setResult(null)

      const token = await getToken(action)
      let response = await apiRequest<T>(endpoint, {
        method,
        token,
        body: { ...values, recaptchaToken: token },
      })

      if (response.data?.challengeRequired) {
        const challenged = await new Promise<string>((resolve) => {
          challengeResolve.current = resolve
          setChallengeOpen(true)
        })
        setChallengeOpen(false)
        challengeResolve.current = null

        response = await apiRequest<T>(endpoint, {
          method,
          token: challenged || token,
          challengeToken: challenged,
          body: {
            ...values,
            recaptchaToken: token,
            challengeToken: challenged,
          },
        })
      }

      setResult(response)
      setPending(false)

      if (!response.ok) {
        const firstIssue = response.issues[0]
        if (firstIssue) {
          const el = document.querySelector<HTMLElement>(`[data-field="${firstIssue.field}"]`)
          el?.focus()
          el?.scrollIntoView({ block: 'center' })
        }
      }

      return response
    },
    [action, endpoint, method, getToken],
  )

  const completeChallenge = useCallback((token: string) => {
    setChallengeToken(token)
    challengeResolve.current?.(token)
  }, [])

  const cancelChallenge = useCallback(() => {
    setChallengeOpen(false)
    challengeResolve.current?.('')
    challengeResolve.current = null
  }, [])

  return {
    submit,
    result,
    pending,
    challengeOpen,
    challengeToken,
    completeChallenge,
    cancelChallenge,
    issues: result?.issues ?? [],
    reset: () => setResult(null),
  }
}

export function fieldIssues(issues: FieldIssue[], name: string): string | undefined {
  return issues.find((issue) => issue.field === name)?.message
}

/** Uploads picked files to Vercel Blob (or the local stand-in) and returns urls. */
export async function uploadImages(
  folder: 'milestones' | 'portfolio' | 'reviews' | 'applications' | 'projects',
  files: File[],
): Promise<{ urls: string[]; previews: string[]; error?: string }> {
  const urls: string[] = []
  const previews: string[] = []

  for (const file of files) {
    const form = new FormData()
    form.append('file', file)
    form.append('folder', folder)

    let response: Response
    try {
      response = await fetch('/api/uploads', { method: 'POST', body: form })
    } catch {
      return { urls, previews, error: 'Upload failed, the server could not be reached.' }
    }

    const json = (await response.json().catch(() => null)) as {
      success?: boolean
      urls?: string[]
      previewUrls?: string[]
      error?: string
    } | null

    const url = json?.urls?.[0]
    if (!response.ok || !json?.success || !url) {
      return { urls, previews, error: json?.error ?? 'That image could not be uploaded.' }
    }
    urls.push(url)
    previews.push(json.previewUrls?.[0] ?? url)
  }

  return { urls, previews }
}

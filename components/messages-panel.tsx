'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Loader2, LogIn, RefreshCw, Send } from 'lucide-react'
import Link from 'next/link'
import type { ThreadMessage } from '@/lib/types'
import { apiRequest, useCaptchaForm } from '@/lib/api-client'

/**
 * Project thread. Messages live in Vercel KV keyed by project (an in memory map
 * when a deployment has no KV), so both sides of a conversation see the same
 * list. New messages are appended optimistically and reconciled on send.
 */
export function MessagesPanel({
  projectId,
  contractorName,
  signedIn,
  seed,
  className = '',
}: {
  projectId: string
  contractorName: string
  signedIn: boolean
  seed: ThreadMessage[]
  className?: string
}) {
  const [thread, setThread] = useState<ThreadMessage[]>(seed)
  const [draft, setDraft] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [syncing, setSyncing] = useState(false)
  const listEnd = useRef<HTMLDivElement>(null)
  const { submit, pending } = useCaptchaForm<{ message?: ThreadMessage }>('message', '/api/messages/send')

  const scrollToLatest = useCallback(() => {
    listEnd.current?.scrollIntoView({ block: 'nearest' })
  }, [])

  useEffect(() => {
    scrollToLatest()
  }, [thread.length, scrollToLatest])

  const send = () => {
    const body = draft.trim()
    if (!body || pending) return

    const optimistic: ThreadMessage = {
      id: `local-${Date.now()}`,
      from: 'homeowner',
      author: 'You',
      body,
      at: new Date().toISOString(),
    }
    setThread((current) => [...current, optimistic])
    setDraft('')
    setError(null)

    void submit({ projectId, body, from: 'homeowner' }).then((response) => {
      if (!response.ok) {
        setThread((current) => current.filter((item) => item.id !== optimistic.id))
        setError(response.message)
        return
      }
      if (response.data?.message) {
        setThread((current) => current.map((item) => (item.id === optimistic.id ? response.data!.message! : item)))
      }
    })
  }

  const refresh = async () => {
    setSyncing(true)
    const response = await apiRequest<{ messages: ThreadMessage[] }>(`/api/messages?project=${projectId}`, {
      method: 'GET',
    })
    if (response.ok && Array.isArray(response.data?.messages)) setThread(response.data.messages)
    else if (!response.ok) setError(response.message)
    setSyncing(false)
  }

  return (
    <section className={`card flex h-full flex-col p-5 sm:p-6 ${className}`} aria-label={`Project messages with ${contractorName}`}>
      <header className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="mb-0 text-[17px] font-bold text-[color:var(--nb-secondary)]">Project thread</h3>
          <p className="mb-0 text-[13px] text-[color:var(--gray)]">You and {contractorName}</p>
        </div>
        <button
          type="button"
          onClick={() => void refresh()}
          disabled={syncing}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-black/5 text-[color:var(--nb-secondary)] transition-colors hover:bg-[color:var(--nb-primary)] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--nb-primary)]"
          aria-label="Reload the conversation"
        >
          <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} aria-hidden="true" />
        </button>
      </header>

      <ol className="mb-4 flex max-h-[46vh] flex-col gap-3 overflow-y-auto pr-1 md:max-h-[52vh]">
        {thread.map((message) => (
          <li
            key={message.id}
            className={`max-w-[85%] rounded-[6px] px-4 py-3 text-[14px] leading-relaxed ${
              message.from === 'homeowner'
                ? 'self-end bg-[color:var(--nb-primary)] text-white'
                : 'self-start bg-[color:var(--nb-light)] text-[color:var(--gray-dark)]'
            }`}
          >
            <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.1em] opacity-80">
              {message.author} &middot; {formatTime(message.at)}
            </p>
            <p className="mb-0 whitespace-pre-line">{message.body}</p>
          </li>
        ))}
        <div ref={listEnd} />
      </ol>

      {error ? (
        <p role="alert" className="mb-3 text-[13px] text-[color:var(--red)]">
          {error}
        </p>
      ) : null}

      {signedIn ? (
        <form
          className="mt-auto"
          onSubmit={(event) => {
            event.preventDefault()
            send()
          }}
        >
          <label htmlFor={`msg-${projectId}`} className="sr-only">
            Write a message to {contractorName}
          </label>
          <div className="flex items-end gap-2">
            <textarea
              id={`msg-${projectId}`}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
                  event.preventDefault()
                  send()
                }
              }}
              rows={2}
              maxLength={2000}
              placeholder="Ask for the pour date, attach a question about a variation..."
              className="field !mb-0 !text-[15px]"
            />
            <button
              type="submit"
              disabled={pending || !draft.trim()}
              className="btn btn-primary inline-flex h-[54px] min-h-[44px] shrink-0 items-center justify-center gap-2 px-4 text-[13px] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {pending ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <Send className="h-4 w-4" aria-hidden="true" />
              )}
              <span className="hidden sm:inline">Send</span>
            </button>
          </div>
          <p className="mt-2 mb-0 text-[12px] text-[color:var(--gray)]">
            Command or control plus enter sends. Nothing here is a contract variation until it is written into a
            milestone.
          </p>
        </form>
      ) : (
        <div className="mt-auto rounded-[3px] bg-[color:var(--nb-light)] p-4 text-center">
          <p className="mb-3 text-[14px] text-[color:var(--gray-dark)]">Sign in to write to this thread.</p>
          <Link href="/login" className="btn btn-outline inline-flex min-h-[44px] items-center gap-2 px-4 py-2 text-[13px]">
            <LogIn className="h-4 w-4" aria-hidden="true" />
            Sign in
          </Link>
        </div>
      )}
    </section>
  )
}

function formatTime(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString('en-KE', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

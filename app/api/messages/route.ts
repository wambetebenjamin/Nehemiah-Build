import { ok, fail } from '@/lib/api'
import { store, KEYS } from '@/lib/kv'
import type { ThreadMessage } from '@/lib/types'

export const runtime = 'nodejs'

/**
 * GET /api/messages?project=...
 *
 * The read half of the project thread; the write half is POST /api/messages/send.
 * Split into two routes so the panel polls a clean url. Nothing is cached: a stale
 * thread in a dispute is the last thing a homeowner needs.
 */
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const projectId = url.searchParams.get('project')
  if (!projectId) return fail('No project given.', {}, 400)

  const thread = await store.readJson<ThreadMessage[]>(KEYS.messages(projectId), [])
  return ok({ messages: thread, count: thread.length })
}

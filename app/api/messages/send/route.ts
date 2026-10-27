import { guard, ok, fail, unauthorized } from '@/lib/api'
import { kvEnabled } from '@/lib/kv'
import { messageSchema } from '@/lib/validation'
import { auth } from '@/lib/auth'
import { store, KEYS } from '@/lib/kv'
import type { ThreadMessage } from '@/lib/types'

export const runtime = 'nodejs'

const WINDOW_MS = 60_000
const MAX_PER_WINDOW = 12

/**
 * POST /api/messages/send. The thread lives in Vercel KV (in memory when KV is
 * not configured), keyed by project, and both sides of the conversation read the
 * same list.
 */
export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user) return unauthorized('Sign in to message your contractor.')

  const result = await guard({ request, schema: messageSchema, action: 'message' })
  if (!result.data) return result.response

  const { projectId, body } = result.data
  const from = result.data.from ?? 'homeowner'
  const author = result.data.author?.trim() || session.user.name || 'Homeowner'

  const thread = await store.readJson<ThreadMessage[]>(KEYS.messages(projectId), [])
  const recent = thread.filter((item) => Date.now() - new Date(item.at).getTime() < WINDOW_MS)
  if (recent.length >= MAX_PER_WINDOW) {
    return fail('You are sending very quickly. Wait a minute before the next message.', {}, 429)
  }

  const message: ThreadMessage = {
    id: `msg-${Date.now().toString(36)}`,
    from,
    author,
    body,
    at: new Date().toISOString(),
  }

  await store.writeJson(KEYS.messages(projectId), [...thread, message])

  return ok({ message, count: thread.length + 1 })
}


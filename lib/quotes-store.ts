import type { Quote } from '@/lib/types'
import { DEMO_QUOTES } from '@/lib/data/site-data'
import { store, KEYS } from '@/lib/kv'

export const DEMO_OWNER = 'homeowner@nehemia.build'

/**
 * Quote storage.
 *
 * Quotes for a project live under one key (`quotes:<owner>:<project>`). The three
 * seeded demo quotes exist only in code until the homeowner acts on one, at which
 * point the whole demo set is written under that project's key so that accepting
 * one and declining the others survives the write.
 */

/** Seed the demo inbox once, the first time a page asks for it. */
export async function ensureDemoQuotes(owner: string): Promise<void> {
  if (owner !== DEMO_OWNER) return

  const keys = await store.listKeys(`quotes:${owner}:`)
  const stored = await Promise.all(keys.map((key) => store.readJson<Quote[]>(key, [])))
  const flat = stored.flat()
  if (flat.some((quote) => DEMO_QUOTES.some((demo) => demo.id === quote.id))) return

  const byProject = new Map<string, Quote[]>()
  for (const quote of DEMO_QUOTES) {
    const list = byProject.get(quote.projectSlug) ?? []
    list.push(quote)
    byProject.set(quote.projectSlug, list)
  }
  for (const [projectId, list] of byProject) {
    await store.writeJson(KEYS.quotes(owner, projectId), list)
  }
}

/** All quotes for an owner: seeded demo quotes plus anything posted in this deployment. */
export async function allQuotes(owner: string): Promise<Quote[]> {
  await ensureDemoQuotes(owner)

  const keys = await store.listKeys(`quotes:${owner}:`)
  const merged: Quote[] = []
  for (const key of keys) {
    const value = await store.readJson<Quote[]>(key, [])
    for (const quote of value) {
      if (!merged.some((item) => item.id === quote.id)) merged.push(quote)
    }
  }

  for (const quote of DEMO_QUOTES) {
    if (!merged.some((item) => item.id === quote.id)) merged.push(quote)
  }

  return merged.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
}

export async function updateQuote(owner: string, quoteId: string, patch: Partial<Quote>): Promise<Quote | null> {
  await ensureDemoQuotes(owner)

  const keys = await store.listKeys(`quotes:${owner}:`)
  for (const key of keys) {
    const list = await store.readJson<Quote[]>(key, [])
    const index = list.findIndex((item) => item.id === quoteId)
    if (index === -1) continue
    const updated = { ...list[index], ...patch }
    list[index] = updated
    await store.writeJson(key, list)
    return updated
  }

  return null
}

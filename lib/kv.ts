import { kv } from '@vercel/kv'
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'

/**
 * Thin storage layer over Vercel KV.
 *
 * Every dashboard feature (quotes, milestones, messages, reviews, contractor
 * applications) writes through here. When KV credentials are not configured,
 * which is the normal state for a fresh clone or a preview deployment, calls fall
 * back to a local snapshot file so every feature stays testable end to end: reads
 * return what was written, and nothing is sent anywhere off the machine. Point
 * KV_REST_API_URL and KV_REST_API_TOKEN at a real store and the same code paths
 * talk to Vercel KV instead, unchanged.
 */

export const kvEnabled = Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN)

/**
 * Demo mode storage.
 *
 * A Map alone is not enough locally: `next dev` with Turbopack evaluates each
 * route in its own module instance, so a Map written by a route handler would be
 * invisible to the page that reads it. The snapshot below is therefore mirrored to
 * a file under .next (which is gitignored and never served) and reloaded when its
 * mtime moves. One deployment process, one consistent store, no database.
 */
const SNAPSHOT_PATH = join(process.cwd(), '.next', 'nehemiah-kv.json')

const memory = new Map<string, unknown>()
let loadedFrom = -1

function snapshotReady(): boolean {
  try {
    return existsSync(SNAPSHOT_PATH)
  } catch {
    return false
  }
}

function loadSnapshot(): void {
  try {
    const stat = snapshotReady() ? statSync(SNAPSHOT_PATH) : null
    if (!stat) {
      loadedFrom = 0
      return
    }
    if (stat.mtimeMs === loadedFrom) return
    const parsed = JSON.parse(readFileSync(SNAPSHOT_PATH, 'utf8')) as Record<string, unknown>
    memory.clear()
    for (const [key, value] of Object.entries(parsed)) memory.set(key, value)
    loadedFrom = stat.mtimeMs
  } catch {
    /* unreadable snapshot: start from the in-memory state we already have */
  }
}



function flushSnapshot(): void {
  try {
    mkdirSync(dirname(SNAPSHOT_PATH), { recursive: true })
    writeFileSync(SNAPSHOT_PATH, JSON.stringify(Object.fromEntries(memory)))
    loadedFrom = statSync(SNAPSHOT_PATH).mtimeMs
  } catch {
    /* read only filesystem: the in-memory copy still serves this process */
  }
}

function touchMemory(): void {
  if (!kvEnabled) loadSnapshot()
}

async function readJson<T>(key: string, fallback: T): Promise<T> {
  if (!kvEnabled) {
    touchMemory()
    const hit = memory.get(key)
    return (hit === undefined ? fallback : (hit as T)) as T
  }
  try {
    const value = await kv.get<T>(key)
    return value ?? fallback
  } catch {
    return fallback
  }
}

async function writeJson(key: string, value: unknown): Promise<void> {
  if (!kvEnabled) {
    touchMemory()
    memory.set(key, value)
    flushSnapshot()
    return
  }
  try {
    await kv.set(key, value)
  } catch {
    memory.set(key, value)
  }
}

async function deleteKey(key: string): Promise<void> {
  if (!kvEnabled) {
    touchMemory()
    memory.delete(key)
    flushSnapshot()
    return
  }
  try {
    await kv.del(key)
  } catch {
    memory.delete(key)
  }
}

async function listKeys(prefix: string): Promise<string[]> {
  if (!kvEnabled) {
    touchMemory()
    return Array.from(memory.keys()).filter((k) => k.startsWith(prefix))
  }
  try {
    const { keys } = await kv.scan(`${prefix}*`, { count: 200 })
    return Array.from<string>(keys as unknown as Iterable<string>)
  } catch {
    return Array.from(memory.keys()).filter((k) => k.startsWith(prefix))
  }
}

async function readMany<T>(keys: string[], fallback: T[]): Promise<T[]> {
  const out: T[] = []
  for (const key of keys) {
    const value = await readJson<T | null>(key, null)
    if (value !== null && value !== undefined) out.push(value)
  }
  return out.length ? out : fallback
}

export const store = { readJson, writeJson, deleteKey, listKeys, readMany, memory }

/** Keys used across the app, kept in one place so they cannot drift. */
export const KEYS = {
  user: (email: string) => `user:${email.toLowerCase()}`,
  projects: (userId: string) => `projects:${userId}`,
  project: (userId: string, id: string) => `project:${userId}:${id}`,
  quotes: (userId: string, projectId: string) => `quotes:${userId}:${projectId}`,
  messages: (projectId: string) => `messages:${projectId}`,
  milestonePhotos: (projectId: string, milestoneId: string) =>
    `photos:${projectId}:${milestoneId}`,
  reviews: (slug: string) => `reviews:${slug}`,
  applications: () => `applications:index`,
  application: (id: string) => `application:${id}`,
  enquiries: () => `enquiries:index`,
} as const

import { createHash, randomBytes, randomUUID, scrypt, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'
import { store, KEYS } from '@/lib/kv'

const scryptAsync = promisify(scrypt)

/**
 * Minimal demo identity store.
 *
 * Passwords are salted and hashed with scrypt (never plaintext, never bcrypt's
 * native build). Records live in Vercel KV when configured and in memory on
 * local preview deployments, which is the right shape for a marketplace that
 * has not been pointed at a database yet. Swap `store` for Prisma/Drizzle and
 * nothing above this file changes.
 */

export type UserRecord = {
  id: string
  name: string
  email: string
  county: string
  phone: string
  passwordHash: string
  createdAt: string
}

export const DEMO_ACCOUNT = {
  email: 'homeowner@nehemia.build',
  password: 'BuildMilestones2026',
  name: 'Wanjiku Njeri',
  county: 'Kiambu',
  phone: '+254 712 345 678',
} as const

async function hash(password: string, salt = randomBytes(16).toString('hex')): Promise<string> {
  const derived = (await scryptAsync(password, salt, 64)) as Buffer
  return `scrypt:${salt}:${derived.toString('hex')}`
}

async function verify(password: string, stored: string): Promise<boolean> {
  const [, salt, digest] = stored.split(':')
  if (!salt || !digest) return false
  const derived = (await scryptAsync(password, salt, 64)) as Buffer
  const expected = Buffer.from(digest, 'hex')
  if (expected.length !== derived.length) return false
  return timingSafeEqual(derived, expected)
}

export function fingerprint(email: string): string {
  return createHash('sha256').update(email.toLowerCase()).digest('hex').slice(0, 16)
}

export async function findUser(email: string): Promise<UserRecord | null> {
  const normalised = email.toLowerCase()
  const seeded = await store.readJson<UserRecord | null>(KEYS.user(normalised), null)
  if (seeded) return seeded
  if (normalised === DEMO_ACCOUNT.email) {
    const demo = await ensureDemoUser()
    return demo
  }
  return null
}

let demoPromise: Promise<UserRecord> | null = null

async function ensureDemoUser(): Promise<UserRecord> {
  if (!demoPromise) {
    demoPromise = (async () => {
      const record: UserRecord = {
        id: `usr-${fingerprint(DEMO_ACCOUNT.email)}`,
        name: DEMO_ACCOUNT.name,
        email: DEMO_ACCOUNT.email,
        county: DEMO_ACCOUNT.county,
        phone: DEMO_ACCOUNT.phone,
        passwordHash: await hash(DEMO_ACCOUNT.password),
        createdAt: new Date('2026-01-12T09:00:00.000Z').toISOString(),
      }
      await store.writeJson(KEYS.user(DEMO_ACCOUNT.email), record)
      return record
    })()
  }
  return demoPromise
}

export async function createUser(input: {
  name: string
  email: string
  password: string
  county: string
  phone: string
}): Promise<UserRecord> {
  const record: UserRecord = {
    id: `usr-${randomUUID().slice(0, 8)}`,
    name: input.name,
    email: input.email.toLowerCase(),
    county: input.county,
    phone: input.phone,
    passwordHash: await hash(input.password),
    createdAt: new Date().toISOString(),
  }
  await store.writeJson(KEYS.user(record.email), record)
  return record
}

export async function userExists(email: string): Promise<boolean> {
  const normalised = email.toLowerCase()
  if (normalised === DEMO_ACCOUNT.email) return true
  const found = await store.readJson<UserRecord | null>(KEYS.user(normalised), null)
  return Boolean(found)
}

export async function verifyCredentials(
  email: string,
  password: string,
): Promise<{ ok: true; user: UserRecord } | { ok: false; reason: string }> {
  const user = await findUser(email)
  if (!user) return { ok: false, reason: 'No account found for that email.' }
  const matches = await verify(password, user.passwordHash)
  if (!matches) return { ok: false, reason: 'Email and password do not match.' }
  return { ok: true, user }
}

export async function publicUser(user: UserRecord) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    county: user.county,
    phone: user.phone,
    createdAt: user.createdAt,
  }
}

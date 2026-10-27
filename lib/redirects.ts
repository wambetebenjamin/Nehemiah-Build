/**
 * Only same site, only product areas. A callbackUrl taken from a link on the
 * internet must never be able to send a signed in homeowner somewhere else with
 * their session behind them.
 */
const SAFE_TARGET = /^\/(dashboard|quotes|post-project|contractor|profile|onboarding)(\/|$)/

export function safeTarget(value: unknown, fallback = '/dashboard'): string {
  const target = typeof value === 'string' ? value : ''
  if (!target.startsWith('/') || target.startsWith('//')) return fallback
  return SAFE_TARGET.test(target) ? target : fallback
}

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { COOKIE_CONSENT_KEY } from '@/lib/site'

/**
 * Global client state. Zustand is used for the three things that genuinely need
 * to be shared across the tree: captcha handoff, cookie consent, and the
 * multi-step project form.
 */

export type CaptchaState = {
  siteKey: string | null
  /** Resolves with a v3 token, or an empty string when captcha is not configured. */
  execute: ((action: string) => Promise<string>) | null
  /** Set when the server asks for a visible v2 challenge. */
  challengeRequired: boolean
  challengeToken: string | null
  setChallengeRequired: (value: boolean) => void
  setChallengeToken: (value: string | null) => void
  configure: (params: {
    siteKey: string | null
    execute: (action: string) => Promise<string>
  }) => void
}

export const useCaptchaStore = create<CaptchaState>((set) => ({
  siteKey: null,
  execute: null,
  challengeRequired: false,
  challengeToken: null,
  setChallengeRequired: (value) => set({ challengeRequired: value }),
  setChallengeToken: (value) => set({ challengeToken: value }),
  configure: ({ siteKey, execute }) => set({ siteKey, execute }),
}))

export type ConsentCategories = {
  necessary: true
  functional: boolean
  analytics: boolean
  marketing: boolean
}

export type ConsentState = {
  stored: boolean
  categories: ConsentCategories
  acceptAll: () => void
  rejectOptional: () => void
  save: (categories: Omit<ConsentCategories, 'necessary'>) => void
  openPreferences: boolean
  setOpenPreferences: (value: boolean) => void
  hydrate: () => void
}

const DEFAULT_CONSENT: ConsentCategories = {
  necessary: true,
  functional: false,
  analytics: false,
  marketing: false,
}

function readStoredConsent(): { stored: boolean; categories: ConsentCategories } {
  if (typeof window === 'undefined') return { stored: false, categories: DEFAULT_CONSENT }
  try {
    const raw = window.localStorage.getItem(COOKIE_CONSENT_KEY)
    if (!raw) return { stored: false, categories: DEFAULT_CONSENT }
    const parsed = JSON.parse(raw) as { categories?: Partial<ConsentCategories>; updatedAt?: string }
    if (!parsed?.categories) return { stored: false, categories: DEFAULT_CONSENT }
    return {
      stored: true,
      categories: {
        necessary: true,
        functional: Boolean(parsed.categories.functional),
        analytics: Boolean(parsed.categories.analytics),
        marketing: Boolean(parsed.categories.marketing),
      },
    }
  } catch {
    return { stored: false, categories: DEFAULT_CONSENT }
  }
}

function persistConsent(categories: ConsentCategories) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(
      COOKIE_CONSENT_KEY,
      JSON.stringify({ version: 1, categories, updatedAt: new Date().toISOString() }),
    )
  } catch {
    /* storage blocked (private mode): the choice still applies for this page view */
  }
}

export const useConsentStore = create<ConsentState>((set) => {
  const initial = readStoredConsent()
  return {
  stored: initial.stored,
  categories: initial.categories,
  openPreferences: false,
  setOpenPreferences: (value) => set({ openPreferences: value }),
  hydrate: () => set(readStoredConsent()),
  acceptAll: () => {
    const categories: ConsentCategories = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
    }
    persistConsent(categories)
    set({ categories, stored: true, openPreferences: false })
  },
  rejectOptional: () => {
    const categories: ConsentCategories = { ...DEFAULT_CONSENT }
    persistConsent(categories)
    set({ categories, stored: true, openPreferences: false })
  },
  save: (categories) => {
    const next: ConsentCategories = { necessary: true, ...categories }
    persistConsent(next)
    set({ categories: next, stored: true, openPreferences: false })
  },
  }
})

export function consentAllows(category: 'functional' | 'analytics' | 'marketing'): boolean {
  if (typeof window === 'undefined') return false
  return Boolean(useConsentStore.getState().categories[category])
}

export const DRAFT_STORAGE_KEY = 'nehemiah-build-project-draft'

export type ProjectFormDraft = {
  step: number
  setStep: (step: number) => void
  next: () => void
  back: () => void
  values: Record<string, unknown>
  setValues: (values: Record<string, unknown>) => void
  reset: () => void
}

/**
 * The project draft is kept on the device only (local storage, never synced to a
 * server), which is what the Cookie Policy says it is. Nothing leaves the browser
 * until the final step, so an abandoned post costs a homeowner nothing.
 */
export const useProjectDraftStore = create<ProjectFormDraft>()(
  persist(
    (set, get) => ({
      step: 1,
      values: {},
      setStep: (step) => set({ step }),
      next: () => set({ step: Math.min(4, get().step + 1) }),
      back: () => set({ step: Math.max(1, get().step - 1) }),
      setValues: (values) => set({ values: { ...get().values, ...values } }),
      reset: () => set({ step: 1, values: {} }),
    }),
    {
      name: DRAFT_STORAGE_KEY,
      version: 1,
      partialize: (state) => ({ step: state.step, values: state.values }),
    },
  ),
)

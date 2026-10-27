import type { Milestone, Project } from '@/lib/types'
import { store, KEYS } from '@/lib/kv'
import { PICTURES } from '@/lib/images'
import { DEMO_OWNER } from '@/lib/quotes-store'

export type StoredProject = {
  id: string
  title: string
  projectType: string
  description: string
  county: string
  sizeValue: string
  sizeUnit: 'plot' | 'sqm' | 'sqft'
  startDate: string
  deadline: string
  flexibility: string
  budgetBand: string
  budgetLabel: string
  contactName: string
  contactPhone: string
  contactEmail: string
  photoUrls: string[]
  owner: string
  createdAt: string
  status: string
  acceptedQuoteId?: string
  contractorSlug?: string
  contractorCompany?: string
  milestones?: Milestone[]
  progress?: number
  spent?: number
}

const BAND_FLOOR: Record<string, number> = {
  'below-500k': 280_000,
  '500k-2m': 780_000,
  '2m-10m': 2_600_000,
  'above-10m': 11_400_000,
}

const PHASES = [
  { name: 'Mobilisation and setting out', share: 0.1 },
  { name: 'Foundation concrete complete', share: 0.25 },
  { name: 'Superstructure to lintel level', share: 0.3 },
  { name: 'Roof covered and watertight', share: 0.2 },
  { name: 'Handover and snag list', share: 0.15 },
]

function milestonesFor(record: StoredProject): Milestone[] {
  if (record.milestones?.length) return record.milestones
  const floor = BAND_FLOOR[record.budgetBand] ?? 900_000
  const start = new Date(record.startDate || record.createdAt).getTime()
  const end = new Date(record.deadline || record.createdAt).getTime()
  const span = Math.max(end - start, 30 * 86_400_000)

  return PHASES.map((phase, index) => {
    let status: Milestone['status'] = 'Pending'
    if (index === 0) status = 'In Progress'
    return {
      id: `m${index + 1}`,
      name: phase.name,
      dueDate: new Date(start + (span * (index + 1)) / PHASES.length).toISOString().slice(0, 10),
      amount: Math.round((floor * phase.share) / 1000) * 1000,
      status,
      progressPhotos: (index === 0 ? record.photoUrls ?? [] : []).map((url) => ({
        remote: url,
        fallback: PICTURES.projectFallback.fallback,
        fallbackMeta: PICTURES.projectFallback.fallbackMeta,
        alt: `Progress photo uploaded for ${phase.name}`,
        width: 1200,
        height: 800,
      })),
    }
  })
}

/** Shape a posted project into the same record the demo projects use. */
export function toProjectView(record: StoredProject, quoteCount: number): Project {
  const milestones = milestonesFor(record)
  const approved = milestones.filter((m) => m.status === 'Approved').length
  const next = milestones.find((m) => m.status !== 'Approved')
  const value = milestones.reduce((sum, m) => sum + m.amount, 0)
  const spent = record.spent ?? milestones.filter((m) => m.status === 'Approved').reduce((sum, m) => sum + m.amount, 0)

  return {
    id: record.id,
    title: record.title,
    description: record.description,
    county: record.county,
    category: (record.projectType as Project['category']) ?? 'Architecture',
    contractorSlug: record.contractorSlug,
    contractorCompany: record.contractorCompany,
    startDate: record.startDate,
    expectedCompletion: record.deadline,
    progress: record.progress ?? Math.round((approved / milestones.length) * 100),
    budgetBand: record.budgetBand,
    spent,
    nextMilestoneDate: next?.dueDate ?? record.deadline,
    currentPhase: record.contractorCompany
      ? next?.name ?? 'Handover'
      : quoteCount > 0
        ? `Awaiting your decision on ${quoteCount} quote${quoteCount === 1 ? '' : 's'}`
        : 'Waiting for quotes',
    milestones,
    ...({ totalValue: value, budgetLabel: record.budgetLabel } as Record<string, unknown>),
  }
}

export async function storedProjects(owner: string): Promise<StoredProject[]> {
  const list = await store.readJson<StoredProject[]>(KEYS.projects(owner), [])
  return Array.isArray(list) ? list : []
}

export async function readProject(owner: string, id: string): Promise<StoredProject | null> {
  const list = await storedProjects(owner)
  return list.find((item) => item.id === id) ?? null
}

export async function writeProject(owner: string, record: StoredProject): Promise<void> {
  const list = await storedProjects(owner)
  const index = list.findIndex((item) => item.id === record.id)
  if (index === -1) list.unshift(record)
  else list[index] = record
  await store.writeJson(KEYS.projects(owner), list)
}

export async function ownerFor(email: string | undefined | null): Promise<string> {
  return email ?? DEMO_OWNER
}

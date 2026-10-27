import type { Quote, TradeCategory } from '@/lib/types'
import { CONTRACTORS } from '@/lib/data/contractors'

/**
 * Quote generation for a posted project.
 *
 * There is no contractor back end in this build yet, so quotes are produced
 * from the directory using a deterministic rule: trade match first, then county
 * proximity, then rating. The numbers are plausible rather than invented per
 * request, which keeps a demo project and a stored project behaving the same.
 */
function seedFrom(text: string): number {
  let hash = 0
  for (let i = 0; i < text.length; i += 1) hash = (hash * 31 + text.charCodeAt(i)) >>> 0
  return hash
}

const BAND_FLOOR: Record<string, number> = {
  'below-500k': 280_000,
  '500k-2m': 780_000,
  '2m-10m': 2_600_000,
  'above-10m': 11_400_000,
}

const TRADE_ALIASES: Record<string, TradeCategory[]> = {
  'New house build': ['Structural Engineering', 'Architecture', 'Roofing'],
  'Floor slab / additional floor': ['Structural Engineering', 'Architecture'],
  Renovation: ['Architecture', 'Plumbing', 'Electrical', 'Painting'],
  'Commercial unit': ['Structural Engineering', 'Electrical', 'Roofing'],
  'Boundary wall and gate': ['Tiling and Flooring', 'Roofing'],
  Roofing: ['Roofing'],
  'Finishing (plumbing, electrical, tiling, painting)': ['Plumbing', 'Electrical', 'Tiling and Flooring', 'Painting'],
  'Interior design and fit-out': ['Interior Design', 'Tiling and Flooring', 'Painting'],
}

export function quotesForProject(project: {
  id: string
  title: string
  projectType: string
  county: string
  budgetBand: string
}): Quote[] {
  const wanted = TRADE_ALIASES[project.projectType] ?? (Object.keys(TRADE_ALIASES) ? ['Architecture'] : [])
  const seed = seedFrom(`${project.id}:${project.title}`)
  const floor = BAND_FLOOR[project.budgetBand] ?? 900_000

  const ranked = [...CONTRACTORS]
    .map((contractor, index) => {
      const tradeMatch = wanted.includes(contractor.trade) ? 0 : 40
      const countyMatch = contractor.county === project.county ? 0 : 12
      const ratingPenalty = Math.round((5 - contractor.rating) * 10)
      return { contractor, score: tradeMatch + countyMatch + ratingPenalty + (index % 3), index }
    })
    .sort((a, b) => a.score - b.score)

  return ranked.slice(0, 3).map(({ contractor }, position) => {
    const variance = 0.86 + ((seed >> (position * 3)) % 28) / 100
    const amount = Math.round((floor * variance * (1 + position * 0.07)) / 10_000) * 10_000
    const weeks = 8 + position * 4 + (contractor.teamSize > 8 ? 0 : 3)

    return {
      id: `q-${project.id}-${contractor.slug}`,
      projectSlug: project.id,
      projectTitle: project.title,
      contractorSlug: contractor.slug,
      contractorCompany: contractor.company,
      trade: contractor.trade,
      amount,
      timelineWeeks: weeks,
      message: `${contractor.owner} here. We are in ${contractor.county} and have done ${contractor.completedProjects} projects since we started, so the timeline below is one we can defend. ${
        contractor.county === project.county
          ? 'We are already mobilised near you, which is where we save you two weeks.'
          : 'We travel to your county weekly, accommodation is on us, not on your bill.'
      } Milestones follow your payment bands and we upload photos the same evening we pour.`,
      createdAt: new Date(Date.now() - (position + 1) * 86_400_000).toISOString().slice(0, 10),
      status: 'New',
    } satisfies Quote
  })
}

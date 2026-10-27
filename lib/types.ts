import type { PictureSpec } from '@/lib/images'

export type TradeCategory =
  | 'Architecture'
  | 'Structural Engineering'
  | 'Plumbing'
  | 'Electrical'
  | 'Tiling and Flooring'
  | 'Roofing'
  | 'Painting'
  | 'Interior Design'

export type Review = {
  id: string
  author: string
  county: string
  rating: number
  title: string
  body: string
  date: string
  verified: boolean
}

export type Contractor = {
  slug: string
  company: string
  owner: string
  trade: TradeCategory
  county: string
  yearsInOperation: number
  verified: boolean
  rating: number
  reviewCount: number
  completedProjects: number
  teamSize: number
  ncaNumber: string
  bio: string
  languages: string[]
  serviceAreas: string[]
  avatar: PictureSpec
  cover: PictureSpec
  portfolio: PictureSpec[]
  reviews: Review[]
}

export type MilestoneStatus = 'Pending' | 'In Progress' | 'Completed' | 'Approved'

export type Milestone = {
  id: string
  name: string
  dueDate: string
  amount: number
  status: MilestoneStatus
  progressPhotos: PictureSpec[]
}

export type Quote = {
  id: string
  projectSlug: string
  projectTitle: string
  contractorSlug: string
  contractorCompany: string
  trade: TradeCategory
  amount: number
  timelineWeeks: number
  message: string
  createdAt: string
  status: 'New' | 'Viewed' | 'Accepted' | 'Declined'
}

export type ProjectPhase = {
  name: string
  progress: number
}

export type Project = {
  id: string
  title: string
  description: string
  county: string
  category: TradeCategory
  contractorSlug?: string
  contractorCompany?: string
  startDate: string
  expectedCompletion: string
  progress: number
  budgetBand: string
  spent: number
  nextMilestoneDate: string
  currentPhase: string
  milestones: Milestone[]
}

export type ThreadMessage = {
  id: string
  from: 'homeowner' | 'contractor'
  author: string
  body: string
  at: string
}

export type SpendPoint = {
  month: string
  materials: number
  labour: number
  professional: number
}

export type SpendByCategory = {
  category: string
  spend: number
}

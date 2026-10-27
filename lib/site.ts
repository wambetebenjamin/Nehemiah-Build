/**
 * Site constants for Nehemiah Build.
 * Brand voice: confident, practical, trustworthy. Written for the Kenyan
 * homeowner who is tired of contractors who vanish with deposits.
 */

export const SITE = {
  name: 'Nehemiah Build',
  tagline: 'Build with confidence. Finish on time.',
  description:
    'Post your construction project, receive quotes from verified Kenyan contractors, track every phase, and pay on approved milestones.',
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '254112272061',
  whatsappMessage:
    "Hi%20Nehemiah%20Build%2C%20I'd%20like%20to%20post%20a%20construction%20project",
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
} as const

export const WHATSAPP_HREF = `https://wa.me/${SITE.whatsappNumber}?text=${SITE.whatsappMessage}`

export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/contractors', label: 'Contractors' },
  { href: '/post-project', label: 'Post a Project' },
  { href: '/quotes', label: 'Quotes' },
  { href: '/about', label: 'About' },
] as const

/** Trust bar on the homepage, in template "block-6 services" style. */
export const TRUST_ITEMS = [
  {
    title: 'Verified Contractors Only',
    text: 'Every contractor clears NCA registration, ID checks, and a site reference before they can quote on your project.',
  },
  {
    title: 'Milestone-based Payments',
    text: 'Money is released against approved milestones, not against promises made over a phone call.',
  },
  {
    title: 'Project Progress Tracking',
    text: 'Dated milestones, site photos, and a running cost sheet, so you always know where your build stands.',
  },
  {
    title: 'Dispute Resolution',
    text: 'If a phase is not finished as quoted, our resolution desk reviews the evidence you both uploaded.',
  },
] as const

/** How it works, 3 steps. */
export const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Post your project',
    text: 'Describe the build, the county, the size, and your budget range. It takes about four minutes and it is free.',
  },
  {
    step: '02',
    title: 'Receive quotes from verified contractors',
    text: 'Matched contractors in your trade and county send itemised quotes with timelines. You compare, you ask questions, you choose.',
  },
  {
    step: '03',
    title: 'Approve milestones and pay securely',
    text: 'Work is released phase by phase. You approve a milestone with site photos in hand, then your payment goes out.',
  },
] as const

export type ContractorCategory = {
  slug: string
  name: string
  blurb: string
  /** lucide icon key resolved in components/icons.tsx */
  icon: string
}

/** Featured contractor categories. */
export const CATEGORIES: ContractorCategory[] = [
  { slug: 'architecture', name: 'Architecture', blurb: 'Drawings, approvals, supervision', icon: 'architect' },
  { slug: 'structural-engineering', name: 'Structural Engineering', blurb: 'Design checks, RCC, steel', icon: 'engineer-1' },
  { slug: 'plumbing', name: 'Plumbing', blurb: 'Water, waste, tanks, pumps', icon: 'worker' },
  { slug: 'electrical', name: 'Electrical', blurb: 'Wiring, DB boards, solar', icon: 'engineer' },
  { slug: 'tiling-and-flooring', name: 'Tiling and Flooring', blurb: 'Floor and wall tiling, screeds', icon: 'worker-1' },
  { slug: 'roofing', name: 'Roofing', blurb: 'Trusses, iron sheets, gutters', icon: 'crane' },
  { slug: 'painting', name: 'Painting', blurb: 'Skim coat, emulsion, texture', icon: 'hammer' },
  { slug: 'interior-design', name: 'Interior Design', blurb: 'Finishes, cabinets, soft fit-out', icon: 'architect' },
]

/** Impact numbers, animated count-up on the homepage. */
export const IMPACT_STATS = [
  { value: 2480, suffix: '+', label: 'Projects completed' },
  { value: 1315, suffix: '', label: 'Verified contractors' },
  { value: 47, suffix: '', label: 'Counties covered' },
  { value: 9.4, suffix: 'B', label: 'Value of projects managed (KES)', prefix: '' },
] as const

export const COUNTIES = [
  'Nairobi',
  'Kiambu',
  'Machakos',
  'Nakuru',
  'Uasin Gishu',
  'Kajiado',
  'Murang\u2019a',
  'Kisumu',
  'Nyeri',
  'Meru',
  'Bungoma',
  'Kilifi',
  'Kwale',
  'Narok',
  'Laikipia',
] as const

export const BUDGET_BANDS = [
  { value: 'below-500k', label: 'Below KES 500,000' },
  { value: '500k-2m', label: 'KES 500,000 to 2,000,000' },
  { value: '2m-10m', label: 'KES 2,000,000 to 10,000,000' },
  { value: 'above-10m', label: 'Above KES 10,000,000' },
] as const

export const PROJECT_TYPES = [
  'New house build',
  'Floor slab / additional floor',
  'Renovation',
  'Commercial unit',
  'Boundary wall and gate',
  'Roofing',
  'Finishing (plumbing, electrical, tiling, painting)',
  'Interior design and fit-out',
] as const

export const FLEXIBILITY_OPTIONS = [
  { value: 'fixed', label: 'Fixed, I cannot move the dates' },
  { value: 'slight', label: 'Slight flexibility of about a month' },
  { value: 'flexible', label: 'Flexible, quality matters more than speed' },
] as const

export const LEGAL_LINKS = [
  { href: '/legal/privacy-policy', label: 'Privacy Policy' },
  { href: '/legal/terms', label: 'Terms of Service' },
  { href: '/legal/cookie-policy', label: 'Cookie Policy' },
] as const

export const FOOTER_COLUMNS = [
  {
    heading: 'Homeowners',
    links: [
      { href: '/post-project', label: 'Post a Project' },
      { href: '/quotes', label: 'Quotes Inbox' },
      { href: '/dashboard', label: 'My Dashboard' },
      { href: '/contractors', label: 'Browse Contractors' },
    ],
  },
  {
    heading: 'Contractors',
    links: [
      { href: '/contractor-apply', label: 'Apply to Join' },
      { href: '/contractors', label: 'Contractor Directory' },
      { href: '/about', label: 'Why Nehemiah Build' },
      { href: '/legal/terms', label: 'Contractor Terms' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { href: '/about', label: 'About Us' },
      { href: '/legal/privacy-policy', label: 'Privacy Policy' },
      { href: '/legal/terms', label: 'Terms of Service' },
      { href: '/legal/cookie-policy', label: 'Cookie Policy' },
    ],
  },
] as const

export const COOKIE_CONSENT_KEY = 'nehemiah-build-cookie-consent'
export const VOICE_TOUR_DONE_KEY = 'nehemiah-build-voice-tour-played'

export const VOICE_TOUR_SCRIPT =
  'Welcome to Nehemiah Build, the platform that connects Kenyan homeowners with verified, trustworthy contractors. Post your project, receive competitive quotes, and track every phase of your build with milestone-based payments that protect your money. No more vanishing contractors. No more unfinished walls. Scroll down to post your first project or browse our directory of verified contractors today.'

export function formatKES(amount: number): string {
  return `KES ${amount.toLocaleString('en-KE', { maximumFractionDigits: 0 })}`
}

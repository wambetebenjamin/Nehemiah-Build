import { portraitPicture } from '@/lib/images'
import { CONTRACTORS } from '@/lib/data/contractors'
import type { Project, Quote, SpendByCategory, SpendPoint, ThreadMessage } from '@/lib/types'

export type Testimonial = {
  name: string
  county: string
  project: string
  quote: string
  avatar: ReturnType<typeof portraitPicture>
}

/** Three Kenyan homeowners, in their own words. */
export const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Grace Wanjiru',
    county: 'Kiambu',
    project: 'Four bedroom maisonette, Thika Road',
    quote:
      'I had already lost 400,000 to a contractor who stopped answering calls after the foundation. Here I only released money when my engineer signed off each milestone. The second quote I accepted finished six days early.',
    avatar: portraitPicture('businesswomanDesk', 'Grace Wanjiru, homeowner from Kiambu'),
  },
  {
    name: 'Peter Otieno',
    county: 'Nairobi',
    project: 'Two flats and an office shop, Ruaraka',
    quote:
      'The photos on every milestone are what saved me. I work upcountry and I could see the blockwork rising without sending my brother there on a Saturday with a phone camera.',
    avatar: portraitPicture('nairobiCap', 'Peter Otieno, homeowner from Nairobi'),
  },
  {
    name: 'Sarah Achieng',
    county: 'Kisumu',
    project: 'Renovation and new roof, Milimani',
    quote:
      'Three roofers quoted me on WhatsApp. Only the one on here sent a timeline with dates I could actually hold someone to, and the dispute desk answered me the same day when a sheet gauge came wrong.',
    avatar: portraitPicture('womanSuit', 'Sarah Achieng, homeowner from Kisumu'),
  },
]

export type TeamMember = {
  name: string
  role: string
  bio: string
  avatar: ReturnType<typeof portraitPicture>
}

export const TEAM: TeamMember[] = [
  {
    name: 'Nehemiah Kiptanui',
    role: 'Founder and Managing Director',
    bio: 'Fifteen years on Kenyan sites as a quantity surveyor before deciding that the paperwork problem, not the concrete problem, was the one worth fixing.',
    avatar: portraitPicture('workerUganda', 'Nehemiah Kiptanui, founder'),
  },
  {
    name: 'Alice Njeri',
    role: 'Head of Contractor Verification',
    bio: 'Licensed electrician. She built the check list every contractor passes before they can quote: NCA status, ID, tax compliance, and two sites she visits herself.',
    avatar: portraitPicture('womanSunnyPPE', 'Alice Njeri, head of verification'),
  },
  {
    name: 'Joyce Chebet',
    role: 'Structural Review Lead',
    bio: 'Runs the technical desk that reviews drawings and milestone evidence, and signs off the phases where money is at stake.',
    avatar: portraitPicture('womanYellowHardhat', 'Joyce Chebet, structural review lead'),
  },
  {
    name: 'Brian Kiptoo',
    role: 'Dispute Resolution Manager',
    bio: 'Former roofing contractor. He reads both sides of a stalled project, walks the site when photos are not enough, and writes down what should happen next.',
    avatar: portraitPicture('manBrownSuit', 'Brian Kiptoo, dispute resolution manager'),
  },
]

/** Dashboard: active projects for the signed in homeowner. */
export const DEMO_PROJECTS: Project[] = [
  {
    id: 'prj-ruaraka',
    title: 'Ruaraka maisonette, ground and first floor',
    description:
      'Four bedroom maisonette on a 50 by 100 plot. Structure to roof level, then blockwork, roof and first fix. Foundation was already complete when the project was posted.',
    county: 'Nairobi',
    category: 'Structural Engineering',
    contractorSlug: 'rift-valley-structural-engineers',
    contractorCompany: 'Rift Valley Structural Engineers',
    startDate: '2026-02-09',
    expectedCompletion: '2026-12-18',
    progress: 62,
    budgetBand: '2m-10m',
    spent: 4_380_000,
    nextMilestoneDate: '2026-11-06',
    currentPhase: 'First floor slab and columns',
    milestones: [
      {
        id: 'm1',
        name: 'Mobilisation, setting out and excavation',
        dueDate: '2026-02-20',
        amount: 420_000,
        status: 'Approved',
        progressPhotos: [],
      },
      {
        id: 'm2',
        name: 'Foundation concrete and blinding',
        dueDate: '2026-03-28',
        amount: 980_000,
        status: 'Approved',
        progressPhotos: [],
      },
      {
        id: 'm3',
        name: 'Ground floor walls, lintels and floor slab',
        dueDate: '2026-06-12',
        amount: 1_250_000,
        status: 'Approved',
        progressPhotos: [],
      },
      {
        id: 'm4',
        name: 'First floor slab, columns and stair core',
        dueDate: '2026-11-06',
        amount: 1_380_000,
        status: 'In Progress',
        progressPhotos: [],
      },
      {
        id: 'm5',
        name: 'Roof structure, sheeting and gutters',
        dueDate: '2026-12-18',
        amount: 950_000,
        status: 'Pending',
        progressPhotos: [],
      },
    ],
  },
  {
    id: 'prj-kiambu-renovation',
    title: 'Kikuyu bungalow renovation and new roof',
    description:
      'Strip the old asbestos roof, upgrade the ring beam where it has cracked, rewire the DB, and redo both bathrooms.',
    county: 'Kiambu',
    category: 'Roofing',
    contractorSlug: 'apex-roofing-systems',
    contractorCompany: 'Apex Roofing Systems',
    startDate: '2026-08-03',
    expectedCompletion: '2026-11-27',
    progress: 45,
    budgetBand: '500k-2m',
    spent: 860_000,
    nextMilestoneDate: '2026-10-30',
    currentPhase: 'Stripping and truss seating',
    milestones: [
      { id: 'm1', name: 'Strip old roof and make safe', dueDate: '2026-08-14', amount: 180_000, status: 'Approved', progressPhotos: [] },
      { id: 'm2', name: 'Ring beam repair and packers', dueDate: '2026-09-18', amount: 340_000, status: 'Approved', progressPhotos: [] },
      { id: 'm3', name: 'New trusses and battening', dueDate: '2026-10-30', amount: 420_000, status: 'In Progress', progressPhotos: [] },
      { id: 'm4', name: 'Sheeting, flashing and gutters', dueDate: '2026-11-27', amount: 460_000, status: 'Pending', progressPhotos: [] },
    ],
  },
  {
    id: 'prj-nakuru-wall',
    title: 'Nakuru boundary wall, gate and security lighting',
    description:
      '210 linear metres of blockwork with a concrete pier every third bay, a 7 foot sliding gate, and four security lights on a solar circuit.',
    county: 'Nakuru',
    category: 'Tiling and Flooring',
    startDate: '2026-10-05',
    expectedCompletion: '2026-12-05',
    progress: 12,
    budgetBand: '500k-2m',
    spent: 95_000,
    nextMilestoneDate: '2026-11-14',
    currentPhase: 'Excavation for footings',
    milestones: [
      { id: 'm1', name: 'Setting out and footing excavation', dueDate: '2026-11-14', amount: 210_000, status: 'In Progress', progressPhotos: [] },
      { id: 'm2', name: 'Piers and blockwork to second course', dueDate: '2026-11-28', amount: 480_000, status: 'Pending', progressPhotos: [] },
      { id: 'm3', name: 'Coping, gate and lighting circuit', dueDate: '2026-12-05', amount: 360_000, status: 'Pending', progressPhotos: [] },
    ],
  },
]

export const SPEND_OVER_TIME: SpendPoint[] = [
  { month: 'Feb', materials: 620_000, labour: 210_000, professional: 90_000 },
  { month: 'Mar', materials: 1_040_000, labour: 380_000, professional: 60_000 },
  { month: 'Apr', materials: 760_000, labour: 340_000, professional: 40_000 },
  { month: 'May', materials: 980_000, labour: 410_000, professional: 40_000 },
  { month: 'Jun', materials: 1_180_000, labour: 470_000, professional: 90_000 },
  { month: 'Jul', materials: 540_000, labour: 260_000, professional: 40_000 },
  { month: 'Aug', materials: 430_000, labour: 190_000, professional: 60_000 },
  { month: 'Sep', materials: 250_000, labour: 120_000, professional: 30_000 },
]

export const SPEND_BY_CATEGORY: SpendByCategory[] = [
  { category: 'Structure', spend: 3_610_000 },
  { category: 'Roofing', spend: 1_060_000 },
  { category: 'Finishing', spend: 640_000 },
  { category: 'Plumbing', spend: 380_000 },
  { category: 'Electrical', spend: 295_000 },
  { category: 'Professional', spend: 420_000 },
]

const quoteSeeds: Array<{ projectSlug: string; projectTitle: string; contractor: string; amount: number; weeks: number; message: string; date: string }> = [
  {
    projectSlug: 'prj-ruaraka',
    projectTitle: 'Ruaraka maisonette, ground and first floor',
    contractor: 'rift-valley-structural-engineers',
    amount: 4_180_000,
    weeks: 34,
    message:
      'I have reviewed your drawings and your plot. Structure to roof level in 34 weeks with your own materials supplier, or 31 if we take the steel. Includes three pour inspections and a bar bending schedule.',
    date: '2026-10-14',
  },
  {
    projectSlug: 'prj-ruaraka',
    projectTitle: 'Ruaraka maisonette, ground and first floor',
    contractor: 'apex-roofing-systems',
    amount: 3_760_000,
    weeks: 38,
    message:
      'We can do structure and roof as one package, which removes the fight between two crews over scaffolding. Quote excludes first fix.',
    date: '2026-10-12',
  },
  {
    projectSlug: 'prj-ruaraka',
    projectTitle: 'Ruaraka maisonette, ground and first floor',
    contractor: 'zenith-architects-nairobi',
    amount: 4_640_000,
    weeks: 32,
    message:
      'Fastest route, but it needs your approvals pack reissued because your current drawings lack the fire escape detail for the maisonette plan.',
    date: '2026-10-08',
  },
  {
    projectSlug: 'prj-kiambu-renovation',
    projectTitle: 'Kikuyu bungalow renovation and new roof',
    contractor: 'apex-roofing-systems',
    amount: 1_420_000,
    weeks: 12,
    message:
      'Strip, repair ring beam with new packers, and box gutter in 0.45 gauge. Includes the 30 day rain check the platform requires.',
    date: '2026-10-11',
  },
  {
    projectSlug: 'prj-kiambu-renovation',
    projectTitle: 'Kikuyu bungalow renovation and new roof',
    contractor: 'voltage-kitchens-electrical',
    amount: 380_000,
    weeks: 3,
    message:
      'Separate quote for the DB upgrade and new kitchen circuits only, in case you keep your current roofer. Certificate of inspection included.',
    date: '2026-10-10',
  },
  {
    projectSlug: 'prj-nakuru-wall',
    projectTitle: 'Nakuru boundary wall, gate and security lighting',
    contractor: 'precision-tiling-and-flooring',
    amount: 1_040_000,
    weeks: 9,
    message:
      'Piers cast in situ, blockwork glued not mortared where you want render, and a 14 foot sliding gate from a fabricator I have used for six years.',
    date: '2026-10-16',
  },
  {
    projectSlug: 'prj-nakuru-wall',
    projectTitle: 'Nakuru boundary wall, gate and security lighting',
    contractor: 'titan-plumbing-solutions',
    amount: 920_000,
    weeks: 11,
    message:
      'Cheaper option, same spec on the wall. The gate would be local fab with a 40 day lead time, which is why my programme is longer.',
    date: '2026-10-15',
  },
  {
    projectSlug: 'prj-nakuru-wall',
    projectTitle: 'Nakuru boundary wall, gate and security lighting',
    contractor: 'coast-line-tiles',
    amount: 865_000,
    weeks: 12,
    message:
      'Small crew, we only take two projects at a time, and I will do the coping myself so it does not come loose in five years.',
    date: '2026-10-13',
  },
]

export const DEMO_QUOTES: Quote[] = quoteSeeds.map((seed, index) => {
  const contractor = CONTRACTORS.find((c) => c.slug === seed.contractor)
  return {
    id: `q${index + 1}`,
    projectSlug: seed.projectSlug,
    projectTitle: seed.projectTitle,
    contractorSlug: seed.contractor,
    contractorCompany: contractor?.company ?? 'Verified contractor',
    trade: contractor?.trade ?? 'Roofing',
    amount: seed.amount,
    timelineWeeks: seed.weeks,
    message: seed.message,
    createdAt: seed.date,
    status: 'New',
  }
})

export const DEMO_MESSAGES: ThreadMessage[] = [
  {
    id: 'msg1',
    from: 'contractor',
    author: 'Joyce Chebet',
    body: 'Slab props are in and the bar bending schedule was handed to your mason this morning. We are ready to pour on the 6th, weather allowing.',
    at: '2026-10-19T08:12:00.000Z',
  },
  {
    id: 'msg2',
    from: 'homeowner',
    author: 'You',
    body: 'Good. Please send the photos of the stair core reinforcement before the pour, that is the one my bank keeps asking about.',
    at: '2026-10-19T09:40:00.000Z',
  },
  {
    id: 'msg3',
    from: 'contractor',
    author: 'Joyce Chebet',
    body: 'Uploaded to the milestone folder just now, six shots including the dowels. I would also like your approval on the 20mm cover on the top bars before Monday.',
    at: '2026-10-20T16:05:00.000Z',
  },
]

export function getDemoProject(id: string): Project | undefined {
  return DEMO_PROJECTS.find((p) => p.id === id)
}

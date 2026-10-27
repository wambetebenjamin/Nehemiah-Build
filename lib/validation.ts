import { z } from 'zod'

/**
 * Shared field vocabulary so every form and every API route agree on one shape.
 */
const trimmed = (max: number, label: string, min = 2) =>
  z
    .string({ error: `${label} is required.` })
    .trim()
    .min(min, `${label} must be at least ${min} characters.`)
    .max(max, `${label} must be under ${max} characters.`)

const optionalTrimmed = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .or(z.literal(''))

// Top level string formats in zod 4: they validate and trim the same value in one
// pass, and they are not the deprecated .email() / .url() chain methods.
export const emailField = z
  .string({ error: 'Email is required.' })
  .trim()
  .min(5, 'Enter a valid email address.')
  .max(160)
  .refine((value) => z.email().safeParse(value).success, 'Enter a valid email address.')

export const phoneField = z
  .string({ error: 'Phone number is required.' })
  .trim()
  .regex(/^(\+?254|0)?[2-9]\d{7,8}$/, 'Enter a Kenyan phone number, for example 0712 345 678.')

export const kenyaCounty = trimmed(60, 'County')

export const captchaToken = z
  .string()
  .trim()
  .max(4096, 'Captcha token is too long.')
  .optional()
  .or(z.literal(''))

export const isoDate = z
  .string({ error: 'Pick a date.' })
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Use the date picker to choose a date.')

export const budgetBand = z.enum(['below-500k', '500k-2m', '2m-10m', 'above-10m'], {
  error: 'Choose the band that fits your budget.',
})

export const tradeCategory = z.enum([
  'Architecture',
  'Structural Engineering',
  'Plumbing',
  'Electrical',
  'Tiling and Flooring',
  'Roofing',
  'Painting',
  'Interior Design',
])

export const slugField = z
  .string()
  .trim()
  .min(2)
  .max(80)
  .regex(/^[a-z0-9-]+$/, 'Use lower case letters, numbers and hyphens only.')

// Absolute urls from the blob host, or a same origin path (the local stand in
// used when a deployment has no BLOB_READ_WRITE_TOKEN). Data urls and javascript
// urls are refused by the second arm of this test, not just by the first.
const sameOriginPath = /^\/(?:images|template|_next)\/[A-Za-z0-9._\/-]{1,300}$/

export const urlField = z
  .string()
  .trim()
  .max(800)
  .refine(
    (value) => z.url({ protocol: /^https?$/ }).safeParse(value).success || sameOriginPath.test(value),
    'Enter a valid image url.',
  )

const photoUrlList = z.array(urlField).max(6, 'Six photos at most.').optional()

export const registerSchema = z.object({
  name: trimmed(80, 'Full name'),
  email: emailField,
  password: z
    .string({ error: 'Password is required.' })
    .min(10, 'Use at least 10 characters.')
    .max(200, 'Password is too long.')
    .regex(/[A-Za-z]/, 'Include at least one letter.')
    .regex(/\d/, 'Include at least one number.'),
  county: kenyaCounty,
  phone: phoneField,
  recaptchaToken: captchaToken,
})

export const postProjectSchema = z
  .object({
    title: trimmed(120, 'Project title'),
    projectType: trimmed(80, 'Project type'),
    description: trimmed(4000, 'Description', 40),
    county: kenyaCounty,
    sizeValue: trimmed(40, 'Size'),
    sizeUnit: z.enum(['plot', 'sqm', 'sqft']),
    startDate: isoDate,
    deadline: isoDate,
    flexibility: z.enum(['fixed', 'slight', 'flexible']),
    budgetBand,
    contactName: trimmed(80, 'Contact name'),
    contactPhone: phoneField,
    contactEmail: emailField,
    photoUrls: photoUrlList,
    recaptchaToken: captchaToken,
  })
  .refine((data) => new Date(data.deadline) > new Date(data.startDate), {
    message: 'Completion deadline must fall after the start date.',
    path: ['deadline'],
  })

export const reviewSchema = z.object({
  contractorSlug: slugField,
  rating: z.coerce.number().int().min(1, 'Pick a star rating.').max(5),
  title: trimmed(120, 'Review title'),
  body: trimmed(2000, 'Review', 20),
  author: trimmed(80, 'Name'),
  county: kenyaCounty,
  recaptchaToken: captchaToken,
})

export const contractorApplicationSchema = z.object({
  company: trimmed(120, 'Company name'),
  owner: trimmed(80, 'Owner name'),
  trade: tradeCategory,
  county: kenyaCounty,
  ncaNumber: z
    .string({ error: 'NCA registration number is required.' })
    .trim()
    .min(6, 'Enter your full NCA registration number.')
    .max(40),
  yearsInOperation: z.coerce
    .number({ error: 'Years in operation must be a number.' })
    .min(3, 'A minimum of 3 years in operation is required.')
    .max(70),
  phone: phoneField,
  email: emailField,
  portfolioDescription: trimmed(3000, 'Portfolio description', 40),
  // An empty list passes validation, but the verification desk cannot clear a
  // file with no site evidence, and the form says so next to the picker.
  photoUrls: z.array(urlField).max(6, 'Six portfolio images at most.'),
  recaptchaToken: captchaToken,
})

export const messageSchema = z.object({
  projectId: trimmed(80, 'Project id'),
  body: trimmed(2000, 'Message', 2),
  author: optionalTrimmed(80),
  from: z.enum(['homeowner', 'contractor']).default('homeowner'),
  recaptchaToken: captchaToken,
})

export const acceptQuoteSchema = z.object({
  quoteId: trimmed(80, 'Quote id'),
  projectId: optionalTrimmed(80),
  recaptchaToken: captchaToken,
})

export const approveMilestoneSchema = z.object({
  projectId: trimmed(80, 'Project id'),
  milestoneId: trimmed(80, 'Milestone id'),
  note: optionalTrimmed(500),
  recaptchaToken: captchaToken,
})

export const enquirySchema = z.object({
  firstName: trimmed(60, 'First name'),
  lastName: optionalTrimmed(60),
  phone: phoneField,
  service: trimmed(80, 'Service'),
  message: trimmed(2000, 'Message', 10),
  email: emailField.optional().or(z.literal('')),
  recaptchaToken: captchaToken,
})

export const uploadSchema = z.object({
  folder: z.enum(['milestones', 'portfolio', 'reviews', 'applications', 'projects']),
  filenames: z.array(z.string().trim().min(1).max(120)).max(6).optional(),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type PostProjectInput = z.infer<typeof postProjectSchema>
export type ReviewInput = z.infer<typeof reviewSchema>
export type ContractorApplicationInput = z.infer<typeof contractorApplicationSchema>
export type EnquiryInput = z.infer<typeof enquirySchema>

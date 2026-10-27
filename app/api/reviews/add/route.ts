import { guard, ok, fail } from '@/lib/api'
import { reviewSchema } from '@/lib/validation'
import { auth } from '@/lib/auth'
import { store, KEYS } from '@/lib/kv'
import { CONTRACTORS, getContractor } from '@/lib/data/contractors'
import type { Review } from '@/lib/types'

export const runtime = 'nodejs'

/** POST /api/reviews/add, contractor review. reCAPTCHA v3 then Zod. */
export async function POST(request: Request) {
  const result = await guard({ request, schema: reviewSchema, action: 'review' })
  if (!result.data) return result.response

  const { contractorSlug, rating, title, body, author, county } = result.data
  const contractor = getContractor(contractorSlug)
  if (!contractor) return fail('That contractor is not in the directory.', {}, 404)

  const session = await auth()

  const stored = await store.readJson<Review[]>(KEYS.reviews(contractorSlug), [])
  const review: Review = {
    id: `rv-${Date.now().toString(36)}`,
    author,
    county,
    rating,
    title,
    body,
    date: new Date().toISOString().slice(0, 10),
    verified: Boolean(session?.user),
  }

  const all = [review, ...stored, ...contractor.reviews]
  await store.writeJson(KEYS.reviews(contractorSlug), [review, ...stored])

  const average = Math.round((all.reduce((sum, item) => sum + item.rating, 0) / all.length) * 10) / 10

  return ok({
    reviewId: review.id,
    contractorSlug,
    rating: average,
    reviewCount: all.length,
    review,
    directorySize: CONTRACTORS.length,
  })
}

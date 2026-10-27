'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'
import { CaptchaChallenge, Field, FormNote, FormStatus, SelectInput, TextArea, TextInput } from '@/components/form-ui'
import { useCaptchaForm } from '@/lib/api-client'
import { COUNTIES } from '@/lib/site'
import type { Review } from '@/lib/types'

const TITLES = [
  'Work finished on time',
  'Good site discipline',
  'Price held to the quote',
  'Communication could be better',
  'Would hire again',
  'Mixed experience',
]

/**
 * Post-project review. One submission per contractor per session: on success the
 * new review is shown immediately from the response, the directory average is
 * refreshed from the server, and the form closes so nobody double posts.
 */
export function ReviewForm({ contractorSlug, contractorCompany }: { contractorSlug: string; contractorCompany: string }) {
  const [values, setValues] = useState({ rating: 0, title: '', body: '', author: '', county: '' })
  const [posted, setPosted] = useState<Review | null>(null)
  const [average, setAverage] = useState<string | null>(null)
  const { submit, result, pending, challengeOpen, completeChallenge, issues } = useCaptchaForm<{
    reviewId?: string
    rating?: number
    review?: Review
  }>('review', '/api/reviews/add')

  const set = (key: keyof typeof values) => (value: string) => setValues((prev) => ({ ...prev, [key]: value }))

  const error = !result?.ok && result ? result.message : undefined
  const success = posted ? (
    <>
      Your review of {contractorCompany} is on the profile. Thank you for the detail: it is the part contractors say
      actually changes how they run a site.
      {average ? ` The published rating is now ${average} out of 5.` : ''}
    </>
  ) : null

  if (posted) {
    return (
      <div className="card p-6 sm:p-8">
        <FormStatus success={success} successTitle="Review submitted" />
        <div className="mt-5 rounded-[3px] bg-[color:var(--nb-light)] p-4">
          <p className="mb-1 text-[13px] font-semibold uppercase tracking-wide text-[color:var(--gray)]">
            What you wrote
          </p>
          <p className="mb-2 text-[15px] font-bold text-[color:var(--nb-secondary)]">{posted.title}</p>
          <p className="mb-0 text-[14px] leading-relaxed text-[color:var(--gray-dark)]">{posted.body}</p>
        </div>
      </div>
    )
  }

  return (
    <form
      className="card p-6 sm:p-8"
      onSubmit={(event) => {
        event.preventDefault()
        if (!values.rating) return
        void submit({ ...values, contractorSlug }).then((response) => {
          if (response.ok && response.data?.review) {
            setPosted(response.data.review)
            if (typeof response.data.rating === 'number') setAverage(response.data.rating.toFixed(1))
          }
        })
      }}
      noValidate
    >
      <h3 className="mb-1 text-[20px] font-bold text-[color:var(--nb-secondary)] sm:text-[24px]">
        Review {contractorCompany}
      </h3>
      <p className="mb-6 text-[14px] leading-relaxed text-[color:var(--gray)]">
        Only homeowners with a project on the platform can post here. Say what happened on site, not how the quote
        made you feel.
      </p>

      <div className="mb-5">
        <span className="label" id="nb-rating-label">
          Your rating
          <span className="ml-1 text-[color:var(--red)]">*</span>
        </span>
        <div className="flex items-center gap-1" role="radiogroup" aria-labelledby="nb-rating-label">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              role="radio"
              aria-checked={values.rating === star}
              aria-label={`${star} out of 5`}
              onClick={() => setValues((prev) => ({ ...prev, rating: star }))}
              className="inline-flex h-11 w-11 items-center justify-center rounded-[3px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--nb-primary)]"
            >
              <Star
                className={`h-7 w-7 transition-transform ${
                  values.rating >= star ? 'fill-[color:var(--nb-primary)] text-[color:var(--nb-primary)]' : 'text-black/20'
                } ${values.rating === star ? 'scale-110' : ''}`}
                aria-hidden="true"
              />
            </button>
          ))}
          <span className="ml-2 text-[14px] font-semibold text-[color:var(--gray-dark)]">
            {values.rating ? `${values.rating} of 5` : 'Pick a score'}
          </span>
        </div>
        {!values.rating ? (
          <p className="help">A score is required before the review can be published.</p>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
        <Field label="Your name" name="author" required error={findByField(issues, 'author')}>
          {(props) => (
            <TextInput
              {...props}
              name="author"
              value={values.author}
              onChange={set('author')}
              placeholder="As it should appear"
              autoComplete="name"
            />
          )}
        </Field>
        <Field label="Your county" name="county" required error={findByField(issues, 'county')}>
          {(props) => (
            <SelectInput
              {...props}
              name="county"
              value={values.county}
              onChange={set('county')}
              placeholder="Select your county"
              options={COUNTIES.map((county) => ({ value: county, label: county }))}
            />
          )}
        </Field>
      </div>

      <Field label="Headline" name="title" required error={findByField(issues, 'title')} hint="One short line, the way you would tell a neighbour.">
        {(props) => (
          <TextInput
            {...props}
            name="title"
            value={values.title}
            onChange={set('title')}
            placeholder="Pick one or write your own"
            list="nb-review-titles"
          />
        )}
      </Field>
      <datalist id="nb-review-titles">
        {TITLES.map((title) => (
          <option key={title} value={title} />
        ))}
      </datalist>

      <Field
        label="What happened on site"
        name="body"
        required
        error={findByField(issues, 'body')}
        hint={`${values.body.length} characters. Twenty at minimum.`}
      >
        {(props) => (
          <TextArea
            {...props}
            name="body"
            rows={5}
            value={values.body}
            onChange={set('body')}
            placeholder="Milestones, programme, variations, how the site was left each evening."
          />
        )}
      </Field>

      <CaptchaChallenge active={challengeOpen} onToken={(token) => completeChallenge(token)} />

      <div className="mb-5">
        <FormStatus pending={pending} error={error} success={success} />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button type="submit" className="btn btn-primary w-full px-6 py-3 sm:w-auto" disabled={pending}>
          {pending ? 'Publishing...' : 'Publish review'}
        </button>
        <FormNote>Your name and county are shown, never your phone number.</FormNote>
      </div>
    </form>
  )
}

function findByField(issues: Array<{ field: string; message: string }>, field: string) {
  return issues.find((issue) => issue.field === field)?.message
}

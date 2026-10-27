'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { z } from 'zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, Check, LogIn, Save } from 'lucide-react'
import {
  CaptchaChallenge,
  Field,
  FormNote,
  FormStatus,
  SelectInput,
  Stepper,
  TextArea,
  TextInput,
} from '@/components/form-ui'
import { ImagePicker, type PickedImage } from '@/components/image-picker'
import { useCaptchaForm, fieldIssues } from '@/lib/api-client'
import { useProjectDraftStore } from '@/lib/stores'
import { emailField, phoneField } from '@/lib/validation'
import { BUDGET_BANDS, COUNTIES, FLEXIBILITY_OPTIONS, PROJECT_TYPES } from '@/lib/site'
import { PICTURES } from '@/lib/images'
import { PexImage } from '@/components/pex-image'

const STEPS = ['The project', 'Scope and photos', 'Programme', 'Budget and contact']

const email = emailField
const phone = phoneField

const stepSchemas = [
  z.object({
    title: z.string().trim().min(6, 'Give the project a short title, at least 6 characters.').max(120),
    projectType: z.enum(PROJECT_TYPES, { error: 'Choose the type of project.' }),
    description: z
      .string()
      .trim()
      .min(40, 'Tell contractors what you need, in at least 40 characters.')
      .max(4000, 'Keep it under 4000 characters.'),
    county: z.string().trim().min(2, 'Choose the county the site is in.'),
  }),
  z.object({
    sizeValue: z.string().trim().min(1, 'Enter the plot size or floor area.').max(40),
    sizeUnit: z.enum(['plot', 'sqm', 'sqft'], { error: 'Pick a unit.' }),
  }),
  z
    .object({
      startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Pick a start date.'),
      deadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Pick a completion date.'),
      flexibility: z.enum(['fixed', 'slight', 'flexible'], { error: 'Tell us about the dates.' }),
    })
    .refine((data) => new Date(data.deadline) > new Date(data.startDate), {
      message: 'The completion date must fall after the start date.',
      path: ['deadline'],
    }),
  z.object({
    budgetBand: z.enum(['below-500k', '500k-2m', '2m-10m', 'above-10m'], {
      error: 'Choose the band that fits your budget.',
    }),
    contactName: z.string().trim().min(2, 'Who should the contractors ask for?').max(80),
    contactPhone: phone,
    contactEmail: email,
  }),
]

type Values = {
  title: string
  projectType: string
  description: string
  county: string
  sizeValue: string
  sizeUnit: 'plot' | 'sqm' | 'sqft'
  startDate: string
  deadline: string
  flexibility: 'fixed' | 'slight' | 'flexible'
  budgetBand: string
  contactName: string
  contactPhone: string
  contactEmail: string
}

const EMPTY: Values = {
  title: '',
  projectType: '',
  description: '',
  county: '',
  sizeValue: '',
  sizeUnit: 'plot',
  startDate: '',
  deadline: '',
  flexibility: 'slight',
  budgetBand: '',
  contactName: '',
  contactPhone: '',
  contactEmail: '',
}

/**
 * Four step project post. The draft lives in `useProjectDraftStore`, so a lost
 * connection or a closed tab on a shared computer does not throw away a homeowner's
 * afternoon. Each step validates on its own before the next one opens.
 */
export function ProjectWizard({ signedIn }: { signedIn: boolean }) {
  const router = useRouter()
  const storedStep = useProjectDraftStore((state) => state.step)
  const storedValues = useProjectDraftStore((state) => state.values)
  const setDraftValues = useProjectDraftStore((state) => state.setValues)
  const setDraftStep = useProjectDraftStore((state) => state.setStep)
  const resetDraft = useProjectDraftStore((state) => state.reset)
  const [step, setStep] = useState(storedStep)
  const [values, setValues] = useState<Values>({ ...EMPTY, ...(storedValues as Partial<Values>) })
  const [photos, setPhotos] = useState<PickedImage[]>(
    Array.isArray((storedValues as { photoUrls?: string[] }).photoUrls)
      ? (storedValues as { photoUrls: string[] }).photoUrls.map((url) => ({ url, name: 'saved image' }))
      : [],
  )
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({})
  const [savedAt, setSavedAt] = useState<string | null>(null)
  const topRef = useRef<HTMLDivElement>(null)
  const hydrated = useRef(false)

  const { submit, result, pending, challengeOpen, completeChallenge, issues } = useCaptchaForm<{
    projectId?: string
    quotesReleased?: number
    redirectTo?: string
  }>('post-project', '/api/projects/post')

  useEffect(() => {
    hydrated.current = true
  }, [])

  useEffect(() => {
    if (!hydrated.current) return
    setDraftValues({ ...values, photoUrls: photos.map((photo) => photo.url) })
    setDraftStep(step)
    setSavedAt(new Date().toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' }))
  }, [values, photos, step, setDraftValues, setDraftStep])

  const set = (key: keyof Values) => (value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }))
    setLocalErrors((prev) => {
      if (!prev[key]) return prev
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  const errorFor = (field: string) => localErrors[field] ?? fieldIssues(issues, field)

  const validateStep = () => {
    const parsed = stepSchemas[step - 1].safeParse(values)
    if (parsed.success) {
      setLocalErrors({})
      return true
    }
    const next: Record<string, string> = {}
    for (const issue of parsed.error.issues) next[String(issue.path[0])] = issue.message
    setLocalErrors(next)
    const first = Object.keys(next)[0]
    if (first) {
      const el = document.querySelector<HTMLElement>(`[data-field="${first}"]`)
      el?.focus()
      el?.scrollIntoView({ block: 'center' })
    }
    return false
  }

  const go = (direction: 1 | -1) => {
    if (direction === 1 && !validateStep()) return
    setStep((current) => Math.min(STEPS.length, Math.max(1, current + direction)))
    topRef.current?.scrollIntoView({ block: 'start', behavior: 'smooth' })
  }

  const summary = useMemo(
    () => [
      ['Project', values.title || 'Not named yet'],
      ['Type', values.projectType || 'Not chosen'],
      ['County', values.county || 'Not chosen'],
      ['Size', values.sizeValue ? `${values.sizeValue} ${values.sizeUnit}` : 'Not given'],
      ['Window', values.startDate && values.deadline ? `${values.startDate} to ${values.deadline}` : 'Not set'],
      [
        'Budget',
        BUDGET_BANDS.find((band) => band.value === values.budgetBand)?.label ?? 'Not chosen',
      ],
      ['Photos', `${photos.length} attached`],
    ],
    [values, photos.length],
  )

  const send = () => {
    if (!validateStep()) return
    void submit({ ...values, photoUrls: photos.map((photo) => photo.url) }).then((response) => {
      if (response.ok && response.data?.redirectTo) {
        resetDraft()
        router.push(response.data.redirectTo)
      }
    })
  }

  const error = !result?.ok && result ? result.message : undefined

  return (
    <div ref={topRef} className="card overflow-hidden">
      <div className="relative isolate border-b border-black/5 bg-[color:var(--nb-light)] p-5 sm:p-7">
        <PexImage picture={PICTURES.postHero} alt="" fill sizes="100vw" className="-z-10 object-cover opacity-10" />
        <Stepper steps={STEPS} current={step} />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="mb-0 text-[13px] text-[color:var(--gray-dark)]">
            Step {step} of {STEPS.length}: {STEPS[step - 1]}
          </p>
          {savedAt ? (
            <p className="mb-0 inline-flex items-center gap-1.5 text-[12px] text-[color:var(--gray)]">
              <Save className="h-3.5 w-3.5" aria-hidden="true" />
              Draft kept on this device at {savedAt}
            </p>
          ) : null}
        </div>
      </div>

      <div className="p-5 sm:p-7">
        {step === 1 ? (
          <fieldset className="border-0 p-0">
            <legend className="subheading mb-4">What are you building</legend>
            <Field label="Project title" name="title" required error={errorFor('title')} hint="One line, the way you would describe it to a neighbour.">
              {(props) => (
                <TextInput
                  {...props}
                  name="title"
                  value={values.title}
                  onChange={set('title')}
                  placeholder="Four bedroom maisonette in Ruaraka, ground and first floor"
                />
              )}
            </Field>

            <Field label="Type of project" name="projectType" required error={errorFor('projectType')}>
              {(props) => (
                <SelectInput
                  {...props}
                  name="projectType"
                  value={values.projectType}
                  onChange={set('projectType')}
                  placeholder="Select the closest match"
                  options={PROJECT_TYPES.map((type) => ({ value: type, label: type }))}
                />
              )}
            </Field>

            <Field
              label="Describe the work"
              name="description"
              required
              error={errorFor('description')}
              hint={`${values.description.length} characters. Forty at minimum. Say what exists on site today and what you want handed over.`}
            >
              {(props) => (
                <TextArea
                  {...props}
                  name="description"
                  rows={6}
                  value={values.description}
                  onChange={set('description')}
                  placeholder="Foundation is already poured. I need blockwork to lintel, roof covering, and first fix plumbing and electrical. Drawings are approved by Kiambu county."
                />
              )}
            </Field>

            <Field label="County" name="county" required error={errorFor('county')} hint="Contractors outside this county can still see the project, they are just ranked lower.">
              {(props) => (
                <SelectInput
                  {...props}
                  name="county"
                  value={values.county}
                  onChange={set('county')}
                  placeholder="Select the site county"
                  options={COUNTIES.map((county) => ({ value: county, label: county }))}
                />
              )}
            </Field>
          </fieldset>
        ) : null}

        {step === 2 ? (
          <fieldset className="border-0 p-0">
            <legend className="subheading mb-4">Scope and evidence</legend>
            <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
              <Field label="Size" name="sizeValue" required error={errorFor('sizeValue')} hint="Plot measurement or floor area.">
                {(props) => (
                  <TextInput {...props} name="sizeValue" value={values.sizeValue} onChange={set('sizeValue')} placeholder="50 by 100" />
                )}
              </Field>
              <Field label="Unit" name="sizeUnit" required error={errorFor('sizeUnit')}>
                {(props) => (
                  <SelectInput
                    {...props}
                    name="sizeUnit"
                    value={values.sizeUnit}
                    onChange={set('sizeUnit')}
                    placeholder="Select a unit"
                    options={[
                      { value: 'plot', label: 'Plot (e.g. 50 by 100)' },
                      { value: 'sqm', label: 'Square metres' },
                      { value: 'sqft', label: 'Square feet' },
                    ]}
                  />
                )}
              </Field>
            </div>

            <ImagePicker
              label="Photos of the site as it stands"
              id="photos"
              folder="projects"
              max={6}
              value={photos}
              onChange={setPhotos}
              hint="Six at most. A photo of the current state cuts bad quotes more than any description."
            />
          </fieldset>
        ) : null}

        {step === 3 ? (
          <fieldset className="border-0 p-0">
            <legend className="subheading mb-4">Programme</legend>
            <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
              <Field label="Preferred start date" name="startDate" required error={errorFor('startDate')}>
                {(props) => (
                  <TextInput {...props} name="startDate" type="date" value={values.startDate} onChange={set('startDate')} />
                )}
              </Field>
              <Field label="Target completion" name="deadline" required error={errorFor('deadline')}>
                {(props) => (
                  <TextInput {...props} name="deadline" type="date" value={values.deadline} onChange={set('deadline')} />
                )}
              </Field>
            </div>

            <div className="mb-5">
              <span className="label" id="nb-flex">
                How fixed are those dates?
              </span>
              <div className="flex flex-col gap-2" role="radiogroup" aria-labelledby="nb-flex">
                {FLEXIBILITY_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    role="radio"
                    aria-checked={values.flexibility === option.value}
                    onClick={() => set('flexibility')(option.value)}
                    className={`inline-flex min-h-[54px] items-center justify-between gap-3 rounded-[3px] border px-4 text-left text-[14px] font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--nb-primary)] ${
                      values.flexibility === option.value
                        ? 'border-[color:var(--nb-primary)] bg-[color:var(--nb-primary)]/8 text-[color:var(--nb-secondary)]'
                        : 'border-black/10 bg-black/5 text-[color:var(--gray-dark)]'
                    }`}
                  >
                    {option.label}
                    {values.flexibility === option.value ? (
                      <Check className="h-4 w-4 shrink-0 text-[color:var(--nb-primary)]" aria-hidden="true" />
                    ) : null}
                  </button>
                ))}
              </div>
              {errorFor('flexibility') ? <p className="error">{errorFor('flexibility')}</p> : null}
            </div>

            <p className="mb-0 rounded-[3px] bg-[color:var(--nb-light)] p-4 text-[13px] leading-relaxed text-[color:var(--gray-dark)]">
              Contractors price against these dates, and the milestone schedule you will approve is built from them. A
              realistic window gets better quotes than an ambitious one.
            </p>
          </fieldset>
        ) : null}

        {step === 4 ? (
          <fieldset className="border-0 p-0">
            <legend className="subheading mb-4">Budget and who to call</legend>
            <Field label="Budget band" name="budgetBand" required error={errorFor('budgetBand')} hint="Contractors see the band, never the exact figure.">
              {(props) => (
                <SelectInput
                  {...props}
                  name="budgetBand"
                  value={values.budgetBand}
                  onChange={set('budgetBand')}
                  placeholder="Select a band"
                  options={BUDGET_BANDS.map((band) => ({ value: band.value, label: band.label }))}
                />
              )}
            </Field>

            <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
              <Field label="Contact name" name="contactName" required error={errorFor('contactName')}>
                {(props) => (
                  <TextInput {...props} name="contactName" value={values.contactName} onChange={set('contactName')} autoComplete="name" />
                )}
              </Field>
              <Field label="Contact phone" name="contactPhone" required error={errorFor('contactPhone')} hint="Shared with a contractor only after you accept their quote.">
                {(props) => (
                  <TextInput {...props} name="contactPhone" type="tel" inputMode="tel" value={values.contactPhone} onChange={set('contactPhone')} placeholder="0712 345 678" autoComplete="tel" />
                )}
              </Field>
            </div>

            <Field label="Contact email" name="contactEmail" required error={errorFor('contactEmail')}>
              {(props) => (
                <TextInput {...props} name="contactEmail" type="email" inputMode="email" value={values.contactEmail} onChange={set('contactEmail')} autoComplete="email" />
              )}
            </Field>

            <div className="mb-5 rounded-[3px] bg-[color:var(--nb-light)] p-4">
              <p className="mb-2 text-[12px] font-bold uppercase tracking-[0.1em] text-[color:var(--gray)]">
                What contractors will see
              </p>
              <dl className="mb-0 grid grid-cols-1 gap-x-6 gap-y-2 text-[14px] sm:grid-cols-2">
                {summary.map(([label, value]) => (
                  <div key={label} className="flex gap-2">
                    <dt className="text-[color:var(--gray)]">{label}:</dt>
                    <dd className="mb-0 flex-1 font-semibold text-[color:var(--nb-secondary)]">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <CaptchaChallenge active={challengeOpen} onToken={(token) => completeChallenge(token)} />

            <div className="mb-5">
              <FormStatus pending={pending} error={error} />
            </div>

            {signedIn ? (
              <button type="button" onClick={send} disabled={pending} className="btn btn-primary w-full px-6 py-3 sm:w-auto">
                {pending ? 'Publishing your project...' : 'Post project and start receiving quotes'}
              </button>
            ) : (
              <div className="flex flex-col gap-3 rounded-[3px] border border-black/10 p-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="mb-0 text-[14px] leading-relaxed text-[color:var(--gray-dark)]">
                  Your draft is safe on this device. Sign in to publish it: quotes go to your dashboard, where you can
                  compare them side by side.
                </p>
                <Link href="/login?callbackUrl=%2Fpost-project" className="btn btn-primary inline-flex shrink-0 items-center gap-2 px-5 py-3 text-[13px]">
                  <LogIn className="h-4 w-4" aria-hidden="true" />
                  Sign in and post
                </Link>
              </div>
            )}

            <div className="mt-4">
              <FormNote>
                Posting is free, and there is no commission on a quote you accept. You can take a project down at any
                time from your dashboard.
              </FormNote>
            </div>
          </fieldset>
        ) : null}
      </div>

      <div className="flex items-stretch gap-3 border-t border-black/5 bg-[color:var(--nb-light)] p-4 sm:p-5">
        <button
          type="button"
          onClick={() => go(-1)}
          disabled={step === 1}
          className="btn btn-ghost inline-flex min-h-[48px] items-center justify-center gap-2 px-4 py-2 text-[13px] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back
        </button>
        {step < STEPS.length ? (
          <button
            type="button"
            onClick={() => go(1)}
            className="btn btn-primary ml-auto inline-flex min-h-[48px] items-center justify-center gap-2 px-6 py-2 text-[13px]"
          >
            Next: {STEPS[step]}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        ) : null}
      </div>
    </div>
  )
}

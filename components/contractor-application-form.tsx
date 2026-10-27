'use client'

import { useState } from 'react'
import { CheckCircle2, ShieldQuestion } from 'lucide-react'
import {
  CaptchaChallenge,
  Field,
  FormNote,
  FormStatus,
  SelectInput,
  TextArea,
  TextInput,
} from '@/components/form-ui'
import { ImagePicker, type PickedImage } from '@/components/image-picker'
import { useCaptchaForm, fieldIssues } from '@/lib/api-client'
import { CONTRACTOR_TRADES } from '@/lib/data/contractors'
import { COUNTIES, SITE } from '@/lib/site'

type Values = {
  company: string
  owner: string
  trade: string
  county: string
  ncaNumber: string
  yearsInOperation: string
  phone: string
  email: string
  portfolioDescription: string
}

const EMPTY: Values = {
  company: '',
  owner: '',
  trade: '',
  county: '',
  ncaNumber: '',
  yearsInOperation: '',
  phone: '',
  email: '',
  portfolioDescription: '',
}

/**
 * Contractor application. This is the only place in the product where we take
 * credentials from a business, so every field explains what it is used for, and
 * nothing is published until the verification desk clears the file.
 */
export function ContractorApplicationForm() {
  const [values, setValues] = useState<Values>(EMPTY)
  const [photos, setPhotos] = useState<PickedImage[]>([])
  const [submitted, setSubmitted] = useState<{ id: string; photos: number } | null>(null)

  const { submit, result, pending, challengeOpen, completeChallenge, issues } = useCaptchaForm<{
    applicationId?: string
    status?: string
  }>('contractor-application', '/api/contractors/apply')

  const set = (key: keyof Values) => (value: string) => setValues((prev) => ({ ...prev, [key]: value }))
  const issue = (field: string) => fieldIssues(issues, field)

  const error = !result?.ok && result ? result.message : undefined
  const success = submitted ? (
    <>
      Application <strong>{submitted.id}</strong> is with the verification desk. We will email you the outcome, and the
      only thing you need to send before then is your original NCA certificate if we ask for it.
      {submitted.photos === 0 ? ' You submitted no site photos: expect a slower decision, evidence is what clears a file.' : ''}
    </>
  ) : null

  if (submitted) {
    return (
      <div className="card p-6 sm:p-10">
        <FormStatus success={success} successTitle="Application received" />
        <p className="mt-6 mb-0 flex items-start gap-2 text-[14px] leading-relaxed text-[color:var(--gray-dark)]">
          <ShieldQuestion className="mt-0.5 h-5 w-5 shrink-0 text-[color:var(--nb-primary)]" aria-hidden="true" />
          Nothing about your company is public yet. Your profile, your quotes and your rating only appear once the file
          clears.
        </p>
      </div>
    )
  }

  return (
    <form
      className="card p-6 sm:p-8"
      onSubmit={(event) => {
        event.preventDefault()
        void submit({ ...values, yearsInOperation: values.yearsInOperation, photoUrls: photos.map((p) => p.url) }).then(
          (response) => {
            if (response.ok && response.data?.applicationId) {
              setSubmitted({ id: response.data.applicationId, photos: photos.length })
            }
          },
        )
      }}
      noValidate
    >
      <fieldset className="mb-8 border-0 p-0">
        <legend className="subheading mb-3">The company</legend>
        <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
          <Field label="Registered company name" name="company" required error={issue('company')}>
            {(props) => (
              <TextInput {...props} name="company" value={values.company} onChange={set('company')} placeholder="As on your CR certificate" autoComplete="organization" />
            )}
          </Field>
          <Field label="Owner or lead name" name="owner" required error={issue('owner')}>
            {(props) => (
              <TextInput {...props} name="owner" value={values.owner} onChange={set('owner')} placeholder="Who signs the quotes" autoComplete="name" />
            )}
          </Field>
          <Field label="Main trade" name="trade" required error={issue('trade')}>
            {(props) => (
              <SelectInput
                {...props}
                name="trade"
                value={values.trade}
                onChange={set('trade')}
                placeholder="Select your main trade"
                options={CONTRACTOR_TRADES.map((trade) => ({ value: trade, label: trade }))}
              />
            )}
          </Field>
          <Field label="Home county" name="county" required error={issue('county')} hint="Where you can mobilise fastest. You can add service areas later.">
            {(props) => (
              <SelectInput
                {...props}
                name="county"
                value={values.county}
                onChange={set('county')}
                placeholder="Select a county"
                options={COUNTIES.map((county) => ({ value: county, label: county }))}
              />
            )}
          </Field>
        </div>
      </fieldset>

      <fieldset className="mb-8 border-0 p-0">
        <legend className="subheading mb-3">Your registration</legend>
        <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
          <Field
            label="NCA registration number"
            name="ncaNumber"
            required
            error={issue('ncaNumber')}
            hint="National Construction Authority number, exactly as printed on your certificate."
          >
            {(props) => (
              <TextInput
                {...props}
                name="ncaNumber"
                value={values.ncaNumber}
                onChange={set('ncaNumber')}
                placeholder="NCA/AR/2018/00000"
                inputMode="text"
              />
            )}
          </Field>
          <Field label="Years in operation" name="yearsInOperation" required error={issue('yearsInOperation')} hint="Minimum 3 years.">
            {(props) => (
              <TextInput
                {...props}
                name="yearsInOperation"
                type="number"
                min="3"
                max="70"
                value={values.yearsInOperation}
                onChange={set('yearsInOperation')}
                placeholder="12"
                inputMode="numeric"
              />
            )}
          </Field>
          <Field label="Phone" name="phone" required error={issue('phone')} hint="Home owners message you here. It is masked until they accept your quote.">
            {(props) => (
              <TextInput {...props} name="phone" type="tel" value={values.phone} onChange={set('phone')} placeholder="0712 345 678" autoComplete="tel" inputMode="tel" />
            )}
          </Field>
          <Field label="Email" name="email" required error={issue('email')} hint="Where decisions about your application are sent.">
            {(props) => (
              <TextInput {...props} name="email" type="email" value={values.email} onChange={set('email')} placeholder="you@company.co.ke" autoComplete="email" inputMode="email" />
            )}
          </Field>
        </div>
      </fieldset>

      <fieldset className="mb-8 border-0 p-0">
        <legend className="subheading mb-3">Proof of work</legend>
        <Field
          label="What should a homeowner know about your work?"
          name="portfolioDescription"
          required
          error={issue('portfolioDescription')}
          hint={`${values.portfolioDescription.length} characters. Forty at minimum. Name the kinds of projects you finish well and the ones you do not take.`}
        >
          {(props) => (
            <TextArea
              {...props}
              name="portfolioDescription"
              rows={6}
              value={values.portfolioDescription}
              onChange={set('portfolioDescription')}
              placeholder="Four bedroom houses to roof level, six to eight weeks on structure. We do not take basements or steel frame work."
            />
          )}
        </Field>

        <ImagePicker
          label="Photos of completed sites"
          id="portfolio"
          folder="applications"
          max={6}
          value={photos}
          onChange={setPhotos}
          hint="Six at most. Photographs of work you finished, not show homes."
        />
        {photos.length === 0 ? (
          <p className="help -mt-3 mb-6">
            Applications without site photos are still accepted, but they sit behind the ones with evidence.
          </p>
        ) : null}
      </fieldset>

      <CaptchaChallenge active={challengeOpen} onToken={(token) => completeChallenge(token)} />

      <div className="mb-5">
        <FormStatus pending={pending} error={error} success={success} />
      </div>

      <div className="flex flex-col gap-4 border-t border-black/5 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <button type="submit" className="btn btn-primary w-full px-6 py-3 sm:w-auto" disabled={pending}>
          {pending ? 'Sending your file...' : 'Submit application'}
        </button>
        <FormNote>
          {SITE.name} checks your NCA number against the public register and calls two of the sites you list. There is
          no joining fee and no commission on a quote you win.
        </FormNote>
      </div>

      <p className="mt-6 mb-0 flex items-start gap-2 text-[13px] leading-relaxed text-[color:var(--gray)]">
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--green)]" aria-hidden="true" />
        You can withdraw an application at any time by replying to the confirmation email. Nothing is published
        without your sign off.
      </p>
    </form>
  )
}

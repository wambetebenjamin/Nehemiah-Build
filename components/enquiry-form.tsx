'use client'

import { useState } from 'react'
import { CaptchaChallenge, Field, FormStatus, SelectInput, TextArea, TextInput } from '@/components/form-ui'
import { useCaptchaForm } from '@/lib/api-client'

const SERVICES = [
  { value: 'Post a construction project', label: 'Post a construction project' },
  { value: 'Join as a verified contractor', label: 'Join as a verified contractor' },
  { value: 'Milestone payments and escrow questions', label: 'Milestone payments and escrow questions' },
  { value: 'Report a dispute', label: 'Report a dispute' },
  { value: 'Something else', label: 'Something else' },
]

/**
 * "Inquire Now" form from the template, now posting to /api/send-enquiry with a
 * reCAPTCHA v3 token. Used on the homepage and the contact strip.
 */
export function EnquiryForm({ compact = false }: { compact?: boolean }) {
  const [values, setValues] = useState({ firstName: '', lastName: '', phone: '', service: '', message: '', email: '' })
  const { submit, result, pending, challengeOpen, completeChallenge, issues } = useCaptchaForm<{
    enquiryId?: string
  }>('enquiry', '/api/send-enquiry')

  const set = (key: keyof typeof values) => (value: string) => setValues((prev) => ({ ...prev, [key]: value }))

  const error = !result?.ok && result ? result.message : undefined
  const success = result?.ok ? (
    <>
      Thank you. The project desk has your enquiry
      {result.data?.enquiryId ? ` (reference ${result.data.enquiryId})` : ''} and will reply on the phone number you
      gave, usually the same working day.
    </>
  ) : null

  return (
    <form
      className={compact ? '' : 'card p-6 sm:p-8'}
      onSubmit={(event) => {
        event.preventDefault()
        void submit(values)
      }}
      noValidate
    >
      <h3 className="mb-5 text-[20px] font-bold text-[color:var(--nb-secondary)] sm:text-[24px]">Request a quote</h3>

      <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
        <Field label="First name" name="firstName" required error={issues.find((i) => i.field === 'firstName')?.message}>
          {(props) => <TextInput {...props} name="firstName" value={values.firstName} onChange={set('firstName')} placeholder="First name" autoComplete="given-name" />}
        </Field>
        <Field label="Last name" name="lastName" error={issues.find((i) => i.field === 'lastName')?.message}>
          {(props) => <TextInput {...props} name="lastName" value={values.lastName} onChange={set('lastName')} placeholder="Last name" autoComplete="family-name" />}
        </Field>
      </div>

      <Field label="Phone" name="phone" required error={issues.find((i) => i.field === 'phone')?.message}>
        {(props) => (
          <TextInput
            {...props}
            name="phone"
            type="tel"
            inputMode="tel"
            value={values.phone}
            onChange={set('phone')}
            placeholder="0712 345 678"
            autoComplete="tel"
          />
        )}
      </Field>

      <Field label="Email" name="email" hint="Optional. Needed only if you want the quote by email too.">
        {(props) => (
          <TextInput
            {...props}
            name="email"
            type="email"
            inputMode="email"
            value={values.email}
            onChange={set('email')}
            placeholder="you@email.com"
            autoComplete="email"
          />
        )}
      </Field>

      <Field label="What do you need" name="service" required error={issues.find((i) => i.field === 'service')?.message}>
        {(props) => (
          <SelectInput
            {...props}
            name="service"
            value={values.service}
            onChange={set('service')}
            options={SERVICES}
            placeholder="Select what you need"
          />
        )}
      </Field>

      <Field label="Message" name="message" required error={issues.find((i) => i.field === 'message')?.message}>
        {(props) => (
          <TextArea
            {...props}
            name="message"
            value={values.message}
            onChange={set('message')}
            placeholder="Plot size, county, what stage you are at, and what you need done."
          />
        )}
      </Field>

      <CaptchaChallenge active={challengeOpen} onToken={completeChallenge} />

      <div className="mb-4">
        <FormStatus pending={pending} error={error} success={success} successTitle="Enquiry sent" />
      </div>

      <button type="submit" className="btn btn-primary w-full sm:w-auto px-8 py-3" disabled={pending}>
        {pending ? 'Sending' : 'Request A Quote'}
      </button>
    </form>
  )
}

export default EnquiryForm

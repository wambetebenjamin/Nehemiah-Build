'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, UserRound } from 'lucide-react'
import { CaptchaChallenge, Field, FormNote, FormStatus, SelectInput, TextInput } from '@/components/form-ui'
import { useCaptchaForm, fieldIssues } from '@/lib/api-client'
import { COUNTIES } from '@/lib/site'

/**
 * Account creation. The password never travels anywhere unencrypted other than
 * the sign in request itself; this form posts to /api/auth/register, which hashes
 * with scrypt and never returns the record.
 */
export function RegisterForm({ defaultCounty }: { defaultCounty?: string }) {
  const router = useRouter()
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    county: defaultCounty ?? '',
    phone: '',
  })
  const [created, setCreated] = useState(false)

  const { submit, result, pending, challengeOpen, completeChallenge, issues } = useCaptchaForm<{
    email?: string
    redirectTo?: string
  }>('register', '/api/auth/register')

  const set = (key: keyof typeof values) => (value: string) => setValues((prev) => ({ ...prev, [key]: value }))
  const error = !result?.ok && result ? result.message : undefined

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        void submit(values).then((response) => {
          if (response.ok) {
            setCreated(true)
            window.setTimeout(() => router.push(`/login?callbackUrl=${encodeURIComponent('/post-project')}`), 1200)
          }
        })
      }}
      noValidate
    >
      <h2 className="mb-1 flex items-center gap-2 text-[22px] font-bold text-[color:var(--nb-secondary)]">
        <UserRound className="h-5 w-5 text-[color:var(--nb-primary)]" aria-hidden="true" />
        Create your account
      </h2>
      <p className="mb-6 text-[14px] leading-relaxed text-[color:var(--gray)]">
        One account covers posting projects, comparing quotes and approving milestones. Already have it?{' '}
        <Link href="/login" className="font-semibold text-[color:var(--nb-primary)] underline">
          Sign in instead
        </Link>
        .
      </p>

      <Field label="Full name" name="name" required error={fieldIssues(issues, 'name')}>
        {(props) => (
          <TextInput {...props} name="name" value={values.name} onChange={set('name')} placeholder="Wanjiku Njeri" autoComplete="name" />
        )}
      </Field>

      <Field label="Email" name="email" required error={fieldIssues(issues, 'email')}>
        {(props) => (
          <TextInput {...props} name="email" type="email" inputMode="email" autoComplete="email" value={values.email} onChange={set('email')} placeholder="you@example.co.ke" />
        )}
      </Field>

      <Field
        label="Password"
        name="password"
        required
        error={fieldIssues(issues, 'password')}
        hint="At least 10 characters, with one number. We store a salted scrypt hash, never the password."
      >
        {(props) => (
          <TextInput {...props} name="password" type="password" autoComplete="new-password" value={values.password} onChange={set('password')} />
        )}
      </Field>

      <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
        <Field label="County" name="county" required error={fieldIssues(issues, 'county')} hint="Used to rank contractors near your site.">
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
        <Field label="Phone" name="phone" required error={fieldIssues(issues, 'phone')} hint="Only shared with a contractor you accept.">
          {(props) => (
            <TextInput {...props} name="phone" type="tel" inputMode="tel" autoComplete="tel" value={values.phone} onChange={set('phone')} placeholder="0712 345 678" />
          )}
        </Field>
      </div>

      <CaptchaChallenge active={challengeOpen} onToken={(token) => completeChallenge(token)} />

      <div className="mb-5">
        <FormStatus
          pending={pending}
          error={error}
          successTitle="Account created"
          success={created ? 'We have signed you out of nothing and sent a welcome email. Taking you to sign in now.' : undefined}
        />
      </div>

      <button type="submit" className="btn btn-primary inline-flex min-h-[48px] w-full items-center justify-center gap-2 px-6 py-3" disabled={pending}>
        {pending ? 'Creating your account...' : 'Create account'}
        {!pending ? <ArrowRight className="h-4 w-4" aria-hidden="true" /> : null}
      </button>

      <div className="mt-5">
        <FormNote>
          We will never sell your details, and you can close the account by replying to any email we send. No marketing
          list, no cold calls.
        </FormNote>
      </div>
    </form>
  )
}

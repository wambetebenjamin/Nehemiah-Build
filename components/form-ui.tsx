'use client'

import { AlertCircle, CheckCircle2, Info, Loader2 } from 'lucide-react'
import type { ReactNode } from 'react'
import { RecaptchaV2Widget } from '@/components/recaptcha'

/** Label + control + error, matching the template's .form-group rhythm. */
export function Field({
  label,
  name,
  hint,
  error,
  required,
  children,
  className,
}: {
  label: string
  name: string
  hint?: ReactNode
  error?: string
  required?: boolean
  children: (props: { id: string; invalid: boolean; describedBy?: string }) => ReactNode
  className?: string
}) {
  const id = `f-${name}`
  const errorId = error ? `${id}-error` : undefined
  const hintId = hint ? `${id}-hint` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined

  return (
    <div className={`mb-5 ${className ?? ''}`}>
      <label htmlFor={id} className="label">
        {label}
        {required ? <span className="ml-1 text-[color:var(--red)]">*</span> : null}
      </label>
      {children({ id, invalid: Boolean(error), describedBy })}
      {hint && !error ? (
        <p id={hintId} className="help">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}

export function TextInput({
  id,
  name,
  value,
  onChange,
  placeholder,
  type = 'text',
  invalid,
  describedBy,
  autoComplete,
  inputMode,
  min,
  max,
  step,
  readOnly,
  list,
}: {
  id: string
  name: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: string
  invalid?: boolean
  describedBy?: string
  autoComplete?: string
  inputMode?: 'text' | 'numeric' | 'tel' | 'email'
  min?: string
  max?: string
  step?: string
  readOnly?: boolean
  list?: string
}) {
  return (
    <input
      id={id}
      name={name}
      data-field={name}
      type={type}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="field"
      aria-invalid={invalid || undefined}
      aria-describedby={describedBy}
      autoComplete={autoComplete}
      inputMode={inputMode}
      min={min}
      max={max}
      step={step}
      readOnly={readOnly}
      list={list}
    />
  )
}

export function TextArea({
  id,
  name,
  value,
  onChange,
  placeholder,
  rows = 5,
  invalid,
  describedBy,
}: {
  id: string
  name: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  rows?: number
  invalid?: boolean
  describedBy?: string
}) {
  return (
    <textarea
      id={id}
      name={name}
      data-field={name}
      rows={rows}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="field"
      aria-invalid={invalid || undefined}
      aria-describedby={describedBy}
    />
  )
}

export function SelectInput({
  id,
  name,
  value,
  onChange,
  options,
  placeholder = 'Select one',
  invalid,
  describedBy,
}: {
  id: string
  name: string
  value: string
  onChange: (value: string) => void
  options: ReadonlyArray<{ value: string; label: string }>
  placeholder?: string
  invalid?: boolean
  describedBy?: string
}) {
  return (
    <select
      id={id}
      name={name}
      data-field={name}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="field"
      aria-invalid={invalid || undefined}
      aria-describedby={describedBy}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}

/** Visible outcome for any form: pending, server error, field errors, success. */
export function FormStatus({
  pending,
  error,
  success,
  successTitle = 'Received.',
}: {
  pending?: boolean
  error?: string
  success?: ReactNode
  successTitle?: string
}) {
  if (pending) {
    return (
      <p className="mb-0 flex items-center gap-2 text-[14px] text-[color:var(--gray-dark)]" role="status">
        <Loader2 className="h-4 w-4 animate-spin text-[color:var(--nb-primary)]" aria-hidden="true" />
        Sending your details now.
      </p>
    )
  }

  if (error) {
    return (
      <div
        role="alert"
        className="flex items-start gap-3 rounded-[3px] border border-[color:var(--red)]/30 bg-[color:var(--red)]/8 p-4"
      >
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-[color:var(--red)]" aria-hidden="true" />
        <p className="mb-0 text-[14px] leading-relaxed text-[color:var(--gray-dark)]">{error}</p>
      </div>
    )
  }

  if (success) {
    return (
      <div className="flex items-start gap-3 rounded-[3px] border border-[color:var(--green)]/30 bg-[color:var(--green)]/8 p-4">
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[color:var(--green)]" aria-hidden="true" />
        <div>
          <p className="mb-1 text-[14px] font-bold uppercase tracking-wide text-[color:var(--nb-secondary)]">
            {successTitle}
          </p>
          <div className="text-[14px] leading-relaxed text-[color:var(--gray-dark)]">{success}</div>
        </div>
      </div>
    )
  }

  return null
}

export function FormNote({ children }: { children: ReactNode }) {
  return (
    <p className="mb-0 flex items-start gap-2 text-[13px] leading-relaxed text-[color:var(--gray)]">
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--nb-primary)]" aria-hidden="true" />
      <span>{children}</span>
    </p>
  )
}

/** The visible fallback rendered when the v3 score is too low. */
export function CaptchaChallenge({
  active,
  onToken,
}: {
  active: boolean
  onToken: (token: string) => void
}) {
  if (!active) return null
  return (
    <div className="mb-5">
      <RecaptchaV2Widget active={active} onChange={onToken} />
    </div>
  )
}

export function Stepper({ steps, current }: { steps: string[]; current: number }) {
  return (
    <ol className="mb-6 flex items-center gap-2 sm:gap-4" aria-label="Progress">
      {steps.map((label, index) => {
        const number = index + 1
        const state = number < current ? 'done' : number === current ? 'current' : 'todo'
        return (
          <li key={label} className="flex flex-1 items-center gap-2 sm:gap-3">
            <span
              aria-current={state === 'current' ? 'step' : undefined}
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[13px] font-bold ${
                state === 'todo'
                  ? 'bg-[color:var(--nb-light)] text-[color:var(--gray)]'
                  : state === 'current'
                    ? 'bg-[color:var(--nb-primary)] text-white'
                    : 'bg-[color:var(--nb-secondary)] text-white'
              }`}
            >
              {state === 'done' ? <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> : number}
            </span>
            <span className="hidden text-[13px] font-semibold uppercase tracking-wide text-[color:var(--gray-dark)] sm:inline">
              {label}
            </span>
          </li>
        )
      })}
    </ol>
  )
}

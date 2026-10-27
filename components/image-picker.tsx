'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { Image as ImageIcon, Loader2, Plus, X } from 'lucide-react'
import { uploadImages } from '@/lib/api-client'
import { validateImage } from '@/lib/blob'

/* Same ceilings the upload route enforces, checked here first so a bad file
   never leaves the browser. */
const MAX_SIDE_PX = 6000
const MAX_BYTES = 8 * 1024 * 1024

export type PickedImage = { url: string; name: string }

/**
 * Image picker used by the project wizard and the contractor application. Files are
 * checked against the same limits the upload route enforces, then sent one at a time
 * so a single bad file cannot kill the batch. Previews are next/image, never a bare
 * tag.
 */
export function ImagePicker({
  label,
  folder,
  value,
  onChange,
  max = 6,
  hint,
  id,
}: {
  label: string
  folder: 'milestones' | 'portfolio' | 'reviews' | 'applications' | 'projects'
  value: PickedImage[]
  onChange: (next: PickedImage[]) => void
  max?: number
  hint?: string
  id?: string
}) {
  const input = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const pick = async (fileList: FileList | null) => {
    if (!fileList?.length) return
    setError(null)

    const accepted: File[] = []
    for (const file of Array.from(fileList)) {
      const invalid = validateImage({ type: file.type, size: file.size })
      if (invalid) {
        setError(`${file.name}: ${invalid}`)
        continue
      }
      if (file.size > MAX_BYTES) {
        setError(`${file.name} is larger than ${Math.round(MAX_BYTES / 1_048_576)} MB.`)
        continue
      }
      const oversized = await isTooBig(file)
      if (oversized) {
        setError(`${file.name} is larger than ${MAX_SIDE_PX} pixels on a side. Export it smaller and try again.`)
        continue
      }
      accepted.push(file)
    }

    if (!accepted.length) return
    if (value.length + accepted.length > max) {
      setError(`Six images at most. This would make ${value.length + accepted.length}.`)
      return
    }

    setBusy(true)
    const { urls, error: uploadError } = await uploadImages(folder, accepted)
    setBusy(false)

    if (uploadError) setError(uploadError)
    if (urls.length) {
      onChange([
        ...value,
        ...urls.map((url, index) => ({ url, name: accepted[index]?.name ?? `image-${index + 1}` })),
      ])
    }
    if (input.current) input.current.value = ''
  }

  return (
    <div className="mb-5">
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <span className="label mb-0" id={id ? `${id}-label` : undefined}>
          {label}
        </span>
        <span className="text-[12px] text-[color:var(--gray)]">
          {value.length} of {max} used
        </span>
      </div>

      <ul className="mb-3 grid grid-cols-3 gap-2 p-0 list-none sm:grid-cols-6">
        {value.map((image, index) => (
          <li key={`${image.url}-${index}`} className="relative aspect-square overflow-hidden rounded-[3px] bg-black/5">
            <Image
              src={image.url}
              alt={`Selected image ${index + 1}: ${image.name}`}
              fill
              sizes="(min-width: 640px) 120px, 90px"
              className="object-cover"
              unoptimized={image.url.startsWith('data:')}
            />
            <button
              type="button"
              onClick={() => onChange(value.filter((_, i) => i !== index))}
              className="absolute right-1 top-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-[color:var(--nb-secondary)]/85 text-white transition-colors hover:bg-[color:var(--red)]"
              aria-label={`Remove ${image.name}`}
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => input.current?.click()}
          disabled={busy || value.length >= max}
          className="btn btn-outline inline-flex min-h-[44px] items-center gap-2 px-4 py-2 text-[13px] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Plus className="h-4 w-4" aria-hidden="true" />
          )}
          {busy ? 'Uploading' : 'Add site photos'}
        </button>
        <input
          ref={input}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          multiple={max > 1}
          className="sr-only"
          aria-labelledby={id ? `${id}-label` : undefined}
          onChange={(event) => void pick(event.target.files)}
        />
        <p className="mb-0 flex items-center gap-2 text-[12px] text-[color:var(--gray)]">
          <ImageIcon className="h-3.5 w-3.5" aria-hidden="true" />
          {hint ?? `JPG or PNG, up to ${Math.round(MAX_BYTES / 1_048_576)} MB each.`}
        </p>
      </div>

      {error ? (
        <p role="alert" className="error mt-2">
          {error}
        </p>
      ) : null}
    </div>
  )
}

async function isTooBig(file: File): Promise<boolean> {
  if (typeof createImageBitmap !== 'function') return false
  try {
    const bitmap = await createImageBitmap(file)
    const tooBig = bitmap.width > MAX_SIDE_PX || bitmap.height > MAX_SIDE_PX
    bitmap.close?.()
    return tooBig
  } catch {
    return false
  }
}

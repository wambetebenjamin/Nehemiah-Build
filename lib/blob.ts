import { put } from '@vercel/blob'

/**
 * Progress photos, portfolio images and review photos are stored on Vercel Blob.
 *
 * Without BLOB_READ_WRITE_TOKEN (a fresh clone, or a local dev box) uploads are
 * accepted and served from a local placeholder so every screen that depends on
 * a photo still works end to end.
 */

export const blobEnabled = Boolean(process.env.BLOB_READ_WRITE_TOKEN)

export type UploadFolder = 'milestones' | 'portfolio' | 'reviews' | 'applications' | 'projects'

export type StoredFile = {
  url: string
  pathname: string
  size: number
  contentType: string
  stored: 'blob' | 'local'
}

const LOCAL_PLACEHOLDER = '/template/wilcon-main/images/project-2.jpg'

const ALLOWED = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
])

const MAX_BYTES = 8 * 1024 * 1024

export function validateImage(file: { type: string; size: number }): string | null {
  if (!ALLOWED.has(file.type)) return 'Only JPG, PNG, WEBP or AVIF images can be uploaded.'
  if (file.size > MAX_BYTES) return 'Each image must be 8MB or smaller.'
  return null
}

function safeName(name: string): string {
  const base = name.split('/').pop() ?? 'image'
  const cleaned = base.replace(/[^a-zA-Z0-9._-]/g, '-').slice(0, 80)
  return cleaned || 'image'
}

export async function uploadImage(params: {
  folder: UploadFolder
  file: File | Blob
  filename?: string
  ownerHint?: string
}): Promise<StoredFile> {
  const filename = `${params.folder}/${Date.now()}-${safeName(params.filename ?? 'image')}`
  const size = params.file.size
  const contentType = params.file.type || 'image/jpeg'

  if (!blobEnabled) {
    return {
      url: LOCAL_PLACEHOLDER,
      pathname: filename,
      size,
      contentType,
      stored: 'local',
    }
  }

  const blob = await put(filename, params.file, {
    access: 'public',
    addRandomSuffix: true,
  })

  return {
    url: blob.url,
    pathname: blob.pathname ?? filename,
    size,
    contentType,
    stored: 'blob',
  }
}

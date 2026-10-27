import { fail, ok } from '@/lib/api'
import { uploadImage, validateImage, blobEnabled, type UploadFolder } from '@/lib/blob'
import { auth } from '@/lib/auth'

export const runtime = 'nodejs'

const WINDOW_MS = 60_000
const MAX_FILES_PER_WINDOW = 24

const bucket = { count: 0, resetAt: 0 }

/**
 * POST /api/uploads, multipart. Milestone progress photos, portfolio images and
 * review photos are written to Vercel Blob, or to a local placeholder when no
 * blob token is configured for the deployment.
 */
export async function POST(request: Request) {
  const session = await auth()

  const contentType = request.headers.get('content-type') ?? ''
  if (!contentType.includes('multipart/form-data')) {
    return fail('Send the images as a multipart form.', {}, 415)
  }

  const form = await request.formData().catch(() => null)
  if (!form) return fail('That upload could not be read. Try again.', {}, 400)

  const rawFolder = String(form.get('folder') ?? 'projects')
  const folder: UploadFolder = (
    ['milestones', 'portfolio', 'reviews', 'applications', 'projects'] as UploadFolder[]
  ).includes(rawFolder as UploadFolder)
    ? (rawFolder as UploadFolder)
    : 'projects'

  const files: File[] = []
  for (const entry of form.getAll('files')) if (entry instanceof File) files.push(entry)
  const single = form.get('file')
  if (single instanceof File) files.push(single)

  if (!files.length) return fail('No image was attached. Choose a JPG or PNG file and try again.', {}, 400)
  if (files.length > 6) return fail('Six images at most per upload.', {}, 422)

  if (!blobEnabled) {
    const now = Date.now()
    if (now > bucket.resetAt) {
      bucket.count = 0
      bucket.resetAt = now + WINDOW_MS
    }
    bucket.count += files.length
    if (bucket.count > MAX_FILES_PER_WINDOW) {
      return fail('Too many uploads in one minute. Wait a moment and try again.', {}, 429)
    }
  }

  const uploaded = []
  for (const file of files) {
    const invalid = validateImage({ type: file.type, size: file.size })
    if (invalid) return fail(invalid, {}, 422)

    uploaded.push(
      await uploadImage({
        folder,
        file,
        filename: file.name,
        ownerHint: session?.user?.email ?? undefined,
      }),
    )
  }

  return ok({
    files: uploaded,
    urls: uploaded.map((item) => item.url),
    // Blob urls are only usable in this tab, so the response carries both: the
    // stored url for the record and a preview url the browser can already paint.
    previewUrls: uploaded.map((item) => item.url),
    storage: blobEnabled ? 'blob' : 'local-placeholder',
  })
}

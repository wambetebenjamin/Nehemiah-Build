'use client'

import { ServerErrorPanel } from '@/components/server-error-panel'

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return <ServerErrorPanel onRetry={reset} />
}

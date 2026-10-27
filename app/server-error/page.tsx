import type { Metadata } from 'next'
import { ServerErrorPanel } from '@/components/server-error-panel'

export const metadata: Metadata = {
  title: 'Server error',
  robots: { index: false, follow: false },
}

/**
 * The branded 500 screen, addressable at /server-error. Next renders app/error.tsx
 * for any unhandled server render failure; this route exists so the same page can be
 * opened directly (and so a health check can assert it returns 200).
 */
export default function ServerErrorRoute() {
  return <ServerErrorPanel />
}

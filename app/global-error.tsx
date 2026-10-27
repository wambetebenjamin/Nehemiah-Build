'use client'

/**
 * Last line of defence: renders when the root layout itself throws. It has to
 * carry its own html and body, so the styles are imported directly here.
 */
import '@/app/globals.css'
import { ServerErrorPanel } from '@/components/server-error-panel'

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="en-KE">
      <body className="bg-white">
        <ServerErrorPanel onRetry={reset} bare />
      </body>
    </html>
  )
}

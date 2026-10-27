import type { Metadata } from 'next'
import { LegalPage } from '@/components/legal-page'

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description:
    'Every cookie and local storage key Nehemiah Build sets, what it is for, how long it lasts, and how to change your choices.',
  alternates: { canonical: '/legal/cookie-policy' },
}

export default function CookiePolicyPage() {
  return (
    <div className="section">
      <LegalPage policy="cookie-policy" />
    </div>
  )
}

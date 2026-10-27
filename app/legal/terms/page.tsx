import type { Metadata } from 'next'
import { LegalPage } from '@/components/legal-page'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'What the Nehemiah Build platform does and does not do: quotes, verification, milestones, payments and liability, under Kenyan law.',
  alternates: { canonical: '/legal/terms' },
}

export default function TermsPage() {
  return (
    <div className="section">
      <LegalPage policy="terms" />
    </div>
  )
}

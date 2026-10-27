import type { Metadata } from 'next'
import { LegalPage } from '@/components/legal-page'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How Nehemiah Build collects, uses and protects personal information of Kenyan homeowners and contractors, under the Data Protection Act 2019.',
  alternates: { canonical: '/legal/privacy-policy' },
}

export default function PrivacyPolicyPage() {
  return (
    <div className="section">
      <LegalPage policy="privacy-policy" />
    </div>
  )
}

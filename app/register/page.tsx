import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { CheckCircle2 } from 'lucide-react'
import { RegisterForm } from '@/components/register-form'
import { PexImage } from '@/components/pex-image'
import { PICTURES } from '@/lib/images'
import { auth } from '@/lib/auth'
import { SITE } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Create an account',
  description:
    'Create a free Nehemiah Build account to post construction projects and receive quotes from verified Kenyan contractors.',
  alternates: { canonical: '/register' },
}

const PERKS = [
  'Post as many projects as you like, at no cost',
  'See every quote in one table instead of nine WhatsApp chats',
  'Milestone approvals and site photos, filed per project',
  'A written record if a job goes quiet mid way',
]

export default async function RegisterPage() {
  const session = await auth()
  if (session?.user) redirect('/dashboard')

  return (
    <section className="section !py-12 sm:!py-16">
      <div className="w-full max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card grid grid-cols-1 overflow-hidden lg:grid-cols-2">
          <div className="order-1 p-6 sm:p-10">
            <RegisterForm />
          </div>

          <div className="relative isolate order-2 min-h-[220px] lg:order-1">
            <PexImage
              picture={PICTURES.slideMasonry}
              alt=""
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
            <span className="absolute inset-0 -z-[1] bg-[color:var(--nb-secondary)]/70" aria-hidden="true" />
            <div className="relative flex h-full flex-col justify-between gap-8 p-6 sm:p-10">
              <div>
                <span className="subheading !text-white">Free for homeowners</span>
                <h1 className="mb-3 text-[30px] font-black uppercase leading-none text-white sm:text-[38px]">
                  Building once? Then you need a record
                </h1>
                <p className="mb-0 max-w-md text-[15px] leading-relaxed text-white/85">
                  Most people build once or twice in a lifetime, which is exactly why the market is so hard to read. An
                  account gives you the same comparison sheet and the same paper trail a repeat developer has.
                </p>
              </div>
              <ul className="mb-0 grid list-none gap-3 p-0 text-[14px] text-white/85">
                {PERKS.map((perk) => (
                  <li key={perk} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--nb-primary)]" aria-hidden="true" />
                    {perk}
                  </li>
                ))}
              </ul>
              <p className="mb-0 text-[13px] text-white/75">
                {SITE.tagline}. Contractors who want to be listed:{' '}
                <Link href="/contractor-apply" className="font-semibold text-white underline">
                  apply here
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, BadgeCheck, ClipboardCheck, Scale, Users } from 'lucide-react'
import { PageHeader, Section } from '@/components/page-header'
import { ContractorApplicationForm } from '@/components/contractor-application-form'
import { PexImage } from '@/components/pex-image'
import { PICTURES } from '@/lib/images'
import { SITE, WHATSAPP_HREF } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Join as a verified contractor',
  description:
    'Apply to be listed on Nehemiah Build. We check your NCA registration and two completed sites, then publish your profile to homeowners posting projects in your trade and county.',
  alternates: { canonical: '/contractor-apply' },
}

const STEPS = [
  {
    icon: ClipboardCheck,
    title: 'You apply, with evidence',
    text: 'Company details, your NCA number, years in operation, and photographs of work you have finished. Ten minutes, once.',
  },
  {
    icon: BadgeCheck,
    title: 'We check three things',
    text: 'NCA registration against the public register, your national ID, and two sites we can call or visit. We do not ask for references by email.',
  },
  {
    icon: Users,
    title: 'You get invited to quote',
    text: 'Live profiles see every project posted in their trade and county. You quote on what you actually want to build.',
  },
  {
    icon: Scale,
    title: 'You keep what you earn',
    text: 'No joining fee, no commission on a won project, no lead selling. The only thing we take is the record: quotes, milestones and approvals stay on file.',
  },
]

export default function ContractorApplyPage() {
  return (
    <>
      <PageHeader
        eyebrow="For contractors"
        title="Be the name homeowners trust"
        intro="Listing on Nehemiah Build is a verification process, not an advertisement. If your work is real and your programme is honest, this is the cheapest channel you will find in Kenya."
        picture={PICTURES.applyHero}
        crumbs={[{ label: 'For contractors' }]}
      >
        <a href={WHATSAPP_HREF} className="btn btn-white w-full px-6 py-3 sm:w-auto">
          Ask a question first
        </a>
        <Link href="/contractors" className="btn btn-primary w-full px-6 py-3 sm:w-auto">
          See who is already listed
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </PageHeader>

      <Section>
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-12">
          <ContractorApplicationForm />

          <aside className="flex flex-col gap-4 lg:sticky lg:top-24">
            <div className="card overflow-hidden">
              <div className="relative h-40 w-full">
                <PexImage picture={PICTURES.celebratingBand} alt="" fill sizes="(min-width: 1024px) 340px, 100vw" className="object-cover" />
              </div>
              <div className="p-5">
                <h2 className="mb-2 text-[18px] font-bold text-[color:var(--nb-secondary)]">How listing works</h2>
                <ol className="mb-0 grid gap-4 p-0 pl-4 text-[14px] leading-relaxed text-[color:var(--gray-dark)]">
                  {STEPS.map((step) => (
                    <li key={step.title} className="list-disc">
                      <span className="mb-0.5 flex items-center gap-2 font-bold text-[color:var(--nb-secondary)]">
                        <step.icon className="h-4 w-4 text-[color:var(--nb-primary)]" aria-hidden="true" />
                        {step.title}
                      </span>
                      {step.text}
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="rounded-[3px] bg-[color:var(--nb-secondary)] p-5 text-white">
              <p className="mb-2 text-[12px] font-bold uppercase tracking-[0.1em] text-white/70">What we will not do</p>
              <ul className="mb-0 grid gap-2 p-0 pl-4 text-[14px] leading-relaxed text-white/85">
                <li className="list-disc">No commission on a project you win, ever</li>
                <li className="list-disc">No selling your phone number or your completed projects</li>
                <li className="list-disc">No publishing your profile without your sign off</li>
                <li className="list-disc">No pay to rank: the directory is sorted by rating and work closed</li>
              </ul>
              <p className="mt-4 mb-0 text-[13px] leading-relaxed text-white/70">
                {SITE.name} is a project record and a marketplace introduction. It is not a bank, and it does not
                guarantee the work of any contractor listed.
              </p>
            </div>
          </aside>
        </div>
      </Section>
    </>
  )
}

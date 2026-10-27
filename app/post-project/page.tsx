import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle2, Info, Lock, Wallet } from 'lucide-react'
import { PageHeader, Section } from '@/components/page-header'
import { ProjectWizard } from '@/components/project-wizard'
import { auth } from '@/lib/auth'
import { PICTURES } from '@/lib/images'
import { SITE, WHATSAPP_HREF } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Post a construction project',
  description:
    'Tell us what you are building in four short steps and receive quotes from verified Kenyan contractors. Free to post, no commission on the work you award.',
  alternates: { canonical: '/post-project' },
}

const PROMISES = [
  {
    icon: CheckCircle2,
    title: 'Free to post, free to walk away',
    text: 'There is no listing fee and no commission on a quote you accept. If nothing on the platform works for you, take the quotes offline and nobody charges you a thing.',
  },
  {
    icon: Lock,
    title: 'Your number stays yours',
    text: 'Contractors see the project, not your phone number. It is released only to the one whose quote you accept, and you can revoke it from your dashboard.',
  },
  {
    icon: Wallet,
    title: 'Milestones, not deposits',
    text: 'The schedule you approve is what protects you: money follows a finished phase with photos, not a promise made in a gate area.',
  },
]

export default async function PostProjectPage() {
  const session = await auth()

  return (
    <>
      <PageHeader
        eyebrow="Post a project"
        title="Four steps, then the quotes come to you"
        intro="Say what you are building, show the site as it stands today, give a realistic window, and set a budget band. Verified contractors whose trade and county match will respond with a priced programme."
        picture={PICTURES.postHero}
        crumbs={[{ label: 'Post a project' }]}
      />

      <Section>
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-12">
          <ProjectWizard signedIn={Boolean(session?.user)} />

          <aside className="flex flex-col gap-4">
            {PROMISES.map(({ icon: Icon, title, text }) => (
              <div key={title} className="card flex items-start gap-3 p-5">
                <Icon className="mt-0.5 h-5 w-5 shrink-0 text-[color:var(--nb-primary)]" aria-hidden="true" />
                <div>
                  <h2 className="mb-1 text-[16px] font-bold leading-snug text-[color:var(--nb-secondary)]">{title}</h2>
                  <p className="mb-0 text-[14px] leading-relaxed text-[color:var(--gray-dark)]">{text}</p>
                </div>
              </div>
            ))}

            <div className="rounded-[3px] bg-[color:var(--nb-light)] p-5">
              <p className="mb-2 flex items-start gap-2 text-[13px] leading-relaxed text-[color:var(--gray-dark)]">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--nb-primary)]" aria-hidden="true" />
                Your draft is kept on this device as you type, so a dropped connection costs you nothing. It is not sent
                to any contractor until you press the last button.
              </p>
              <p className="mb-0 text-[13px] leading-relaxed text-[color:var(--gray-dark)]">
                Stuck on a question?{' '}
                <a href={WHATSAPP_HREF} className="font-semibold text-[color:var(--nb-primary)] underline">
                  Write to the {SITE.name} desk
                </a>{' '}
                and a human will answer before you post.
              </p>
            </div>

            <p className="mb-0 px-1 text-[13px] leading-relaxed text-[color:var(--gray)]">
              Already posted and comparing?{' '}
              <Link href="/quotes" className="font-semibold text-[color:var(--nb-primary)] underline">
                Open your quotes
              </Link>
              .
            </p>
          </aside>
        </div>
      </Section>
    </>
  )
}

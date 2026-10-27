import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, BadgeCheck, Handshake, Landmark, ShieldCheck } from 'lucide-react'
import { PageHeader, Section } from '@/components/page-header'
import { PexImage } from '@/components/pex-image'
import { PICTURES } from '@/lib/images'
import { RevealOnScroll, CountUp } from '@/components/motion-primitives'
import { ImpactNumbers } from '@/components/home-sections'
import { TEAM } from '@/lib/data/site-data'
import { CATEGORIES, SITE, TRUST_ITEMS, WHATSAPP_HREF } from '@/lib/site'

export const metadata: Metadata = {
  title: 'About Nehemiah Build',
  description:
    'Why Nehemiah Build exists: a construction marketplace for Kenyan homeowners with verified contractors, published milestone schedules and a written record of every phase.',
  alternates: { canonical: '/about' },
}

const PRINCIPLES = [
  {
    icon: Landmark,
    title: 'We are not the builder',
    text: 'We do not buy materials, we do not employ the crew, and we do not decide what a wall should cost. We hold the record of what was agreed, and we show it to both sides whenever memory starts to differ.',
  },
  {
    icon: ShieldCheck,
    title: 'Verification before visibility',
    text: 'A company cannot appear in the directory by paying. Registration is checked against the National Construction Authority register, an identity document is matched to the owner, and two completed sites are contacted.',
  },
  {
    icon: Handshake,
    title: 'The homeowner keeps the leverage',
    text: 'Quotes are free to read, milestones are approved by you, and money only follows finished work. Walking away from a quote costs nothing, and it should never cost anything.',
  },
]

const NUMBERS = [
  { value: 9, label: 'Contractor companies listed', suffix: '' },
  { value: 8, label: 'Trades covered end to end', suffix: '' },
  { value: 47, label: 'Kenya counties we serve', suffix: '' },
]

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="We started because a wall stopped at window height"
        intro="Nehemiah Build exists for the homeowner who was told the money was already spent, and had no way to check. Everything on this site is built around making that conversation impossible to have."
        picture={PICTURES.aboutHero}
        crumbs={[{ label: 'About' }]}
      >
        <Link href="/post-project" className="btn btn-primary w-full px-6 py-3 sm:w-auto">
          Post a project
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
        <Link href="/contractor-apply" className="btn btn-white w-full px-6 py-3 sm:w-auto">
          Apply as a contractor
        </Link>
      </PageHeader>

      <Section>
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-14">
          <div className="heading-section ftco-animate">
            <span className="subheading">The problem</span>
            <h2 className="mb-5">Most building disputes in Kenya are not about quality. They are about the record.</h2>
            <div className="space-y-4 text-[15px] leading-relaxed text-[color:var(--gray-dark)]">
              <p className="mb-0">
                A homeowner and a contractor usually part company over what was agreed, not over the work itself. Nine
                months after the foundation, nobody can say which wall was in the price, who bought the roof sheets, or
                what week the first floor was supposed to top out. The agreement lived in a phone that has since been
                lost.
              </p>
              <p className="mb-0">
                So we built the boring thing that was missing: a place where the scope, the price, the programme and the
                evidence for each phase sit in one file that both parties can open. Photos of a completed phase are worth
                more than a WhatsApp voice note, and a quote you can read next to two others is worth more than a
                handshake.
              </p>
              <p className="mb-0">
                {SITE.tagline} is not a slogan for us. It is the test we apply to every feature: does it make the finish
                more likely, or does it just look good?
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="relative isolate aspect-4/3 w-full overflow-hidden rounded-[3px]">
              <PexImage
                picture={PICTURES.aboutMain}
                alt="Architects reviewing construction drawings with a homeowner on site"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="relative z-[1] mx-4 -mt-10 rounded-[3px] bg-[color:var(--nb-primary)] p-6 text-white shadow-[color:var(--nb-shadow-card)] sm:-mt-14 sm:ml-10 sm:mr-0">
              <p className="mb-1 text-[12px] font-bold uppercase tracking-[0.14em] text-white/80">What we refuse</p>
              <p className="mb-0 text-[17px] font-bold leading-snug sm:text-[20px]">
                No lead selling, no pay to rank, no commission on a project you win.
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section tone="light">
        <div className="heading-section ftco-animate mb-10 max-w-3xl">
          <span className="subheading">How we behave</span>
          <h2 className="mb-0">Three limits we set ourselves, in writing</h2>
        </div>
        <ul className="grid grid-cols-1 gap-4 list-none p-0 sm:grid-cols-3">
          {PRINCIPLES.map((principle, index) => (
            <li key={principle.title}>
              <RevealOnScroll>
                <article className="card h-full p-6">
                  <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--nb-primary)]/10 text-[color:var(--nb-primary)]">
                    <principle.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mb-2 text-[19px] font-bold leading-snug text-[color:var(--nb-secondary)]">
                    {index + 1}. {principle.title}
                  </h3>
                  <p className="mb-0 text-[14px] leading-relaxed text-[color:var(--gray-dark)]">{principle.text}</p>
                </article>
              </RevealOnScroll>
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <div className="heading-section ftco-animate mx-auto mb-10 max-w-3xl text-center">
          <span className="subheading">The desk</span>
          <h2 className="mb-4">Who actually reads your file</h2>
          <p className="mb-0">
            Small on purpose. Every project posted here is opened by a person before a contractor sees it, and every
            application is read by one of the three people below.
          </p>
        </div>

        <ul className="mb-12 grid grid-cols-1 gap-6 list-none p-0 sm:grid-cols-3">
          {TEAM.map((member) => (
            <li key={member.name}>
              <article className="card h-full overflow-hidden">
                <div className="relative aspect-5/6 w-full overflow-hidden">
                  <PexImage
                    picture={member.avatar}
                    alt={`${member.name}, ${member.role}`}
                    fill
                    sizes="(min-width: 640px) 33vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-5">
                  <h3 className="mb-0.5 text-[18px] font-bold text-[color:var(--nb-secondary)]">{member.name}</h3>
                  <p className="mb-3 text-[12px] font-bold uppercase tracking-[0.1em] text-[color:var(--nb-primary)]">
                    {member.role}
                  </p>
                  <p className="mb-0 text-[14px] leading-relaxed text-[color:var(--gray-dark)]">{member.bio}</p>
                </div>
              </article>
            </li>
          ))}
        </ul>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-10">
          <div className="heading-section ftco-animate mb-0">
            <span className="subheading">Coverage</span>
            <h2 className="mb-5">Eight trades, from the drawing board to the paint line</h2>
            <ul className="mb-0 grid grid-cols-1 gap-3 list-none p-0 sm:grid-cols-2">
              {CATEGORIES.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/contractors?trade=${encodeURIComponent(category.name)}`}
                    className="card flex min-h-[64px] items-center justify-between gap-3 p-4 transition-colors hover:border-[color:var(--nb-primary)]"
                  >
                    <span className="text-[15px] font-bold text-[color:var(--nb-secondary)]">{category.name}</span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-[color:var(--nb-primary)]" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <ul className="grid grid-cols-1 gap-6 self-start list-none p-0 sm:grid-cols-3 lg:grid-cols-1">
            {NUMBERS.map((number) => (
              <li key={number.label} className="card p-5 text-center lg:text-left">
                <p className="mb-1 text-[34px] font-black leading-none text-[color:var(--nb-primary)]">
                  <CountUp value={number.value} suffix={number.suffix} />
                </p>
                <p className="mb-0 text-[13px] uppercase tracking-[0.08em] text-[color:var(--gray)]">{number.label}</p>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section tone="dark">
        <div className="heading-section ftco-animate mx-auto mb-10 max-w-3xl text-center">
          <span className="subheading">By the numbers</span>
          <h2 className="mb-0 text-white">Work already tracked on the platform</h2>
        </div>
        <RevealOnScroll>
          <ImpactNumbers />
        </RevealOnScroll>
      </Section>

      <Section tone="light">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-14">
          <div className="heading-section ftco-animate mb-0">
            <span className="subheading">Standards</span>
            <h2 className="mb-5">What verified means on {SITE.name}</h2>
            <ul className="mb-6 grid gap-3 list-none p-0 text-[15px] leading-relaxed text-[color:var(--gray-dark)]">
              {TRUST_ITEMS.map((item) => (
                <li key={item.title} className="flex items-start gap-3">
                  <BadgeCheck className="mt-1 h-4 w-4 shrink-0 text-[color:var(--nb-primary)]" aria-hidden="true" />
                  <span>
                    <strong className="font-bold text-[color:var(--nb-secondary)]">{item.title}.</strong> {item.text}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mb-0 text-[13px] leading-relaxed text-[color:var(--gray)]">
              Registration numbers shown on profiles are the ones supplied by each company and confirmed against the
              public register at the time of writing. If a number stops matching, the profile is unpublished the same
              day, and the homeowner who was mid project is told before anyone else.
            </p>
          </div>

          <div className="card p-6 sm:p-8">
            <h3 className="mb-2 text-[22px] font-bold leading-tight text-[color:var(--nb-secondary)]">
              Talk to the desk before you decide anything
            </h3>
            <p className="mb-6 text-[15px] leading-relaxed text-[color:var(--gray-dark)]">
              Two quotes you cannot compare, a milestone you are not sure about, a contractor gone quiet for eleven
              days: these are the conversations we have all week. Ask, it is free.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a href={WHATSAPP_HREF} className="btn btn-primary w-full px-6 py-3 sm:w-auto">
                WhatsApp the project desk
              </a>
              <Link href="/post-project" className="btn btn-outline w-full px-6 py-3 sm:w-auto">
                Post a project
              </Link>
            </div>
          </div>
        </div>
      </Section>
    </>
  )
}

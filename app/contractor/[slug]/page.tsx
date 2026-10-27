import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CalendarClock,
  CheckCircle2,
  Globe2,
  HardHat,
  MessagesSquare,
  PhoneCall,
  ShieldCheck,
} from 'lucide-react'
import { CONTRACTORS, getContractor } from '@/lib/data/contractors'
import { PageHeader, Section } from '@/components/page-header'
import { PexImage } from '@/components/pex-image'
import { Stars } from '@/components/rating'
import { ReviewForm } from '@/components/review-form'
import { EnquiryForm } from '@/components/enquiry-form'
import { RevealOnScroll } from '@/components/motion-primitives'
import { SITE, WHATSAPP_HREF } from '@/lib/site'
import { auth } from '@/lib/auth'

export function generateStaticParams() {
  return CONTRACTORS.map((contractor) => ({ slug: contractor.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const contractor = getContractor(slug)
  if (!contractor) return { title: 'Contractor not found' }

  return {
    title: `${contractor.company}, ${contractor.trade} in ${contractor.county}`,
    description: `${contractor.company} is a ${contractor.trade.toLowerCase()} business in ${contractor.county} with ${contractor.yearsInOperation} years in operation and ${contractor.completedProjects} completed projects. Rated ${contractor.rating} out of 5 by homeowners on ${SITE.name}.`,
    alternates: { canonical: `/contractor/${contractor.slug}` },
  }
}

export default async function ContractorProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const contractor = getContractor(slug)
  if (!contractor) notFound()

  const session = await auth()
  const signedIn = Boolean(session?.user)

  const stats = [
    { label: 'Completed projects', value: String(contractor.completedProjects), icon: Building2 },
    { label: 'Years in operation', value: String(contractor.yearsInOperation), icon: CalendarClock },
    { label: 'Team on the ground', value: String(contractor.teamSize), icon: HardHat },
    { label: 'Homeowner rating', value: `${contractor.rating.toFixed(1)} / 5`, icon: ShieldCheck },
  ]

  return (
    <>
      <PageHeader
        eyebrow={`${contractor.trade} · ${contractor.county}`}
        title={contractor.company}
        intro={contractor.bio}
        picture={contractor.cover}
        crumbs={[{ label: 'Contractors', href: '/contractors' }, { label: contractor.company }]}
      >
        <Link href="/post-project" className="btn btn-primary w-full px-6 py-3 sm:w-auto">
          Post a project and invite a quote
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
        {contractor.verified ? (
          <span className="badge-verify w-fit px-3 py-2 text-[12px]">
            <BadgeCheck className="h-4 w-4" aria-hidden="true" />
            NCA number on file: {contractor.ncaNumber}
          </span>
        ) : (
          <span className="badge-pending w-fit px-3 py-2 text-[12px]">Verification in progress</span>
        )}
      </PageHeader>

      <Section>
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_360px] lg:gap-12">
          <div>
            <div className="mb-8 flex flex-wrap items-center gap-4">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-white shadow-[color:var(--nb-shadow-card)]">
                <PexImage
                  picture={contractor.avatar}
                  alt={`${contractor.owner}, ${contractor.company}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>
              <div>
                <h2 className="mb-1 text-[24px] font-bold leading-tight text-[color:var(--nb-secondary)] sm:text-[30px]">
                  {contractor.owner}
                </h2>
                <p className="mb-0 flex flex-wrap items-center gap-x-3 gap-y-1 text-[14px] text-[color:var(--gray)]">
                  <Stars value={contractor.rating} />
                  <span>{contractor.reviewCount} homeowner reviews</span>
                  <span aria-hidden="true">&middot;</span>
                  <span>{contractor.county}</span>
                </p>
              </div>
            </div>

            <ul className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {stats.map(({ label, value, icon: Icon }) => (
                <li key={label} className="card p-4">
                  <Icon className="mb-2 h-5 w-5 text-[color:var(--nb-primary)]" aria-hidden="true" />
                  <p className="mb-0 text-[20px] font-black leading-none text-[color:var(--nb-secondary)]">{value}</p>
                  <p className="mb-0 mt-1 text-[12px] uppercase tracking-[0.06em] text-[color:var(--gray)]">{label}</p>
                </li>
              ))}
            </ul>

            <div className="heading-section ftco-animate mb-6">
              <span className="subheading">How they work</span>
              <h2 className="mb-0">What the profile says, in plain terms</h2>
            </div>

            <dl className="mb-10 grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
              <FactRow label="Trade" value={contractor.trade} />
              <FactRow label="Home county" value={contractor.county} />
              <FactRow label="Service areas" value={contractor.serviceAreas.join(', ')} />
              <FactRow label="Languages on site" value={contractor.languages.join(', ')} />
              <FactRow
                label="NCA registration"
                value={contractor.ncaNumber}
                note="Checked by our desk against the public register. The certificate itself stays with the contractor."
              />
              <FactRow
                label="Verification"
                value={contractor.verified ? 'Verified: registration and two sites checked' : 'Pending site visits'}
              />
            </dl>

            <div className="heading-section ftco-animate mb-6">
              <span className="subheading">Site record</span>
              <h2 className="mb-0">Work they have finished</h2>
            </div>
            <ul className="mb-10 grid grid-cols-2 gap-3 list-none p-0 sm:grid-cols-3">
              {contractor.portfolio.map((picture, index) => (
                <li key={`${picture.alt}-${index}`} className="relative aspect-4/3 overflow-hidden rounded-[3px]">
                  <PexImage
                    picture={picture}
                    alt={`${contractor.company}, portfolio image ${index + 1}`}
                    fill
                    sizes="(min-width: 640px) 33vw, 50vw"
                    className="object-cover transition-transform duration-700 hover:scale-[1.05]"
                  />
                </li>
              ))}
            </ul>

            <div className="heading-section ftco-animate mb-6">
              <span className="subheading">Reviews</span>
              <h2 className="mb-0">{contractor.reviewCount} reviews from homeowners</h2>
              <p className="mb-0">
                Only a homeowner who ran a project with this contractor on {SITE.name} can post here. That is the whole
                point of the list.
              </p>
            </div>

            <ul className="mb-10 grid grid-cols-1 gap-4 list-none p-0 sm:grid-cols-2">
              {contractor.reviews.map((review) => (
                <li key={review.id}>
                  <RevealOnScroll key={review.id}>
                    <article className="card h-full p-5">
                      <header className="mb-3 flex items-start justify-between gap-3">
                        <div>
                          <p className="mb-0 text-[15px] font-bold text-[color:var(--nb-secondary)]">{review.title}</p>
                          <p className="mb-0 text-[13px] text-[color:var(--gray)]">
                            {review.author} &middot; {review.county} &middot;{' '}
                            {new Date(review.date).toLocaleDateString('en-KE', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                        <Stars value={review.rating} size="sm" showValue={false} />
                      </header>
                      <p className="mb-3 text-[14px] leading-relaxed text-[color:var(--gray-dark)]">{review.body}</p>
                      {review.verified ? (
                        <span className="badge-verify">
                          <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                          Project on platform
                        </span>
                      ) : null}
                    </article>
                  </RevealOnScroll>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-6 lg:sticky lg:top-24">
            <div className="card p-5 sm:p-6">
              <h3 className="mb-1 text-[19px] font-bold text-[color:var(--nb-secondary)]">Ask {contractor.owner} a question</h3>
              <p className="mb-5 text-[14px] leading-relaxed text-[color:var(--gray)]">
                Before you post anything publicly, it is often cheaper to ask one specific question. The desk routes it
                to this contractor and to two others in the same trade.
              </p>
              <EnquiryForm compact />
            </div>

            <div className="card p-5 sm:p-6">
              <h3 className="mb-3 text-[19px] font-bold text-[color:var(--nb-secondary)]">Prefer to talk?</h3>
              <div className="mb-4 flex flex-col gap-2">
                <a href={WHATSAPP_HREF} className="btn btn-primary inline-flex min-h-[48px] items-center justify-center gap-2 px-5 py-2 text-[13px]">
                  <MessagesSquare className="h-4 w-4" aria-hidden="true" />
                  WhatsApp the project desk
                </a>
                <a
                  href={`tel:+${SITE.whatsappNumber}`}
                  className="btn btn-ghost inline-flex min-h-[48px] items-center justify-center gap-2 px-5 py-2 text-[13px]"
                >
                  <PhoneCall className="h-4 w-4" aria-hidden="true" />
                  Call +{SITE.whatsappNumber}
                </a>
              </div>
              <p className="mb-0 text-[13px] leading-relaxed text-[color:var(--gray)]">
                Contractors never see your phone number until you accept a quote. We do not sell contact details, and
                there is no commission on a job you win.
              </p>
            </div>

            <ReviewGate slug={contractor.slug} company={contractor.company} signedIn={signedIn} />
          </div>
        </div>
      </Section>

      <Section tone="light">
        <div className="heading-section ftco-animate mb-8 text-center max-w-3xl mx-auto">
          <span className="subheading">Similar trades nearby</span>
          <h2 className="mb-0">Other contractors who cover this work</h2>
        </div>
        <ul className="grid grid-cols-1 gap-3 list-none p-0 sm:grid-cols-2 lg:grid-cols-3">
          {CONTRACTORS.filter(
            (other) => other.slug !== contractor.slug && (other.trade === contractor.trade || other.county === contractor.county),
          )
            .slice(0, 6)
            .map((other) => (
              <li key={other.slug}>
                <Link
                  href={`/contractor/${other.slug}`}
                  className="card flex min-h-[64px] items-center gap-3 p-4 transition-colors hover:border-[color:var(--nb-primary)]"
                >
                  <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full">
                    <PexImage picture={other.avatar} alt="" fill sizes="48px" className="object-cover" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[15px] font-bold text-[color:var(--nb-secondary)]">
                      {other.company}
                    </span>
                    <span className="block text-[13px] text-[color:var(--gray)]">
                      {other.trade} &middot; {other.county}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
        </ul>
      </Section>
    </>
  )
}

function FactRow({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div>
      <dt className="mb-1 text-[12px] font-bold uppercase tracking-[0.1em] text-[color:var(--gray)]">{label}</dt>
      <dd className="mb-0 text-[15px] font-semibold text-[color:var(--nb-secondary)]">{value}</dd>
      {note ? <dd className="mt-1 mb-0 text-[13px] leading-relaxed text-[color:var(--gray)]">{note}</dd> : null}
    </div>
  )
}

/** The review form is shown to signed in homeowners; everyone else sees why. */
async function ReviewGate({
  slug,
  company,
  signedIn,
}: {
  slug: string
  company: string
  signedIn: boolean
}) {
  if (!signedIn) {
    return (
      <div className="card flex items-start gap-3 p-5">
        <Globe2 className="mt-0.5 h-5 w-5 shrink-0 text-[color:var(--nb-primary)]" aria-hidden="true" />
        <div>
          <h3 className="mb-1 text-[17px] font-bold text-[color:var(--nb-secondary)]">Ran a project with them?</h3>
          <p className="mb-3 text-[14px] leading-relaxed text-[color:var(--gray-dark)]">
            Reviews are limited to homeowners with a project on the platform. Sign in to write one about {company}.
          </p>
          <Link
            href={`/login?callbackUrl=${encodeURIComponent(`/contractor/${slug}`)}&reason=review`}
            className="btn btn-outline inline-flex min-h-[44px] items-center px-4 py-2 text-[13px]"
          >
            Sign in to review
          </Link>
        </div>
      </div>
    )
  }

  return <ReviewForm contractorSlug={slug} contractorCompany={company} />
}

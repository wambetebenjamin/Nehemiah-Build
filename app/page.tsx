import Link from 'next/link'
import { ArrowRight, Phone, Search, ShieldCheck } from 'lucide-react'
import { PexImage } from '@/components/pex-image'
import { PICTURES, sitePicture } from '@/lib/images'
import { RevealOnScroll } from '@/components/motion-primitives'
import { HeroSlider, type Slide } from '@/components/hero-slider'
import { CategoryGrid, HeroIntroBand, HowItWorks, ImpactNumbers, Testimonials, TrustBar } from '@/components/home-sections'
import { EnquiryForm } from '@/components/enquiry-form'
import { SITE, WHATSAPP_HREF } from '@/lib/site'

const SLIDES: Slide[] = [
  {
    id: 'quotes',
    eyebrow: `${SITE.name} ${SITE.tagline}`,
    title: 'Find verified contractors. Track every brick.',
    text: 'Post your project once and let verified contractors across Kenya come to you with real quotes. Compare them side by side, approve the work phase by phase, and pay milestones only when your site photos say the work is done.',
    href: '/post-project',
    cta: 'Post a Project',
    picture: sitePicture('hero', 'Crew working on scaffolding at a Nairobi apartment build'),
  },
  {
    id: 'finishing',
    eyebrow: 'Finishing and interiors',
    title: 'From plate slab to the last coat of paint',
    text: 'Plumbers, electricians, tilers and interior designers who publish their rates, show their last sites, and answer on the platform instead of only on WhatsApp.',
    href: '/contractors?trade=Interior%20Design',
    cta: 'Browse finishing trades',
    picture: PICTURES.slideInterior,
  },
  {
    id: 'paperwork',
    eyebrow: 'Drawings and approvals',
    title: 'Paperwork that clears the county the first time',
    text: 'Architects and structural engineers who deliver approval drawings, a bill of quantities you can price against, and supervision reports after every pour.',
    href: '/contractors?trade=Architecture',
    cta: 'Find a design practice',
    picture: PICTURES.slideBlueprints,
  },
]

export default function HomePage() {
  return (
    <>
      <HeroSlider slides={SLIDES} />
      <div hidden id="top" />
      <section className="section !pb-10 sm:!pb-14">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <TrustBar />
          </RevealOnScroll>
        </div>
      </section>

      <section className="section !pt-10 sm:!pt-14">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="heading-section ftco-animate mx-auto mb-10 max-w-3xl text-center">
            <span className="subheading">How it works</span>
            <h2 className="mb-4">Three steps between you and a finished building</h2>
            <p className="mb-0">
              The platform is deliberately short. You post, contractors quote, you approve and pay by milestone.
            </p>
          </div>
          <RevealOnScroll>
            <HowItWorks />
          </RevealOnScroll>
        </div>
      </section>

      <section className="section !pt-0">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="heading-section ftco-animate mb-10 max-w-3xl">
            <span className="subheading">Categories</span>
            <h2 className="mb-4">Every trade your project needs, verified</h2>
            <p className="mb-0">
              From the first drawing to the last coat of paint. Pick a trade to see who is registered, rated, and
              working in your county this month.
            </p>
          </div>
          <CategoryGrid />
        </div>
      </section>

      <section className="section !py-12 sm:!py-16">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <HeroIntroBand />
        </div>
      </section>

      <section className="section bg-[color:var(--nb-light)]">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="heading-section ftco-animate mx-auto mb-10 max-w-3xl text-center">
            <span className="subheading">Homeowners on {SITE.name}</span>
            <h2 className="mb-4">What changed for them</h2>
          </div>
          <Testimonials />
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-[color:var(--nb-secondary)] py-16 sm:py-20">
        <PexImage picture={PICTURES.aboutInset} fill alt="" sizes="100vw" className="-z-10 object-cover opacity-15" />
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="heading-section ftco-animate mx-auto mb-10 max-w-3xl text-center">
            <span className="subheading">By the numbers</span>
            <h2 className="mb-0 text-white">Work that has already passed through the platform</h2>
          </div>
          <RevealOnScroll>
            <ImpactNumbers />
          </RevealOnScroll>
          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/contractors" className="btn btn-primary px-6 py-3">
              Browse Contractors
            </Link>
            <a href={WHATSAPP_HREF} className="btn btn-white px-6 py-3">
              <Phone className="h-4 w-4" aria-hidden="true" />
              Talk to the project desk
            </a>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2 lg:gap-14">
            <div className="heading-section ftco-animate">
              <span className="subheading">Not ready for a full post?</span>
              <h2 className="mb-4">Ask the question, we will answer it in writing</h2>
              <p className="mb-6">
                If you are still deciding between two contractors, or you want to know what a milestone should cost in
                your county, send one paragraph. A human from the project desk replies, not a bot.
              </p>
              <ul className="space-y-3 text-[15px] text-[color:var(--gray-dark)]">
                {[
                  'Typical reply time on a working day: under 4 hours',
                  'We can call you back on the same number you give us',
                  'No sales list, no cold calls after you ask once',
                ].map((line) => (
                  <li key={line} className="flex items-start gap-3">
                    <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--nb-primary)]" />
                    {line}
                  </li>
                ))}
              </ul>
            </div>
            <EnquiryForm />
          </div>
        </div>
      </section>
    </>
  )
}

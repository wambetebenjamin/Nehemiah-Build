import Link from 'next/link'
import { Facebook, Instagram, Linkedin, Mail, MapPin, MessageCircle, Phone, Twitter } from 'lucide-react'
import { FOOTER_COLUMNS, LEGAL_LINKS, SITE, WHATSAPP_HREF } from '@/lib/site'

/**
 * Footer rebuilt from the template's .ftco-footer block: dark slab, four
 * columns, circular social buttons, and the small print row.
 */
export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-[color:var(--nb-footer)] pt-16 pb-8 sm:pt-20 text-[15px]">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center gap-3" aria-label={`${SITE.name} home`}>
              <span
                className="flaticon flaticon-crane text-[30px] leading-none text-[color:var(--nb-primary)]"
                aria-hidden="true"
              />
              <span className="text-[22px] font-black uppercase leading-none text-white">{SITE.name}</span>
            </Link>
            <p className="mt-4 leading-relaxed text-white/70">
              We put Kenyan homeowners and verified contractors on the same record: drawings, milestones, photos and
              payments in one place, so a half finished wall never becomes the end of the story.
            </p>
            <div className="mt-5 flex items-center gap-2">
              {[
                { label: 'Facebook', href: 'https://www.facebook.com/', Icon: Facebook },
                { label: 'X', href: 'https://x.com/', Icon: Twitter },
                { label: 'Instagram', href: 'https://www.instagram.com/', Icon: Instagram },
                { label: 'LinkedIn', href: 'https://www.linkedin.com/', Icon: Linkedin },
              ].map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={`${SITE.name} on ${label}`}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-[color:var(--nb-primary)] transition-colors hover:bg-[color:var(--nb-primary)] hover:text-white"
                >
                  <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {FOOTER_COLUMNS.map((column) => (
            <div key={column.heading}>
              <h2 className="mb-5 text-[15px] font-bold uppercase tracking-[0.14em] text-white">{column.heading}</h2>
              <ul className="space-y-2">
                {column.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="inline-flex min-h-[32px] items-center gap-2 text-white/70 transition-colors hover:text-[color:var(--nb-primary)]"
                    >
                      <span aria-hidden="true" className="text-[color:var(--nb-primary)]">
                        ›
                      </span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h2 className="mb-5 text-[15px] font-bold uppercase tracking-[0.14em] text-white">Talk to us</h2>
            <ul className="space-y-3 text-white/70">
              <li className="flex items-start gap-3">
                <MessageCircle className="mt-1 h-4 w-4 shrink-0 text-[color:var(--nb-primary)]" aria-hidden="true" />
                <a href={WHATSAPP_HREF} className="min-h-[32px] hover:text-[color:var(--nb-primary)]">
                  WhatsApp +{SITE.whatsappNumber}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="mt-1 h-4 w-4 shrink-0 text-[color:var(--nb-primary)]" aria-hidden="true" />
                <a href={`tel:+${SITE.whatsappNumber}`} className="min-h-[32px] hover:text-[color:var(--nb-primary)]">
                  Call the project desk, Mon to Sat
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="mt-1 h-4 w-4 shrink-0 text-[color:var(--nb-primary)]" aria-hidden="true" />
                <a href="mailto:hello@nehemia.build" className="min-h-[32px] hover:text-[color:var(--nb-primary)]">
                  hello@nehemia.build
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-1 h-4 w-4 shrink-0 text-[color:var(--nb-primary)]" aria-hidden="true" />
                <span>
                  4th Floor, Riverside Drive
                  <br />
                  Westlands, Nairobi
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-[13px] text-white/60 md:flex-row md:items-center md:justify-between">
          <p className="mb-0">
            &copy; {year} {SITE.name}. {SITE.tagline}
          </p>
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {LEGAL_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="min-h-[32px] inline-flex items-center hover:text-[color:var(--nb-primary)]">
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <span>NCA registered partners, data protected under the KDPA 2019</span>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  )
}

export default SiteFooter

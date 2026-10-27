import type { ReactNode } from 'react'

/**
 * Legal copy for the three policy pages, written for Kenyan law (Data Protection
 * Act 2019, Consumer Protection Act 2012) rather than borrowed from a European
 * template. Rendered by components/legal-page.tsx.
 */

export type LegalBlock =
  | { kind: 'p'; text: ReactNode }
  | { kind: 'list'; ordered?: boolean; items: ReactNode[] }
  | { kind: 'note'; text: ReactNode }
  | { kind: 'table'; head: string[]; rows: ReactNode[][] }

export type LegalSection = {
  id: string
  heading: string
  blocks: LegalBlock[]
}

export const LEGAL_UPDATED = '1 October 2026'

export const PRIVACY_SECTIONS: LegalSection[] = [
  {
    id: 'who-we-are',
    heading: '1. Who we are and what this notice covers',
    blocks: [
      {
        kind: 'p',
        text: 'Nehemiah Build ("we", "us") operates a marketplace that connects homeowners in Kenya with construction contractors, and a project record that keeps quotes, milestone schedules, site photographs and messages in one file. For that processing we are the data controller, as the term is used in the Data Protection Act 2019.',
      },
      {
        kind: 'p',
        text: 'This notice covers the website and its forms. It does not cover what you agree with a contractor: once you accept a quote and start working together, you and the contractor are each handling the other’s information in your own right, and this notice cannot speak for either of you.',
      },
      {
        kind: 'note',
        text: 'Plain words: we hold the record of what was agreed. We do not sell your phone number, we do not pass it to a list of contractors, and we do not take a commission on a project you award.',
      },
    ],
  },
  {
    id: 'what-we-collect',
    heading: '2. What we collect, per screen',
    blocks: [
      {
        kind: 'table',
        head: ['Where', 'What we keep', 'Why'],
        rows: [
          [
            'Register and sign in',
            'Name, email, county, phone, a salted scrypt password hash',
            'To run your account and let you post projects. We never keep the password itself.',
          ],
          [
            'Post a project (4 steps)',
            'Project title, description, county, size, dates, budget band, contact name, phone, email, up to 6 site photos',
            'Contractors cannot quote on a project they cannot read.',
          ],
          [
            'Enquiry form',
            'First name, last name (optional), phone, optional email, what you need, your message',
            'So a human on the project desk can answer you.',
          ],
          [
            'Contractor application',
            'Company and owner details, trade, county, NCA registration number, years in operation, contact details, portfolio description and photographs',
            'Verification, and building your public profile once you approve it.',
          ],
          [
            'Reviews',
            'Your display name, county, star rating, headline and text, and whether a project backs the review',
            'Ratings have to be attributable to be worth anything.',
          ],
          [
            'Messages and milestones',
            'Thread messages, milestone statuses, approval notes, progress photos',
            'This is the record both sides rely on if a memory differs.',
          ],
          [
            'Technical',
            'Session cookie, reCAPTCHA risk signal, anonymised performance and traffic measurement',
            'Keeping you signed in, blocking bots, and knowing what is slow.',
          ],
        ],
      },
      {
        kind: 'p',
        text: 'We do not ask for, and do not want, your ID number, KRA PIN, bank details or M-PESA credentials. Payments between you and a contractor never pass through us, so we never see your account balance or your statement.',
      },
    ],
  },
  {
    id: 'legal-basis',
    heading: '3. Why we are allowed to process it',
    blocks: [
      {
        kind: 'list',
        items: [
          'Performance of a contract: everything needed to run the account and the project record you asked for (section 29(1)(c) of the Act).',
          'Your consent: marketing email, non-essential cookies, analytics measurement, and the optional site voice tour. Consent can be withdrawn at any time and withdrawal is as easy as giving it.',
          'Legitimate interest: fraud and bot prevention, captcha, keeping a written record of a dispute, and answering a request from a regulator or a court.',
          'Legal obligation: tax records and responding to a lawful request from a Kenyan authority.',
        ],
      },
      {
        kind: 'p',
        text: 'Special categories of data (health, biometrics, religious or political belief, sexual orientation, criminal record) are not requested anywhere on this site. If a photograph you upload contains one of those, blur it before you post.',
      },
    ],
  },
  {
    id: 'who-sees-it',
    heading: '4. Who sees your information',
    blocks: [
      {
        kind: 'list',
        ordered: true,
        items: [
          'Before you accept a quote: contractors see the project text, the budget band, the county, the photos and a contact address that is masked. Your phone number is not released.',
          'After you accept: the one contractor you chose sees the contact name, phone number and email you entered in step 4, so they can call you. Nobody else.',
          'Public directory: for contractors only, the company profile, trade, county, NCA registration reference, verified badge, ratings and reviews.',
          'Our processors: hosting and image storage (Vercel), transactional email delivery, and Google reCAPTCHA for fraud prevention. Each is bound to the purposes above.',
          'Nobody else. We do not sell personal data, and we do not rent contact lists to building product suppliers.',
        ],
      },
    ],
  },
  {
    id: 'transfers',
    heading: '5. Where the data lives',
    blocks: [
      {
        kind: 'p',
        text: 'Application data is hosted in the Vercel platform’s African region (Cape Town) for the project record, key value store and image blob storage. Email leaves via your email provider, and the reCAPTCHA check is performed by Google in the United States.',
      },
      {
        kind: 'p',
        text: 'Where a transfer goes outside Kenya, we rely on the contractual and technical safeguards the processor already applies to all of its customers, and we keep the transferred data to the minimum the service needs. An obvious example: an enquiry email contains what you typed, nothing else.',
      },
    ],
  },
  {
    id: 'retention',
    heading: '6. How long we keep it',
    blocks: [
      {
        kind: 'table',
        head: ['Record', 'Kept for', 'After that'],
        rows: [
          ['Account details', 'While the account is open, plus 12 months of inactivity', 'Deleted, or anonymised for counts of projects'],
          ['Projects, quotes, milestones, messages', 'Life of the project plus 6 years', 'Archived offline for dispute limits, then deleted'],
          ['Uploaded photographs', 'As long as the project file exists', 'Deleted with the file; you can delete any of them sooner'],
          ['Enquiries', '24 months', 'Deleted'],
          ['Contractor applications that were not approved', '12 months', 'Deleted, and you may ask us to delete sooner'],
          ['Reviews', 'Life of the profile, and 6 years after it is closed', 'Anonymised into the rating totals'],
          ['Consent record (localStorage plus server log)', '3 years from your last change', 'Overwritten by the next choice'],
        ],
      },
      {
        kind: 'p',
        text: 'Six years is not a number we picked for fun: it matches the limitation period for a contractual claim in Kenya, and a homeowner discovering a structural defect in month thirty should still be able to open the file that shows what was agreed.',
      },
    ],
  },
  {
    id: 'your-rights',
    heading: '7. Your rights, and how to use them',
    blocks: [
      {
        kind: 'list',
        items: [
          'Access: ask for a copy of everything we hold about you, in a structured format you can take with you.',
          'Correction: change your name, county or phone in your account, or tell us and we will do it.',
          'Deletion: close the account and we delete what is not required by law to survive. Where a record must be kept, we tell you which law.',
          'Objection and opt out: stop marketing at any time from the link in the email, or from the cookie preferences panel for measurement.',
          'Withdraw consent: the same control that gave it.',
          'Complain to a regulator: the Office of the Data Protection Commissioner (ODPC), Copy Kenya, or via odpc@odpc.go.ke. We would rather you told us first, and we will answer within 72 hours.',
        ],
      },
      {
        kind: 'p',
        text: 'To exercise any of these, write to hello@nehemia.build with the word "data" in the subject, or WhatsApp the project desk from the button in the corner. We respond within 72 hours and never need an ID copy for a request that we can verify against your account.',
      },
    ],
  },
  {
    id: 'children',
    heading: '8. Children',
    blocks: [
      {
        kind: 'p',
        text: 'This service is for adults. A person under 18 should not create an account. Site photographs are of working sites and may include adults who are not our users; if your child appears in a photograph you want removed, tell us and it comes down the same day.',
      },
    ],
  },
  {
    id: 'security',
    heading: '9. How we protect it',
    blocks: [
      {
        kind: 'list',
        items: [
          'Passwords are hashed with scrypt and a per account salt; nobody at Nehemiah Build can read yours.',
          'Every write to the project record and every sign in passes through a server side check, a Zod schema, and a reCAPTCHA v3 risk score with a visible fallback challenge.',
          'Cookies are set HttpOnly, Secure and SameSite=Lax, which is why a stray link cannot log you in as someone else.',
          'Uploads are limited to image types, size and pixel dimensions, and are stored on a separate blob host rather than served from our own origin.',
          'We do not have a back door and we do not store an admin master password. Support access to a project file is done by viewing, not by signing in as you.',
        ],
      },
      {
        kind: 'note',
        text: 'No system is perfect. If we ever compromise your personal data in a way that risks your rights, we will notify the ODPC and you within 72 hours of becoming aware, as the Act requires.',
      },
    ],
  },
  {
    id: 'changes',
    heading: '10. Changes to this notice',
    blocks: [
      {
        kind: 'p',
        text: 'We will post any change here and change the date at the top of the page. If a change moves what we do with your data in a way you did not sign up for, we will email you before it applies, not after.',
      },
    ],
  },
]

export const TERMS_SECTIONS: LegalSection[] = [
  {
    id: 'what-this-is',
    heading: '1. What this platform is, and what it is not',
    blocks: [
      {
        kind: 'p',
        text: 'Nehemiah Build introduces homeowners to construction contractors and keeps a shared record of what was agreed: scope, quotes, milestone schedule, site photographs, messages and approvals.',
      },
      {
        kind: 'list',
        items: [
          'We are not a contractor. We do not build, supervise, certify or warranty anything.',
          'We are not a bank or a payment processor. Milestone money moves directly between you and the contractor.',
          'We are not an insurer. A verified badge is a check we performed on a date, not a guarantee of future work.',
          'We are not your architect or engineer. Nothing here replaces a professional design, a county approval, or a structural certificate.',
        ],
      },
    ],
  },
  {
    id: 'who-can-use',
    heading: '2. Who can use it',
    blocks: [
      {
        kind: 'list',
        items: [
          'You must be 18 or over and able to contract under Kenyan law.',
          'Homeowners: one account per person, accurate contact details, and you must own or be authorised to act for the site.',
          'Contractors: a registered business, a current NCA registration in the trade you quote for, and at least three years in operation.',
          'You may not use the platform to solicit a contractor around it in order to dodge the record. Once a project is posted, keep the paper trail here: that is the deal, and it protects you too.',
        ],
      },
    ],
  },
  {
    id: 'accounts',
    heading: '3. Accounts and security',
    blocks: [
      {
        kind: 'p',
        text: 'Keep your password to yourself. Anything done from your account is treated as done by you, including approving a milestone. Tell us the same day at hello@nehemia.build if you think somebody else got in, and we will lock the account and freeze the approvals on any live project.',
      },
    ],
  },
  {
    id: 'posting',
    heading: '4. Posting a project',
    blocks: [
      {
        kind: 'list',
        items: [
          'Describe the work honestly, including what already exists on site. A quote for a plot with no foundation is not a quote for a house with a poured slab.',
          'You keep ownership of the photographs you upload. You grant us a limited licence to store and show them to quoting contractors, and to keep them in the project record.',
          'You can take a project down at any time. Quotes already submitted stay in your inbox; the contractor keeps what they had already seen.',
          'Do not post work that requires an approval you do not have and are not seeking, and do not upload somebody else’s drawings.',
          'A budget band is a range, not a promise. It tells contractors how to size their programme; it does not oblige you to spend it.',
        ],
      },
    ],
  },
  {
    id: 'verification',
    heading: '5. Verification, and what the badge means',
    blocks: [
      {
        kind: 'p',
        text: 'A verified contractor has, at the time of the check: a registration number that matches the National Construction Authority public register, an identity document matching the named owner, and two completed sites our desk was able to contact. The badge is a snapshot, not a warranty, and it says nothing about price.',
      },
      {
        kind: 'note',
        text: 'Registration numbers on profiles in this demonstration build are illustrative samples, not live register lookups. On a production deployment the same field carries the verified number, and a mismatch unpublished the profile the same day.',
      },
    ],
  },
  {
    id: 'quotes',
    heading: '6. Quotes and your decision',
    blocks: [
      {
        kind: 'list',
        ordered: true,
        items: [
          'A quote is an offer from a contractor to you. We pass it along unchanged; we do not set, rank, filter or negotiate prices.',
          'Accepting a quote on the platform records your acceptance, releases your contact details to that contractor, and notifies them. It is not a construction contract.',
          'The binding document is the milestone schedule you both approve, ideally signed. Take the exported comparison sheet and the schedule to a lawyer if the sums are large: it costs a day of fees against a project worth hundreds of thousands.',
          'Declining costs nothing. A contractor may not message you repeatedly after a decline; report it and their inbox access is suspended.',
        ],
      },
    ],
  },
  {
    id: 'payments',
    heading: '7. Milestones and payments',
    blocks: [
      {
        kind: 'list',
        items: [
          'Milestones are the unit of the relationship: a defined scope, a value, a due date, and closing evidence.',
          'You approve a phase when the photographs and the site match what the phase promised. Approval records your agreement to release the value; it does not move money.',
          'Payment pending bank transfer confirmation. The transfer is yours to make and to prove: keep the slip with the milestone.',
          'Never pay a large mobilisation before a phase exists in writing. If a quote asks for it, decline it here, not in a chat.',
          'We are not a party to your payment terms and cannot reverse a transfer. What we can do is show the file that proves what was approved on what date.',
        ],
      },
    ],
  },
  {
    id: 'contractor-duty',
    heading: '8. Duties on contractors',
    blocks: [
      {
        kind: 'list',
        items: [
          'Quote only work you can start inside the programme you wrote. A won quote that starts four months late is a breach of these terms.',
          'Upload the closing photographs for a phase you are claiming. A claim with no evidence is not approvable.',
          'Keep your registration current. If your NCA status changes, tell us within five working days.',
          'No buying reviews, no deleting reviews, no fake accounts, no rating solicitation with an incentive. Doing any of it ends your listing.',
        ],
      },
    ],
  },
  {
    id: 'conduct',
    heading: '9. Conduct, reviews and takedown',
    blocks: [
      {
        kind: 'p',
        text: 'Reviews must describe work you actually had done, at the price and programme you agreed. We do not edit opinions, but we remove reviews that are defamatory, that expose personal information such as an ID number, or that come from somebody with no project on the platform. Both sides may ask for a response to be attached to a review; it stays on the profile.',
      },
      {
        kind: 'p',
        text: 'If you believe content on the platform is unlawful, send us the url, the specific objection and your contact details. We review within five working days and we tell you what we did.',
      },
    ],
  },
  {
    id: 'no-advice',
    heading: '10. Not advice',
    blocks: [
      {
        kind: 'p',
        text: 'The numbers, bands and phase names on this site are illustrative of how a Kenyan residential project is usually staged. They are not a price list, a structural opinion, or a legal conclusion. Consult a registered professional for anything that will be built.',
      },
    ],
  },
  {
    id: 'availability',
    heading: '11. Availability and changes',
    blocks: [
      {
        kind: 'p',
        text: 'We aim to keep the service available and we do not promise it. Planned maintenance happens at night; if we can see a change coming that would affect an approval you were about to make, we message you first. Features change, and we will not tell you that a document you relied on yesterday has silently become something else.',
      },
    ],
  },
  {
    id: 'liability',
    heading: '12. Liability',
    blocks: [
      {
        kind: 'list',
        items: [
          'Nothing here excludes liability that Kenyan law will not let us exclude: fraud, wilful misconduct, death or personal injury caused by our negligence.',
          'We are not liable for the construction work, for a contractor’s failure to perform, for delays, or for the difference between what a quote said and what the site needed. Your contract is with the contractor.',
          'Our maximum aggregate liability to you for anything arising from this platform is the total fees you have paid us in the twelve months before the event, which on a free homeowner account is nil. That is not us being difficult: it is the honest statement that we are not the party who will put your roof on.',
          'We are liable for our own failure to protect your personal data, and for losing the project record where that loss costs you a claim you could otherwise have proved.',
        ],
      },
    ],
  },
  {
    id: 'disputes',
    heading: '13. Disputes',
    blocks: [
      {
        kind: 'list',
        ordered: true,
        items: [
          'Talk to each other in the project thread. A large share of disputes end there once the file is open in front of both sides.',
          'Ask us to review. The dispute desk reads the quotes, the schedule, the photographs and the messages, then writes down what the record shows. This is a factual finding, not an arbitration.',
          'Mediation with the National Construction Authority or a mediator you both accept.',
          'Court. Nothing here stops either side from going to a Kenyan court, and an approval you recorded on this platform is evidence there.',
        ],
      },
    ],
  },
  {
    id: 'law',
    heading: '14. Governing law',
    blocks: [
      {
        kind: 'p',
        text: 'These terms are governed by the laws of Kenya. Consumer rights under the Consumer Protection Act 2012 and the Data Protection Act 2019 apply in full and are not limited by anything above. If one clause falls, the rest stand.',
      },
    ],
  },
]

export const COOKIE_SECTIONS: LegalSection[] = [
  {
    id: 'short',
    heading: '1. The short version',
    blocks: [
      {
        kind: 'p',
        text: 'We use the smallest set of technologies that lets you stay signed in, keeps bots out, and remembers whether you want us measuring how the site performs. Nothing on this site is used to follow you around the internet or to sell you advertising.',
      },
      {
        kind: 'note',
        text: 'Your choice is remembered on this device under the key nehemiah-build-cookie-consent. Change it whenever you like from the link in the footer, and clear your browser storage to start over.',
      },
    ],
  },
  {
    id: 'what-is',
    heading: '2. What a cookie or a local key actually is',
    blocks: [
      {
        kind: 'p',
        text: 'A cookie is a small note the site asks your browser to keep and send back on the next visit. Local storage is the same idea, except the note stays on your device and is not sent to us with every request. We use both, and we list each one below with its life span.',
      },
    ],
  },
  {
    id: 'list',
    heading: '3. Every technology we set',
    blocks: [
      {
        kind: 'table',
        head: ['Name', 'Type', 'Kept for', 'What it does'],
        rows: [
          [
            'authjs.session-token (and __Secure- prefix)',
            'Cookie, strictly necessary',
            'Session',
            'Keeps you signed in to your own dashboard. HttpOnly, Secure, SameSite=Lax so other sites cannot read it.',
          ],
          [
            'authjs.callback-url',
            'Cookie, strictly necessary',
            'Minutes',
            'Remembers which page you were heading to when the sign in wall appeared.',
          ],
          [
            'nehemiah-build-cookie-consent',
            'Local storage, strictly necessary',
            '12 months',
            'Records your choice so the banner does not ask you again.',
          ],
          [
            'nehemiah-build-project-draft',
            'Local storage, functional',
            'Until you publish',
            'Keeps a half written project on this device so a dropped connection does not cost you the afternoon.',
          ],
          [
            'nehemiah-build-voice-tour-played',
            'Local storage, functional',
            'Forever on this device',
            'One flag: the site has already offered its spoken welcome tour, do not offer twice.',
          ],
          [
            'grecaptcha (google.com/recaptcha)',
            'Third party storage, security',
            'Per visit',
            'reCAPTCHA v3 risk signal on every form submission, with a visible checkbox as the fallback when the score is too low.',
          ],
          [
            'Vercel Analytics and Speed Insights',
            'First party measurement, optional',
            'Analytical only',
            'Page load timing and rough traffic counts, not shared with advertisers.',
          ],
        ],
      },
    ],
  },
  {
    id: 'categories',
    heading: '4. The categories you can choose',
    blocks: [
      {
        kind: 'list',
        items: [
          'Necessary: sign in, security, your consent record. Cannot be turned off, because without them the product cannot function.',
          'Functional: draft keeping and the voice tour. Off means we simply do not remember your half written form.',
          'Analytics: page and performance measurement. Off means we fly blind on what is slow.',
          'Marketing: none. This category exists in the panel only so that it is visibly empty, and so the control is already there if that ever changes. If it changes, this page changes first.',
        ],
      },
    ],
  },
  {
    id: 'law',
    heading: '5. The legal basis for each one',
    blocks: [
      {
        kind: 'p',
        text: 'Under the Data Protection Act 2019 and the Kenya Information and Communications (Cookies and Other Privacy regulated Data) Guidelines, strictly necessary storage needs no consent; everything else does. That is why the banner appears before any optional technology is set, why "Reject Optional" is a button of equal size to "Accept All", and why the panel can be opened from the banner rather than only from a policy page.',
      },
    ],
  },
  {
    id: 'control',
    heading: '6. Your controls',
    blocks: [
      {
        kind: 'list',
        items: [
          'The banner at the bottom of your first visit: Accept All, Reject Optional, or Manage Preferences.',
          'The footer link "Cookie Policy" opens the same preferences panel again on any later visit.',
          'Your browser can block or delete cookies for this site; if you do, you will be signed out and asked again.',
          'You can opt out of Google reCAPTCHA processing at google.com/settings/ads, though on this site the fallback challenge still applies.',
        ],
      },
    ],
  },
  {
    id: 'no-advertising',
    heading: '7. What we do not do',
    blocks: [
      {
        kind: 'list',
        items: [
          'No advertising cookies, no retargeting pixels, no social media trackers.',
          'No fingerprinting to identify you without a cookie.',
          'No sale or sharing of anything measured here with a data broker.',
          'No email harvesting from reviews, profiles or project text to build marketing lists.',
        ],
      },
    ],
  },
]

export const POLICIES = {
  'privacy-policy': {
    eyebrow: 'Legal',
    title: 'Privacy Policy',
    intro:
      'How Nehemiah Build collects, uses, stores and protects the information of Kenyan homeowners and contractors, under the Data Protection Act 2019.',
    sections: PRIVACY_SECTIONS,
    summary: [
      'We hold the record of what was agreed, and very little else.',
      'Your phone number reaches one contractor, only after you accept their quote.',
      'We never see payment details and we do not sell data, at all.',
      'Ask for your copy, or its deletion, at hello@nehemia.build and we answer in 72 hours.',
    ],
  },
  terms: {
    eyebrow: 'Legal',
    title: 'Terms of Service',
    intro:
      'The agreement between you and Nehemiah Build: what the platform does, what it does not do, and how milestones, quotes and payments are treated.',
    sections: TERMS_SECTIONS,
    summary: [
      'We introduce and record. We do not build, insure, or move your money.',
      'A quote is an offer to you, and accepting it is not the construction contract.',
      'Approval records your agreement; payment pending bank transfer confirmation.',
      'Governed by Kenyan law, with consumer and data rights fully preserved.',
    ],
  },
  'cookie-policy': {
    eyebrow: 'Legal',
    title: 'Cookie Policy',
    intro:
      'Every cookie, local storage key and third party technology this site sets, what it is for, how long it lives, and how to change your mind.',
    sections: COOKIE_SECTIONS,
    summary: [
      'Two necessary cookies for sign in and one local key for your consent.',
      'Nothing marketing related is set, and nothing is shared with advertisers.',
      'Reject Optional is a real choice: the site keeps working.',
      'Change your mind any time from this page or your browser settings.',
    ],
  },
} as const

export type PolicyKey = keyof typeof POLICIES

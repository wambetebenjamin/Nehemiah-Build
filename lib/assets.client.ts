/**
 * Local fallback images.
 *
 * Every picture on the site is a Pexels photograph (see lib/pexels.ts and
 * public/image-credits.md). These are the copies of the same slots that shipped
 * inside the uploaded template, served from our own origin, and they are what a
 * visitor sees when the CDN cannot be reached. They are deliberately plain string
 * paths rather than bundler imported assets: the files live in /public, no
 * optimiser step is needed for them, and a static image import that resolves to
 * nothing on one side of the server/client boundary cannot break a page.
 *
 * Filenames mirror the template's own image names, unchanged.
 */
export const LOCAL_PATHS = {
  bg1: '/images/bg_1.jpg',
  bg2: '/images/bg_2.jpg',
  aboutMain: '/images/about.jpg',
  about2: '/images/about-2.jpg',
  about3: '/images/about-3.jpg',
  project1: '/images/project-1.jpg',
  project2: '/images/project-2.jpg',
  project3: '/images/project-3.jpg',
  project4: '/images/project-4.jpg',
  project5: '/images/project-5.jpg',
  project6: '/images/project-6.jpg',
  services1: '/images/services-1.jpg',
  services2: '/images/services-2.jpg',
  services3: '/images/services-3.jpg',
  services4: '/images/services-4.jpg',
  services5: '/images/services-5.jpg',
  services6: '/images/services-6.jpg',
  image1: '/images/image_1.jpg',
  image2: '/images/image_2.jpg',
  image3: '/images/image_3.jpg',
  image4: '/images/image_4.jpg',
  image5: '/images/image_5.jpg',
  image6: '/images/image_6.jpg',
  person1: '/images/person_1.jpg',
  person2: '/images/person_2.jpg',
  person3: '/images/person_3.jpg',
  person4: '/images/person_4.jpg',
  team1: '/images/team-1.jpg',
  team2: '/images/team-2.jpg',
  team3: '/images/team-3.jpg',
  team4: '/images/team-4.jpg',
  team5: '/images/team-5.jpg',
  team6: '/images/team-6.jpg',
  team7: '/images/team-7.jpg',
  team8: '/images/team-8.jpg',
} as const

/** Kept as an alias so the data layer can keep saying LOCAL_IMAGES[key]. */
export const LOCAL_IMAGES = LOCAL_PATHS

/** A fallback is always a same origin path. */
export type LocalAsset = string

export type LocalImageKey = keyof typeof LOCAL_IMAGES

/**
 * A picture used on the site: a Pexels backed source plus the local asset that
 * stands in for it when the CDN is unreachable.
 */
export type Picture = {
  /** Remote Pexels url (undefined for template-only assets). */
  src?: string
  /** Pexels photo metadata, used for credits and alt text hints. */
  pexels?: { id: number; author: string }
  /** Local same-origin fallback. */
  fallback: LocalAsset
  alt: string
  width: number
  height: number
}

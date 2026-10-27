import { PEXELS, pexelsUrl, type PexelsKey } from '@/lib/pexels'
import { LOCAL_IMAGES, type LocalAsset, type LocalImageKey } from '@/lib/assets.client'

/**
 * Picture specs for every slot on the site.
 *
 * `remote` is the Pexels photo the site is designed around (Step 10 of the
 * brief: Pexels free plan, East African subjects). `fallback` is the copy of
 * that slot shipped in /public/images, used when the CDN cannot be reached.
 *
 * To ship a fully self-hosted build instead, drop the downloaded Pexels file
 * into /public/images with the name given in image-credits.md and switch the
 * fallback key, or set USE_REMOTE_PEXELS = false to serve the local copies
 * everywhere and skip the optimiser round trip.
 */
export const USE_REMOTE_PEXELS = true

export type PictureSpec = {
  remote?: string
  pexels?: { id: number; author: string }
  /** Same origin copy of this slot, served when the CDN is unreachable. */
  fallback: LocalAsset
  /** Intrinsic size of the local copy, so the fallback causes no layout shift. */
  fallbackMeta?: { width: number; height: number }
  alt: string
  width: number
  height: number
}

/** Intrinsic size of each local fallback, so layout shift is avoided. */
const FALLBACK_META: Record<LocalImageKey, { width: number; height: number }> = {
  bg1: { width: 2000, height: 1333 },
  bg2: { width: 2000, height: 1333 },
  aboutMain: { width: 1000, height: 1141 },
  about2: { width: 1000, height: 667 },
  about3: { width: 1000, height: 667 },
  project1: { width: 2000, height: 1333 },
  project2: { width: 1000, height: 668 },
  project3: { width: 1000, height: 667 },
  project4: { width: 1000, height: 667 },
  project5: { width: 1000, height: 667 },
  project6: { width: 1000, height: 667 },
  services1: { width: 1000, height: 667 },
  services2: { width: 2000, height: 1333 },
  services3: { width: 1000, height: 667 },
  services4: { width: 1000, height: 667 },
  services5: { width: 1000, height: 667 },
  services6: { width: 1000, height: 667 },
  image1: { width: 800, height: 565 },
  image2: { width: 800, height: 542 },
  image3: { width: 800, height: 533 },
  image4: { width: 800, height: 1117 },
  image5: { width: 800, height: 533 },
  image6: { width: 800, height: 470 },
  person1: { width: 479, height: 479 },
  person2: { width: 607, height: 607 },
  person3: { width: 517, height: 517 },
  person4: { width: 433, height: 433 },
  team1: { width: 800, height: 960 },
  team2: { width: 800, height: 960 },
  team3: { width: 800, height: 960 },
  team4: { width: 800, height: 960 },
  team5: { width: 800, height: 964 },
  team6: { width: 800, height: 852 },
  team7: { width: 800, height: 852 },
  team8: { width: 800, height: 852 },
}

/** Local stand-in for each Pexels photo id, keyed by id. */
const FALLBACK_BY_ID: Record<number, LocalImageKey> = {
  [PEXELS.hero.id]: 'bg1',
  [PEXELS.scaffoldingSky.id]: 'project1',
  [PEXELS.teamTablet.id]: 'project2',
  [PEXELS.rooftopGear.id]: 'project3',
  [PEXELS.urbanDig.id]: 'project4',
  [PEXELS.craneWorker.id]: 'project5',
  [PEXELS.foundationBricks.id]: 'project6',
  [PEXELS.wheelbarrow.id]: 'services1',
  [PEXELS.shovelsStreet.id]: 'services2',
  [PEXELS.welders.id]: 'services3',
  [PEXELS.masonryHands.id]: 'services4',
  [PEXELS.brickWorkers.id]: 'services5',
  [PEXELS.layingBricks.id]: 'services6',
  [PEXELS.blueprintsTeam.id]: 'about2',
  [PEXELS.blueprintReview.id]: 'image1',
  [PEXELS.electricalPanel.id]: 'image2',
  [PEXELS.plumbingFittings.id]: 'image3',
  [PEXELS.interiorAfrican.id]: 'image4',
  [PEXELS.interiorSea.id]: 'image5',
  [PEXELS.modernInterior.id]: 'image6',
  [PEXELS.workerUganda.id]: 'person1',
  [PEXELS.celebratingCrew.id]: 'person2',
  [PEXELS.womanYellowHardhat.id]: 'person3',
  [PEXELS.womanCrossedArms.id]: 'person4',
  [PEXELS.womanSunnyPPE.id]: 'team1',
  [PEXELS.womanWipingSweat.id]: 'team2',
  [PEXELS.twoWomenSite.id]: 'team3',
  [PEXELS.womanHammer.id]: 'team4',
  [PEXELS.womanPhone.id]: 'team5',
  [PEXELS.engineerArmsCrossed.id]: 'team6',
  [PEXELS.engineerCloseUp.id]: 'team7',
  [PEXELS.mapEngineer.id]: 'team8',
  [PEXELS.nairobiCap.id]: 'person1',
  [PEXELS.businesswomanDesk.id]: 'person3',
  [PEXELS.womanSuit.id]: 'team5',
  [PEXELS.manBrownSuit.id]: 'person2',
}

function fromPexels(key: PexelsKey, alt: string, width: number, height: number): PictureSpec {
  const ref = PEXELS[key]
  const fallbackKey = FALLBACK_BY_ID[ref.id] ?? 'bg1'
  return {
    ...(USE_REMOTE_PEXELS ? { remote: pexelsUrl(ref) } : {}),
    pexels: { id: ref.id, author: ref.author },
    fallback: LOCAL_IMAGES[fallbackKey],
    fallbackMeta: FALLBACK_META[fallbackKey],
    alt,
    width,
    height,
  }
}

function localOnly(key: LocalImageKey, alt: string, width?: number, height?: number): PictureSpec {
  const meta = FALLBACK_META[key]
  return {
    fallback: LOCAL_IMAGES[key],
    fallbackMeta: meta,
    alt,
    width: width ?? meta.width,
    height: height ?? meta.height,
  }
}

/** Named slots used by pages and components. */
export const PICTURES = {
  heroHome: fromPexels('hero', 'Construction crew working on scaffolding at a Nairobi apartment build', 2000, 1333),
  introBand: fromPexels('craneWorker', 'Rigger working high on a crane against clear sky', 2000, 1333),
  aboutMain: fromPexels('blueprintsTeam', 'Architects reviewing drawings on site', 1000, 667),
  aboutInset: fromPexels('teamTablet', 'Site supervisor sharing progress with the crew on a tablet', 1000, 667),
  heroInterior: fromPexels('interiorAfrican', 'Open plan living room finished by a Nehemiah Build interior designer', 1200, 800),
  quoteCover: fromPexels('scaffoldingSky', 'Scaffolders finishing the top floor of a residential block', 1600, 900),
  postHero: fromPexels('foundationBricks', 'Foundation courses being laid on a housing site', 1600, 900),
  applyHero: fromPexels('celebratingCrew', 'Contractor crew celebrating a completed phase', 1600, 900),
  slideInterior: sitePicture('interiorAfrican', 'Finished open plan living room in a Kenyan home'),
  slideBlueprints: sitePicture('blueprintsTeam', 'Architects reviewing construction drawings on site'),
  slideMasonry: sitePicture('foundationBricks', 'Masons laying the first courses of a foundation'),
  celebratingBand: sitePicture('celebratingCrew', 'A crew at the end of a phase, photos from a completed project'),
  aboutCrew: sitePicture('teamTablet', 'The verification desk walking a site with a homeowner'),
  aboutHero: localOnly('bg2', 'Reinforcement steel tied on an upper slab', 2000, 1333),
  projectFallback: localOnly('project2', 'Half built structure waiting for the next phase', 1000, 668),
} as const satisfies Record<string, PictureSpec>

export type PictureKey = keyof typeof PICTURES

/** Portfolio and avatar builders used by the data layer. */
export function sitePicture(key: PexelsKey, alt: string): PictureSpec {
  return fromPexels(key, alt, 1200, 800)
}

export function portraitPicture(key: PexelsKey, alt: string): PictureSpec {
  return fromPexels(key, alt, 700, 700)
}

export { LOCAL_IMAGES, FALLBACK_META }
export type { PexelsKey }

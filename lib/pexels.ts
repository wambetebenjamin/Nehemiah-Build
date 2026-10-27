/**
 * Pexels photo ids used across the site.
 *
 * Every id below maps to a real Pexels photo page, so the same picture can be
 * traced back to its author in image-credits.md. Photos are requested through
 * the Pexels CDN with `auto=compress`, which is what the Pexels free plan
 * serves. No watermarks, no AI generated imagery.
 */

export type PexelsRef = { id: number; author: string; page: string }

const p = (id: number, author: string, page: string): PexelsRef => ({ id, author, page })

export const PEXELS = {
  // Site, structures and finishes
  hero: p(30661413, 'MC G\u2019Zay', 'construction-workers-on-scaffolding-in-nairobi'),
  scaffoldingSky: p(30661431, 'MC G\u2019Zay', 'construction-workers-on-scaffolding-against-clear-sky-in-nairobi'),
  teamTablet: p(36574302, 'Harrun Muhammad', 'diverse-construction-team-collaborating-outdoors'),
  rooftopGear: p(30674591, 'Madknoxx Deluxe', 'construction-worker-on-rooftop-with-safety-gear'),
  urbanDig: p(38284505, 'Kalz Michael', 'construction-worker-at-urban-building-site'),
  craneWorker: p(36673004, 'Alshreef', 'construction-worker-on-crane-in-libya'),
  foundationBricks: p(33597033, 'Snazzy Photography', 'workers-building-at-a-construction-site-in-kaduna'),
  wheelbarrow: p(33640549, 'Gwara Photography', 'man-working-with-wheelbarrow-in-construction-site'),
  shovelsStreet: p(36200911, 'ScriptsAndTags', 'construction-worker-in-ife-nigeria-street-scene'),
  welders: p(12491632, 'Messina', 'close-up-of-workers-standing'),
  masonryHands: p(32913797, 'Thanh Long B\u00f9i', 'close-up-of-bricklayer-s-hand-laying-a-brick'),
  brickWorkers: p(11429199, 'Yura Forrat', 'brick-workers-at-construction-site'),
  layingBricks: p(16468074, 'Kartik Das', 'man-laying-bricks-on-a-construction-site'),
  blueprintsTeam: p(29299826, 'Maren Ferraro', 'architects-reviewing-construction-blueprints-outdoors'),
  blueprintReview: p(7937752, 'Pavel Danilyuk', 'an-architect-looking-at-the-floor-plan'),
  electricalPanel: p(442160, 'Pixabay', 'an-electrician-repairing-the-ac-power-plugs-and-sockets'),
  plumbingFittings: p(6419128, 'An\u0131l Karakaya', 'plumber-installs-pipe-fittings'),
  interiorAfrican: p(12715584, 'Keegan Checks', 'spacious-living-room-with-open-plan-and-african-style-decor'),
  interiorSea: p(12715501, 'Keegan Checks', 'interior-of-a-room-in-a-house-with-a-view-of-sea'),
  modernInterior: p(5698004, 'Curtis Adams', 'interior-design-in-the-living-room'),

  // People (contractors, team, homeowners)
  workerUganda: p(19982408, 'illustrate Digital Ug', 'worker-at-construction-site'),
  celebratingCrew: p(38706745, 'Akoonie', 'construction-workers-celebrating-at-job-site'),
  womanYellowHardhat: p(8487760, 'Kindel Media', 'woman-engineer-in-yellow-hardhat'),
  womanCrossedArms: p(8487340, 'Kindel Media', 'female-engineer-in-reflective-vest'),
  womanSunnyPPE: p(8487341, 'Kindel Media', 'handywoman-in-reflective-vest-and-white-hardhat'),
  womanWipingSweat: p(8487783, 'Kindel Media', 'woman-engineer-wiping-her-sweat-away'),
  twoWomenSite: p(8487404, 'Kindel Media', 'woman-engineer-wearing-safety-glasses'),
  womanHammer: p(8487732, 'Kindel Media', 'woman-in-an-orange-reflective-vest'),
  womanPhone: p(8487722, 'Kindel Media', 'woman-engineer-using-phone'),
  engineerArmsCrossed: p(8486924, 'Kindel Media', 'female-engineer-with-her-arms-crossed'),
  engineerCloseUp: p(8486977, 'Kindel Media', 'close-up-photo-of-female-engineer-in-yellow-hardhat'),
  nairobiCap: p(33569488, 'Charles Lichinga', 'african-man-portrait-with-cap-in-nairobi-kenya'),
  businesswomanDesk: p(20209020, 'Khris Kunta kUkU', 'smiling-african-businesswoman-in-office-setting'),
  womanSuit: p(29852895, 'Ifeyinka Adeyemo', 'professional-corporate-headshot-of-smiling-woman'),
  manBrownSuit: p(33844626, 'Ab Pixels', 'professional-portrait-of-a-young-man-in-suit'),
  mapEngineer: p(11174197, 'Tubarones', 'a-woman-in-a-hard-hat-looking-at-a-map'),
} satisfies Record<string, PexelsRef>

export type PexelsKey = keyof typeof PEXELS

/** Canonical CDN url for a Pexels photo, sized on demand by the image loader. */
export function pexelsUrl(ref: PexelsRef): string {
  return `https://images.pexels.com/photos/${ref.id}/pexels-photo-${ref.id}.jpeg`
}

export function pexelsPageUrl(ref: PexelsRef): string {
  return `https://www.pexels.com/photo/${ref.page}-${ref.id}/`
}

# Image credits

Every photograph on Nehemiah Build is a free stock image from [Pexels](https://www.pexels.com/), served from the
Pexels CDN through `next/image`. No watermarked image, no AI generated picture, and no image from any other
source is used anywhere on the site. The selection prioritises East African and Kenyan building sites, and
Kenyan and East African people for every portrait.

## Licence

Pexels photographs are used under the [Pexels licence](https://www.pexels.com/license/), which permits free
commercial use without attribution. Attribution is nevertheless recorded below, photo by photo, because a
construction site is exactly the kind of place where you should be able to ask where an image came from.

- Free to use, even for commercial purposes.
- No permission required to modify; images are resized and cropped by the image optimiser only.
- Attribution given here and not required by the licence.
- People in these photographs are models on Pexels and are not affiliated with Nehemiah Build. No image in
  this build implies that a named individual endorses the platform, and no photograph is presented as a real
  project of a listed contractor: portfolio imagery is illustrative.

## How images are loaded

`components/pex-image.tsx` renders `next/image` with `remotePatterns` limited to `images.pexels.com`
(see `next.config.ts`). If the CDN cannot be reached, the same component falls back to a local copy of the
template photograph under `public/images/`, which keeps the layout intact on restricted networks. The local
files are the ones shipped inside `wilcon-main.zip`; they are stand ins for layout, not the primary imagery,
and their original paths inside the mirrored template are preserved unchanged.

## Pexels photographs in use

| Key in `lib/pexels.ts` | Photo id | Author | Pexels page | Where it appears |
| --- | --- | --- | --- | --- |
| `modernInterior` | 5698004 | Curtis Adams | https://www.pexels.com/photo/interior-design-in-the-living-room-5698004/ | zenith-architects-nairobi (portfolio), voltage-kitchens-electrical (portfolio), precision-tiling-and-flooring (portfolio), colours-plus-painting (portfolio), savana-interiors (portfolio), coast-line-tiles (portfolio) (used 6x) |
| `teamTablet` | 36574302 | Harrun Muhammad | https://www.pexels.com/photo/diverse-construction-team-collaborating-outdoors-36574302/ | rift-valley-structural-engineers (portfolio), titan-plumbing-solutions (portfolio), savana-interiors (portfolio) (used 5x) |
| `interiorAfrican` | 12715584 | Keegan Checks | https://www.pexels.com/photo/spacious-living-room-with-open-plan-and-african-style-decor-12715584/ | precision-tiling-and-flooring (portfolio), colours-plus-painting (portfolio), savana-interiors (portfolio) (used 5x) |
| `blueprintsTeam` | 29299826 | Maren Ferraro | https://www.pexels.com/photo/architects-reviewing-construction-blueprints-outdoors-29299826/ | zenith-architects-nairobi (portfolio), rift-valley-structural-engineers (portfolio) (used 4x) |
| `scaffoldingSky` | 30661431 | MC G’Zay | https://www.pexels.com/photo/construction-workers-on-scaffolding-against-clear-sky-in-nairobi-30661431/ | zenith-architects-nairobi (portfolio), rift-valley-structural-engineers (portfolio), apex-roofing-systems (portfolio) (used 4x) |
| `blueprintReview` | 7937752 | Pavel Danilyuk | https://www.pexels.com/photo/an-architect-looking-at-the-floor-plan-7937752/ | zenith-architects-nairobi (portfolio), voltage-kitchens-electrical (portfolio), colours-plus-painting (portfolio), savana-interiors (portfolio) (used 4x) |
| `masonryHands` | 32913797 | Thanh Long Bùi | https://www.pexels.com/photo/close-up-of-bricklayer-s-hand-laying-a-brick-32913797/ | titan-plumbing-solutions (portfolio), precision-tiling-and-flooring (portfolio), colours-plus-painting (portfolio), coast-line-tiles (portfolio) (used 4x) |
| `hero` | 30661413 | MC G’Zay | https://www.pexels.com/photo/construction-workers-on-scaffolding-in-nairobi-30661413/ | zenith-architects-nairobi (portfolio), apex-roofing-systems (portfolio) (used 3x) |
| `craneWorker` | 36673004 | Alshreef | https://www.pexels.com/photo/construction-worker-on-crane-in-libya-36673004/ | rift-valley-structural-engineers (portfolio), apex-roofing-systems (portfolio) (used 3x) |
| `celebratingCrew` | 38706745 | Akoonie | https://www.pexels.com/photo/construction-workers-celebrating-at-job-site-38706745/ | precision-tiling-and-flooring (avatar) (used 3x) |
| `workerUganda` | 19982408 | illustrate Digital Ug | https://www.pexels.com/photo/worker-at-construction-site-19982408/ | zenith-architects-nairobi (avatar), titan-plumbing-solutions (avatar), about page team: Nehemiah Kiptanui, founder (used 3x) |
| `welders` | 12491632 | Messina | https://www.pexels.com/photo/close-up-of-workers-standing-12491632/ | titan-plumbing-solutions (portfolio), voltage-kitchens-electrical (portfolio), apex-roofing-systems (portfolio) (used 3x) |
| `interiorSea` | 12715501 | Keegan Checks | https://www.pexels.com/photo/interior-of-a-room-in-a-house-with-a-view-of-sea-12715501/ | colours-plus-painting (portfolio), savana-interiors (portfolio), coast-line-tiles (portfolio) (used 3x) |
| `foundationBricks` | 33597033 | Snazzy Photography | https://www.pexels.com/photo/workers-building-at-a-construction-site-in-kaduna-33597033/ | Contractor directory imagery (used 2x) |
| `womanYellowHardhat` | 8487760 | Kindel Media | https://www.pexels.com/photo/woman-engineer-in-yellow-hardhat-8487760/ | rift-valley-structural-engineers (avatar), about page team: Joyce Chebet, structural review lead (used 2x) |
| `urbanDig` | 38284505 | Kalz Michael | https://www.pexels.com/photo/construction-worker-at-urban-building-site-38284505/ | rift-valley-structural-engineers (portfolio), titan-plumbing-solutions (portfolio) (used 2x) |
| `womanSunnyPPE` | 8487341 | Kindel Media | https://www.pexels.com/photo/handywoman-in-reflective-vest-and-white-hardhat-8487341/ | voltage-kitchens-electrical (avatar), about page team: Alice Njeri, head of verification (used 2x) |
| `rooftopGear` | 30674591 | Madknoxx Deluxe | https://www.pexels.com/photo/construction-worker-on-rooftop-with-safety-gear-30674591/ | voltage-kitchens-electrical (portfolio), apex-roofing-systems (portfolio) (used 2x) |
| `brickWorkers` | 11429199 | Yura Forrat | https://www.pexels.com/photo/brick-workers-at-construction-site-11429199/ | precision-tiling-and-flooring (portfolio), coast-line-tiles (portfolio) (used 2x) |
| `layingBricks` | 16468074 | Kartik Das | https://www.pexels.com/photo/man-laying-bricks-on-a-construction-site-16468074/ | precision-tiling-and-flooring (portfolio), coast-line-tiles (portfolio) (used 2x) |
| `manBrownSuit` | 33844626 | Ab Pixels | https://www.pexels.com/photo/professional-portrait-of-a-young-man-in-suit-33844626/ | apex-roofing-systems (avatar), about page team: Brian Kiptoo, dispute resolution manager (used 2x) |
| `plumbingFittings` | 6419128 | Anıl Karakaya | https://www.pexels.com/photo/plumber-installs-pipe-fittings-6419128/ | titan-plumbing-solutions (portfolio) (used 1x) |
| `electricalPanel` | 442160 | Pixabay | https://www.pexels.com/photo/an-electrician-repairing-the-ac-power-plugs-and-sockets-442160/ | voltage-kitchens-electrical (portfolio) (used 1x) |
| `womanCrossedArms` | 8487340 | Kindel Media | https://www.pexels.com/photo/female-engineer-in-reflective-vest-8487340/ | colours-plus-painting (avatar) (used 1x) |
| `twoWomenSite` | 8487404 | Kindel Media | https://www.pexels.com/photo/woman-engineer-wearing-safety-glasses-8487404/ | savana-interiors (avatar) (used 1x) |
| `womanWipingSweat` | 8487783 | Kindel Media | https://www.pexels.com/photo/woman-engineer-wiping-her-sweat-away-8487783/ | coast-line-tiles (avatar) (used 1x) |
| `businesswomanDesk` | 20209020 | Khris Kunta kUkU | https://www.pexels.com/photo/smiling-african-businesswoman-in-office-setting-20209020/ | about page team: Grace Wanjiru, homeowner from Kiambu (used 1x) |
| `nairobiCap` | 33569488 | Charles Lichinga | https://www.pexels.com/photo/african-man-portrait-with-cap-in-nairobi-kenya-33569488/ | about page team: Peter Otieno, homeowner from Nairobi (used 1x) |
| `womanSuit` | 29852895 | Ifeyinka Adeyemo | https://www.pexels.com/photo/professional-corporate-headshot-of-smiling-woman-29852895/ | about page team: Sarah Achieng, homeowner from Kisumu (used 1x) |

## Full verified id list

For audit, every id resolved in this build, in `lib/pexels.ts` order:

- `hero` 30661413 by MC G’Zay, https://www.pexels.com/photo/construction-workers-on-scaffolding-in-nairobi-30661413/
- `scaffoldingSky` 30661431 by MC G’Zay, https://www.pexels.com/photo/construction-workers-on-scaffolding-against-clear-sky-in-nairobi-30661431/
- `teamTablet` 36574302 by Harrun Muhammad, https://www.pexels.com/photo/diverse-construction-team-collaborating-outdoors-36574302/
- `rooftopGear` 30674591 by Madknoxx Deluxe, https://www.pexels.com/photo/construction-worker-on-rooftop-with-safety-gear-30674591/
- `urbanDig` 38284505 by Kalz Michael, https://www.pexels.com/photo/construction-worker-at-urban-building-site-38284505/
- `craneWorker` 36673004 by Alshreef, https://www.pexels.com/photo/construction-worker-on-crane-in-libya-36673004/
- `foundationBricks` 33597033 by Snazzy Photography, https://www.pexels.com/photo/workers-building-at-a-construction-site-in-kaduna-33597033/
- `wheelbarrow` 33640549 by Gwara Photography, https://www.pexels.com/photo/man-working-with-wheelbarrow-in-construction-site-33640549/
- `shovelsStreet` 36200911 by ScriptsAndTags, https://www.pexels.com/photo/construction-worker-in-ife-nigeria-street-scene-36200911/
- `welders` 12491632 by Messina, https://www.pexels.com/photo/close-up-of-workers-standing-12491632/
- `masonryHands` 32913797 by Thanh Long Bùi, https://www.pexels.com/photo/close-up-of-bricklayer-s-hand-laying-a-brick-32913797/
- `brickWorkers` 11429199 by Yura Forrat, https://www.pexels.com/photo/brick-workers-at-construction-site-11429199/
- `layingBricks` 16468074 by Kartik Das, https://www.pexels.com/photo/man-laying-bricks-on-a-construction-site-16468074/
- `blueprintsTeam` 29299826 by Maren Ferraro, https://www.pexels.com/photo/architects-reviewing-construction-blueprints-outdoors-29299826/
- `blueprintReview` 7937752 by Pavel Danilyuk, https://www.pexels.com/photo/an-architect-looking-at-the-floor-plan-7937752/
- `electricalPanel` 442160 by Pixabay, https://www.pexels.com/photo/an-electrician-repairing-the-ac-power-plugs-and-sockets-442160/
- `plumbingFittings` 6419128 by Anıl Karakaya, https://www.pexels.com/photo/plumber-installs-pipe-fittings-6419128/
- `interiorAfrican` 12715584 by Keegan Checks, https://www.pexels.com/photo/spacious-living-room-with-open-plan-and-african-style-decor-12715584/
- `interiorSea` 12715501 by Keegan Checks, https://www.pexels.com/photo/interior-of-a-room-in-a-house-with-a-view-of-sea-12715501/
- `modernInterior` 5698004 by Curtis Adams, https://www.pexels.com/photo/interior-design-in-the-living-room-5698004/
- `workerUganda` 19982408 by illustrate Digital Ug, https://www.pexels.com/photo/worker-at-construction-site-19982408/
- `celebratingCrew` 38706745 by Akoonie, https://www.pexels.com/photo/construction-workers-celebrating-at-job-site-38706745/
- `womanYellowHardhat` 8487760 by Kindel Media, https://www.pexels.com/photo/woman-engineer-in-yellow-hardhat-8487760/
- `womanCrossedArms` 8487340 by Kindel Media, https://www.pexels.com/photo/female-engineer-in-reflective-vest-8487340/
- `womanSunnyPPE` 8487341 by Kindel Media, https://www.pexels.com/photo/handywoman-in-reflective-vest-and-white-hardhat-8487341/
- `womanWipingSweat` 8487783 by Kindel Media, https://www.pexels.com/photo/woman-engineer-wiping-her-sweat-away-8487783/
- `twoWomenSite` 8487404 by Kindel Media, https://www.pexels.com/photo/woman-engineer-wearing-safety-glasses-8487404/
- `womanHammer` 8487732 by Kindel Media, https://www.pexels.com/photo/woman-in-an-orange-reflective-vest-8487732/
- `womanPhone` 8487722 by Kindel Media, https://www.pexels.com/photo/woman-engineer-using-phone-8487722/
- `engineerArmsCrossed` 8486924 by Kindel Media, https://www.pexels.com/photo/female-engineer-with-her-arms-crossed-8486924/
- `engineerCloseUp` 8486977 by Kindel Media, https://www.pexels.com/photo/close-up-photo-of-female-engineer-in-yellow-hardhat-8486977/
- `nairobiCap` 33569488 by Charles Lichinga, https://www.pexels.com/photo/african-man-portrait-with-cap-in-nairobi-kenya-33569488/
- `businesswomanDesk` 20209020 by Khris Kunta kUkU, https://www.pexels.com/photo/smiling-african-businesswoman-in-office-setting-20209020/
- `womanSuit` 29852895 by Ifeyinka Adeyemo, https://www.pexels.com/photo/professional-corporate-headshot-of-smiling-woman-29852895/
- `manBrownSuit` 33844626 by Ab Pixels, https://www.pexels.com/photo/professional-portrait-of-a-young-man-in-suit-33844626/
- `mapEngineer` 11174197 by Tubarones, https://www.pexels.com/photo/a-woman-in-a-hard-hat-looking-at-a-map-11174197/

## Per contractor

| Profile | Slot | Photo id | Author |
| --- | --- | --- | --- |
| zenith-architects-nairobi | Avatar | 19982408 | illustrate Digital Ug |
| zenith-architects-nairobi | Portfolio | 7937752 | Pavel Danilyuk |
| zenith-architects-nairobi | Portfolio | 29299826 | Maren Ferraro |
| zenith-architects-nairobi | Portfolio | 30661413 | MC G’Zay |
| zenith-architects-nairobi | Portfolio | 30661431 | MC G’Zay |
| zenith-architects-nairobi | Portfolio | 5698004 | Curtis Adams |
| rift-valley-structural-engineers | Avatar | 8487760 | Kindel Media |
| rift-valley-structural-engineers | Portfolio | 36673004 | Alshreef |
| rift-valley-structural-engineers | Portfolio | 29299826 | Maren Ferraro |
| rift-valley-structural-engineers | Portfolio | 38284505 | Kalz Michael |
| rift-valley-structural-engineers | Portfolio | 30661431 | MC G’Zay |
| rift-valley-structural-engineers | Portfolio | 36574302 | Harrun Muhammad |
| titan-plumbing-solutions | Avatar | 19982408 | illustrate Digital Ug |
| titan-plumbing-solutions | Portfolio | 6419128 | Anıl Karakaya |
| titan-plumbing-solutions | Portfolio | 12491632 | Messina |
| titan-plumbing-solutions | Portfolio | 38284505 | Kalz Michael |
| titan-plumbing-solutions | Portfolio | 32913797 | Thanh Long Bùi |
| titan-plumbing-solutions | Portfolio | 36574302 | Harrun Muhammad |
| voltage-kitchens-electrical | Avatar | 8487341 | Kindel Media |
| voltage-kitchens-electrical | Portfolio | 442160 | Pixabay |
| voltage-kitchens-electrical | Portfolio | 12491632 | Messina |
| voltage-kitchens-electrical | Portfolio | 7937752 | Pavel Danilyuk |
| voltage-kitchens-electrical | Portfolio | 30674591 | Madknoxx Deluxe |
| voltage-kitchens-electrical | Portfolio | 5698004 | Curtis Adams |
| precision-tiling-and-flooring | Avatar | 38706745 | Akoonie |
| precision-tiling-and-flooring | Portfolio | 32913797 | Thanh Long Bùi |
| precision-tiling-and-flooring | Portfolio | 11429199 | Yura Forrat |
| precision-tiling-and-flooring | Portfolio | 16468074 | Kartik Das |
| precision-tiling-and-flooring | Portfolio | 12715584 | Keegan Checks |
| precision-tiling-and-flooring | Portfolio | 5698004 | Curtis Adams |
| apex-roofing-systems | Avatar | 33844626 | Ab Pixels |
| apex-roofing-systems | Portfolio | 30674591 | Madknoxx Deluxe |
| apex-roofing-systems | Portfolio | 36673004 | Alshreef |
| apex-roofing-systems | Portfolio | 30661431 | MC G’Zay |
| apex-roofing-systems | Portfolio | 12491632 | Messina |
| apex-roofing-systems | Portfolio | 30661413 | MC G’Zay |
| colours-plus-painting | Avatar | 8487340 | Kindel Media |
| colours-plus-painting | Portfolio | 5698004 | Curtis Adams |
| colours-plus-painting | Portfolio | 12715584 | Keegan Checks |
| colours-plus-painting | Portfolio | 12715501 | Keegan Checks |
| colours-plus-painting | Portfolio | 7937752 | Pavel Danilyuk |
| colours-plus-painting | Portfolio | 32913797 | Thanh Long Bùi |
| savana-interiors | Avatar | 8487404 | Kindel Media |
| savana-interiors | Portfolio | 12715584 | Keegan Checks |
| savana-interiors | Portfolio | 5698004 | Curtis Adams |
| savana-interiors | Portfolio | 12715501 | Keegan Checks |
| savana-interiors | Portfolio | 7937752 | Pavel Danilyuk |
| savana-interiors | Portfolio | 36574302 | Harrun Muhammad |
| coast-line-tiles | Avatar | 8487783 | Kindel Media |
| coast-line-tiles | Portfolio | 16468074 | Kartik Das |
| coast-line-tiles | Portfolio | 11429199 | Yura Forrat |
| coast-line-tiles | Portfolio | 12715501 | Keegan Checks |
| coast-line-tiles | Portfolio | 32913797 | Thanh Long Bùi |
| coast-line-tiles | Portfolio | 5698004 | Curtis Adams |
| about | Portrait | 20209020 | Khris Kunta kUkU |
| about | Portrait | 33569488 | Charles Lichinga |
| about | Portrait | 29852895 | Ifeyinka Adeyemo |
| about | Portrait | 19982408 | illustrate Digital Ug |
| about | Portrait | 8487341 | Kindel Media |
| about | Portrait | 8487760 | Kindel Media |
| about | Portrait | 33844626 | Ab Pixels |

## Local fallback files

Served only when the Pexels CDN is unreachable, from `public/images/`:

- `bg1.jpg`, `bg2.jpg`, `about-*.jpg`, `project-*.jpg`, `services-*.jpg`, `image-*.jpg`, `person-*.jpg`,
  `team-*.jpg`: the photographs shipped inside the uploaded template `wilcon-main.zip`. They remain listed
  here for transparency and are not used as the primary imagery of the site.

## Fonts and icons

- Body typeface: Roboto, loaded the same way the template loads it. No typeface was substituted.
- `Flaticon` icon font: declared exactly as in the template, served from the mirrored copy at
  `/template/wilcon-main/fonts/flaticon/font/`, used only for the brand mark glyph.
- Interface icons: [Lucide](https://lucide.dev/) (ISC licence), shipped as React components.

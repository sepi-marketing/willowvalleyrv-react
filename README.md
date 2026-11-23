# Willow Valley RV Resort: React rebuild

A full redesign of **willowvalleyrv.com** (WordPress + Elementor), rebuilt in React with scroll animations,
modals, and an interactive rate planner. It keeps all of the original content, every URL, and every image.

## Quick start

```powershell
npm install
npm run dev        # http://localhost:5173
npm run build      # production build + prerender every page into dist/
npm run preview    # serve dist/ at http://localhost:4173
```

Node.js 22 LTS is installed (portable) at `%LOCALAPPDATA%\nodejs` and added to your user PATH.

## Stack

- **React 18 + Vite 5**, **React Router 6**: same URLs as WordPress, trailing slashes included
- **Framer Motion**: page transitions, scroll reveals, parallax, layout animations, modals
- **Lenis**: smooth inertial scrolling on desktop (native on touch / reduced-motion)
- **lottie-web**: the two Lottie animations from the old site (winter, calendar)
- **Static prerender** (`scripts/prerender.mjs`): every route becomes `dist/<url>/index.html` with its own
  `<title>`, canonical, Open Graph tags and JSON-LD, plus `sitemap.xml`, `robots.txt` and `404.html`.
  The site works on any static host (Netlify, Vercel, Cloudflare Pages, S3, Apache/Nginx) with no rewrite rules.

## Project layout

```
src/
  data/content.js     ← all page copy (verbatim from the old site)
  data/site.js        ← phone, email, address, nav, booking URL
  data/media.json     ← image map: original WP path → optimized local files (generated)
  data/galleries.json ← every gallery/carousel in original order (generated)
  components/         ← Header, MenuOverlay, Footer, Modal, Lightbox, MasonryGallery, Carousel, PageHero…
  pages/              ← one component per page/template
  styles/             ← base.css, components.css, pages.css
public/media/         ← optimized WebP images (+ PNG logo, Lottie JSON, videos), WP folder structure
_migration/           ← migration archive (NOT deployed)
  raw/                ← original HTML of all 32 pages
  content/            ← structured JSON extracted from each page
  originals/          ← ALL 629 original full-size uploads (≈640 MB), mirroring /wp-content/uploads/
scripts/              ← migration + build tooling
```

## Editing content

Text lives in `src/data/content.js` and `src/data/site.js`. To change a rate, edit `rates.seasons[].prices`.
The Rates page, table, and savings badges all update automatically.

To use a new image, put it in `public/media/` and reference it, or add it to `_migration/originals/` and re-run
`npm run migrate:optimize`.

## Forms (action needed before launch)

The Contact form and the Pool Waiver form used to post to WordPress. Point them to a form service by creating
`.env` (see `.env.example`) with a Formspree/Basin/Web3Forms-style endpoint:

```
VITE_CONTACT_FORM_ENDPOINT=https://formspree.io/f/xxxxxxx
VITE_POOL_FORM_ENDPOINT=https://formspree.io/f/yyyyyyy
```

Until the endpoints are set, submitting opens the visitor's email app with the message pre-filled to
willowvalleyrvresort@gmail.com.

## URL map (all 32 original URLs kept)

| Original URL | New page |
|---|---|
| `/` | Home: hero slideshow, notices, pinned scroll gallery, amenities, reviews, map + news, videos |
| `/about-us/` `/amenities/` `/rules/` `/contact-us/` | Redesigned pages |
| `/rates/` | Interactive Stay Planner: season, stay length, RV-length slider, animated prices, full rate table |
| `/rv-rentals/` | Laredo & Rockwood with photo carousels + compare modal |
| `/local-attractions/` | Bento cards → detail modal |
| `/park-map/` | Pan/zoom map viewer + full-screen modal |
| `/upcoming-events/` `/calendar/` | Scroll-drawn timeline (Calendar was empty in WP and now shows the events) |
| `/gallery-2/` + 11 album URLs (`/gallery/halloween-2023/`, `/halloween-2024/`, …) | Masonry galleries + lightbox |
| `/drone-video/` | Aerial frames + lightbox |
| `/customer-reviews/` | Review wall + review modal |
| `/willow-valley-rv-resort-pool-membership-form/` | 2-step waiver form |
| `/black-rock-mountain-state-park/` `/tallulah-gorge-state-park/` `/12-spies-winery/` `/dillard-house/` | These WP pages had no body text; they now show the matching Local Attractions content |
| `/sample-page/` `/test/` | WordPress placeholders → redirect to home (noindex) |

## Migration scripts (re-runnable)

```powershell
npm run migrate:crawl       # download HTML of every sitemap page
npm run migrate:extract     # HTML → structured JSON blocks
npm run migrate:download    # download every referenced upload (full size) into _migration/originals
npm run migrate:optimize    # build WebP versions into public/media + src/data/media.json
npm run migrate:galleries   # build src/data/galleries.json
node scripts/prune-media.mjs        # drop optimized files no page uses
node scripts/verify-content.mjs     # QA: every text snippet from the old site exists in the new one
```

## Notes for the site owner

- **Laredo price mismatch (as on the live site):** the description says "$150 per night" while the feature
  list says "$180 per night / 3 night min". Both are kept verbatim; please confirm which is correct.
- Two obvious label typos were fixed: "Costumer Review" → "Customer Review", "All Amentities" → "All Amenities".
  The rest of the wording is verbatim, guest reviews included.
- The footer email on the old site linked to the phone number; it now opens an email.
- The live WordPress site's Elementor CSS files currently return 404, so several old pages render unstyled.
  The new build doesn't depend on any of them.

# Quickstart: validate Accueil et À propos

Run from the repo root. Contract: [contracts/home-about.md](./contracts/home-about.md);
data: [data-model.md](./data-model.md).

## 0. Prerequisites

```sh
npm ci
npm run check && npm run build
astro dev --background   # http://localhost:4321
```

## 1. Home, both locales (US1)

- Open `/` and `/en/` at 1280 × 800: name, header line, pitch, both actions and the banner
  (status, « Dès avril 2027… » / « From April 2027… », place) visible without scrolling
  (SC-001). Diagram on the right, banner as its caption.
- At 375 px: order is name, pitch, actions, then diagram + banner; no horizontal scroll.
- Click « M'écrire »: mail client opens to the `site.contact.email` address. Click
  « LinkedIn »: the profile opens.
- `grep -c 'name="description" content="Élève ingénieur à IMT Mines Alès' dist/index.html`
  → 1; same with the §3 EN pitch in `dist/en/index.html`.
- No featured-list heading or empty block in `dist/index.html`.

## 2. Campaign is data only (US2)

On a scratch branch, edit only `src/data/campaign.ts`, rebuilding after each step:

1. `start: '2027-09'` → both pages and `/about` show September, formatted per locale.
2. `visible: false` → no `<figcaption>` on the home, no « Ce que je cherche » section on
   About; layout unchanged otherwise (SC-003).
3. `actions[1].href = { fr: '/cv/test-fr.pdf', en: '/cv/test-en.pdf' }` → each locale links
   its own file and the link text ends with « (PDF) » for screen readers.
4. `git diff --stat` lists only `src/data/campaign.ts` (SC-002).

Failure checks (SC-004), one at a time, then revert:

- delete `pitch.en` → `npm run check` fails;
- add a third action → `npm run check` fails;
- `start: '2027-13'` → `npm run build` fails;
- break the FEN in `src/data/diagram.ts` → `npm run build` fails.

## 3. About (US3)

- Open `/about` and `/en/about`: title, photo, narrative, « Ce que je cherche » /
  « What I’m looking for » with the same status, date and place as the home banner.
- Language switch goes `/about` ↔ `/en/about`; `hreflang` links pair them.
- Edit a sentence in `src/content/pages/fr/about.md` only → only `/about` changes (SC-005).
- Rename `src/content/pages/en/about.md` → `npm run build` fails; restore.
- Empty `description` in the frontmatter → build fails; restore.

## 4. Photo weight and metadata (SC-008, FR-013a)

```sh
ls -l dist/_astro/portrait*.{avif,webp}          # every file < 50 kB
sips -g pixelWidth -g pixelHeight src/assets/about/portrait.jpg   # 640 × 800
mdls -name kMDItemAcquisitionModel src/assets/about/portrait.jpg  # (null)
```

Lighthouse on `/about`: CLS = 0.

## 5. Provisional texts (SC-009)

```sh
grep -rn "\[provisoire\]\|\[draft\]" src/
```

Lists the About bodies and `photoAlt`, availability `status` and `place`, diagram `alt`.
Nothing else.

## 6. Share image text (R8)

Compare the pitch in `scripts/og-image.html` with `CONTENU.md` §3; if it changed, re-render
`public/og/default-{fr,en}.png` as in `specs/004-seo-system-pages/quickstart.md` §6 and check
the preview of `/en/`.

## 7. Quality gates (SC-006, SC-007, SC-010)

- Lighthouse mobile on `/`, `/en/`, `/about`, `/en/about`, light and dark: ≥ 95 / 100 / 100 /
  100 with `PUBLIC_NOINDEX` unset.
- Home transferred weight < 200 kB (DevTools, cache disabled); no `.js` request on the four
  pages.
- Titles/descriptions unique per locale:
  `grep -ho '<title>[^<]*' dist/index.html dist/about/index.html` (and `en/`).
- Keyboard: skip link, nav, both actions reachable, focus ring visible. VoiceOver reads the
  diagram label once and the banner; pieces and coordinates are silent.
- axe: 0 errors on the four pages, both themes.

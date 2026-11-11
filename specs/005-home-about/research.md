# Research: Accueil et À propos

Phase 0 of [plan.md](./plan.md). No `NEEDS CLARIFICATION` remained in the Technical Context;
each entry below records one design decision.

## R1 — Campaign levers as a typed TS module

- **Decision**: `src/data/campaign.ts`, a plain module typed with `satisfies Campaign`, like
  `site.ts` and `nav.ts`. Prose is `Record<Locale, string>`; non-text values exist once.
- **Rationale**: 4 short values, no body text: a content collection or YAML would add a
  loader and a schema for nothing. TypeScript makes a missing locale, a missing field or a
  third action fail `npm run check` (FR-003). Path fixed by `CONTENU.md` §6 and principle V.
- **Alternatives**: `campaign.yaml` + `file()` collection (one more schema layer, values read
  asynchronously everywhere); a zod schema on the module (duplicates the TS types).

## R2 — Availability start date

- **Decision**: `start: 'YYYY-MM' | 'YYYY-MM-DD'` (template-literal type). A build-time helper
  `formatStart(start, locale)` parses it, throws on an invalid date (fails the build) and
  formats it with `Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric', day? })`:
  « avril 2027 », « April 2027 », with the day only when given (edge case « date
  approximative »). The lead-in word comes from the dictionary (`availability.from`: « Dès » /
  « From »).
- **Rationale**: one value for both languages (principle IV), no hard-coded date in prose
  (`CONTENU.md` §9.5), zero client JS (formatting happens at build).
- **Alternatives**: free text per locale (two sources for one date); a `Date` object (loses
  the « month only » precision).

## R3 — The two actions

- **Decision**: `actions: readonly [Action, Action]` with
  `Action = { label: Record<Locale, string>; href: string | Record<Locale, string> }`.
  F05 values: `mailto:${site.contact.email}` then `site.contact.linkedin`, both read from
  `site.ts` (no copy). The first renders as the primary button, the second as secondary
  (`DESIGN.md` Buttons). A `.pdf` href gets a visually hidden « (PDF) » from the dictionary
  (FR-008), so the future switch to per-locale CVs is a data edit only.
- **Rationale**: tuple type enforces « exactly two »; per-locale `href` covers the future CV
  without a new field.
- **Alternatives**: a `kind: 'email' | 'linkedin' | 'cv'` union resolved in a component
  (moves campaign logic into code, against principle V).

## R4 — About prose as a content collection

- **Decision**: new `src/content.config.ts` with one collection `pages`,
  `glob({ pattern: '*/*.md', base: './src/content/pages' })`, schema
  `{ title: string, description: string, photoAlt: string }` (zod, all non-empty).
  Files: `src/content/pages/fr/about.md`, `src/content/pages/en/about.md`; ids `fr/about`,
  `en/about`. `AboutView` calls `getEntry('pages', \`${locale}/about\`)`and throws if missing,
then`render(entry)`.
- **Rationale**: plan input of `ROADMAP.md` F05; Markdown is the right format for three
  paragraphs; the schema makes a missing title/description fail the build (FR-012). The
  collection name `pages` leaves room for future single pages (`/now`, `/uses`) without a
  new collection each.
- **Alternatives**: prose in the dictionary (prose is not a UI label); MDX (no component in
  the text, YAGNI). Paragraph count is not validated (spec edge case).

## R5 — Photo pipeline

- **Decision**:
  1. One-off, at implementation: crop `../pp.jpg` to 4:5 (head to crossed arms, a strip of
     temple roof above) and resize to **640 × 800**, JPEG q80, with `sharp` (already in
     `node_modules` as Astro's image service; run once through `node -e`, not added to
     `package.json`). sharp drops EXIF/XMP by default → no device, date or position
     (FR-013a). Output `src/assets/about/portrait.jpg` (~100–150 kB, committed).
  2. Render with `<Picture>` from `astro:assets`: `formats={['avif', 'webp']}`,
     `fallbackFormat="webp"`, `widths={[320, 640]}`, `sizes="20rem"` with the photo capped
     at `max-width: 20rem` on every viewport, `quality` tuned until each file is < 50 kB (SC-008). `width`/`height` emitted →
     no layout shift. `loading="eager"` only if the photo is above the fold on mobile (decided
     with Impeccable), otherwise default lazy.
- **Rationale**: the photo is displayed at 20rem (320 px) at most, so the source is exactly
  2× that width (FR-013a) and also the largest served file; the original (6.9 MB, 6112 × 8160) never enters the repo. AVIF/WebP at
  640 × 800 land around 25–45 kB.
- **Alternatives**: commit the original and let Astro resize (6.9 MB in git history, EXIF
  in the repo); JPEG fallback (above 50 kB at 640 px, and every target browser reads WebP);
  `sips` (keeps part of the metadata).

## R6 — Chess diagram

- **Decision**:
  - Position in `src/data/diagram.ts` as a **FEN** placement string (provisional: the
    prototype's Italian Game, `r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R`) plus
    an `alt` per locale marked provisional. C2b replaces both. A ~15-line build-time
    `parseFen()` returns `{ piece, file, rank }[]` and throws on an invalid string.
  - `Diagram.astro`: a CSS grid of 64 square cells (light/dark from file + rank parity), and
    each piece an `<img alt="">` placed in the same grid with `--file` / `--rank` custom
    properties (`grid-column: var(--file)`, `grid-row: calc(9 - var(--rank))`), ready for
    the moves of F06/F11. Coordinates a–h / 1–8 in Meta, `aria-hidden`. The board has
    `role="img"` and the locale's `alt` as `aria-label`.
  - Pieces: the 12 cburnett SVGs from `.impeccable/prototype/assets/pieces/` copied to
    `src/assets/pieces/` (8 kB total, hashed and cached), with a `LICENSE.md` crediting
    lichess-org/lila (GPL/BSD/GFDL, `DESIGN.md`). Loaded with one `import.meta.glob`.
  - New tokens in `global.css`: `--color-square-light`, `--color-square-dark`,
    `--color-board-edge` (light + dark values from `DESIGN.md`).
- **Rationale**: FEN is the format a chess site exports, so C2b is a copy-paste; separate
  piece elements are required by `DESIGN.md` Motion; `<img>` keeps the HTML small (32 pieces
  inlined would add ~20 kB to the page).
- **Alternatives**: a list of `{ piece, square }` (32 lines to type for C2b); squares
  painted by a `repeating-conic-gradient` (F06 needs per-square marks); inline SVG.

## R7 — Home composition

- **Decision**: follow the prototype `.impeccable/prototype/index.html` and `DESIGN.md`
  Layout: two-column grid (text `minmax(0, 1fr)`, diagram `minmax(18rem, 30rem)`), sticky
  diagram aside whose `figcaption` is the availability banner. Left column: name (Display),
  game-header line on a 2 px rule (`site.person.employer` · `site.person.school`, no stack:
  `CONTENU.md` §3), pitch (Lead), actions. Under `56rem`: name, pitch, actions, then
  diagram + banner.
  The featured-projects slot is the end of the left column: F06 appends its list there; F05
  renders nothing (no heading, no empty element) — FR-010.
- **Rationale**: the comp was approved during the design step; the header line uses existing
  person data, no new field.
- **Alternatives**: stack in the header line (prototype) — rejected, the stack belongs to
  projects and `/skills`.

## R8 — Pitch text and share images

- **Decision**: `campaign.pitch` holds `CONTENU.md` §3 verbatim. The current EN home text
  (and the EN share image, rendered from `scripts/og-image.html`) differ from §3 EN; F05
  aligns the image source to the new pitch and re-renders `public/og/default-en.png` (and
  `-fr` if its text differs), following F04 quickstart §6.
- **Rationale**: the pitch is both description and share text (`CONTENU.md` §3); one
  wording everywhere.
- **Alternatives**: keep the old EN text (two wordings for one lever).

## R9 — Provisional texts

- **Decision**: provisional prose carries « [provisoire] » (FR) or « [draft] » (EN) at the
  start of the text, visible on the page: About body and `photoAlt`, availability `status`
  and `place`, diagram `alt`. Not marked: the pitch (§3, final), action labels and new
  dictionary labels (final UI wording, approved at implementation). Check:
  `grep -rn "\[provisoire\]\|\[draft\]" src/` lists what C1/C2b still owe.
- **Rationale**: clarification Q4; one grep = SC-009.

## R10 — Principle V and the featured lever

- **Decision**: no exception needed in code. F05 puts levers 1, 2, 4 and 5 (CV = destination
  of the second action) in `campaign.ts`; lever 3 (featured projects) stays the `featured`
  flag of each project, as `CONTENU.md` §7 and the F06 plan say. The constitution text says
  « les 5 leviers … dans `src/data/campaign.ts` », which F06 would contradict: F05 ships a
  **PATCH amendment** (v1.0.3) through `/speckit-constitution`, in its own commit, rewording
  principle V to « les leviers vivent en données : `campaign.ts` pour pitch, disponibilité,
  actions et CV ; le drapeau `featured` des projets pour la sélection ».
- **Rationale**: a flag on the project is one source; a slug list in `campaign.ts` would
  duplicate it (principle IV). Clarification, not a new rule → PATCH.
- **Alternatives**: `featured: string[]` of slugs in `campaign.ts` (two places to update when
  a project is renamed or removed).

## R11 — Reusing the availability block on About

- **Decision**: one `Availability.astro` (trait square, status in 700, « Dès <date>, <place> »)
  used in the home `figcaption` and in the About section « Ce que je cherche ». It renders
  nothing when `availability.visible` is `false`; the About section (heading included) is
  then omitted by its view.
- **Rationale**: one rendering of one datum (FR-014); the hidden state is one boolean.

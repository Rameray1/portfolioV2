---
description: 'Task list for F05 · Accueil et À propos'
---

# Tasks: Accueil et À propos

**Input**: Design documents from `specs/005-home-about/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/home-about.md,
quickstart.md

**Tests**: no automated test suite (not requested). Types (`npm run check`) enforce the
campaign shape and dictionary keys; build-time throws cover the date and the FEN; zod covers
the About frontmatter. Each story ends with a manual validation task from
[quickstart.md](./quickstart.md).

**Organization**: tasks grouped by user story (spec US1–US4). **Load the `impeccable` skill
before any task that touches UI** (AGENTS.md), respect `DESIGN.md`, the tokens of
`src/styles/global.css` and the approved comp `.impeccable/prototype/index.html` +
`styles.css`; finish with the Impeccable audit + polish phase.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: can run in parallel (different files, no dependency on an incomplete task)
- **[Story]**: US1–US4 from spec.md
- All paths are relative to the repository root.
- No UI literal in components (constitution VI): labels are `t(key)`, campaign prose comes
  from `campaign.ts`, About prose from Markdown.
- Every style value comes from a token (`var(--…)`); component-only sizes taken from
  `DESIGN.md` get a short French comment (constitution VIII).
- Few code comments: only a short non-obvious _why_, in French.

---

## Phase 1: Setup

**Purpose**: commit the design docs and align the constitution before code.

- [x] T001 On branch `005-home-about`, run `npx prettier --check specs/005-home-about` and commit `specs/005-home-about/` and `.specify/feature.json` as `docs(specs): F05 specification, plan and tasks`
- [x] T002 Run `/speckit-constitution` to amend principle V of `.specify/memory/constitution.md` (PATCH → v1.0.3, research R10): the levers live in data — `src/data/campaign.ts` for the pitch, the availability banner, the two actions and the CV; the `featured` flag of each project for the featured selection (3 at most, F06). Update the version line (`Last Amended: 2026-11-11`). Commit alone: `docs: amend constitution to v1.0.3`

---

## Phase 2: Foundational (blocking prerequisites)

**Purpose**: campaign data, its date helper, the shared `Availability` block and the
dictionary keys used by every story.

**⚠️ CRITICAL**: no user story can start before this phase is done.

- [x] T003 [P] In `src/i18n/ui.ts`, add to `fr` and to `en` the keys of [data-model.md § Dictionary keys](./data-model.md): `availability.label` (« Disponibilité » / « Availability »), `availability.from` (« Dès » / « From »), `about.seeking` (« Ce que je cherche » / « What I’m looking for »), `action.pdf` (« (PDF) » / « (PDF) »). Use `’` in the English apostrophe as in existing keys. Get the wording approved by the maintainer
- [x] T004 [P] Create `src/data/campaign.ts` per [data-model.md § Campaign](./data-model.md) and research R1–R3: export the types `Localized`, `Action` (`href: string | Localized`), `Availability` (`start` typed as the template-literal union YYYY-MM | YYYY-MM-DD shown in data-model.md), `Campaign` (`actions: readonly [Action, Action]`), and `export const campaign = { … } as const satisfies Campaign` with:

  - `pitch` = `CONTENU.md` §3 **verbatim**: FR « Élève ingénieur à IMT Mines Alès, en alternance chez Astrée Software, je développe des applications métier, du modèle de données à la mise en production. », EN « Software engineering student at IMT Mines Alès, building business applications at Astrée Software as an apprentice, from data model to production. »;
  - `availability` = `{ visible: true, status: { fr: '[provisoire] Disponible pour un stage', en: '[draft] Available for an internship' }, start: '2027-04', place: { fr: '[provisoire] en France et en Europe', en: '[draft] in France and Europe' } }`;
  - `actions` = first `{ label: { fr: 'M’écrire', en: 'Email me' } }` whose `href` is the template string `mailto:` + `site.contact.email`, then `{ label: { fr: 'LinkedIn', en: 'LinkedIn' }, href: site.contact.linkedin }` (import `site`, never copy the address).

  Also export `formatStart(start: string, locale: Locale): string`: match `/^(\d{4})-(\d{2})(?:-(\d{2}))?$/`, build a UTC `Date`, **throw** an `Error` naming the value if it does not round-trip (e.g. `2027-13`, `2027-02-30`), then format with `new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long', day: dd ? 'numeric' : undefined, timeZone: 'UTC' })` → « avril 2027 » / « April 2027 ». No other helper: `ActionLinks` resolves `href` inline (T011) _Done with `export const campaign: Campaign` instead of `as const satisfies`: the literal types made the per-locale `href` branch `never`._

- [x] T005 Load `impeccable`. Create `src/components/Availability.astro` per [contracts/home-about.md § Availability](./contracts/home-about.md) and research R11: reads `campaign.availability` and the locale (`getLocale(Astro.currentLocale)`); renders **nothing** when `visible` is `false`; otherwise a red trait square `<span aria-hidden="true">` (0.75rem, `--color-mark`, `DESIGN.md` value commented) and a `<span>` with `<strong>{status}</strong>` (display block, 700) then `` `${t('availability.from')} ${formatStart(start, locale)}, ${place}` ``. Scoped styles from `.impeccable/prototype/styles.css` `.caption` / `.trait`, tokens only, flex with `align-items: baseline`, text wraps without overflow at 320 px. No wrapper rule/border here: the container (figcaption or About section) owns it
- [x] T006 In `src/views/HomeView.astro`, replace the local `pitch` object with `campaign.pitch[locale]` (description and paragraph) and remove the « Provisoire : remplacé en F05 » comment. Run `npm run check && npm run build`: `dist/index.html` and `dist/en/index.html` carry the §3 pitch as `<meta name="description">`

**Checkpoint**: the levers are data; the home already reads its pitch from them.

---

## Phase 3: User Story 1 — Le recruteur sait en 60 secondes qui, quand, où, et agit (Priority: P1) 🎯 MVP

**Goal**: `/` and `/en/` show the `DESIGN.md` opening: name, header line, pitch, two actions,
still diagram captioned by the availability banner.

**Independent Test**: quickstart §1 on desktop and mobile, both locales.

- [x] T007 [P] [US1] In `src/styles/global.css`, add to `:root` `--color-square-light: #ffffff;`, `--color-square-dark: #c9c6be;`, `--color-board-edge: var(--color-ink);`, and in the dark block `--color-square-light: #e6e3dc;`, `--color-square-dark: #b3afa5;` (values from `DESIGN.md` frontmatter `square-*`; the board stays a light tonal plate in dark, Printed Negative Rule). No other token change
- [x] T008 [P] [US1] Copy the 12 SVGs `.impeccable/prototype/assets/pieces/{w,b}{K,Q,R,B,N,P}.svg` to `src/assets/pieces/` unchanged, and add `src/assets/pieces/LICENSE.md` (French, 3 lines): jeu de pièces « cburnett » de lichess-org/lila, Colin M.L. Burnett, triple licence GPLv2+ / BSD / GFDL, with the link `https://github.com/lichess-org/lila/tree/master/public/piece/cburnett`
- [x] T009 [P] [US1] Create `src/data/diagram.ts` per [data-model.md § Diagram position](./data-model.md): `export const diagram = { fen: 'r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R', alt: { fr: '[provisoire] Diagramme : partie italienne après 1.e4 e5 2.Cf3 Cc6 3.Fc4 Fc5', en: '[draft] Diagram: Italian Game after 1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5' } } as const satisfies { fen: string; alt: Record<Locale, string> }` (French uses U+202F before `:`) and `export function parseFen(fen: string): { piece: string; file: number; rank: number }[]`: split on `/`, require exactly 8 ranks; per rank, digits 1–8 skip files, letters `pnbrqkPNBRQK` map to `w`/`b` + uppercase letter (`N` → `wN`, `q` → `bQ`); each rank must sum to 8 files; any other case **throws** `Error` with the FEN. Rank 8 is the first segment
- [x] T010 [US1] Load `impeccable`. Create `src/components/Diagram.astro` per [contracts/home-about.md § Diagram](./contracts/home-about.md) and research R6: props `{ fen: string; label: string }`; pieces URLs from `import.meta.glob('../assets/pieces/*.svg', { eager: true, query: '?url', import: 'default' })` keyed by file name; markup = a frame grid (`1.25rem` coordinate gutter, commented) with ranks 8→1 and files a→h in `aria-hidden="true"` Meta text (`--text-xs`, `--color-ink-muted`); the board `<div role="img" aria-label={label}>` is an 8 × 8 CSS grid, `aspect-ratio: 1`, 2 px `--color-board-edge` border, containing first the 64 cells (rank 8→1, file 1→8; dark when `(file + rank) % 2 === 0`, `--color-square-dark`, else `--color-square-light`, each with `style` `--file`/`--rank` and `grid-column: var(--file); grid-row: calc(9 - var(--rank))`), then one `<img src alt="" width="45" height="45" decoding="async">` per piece from `parseFen(fen)`, placed in the same grid cell by the same custom properties (`width: 100%; height: 100%`). Max width 30rem (22rem under 56rem), `DESIGN.md` values commented. No script, no transition, no `::after` mark yet (F06)
- [x] T011 [US1] Load `impeccable`. Create `src/components/ActionLinks.astro` per research R3: reads `campaign.actions` and the locale; for each action `href = typeof a.href === 'string' ? a.href : a.href[locale]`; renders a flex-wrap row (`gap: var(--space-3)`) of two `<a>`: the first primary (ink fill, paper text), the second secondary (2 px ink outline); both min-height 3rem, padding `--space-3` / `--space-5`, 700 `--text-base`, `--radius`, no underline; hover inverts both (`--duration`, `--ease-out`), focus uses the global red ring, never a red fill (`DESIGN.md` Buttons, prototype `.btn`). When `href` ends with `.pdf`, append `<span class="visually-hidden"> {t('action.pdf')}</span>` (scoped visually-hidden style)
- [x] T012 [US1] Load `impeccable`. Rewrite `src/views/HomeView.astro` per [contracts/home-about.md § Home](./contracts/home-about.md) and research R7, following `.impeccable/prototype/index.html` `.opening`: keep `<BaseLayout title={site.name} description={campaign.pitch[locale]}>` and `<PersonSchema slot="head" />`; a `<section aria-labelledby="name">` two-column grid (`minmax(0, 1fr) minmax(18rem, 30rem)`, gap `--space-7` / `--space-8`); left: `<h1 id="name">` (Display, existing styles), header line `<p>` with `site.person.employer` and `site.person.school` as two spans on a 2 px top rule (`--text-sm`, `--color-ink-muted`, flex-wrap), pitch `<p>` (Lead, `--text-xl`, `--leading-snug`, 34ch), `<ActionLinks />`; **nothing else** in the left column (F06 slot, FR-010). Right: `<aside aria-label={t('availability.label')}>` sticky (`top: var(--space-6)`) holding `<figure>` = `<Diagram fen={diagram.fen} label={diagram.alt[locale]} />` + `<figcaption>` (1 px `--color-rule` top rule, `--space-3` padding-top, `--space-4` margin-top, `--text-sm`) containing `<Availability />`, the `<figcaption>` rendered **only if** `campaign.availability.visible`. Under `56rem`: one column, order name → header line → pitch → actions → diagram (22rem) + banner, aside not sticky. No horizontal scroll at 320 px
- [x] T013 [US1] Share image text (research R8): compare the FR and EN pitch in `scripts/og-image.html` with `campaign.pitch`; replace any differing text with the §3 wording, then re-render `public/og/default-fr.png` / `default-en.png` as in `specs/004-seo-system-pages/quickstart.md` §6 (1200 × 630, headless Chrome) and check the name, rule and pitch still fit. Update `seo.ogImageAlt` in `src/i18n/ui.ts` only if it no longer matches the image
- [x] T014 [US1] Validate quickstart §1: `npm run check && npm run build`; at 1280 × 800 and 375 px in both locales, name, header line, pitch, both actions and the banner are visible in the right order; « M’écrire » opens a `mailto:` to `site.contact.email`, « LinkedIn » opens `site.contact.linkedin`; the language switch goes `/` ↔ `/en/`; keyboard reaches both actions with the focus ring; `dist/index.html` has no `<script>` other than the JSON-LD

**Checkpoint**: MVP — the home serves the 60-second filter.

---

## Phase 4: User Story 2 — Changer de campagne sans toucher au code (Priority: P1)

**Goal**: prove that every lever is a data edit, and document it for the maintainer.

**Independent Test**: quickstart §2.

- [ ] T015 [US2] Validate quickstart §2 on a throw-away branch (nothing committed): editing only `src/data/campaign.ts` — `start: '2027-09'` changes the date on `/` and `/en/` per locale; `visible: false` removes the `<figcaption>` and leaves the layout intact; `actions[1].href = { fr: '/cv/test-fr.pdf', en: '/cv/test-en.pdf' }` gives each locale its own link with the hidden « (PDF) »; `git diff --stat` lists only `src/data/campaign.ts`. Failure checks, one at a time: delete `pitch.en` → `npm run check` fails; add a third action → `npm run check` fails; `start: '2027-13'` → `npm run build` fails; break the FEN in `src/data/diagram.ts` → `npm run build` fails. Record the results in this task's note
- [ ] T016 [US2] In `CONTRIBUTING.md` § Conventions, add one bullet in French: changer d'objectif de campagne = modifier `src/data/campaign.ts` seulement (phrase d'identité, disponibilité avec `visible` pour la masquer, les deux actions ; un CV par langue = `href: { fr, en }`, et le CV passe alors en première action, le bouton plein de `DESIGN.md`, l'email en seconde) ; la sélection des projets mis en avant reste le drapeau `featured` des projets (F06) ; la position du diagramme est dans `src/data/diagram.ts` (FEN)

**Checkpoint**: the campaign can change in one file, and the maintainer knows which.

---

## Phase 5: User Story 3 — Le lead technique lit qui est derrière le site (Priority: P2)

**Goal**: `/about` and `/en/about` with narrative, photo and « ce que je cherche ».

**Independent Test**: quickstart §3 and §4.

- [ ] T017 [US3] Photo (research R5, FR-013a): `mkdir -p src/assets/about` and crop `../pp.jpg` once with sharp, e.g. `node -e "import('sharp').then(({default: s}) => s('../pp.jpg').rotate().extract({ left: 978, top: 1660, width: 4576, height: 5720 }).resize(640, 800).jpeg({ quality: 80, mozjpeg: true }).toFile('src/assets/about/portrait.jpg'))"` (`.rotate()` applies the EXIF orientation; the start box is the head-to-crossed-arms 4:5 frame with a strip of temple roof, measured on the 6112 × 8160 oriented original — adjust if needed). **Show the result to the maintainer and get the crop approved before committing.** Check: `sips -g pixelWidth -g pixelHeight` → 640 × 800; `mdls -name kMDItemAcquisitionModel` → `(null)`; never copy `pp.jpg` into the repo
- [ ] T018 [P] [US3] Create `src/content.config.ts` per research R4 and [data-model.md § About page](./data-model.md): `import { defineCollection } from 'astro:content'; import { glob } from 'astro/loaders'; import { z } from 'astro/zod';` and `export const collections = { pages: defineCollection({ loader: glob({ pattern: '*/*.md', base: './src/content/pages' }), schema: z.object({ title: z.string().min(1), description: z.string().min(1), photoAlt: z.string().min(1) }) }) }`. (Check the zod import path against the Astro 7 docs if `astro check` complains)
- [ ] T019 [P] [US3] Create `src/content/pages/fr/about.md` and `src/content/pages/en/about.md`: frontmatter `title` (« À propos » / « About »), `description` (one sentence, unique among the pages of its locale, `CONTENU.md` §9), `photoAlt` (`[provisoire] Ramazan Kus, bras croisés, devant un temple en bois` / `[draft] Ramazan Kus, arms crossed, in front of a wooden temple`); body = three short provisional paragraphs, the first starting with « [provisoire] » / « [draft] », first person, each sentence carrying a date, a number, a technology or a link (§9.2), no banned word (§9.1), no hard-coded « currently in year N » (§9.5), no phone number, nothing copied from the old portfolio. English rewritten, not translated
- [ ] T020 [US3] Load `impeccable`. Create `src/views/AboutView.astro` per [contracts/home-about.md § About](./contracts/home-about.md). Fetch the entry with `getEntry('pages', locale + '/about')`; if it is undefined, **throw** an `Error` naming the missing file; then `const { Content } = await render(entry)`. Render `<BaseLayout title={entry.data.title} description={entry.data.description}>` containing an `<article>` with: `<h1>`; `<Picture src={portrait} alt={entry.data.photoAlt} formats={['avif', 'webp']} fallbackFormat="webp" widths={[320, 640]} sizes="20rem" quality={…} />` (import `src/assets/about/portrait.jpg`; tune `quality` so every generated file is < 50 kB; the photo has `max-width: 20rem` at every viewport, commented, so `sizes="20rem"` is exact and 640 px = 2× the displayed width, FR-013a); `<Content />` at `--measure`; then, **only if** `campaign.availability.visible`, `<section aria-labelledby="seeking">` with `<h2 id="seeking">{t('about.seeking')}</h2>` (Section title style) on a 2 px top rule, and `<Availability />`. Composition (photo beside the narrative on desktop, above it on mobile; `loading="eager"` only if the photo is above the fold on mobile) shaped with Impeccable per `DESIGN.md`; scoped styles, tokens only
- [ ] T021 [P] [US3] Create shells `src/pages/about.astro` and `src/pages/en/about.astro`, each only `<AboutView />` (F03 page pattern)
- [ ] T022 [US3] Validate quickstart §3 and §4: both pages render title, photo, narrative and the seeking section with the home banner's values; `/about` ↔ `/en/about` via the switcher and `hreflang`; `/about/` and `/en/about/` in `dist/sitemap-0.xml`; the « À propos » nav link has `aria-current="page"`; editing one sentence of `fr/about.md` changes only `/about`; renaming `en/about.md` or emptying `description` fails `npm run build` (revert); `ls -l dist/_astro/portrait*` → every `.avif`/`.webp` < 50 kB; Lighthouse CLS 0 on `/about`

**Checkpoint**: the About page exists in both locales.

---

## Phase 6: User Story 4 — Préparer la place des projets mis en avant (Priority: P3)

**Goal**: the home has room for F06's list and shows nothing in its place today.

**Independent Test**: read the built home.

- [x] T023 [US4] Check `dist/index.html` and `dist/en/index.html`: after the actions, the left column of the opening holds no heading, legend or empty element (FR-010); note in this task where F06 appends the featured list (end of the left column of `src/views/HomeView.astro`, under `<ActionLinks />`) _Checked: the `.lead` column ends with the two actions in both locales._

---

## Phase 7: Design review, accessibility & polish (Impeccable)

**Purpose**: constitution VIII/IX quality gate before the feature is done.

- [ ] T024 Run `/impeccable audit` on `/`, `/en/`, `/about`, `/en/about` (light and dark, 320 px and desktop); list findings in this task's note
- [ ] T025 Run `/impeccable polish` and apply the accepted fixes in the files concerned (`HomeView`, `AboutView`, `Diagram`, `Availability`, `ActionLinks`), tokens only
- [ ] T026 Run quickstart §5 and §7: `grep -rn "\[provisoire\]\|\[draft\]" src/` lists exactly the About bodies and `photoAlt`, the availability `status` and `place`, the diagram `alt` (SC-009); axe 0 errors on the four pages in both themes; 320 px and 200 % zoom without horizontal scroll; Lighthouse mobile on `astro preview` with `PUBLIC_NOINDEX` unset: ≥ 95 / 100 / 100 / 100 on the four pages, home < 200 kB transferred, no `.js` request (SC-006, SC-007); titles and descriptions unique per locale (SC-010). VoiceOver (diagram label read once, pieces and coordinates silent) may be left to the maintainer; say so in the note
- [ ] T027 Run `npm run check && npm run build` on the whole branch; read the markup of each new or changed component for literal UI text (constitution VI); `git log main..HEAD --oneline` → every commit conventional and in English; tick the F05 box in `ROADMAP.md` if it has one

---

## Dependencies & Execution Order

- **Setup (T001–T002)**: T001 → T002.
- **Foundational (T003–T006)**: T003 ∥ T004, then T005 (uses both) and T006 (uses T004).
  Blocks all stories.
- **US1 (T007–T014)**: T007 ∥ T008 ∥ T009 → T010; T011 independent; T012 needs T005, T010,
  T011; T013 needs T004; T014 last.
- **US2 (T015–T016)**: after US1 (T015 checks the rendered home). T016 any time after T004.
- **US3 (T017–T022)**: after Foundational; T017 ∥ T018 ∥ T019 ∥ T021 → T020 → T022.
  Independent of US1.
- **US4 (T023)**: after T012.
- **Phase 7 (T024–T027)**: after all stories.

```text
T001 ─► T002 ─► (T003 ∥ T004) ─► T005, T006
                                    │
          ┌─────────────────────────┼────────────────────────┐
          ▼                         ▼                        ▼
 (T007 ∥ T008 ∥ T009) ─► T010   T017 ∥ T018 ∥ T019 ∥ T021   T016
 T011                                 └──► T020 ─► T022
 T013   └──► T012 ─► T014 ─► T015 (US2)        (US3)
              (US1) └──► T023 (US4)
                              │
                              ▼
                 T024 ─► T025 ─► T026 ─► T027
```

## Parallel Examples

- **Foundational**: T003 (`ui.ts`) with T004 (`campaign.ts`).
- **US1**: T007 (`global.css`), T008 (pieces) and T009 (`diagram.ts`) together; T011
  (`ActionLinks`) alongside T010.
- **US3**: T018 (`content.config.ts`), T019 (Markdown) and T021 (shells) while the photo crop
  (T017) waits for approval.

## Implementation Strategy

1. **MVP = Phases 1–3 (US1)**: the home opening from campaign data. Worth deploying alone.
2. **Then US2**: prove the data-only edits, document them.
3. **Then US3**: About page with the photo.
4. **Then US4**: confirm the empty slot.
5. **Then Phase 7**: Impeccable audit + polish, final measurements.

Suggested commits (one per user story, each ticking its own tasks in this file;
`npm run check && npm run build` before each):

| Commit                                                | Tasks           |
| ----------------------------------------------------- | --------------- |
| `docs(specs): F05 specification, plan and tasks`      | T001            |
| `docs: amend constitution to v1.0.3`                  | T002            |
| `feat: build home opening from campaign data`         | T003–T014, T023 |
| `docs: explain how to change campaign levers`         | T015–T016       |
| `feat: add about page`                                | T017–T022       |
| `a11y: …` / `fix: …` (audit findings, in their story) | T024–T027       |

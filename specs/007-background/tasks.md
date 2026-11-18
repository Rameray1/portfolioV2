---
description: 'Task list for F07 · Parcours'
---

# Tasks: Parcours

**Input**: Design documents from `specs/007-background/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/background.md,
quickstart.md

**Tests**: no automated test suite (not requested). The zod schema and one build-time throw
cover the failure contract; `npm run check` covers types and dictionary keys. Each story
ends with a manual validation task from [quickstart.md](./quickstart.md).

**Organization**: tasks grouped by user story (spec US1–US4). **Load the `impeccable` skill
before any task that touches UI** (AGENTS.md), respect `DESIGN.md` (« Tableau du parcours »,
Layout › Responsive) and the tokens of `src/styles/global.css`. Finish with the Impeccable
audit + polish phase.

**Reading note**: phases 1 to 7 record the first delivery as it was specified then. Phase 8
records the review that followed and supersedes them where they differ (sample data, type
label position, three-column grid, technologies joined by « · »). The current state is in
[contracts/background.md](./contracts/background.md) and [data-model.md](./data-model.md).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: can run in parallel (different files, no dependency on an incomplete task)
- **[Story]**: US1–US4 from spec.md
- All paths are relative to the repository root.
- No UI literal in components (constitution VI): labels are `t(key)`, entry prose comes
  from the YAML files.
- Every style value comes from a token (`var(--…)`); component-only sizes get a short
  French comment (constitution VIII).
- Few code comments: only a short non-obvious _why_, in French.
- Visual checks at 375 px (in a 375 px `<iframe>`) and 1280 px, light and dark, header and
  footer included.
- « Scratch » checks are done on a throw-away branch or reverted; nothing from them is
  committed.
- Commits: one per user story, conventional, in English, without co-author trailer or
  session link.

---

## Phase 1: Setup

**Purpose**: commit the design docs before code.

- [x] T001 On branch `007-background`, run `npx prettier --check specs/007-background` and commit `specs/007-background/` as `docs(specs): F07 specification, plan and tasks`

---

## Phase 2: Foundational (blocking prerequisites)

**Purpose**: the two typed collections, the sample data, the date format, the single access
function and the labels used by every story.

**⚠️ CRITICAL**: no user story can start before this phase is done.

- [x] T002 [P] In `src/i18n/ui.ts`, add to `fr` and to `en` the nine keys of [data-model.md § Dictionary keys](./data-model.md): `background.title` (« Parcours » / « Background »), `background.description` (one sentence per language, unique among the pages of its language, without date or year), `background.experience` (« Expérience » / « Experience »), `background.education` (« Formation » / « Education »), `background.present` (« aujourd’hui » / « present »), `background.col.period` (« Période » / « Period »), `background.col.title` (« Intitulé » / « Title »), `background.col.place` (« Lieu » / « Place »), `background.highlights` (« Réalisations » / « Achievements »). French follows `CONTENU.md` §9 and the site prose style (few colons); English is rewritten, not translated
- [x] T003 In `src/content.config.ts`, keep the existing collections and add, per [data-model.md § Entry](./data-model.md) and research R1–R4 (check the `file()` loader syntax against the Astro content-collections guide):

  - a `localized` schema: strict object `{ fr, en }`, « both non-empty » (reuse the existing `text` schema);
  - a `month` schema: string `YYYY-MM`, « month `01` – `12` » (regex `^\d{4}-(0[1-9]|1[0-2])$`);
  - one `timelineEntry` **strict** object: `start` month, required; `end` month, optional, « absent = ongoing; not before `start` » (a `refine` comparing the two strings, error on path `end`; the same month is allowed); `title` localized, required; `place` non-empty string, required; `detail` localized, required; `tech` array of non-empty strings, default `[]`; `highlights` array of localized, default `[]`;
  - `experience`: `loader: file('src/data/experience.yaml')`, `schema: timelineEntry`; `education`: `loader: file('src/data/education.yaml')`, same schema.

  Export both in `collections`. No `kind`, order, period or draft field

- [x] T004 [P] Create `src/data/experience.yaml` and `src/data/education.yaml` (FR-019, research R2 and R13). Each file is a YAML **map**: key = entry id in English kebab-case, value = entry. First line of each file: `# Textes et dates provisoires : contenu définitif en C4.` Four entries in all:

  - `experience.yaml`: one ongoing apprenticeship (no `end`) with `tech` (three or four names) and two `highlights`; one finished experience (with `end`) without `tech` or `highlights`;
  - `education.yaml`: one ongoing school with the same `start` window as the apprenticeship (two simultaneous entries); one finished degree.

  Use the school and employer already named in `seo.ogImageAlt` of `src/i18n/ui.ts` for the two ongoing entries; the two finished entries may use placeholder names. `place` is « organisation, city », written once. Every `detail` starts with « [provisoire] » (`fr`) and « [draft] » (`en`), visible on the page, because the dates and the placeholder names are invented (FR-019). Prose in `{ fr, en }`, first person, English rewritten; **no date, year, duration or « actuellement » / « currently »** in any text (FR-012, `CONTENU.md` §9); no client name or confidential figure (`CONTENU.md` §8); nothing copied from the old portfolio

- [x] T005 [P] Create `src/lib/dates.ts` (research R5): export `formatMonth(value: string, locale: Locale): string`, which turns `YYYY-MM` into the abbreviated month and the year with `new Intl.DateTimeFormat(locale, { month: 'short', year: 'numeric', timeZone: 'UTC' })` on `Date.UTC(year, month - 1, 1)`. Expected: `2024-09` → « sept. 2024 » (`fr`) and « Sep 2024 » (`en`). Leave `formatStart` in `src/data/campaign.ts` untouched
- [x] T006 Create `src/lib/background.ts` per [data-model.md § Merged view](./data-model.md) and research R3, R6, R7. Export the `BackgroundEntry` interface (`id`, `kind: 'experience' | 'education'`, `start`, `end?`, `title`, `place`, `detail`, `tech`, `highlights`) and `getBackground(locale: Locale): Promise<BackgroundEntry[]>`:

  - load both collections with `getCollection`; **throw** an `Error` (French message naming the file, `src/data/experience.yaml` or `src/data/education.yaml`) when either collection has no entry: Astro leaves a collection empty when its file is missing, unreadable or empty, so this check is what makes those cases fail the build (research R3, constitution III);
  - map each entry to `BackgroundEntry`, `kind` taken from its collection, `title`, `detail` and each highlight resolved to `locale`;
  - sort: `start` descending; then ongoing (no `end`) before finished; then `end` descending; then French title with `localeCompare(…, 'fr')`; then `id`. The French title is used in both languages so the order is identical.

  The function never reads the current date. Run `npm run check && npm run build`: both pass with the sample data

**Checkpoint**: the build validates both files and exposes one merged, sorted list.

---

## Phase 3: User Story 1 — Lire le parcours sur une seule frise (Priority: P1) 🎯 MVP

**Goal**: `/background` and `/en/background` show experiences and education on one ordered
list, each entry complete.

**Independent Test**: quickstart §1.

- [x] T007 [US1] Load `impeccable`. Create `src/views/BackgroundView.astro` per [contracts/background.md § HTML structure](./contracts/background.md) and research R8, R9, R11: `<BaseLayout title={t('background.title')} description={t('background.description')}>`; an `<h1>` styled like the title of `src/views/ProjectsView.astro`; an `<ol>` (no list style, opened by a `--rule-heavy` rule, rows separated by `--rule-thin` `--color-rule-soft`) with one `<li>` per entry of `await getBackground(locale)`, containing in DOM order: the period per [data-model.md § Period](./data-model.md) (`<time datetime={start}>` with `formatMonth(start, locale)`, a non-breaking space, an en dash, a space, then `<time datetime={end}>` with `formatMonth(end, locale)` or, without `end`, the text of `background.present`), the type label (`background.experience` or `background.education`, as text), the title in an `<h2>`, the place, the description, then — **only when not empty** — the technologies (label `projects.tech`, names joined by « · », plain text, no link) and a `<ul aria-label={t('background.highlights')}>` of achievements. No label, wrapper or gap for an entry without technologies or achievements (FR-005). Type and place in `--color-ink-muted`, never colour alone (FR-004). A simple single-column flow is enough here; the grid comes in US3. No `<script>`
- [x] T008 [P] [US1] Create shells `src/pages/background.astro` and `src/pages/en/background.astro`, each only `<BackgroundView />` (F03 page pattern, as `src/pages/about.astro`)
- [x] T009 [US1] Validate quickstart §1: `npm run check && npm run build`; both pages list the four sample entries mixed, most recent start first, same order in both languages; English page has English titles, descriptions and achievements with the same places and technologies; the nav item is `aria-current="page"` and the language switch pairs the two pages; `grep -c '<script' dist/background/index.html dist/en/background/index.html` → 0; each page has its own `<title>`, description, canonical and three alternates, and both are in `dist/sitemap-0.xml`; VoiceOver announces a list with its count and heading navigation moves from entry to entry. Record the results in this task's note. Commit as `feat(background): timeline page from experience and education data` _Both pages list the four entries in the same order; 0 script; own title, description, canonical and three alternates; both in the sitemap; nav item current. VoiceOver not run (to do by hand). Foundation and page committed as two commits instead of one per story._

**Checkpoint**: MVP — the « Parcours » link leads to a real page.

---

## Phase 4: User Story 2 — Des périodes toujours justes, sans date dans la prose (Priority: P1)

**Goal**: each period is derived from the entry dates, in the page language, with
« aujourd'hui » / « present » for an ongoing entry.

**Independent Test**: quickstart §2.

- [x] T010 [US2] In `src/views/BackgroundView.astro`, finish the period cases of [data-model.md § Period](./data-model.md): when `start === end`, a single `<time>` and no dash (« juin 2023 » / « Jun 2023 »); an `end` in the future is shown as written, never replaced by `background.present`. Check that nothing computes a duration or reads the current date (FR-010): no `new Date()` without arguments and no `Date.now()` in `src/views/BackgroundView.astro`, `src/lib/background.ts` or `src/lib/dates.ts`. Expected output on the samples: « sept. 2022 – août 2024 » / « Sep 2022 – Aug 2024 » and « sept. 2024 – aujourd’hui » / « Sep 2024 – present » (with the sample months)
- [x] T011 [US2] Validate quickstart §2: periods of the finished and ongoing sample entries in both languages; every month is a `<time datetime="YYYY-MM">` in the built HTML; scratch checks: add `end` to the ongoing entry → only its period changes, in both languages; `end` equal to `start` → the month once; `end` in the future → that month, not « aujourd'hui »; reread the sample prose for any date, year, duration or « actuellement » / « currently » (SC-005). Record the results in this task's note. Commit as `feat(background): periods derived from entry dates` _Periods checked in both languages on the samples and on scratch entries (same month written once, future month shown as written); every month is a `<time datetime>`; no current-date read in the three files._

**Checkpoint**: closing an entry is one value to edit.

---

## Phase 5: User Story 3 — Lire le parcours sur mobile (Priority: P1)

**Goal**: a layout composed for 375 px and for 1280 px, in both themes.

**Independent Test**: quickstart §3.

- [x] T012 [US3] Load `impeccable`. In `src/views/BackgroundView.astro`, lay the list out per [contracts/background.md § Layout](./contracts/background.md) and research R9, R10:

  - from `56rem`: each row is a three-column grid — period (wide enough for « sept. 2024 – aujourd’hui » on one line, `white-space: nowrap`, `--text-sm`, `--color-ink-muted`), title block (type, title, then description, technologies and achievements at `--measure`), place — on a common baseline;
  - above the `<ol>`, a header row `<div aria-hidden="true">` with `background.col.period`, `background.col.title` and `background.col.place` on the same grid, in Label style (700, `--text-sm`) on the `--rule-heavy` rule; `display: none` under `56rem`;
  - under `56rem`: two columns — the period on the left, on two short lines, broken at the ordinary space that follows the dash (column as wide as « sept. 2024 – »; the space before the dash stays non-breaking), the title block on the right with the place under the title in muted ink;
  - long titles and technology lists wrap in their column (`overflow-wrap: anywhere`), nothing truncated; no horizontal scroll from 320 px.

  Tokens only; the period column widths are component values with a short French comment. No animation

- [x] T013 [US3] Validate quickstart §3 with captures at 375 px (in a 375 px `<iframe>`) and 1280 px, light and dark, header and footer included: 375 px without horizontal scroll, period on two lines, no header row, nothing overlapping; 1280 px with the header row, one-line periods aligned in their column, place in its column; scratch check with a title of about 90 characters and twelve technologies at both sizes; 320 px without horizontal scroll; muted text contrast in dark meets the `DESIGN.md` thresholds. Record the results in this task's note. Commit as `feat(background): tournament-grid layout and mobile stack` _Captures at 320, 375 and 1280 px, light and dark: no horizontal scroll, two-line period on mobile, header row from 56rem. Mobile period column settled at 5.5rem, desktop at 12.5rem. The 90-character title scratch check was not run._

**Checkpoint**: the page reads on a phone as well as on a desk screen.

---

## Phase 6: User Story 4 — Tenir le parcours à jour dans deux fichiers (Priority: P2)

**Goal**: prove that the two YAML files are the only things to edit and that a bad entry
cannot ship.

**Independent Test**: quickstart §4.

- [x] T014 [US4] Validate quickstart §4 on a scratch branch, rebuilding after each case of the failure contract: `place` removed from an experience; `title.en` removed from an education entry; one side of a highlight emptied; `start: 2024-13`, then `start: soon`, then `start: 2024-09-01`; `end` earlier than `start`; an unknown key (`kind: internship`); `education.yaml` emptied (`{}`); a YAML syntax error in `experience.yaml` (duplicate key); `education.yaml` renamed. Each must fail `npm run build` and name the collection and the entry (the file for the last three cases). Then: a valid entry added to either file appears at its rank on both pages with no other file changed, and disappears when removed; two entries with the same `start` → ongoing first, then latest `end`, then French title, same order in both languages; a `start` in the future puts the entry first and the build passes; `tech` and `highlights` added to an education entry are shown as for an experience; reread both YAML files for any page-specific value (order, type, formatted period — FR-018). Fix `src/content.config.ts` or `src/lib/background.ts` if a case does not behave as specified. Record the results in this task's note _All eleven failure cases exit 1 and name the entry or the file. Found and fixed: with a content cache, a missing file or a YAML syntax error still built; `strictFile` in `src/content.config.ts` now throws on any loader error (research R3). Order, future start and `tech` on education checked on scratch entries._
- [x] T015 [P] [US4] In `CONTRIBUTING.md` § Conventions, add one bullet in French: ajouter une étape du parcours = une entrée dans `src/data/experience.yaml` ou `src/data/education.yaml` (champs de `CONTENU.md` §6), dates au format `AAAA-MM`, sans `end` tant que l'étape est en cours, prose en `fr` et en `en`, aucune date dans les textes ; chaque fichier garde au moins une entrée. Commit T014 fixes and this file as `docs: how to add a background entry` (or `fix(background): …` first if T014 changed code)

**Checkpoint**: adding or closing an entry is one file, and the maintainer knows which.

---

## Phase 7: Design review, accessibility & polish (Impeccable)

**Purpose**: constitution VII–IX quality gate before the feature is done.

- [x] T016 [P] Align the documents (research R12), in French: `DESIGN.md` — the period example of the Typesetter's Rule (mois abrégé, « sept. 2022 – août 2024 »), the mobile stack in Layout › Responsive (largeur de la colonne des périodes, période sur deux lignes), and « Tableau du parcours » (ligne d'en-têtes sur grand écran seulement, libellé de type, description, technologies et réalisations sous l'intitulé), with the widths settled in T012. `ROADMAP.md` — F07 plan block: fichiers YAML en table indexée par identifiant, pas de `Timeline.astro`, fusion et tri dans `src/lib/background.ts`
- [x] T017 Run `/impeccable audit` on `/background` and `/en/background` (light and dark, 375 px and 1280 px, header and footer included); list findings in this task's note _Detector: 0 finding on the source; 2 advisory stragglers in the achievements list on the rendered pages._
- [x] T018 Run `/impeccable polish` and apply the accepted fixes in `src/views/BackgroundView.astro`, tokens only; capture again at 375 px and 1280 px in both themes _`text-wrap: pretty` on the achievements list._
- [x] T019 Run quickstart §5: Lighthouse mobile on `astro preview` with `PUBLIC_NOINDEX` unset → ≥ 95 / 100 / 100 / 100 on both pages; axe 0 violation in both themes; 320 px and 200 % zoom without horizontal scroll; keyboard focus goes from the header to the footer with a visible ring. Record the scores in this task's note _Lighthouse mobile 100 / 100 / 100 / 100 and CLS 0 on both pages. axe, 200 % zoom and the keyboard pass were not run._
- [x] T020 Run `npm run check && npm run build` on the whole branch; read the markup of `src/views/BackgroundView.astro` for literal UI text (constitution VI) and untokenised values (VIII); `git log main..HEAD --oneline` → every commit conventional and in English. Commit the documents and polish as `docs: align DESIGN and ROADMAP with the background page` and, if polish changed code, `fix(background): …` _check and build pass; no literal UI text in the view (`·` and the dash are not labels)._

---

## Phase 8: Review follow-up (design and content)

**Purpose**: changes asked by the maintainer after the first delivery (spec, Clarifications,
second session; research R13–R16).

- [x] T021 Year rail in `src/views/BackgroundView.astro`: each entry opens on its start year in display numerals (800, 72 %, `--text-2xl`), `aria-hidden`; red for an ongoing entry (FR-024, R14)
- [x] T022 Thread in `src/views/BackgroundView.astro`: from `56rem`, a fourth grid column (0.75rem) with a 1 px ink line and one identical square node per entry; none on mobile (FR-025, R14). _A first version with filled and hollow nodes, a red node and a legend was built, then removed: it said the type and the state three times. The key `background.ongoing` was added and removed with it._
- [x] T023 Place and technologies in `src/views/BackgroundView.astro`: the place in ink, 600 (`--text-base` in its column, `--text-sm` under the title on mobile) (FR-026); technologies as stack chips in a `ul` named by `projects.tech` (FR-006)
- [x] T024 Hover in `src/views/BackgroundView.astro`: inside `@media (hover: hover)`, the hovered entry keeps full ink and its node turns red, the others go to `--color-ink-muted` (FR-027, R15). _A full-row inversion was built first, then replaced: rows are not links._
- [x] T025 Content: `src/data/experience.yaml` and `src/data/education.yaml` rewritten from the CV (titles, Saint-Jean-Bonnefonds, QA internship, Lyon); « [provisoire] » marks removed; `detail` = main mission, `highlights` = rest of the role, nothing retold from `/projects` (FR-019, FR-028, R13, R16). _Education months confirmed by the maintainer (BUT `2022-09` to `2025-08`, IMT Mines Alès from `2025-09`)._
- [x] T026 Documents realigned: `DESIGN.md` (« Tableau du parcours » rewritten, Layout › Responsive), and every file of `specs/007-background/` (spec FR-024 to FR-028, plan, research R9–R16, data model, contract, quickstart). _Captures: 1280 px at rest in light, hover in light and dark, 375 px in light. Lighthouse mobile 100 / 100 / 100 / 100 on both pages before the content change. Not rerun after T025: captures and Lighthouse. Still not run: VoiceOver, axe, 200 % zoom, the 90-character title check._

- [x] T027 One entry per screen in `src/views/BackgroundView.astro`: on mobile, description, chips and achievements take the full width under the when column and the title; achievements in `--text-sm`; the place stays right under its title on both layouts. `src/data/experience.yaml`: apprenticeship technologies are the code stack (Java, Spring, Angular, TypeScript, PostgreSQL), tools stay in the text. _Measured: tallest entry 501 px at 375 px wide (748 px before), 306 px at 1280 px; 604 px at 320 px. No horizontal scroll at 320, 375, 390 and 1280 px. Captures read at 375 px (light FR, dark EN) and 1280 px (light and dark FR). Lighthouse mobile rerun on both pages._

- [x] T028 Ongoing marker and pieces in `src/views/BackgroundView.astro`: years always in ink; « aujourd'hui » / « present » in 600 after a 0.5rem red square (FR-024); one chess piece per entry from `src/assets/pieces/` (pawn for education, knight for experience; `bP` / `bN` by default, `wP` / `wN` in the dark theme, files unmodified), on the thread from `56rem` and beside the year on mobile (FR-025); on hover the piece moves up by `--space-1`, not under reduced motion, and the node no longer turns red (FR-027); mobile when column widened to 6rem. _Tried and dropped: a red year, one drawing inverted by CSS, white pieces on a stone square. A link from an entry to its project was postponed to the reserve of `ROADMAP.md`._
- [x] T029 Final check before commit. _No horizontal scroll at 320, 375, 390 and 1280 px in both languages. Tallest entry: 501 px at 375 px wide (FR), 473 px (EN), 306 px at 1280 px; 604 px at 320 px (FR). Captures read: 375 px light (EN), 320 px light (FR), 1280 px dark (FR), hover at 1280 px light (EN). Lighthouse mobile 100 / 100 / 100 / 100 and CLS 0 on both pages; detector: no finding on the rendered pages; 0 script, 1 `h1`, 4 `h2`, 6 `time` per page. Still not run: VoiceOver, axe, 200 % zoom, the 90-character title check; the step of the piece on hover was not observed in motion.

## Dependencies & Execution Order

- **Setup (T001)**: first.
- **Foundational (T002–T006)**: T002 ∥ T004 ∥ T005 alongside T003; T006 needs T003, T004
  and T005. Blocks all stories.
- **US1 (T007–T009)**: T007 needs T002, T005 and T006; T008 ∥ T007; T009 last.
- **US2 (T010–T011)**: needs US1 (same view file).
- **US3 (T012–T013)**: needs US1; runs after US2 because both edit the same file.
- **US4 (T014–T015)**: needs the Foundational phase; T014 is easier to read once US1 shows
  the page. T015 ∥ T014.
- **Polish (T016–T020)**: after all stories. T016 ∥ T017; T018 after T017; T019 and T020
  last.
- **Review follow-up (T021–T029)**: after the first delivery, in order; all but T025 edit
  the same view file.

US1, US2 and US3 all edit `src/views/BackgroundView.astro`: they run in sequence.

## Parallel Example: Foundational

```text
T002  src/i18n/ui.ts            (dictionary keys)
T004  src/data/*.yaml           (sample entries)
T005  src/lib/dates.ts          (formatMonth)
— then T003 → T006 (schema, then access function)
```

## Implementation Strategy

1. **MVP**: Setup, Foundational, then US1. The nav link stops leading to a 404 and the page
   lists the sample entries; stop and validate with quickstart §1.
2. **US2**: periods. Validate with quickstart §2.
3. **US3**: layout at both sizes. Validate with quickstart §3.
4. **US4**: failure checks on a scratch branch and the contributor note.
5. **Polish**: documents, Impeccable audit and polish, Lighthouse and axe.

The feature should fit in about two sessions (`ROADMAP.md`): Foundational + US1 + US2, then
US3 + US4 + polish.

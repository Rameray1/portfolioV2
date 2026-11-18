# Research: Parcours

Phase 0 of [plan.md](./plan.md). No `NEEDS CLARIFICATION` remained in the Technical Context;
each entry below records one design decision.

## R1 — Two collections, one shared schema

- **Decision**: `experience` and `education` in `src/content.config.ts`, each loaded with
  Astro's `file()` loader from `src/data/experience.yaml` and `src/data/education.yaml`. Both
  use the same `timelineEntry` zod schema, declared once and strict.
- **Rationale**: constitution III (typed collections, build fails on invalid content) and
  `CONTENU.md` §6, which already names both files and their fields. One schema constant is
  what « same shape » means in FR-013; the CV (F09) reads the same collections.
- **Alternatives**: one file with a `kind` field (contradicts §6 and the request; the type
  would be a value to keep right instead of a place to put the entry); a `.ts` data file
  like `campaign.ts` (not a collection, so principle III would need an exception).

## R2 — A map keyed by id, not an array

- **Decision**: each YAML file is a map: the key is the entry id (English kebab-case, such
  as `astree-apprenticeship`), the value is the entry.
- **Rationale**: read in `node_modules/astro/dist/content/loaders/file.js` (Astro 7.4.2):
  with an array, an item without `id` is logged and skipped, and the build goes on. With a
  map, an entry cannot lack its id, and the id is what Astro prints in a schema error, so the
  message names the file, the entry and the field (FR-016). The id never reaches the page.
- **Alternatives**: an array with an `id` field (the silent skip above); an id derived from
  the title (changes when the title is reworded).

## R3 — What the schema checks, and what the helper checks

- **Decision**: per-entry rules live in zod: required fields, `{ fr, en }` prose with both
  sides non-empty, date format, `end` not before `start`, unknown key rejected. The only rule
  that spans entries lives in `src/lib/background.ts`: it throws when either collection has
  no entry, and names the file. In `src/content.config.ts`, a `strictFile` wrapper around
  `file()` turns every error the loader logs into a thrown error.
- **Rationale**: a zod schema sees one entry at a time. Read in the `file()` loader of Astro
  7.4.2: a missing file, a YAML syntax error (a duplicate key, a bad indent) or an empty file
  is only logged, and the collection is left empty. Requiring one entry per file turns all
  three into a build failure with one `if` per collection, as constitution III demands.
  Found during implementation: when a content cache exists, the loader keeps the cached
  entries after a failed read, so the emptiness check alone lets a missing or broken file
  through. The wrapper replaces the loader's `logger.error` with a throw (ten lines, no
  dependency) and closes that case with or without a cache. An empty file is still caught
  by the emptiness check in `getBackground`. A plain `throw` fails `astro build`, like `getProjects` in F06. Both files always have
  content in practice: the maintainer has studied and worked.
- **Alternatives**: accepting one empty file and reading the file a second time in the
  helper to tell « empty on purpose » from « unreadable » (more code for a case that does not
  occur); a custom loader that throws (needs a YAML parser import of its own).

## R4 — Dates are `YYYY-MM` strings

- **Decision**: `start` and `end` are strings matching `YYYY-MM` (month `01` to `12`).
  `end` is optional; its absence means « ongoing ». The schema compares the two strings to
  refuse an `end` before its `start`; the same month is allowed.
- **Rationale**: the spec fixes month precision (Assumptions). Checked with Astro's YAML
  parser: `2024-09` stays a string, while `2024-09-01` becomes a `Date`, so a day written by
  mistake fails the string schema instead of being silently dropped. `YYYY-MM` strings sort
  and compare as text, and are a valid `datetime` value for `<time>` (FR-011).
- **Alternatives**: full dates with the day ignored (a value stored and never shown);
  separate `year` and `month` numbers (four fields for one period).

## R5 — Period text comes from `Intl.DateTimeFormat`

- **Decision**: `src/lib/dates.ts` exports `formatMonth(value, locale)`:
  `Intl.DateTimeFormat(locale, { month: 'short', year: 'numeric', timeZone: 'UTC' })`. The
  view composes the period: start, a non-breaking space, an en dash, a space, then the end or
  the dictionary word (`aujourd'hui` / `present`). When both months are equal, the month is
  written once. Each month is a `<time datetime="YYYY-MM">`.
- **Rationale**: clarification 1 (abbreviated month). Checked on Node 24: `fr` gives
  `janv.`, `févr.`, `mars`, `avr.`, `mai`, `juin`, `juil.`, `août`, `sept.`, `oct.`, `nov.`,
  `déc.` ; `en` gives `Jan` … `Sep` … `Dec`, each followed by the year. No month table to
  maintain, no dependency. The en dash follows the Typesetter's Rule of `DESIGN.md`. Nothing
  reads the build date (FR-010).
- **Alternatives**: a hand-written month table per language (24 strings to keep right);
  moving `formatStart` out of `campaign.ts` into the same module (it formats a full date in
  long form for another purpose; left where it is).

## R6 — One access function, one merged type

- **Decision**: `getBackground(locale)` in `src/lib/background.ts` returns
  `BackgroundEntry[]`: both collections merged, each entry tagged `kind: 'experience' |
'education'` from its collection, prose resolved to the page language, sorted.
- **Rationale**: the type comes from the file, never from a field (FR-018, Key Entities).
  The CV (F09) will call the same function, so order and language resolution cannot diverge.
  It sits in `src/lib/` next to `projects.ts`.
- **Alternatives**: merging in the view (F09 would copy the sort).

## R7 — Sort order

- **Decision**: `start` descending; then ongoing before finished; then `end` descending;
  then French title with `localeCompare('fr')`; then id.
- **Rationale**: the spec's tie-break (Edge Cases, « Même date de début »). Sorting on the
  French title keeps the same order in both languages, as in F06. The id is a last resort so
  the order never depends on the file order.

## R8 — One view, no `Timeline` component

- **Decision**: the list markup and its styles live in `src/views/BackgroundView.astro`.
  No `Timeline.astro`.
- **Rationale**: one caller today (principle I). The CV will lay the same entries out for
  A4 print, with its own markup; what it shares with this page is the data access and the
  date format, which are in `src/lib/`. `ROADMAP.md` announced a generic `Timeline.astro`:
  its F07 plan block is aligned (R12).
- **Alternatives**: the generic component of the roadmap (an abstraction with one use).

## R9 — Ordered list with a visual header row

- **Decision**: an `<ol>` of entries. Above it, on screens of `56rem` and more, one row of
  three column labels (period, title, place) marked `aria-hidden="true"`; it is not rendered
  visible under `56rem`. In each `<li>`, in DOM order: the year (decorative), the period, the
  type label, the thread node (decorative), the title as `<h2>`, the place, the description,
  the technologies, the achievements.
- **Rationale**: clarification 2 and FR-007. The list gives assistive technology the count
  and the order; the `<h2>` lets a screen-reader user jump from entry to entry; the period
  and the type label precede the title so they are read together (US1, scenario 8). The
  header row repeats what each cell already says, so hiding it loses nothing.
- **Alternatives**: a real `<table>` (rejected by clarification 2: description, technologies
  and achievements have no column).

## R10 — Layout at both sizes

- **Decision**: from `56rem`, a four-column grid per row: when (12.5rem: year, one-line
  period, type), thread and piece (1.75rem), title block (title, then description, technologies and
  achievements at the reading measure), place (10 to 16rem). Under `56rem`, two columns:
  when on the left (6rem: year with the piece at its end, period broken after the dash on
  two short lines, type),
  and the title block on the right with the place under the title. No thread and no header
  row on mobile.
- **Rationale**: `DESIGN.md` gave the period column 8.5rem on mobile for a year range.
  « sept. 2024 – aujourd'hui » is about 11rem in `--text-sm`: on one line it would leave the
  title 150 px at 375 px wide. On two lines the column shrinks to the width of
  « ■ aujourd'hui » in semibold (6rem) and the title gets more room. The type label sits under the
  period, never above the title: a label above a heading is an eyebrow, which the Impeccable
  craft floor bans.
- **One entry per screen**: on mobile only the title and the place stay beside the when
  column; description, chips and achievements take the full width, and achievements are in
  `--text-sm`. With the when column kept beside all the text, the apprenticeship entry was
  748 px tall at 375 px wide; it is now 501 px.
- **Alternatives**: one-line period on mobile (title column too narrow); period above the
  title on mobile (loses the left-hand date rail that makes it read as a timeline); a thread
  column on mobile (takes 24 px from a 220 px title column).

## R11 — Labels and head

- **Decision**: nine dictionary keys in `src/i18n/ui.ts`: the page title, its description,
  the two type labels, the « present » word, the three column labels and the name of the
  achievements list. The technologies list is named by `projects.tech` (`aria-label`).
  Technologies are stack chips, plain text without links (FR-006). `BaseLayout` receives the
  title and the description; canonical, alternates and sitemap need no change, since
  `alternatePath` discovers the two page files.
- **Rationale**: principle VI (no literal in a component) and FR-021, FR-023. The nav item
  `/background` already exists in `src/data/nav.ts`. The chips are the « puces de stack » of
  `DESIGN.md`, already used on the project page.

## R12 — Documents to align

- **Decision**: `DESIGN.md`: the period example in the Typesetter's Rule, the mobile stack
  in Layout › Responsive, and the « Tableau du parcours » component, rewritten (year, thread,
  title and place, hover). `ROADMAP.md`: the F07 plan block (map keyed by id, no
  `Timeline.astro`, `src/lib/background.ts`). `CONTRIBUTING.md`: how to add an entry.
  `CONTENU.md` §6 already matches.
- **Rationale**: the constitution's governance rule: a document that conflicts is aligned,
  never ignored. `DESIGN.md` now says « intitulé », like the spec; the field is `title`.

## R13 — Entries come from the CV

- **Decision**: two experiences and two education entries, taken from the maintainer's CV
  (`RamazanKus_CV_FR.tex` and `RamazanKus_CV.tex`, outside the repository). They cover the
  cases of FR-019: two ongoing, simultaneous entries; one experience with technologies and
  achievements; two finished entries. No « [provisoire] » mark. The CV gives years only for
  the education entries; their months (`2022-09` to `2025-08`, and `2025-09`) were confirmed
  by the maintainer.
- **Rationale**: the first delivery shipped invented samples marked « [provisoire] » on the
  page. The maintainer then asked for the real information. Titles, places and wording now
  match the CV, which the online CV (F09) will render from these same files. The prose
  follows `CONTENU.md` §9: no date, year or duration in the text (FR-012).
- **No end for IMT Mines Alès**: the entry reads as ongoing rather than showing an
  expected « 2028 »; the end month is added when the degree is awarded.

## R14 — Year rail, thread, pieces and one red

- **Decision**: each entry opens on its start year in display numerals (800, 72 %,
  `--text-2xl`), `aria-hidden` since the period says it, always in ink. An ongoing entry is
  marked in its period: « aujourd'hui » / « present » in ink, 600, after a 0.5rem red square
  (the « trait » of `DESIGN.md`, smaller because it sits in a line of `--text-sm`). Each
  entry carries a decorative chess piece, a pawn for education and a knight for experience,
  from the cburnett set of the home diagram, used unmodified through `<picture>`: the black
  piece in the light theme, the white one in the dark theme. From `56rem`, a 1 px ink thread
  links the pieces (1.75rem); on mobile the piece (1.5rem) sits at the end of the year line.
  The place is in ink, 600. No legend.
- **Rationale**: the maintainer found the first delivery too plain. The page was the only
  one that used neither the display type nor a motif of the system. The year rail gives the
  chronology at a glance, the thread makes it a timeline rather than a table, and the pieces
  bring the chess world of the site to this page, mobile included. The red square is allowed
  by the Commentator's Red Rule because it marks a state, and it sits on the word that
  explains it (FR-024). The pawn is the piece that goes to promotion, as a class does; the
  knight is already in play. The pieces are printed in ink like figurine notation, hence
  black on light paper and white on dark. The place was small and muted although the school
  and the employer are what a recruiter looks for first (FR-026).
- **Alternatives tried and dropped**: a red start year for ongoing entries (it stressed a
  past date and did not explain itself); filled and hollow square nodes with a legend (the
  type was said three times); one drawing inverted by CSS in the dark theme (not the
  original white piece); white pieces on a stone board square (the maintainer preferred the
  bare original pieces, even though the black knight carries a light line on its back that
  the white one lacks).

## R15 — Hover: spotlight, not inversion

- **Decision**: inside `@media (hover: hover)`, the hovered entry keeps full ink and its
  muted texts go to ink; the other entries go to `--color-ink-muted`. The colour transition
  uses `--duration` and `--ease-out`. The piece of the hovered entry moves up by
  `--space-1`, only when `prefers-reduced-motion` is `no-preference`. Nothing happens on
  touch.
- **Rationale**: the maintainer wanted a reaction to the pointer. On the home and the
  project list, the inverted row means « this row is a link ». Timeline rows lead nowhere,
  so the inversion would promise a click; it was built, then replaced. Muting through the
  ink-muted token keeps text contrast at AA while another row is hovered. The small step of
  the piece echoes the candidate moves of the home diagram, and red keeps a single meaning
  on the page (« ongoing »). On touch, a hover state would stay stuck after a tap.
- **Alternatives**: full-row inversion (false link affordance); a node that turns red on
  hover (a second meaning for red); no hover at all (the page is complete without it).

## R16 — Description and achievements

- **Decision**: `detail` says the main mission of the entry in one sentence; `highlights`
  say the rest of the role. A highlight never retells a project published in `/projects`.
- **Rationale**: the first samples summarised the shipment-preparation case study, which
  has its own project page: two sources for one fact (principle IV). The split follows the
  CV, where the first bullet of each position is the mission and the next ones complete it.
- **Later**: a link from an entry to the project that proves it (apprenticeship and its
  case study, IMT Mines Alès and Meetz, BUT and Sportify) was considered and postponed: the
  page is already dense and the tallest mobile entry is near the limit of one screen. It is
  noted in the reserve of `ROADMAP.md`.

# Research: Compétences

No `NEEDS CLARIFICATION` was left in the Technical Context. Each decision below resolves a
choice the spec leaves to the plan.

## R1 · One collection, one YAML map

- **Decision**: a `skills` collection loaded from `src/data/skills.yaml` through the existing
  `strictFile` wrapper of `src/content.config.ts`. The file is a YAML map; each key is the
  entry id (`typescript`, `spring`…), as in `experience.yaml`.
- **Rationale**: same pattern as F07; `strictFile` already turns a missing or unreadable file
  into a build failure (FR-013). The map key gives a stable id and makes a duplicate id a YAML
  parse error: Astro's parser (`@astrojs/internal-helpers/yaml`) throws « Map keys must be
  unique », checked on 2026-11-18, and `strictFile` turns it into a build failure.
- **Alternatives considered**: a TypeScript module in `src/data/` (no schema, breaks
  principle III); one file per skill with `glob()` (heavy for about 20 one-line entries).

## R2 · `reference('projects')` does not check existence

- **Decision**: keep `projects: z.array(reference('projects')).min(1)` in the schema, as the
  roadmap plans, and check existence and draft state in `src/lib/skills.ts`, which throws.
- **Rationale**: in Astro 7.4, `reference()` only turns a string into `{ collection, id }`
  (`node_modules/astro/dist/content/runtime.js`); a missing entry is a warning at read time,
  not an error. A draft cannot be detected by the schema either. The lib already holds the
  same kind of cross-file checks for projects (`src/lib/projects.ts`, `validate`).
- **Alternatives considered**: `z.string()` instead of `reference()` (loses the typed link
  the CV will use); a custom loader that reads the projects (couples two collections at
  load time, more code).

## R3 · Name written once, English form optional

- **Decision**: `name: text | { fr: text, en: text }`. A proper noun is a plain string
  (`TypeScript`); a common noun is localized (`{ fr: Tests automatisés, en: Automated
testing }`).
- **Rationale**: FR-011 with the least syntax for the common case; no `nameEn` field to
  forget. Uniqueness is checked on the French form, case-insensitively.
- **Alternatives considered**: always `{ fr, en }` (duplicates every proper noun, against
  principle IV); `name` + `nameEn` (two fields for one value).

## R4 · Closed lists in code, labels in the dictionary

- **Decision**: `domain: z.enum(['frontend', 'backend', 'data', 'tools'])` and
  `level: z.enum(['basics', 'proficient', 'advanced'])`. The tuple order is the display order
  (domains) and the rank (levels, low to high). Labels and level definitions are dictionary
  keys (`skills.domain.*`, `skills.level.*`, `skills.level.*.definition`).
- **Rationale**: FR-002, FR-006, FR-011; principle VI (no UI literal); principle IX (English
  values). One array is both the enum and the order: no second list to keep in sync.
- **Alternatives considered**: domains and levels as data in the YAML (page-specific
  information in a shared file, against FR-015).

## R5 · No year (revised after review)

- **Decision**: no `since` field. A first version stored the year of first use
  (`2000 ≤ since ≤ current year`) and showed « depuis 2022 ».
- **Rationale**: the year said first contact, not length of practice, and misled for a skill
  used once long ago. The level definitions now carry frequency; the background page carries
  seniority on the main stack. Removing it also removes the only build-date-dependent check.
- **Alternatives considered**: « last used » (a hand-kept date that goes stale); a year only
  for higher levels (one more display rule for little gain).

## R6 · Access helper `getSkills(locale)`

- **Decision**: `src/lib/skills.ts` exports `getSkills(locale)` returning the domains in
  order, each with its sorted skills; each skill carries `name`, `level` and its
  proof projects as `{ slug, title }`, ordered like `getProjects` (year desc, then title).
  It throws when the file has no entry, when two skills share a name, when a skill cites the
  same project twice, a missing project or a draft one. Empty domains are dropped.
- **Rationale**: one access point for the page and the CV (FR-015, SC-009); proof titles
  come from `getProjects(locale)`, so the English page gets the English title or the French
  fallback with no extra code. Draft check runs on the raw collection, so it fails in dev as
  in production (a draft is hidden only in production).
- **Alternatives considered**: grouping in the view frontmatter (the roadmap's wording; the
  CV would duplicate it); a `SkillGroup.astro` component (one caller, see R8).

## R7 · Sort order

- **Decision**: in a domain, level rank desc, then French name (`localeCompare(…, 'fr')`),
  then id, in both languages. Proofs: the order of `getProjects` (year desc, then French
  title).
- **Rationale**: FR-003 asks for the same order in both languages; sorting on the English
  name would reorder the rare localized names. Deterministic at each build.
- **Alternatives considered**: sort on the name in the page language (strictly alphabetical
  in English, but the two pages would differ).

## R8 · One view, no component

- **Decision**: `src/views/SkillsView.astro` renders everything; `src/pages/skills.astro` and
  `src/pages/en/skills.astro` are shells. The level piece is inline markup in the view.
- **Rationale**: principle I; same structure as F05–F07. `SkillGroup.astro` from the roadmap
  has a single caller; the CV (F09) will have its own print layout and reuse the data, not
  the markup. If F09 needs the level mark, it is extracted then.
- **Alternatives considered**: `SkillGroup.astro` and `LevelMark.astro` now (YAGNI).

## R9 · Markup

- **Decision**: one `<h1>`, an intro paragraph, the legend as a `<dl>` (level word + its
  piece + definition), then per domain an `<h2>` and a `<ul>`. Each `<li>`: name in an
  `<h3>`, the level as text with an `aria-hidden` chess piece, « depuis 2022 », then
  the proof links in a `<ul>` labelled « Preuves » / « Proof ».
- **Rationale**: FR-005, FR-008, US1 scenarios 3, 8 and 9; headings give screen-reader
  navigation by domain and by skill. The pieces are the cburnett pieces of the background page (pawn, knight, queen),
  black in light theme, white in dark; no colour meaning (SC-004). They replaced a first
  version with three ink squares after review (spec, clarifications).
- **Alternatives considered**: a `<table>` (one row per skill reads well on desktop but
  stacks badly at 375 px and makes a variable number of links awkward); `<meter>` for the
  level (announced as a number, styled inconsistently across browsers).

## R10 · Layout

- **Decision**: mobile first, each skill stacks (name and level on one line when they fit,
  then proofs), and the domain title sticks to the top of the screen along its domain. From
  the wide breakpoint already used by the background page (`56rem`), each domain is a
  full-width table in proportional columns (3 / 2 / 4: name, level, proofs) whose header row
  is the domain title with « Niveau » and « Preuves » labels. Pointer devices get the row hover
  of the background page (the row stays in ink, its piece steps forward, other rows go muted).
  Two columns of domains, then two skills per row, were tried and dropped: row heights did not
  line up. Exact widths, spacing and the piece size
  are settled with Impeccable against `DESIGN.md`, then written back into `DESIGN.md`.
- **Rationale**: FR-017, principle VII; same breakpoint as F07 so the two pages feel like one
  system.

## R11 · Delivered data

- **Decision**: a first `skills.yaml` built from the four published projects, covering the
  four domains, with at least one skill proven by several projects (TypeScript: Meetz and
  shipment preparation; Docker: Sportify and Meetz). Levels and years are confirmed by the
  maintainer before merge. Single-project helper libraries (Leaflet, Socket.IO) are left out.
- **Rationale**: FR-016; clarification of 2026-11-18. The full list is C4.

## R12 · Documents to align

- **Decision**: `DESIGN.md` gets a short « Liste des compétences » component section (legend,
  pieces, grid, sticky domain titles on mobile); `ROADMAP.md` F08 plan line is updated (no `SkillGroup.astro`, checks in the
  lib); `CONTRIBUTING.md` explains how to add a skill.
- **Rationale**: constitution governance (documents aligned, never ignored).

# Implementation Plan: Accueil et À propos

**Branch**: `005-home-about` | **Date**: 2026-11-11 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/005-home-about/spec.md`

## Summary

Campaign levers (pitch, availability, two actions, future CV) move into a typed
`src/data/campaign.ts`; the home reads it and keeps F04's `Seo`/`PersonSchema`. The home
becomes the approved opening of `DESIGN.md`: name, game-header line, pitch, two link buttons
(email, LinkedIn), and a sticky still chess diagram (FEN in `src/data/diagram.ts`, 64-cell
grid, 12 cburnett SVG pieces placed by `--file`/`--rank`) captioned by an `Availability`
block. `/about` and `/en/about` render a `pages` content collection (one Markdown file per
locale), the photo `pp.jpg` cropped once to 4:5 / 640 × 800 without metadata and served as
AVIF/WebP < 50 kB, and the same `Availability` block. All provisional prose carries
« [provisoire] » / « [draft] ».

## Technical Context

**Language/Version**: TypeScript 6 (strict), Astro 7.4, Node 22

**Primary Dependencies**: none added. Uses `astro:content` (`glob` loader, zod) and
`astro:assets` (`<Picture>`, sharp image service, already installed). One-off dev step: sharp
via `node -e` to crop the photo (R5).

**Storage**: N/A — typed modules (`campaign.ts`, `diagram.ts`), Markdown in
`src/content/pages/`, images in `src/assets/`

**Testing**: no test framework. Types enforce campaign shape (`npm run check`); build-time
throws for date and FEN; zod for About frontmatter; then the scenarios of
[quickstart.md](./quickstart.md) (both locales, data-only edits, failure checks, photo
weight, grep of provisional marks, Lighthouse, axe, keyboard, VoiceOver).

**Target Platform**: evergreen browsers; static files in `dist/`, deployed on Vercel

**Project Type**: static website (Astro)

**Performance Goals**: 0 kB client JS; home < 200 kB transferred (pieces ≈ 8 kB, font
already preloaded); each photo file < 50 kB; Lighthouse mobile ≥ 95 / 100 / 100 / 100;
CLS 0

**Constraints**: no `<script>`, no animation (moves are F06/F11); no UI literal outside the
dictionary; no prose in components; the original photo never enters the repo

**Scale/Scope**: 2 data modules, 1 content config + 2 Markdown files, 3 components
(`Diagram`, `Availability`, `ActionLinks`), 1 new view + 1 rewritten view, 2 page shells,
12 SVG + 1 photo, dictionary and token additions, 1 share-image re-render, 1 constitution
PATCH

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| #    | Principle                    | Status                 | Notes                                                                                                                                                                                                                                                                                      |
| ---- | ---------------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| I    | Simplicité (KISS/YAGNI)      | ✅ Pass                | No dependency. Campaign as a TS module, not a collection (R1); FEN + 15-line parser instead of a chess library (R6); `<img>` pieces instead of inline SVG; no featured placeholder markup (R7); paragraph count not validated.                                                             |
| II   | Statique, zéro JS client     | ✅ Pass                | Dates formatted and FEN parsed at build; no script, no `client:*`; diagram still.                                                                                                                                                                                                          |
| III  | Contenu = donnée typée       | ✅ Pass                | About prose in a validated collection; campaign and position typed; build fails on missing locale, bad date, bad FEN, missing file (contract « Failure »).                                                                                                                                 |
| IV   | Une source par information   | ✅ Pass                | Email and LinkedIn read from `site.contact`; header line from `site.person`; one date, one `visible`, one photo for both locales; `Availability` renders the same datum on both pages; pitch is also the home description.                                                                 |
| V    | Leviers de campagne          | ⚠️ Pass with amendment | Levers 1, 2, 4, 5 in `campaign.ts`. Lever 3 stays the `featured` flag of projects (`CONTENU.md` §7, F06), which the current wording « les 5 leviers … dans `campaign.ts` » forbids. Resolved by a PATCH amendment v1.0.3 in its own commit (R10), not by an exception.                     |
| VI   | Bilingue par dictionnaire    | ✅ Pass                | New labels in `ui.ts` (4 keys); prose per locale in data/Markdown; EN rewritten, not translated.                                                                                                                                                                                           |
| VII  | Accessibilité et performance | ✅ Pass                | Diagram `role="img"` + localized label, pieces `alt=""`; photo `alt` per locale, dimensions set; unique title/description per page; budgets in quickstart §4, §7. No motion added.                                                                                                         |
| VIII | Styles par jetons            | ✅ Pass                | New tokens `--color-square-light/-dark`, `--color-board-edge` from `DESIGN.md`; scoped styles; component-only sizes (coordinate gutter `1.25rem`, trait `0.75rem`, diagram `30rem`/`22rem`) commented as `DESIGN.md` values. Impeccable loaded before UI tasks; audit + polish at the end. |
| IX   | Conventions et qualité       | ✅ Pass                | English names (`campaign`, `Availability`, `pages/about`); `check` + `build` before commits; `feat`, `content`, `docs`, `a11y` commits.                                                                                                                                                    |

**Post-design re-check**: ✅ unchanged after Phase 1. The design adds no script, dependency
or abstraction beyond the files below.

## Project Structure

### Documentation (this feature)

```text
specs/005-home-about/
├── plan.md              # This file
├── research.md          # Phase 0 (R1–R11)
├── data-model.md        # Phase 1
├── quickstart.md        # Phase 1 (validation scenarios)
├── contracts/
│   └── home-about.md    # routes, HTML structure, failure contract
├── checklists/
│   └── requirements.md
└── tasks.md             # Phase 2 (/speckit-tasks)
```

### Source Code (repository root)

```text
.specify/memory/constitution.md   # changed — principle V wording, v1.0.3 (R10)
scripts/og-image.html             # changed — EN pitch from CONTENU.md §3 (R8)
public/og/default-{fr,en}.png     # re-rendered if the text changed (R8)
src/
├── content.config.ts             # new — collection `pages` (R4)
├── content/pages/
│   ├── fr/about.md               # new — provisional narrative (R9)
│   └── en/about.md               # new
├── assets/
│   ├── about/portrait.jpg        # new — 640 × 800, no metadata (R5)
│   └── pieces/                   # new — 12 cburnett SVG + LICENSE.md (R6)
├── data/
│   ├── campaign.ts               # new — levers + formatStart (R1–R3)
│   └── diagram.ts                # new — FEN, alt, parseFen (R6)
├── i18n/ui.ts                    # changed — 4 keys
├── styles/global.css             # changed — board tokens
├── components/
│   ├── Availability.astro        # new (R11)
│   ├── ActionLinks.astro         # new — the two buttons (R3)
│   └── Diagram.astro             # new (R6)
├── views/
│   ├── HomeView.astro            # rewritten — opening (R7)
│   └── AboutView.astro           # new
└── pages/
    ├── about.astro               # new — shell
    └── en/about.astro            # new — shell
```

**Structure Decision**: same pattern as F03/F04 (`views/` + thin page shells, data in
`src/data/`). `src/content/` and `content.config.ts` appear for the first time; F06 adds
`projects` to the same config. Helpers (`formatStart`, `parseFen`) live next to their data
instead of a `src/lib/`, since each has one caller.

## Implementation notes for `/speckit-tasks`

1. Branch `005-home-about` exists; commit the spec and plan first (`docs:`).
2. Constitution PATCH v1.0.3 via `/speckit-constitution` (R10), own commit
   `docs: amend constitution to v1.0.3`.
3. Load the `impeccable` skill before any UI task; follow `.impeccable/prototype/index.html`
   for the opening and the diagram CSS.
4. US2 foundation first: `campaign.ts`, `Availability`, `ActionLinks`, dictionary keys;
   wire `HomeView` description to the pitch (quickstart §2).
5. US1: `diagram.ts`, pieces, tokens, `Diagram`, opening layout; quickstart §1. Share image
   check (R8).
6. US3: photo crop (show the 4:5 crop to the maintainer before committing it), collection,
   Markdown files, `AboutView`, shells; quickstart §3–§4.
7. US4 is satisfied by the layout (nothing rendered); verify in quickstart §1.
8. `/impeccable audit`, `/impeccable polish`, fixes, then quickstart §5–§7.

Suggested commits (one per user story): `feat: read home levers from campaign data` (US2),
`feat: build home opening with diagram and availability` (US1 + US4),
`feat: add about page` (US3), `a11y: …` / `fix: …` for audit fixes.

## Complexity Tracking

No violation to justify. Principle V is aligned by amendment (R10), not by exception.

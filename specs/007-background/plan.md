# Implementation Plan: Parcours

**Branch**: `007-background` | **Date**: 2026-11-16 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/007-background/spec.md`

## Summary

Experiences and education become two collections that share one strict schema, each loaded
from a YAML map in `src/data/` through a `strictFile` wrapper that turns any loader error
into a build failure. `src/lib/background.ts` is the single access point: it merges both,
tags each entry with its type from its collection, resolves the prose to the page language,
sorts, and throws when either file has no entry. `src/lib/dates.ts` formats a `YYYY-MM`
month with `Intl.DateTimeFormat`. `BackgroundView` renders one ordered list on `/background`
and `/en/background`: each entry opens on its start year in display numerals and carries a
chess piece (pawn for education, knight for experience); an ongoing entry is marked by a red
square before « aujourd'hui »; on wide screens a four-column grid under a visual header row,
with a thread that links the pieces; on mobile a two-column stack with the period on two lines. Hovering an
entry keeps it in full ink, moves its piece one step and mutes the others. The four entries come from the maintainer's
CV. `DESIGN.md`, `ROADMAP.md` and `CONTRIBUTING.md` are aligned.

## Technical Context

**Language/Version**: TypeScript 6 (strict), Astro 7.4, Node 22

**Primary Dependencies**: none added. Uses `astro:content` (`file()` loader, zod) and the
platform's `Intl.DateTimeFormat`.

**Storage**: N/A — YAML in `src/data/experience.yaml` and `src/data/education.yaml`

**Testing**: no test framework. zod schema and one build-time throw
([contracts/background.md](./contracts/background.md), « Failure contract »),
`npm run check`, then the scenarios of [quickstart.md](./quickstart.md) (both languages,
scratch-branch failure checks, head and sitemap checks, Lighthouse, axe, VoiceOver, captures
at 375 px and 1280 px in both themes).

**Target Platform**: evergreen browsers; static files in `dist/`, deployed on Vercel

**Project Type**: static website (Astro)

**Performance Goals**: 0 kB client JS; text-only page; Lighthouse mobile ≥ 95 / 100 / 100 /
100

**Constraints**: no `<script>`; the only motion is the hover colour transition, on the
`--duration` token (0 ms under reduced motion); no UI literal outside the dictionary; nothing
page-specific in the data files; the output never depends on the build date

**Scale/Scope**: about 10 entries at most. 2 collections on 1 schema, 2 lib modules, 1 view,
2 page shells, 9 dictionary keys, 2 YAML files with 4 entries, 3 documents changed

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| #    | Principle                    | Status  | Notes                                                                                                                                                                                                                                                                                                                                      |
| ---- | ---------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| I    | Simplicité (KISS/YAGNI)      | ✅ Pass | No dependency. No `Timeline` component: one caller (R8). No `kind` field, draft flag, duration, filter or per-entry page. One `if` per file and a ten-line loader wrapper instead of a custom loader (R3). `Intl` instead of a month table (R5).                                                                                           |
| II   | Statique, zéro JS client     | ✅ Pass | Two prerendered pages, no script, no `client:*`; the hover effect is CSS only (R15). Periods are computed at build from the data only, never from the current date.                                                                                                                                                                        |
| III  | Contenu = donnée typée       | ✅ Pass | Two collections on one strict schema; adding an entry = one YAML block; every case of the failure contract breaks the build, including a file that is missing, unreadable or without entry (R3).                                                                                                                                           |
| IV   | Une source par information   | ✅ Pass | Dates, place and technologies exist once; only `title`, `detail` and `highlights` are `{ fr, en }`. The period is derived. `getBackground` is the access point the CV will reuse (R6).                                                                                                                                                     |
| V    | Leviers de campagne          | ✅ Pass | Not touched.                                                                                                                                                                                                                                                                                                                               |
| VI   | Bilingue par dictionnaire    | ✅ Pass | Nine new keys in `ui.ts`, one reused; same path under `/en`; English prose required in each entry, rewritten, not translated.                                                                                                                                                                                                              |
| VII  | Accessibilité et performance | ✅ Pass | Ordered list, `<h2>` per entry, type as text, `<time datetime>`; decorative header row, year numerals and thread hidden from assistive technology; ongoing state said in text as well as in red; muted hover state keeps AA contrast (R14, R15); layouts designed for 375 px and 1280 px (R10); unique title and description per language. |
| VIII | Styles par jetons            | ✅ Pass | Scoped styles in the view, tokens only; the column widths, the piece sizes and the 0.5rem square are component values, commented as `DESIGN.md` values; red only marks a state (R14). Impeccable loaded before UI tasks; audit + polish at the end.                                                                                        |
| IX   | Conventions et qualité       | ✅ Pass | English names (`experience`, `education`, `start`, `end`, `highlights`, entry ids); `check` + `build` before commits; conventional commits; no published content removed.                                                                                                                                                                  |

**Post-design re-check**: ✅ unchanged after Phase 1. No exception to justify; Complexity
Tracking is empty.

## Project Structure

### Documentation (this feature)

```text
specs/007-background/
├── plan.md              # This file
├── research.md          # Phase 0 (R1–R16)
├── data-model.md        # Phase 1
├── quickstart.md        # Phase 1 (validation scenarios)
├── contracts/
│   └── background.md    # routes, head, HTML structure, failure contract
├── checklists/
│   └── requirements.md
└── tasks.md             # Phase 2 (/speckit-tasks)
```

### Source Code (repository root)

```text
DESIGN.md · ROADMAP.md               # changed — aligned with the spec (R12)
CONTRIBUTING.md                      # changed — how to add an entry
src/
├── content.config.ts                # changed — `experience`, `education`, shared schema, `strictFile` (R1–R4)
├── data/
│   ├── experience.yaml              # new — 2 entries from the CV (R13)
│   └── education.yaml               # new — 2 entries from the CV (R13)
├── lib/
│   ├── background.ts                # new — getBackground, BackgroundEntry (R3, R6, R7)
│   └── dates.ts                     # new — formatMonth (R5)
├── i18n/ui.ts                       # changed — keys of data-model.md (R11)
├── views/BackgroundView.astro       # new — list, period, layout, hover (R8–R10, R14, R15)
└── pages/
    ├── background.astro             # new — shell
    └── en/background.astro          # new — mirror
```

**Structure Decision**: same pattern as F03–F06 (`views/` + thin page shells, typed
collections, dictionary, access helper in `src/lib/`). New: YAML collections in `src/data/`,
as `CONTENU.md` §6 planned.

## Implementation notes for `/speckit-tasks`

1. Branch `007-background` exists; commit the spec and plan first (`docs:`).
2. Load the `impeccable` skill before any UI task; respect `DESIGN.md` (« Tableau du
   parcours », Layout › Responsive) and the tokens of `src/styles/global.css`.
3. Foundation (US4 + US2 data side): shared schema and both collections, the two YAML
   files, `lib/dates.ts`, `lib/background.ts`, dictionary keys. Quickstart §4.
4. US1: `BackgroundView` with the list structure of the contract, page shells. Quickstart §1.
5. US2: period markup (`<time>`, « present », same month). Quickstart §2.
6. US3: grid from `56rem`, mobile stack, header row. Quickstart §3.
7. Align `DESIGN.md`, `ROADMAP.md` and `CONTRIBUTING.md` (R12) once the widths are settled.
8. Final phase: `/impeccable audit`, `/impeccable polish`, captures at 375 px and 1280 px in
   both themes, Lighthouse and axe. Quickstart §5.
9. One commit per user story where the work allows it.

After the first delivery, a review with the maintainer changed the visual design and the
content: year rail, thread, prominent place, stack chips, hover (R14, R15), then entries
taken from the CV and the description / achievements split (R13, R16). `tasks.md` records
this as Phase 8.

## Complexity Tracking

No violation to justify.

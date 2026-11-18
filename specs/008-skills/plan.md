# Implementation Plan: Compétences

**Branch**: `008-skills` | **Date**: 2026-11-18 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/008-skills/spec.md`

## Summary

Skills become a `skills` collection loaded from a YAML map in `src/data/skills.yaml` through
the existing `strictFile` wrapper. A strict schema validates `name` (a string, or `{ fr, en }`
for a common noun), `domain` and `level` (closed enums whose tuple order is also the display
order and the rank) and `projects`
(`reference('projects')`, at least one). Because `reference()` does not check that the entry
exists, `src/lib/skills.ts` does: `getSkills(locale)` throws on a missing or draft project, a
duplicate proof, a duplicate name or an empty file, then returns the non-empty domains in
order with their skills sorted by level and French name, each with its proof projects
(`{ slug, title }`, taken from `getProjects(locale)`). `SkillsView` renders `/skills` and
`/en/skills`: a heading, an intro, a legend of the three levels, then one section per
domain. Each skill shows its name, its level in words with a decorative chess piece (pawn, knight, queen),
and its proof links. Stacked on mobile, where each domain title stays at the top of the screen
along its domain; from `56rem`, one full-width table per domain whose header row is the domain
title. Pointer devices get the row hover of the background page. No year is shown (R5).
`DESIGN.md`, `ROADMAP.md` and `CONTRIBUTING.md` are aligned.

## Technical Context

**Language/Version**: TypeScript 6 (strict), Astro 7.4, Node 22

**Primary Dependencies**: none added. Uses `astro:content` (`file()` loader, `reference()`,
zod) and the existing `strictFile`, `getProjects`, `localizePath`, `useTranslations`.

**Storage**: N/A — YAML in `src/data/skills.yaml`

**Testing**: no test framework. zod schema and the throws of `getSkills`
([contracts/skills.md](./contracts/skills.md), « Failure contract »), `npm run check`, then
the scenarios of [quickstart.md](./quickstart.md) (both languages, scratch failure checks,
proof links against `dist/`, Lighthouse, axe, VoiceOver, captures at 375 px and 1280 px in
both themes).

**Target Platform**: evergreen browsers; static files in `dist/`, deployed on Vercel

**Project Type**: static website (Astro)

**Performance Goals**: 0 kB client JS; text-only page; Lighthouse mobile ≥ 95 / 100 / 100 /
100

**Constraints**: no `<script>`; the only motion is the piece step on row hover (none under reduced motion); no UI literal
outside the dictionary; nothing page-specific in `skills.yaml`; nothing depends on
the build date

**Scale/Scope**: about 20 skills at most. 1 collection, 2 lib modules, 1 view, 2 page
shells, 16 dictionary keys (`skills.col.level` replaces `skills.since`), 1 YAML file with a first set of skills, 3 documents changed

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| #    | Principle                     | Status  | Notes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ---- | ----------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| I    | Simplicité (KISS/YAGNI/SOLID) | ✅ Pass | No dependency. No `SkillGroup` or `LevelMark` component: one caller (R8). No filter, search, per-skill page or back-link from projects. One array per closed list serves as enum and order (R4). SOLID (constitution 1.2.0): validation (`assertUniqueNames`, `assertProofs`) separate from mapping; the view only renders and reads `getSkills`, never the collection; one `LevelPiece` component for the two uses of a piece; piece URLs in `lib/pieces.ts`, shared with the background page; a new level or domain only touches `skill-scale.ts`, the dictionary and the piece map, which TypeScript forces to be complete. |
| II   | Statique, zéro JS client      | ✅ Pass | Two prerendered pages, no script, no `client:*`. Grouping and sorting at build.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| III  | Contenu = donnée typée        | ✅ Pass | One collection on a strict schema; adding a skill = one YAML block; every case of the failure contract breaks the build, including proofs that `reference()` alone would let through (R2).                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| IV   | Une source par information    | ✅ Pass | Proof titles come from the projects collection, never copied. A proper noun is written once (R3). `getSkills` is the access point the CV will reuse (R6).                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| V    | Leviers de campagne           | ✅ Pass | Not touched.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| VI   | Bilingue par dictionnaire     | ✅ Pass | Sixteen new keys (domains, levels, definitions, labels); `nav.skills` reused; same path under `/en`; untranslated projects fall back to French as elsewhere.                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| VII  | Accessibilité et performance  | ✅ Pass | Heading per domain and per skill; level said in words, pieces `aria-hidden`, no colour meaning (R9); proof links named by the project; layouts designed for 375 px and 1280 px (R10); unique title and description per language.                                                                                                                                                                                                                                                                                                                                                                                               |
| VIII | Styles par jetons             | ✅ Pass | Scoped styles in the view, tokens only; the piece size and column widths are component values, commented as `DESIGN.md` values. Impeccable loaded before UI tasks; audit + polish at the end.                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| IX   | Conventions et qualité        | ✅ Pass | English ids and values (`frontend`, `proficient`, `col.level`); `check` + `build` before commits; conventional commits; no published content removed.                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |

**Post-design re-check**: ✅ unchanged after Phase 1. No exception to justify; Complexity
Tracking is empty.

## Project Structure

### Documentation (this feature)

```text
specs/008-skills/
├── plan.md              # This file
├── research.md          # Phase 0 (R1–R12)
├── data-model.md        # Phase 1
├── quickstart.md        # Phase 1 (validation scenarios)
├── contracts/
│   └── skills.md        # routes, head, HTML structure, failure contract
├── checklists/
│   └── requirements.md
└── tasks.md             # Phase 2 (/speckit-tasks)
```

### Source Code (repository root)

```text
DESIGN.md · ROADMAP.md               # changed — skills list component, F08 plan line (R12)
CONTRIBUTING.md                      # changed — how to add a skill
src/
├── content.config.ts                # changed — `skills` collection and schema (R1–R5)
├── data/skills.yaml                 # new — first skills from the published projects (R11)
├── lib/
│   ├── skill-scale.ts               # new — DOMAINS, LEVELS (R4)
│   ├── pieces.ts                    # new — piece URLs shared with BackgroundView
│   └── skills.ts                    # new — getSkills and its checks (R2, R6, R7)
├── i18n/ui.ts                       # changed — keys of data-model.md
├── views/SkillsView.astro           # new — legend, domains, skills, layout (R8–R10)
├── views/BackgroundView.astro       # changed — reads piece URLs from lib/pieces.ts
├── components/LevelPiece.astro      # new — the piece of a level (pawn, knight, queen)
└── pages/
    ├── skills.astro                 # new — shell
    └── en/skills.astro              # new — mirror
```

**Structure Decision**: same pattern as F05–F07 (`views/` + thin page shells, typed
collection, dictionary, access helper in `src/lib/`). The `strictFile` wrapper from F07 is
reused as is.

## Implementation notes for `/speckit-tasks`

1. Branch `008-skills` exists; commit the spec and plan first (`docs:`).
2. Load the `impeccable` skill before any UI task; respect `DESIGN.md` and the tokens of
   `src/styles/global.css`.
3. Foundation (US4): schema and collection, `skills.yaml`, `lib/skills.ts` with its checks,
   dictionary keys. Quickstart §4. `DOMAINS` and `LEVELS` live in `lib/skill-scale.ts`, a
   module without imports, read by both `content.config.ts` and `lib/skills.ts`: the config
   never imports a module that calls `getCollection`.
4. US1: `SkillsView` with the structure of the contract, legend, page shells. Quickstart §1.
5. US2: proof links, English fallback. Quickstart §2.
6. US3: mobile stack, grid from `56rem`. Quickstart §3.
7. Ask the maintainer to confirm each level in `skills.yaml` before merge (R11).
8. Align `DESIGN.md`, `ROADMAP.md` and `CONTRIBUTING.md` (R12) once the layout is settled.
9. Final phase: `/impeccable audit`, `/impeccable polish`, captures at 375 px and 1280 px in
   both themes, Lighthouse and axe. Quickstart §5.
10. One commit per user story where the work allows it.

## Complexity Tracking

No violation to justify.

# Implementation Plan: Projets

**Branch**: `006-projects` | **Date**: 2026-11-12 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/006-projects/spec.md`

## Summary

Projects become two strict content collections: French files carry data and prose, optional
English files carry prose only. `src/lib/projects.ts` is the single access point: it drops
drafts in production, merges English prose over French data (French fallback when the
English file is missing), sorts, and throws on the rules a schema cannot see (orphan English
file, empty body, more than three featured, more than one featured `!!`). One
`ProjectList` component renders the move-list rows on `/projects` (detailed) and on the home
(featured, with notation and key move); `ProjectView` renders the project page (metadata,
key move with the evaluation symbol in the margin, optional optimized cover, free Markdown
body). `EvalMark` gives each symbol its colour and accessible name; the blue `!!` tokens
ship here. The language switch learns dynamic routes; the fallback page is `noindex`, out of
the sitemap, canonical to the French page. Two sample entries are provided.

## Technical Context

**Language/Version**: TypeScript 6 (strict), Astro 7.4, Node 22

**Primary Dependencies**: `@astrojs/markdown-satteri` declared at the exact version Astro 7.4 already installs (0.4.5, 0 byte added) so that `astro.config.mjs` can pass one HTML plugin to Astro's Markdown processor (commentator notes, R15). Uses `astro:content` (`glob` loader, zod, `image()`),
`astro:assets` (`<Picture>`, sharp already installed), `node:fs` in `src/data/seo.ts` for the
sitemap filter (R7). One-off dev step: sharp via `node -e` for the provisional cover (R13).

**Storage**: N/A — Markdown in `src/content/projects/{fr,en}/`, images in
`src/assets/projects/`

**Testing**: no test framework. zod schemas and build-time throws
([contracts/projects.md](./contracts/projects.md), « Failure contract »), `npm run check`,
then the scenarios of [quickstart.md](./quickstart.md) (both languages, scratch-branch
failure checks, draft grep, sitemap and head checks, weight, Lighthouse, axe, keyboard,
VoiceOver, captures at 375 px and 1280 px in both themes).

**Target Platform**: evergreen browsers; static files in `dist/`, deployed on Vercel

**Project Type**: static website (Astro)

**Performance Goals**: 0 kB client JS; home < 200 kB transferred (the list adds text only);
Lighthouse mobile ≥ 95 / 100 / 100 / 100; CLS 0 with a cover

**Constraints**: no `<script>`, no animation and no `view-transition-name` (F11); diagram
still; no UI literal outside the dictionary; no project image on the home or in lists; the
English file holds prose only

**Scale/Scope**: 10 projects at most at launch. 2 collections, 1 lib module, 2 components
(`EvalMark`, `ProjectList`), 2 views, 4 page shells, 1 changed
view (`HomeView`), changes to `Seo`, `BaseLayout`, `i18n/utils.ts`, `data/seo.ts`,
`astro.config.mjs`, about 20 dictionary keys, 5 tokens, 3 Markdown fixtures + 1 image,
3 documents aligned

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| #    | Principle                    | Status  | Notes                                                                                                                                                                                                                                                                                                                                      |
| ---- | ---------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| I    | Simplicité (KISS/YAGNI)      | ✅ Pass | One declared dependency, already installed by Astro (R15); no new code downloaded. Five `if`s instead of a custom loader (R2); a route pattern instead of a slug registry (R6); one boolean prop for the fallback head (R7); one list component (R9); notation written, not computed (R11). No filter, tag page, pagination or hover move. |
| II   | Statique, zéro JS client     | ✅ Pass | All pages prerendered through `getStaticPaths`; no script, no `client:*`; drafts filtered at build.                                                                                                                                                                                                                                        |
| III  | Contenu = donnée typée       | ✅ Pass | Two strict schemas plus cross-entry throws; adding a project = one `.md` and one image; every case of the failure contract breaks the build.                                                                                                                                                                                               |
| IV   | Une source par information   | ✅ Pass | Year, tech, links, cover, eval, move, flags exist only in the French file; the English schema rejects them. One `getProjects` for lists, pages and paths. `move.notation` holds both spellings of one move next to its squares (R11).                                                                                                      |
| V    | Leviers de campagne          | ✅ Pass | Lever 3 is the `featured` flag of each fiche; no list of featured slugs anywhere; limit of three enforced.                                                                                                                                                                                                                                 |
| VI   | Bilingue par dictionnaire    | ✅ Pass | All new labels in `ui.ts`; same paths under `/en`; fallback to French with a notice (`CONTENU.md` §5); English prose rewritten.                                                                                                                                                                                                            |
| VII  | Accessibilité et performance | ✅ Pass | Symbols have a text meaning; French text marked `lang="fr"` on fallback pages; rows are single links with visible focus; unique title/description (fallback excluded by `noindex`); cover with dimensions; captures at 375 and 1280 px in both themes in quickstart §7.                                                                    |
| VIII | Styles par jetons            | ✅ Pass | Five tokens taken from the `DESIGN.md` front matter; scoped styles; component-only sizes (row grid `4.5rem` / `2.5rem`, margin column `3rem` / `1.75rem`) commented as `DESIGN.md` values. Impeccable loaded before UI tasks; audit + polish at the end.                                                                                   |
| IX   | Conventions et qualité       | ✅ Pass | English names (`projects`, `keyMove`, `eval`, `move`); `check` + `build` before commits; conventional commits; removal rule unchanged.                                                                                                                                                                                                     |

**Post-design re-check**: ✅ unchanged after Phase 1. `src/lib/` is new but holds one module
with four callers (R3).

## Project Structure

### Documentation (this feature)

```text
specs/006-projects/
├── plan.md              # This file
├── research.md          # Phase 0 (R1–R14)
├── data-model.md        # Phase 1
├── quickstart.md        # Phase 1 (validation scenarios)
├── contracts/
│   └── projects.md      # routes, head, HTML structure, failure contract
├── checklists/
│   └── requirements.md
└── tasks.md             # Phase 2 (/speckit-tasks)
```

### Source Code (repository root)

```text
CONTENU.md · DESIGN.md · ROADMAP.md   # changed — aligned with the spec (R14)
astro.config.mjs                      # changed — sitemap filter (R7)
src/
├── content.config.ts                 # changed — `projects`, `projectsEn` (R1, R2)
├── content/projects/
│   ├── fr/sample-project.md          # new — published, featured, `!!` (R13)
│   ├── fr/sample-draft.md            # new — draft
│   └── en/sample-project.md          # new
├── assets/projects/sample-project.png  # new — provisional cover (R13)
├── lib/projects.ts                   # new — getProjects, featuredProjects, projectPaths (R3–R5)
├── data/seo.ts                       # changed — isUntranslatedProjectPath (R7)
├── i18n/
│   ├── ui.ts                         # changed — keys of data-model.md
│   └── utils.ts                      # changed — dynamic route patterns (R6)
├── styles/global.css                 # changed — invert and brilliant tokens (R8)
├── layouts/BaseLayout.astro          # changed — forwards `untranslated`
├── components/
│   ├── Seo.astro                     # changed — `untranslated` (R7)
│   ├── EvalMark.astro                # new (R8)
│   └── ProjectList.astro             # new — rows + legend (R9)
├── views/
│   ├── HomeView.astro                # changed — featured section (R10)
│   ├── ProjectsView.astro            # new
│   └── ProjectView.astro             # new (R12)
└── pages/
    ├── projects/index.astro          # new — shell
    ├── projects/[slug].astro         # new — shell + getStaticPaths
    └── en/projects/{index,[slug]}.astro  # new — mirrors
```

**Structure Decision**: same pattern as F03–F05 (`views/` + thin page shells, typed data,
dictionary). New: `src/lib/` for the one helper shared by views and route files, and
`src/content/projects/` next to `pages/`.

## Implementation notes for `/speckit-tasks`

1. Branch `006-projects` exists; commit the spec and plan first (`docs:`).
2. Load the `impeccable` skill before any UI task; start from
   `.impeccable/prototype/index.html` (move list) and `project.html` (project page), adjusted
   by clarifications 1–3 (symbol at the key move, cover before the body, blue `!!`).
3. Foundation (US3 + US4): schemas, `lib/projects.ts`, fixtures and cover, tokens,
   dictionary keys, `EvalMark`. Quickstart §3 and §4 (failure checks on a scratch branch).
4. US1: `ProjectList` (detail), `ProjectsView`, list shells. Quickstart §1.
5. US2: `ProjectView`, `[slug]` shells, route patterns in `utils.ts`. Quickstart §2.
6. US5: featured section in `HomeView`. Quickstart §5, home weight.
7. US6: `untranslated` in `Seo` / `BaseLayout`, notice and `lang`, sitemap filter.
   Quickstart §6.
8. Align `CONTENU.md`, `DESIGN.md`, `ROADMAP.md` (R14).
9. `/impeccable audit`, `/impeccable polish`, fixes, then quickstart §7 with captures at
   375 px (in an `<iframe>`) and 1280 px, light and dark, header and footer included.

Suggested commits (one per user story):
`feat: add typed project collections with sample entries` (US3 + US4),
`feat: add projects list` (US1), `feat: add project pages` (US2),
`feat: show featured projects on home` (US5),
`feat: fall back to French for untranslated projects` (US6),
`docs: align content model and design with projects` (R14), `a11y: …` / `fix: …` for audit
fixes.

## Complexity Tracking

No violation to justify. Size: the constitution says a feature SHOULD fit in about five
sessions; F06 has ten suggested commits. The maintainer chose to keep it whole (2026-11-12)
rather than split the French fallback (US6) into its own spec.

# Implementation Plan: CV en ligne et PDF

**Branch**: `009-cv` | **Date**: 2026-11-19 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/009-cv/spec.md`

## Summary

`getCv(locale)` in `src/lib/cv.ts` assembles one typed view model from the existing sources
(site, campaign, `getBackground`, `featuredProjects`, `getSkills`) and a new `languages`
collection (R1, R11). `CvView` renders it at `/cv` and `/en/cv`, with a print block (A4,
light, no header or footer, project URLs written out). A static endpoint `[file].tex.ts`
renders the same model into `dist/cv-fr.tex` and `dist/cv-en.tex` through
`src/lib/cv-latex.ts`, which fills the maintainer's LaTeX template (`src/cv/template.tex`,
preamble and macros only, adapted to XeTeX) and escapes every value (R3–R6). An Astro
integration compiles both files with Tectonic in `astro:build:done`, fails the build on any
error, missing glyph or second page, and leaves only `cv-fr.pdf` and `cv-en.pdf` (R2, R7).
Tectonic is installed by Homebrew locally and by a pinned, checksummed script in CI and on
Vercel (R8). The campaign calls to action become « Voir le CV » and « M'écrire » (R12).

## Technical Context

**Language/Version**: TypeScript 6 (strict), Astro 7.4, Node 22; LaTeX (XeTeX through
Tectonic 0.17.0)

**Primary Dependencies**: no npm dependency added. Tectonic, a system binary, is new (R2,
R8). Uses `astro:content`, `strictFile`, `getBackground`, `getSkills`, `featuredProjects`,
`formatMonth`, `localizePath`, `useTranslations`.

**Storage**: N/A — YAML in `src/data/languages.yaml`, TypeScript in `src/data/site.ts`

**Testing**: no test framework. zod schema, the failure contract
([contracts/cv.md](./contracts/cv.md)), `npm run check`, `npm run build`, then the
scenarios of [quickstart.md](./quickstart.md) (`pdfinfo`, `pdftotext`, print preview,
scratch failure checks, Lighthouse, axe, captures at 375 px and 1280 px in both themes).

**Target Platform**: evergreen browsers and PDF readers; static files in `dist/`, deployed on
Vercel

**Project Type**: static website (Astro)

**Performance Goals**: 0 kB client JS; text-only page; Lighthouse mobile ≥ 95 / 100 / 100 /
100; PDF compilation adds well under a minute to the build

**Constraints**: no `<script>`; no phone number anywhere; no UI literal outside the
dictionary; the PDF must stay one A4 page; the build needs Tectonic and, on a cold cache,
network access to its package bundle

**Scale/Scope**: 1 collection, 2 lib modules, 1 endpoint, 1 integration, 1 install script,
1 template, 1 view, 2 page shells, 12 dictionary keys, 1 lib for the availability text (shared with `Availability`), the button styles moved to `global.css` (second use), 4 documents changed

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| #    | Principle                     | Status       | Notes                                                                                                                                                                                                                                                                                                                                         |
| ---- | ----------------------------- | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| I    | Simplicité (KISS/YAGNI/SOLID) | ✅ Justified | No npm dependency. Tectonic is a new build tool, justified in Complexity Tracking (need, weight, alternatives: R2). SOLID: `getCv` provides, `CvView` and `renderCvLatex` only render, neither reads a collection; compilation lives in an integration, separate from rendering. No template engine, no CV component split (one caller each). |
| II   | Statique, zéro JS client      | ✅ Pass      | Two prerendered pages and two PDFs produced at build; no script, no `client:*`, no server.                                                                                                                                                                                                                                                    |
| III  | Contenu = donnée typée        | ✅ Pass      | Languages are a collection on a strict schema; an incomplete one fails the build. Every PDF failure (LaTeX error, missing glyph, second page, missing tool) fails the build.                                                                                                                                                                  |
| IV   | Une source par information    | ✅ Pass      | Page and PDF read the same `getCv` object (R1); only languages and city are new, each written once. The current CV text is not copied.                                                                                                                                                                                                        |
| V    | Leviers de campagne           | ✅ Pass      | Lever 4 (calls to action) and lever 5 (CV) change in `campaign.ts` only.                                                                                                                                                                                                                                                                      |
| VI   | Bilingue par dictionnaire     | ✅ Pass      | Seven `cv.*` keys; rubric labels reuse `background.*` and `skills.domain.*`; LaTeX labels come from the same dictionary.                                                                                                                                                                                                                      |
| VII  | Accessibilité et performance  | ✅ Pass      | One `h1`, a heading per rubric and entry, contact as a list, explicit download link; layouts for 375 px and 1280 px; unique title and description per language; PDF text extractable with metadata.                                                                                                                                           |
| VIII | Styles par jetons             | ✅ Pass      | Scoped styles in `CvView`, tokens only; the one global change (dark theme on screen only) is in `global.css`. Impeccable loaded before UI tasks; audit + polish at the end. The PDF follows the maintainer's classic CV layout (FR-016), a rule written in a « CV » section of `DESIGN.md` (T028).                                            |
| IX   | Conventions et qualité        | ✅ Pass      | English ids and paths (`languages`, `cv-fr.pdf`); `check` + `build` before commits, now with Tectonic installed in CI; conventional commits; no published content removed.                                                                                                                                                                    |

**Post-design re-check**: ✅ unchanged after Phase 1. One justified addition, below.

## Project Structure

### Documentation (this feature)

```text
specs/009-cv/
├── plan.md              # This file
├── research.md          # Phase 0 (R1–R12)
├── data-model.md        # Phase 1
├── quickstart.md        # Phase 1 (validation scenarios)
├── contracts/
│   └── cv.md            # routes, HTML, PDF, failure contract
├── checklists/
│   └── requirements.md
└── tasks.md             # Phase 2 (/speckit-tasks)
```

### Source Code (repository root)

```text
astro.config.mjs                     # changed — cv-pdf integration
vercel.json                          # changed — installCommand runs install-tectonic.sh
.github/workflows/ci.yml             # changed — install Tectonic before build
scripts/install-tectonic.sh          # new — pinned, checksummed Linux binary (R8)
CONTENU.md · CONTRIBUTING.md · DESIGN.md · ROADMAP.md  # changed (R12)
src/
├── content.config.ts                # changed — `languages` collection
├── data/
│   ├── languages.yaml               # new — French, Turkish, English
│   ├── site.ts                      # changed — contact.city
│   └── campaign.ts                  # changed — CV + email actions
├── lib/
│   ├── availability.ts              # new — availability text, shared with Availability
│   ├── cv.ts                        # new — getCv (R1)
│   └── cv-latex.ts                  # new — latex() escaping, renderCvLatex (R4, R6)
├── cv/template.tex                  # new — maintainer's preamble and macros, XeTeX (R4, R5, R7)
├── integrations/cv-pdf.ts           # new — Tectonic in astro:build:done (R2, R6, R7)
├── i18n/ui.ts                       # changed — cv.* keys
├── styles/global.css                # changed — dark theme on screen only (R10), button styles
├── components/                      # changed — Availability reads lib/availability; ProjectList detail column
├── views/CvView.astro               # new — page and print block
└── pages/
    ├── cv.astro · en/cv.astro       # new — shells
    └── [file].tex.ts                # new — LaTeX endpoint (R3)
```

**Structure Decision**: same pattern as F05–F08 (`views/` + thin shells, typed collection,
dictionary, access helper in `src/lib/`), plus the static endpoint pattern of
`robots.txt.ts`. `src/integrations/` and `src/cv/` are new folders, one file each.

## Implementation notes for `/speckit-tasks`

1. Branch `009-cv` exists; commit the spec, plan and tasks first (`docs(specs):`), with the
   `ROADMAP.md` change already made.
2. Ask the maintainer to paste their LaTeX CV again before writing `src/cv/template.tex`:
   keep only preamble and macros, apply R5, add the R7 check, no phone line.
3. Load the `impeccable` skill before any UI task; respect `DESIGN.md` and the tokens.
4. Foundation (US4): `languages` collection and file, `site.contact.city`, `getCv`,
   dictionary keys. Quickstart §4 (data cases).
5. US1: `CvView`, shells. Quickstart §1.
6. US2: template, `cv-latex.ts`, endpoint, integration, install script, CI and Vercel.
   Quickstart §2 and the failure cases of §4. Check that `pdftotext` keeps the reading order.
7. US3: print block and the `global.css` change. Quickstart §3.
8. US5: campaign actions. Quickstart §4 (end).
9. Align `CONTENU.md`, `CONTRIBUTING.md` (Tectonic install, adding a language), `DESIGN.md`
   (« CV » section, PDF layout rule) and `ROADMAP.md`.
10. Final phase: `/impeccable audit`, `/impeccable polish`, captures at 375 px and 1280 px in
    both themes, Lighthouse and axe. Quickstart §5.
11. One commit per user story where the work allows it.

## Complexity Tracking

| Violation                     | Why Needed                                                                                                  | Simpler Alternative Rejected Because                                                                                                                                                       |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Tectonic as a build tool      | FR-010 to FR-016: a classic LaTeX CV, produced at each build from the site data, in the maintainer's layout | Browser print to PDF by hand lags behind the data; headless Chrome is a ~150 MB dev dependency and drops the LaTeX layout; TeX Live is several GB; Typst means rewriting the template (R2) |
| Network at build (cold cache) | Tectonic downloads the LaTeX packages the template uses                                                     | Vendoring a TeX distribution in the repo is far heavier; a failed download fails the build, which FR-015 requires rather than shipping a stale PDF                                         |

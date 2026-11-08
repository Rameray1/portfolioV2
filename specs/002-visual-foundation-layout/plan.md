# Implementation Plan: Socle visuel et gabarit commun

**Branch**: `002-visual-foundation-layout` | **Date**: 2026-11-08 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/002-visual-foundation-layout/spec.md`

## Summary

Turn `DESIGN.md` into one global stylesheet of tokens (light values on `:root`, dark values
under `prefers-color-scheme: dark`, plus a minimal reset and base typography), self-host the
single Archivo variable font with a preload, and wrap every page in `BaseLayout.astro`
(`title`, `description`, `<slot />`), which alone renders `Header` (name + `Navigation`) and
`Footer`. Navigation entries come from `src/data/nav.ts`; contact links and the site name come
from `src/data/site.ts`. The theme follows the system with CSS only, so there is no script and
no flash. On mobile the six rubriques wrap onto two lines under the name: no popover is needed
(research R5). A provisional home page uses the layout to show all of it.

## Technical Context

**Language/Version**: TypeScript 6 (strict), Astro 7.4, Node 22 (`.nvmrc`)

**Primary Dependencies**: none added. The Archivo font file is copied from the prototype
(`@fontsource-variable/archivo` 5.2.6, latin subset, OFL), not installed as a package (R3).

**Storage**: N/A (typed TypeScript data modules: `src/data/nav.ts`, `src/data/site.ts`)

**Testing**: no test framework. `npm run check` (types enforce required props and data
shapes), `npm run build`, then the manual scenarios of [quickstart.md](./quickstart.md)
(themes, keyboard, 320 px, contrast, Lighthouse/axe in DevTools).

**Target Platform**: evergreen browsers (last two versions of Chrome, Firefox, Safari, iOS
Safari, Android Chrome); static files in `dist/`

**Project Type**: static website (Astro)

**Performance Goals**: home < 200 kB transferred, fonts included (SC-007; the font is ~90 kB);
0 kB client JS; Lighthouse mobile ≥ 95 performance, 100 accessibility; CLS ≤ 0.1

**Constraints**: zero `<script>`; no hard-coded visual value outside `global.css` (principle
VIII exceptions only); WCAG 2.2 AA in both themes; styles scoped per component

**Scale/Scope**: 1 stylesheet, 1 layout, 3 components, 2 data modules, 1 page, 1 font file

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| #    | Principle                    | Status  | Notes                                                                                                                                                                                                                                                              |
| ---- | ---------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| I    | Simplicité (KISS/YAGNI)      | ✅ Pass | No dependency. Rejected: Astro Fonts API, `modern-normalize`, stylelint, popover menu, `[data-theme]` override, theme toggle (R2, R3, R4, R5, R9). One helper function inline in `Navigation.astro`, no utils module.                                              |
| II   | Statique, zéro JS client     | ✅ Pass | Theme via `prefers-color-scheme` in CSS; skip link and nav are plain links; no `<script>`, no `client:*`.                                                                                                                                                          |
| III  | Contenu = donnée typée       | ✅ Pass | Nav entries and contact links are typed data modules (`satisfies`), checked by `astro check`. The provisional home text is temporary demo prose, replaced by campaign data in F05.                                                                                 |
| IV   | Une source par information   | ✅ Pass | Each token defined once in `global.css`; nav in `nav.ts`; name and contacts in `site.ts`, reused by F04 (JSON-LD) and F05 (CTA). The font URL is one import used by both `@font-face` and the preload (R3).                                                        |
| V    | Leviers de campagne          | N/A     | No lever in this feature. Contacts are stable identity data, not a lever (`CONTENU.md` §7), so they live in `site.ts`, not `campaign.ts`.                                                                                                                          |
| VI   | Bilingue par dictionnaire    | ✅ Pass | Constitution v1.0.1: the dictionary rule applies from F03, which converts the labels written here. UI labels (« Aller au contenu », rubriques, « Navigation principale ») are French literals kept in few places (`nav.ts`, `BaseLayout`, `Navigation`, `Footer`). |
| VII  | Accessibilité et performance | ✅ Pass | Contrast measured in R6 (all ≥ 5.88:1); skip link, landmarks, named nav, `aria-current`, focus ring, 24 px targets; `--duration` set to 0 under reduced motion; unique title/description required by props.                                                        |
| VIII | Styles par jetons            | ✅ Pass | Tokens from `DESIGN.md` only; component styles scoped; global = tokens + `@font-face` + reset + base. Visual feature: tasks end with Impeccable audit + polish.                                                                                                    |
| IX   | Conventions et qualité       | ✅ Pass | English file names, ids, fields (`#content`, `href`, `label`); `check` + `build` before each commit; commits `feat`, `a11y`, `docs`.                                                                                                                               |

**Principle VI note**: constitution amended to v1.0.1 (2026-11-08, after `/speckit-analyze`
finding C1) so that the dictionary rule explicitly starts with F03, as `ROADMAP.md` planned. No
dictionary is built now, since a single-locale dictionary would be speculative.

**Post-design re-check**: ✅ unchanged after Phase 1. Contracts add no dependency, script or
abstraction beyond the files listed below.

## Project Structure

### Documentation (this feature)

```text
specs/002-visual-foundation-layout/
├── plan.md              # This file
├── research.md          # Phase 0
├── data-model.md        # Phase 1 (nav entries, site data, page metadata, tokens)
├── quickstart.md        # Phase 1 (validation scenarios)
├── contracts/
│   ├── layout.md        # BaseLayout props, page skeleton, landmarks
│   └── tokens.md        # token names, values per theme, usage rules
├── checklists/
│   └── requirements.md
└── tasks.md             # Phase 2 (/speckit-tasks)
```

### Source Code (repository root)

```text
src/
├── assets/fonts/
│   ├── archivo-wdth-wght.woff2   # new — copied from .impeccable/prototype (R3)
│   └── OFL.txt                   # new — font licence, shipped with the file
├── styles/global.css             # new — @font-face, tokens (light + dark), reset, base
├── layouts/BaseLayout.astro      # new — <head>, skip link, Header, <main>, Footer
├── components/
│   ├── Header.astro              # new — name link + Navigation, heavy rule below
│   ├── Navigation.astro          # new — list from nav.ts, aria-current
│   └── Footer.astro              # new — email, GitHub, LinkedIn from site.ts
├── data/
│   ├── nav.ts                    # new — NavItem[] (6 rubriques, FR-011)
│   └── site.ts                   # new — name + contact (no phone field)
└── pages/index.astro             # rewritten — provisional home using BaseLayout
```

`.impeccable/prototype/` stays untouched (throwaway reference).

**Structure Decision**: Astro's conventional folders. `Header`, `Navigation` and `Footer` are
imported only by `BaseLayout` (FR-001). `Navigation` is a separate component from `Header`
because F03 adds the language switcher next to it, and its current-item logic is the only
non-trivial code of the feature.

## Implementation notes for `/speckit-tasks`

1. Load the `impeccable` skill before any UI task (AGENTS.md).
2. Copy the font and fetch its OFL licence (`npm pack @fontsource-variable/archivo@5.2.6`,
   take `LICENSE`, delete the tarball). No dependency is added.
3. Write `global.css` per [contracts/tokens.md](./contracts/tokens.md): `@font-face`, `:root`
   tokens, dark overrides, reduced-motion override, reset, base (body, links, focus,
   selection, `text-wrap`).
4. Add `src/data/site.ts` and `src/data/nav.ts` per [data-model.md](./data-model.md).
5. Build `BaseLayout`, `Header`, `Navigation`, `Footer` per
   [contracts/layout.md](./contracts/layout.md).
6. Rewrite `src/pages/index.astro` as the provisional home.
7. Validate with [quickstart.md](./quickstart.md); then the final phase: `/impeccable audit`,
   `/impeccable polish`, fixes, re-run quickstart.

Suggested commits (one per group): `feat: add design tokens and self-hosted font`,
`feat: add base layout with header, navigation and footer`, `feat: add provisional home page`,
`a11y: …` / `fix: …` for audit fixes.

## Complexity Tracking

No violation to justify.

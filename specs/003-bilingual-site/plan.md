# Implementation Plan: Site bilingue

**Branch**: `003-bilingual-site` | **Date**: 2026-11-09 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/003-bilingual-site/spec.md`

## Summary

Turn on Astro's built-in i18n routing (`fr` default without prefix, `en` under `/en`). All UI
labels move to `src/i18n/ui.ts`: a French reference dictionary and an English one typed with
the same keys, so `astro check` fails on any missing or extra key. `src/i18n/utils.ts` gives
`getLocale`, `useTranslations`, `localizePath` and `switchPath` (target of the switcher, with
fallback to the other home when the page does not exist, derived from the files in
`src/pages/`). Layout, header, navigation and footer read the locale from
`Astro.currentLocale`; a new `LangSwitcher.astro` is one plain link (`EN` / `FR`). The blog nav
entry is flagged French-only: in English it keeps `/blog/` and shows `(FR)`. The home markup
moves to `src/views/HomeView.astro`, rendered by two shells (`/` and `/en/`).

## Technical Context

**Language/Version**: TypeScript 6 (strict), Astro 7.4, Node 22

**Primary Dependencies**: none added (Astro i18n routing is built in)

**Storage**: N/A (typed modules: `src/i18n/ui.ts`, `src/data/nav.ts`)

**Testing**: no test framework. Types enforce dictionary completeness (`npm run check`); then
`npm run build` and the scenarios of [quickstart.md](./quickstart.md) (generated HTML,
switcher fallback, keyboard, VoiceOver, axe, Lighthouse).

**Target Platform**: evergreen browsers; static files in `dist/`

**Project Type**: static website (Astro)

**Performance Goals**: unchanged from F02: 0 kB client JS, each home < 200 kB transferred,
Lighthouse mobile ≥ 95 / 100 / 100 / 100

**Constraints**: zero `<script>`; no UI literal in components (constitution VI); identical
paths in both locales; French output unchanged except the switcher (SC-007)

**Scale/Scope**: 1 config block, 2 i18n modules (~15 keys), 1 new component, 4 components
and 1 data module changed, 1 view, 2 page shells

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| #    | Principle                    | Status  | Notes                                                                                                                                                                                                                                                                                      |
| ---- | ---------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| I    | Simplicité (KISS/YAGNI)      | ✅ Pass | No dependency: Astro i18n + one typed object per locale. Rejected: i18n libraries, JSON + schema, route dictionary, `fallback`/redirect pages, `<select>` switcher, browser-language redirect (R1, R2, R4, R6). `localizePath` is four lines instead of two `astro:i18n` APIs (R4).        |
| II   | Statique, zéro JS client     | ✅ Pass | Switcher is an `<a>`; target computed at build (R5); no `<script>`, no `client:*`.                                                                                                                                                                                                         |
| III  | Contenu = donnée typée       | ✅ Pass | Dictionary and nav are typed modules checked by `astro check`. Home pitch stays provisional prose in the view until F05, as in F02.                                                                                                                                                        |
| IV   | Une source par information   | ✅ Pass | Locale comes only from the URL via `Astro.currentLocale` (R3); page markup exists once in a view (R8); routes derived from `src/pages/` (R5). Exception: the two locale literals are repeated in `astro.config.mjs` (config cannot import `src/` TS), commented in both places.            |
| V    | Leviers de campagne          | N/A     | No lever touched; the pitch moves to `campaign.ts` in F05.                                                                                                                                                                                                                                 |
| VI   | Bilingue par dictionnaire    | ✅ Pass | This feature creates the dictionary and converts every F02 label (FR-007). Proper nouns (`site.name`) remain data. Blog stays French-only (R7). English prose rewritten (R9, to be approved).                                                                                              |
| VII  | Accessibilité et performance | ✅ Pass | `lang` per page; switcher with `lang`, `hreflang`, `aria-label` containing its visible text (WCAG 2.5.3); Blog (FR) announced as French; `/` and `/en/` share the title « Ramazan Kus », allowed since constitution v1.0.2 (unique per locale); keyboard/320 px/zoom checks in quickstart. |
| VIII | Styles par jetons            | ✅ Pass | Switcher reuses nav tokens (`--text-sm`, `--weight-semibold`, `--rule-heavy`, `--underline-offset-current`); styles scoped. Visual change: tasks end with Impeccable audit + polish.                                                                                                       |
| IX   | Conventions et qualité       | ✅ Pass | English names (`views/`, `frenchOnly`, keys); `check` + `build` before each commit; commits `feat`, `a11y`, `fix`.                                                                                                                                                                         |

**Post-design re-check**: ✅ unchanged after Phase 1. The contract adds no dependency, script or
abstraction beyond the files below.

## Project Structure

### Documentation (this feature)

```text
specs/003-bilingual-site/
├── plan.md              # This file
├── research.md          # Phase 0
├── data-model.md        # Phase 1 (locale, dictionary keys, nav entry)
├── quickstart.md        # Phase 1 (validation scenarios)
├── contracts/
│   └── i18n.md          # helpers, page pattern, component changes
├── checklists/
│   └── requirements.md
└── tasks.md             # Phase 2 (/speckit-tasks)
```

### Source Code (repository root)

```text
astro.config.mjs                  # changed — i18n block (R1)
src/
├── i18n/
│   ├── ui.ts                     # new — locales, fr, en, UiKey (R2)
│   └── utils.ts                  # new — getLocale, useTranslations, localizePath, switchPath (R3–R5)
├── views/
│   └── HomeView.astro            # new — home markup, styles, pitch per locale (R8)
├── pages/
│   ├── index.astro               # changed — shell: <HomeView />
│   └── en/index.astro            # new — shell: <HomeView />
├── layouts/BaseLayout.astro      # changed — lang from locale, skip link from dictionary
├── components/
│   ├── Header.astro              # changed — localized name link, LangSwitcher
│   ├── LangSwitcher.astro        # new — one link (R6)
│   ├── Navigation.astro          # changed — t(key), localized hrefs, frenchOnly (R7)
│   └── Footer.astro              # changed — labels from dictionary
└── data/nav.ts                   # changed — label → key, blog frenchOnly
```

**Structure Decision**: `src/i18n/` for the dictionary and helpers (Astro docs recipe layout);
`src/views/` for page bodies shared by both locales, as the roadmap asks. The header gets a
right-hand group (navigation + switcher) so the name stays left as in `DESIGN.md`.

## Implementation notes for `/speckit-tasks`

1. Load the `impeccable` skill before any UI task (AGENTS.md).
2. i18n config, `ui.ts`, `utils.ts` per [contracts/i18n.md](./contracts/i18n.md) and
   [data-model.md](./data-model.md); verify the three failure cases of quickstart §1.
3. Convert `nav.ts`, `BaseLayout`, `Navigation`, `Footer` to the dictionary; French build must
   match F02 (SC-007).
4. Add `LangSwitcher` and the header group.
5. Extract `HomeView`, add the English shell; get the maintainer's approval on the English
   pitch (R9).
6. Validate with [quickstart.md](./quickstart.md); then `/impeccable audit`, `/impeccable
polish`, fixes, re-run quickstart.

Suggested commits (one per group): `feat: add i18n routing and typed dictionary`,
`feat: translate layout labels through the dictionary`, `feat: add language switcher`,
`feat: add english provisional home`, `a11y: …` / `fix: …` for audit fixes.

## Complexity Tracking

No violation to justify.

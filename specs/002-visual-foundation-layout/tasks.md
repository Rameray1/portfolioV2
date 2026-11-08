---
description: 'Task list for F02 · Socle visuel et gabarit commun'
---

# Tasks: Socle visuel et gabarit commun

**Input**: Design documents from `specs/002-visual-foundation-layout/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: no automated test suite (not requested). Types (`npm run check`) enforce required
props and data shapes; each story ends with a manual validation task taken from
[quickstart.md](./quickstart.md).

**Organization**: tasks grouped by user story. Visual feature: **load the `impeccable` skill
before any task that touches UI** (AGENTS.md), respect `DESIGN.md` and the tokens of
`src/styles/global.css`, and finish with the Impeccable audit + polish phase (constitution
VIII, workflow gates).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: can run in parallel (different files, no dependency on an incomplete task)
- **[Story]**: US1–US4 from spec.md
- All paths are relative to the repository root.
- Every style value comes from a token (`var(--…)`); allowed literals: `0`, `1px`, `%`,
  breakpoints inside `@media`, one commented one-off value (constitution VIII).

---

## Phase 1: Setup

**Purpose**: the font file and its licence, no dependency added.

- [x] T001 Copy `.impeccable/prototype/assets/fonts/archivo-wdth-wght.woff2` to `src/assets/fonts/archivo-wdth-wght.woff2` (do not move or edit the prototype) (research R3)
- [x] T002 Get the OFL licence of the font: in a temporary directory outside the repository (`cd "$(mktemp -d)"`) run `npm pack @fontsource-variable/archivo@5.2.6`, extract `package/LICENSE` to `src/assets/fonts/OFL.txt`, delete the tarball; `package.json` and `package-lock.json` must stay unchanged (research R3)

---

## Phase 2: Foundational (blocking prerequisites)

**Purpose**: the light tokens, base styles and site data every story uses.

**⚠️ CRITICAL**: no user story can start before this phase is done.

- [x] T003 Create `src/styles/global.css` with, in order: (1) `@font-face { font-family: "Archivo"; src: url("../assets/fonts/archivo-wdth-wght.woff2") format("woff2"); font-weight: 100 900; font-stretch: 62% 125%; font-display: swap; }`; (2) a `:root` block holding **every token of [contracts/tokens.md](./contracts/tokens.md)** with its **light** value (colors, typography, `--space-1`…`--space-9` = `0.25 0.5 0.75 1 1.5 2 3 4 6` rem, `--rule-heavy: 2px`, `--rule-thin: 1px`, `--radius: 0`, `--page-max`, `--gutter`, `--measure`, `--weight-regular: 400`, `--weight-semibold: 600`, `--weight-bold: 700`, `--weight-black: 800`, `--underline-offset: 0.2em`, `--underline-offset-current: 0.35em`, `--focus-width: 2px`, `--focus-offset: 3px`, `--duration: 160ms`, `--ease-out`), grouped by the contract's sections with short French comments; (3) `@media (prefers-reduced-motion: reduce) { :root { --duration: 0ms; } }` (FR-017, R12). No dark block yet (US2)
- [x] T004 Append to `src/styles/global.css` the reset (research R4): `*, *::before, *::after { box-sizing: border-box; }`, `html { -webkit-text-size-adjust: 100%; text-size-adjust: 100%; }`, `body { margin: 0; }`, `img, svg, video { display: block; max-width: 100%; }`, `button, input, select, textarea { font: inherit; }`; then the base of [contracts/tokens.md § Global base](./contracts/tokens.md): `body` (`background: var(--color-paper)`, `color: var(--color-ink)`, `font-weight: var(--weight-regular)`, `font-family: var(--font-sans)`, `font-size: var(--text-base)`, `line-height: var(--leading-body)`, `font-stretch: var(--stretch-text)`, `font-variant-numeric: tabular-nums`), links (`color: inherit`, underline `var(--rule-thin)`, `text-underline-offset: var(--underline-offset)`, hover thickness `var(--rule-heavy)`), `::selection` (`var(--color-mark)` bg, `var(--color-mark-ink)` text), `h1, h2, h3 { text-wrap: balance; }`, `p { text-wrap: pretty; }`. Focus ring comes in US3
- [x] T005 [P] Create `src/data/site.ts`: `export interface Contact { email: string; github: string; linkedin: string }` (**no phone field**, FR-019), `export interface Site { name: string; contact: Contact }`, and `export const site = { name: 'Ramazan Kus', contact: { email: 'rkus.contact@gmail.com', github: 'https://github.com/Rameray1', linkedin: 'https://www.linkedin.com/in/ramazan-kus/' } } as const satisfies Site;` (data-model § Site, values confirmed 2026-11-08)
- [x] T006 [P] Create `src/data/nav.ts`: `export interface NavItem { label: string; href: \`/${string}\` }`("Root-relative path; must start with`/`") and `export const nav = [ … ] as const satisfies readonly NavItem[];`with, in this order:`{ label: 'À propos', href: '/about' }`, `{ label: 'Projets', href: '/projects/' }`, `{ label: 'Parcours', href: '/background' }`, `{ label: 'Compétences', href: '/skills' }`, `{ label: 'CV', href: '/cv' }`, `{ label: 'Blog', href: '/blog/' }` (FR-011, data-model § NavItem)

**Checkpoint**: `npm run check` passes.

---

## Phase 3: User Story 1 — Retrouver la même structure sur chaque page (Priority: P1) 🎯 MVP

**Goal**: every page renders inside one layout (header with name + nav, main, footer) and
provides its own title and description.

**Independent Test**: open the provisional home: header, nav, content and footer in that order;
tab title « Ramazan Kus » and description = the pitch; footer has Email, GitHub, LinkedIn and
no phone (quickstart §1–2).

### Implementation for User Story 1

- [x] T007 [US1] Create `src/layouts/BaseLayout.astro` per [contracts/layout.md](./contracts/layout.md): `interface Props { title: string; description: string }` (both required, FR-002); `import '../styles/global.css'` (the only import of it in the project); `import fontUrl from '../assets/fonts/archivo-wdth-wght.woff2?url'`; `<html lang="fr">` (FR-003); `<head>` with `meta charset="utf-8"`, `meta name="viewport" content="width=device-width, initial-scale=1"`, `<title>` = `title === site.name ? title : \`${title} · ${site.name}\``(R8),`meta name="description"`, `<link rel="preload" href={fontUrl} as="font" type="font/woff2" crossorigin />`, the two existing favicon links (`/favicon.svg`, `/favicon.ico`); `<body>`with`<Header />`, `<main id="content" tabindex="-1"><slot /></main>`, `<Footer />`. Scoped style: `main`centered with`max-width: var(--page-max)`, `margin-inline: auto`, `padding-inline: var(--gutter)`, `padding-block: var(--space-8)`; `main:focus { outline: none; }`(R10). No`<script>`
- [x] T008 [P] [US1] Create `src/components/Navigation.astro`: `<nav aria-label="Navigation principale"><ul>` with one `<li><a href={item.href}>{item.label}</a></li>` per entry of `nav` (from `src/data/nav.ts`), in array order. Scoped style per [contracts/layout.md § Behaviour](./contracts/layout.md): list reset (`list-style: none`, `margin: 0`, `padding: 0`), `display: flex; flex-wrap: wrap; gap: var(--space-1) var(--space-5)`; links `font-size: var(--text-sm)`, `text-decoration: none`, `padding-block: var(--space-1)`; hover underline `var(--rule-heavy)`. Current-item logic comes in US3
- [x] T009 [US1] Create `src/components/Header.astro`: `<header>` containing an inner wrapper with `<a href="/">{site.name}</a>` (FR-013; `font-weight: var(--weight-bold)`, `var(--text-base)`, no underline) and `<Navigation />`. Scoped style: `border-bottom: var(--rule-heavy) solid var(--color-rule)`; wrapper `max-width: var(--page-max)`, `margin-inline: auto`, `padding-inline: var(--gutter)`, `padding-block: var(--space-5)`, `display: flex; flex-wrap: wrap; align-items: baseline; justify-content: space-between; gap: var(--space-2) var(--space-6)` (DESIGN.md § Navigation, R5)
- [x] T010 [P] [US1] Create `src/components/Footer.astro`: `<footer>` with an inner wrapper and a `<ul>` of three links built from `site.contact`: « Email » → `` `mailto:${site.contact.email}` ``, « GitHub » → `site.contact.github`, « LinkedIn » → `site.contact.linkedin`; same tab, no `target="_blank"`; no phone, ever (FR-018, FR-019, R11). Scoped style: `border-top: var(--rule-heavy) solid var(--color-rule)`; wrapper centered like the header, `padding-block: var(--space-6)`; list reset, `display: flex; flex-wrap: wrap; gap: var(--space-2) var(--space-5)`, `font-size: var(--text-sm)`, links `padding-block: var(--space-1)`
- [x] T011 [US1] Rewrite `src/pages/index.astro` as the provisional home (FR-020): `<BaseLayout title="Ramazan Kus" description="Élève ingénieur en alternance chez Astrée Software, je développe des applications Java/Spring et Angular, du modèle de données à la mise en production.">` with an `<h1>` (the name, from `site.name`) and one `<p>` with the same pitch sentence (`CONTENU.md` §3, rules §9). Scoped style: `h1` in Display (`font-size: var(--text-display)`, `font-weight: var(--weight-black)`, `font-stretch: var(--stretch-display)`, `line-height: var(--leading-tight)`, `letter-spacing: var(--tracking-tight)`, `margin: 0 0 var(--space-5)`), `p` in Lead (`font-size: var(--text-xl)`, `line-height: var(--leading-snug)`, `max-width: 40ch` commented as one-off, `margin: 0`). Add a frontmatter comment: provisional, replaced in F05
- [x] T012 [US1] Validate US1 with quickstart §1 (missing `description` fails `npm run check`, then restore) and §2 (no `<script>`, `lang="fr"`, title, description, no phone grep); `npm run check && npm run build` pass

**Checkpoint**: MVP — the layout renders every page; light theme only.

---

## Phase 4: User Story 2 — Lire le site dans le thème de son système (Priority: P1)

**Goal**: the site follows the system light/dark preference from the first frame, AA in both.

**Independent Test**: quickstart §4 (emulated dark + Slow 4G, no white frame; live switch).

### Implementation for User Story 2

- [x] T013 [US2] In `src/styles/global.css`, add `color-scheme: light dark;` at the top of the `:root` block, and after it `@media (prefers-color-scheme: dark) { :root { … } }` redefining every color token with its **dark** value from [contracts/tokens.md § Colors](./contracts/tokens.md) (`--color-paper: #161513`, `--color-ink: #f1efea`, `--color-ink-muted: #aaa69d`, `--color-rule: #f1efea`, `--color-rule-soft: #36342f`, `--color-mark: #ff5a6a`, `--color-mark-ink: #161513`, `--color-mark-on-invert: #c8102e`, `--color-invert-bg: #f1efea`, `--color-invert-ink: #161513`, `--color-square-light: #e6e3dc`, `--color-square-dark: #b3afa5`, `--color-board-edge: #f1efea`). No `[data-theme]` selector (R2)
- [x] T014 [US2] In `src/layouts/BaseLayout.astro`, add `<meta name="color-scheme" content="light dark" />` right after the viewport meta (R2)
- [x] T015 [US2] Validate US2 with quickstart §4 in Chrome and a second engine (Safari or Firefox); confirm dark scrollbars and no white frame (SC-002). _Done in Chrome (forced light/dark, render-blocking stylesheet in `<head>`); Safari/Firefox pass left to the maintainer._

**Checkpoint**: both themes work; still no script.

---

## Phase 5: User Story 3 — Naviguer au clavier, au lecteur d'écran et sur mobile (Priority: P2)

**Goal**: skip link first, visible focus, current rubrique signalled visually and to assistive
tech, nav usable at 320 px and without JavaScript.

**Independent Test**: quickstart §5–6 (Tab → skip link → main; VoiceOver « page actuelle »;
320 px and 200 % zoom without horizontal scroll).

### Implementation for User Story 3

- [x] T016 [P] [US3] In `src/styles/global.css` base, add `:focus-visible { outline: var(--focus-width) solid var(--color-mark); outline-offset: var(--focus-offset); }` (FR-015, DESIGN.md § Primary)
- [x] T017 [US3] In `src/layouts/BaseLayout.astro`, add `<a class="skip-link" href="#content">Aller au contenu</a>` as the **first child of `<body>`**, before `<Header />` (FR-014). Scoped style: `position: absolute; left: var(--space-4); top: var(--space-4); transform: translateY(-200%)` (hidden at rest, `-200%` commented), `background: var(--color-ink); color: var(--color-paper); padding: var(--space-2) var(--space-4); text-decoration: none; z-index: 1` (commented); `.skip-link:focus { transform: none; }` (R10; `paper` on `ink` = 18.42:1 / 15.88:1)
- [x] T018 [US3] In `src/components/Navigation.astro`, compute the current item at build time (R7, data-model § Derived state): `const strip = (p: string) => (p.length > 1 ? p.replace(/\/+$/, '') : p)`; `const path = strip(Astro.url.pathname)`; for each item `const href = strip(item.href)`; `aria-current` = `"page"` if `path === href`, `"true"` if `path.startsWith(href + '/')`, otherwise omitted (`undefined`). Style `a[aria-current]`: `color: var(--color-mark)`, `font-weight: var(--weight-semibold)`, `text-decoration: underline`, `text-decoration-thickness: var(--rule-heavy)`, `text-underline-offset: var(--underline-offset-current)` (FR-010: not color alone)
- [x] T019 [US3] Validate US3 with quickstart §5 (keyboard, focus ring on every link, VoiceOver, scratch pages `src/pages/about.astro` and `src/pages/about/x.astro` created then **deleted, never committed**, JS disabled) and §6 (320 × 640 and 200 % zoom: rubriques on ≤ 2 lines, no horizontal scroll; if 3+ lines, stop and plan the R5 popover fallback). _Done in Chrome via DevTools protocol (Tab order, focus ring, `aria-current` page/true, 320 px and 200 % without overflow, nav on 2 lines). No script on the site, so JS-off is identical. VoiceOver pass left to the maintainer._

**Checkpoint**: WCAG keyboard/mobile behaviour in place.

---

## Phase 6: User Story 4 — Ajouter une rubrique en une ligne (Priority: P3)

**Goal**: adding a rubrique = one entry in `src/data/nav.ts`; an invalid entry fails the check.

**Independent Test**: quickstart §1 (entry without `href` fails `npm run check`) and §3 (one
added line appears on every page, `git diff --stat` = 1 file, 1 line).

### Implementation for User Story 4

- [ ] T020 [US4] At the top of `src/data/nav.ts`, add a short French comment: one entry per rubrique, array order = display order, `href` starts with `/`, a page inside a rubrique (`/projects/x`) marks it as current; labels move to the i18n dictionary in F03
- [ ] T021 [US4] Validate US4 with quickstart §1 (`{ label: 'Test' }` fails `npm run check`; restore) and §3 (`{ label: 'Test', href: '/test' }` appears last on the home nav with `astro dev --background`; revert)

**Checkpoint**: all four stories done.

---

## Phase 7: Design review, accessibility & polish (Impeccable)

**Purpose**: constitution gate for a visual feature — audit + polish before the feature is
done.

- [ ] T022 Run `/impeccable audit` on the provisional home and the layout components (both themes, 320 px and desktop); list findings
- [ ] T023 Run `/impeccable polish` and apply the accepted fixes in the files concerned (`src/styles/global.css`, `src/layouts/BaseLayout.astro`, `src/components/*.astro`, `src/pages/index.astro`), tokens only
- [ ] T024 Run quickstart §7 (axe DevTools 0 issues in light and dark; Lighthouse mobile performance ≥ 95, accessibility 100, CLS ≤ 0.1 — if CLS > 0.1, report it and revisit R3 before continuing; transferred < 200 kB) and §8 (hard-coded value grep over `src/components src/layouts src/pages`: every hit is an allowed exception)
- [ ] T025 Run `npm run check && npm run build` on the whole branch, and `git log main..HEAD --oneline` to check that every commit is conventional and in English

---

## Dependencies & Execution Order

- **Setup (T001–T002)**: no dependency.
- **Foundational (T003–T006)**: T003 → T004 (same file); T005 ∥ T006 any time. Blocks all
  stories (T003 needs T001 for the font URL).
- **US1 (T007–T012)**: T008 ∥ T010, then T009 (imports Navigation) → T007 (imports Header, Footer) → T011 → T012.
- **US2 (T013–T015)**: after US1 (needs `BaseLayout`). T013 ∥ T014 → T015.
- **US3 (T016–T019)**: after US1. T016 ∥ T017 ∥ T018 → T019. Independent of US2.
- **US4 (T020–T021)**: after US1 (needs the nav rendered).
- **Phase 7 (T022–T025)**: after all stories.

```text
T001 T002 ─► T003 ─► T004        T005 ∥ T006
                 │                    │
                 ▼                    ▼
          T008 ─► T009, T010 ─► T007 ─► T011 ─► T012   (US1)
                                                  │
                     ┌────────────────────────────┼──────────────┐
                     ▼                            ▼              ▼
          T013 ∥ T014 ─► T015 (US2)   T016 ∥ T017 ∥ T018 ─► T019 (US3)   T020 ─► T021 (US4)
                     └────────────────────────────┬──────────────┘
                                                  ▼
                                    T022 ─► T023 ─► T024 ─► T025
```

## Parallel Examples

- **Foundational**: T005 (`site.ts`) together with T006 (`nav.ts`), while T003–T004 write
  `global.css`.
- **US1**: T008 (`Navigation.astro`) together with T010 (`Footer.astro`).
- **US3**: T016 (`global.css`), T017 (`BaseLayout.astro`) and T018 (`Navigation.astro`) — three
  different files.
- **After US1**: US2, US3 and US4 touch mostly different files and can be done in any order;
  keep the order of the suggested commits below.

## Implementation Strategy

1. **MVP = Phases 1–3 (US1)**: tokens, font and the layout used by the home page.
2. **Then US2**: dark theme, a few lines of CSS and one meta.
3. **Then US3**: accessibility layer (skip link, focus, current rubrique).
4. **Then US4**: document and verify the one-line rule.
5. **Then Phase 7**: Impeccable audit + polish, final measurements.

Suggested commits (one per group, each ticking its own tasks in this file; `npm run check`
before each):

| Commit                                                     | Tasks     |
| ---------------------------------------------------------- | --------- |
| `docs(specs): F02 specification, plan and tasks`           | spec docs |
| `feat: add design tokens and self-hosted Archivo font`     | T001–T006 |
| `feat: add base layout with header, navigation and footer` | T007–T012 |
| `feat: follow the system light or dark theme`              | T013–T015 |
| `a11y: add skip link, focus ring and current rubrique`     | T016–T019 |
| `docs: explain how to add a rubrique in nav data`          | T020–T021 |
| `fix: apply design review fixes` (or `a11y:` if only a11y) | T022–T025 |

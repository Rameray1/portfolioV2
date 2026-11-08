# Research: Socle visuel et gabarit commun

All Technical Context items were known; this file records the decisions and what was
rejected.

## R1 — Token set and naming

- **Decision**: reuse the token names of the prototype (`.impeccable/prototype/styles.css`),
  which `DESIGN.md` already cites: `--color-*`, `--font-sans`, `--stretch-*`, `--text-*`,
  `--leading-*`, `--space-1…9`, `--rule-heavy`, `--rule-thin`, `--radius`, `--page-max`,
  `--gutter`, `--measure`, `--duration`, `--ease-out`. Full list in
  [contracts/tokens.md](./contracts/tokens.md). Spacing in `rem` (4 px base).
- **Rationale**: one vocabulary between `DESIGN.md`, the prototype and the code; the plan input
  (`--color-*`, `--space-*`, `--font-*`, `--radius-*`) is a subset.
- **Alternatives**: renaming to a new scheme (breaks the references in `DESIGN.md`); one token
  per component (`--nav-gap`) — rejected, components compose the shared scale.
- Tokens of components not built yet (`--color-square-*`, `--color-board-edge`,
  `--color-mark-on-invert`, `--color-invert-*`) are **not** defined in F02 (YAGNI, decided by
  the maintainer on 2026-11-08): their values stay in `DESIGN.md` and F05/F06 add them when the
  diagram and the inverted rows exist.

## R2 — Dark theme without flash

- **Decision**: dark values redefine the same custom properties inside
  `@media (prefers-color-scheme: dark) { :root { … } }`; `color-scheme: light dark` on `:root`
  and `<meta name="color-scheme" content="light dark">` in `<head>` so the browser paints the
  canvas and native controls dark before the stylesheet arrives. The stylesheet is in `<head>`
  (Astro bundles it as a render-blocking `<link>` or inlines it), so the first paint already
  has the right colors.
- **Rationale**: no flash is possible when the theme depends only on CSS media queries; FR-006
  forbids a toggle.
- **Alternatives**: `[data-theme]` attribute set by an inline script (needed only for a toggle,
  which is in the roadmap reserve; `DESIGN.md` mentions it as possible, spec Assumptions defer
  it); `light-dark()` per color — equivalent, but doubles every color declaration and makes the
  dark palette harder to read as one block.

## R3 — Font loading

- **Decision**: one variable woff2 (Archivo, `wdth` 62–125, `wght` 100–900, latin, 90 kB),
  copied from the prototype into `src/assets/fonts/` with its OFL licence. `@font-face` in
  `global.css` (`font-weight: 100 900; font-stretch: 62% 125%; font-display: swap`) points to
  it with a relative `url()`; Vite hashes it into `/_astro/`. `BaseLayout` imports the same
  file with `?url` and emits `<link rel="preload" as="font" type="font/woff2" crossorigin>`.
  Same content → same hashed URL, so the preload is reused (checked in quickstart).
- **Rationale**: native CSS first (principle I); one file covers every weight and width, so
  "preload the main weight" = preload that file. `swap` keeps text visible (FR-008).
- **Alternatives**:
  - Astro Fonts API (`fonts` config, `fontProviders.local()`, `<Font preload />`, stable since
    Astro 6): would also generate metric-adjusted fallbacks (less layout shift on swap). Rejected
    for now: a config-level abstraction for one local file, and the plan input asks for plain
    `@font-face`. Revisit only if the quickstart measures CLS > 0.1.
  - `@fontsource-variable/archivo` as an npm dependency: adds a package to get one file;
    rejected.
  - `font-display: optional`: no swap shift, but first visits may never show Archivo; rejected
    for a design built on one family.

## R4 — Reset

- **Decision**: a hand-written reset of a few rules in `global.css`: `box-sizing: border-box`,
  zero body margin, `-webkit-text-size-adjust: 100%`, media `display: block; max-width: 100%`,
  form controls inherit font, headings/paragraphs margin handled by components.
- **Alternatives**: `modern-normalize` (dependency for ~10 rules), none (browser defaults on
  margins and box model fight the 4 px grid).

## R5 — Mobile navigation: wrap, no popover

- **Decision**: the header is a wrapping flex row (name, then nav list); the list itself wraps.
  At 320 px the content width is 288 px (gutter = 1rem). The six labels total ~40 characters,
  ≈ 330 px at 15 px plus 5 gaps of `--space-5` (24 px) ≈ 450 px: **two lines** under the name.
  With the `EN` link of F03 (~490 px) it still fits two lines (576 px). The plan input's rule
  ("one or two lines → no folded menu") applies: no popover.
- **Rationale**: `DESIGN.md` states "la liste passe à la ligne sous le nom, sans menu ni
  JavaScript". Nothing to hide, nothing to open, works without JS (FR-012).
- **Alternatives**: popover (`popover` + `popovertarget`) — kept as the documented fallback if a
  later rubrique makes the list exceed two lines at 320 px; `<details>` menu — same, worse
  semantics for navigation.
- **Targets (WCAG 2.5.8)**: links get `padding-block: var(--space-1)`, giving ≈ 28 px height;
  short labels (« CV ») are under 24 px wide but the spacing exception applies thanks to the
  24 px gap.

## R6 — Contrast (WCAG 2.2 AA), measured

| Pair                                   | Light | Dark  | Need  |
| -------------------------------------- | ----- | ----- | ----- |
| `ink` on `paper` (text)                | 18.42 | 15.88 | 4.5   |
| `ink-muted` on `paper`                 | 7.45  | 7.52  | 4.5   |
| `mark` on `paper` (current page, ring) | 5.88  | 6.02  | 4.5/3 |
| `paper` on `mark` (selection)          | 5.88  | 6.02  | 4.5   |
| `paper` on `ink` (skip link)           | 18.42 | 15.88 | 4.5   |
| `rule-soft` on `paper` (1 px filets)   | 1.41  | 1.47  | —     |

- All text and indicators pass. `rule-soft` lines are decorative separators (structure is also
  carried by headings and spacing), so 1.4.11 does not apply; the heavy rules use `ink`.
- Current rubrique is not signalled by color alone: weight 600 + 2 px underline (FR-010).

## R7 — Current rubrique

- **Decision**: in `Navigation.astro`, normalize `Astro.url.pathname` and each `href` by
  stripping the trailing slash (root stays `/`). Exact match → `aria-current="page"`;
  `pathname` starts with `href + '/'` → `aria-current="true"` (a page inside the section, e.g.
  `/projects/foo`). Both styled by `[aria-current]`. At most one item matches because hrefs
  are distinct top-level paths. Home matches nothing (it is not a rubrique).
- **Alternatives**: `aria-current="page"` for descendants too (inaccurate for screen readers);
  a shared `isCurrent` util module (YAGNI: one caller).

## R8 — Page metadata and title format

- **Decision**: `BaseLayout` props `{ title: string; description: string }`, both required, so
  `astro check` fails when a page omits one (FR-002). Document title: `` `${title} · ${site.name}` ``,
  except when `title === site.name` (home) to avoid "Ramazan Kus · Ramazan Kus".
  `<meta name="description">` = `description`. `<html lang="fr">` (FR-003).
- **Alternatives**: page passes the full title (inconsistent suffixes); a `titleTemplate` prop
  (YAGNI).

## R9 — Enforcing "no hard-coded value" (SC-008)

- **Decision**: review + a grep in the quickstart over `src/components`, `src/layouts`,
  `src/pages` for hex colors and `px/rem/em` literals, allowing `0`, `1px`, `%` and media
  breakpoints (principle VIII). The Impeccable audit checks it too.
- **Alternatives**: stylelint with a custom rule (dependency + config for a 3-component
  codebase); rejected.

## R10 — Skip link and landmarks

- **Decision**: first child of `<body>`: `<a class="skip-link" href="#content">Aller au
contenu</a>`, visually hidden off-screen until `:focus`, then shown with `ink`/`paper`
  inverted colors. `<main id="content" tabindex="-1">` so focus moves reliably in every
  browser; `main:focus { outline: none }` is acceptable because the target is not interactive.
  Landmarks: `<header>`, `<nav aria-label="Navigation principale">`, `<main>`, `<footer>`.
- **Alternatives**: no `tabindex` (some browsers move the scroll but not the sequential focus
  start).

## R11 — Contact data

- **Decision**: `src/data/site.ts` holds `name` and `contact { email, github, linkedin }`.
  The type has no phone field (FR-019). Values (from the old portfolio, confirmed by the
  maintainer on 2026-11-08): `rkus.contact@gmail.com`, `https://github.com/Rameray1`,
  `https://www.linkedin.com/in/ramazan-kus/`. Footer links show the labels « Email »,
  « GitHub », « LinkedIn » (as in the prototype), same tab, no `target="_blank"`.
- **Alternatives**: put contacts in `campaign.ts` (they are not a campaign lever), hard-code in
  `Footer.astro` (F04 JSON-LD and F05 CTA need them).

## R12 — Reduced motion

- **Decision**: F02 adds no animation. Any transition must use `var(--duration)`, and
  `global.css` sets `--duration: 0ms` under `prefers-reduced-motion: reduce` (FR-017). One rule
  covers F02 and every later component.

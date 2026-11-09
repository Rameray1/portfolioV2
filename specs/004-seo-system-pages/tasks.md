---
description: 'Task list for F04 · SEO et pages système'
---

# Tasks: SEO et pages système

**Input**: Design documents from `specs/004-seo-system-pages/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/seo.md, quickstart.md

**Tests**: no automated test suite (not requested). Types (`npm run check`) enforce required
props and dictionary keys, `astro:env` validates `PUBLIC_NOINDEX`; each story ends with a
manual validation task taken from [quickstart.md](./quickstart.md).

**Organization**: tasks grouped by user story (spec US1–US5). Visual work (404 view, favicon,
share images): **load the `impeccable` skill before any task that touches UI or a visual
asset** (AGENTS.md), respect `DESIGN.md` and the tokens of `src/styles/global.css`, and finish
with the Impeccable audit + polish phase.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: can run in parallel (different files, no dependency on an incomplete task)
- **[Story]**: US1–US5 from spec.md
- All paths are relative to the repository root.
- No UI literal in components (constitution VI): every label is `t(key)`.
- Every style value comes from a token (`var(--…)`), constitution VIII exceptions only.
- Few code comments: only a short non-obvious _why_, in French, as in F03.

---

## Phase 1: Setup

**Purpose**: dependency, site address and the global switch.

- [ ] T001 Run `npm i @astrojs/sitemap@^3.7.4` so `package.json` and `package-lock.json` list it under `dependencies`. Do not use `astro add` and do not touch `astro.config.mjs`: the integration is registered in T015
- [ ] T002 In `astro.config.mjs`, add `site: 'https://ramazankus.example'` with a one-line French comment (placeholder, replaced at go-live, research R2), and `env: { schema: { PUBLIC_NOINDEX: envField.boolean({ context: 'client', access: 'public', default: false }) } }` (`import { defineConfig, envField } from 'astro/config'`, research R3). Keep the F03 `i18n` block unchanged. Run `npm run check`: `astro:env/client` must now type `PUBLIC_NOINDEX` as `boolean`

---

## Phase 2: Foundational (blocking prerequisites)

**Purpose**: one `Seo` component wired into the layout; noindex rule and route helpers shared
by every story.

**⚠️ CRITICAL**: no user story can start before this phase is done.

- [ ] T003 [P] Create `src/data/seo.ts` per [contracts/seo.md § seo.ts](./contracts/seo.md) and [data-model.md § Non-indexable paths](./data-model.md): ``export const noindexPaths: readonly `/${string}`[] = [];`` ("Bare paths (no `/en`), with trailing slash; apply to both locales. Starts empty.") and `export function isNoindexPath(pathname: string): boolean` ("Strips `/en`, normalises the trailing slash, looks up the list"). **No import from `astro:*` or from `src/i18n/utils.ts`** (it uses `import.meta.glob`): the config imports this module (research R4); do the `/en` strip inline
- [ ] T004 [P] In `src/i18n/utils.ts`, per [contracts/seo.md § utils](./contracts/seo.md) and research R5: add `export function isStatusPage(pathname: string): boolean` (true for `/404`, `/404/`, `/en/404`, `/en/404/`); filter status pages out of the `routes` set; add ``export function alternatePath(pathname: string, locale: Locale): `/${string}` | undefined`` (the other locale's `localizePath` if `routes` has it, else `undefined`); rewrite `switchPath` as `alternatePath(pathname, locale) ?? localizePath('/', other)`. Behaviour of `switchPath` on existing pages must not change (`/` ↔ `/en/`)
- [ ] T005 Create `src/components/Seo.astro` (props ``{ title: string; description: string; image?: { src: `/${string}`; alt: string } }``) rendering, in the order of [contracts/seo.md § Seo.astro](./contracts/seo.md): `<title>` (moved from `BaseLayout`: ``title === site.name ? title : `${title} · ${site.name}` ``), `<meta name="description">`, `<link rel="canonical">` = `new URL(withTrailingSlash(Astro.url.pathname), Astro.site)` (local helper, research R2), and one `<meta name="robots">`: `noindex, nofollow` if `PUBLIC_NOINDEX` (from `astro:env/client`), else `noindex` if `isNoindexPath(pathname) || isStatusPage(pathname)`, else none. On a status page, **no canonical** (R7). Open Graph and `hreflang` come in US1 and US2
- [ ] T006 In `src/layouts/BaseLayout.astro`: add optional prop ``image?: { src: `/${string}`; alt: string }``; replace the `<title>` and description lines (and the `documentTitle` computation) with `<Seo title={title} description={description} image={image} />`; keep `title` and `description` **required** (FR-002); add `<slot name="head" />` as the last child of `<head>` (contract § BaseLayout). Visible output of `/` and `/en/` unchanged
- [ ] T007 Validate: `npm run check && npm run build`; `dist/index.html` has canonical `https://ramazankus.example/`, `dist/en/index.html` has `https://ramazankus.example/en/`, no `robots` tag on either; temporarily delete `description` from `src/views/HomeView.astro` → `npm run check` fails, revert (quickstart §1); the header switcher still goes `/` ↔ `/en/`

**Checkpoint**: one place produces the head; foundation ready.

---

## Phase 3: User Story 1 — Un lien partagé s'affiche proprement (Priority: P1) 🎯 MVP

**Goal**: every page has a complete Open Graph preview with a per-locale default image, and the
site has its own favicon.

**Independent Test**: quickstart §2 and §6: `dist/index.html` and `dist/en/index.html` carry
the Open Graph block of the contract with an absolute `og:image` in their locale; both PNGs are
1200 × 630 and < 100 kB; the favicon shows `!` in red on paper, light and dark.

### Implementation for User Story 1

- [ ] T008 [P] [US1] In `src/i18n/ui.ts`, add key `seo.ogImageAlt` to `fr` and `en` (research R12): alt text of the default share image, describing what it shows (name + pitch line), French and English, `CONTENU.md` §9; get the wording approved by the maintainer
- [ ] T009 [US1] In `src/components/Seo.astro`, add after the robots tag, per [contracts/seo.md § Seo.astro](./contracts/seo.md) and research R8: `og:type` `website`, `og:site_name` `site.name`, `og:title` (the document title), `og:description`, `og:url` (= canonical; omitted on status pages), `og:locale` (`fr_FR` / `en_US`), `og:image` absolute (``new URL(image?.src ?? `/og/default-${locale}.png`, Astro.site)``), `og:image:width` `1200`, `og:image:height` `630`, `og:image:alt` (`image?.alt ?? t('seo.ogImageAlt')`), `twitter:card` `summary_large_image`. `og:locale:alternate` comes in US2
- [ ] T010 [P] [US1] Load `impeccable`. Create `scripts/og-image.html` (research R9): a standalone 1200 × 630 page, `@font-face` on `../src/assets/fonts/archivo-wdth-wght.woff2`, colours and sizes copied from `DESIGN.md` (commented as such, constitution VIII exception), one `<section id="fr">` and one `<section id="en">` with the pitch of each locale (`CONTENU.md` §3), only the `:target` one shown (`section:not(:target) { display: none }`), **no script** (constitution II). Composition per `DESIGN.md` « Image de partage par défaut »: paper background, name in Display (800, 72 %), 2 px ink rule, game-header line in muted ink, pitch in Lead, at most one red element (an evaluation symbol or the square of the move), no radius, no shadow; diagram optional
- [ ] T011 [US1] Render `public/og/default-fr.png` and `public/og/default-en.png` with the headless Chrome command of quickstart §6; check each is exactly 1200 × 630 (`sips -g pixelWidth -g pixelHeight`) and < 100 kB (re-render with flatter areas if not); look at both at 400 px wide: text readable (spec edge case). Get the maintainer's approval on the image
- [ ] T012 [P] [US1] Load `impeccable`. Favicon (research R10): in a throw-away venv in the scratchpad (`python3 -m venv … && pip install fonttools brotli`), instance `src/assets/fonts/archivo-wdth-wght.woff2` at `wght=800 wdth=72` and export the `exclam` glyph as an SVG path (`SVGPathPen`); `wdth=72` is the "72 %" of `DESIGN.md`, do not scale the glyph by 72 % again. Size and position it in a square viewBox with Impeccable (starting point: glyph ≈ 80 % of the height, centred), legible at 16 px (fallback: hand-drawn tapered bar + square dot). Write `public/favicon.svg`: square, no radius, `paper` `#ffffff` background, `mark` `#c8102e` glyph, inner `<style>` with `@media (prefers-color-scheme: dark)` → `paper-dark` `#161513` / `mark-dark` `#ff5a6a` (values from `DESIGN.md`). Render the light version to a 32 × 32 `public/favicon.ico` (Chrome screenshot + Pillow). Both replace the Astro default files. In `src/layouts/BaseLayout.astro`, icons become `<link rel="icon" href="/favicon.ico" sizes="32x32" />` then `<link rel="icon" href="/favicon.svg" type="image/svg+xml" />`
- [ ] T013 [US1] Validate quickstart §2 (Open Graph part) and §6: grep the `og:` / `twitter:` tags of `dist/index.html` and `dist/en/index.html` against the contract; open `dist/favicon.svg` with the system in light then dark; `/favicon.ico` served by `astro preview`

**Checkpoint**: US1 done — commit `feat: add open graph previews, favicon and share images`.

---

## Phase 4: User Story 2 — Les moteurs comprennent le site bilingue (Priority: P1)

**Goal**: `hreflang` alternates, a bilingual sitemap of indexable pages, Person JSON-LD on the
home.

**Independent Test**: quickstart §2 (`hreflang` part), §4 and §5.

### Implementation for User Story 2

- [ ] T014 [US2] In `src/components/Seo.astro`, after the canonical (contract order): when `alternatePath(pathname, locale)` is defined and the page is not a status page, emit `<link rel="alternate" hreflang="fr">`, `hreflang="en"` and `hreflang="x-default"` (→ the French URL), all absolute with trailing slash, plus `<meta property="og:locale:alternate">` (`en_US` / `fr_FR`) after `og:locale`. No alternate when the page exists in one locale only (FR-005)
- [ ] T015 [US2] In `astro.config.mjs`, register `sitemap({ i18n: { defaultLocale: 'fr', locales: { fr: 'fr', en: 'en' } }, filter: (page) => !isNoindexPath(new URL(page).pathname) })` with `import { isNoindexPath } from './src/data/seo.ts'` (research R4, R6). Extend the existing French comment so it says the sitemap `locales` mirror the i18n block too. If importing the TS module from the `.mjs` config fails, rename to `astro.config.ts` (no other change) and note it in research R4
- [ ] T016 [P] [US2] In `src/data/site.ts`, extend the `Site` interface and value with `person: { jobTitle: Record<Locale, string>; school: string; employer: string }` (data-model § Person): `school: 'IMT Mines Alès'`, `employer: 'Astrée Software'`, `jobTitle` proposed « Élève ingénieur en alternance » / "Software engineering apprentice"; get the wording approved by the maintainer
- [ ] T017 [US2] Create `src/components/PersonSchema.astro` (no props) rendering `<script type="application/ld+json" set:html={json} />` where `json` is `JSON.stringify(data).replace(/</g, '\\u003c')` and `data` is exactly the object of [contracts/seo.md § PersonSchema](./contracts/seo.md): `@context`, `@type: 'Person'`, `name`, `url` (absolute home of the locale), `jobTitle[locale]`, `affiliation` (`CollegeOrUniversity`), `worksFor` (`Organization`), `sameAs` (`site.contact.github`, `site.contact.linkedin`). No phone, no email (FR-012)
- [ ] T018 [US2] In `src/views/HomeView.astro`, render `<PersonSchema slot="head" />` inside `<BaseLayout>`
- [ ] T019 [US2] Validate quickstart §2 (`hreflang` on `/` and `/en/`), §4 (`dist/sitemap-0.xml`: `/` and `/en/` with `xhtml:link` pairs, no 404; temporary entry in `noindexPaths` removes a page from the sitemap and adds `robots noindex`, revert) and §5 (Schema.org validator on both homes: one `Person`, 0 error; `grep -c telephone` → 0)

**Checkpoint**: US2 done — commit `feat: add hreflang, bilingual sitemap and person structured data`.

---

## Phase 5: User Story 3 — Garder le site hors des moteurs avant la publication (Priority: P1)

**Goal**: one switch makes every page `noindex, nofollow` and `robots.txt` disallow all.

**Independent Test**: quickstart §3.

### Implementation for User Story 3

- [ ] T020 [US3] Create `src/pages/robots.txt.ts` per [contracts/seo.md § robots.txt.ts](./contracts/seo.md) and research R13: `export const GET: APIRoute` returning `new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })`; `PUBLIC_NOINDEX` true → `User-agent: *\nDisallow: /\n`; false → `User-agent: *\nAllow: /\n\nSitemap: ${new URL('sitemap-index.xml', site)}\n` (`site` from the endpoint context)
- [ ] T021 [US3] Validate quickstart §3: `PUBLIC_NOINDEX=true npm run build` → every `dist/**/*.html` has `noindex, nofollow` (the `grep -L` prints nothing), `dist/robots.txt` disallows all; plain `npm run build` → `Allow: /` + `Sitemap:` line; `PUBLIC_NOINDEX=maybe npm run build` fails (quickstart §1)
- [ ] T022 [P] [US3] In `ROADMAP.md` « Mise en ligne », add three checklist items: replace the placeholder `site` in `astro.config.mjs` by the real domain; add the host's rule so `/en/*` gets `en/404.html` with a 404 status (Netlify `public/_redirects`: `/en/* /en/404.html 404`; Cloudflare Pages: nothing; Vercel: a rewrite), research R7; check the large preview of `/` and `/en/` in LinkedIn Post Inspector (SC-007, quickstart §9)

**Checkpoint**: US3 done — commit `feat: add global noindex switch and robots.txt`.

---

## Phase 6: User Story 4 — Un visiteur égaré retrouve son chemin (Priority: P2)

**Goal**: a 404 page in French and English with three useful links, never indexed.

**Independent Test**: quickstart §7.

### Implementation for User Story 4

- [ ] T023 [P] [US4] In `src/i18n/ui.ts`, add to `fr` and `en` the keys of data-model § Dictionary additions: `notFound.title`, `notFound.description`, `notFound.lead` (one sentence, `CONTENU.md` §9: carries a number, e.g. the 404), `notFound.home`, `notFound.projects`, `notFound.email`. French title and description must differ from every other French page's, same in English (constitution VII). English rewritten, not translated; get the copy approved by the maintainer
- [ ] T024 [US4] Load `impeccable`. Create `src/views/NotFoundView.astro`: `<BaseLayout title={t('notFound.title')} description={t('notFound.description')}>`, an `<h1>`, one `<p>` with `notFound.lead`, and a `<ul>` of three links in the page locale: `localizePath('/', locale)`, `localizePath('/projects/', locale)`, `mailto:${site.contact.email}` (FR-014). Scoped styles, tokens only, composition per `DESIGN.md` (shaped with Impeccable; no new colour, no script)
- [ ] T025 [P] [US4] Create shells `src/pages/404.astro` and `src/pages/en/404.astro`, each only `<NotFoundView />` (F03 page pattern)
- [ ] T026 [US4] Validate quickstart §7 and §2 (404 part): `dist/404.html` and `dist/en/404.html` have `robots` `noindex`, no canonical, no `hreflang`, no `og:url`; the header switcher on each points to the other home; links correct in both locales; keyboard reaches each link with the focus ring; neither 404 is in `dist/sitemap-0.xml`

**Checkpoint**: US4 done — commit `feat: add bilingual 404 page`.

---

## Phase 7: User Story 5 — Présenter une nouvelle page sans effort (Priority: P2)

**Goal**: prove a new page needs only a title and a description, and document the three knobs.

**Independent Test**: spec US5 scenarios 1–3 with a throw-away page.

### Implementation for User Story 5

- [ ] T027 [US5] Create a throw-away `src/pages/tmp-seo.astro` using `BaseLayout` with only `title` and `description`; build; check canonical, Open Graph block and sitemap entry exist with no other code (SC-005); add `image={{ src: '/og/default-en.png', alt: 'test' }}` → `og:image` and `og:image:alt` follow the prop; delete the file. Nothing committed from this task
- [ ] T028 [US5] In `CONTRIBUTING.md` § Conventions, add one bullet in French: a page gives `title` + `description` to `BaseLayout` and gets canonical, preview, alternates and sitemap entry for free; optional `image`; a non-indexable page = its path in `src/data/seo.ts`; the whole site = `PUBLIC_NOINDEX=true` on the host

**Checkpoint**: US5 done — commit `docs: explain how a page is presented to search engines`.

---

## Phase 8: Design review, accessibility & polish (Impeccable)

**Purpose**: constitution gate for a visual feature — audit + polish before the feature is
done.

- [ ] T029 Run `/impeccable audit` on `/404.html`, `/en/404.html` (both themes, 320 px and desktop), the two share images and the favicon; list findings
- [ ] T030 Run `/impeccable polish` and apply the accepted fixes in the files concerned (`src/views/NotFoundView.astro`, `scripts/og-image.html` then re-render T011, `public/favicon.svg` / `.ico`), tokens only in CSS
- [ ] T031 Run quickstart §7 (accessibility) and §8: axe 0 errors on both 404 pages in light and dark (SC-010); 320 px and 200 % zoom without horizontal scroll; Lighthouse mobile on `/` and `/en/` with the switch off: SEO 100, accessibility 100, performance ≥ 95, < 200 kB transferred (SC-008, SC-011). If the only SEO finding is the canonical pointing to the placeholder domain instead of `localhost`, note it in the task and re-measure SC-008 after go-live (quickstart §9); `grep -rl '<script' dist --include='*.html'` lists only the two homes (JSON-LD). VoiceOver may be left to the maintainer; say so in the task note
- [ ] T032 Run `npm run check && npm run build` on the whole branch; read the markup of each new or changed component for literal UI text (constitution VI); `git log main..HEAD --oneline` → every commit conventional and in English

---

## Dependencies & Execution Order

- **Setup (T001–T002)**: T001 → T002.
- **Foundational (T003–T007)**: T003 ∥ T004, then T005 (imports both) → T006 → T007. Blocks all
  stories.
- **US1 (T008–T013)**: T008 → T009; T010 → T011; T012 independent; T013 last.
- **US2 (T014–T019)**: T014 and T015 independent of US1 (but T014 follows T009 if done in
  order, same file); T016 → T017 → T018; T019 last.
- **US3 (T020–T022)**: after Foundational; T020 reads the sitemap URL, so its validation T021
  is complete only after T015. T022 independent.
- **US4 (T023–T026)**: after Foundational; T023 → T024 → T025 → T026. T026 checks the sitemap,
  so after T015.
- **US5 (T027–T028)**: after US1 and US2 (checks preview and sitemap).
- **Phase 8 (T029–T032)**: after all stories.

```text
T001 ─► T002 ─► (T003 ∥ T004) ─► T005 ─► T006 ─► T007
                                                   │
        ┌──────────────────┬───────────────────────┼──────────────────┐
        ▼                  ▼                       ▼                  ▼
  T008─►T009            T014                    T020 ─► T021       T023 ─► T024
  T010─►T011            T015                    T022               T025 ─► T026
  T012                  T016─►T017─►T018
        └──►T013               └──►T019    (US2)   (US3)              (US4)
             (US1)                 │
                                   ▼
                            T027 ─► T028 (US5)
                                   │
                                   ▼
                       T029 ─► T030 ─► T031 ─► T032
```

## Parallel Examples

- **Foundational**: T003 (`src/data/seo.ts`) with T004 (`src/i18n/utils.ts`).
- **US1**: T008 (`ui.ts`), T010 (`scripts/og-image.html`) and T012 (favicon) together; T009
  after T008.
- **US2**: T016 (`site.ts`) while T014 (`Seo.astro`) and T015 (`astro.config.mjs`) progress.
- **Across stories**: T022 (`ROADMAP.md`) and T023 (`ui.ts`, if T008 is committed) any time
  after Foundational.

## Implementation Strategy

1. **MVP = Phases 1–3 (US1)**: one `Seo` component, canonical, Open Graph, share images,
   favicon. Already worth deploying.
2. **Then US2**: alternates, sitemap, Person JSON-LD.
3. **Then US3**: global switch + robots.txt — required before go-live.
4. **Then US4**: bilingual 404.
5. **Then US5**: prove and document the "two values per page" rule.
6. **Then Phase 8**: Impeccable audit + polish, final measurements.

Suggested commits (one per user story, each ticking its own tasks in this file;
`npm run check && npm run build` before each):

| Commit                                                             | Tasks             |
| ------------------------------------------------------------------ | ----------------- |
| `docs(specs): F04 specification, plan and tasks`                   | spec docs         |
| `feat: add open graph previews, favicon and share images`          | T001–T013 (+ MVP) |
| `feat: add hreflang, bilingual sitemap and person structured data` | T014–T019         |
| `feat: add global noindex switch and robots.txt`                   | T020–T022         |
| `feat: add bilingual 404 page`                                     | T023–T026         |
| `docs: explain how a page is presented to search engines`          | T027–T028         |
| `fix: apply design review fixes` (or `a11y:` if only a11y)         | T029–T032         |

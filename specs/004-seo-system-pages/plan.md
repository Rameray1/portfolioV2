# Implementation Plan: SEO et pages système

**Branch**: `004-seo-system-pages` | **Date**: 2026-11-09 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/004-seo-system-pages/spec.md`

## Summary

One `Seo.astro`, called by `BaseLayout`, writes every presentation tag (title, description,
canonical, Open Graph, `twitter:card`, `hreflang`, `robots`) from 2 page props (`title`,
`description`, plus an optional `image`); canonical, alternates and noindex are derived from
the URL, `Astro.site`, the generated routes and the `PUBLIC_NOINDEX` boolean (`astro:env`).
Per-page noindex is a path list in `src/data/seo.ts`, read by both `Seo` and the
`@astrojs/sitemap` filter. A static `robots.txt.ts` endpoint follows the switch. The home adds
a `Person` JSON-LD in a new `head` slot. Bilingual 404 = two shells over one `NotFoundView`.
Favicon (Archivo `!`, theme-aware SVG + ICO) and two share PNGs rendered once from an HTML
source with headless Chrome.

## Technical Context

**Language/Version**: TypeScript 6 (strict), Astro 7.4, Node 22

**Primary Dependencies**: `@astrojs/sitemap@^3.7.4` (added, build time only). Dev-time,
not in `package.json`: fontTools + brotli in a throw-away venv (favicon, R10), local Chrome
headless (share images, R9), Pillow (ICO).

**Storage**: N/A (typed modules: `src/data/seo.ts`, `src/data/site.ts`, `src/i18n/ui.ts`;
static files in `public/`)

**Testing**: no test framework. Types enforce required props and dictionary keys
(`npm run check`); `astro:env` validates the switch; then `npm run build` and the scenarios of
[quickstart.md](./quickstart.md) (generated HTML greps, both switch states, sitemap,
Schema.org validator, keyboard, VoiceOver, axe, Lighthouse).

**Target Platform**: evergreen browsers, search engines and link previewers; static files in
`dist/`

**Project Type**: static website (Astro)

**Performance Goals**: unchanged: 0 kB executed client JS, home < 200 kB transferred,
Lighthouse mobile ≥ 95 / 100 / 100 / 100 (SEO 100 with the switch off)

**Constraints**: no `<script>` other than the JSON-LD data block; no UI literal outside the
dictionary; the site URL is a placeholder until go-live (R2); 404 per-locale serving depends
on the host chosen at go-live (R7)

**Scale/Scope**: 1 config change, 3 new components/views (`Seo`, `PersonSchema`,
`NotFoundView`), 3 new pages (2 × 404, `robots.txt.ts`), 1 new data module, 5 changed modules
(`BaseLayout`, `HomeView`, `i18n/utils`, `ui.ts`, `site.ts`), 4 static assets + 1 HTML source

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| #    | Principle                    | Status  | Notes                                                                                                                                                                                                                                                                                                                                                             |
| ---- | ---------------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| I    | Simplicité (KISS/YAGNI)      | ✅ Pass | One dependency, justified below. Rejected: `astro-seo`, `astro-robots-txt`, `satori`/`resvg`, `schema-dts`, own sitemap endpoint, web manifest, `apple-touch-icon`, host-specific 404 config before the host is chosen (R1, R6, R7, R9–R11, R13). `noindexPaths` starts empty but is required by FR-006.                                                          |
| II   | Statique, zéro JS client     | ✅ Pass | `output: 'static'` unchanged; `robots.txt.ts` is prerendered at build. The only `<script>` is `type="application/ld+json"`: inert data, never executed (R11). Env switch inlined at build.                                                                                                                                                                        |
| III  | Contenu = donnée typée       | ✅ Pass | Person facts in `site.ts`, noindex list in `seo.ts`, labels in `ui.ts`, all typed. `title`/`description` required by type (FR-002).                                                                                                                                                                                                                               |
| IV   | Une source par information   | ✅ Pass | Canonical/alternates derived from the URL and the one `routes` set shared with the switcher (R5); one noindex list read by `Seo` and the sitemap (R4); site URL in `site` only; email from `site.contact`. Accepted exceptions: locale literals repeated in the sitemap `i18n` option (as F03); school/employer still spelled in the provisional pitch until F05. |
| V    | Leviers de campagne          | N/A     | Pitch untouched (moves to `campaign.ts` in F05). The share images embed it; re-render command in quickstart §6.                                                                                                                                                                                                                                                   |
| VI   | Bilingue par dictionnaire    | ✅ Pass | 404 labels and image alt via `ui.ts` in both locales (R12); `jobTitle` is person data per locale, not a UI label. One share image per locale. English rewritten, approved at implementation.                                                                                                                                                                      |
| VII  | Accessibilité et performance | ✅ Pass | Unique title/description per locale (404 titles included); `hreflang` links pair translations; 404 keyboard/VoiceOver/axe in quickstart; share PNGs never loaded by pages (SC-011); Lighthouse SEO 100 with switch off.                                                                                                                                           |
| VIII | Styles par jetons            | ✅ Pass | `NotFoundView` styles scoped, tokens only. Favicon and share image use `DESIGN.md` colour values directly: they are files outside the CSS, so tokens cannot apply; values copied from `DESIGN.md` and commented. Visual feature: tasks end with Impeccable audit + polish.                                                                                        |
| IX   | Conventions et qualité       | ✅ Pass | English names (`seo.ts`, `NotFoundView`, `noindexPaths`); `check` + `build` before each commit; commits `feat`, `a11y`, `fix`.                                                                                                                                                                                                                                    |

**Dependency justification (principle I)** — `@astrojs/sitemap`: need = bilingual sitemap with
`xhtml:link` pairs and per-page exclusion (FR-009, FR-010); weight = 0 kB shipped, build-time
deps `sitemap` + `zod`; native alternative = a ~50-line endpoint re-implementing URL grouping,
`xhtml:link` and future chunking, rejected because the official integration is maintained
with Astro and already excludes status pages per locale (R6).

**Post-design re-check**: ✅ unchanged after Phase 1. The contract adds no script, client
directive or abstraction beyond the files below.

## Project Structure

### Documentation (this feature)

```text
specs/004-seo-system-pages/
├── plan.md              # This file
├── research.md          # Phase 0
├── data-model.md        # Phase 1 (site, switch, presentation, noindex list, person, keys, assets)
├── quickstart.md        # Phase 1 (validation scenarios)
├── contracts/
│   └── seo.md           # exports and exact HTML/robots/JSON-LD output
├── checklists/
│   └── requirements.md
└── tasks.md             # Phase 2 (/speckit-tasks)
```

### Source Code (repository root)

```text
astro.config.mjs                  # changed — site, env.schema, sitemap integration (R2, R3, R6)
package.json                      # changed — @astrojs/sitemap
scripts/
└── og-image.html                 # new — source of the share images, not published (R9)
public/
├── favicon.svg                   # replaced (R10)
├── favicon.ico                   # replaced (R10)
└── og/
    ├── default-fr.png            # new (R9)
    └── default-en.png            # new (R9)
src/
├── data/
│   ├── seo.ts                    # new — noindexPaths, isNoindexPath (R4)
│   └── site.ts                   # changed — person (R12)
├── i18n/
│   ├── ui.ts                     # changed — notFound.*, seo.ogImageAlt (R12)
│   └── utils.ts                  # changed — isStatusPage, alternatePath; routes without 404 (R5)
├── components/
│   ├── Seo.astro                 # new (R1, R2, R8)
│   └── PersonSchema.astro        # new (R11)
├── layouts/BaseLayout.astro      # changed — <Seo />, image prop, icons, head slot
├── views/
│   ├── HomeView.astro            # changed — <PersonSchema slot="head" />
│   └── NotFoundView.astro        # new (R7)
└── pages/
    ├── 404.astro                 # new — shell
    ├── en/404.astro              # new — shell
    └── robots.txt.ts             # new — endpoint (R13)
```

**Structure Decision**: same layout as F03 (`views/` + thin page shells). `src/data/seo.ts`
sits next to `site.ts` and `nav.ts` because the config must import it without `astro:*`.
`scripts/` is new and holds only the share-image source: it is a design asset source, not
build code.

## Implementation notes for `/speckit-tasks`

1. Create the feature branch `004-seo-system-pages` from `main` before the first commit.
2. Load the `impeccable` skill before any UI or asset task (404 view, favicon, share image).
3. Foundation: `site`, `env.schema`, `seo.ts`, `utils.ts` changes, `Seo.astro`, `BaseLayout`
   wiring; verify quickstart §1–§3. Existing pages render the same visible output.
4. Sitemap integration + `robots.txt.ts`; quickstart §3–§4.
5. `PersonSchema` + `site.person`; get `jobTitle` wording approved; quickstart §5.
6. Dictionary keys + `NotFoundView` + two shells; get the 404 copy approved; quickstart §7.
7. Favicon and share images (Impeccable shapes the image composition); quickstart §6.
8. `/impeccable audit`, `/impeccable polish`, fixes, then quickstart §8.
9. Add to `ROADMAP.md` « Mise en ligne »: replace the placeholder `site`, add the host's
   per-locale 404 rule (R7). (docs change, own commit.)

Suggested commits (one per user story): `feat: present every page to search engines and
networks` (US2 + US5 foundation), `feat: add global noindex switch and robots.txt` (US3),
`feat: add favicon and default share images` (US1), `feat: add bilingual 404 page` (US4),
`a11y: …` / `fix: …` for audit fixes.

## Complexity Tracking

No violation to justify.

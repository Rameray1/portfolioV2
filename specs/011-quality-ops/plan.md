# Implementation Plan: Qualité et exploitation

**Branch**: `011-quality-ops` | **Date**: 2026-11-21 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/011-quality-ops/spec.md`

## Summary

Four small operational pieces, then one audit. lychee checks every link of the built site
(pages, anchors, files, own absolute URLs remapped to `dist/`) in the existing CI job, with
retries and commented exclusions in `lychee.toml` (R1–R3). Redirects stay in the `redirects`
block of `astro.config.mjs`: instant meta refresh, canonical to the target, checked by
lychee for free (R4). Three security headers go into the first `routes` entry of
`vercel.json`, the only form Vercel accepts next to the English 404 route (R5). Audience
comes from Vercel Web Analytics and real-visitor performance from Vercel Speed Insights: two
deferred, same-origin, cookieless script tags in `BaseLayout`, rendered only for production
builds, without the `@vercel/*` npm packages (R6, R9). Last, a manual Lighthouse, axe and
keyboard audit on every page type, both languages and themes, recorded in `audit.md`, each
gap fixed in the component that carries it (R7, R8).

## Technical Context

**Language/Version**: TypeScript 6 (strict), Astro 7.4, Node 22

**Primary Dependencies**: none added to `package.json`. CI action
`lycheeverse/lychee-action@v2`; Vercel Web Analytics and Speed Insights (host features,
scripts served by Vercel on the site's origin)

**Storage**: N/A. Configuration in `lychee.toml`, `astro.config.mjs`, `vercel.json`

**Testing**: no test framework. `npm run check && npm run build`; lychee locally and in CI;
the scenarios of [quickstart.md](./quickstart.md): `curl -I` on the preview and production,
Lighthouse (DevTools, mobile), axe DevTools, keyboard, captures at 375 px and 1280 px in both
themes for UI fixes

**Target Platform**: evergreen browsers; static files in `dist/`, deployed on Vercel
(`ramazankus.dev`, HTTPS and HSTS already on, C6)

**Project Type**: static website (Astro)

**Performance Goals**: Lighthouse mobile ≥ 95 / 100 / 100 / 100 on `/`, a project page and
`/en/`; home < 200 kB transferred including both measurement scripts (a few kB); link check
under a few minutes in CI

**Constraints**: two external `<script defer>` tags for the whole site, production only, no
inline script; no Lighthouse CI, no
hash-based CSP (`ROADMAP.md`); no scheduled link check (clarification 2026-11-21); production
stays `noindex` until C5, so SEO is audited on a local build without it

**Scale/Scope**: 1 new config file (`lychee.toml`), 3 changed configs (`ci.yml`,
`vercel.json`, `astro.config.mjs`), 1 changed layout (`BaseLayout.astro`), 1 audit record
(`audit.md`), then audit fixes in the components concerned (unknown until the audit runs)

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| #    | Principle                       | Status    | Notes                                                                                                                                                                                                                                                                                                                              |
| ---- | ------------------------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| I    | Simplicité d'abord, SOLID       | Pass      | No npm dependency: `@vercel/analytics` and `@vercel/speed-insights` are replaced by the two script tags they would inject (R9). lychee is a CI action. Redirects keep the existing Astro block (R4). No scheduled run, no cache, no adapter.                                                                                       |
| II   | Statique, zéro JS client        | Exception | Two `<script defer>` tags, audience and real-visitor performance, justified: no HTML/CSS way to count visits or measure Core Web Vitals on a static site; same origin, a few kB, deferred, production only; every page works identically when they are blocked (R6, FR-013). No `client:*`, no inline script. Output stays static. |
| III  | Contenu = donnée typée          | Pass      | No content change. A redirect to a missing page fails CI (R4).                                                                                                                                                                                                                                                                     |
| IV   | Une seule source                | Pass      | Redirects in `astro.config.mjs` only, exclusions in `lychee.toml` only, headers in `vercel.json` only, both scripts in `BaseLayout` only.                                                                                                                                                                                          |
| V    | Leviers = données               | Pass      | Untouched.                                                                                                                                                                                                                                                                                                                         |
| VI   | Bilingue par dictionnaire       | Pass      | No new UI label. Audit fixes that touch text go through the dictionary.                                                                                                                                                                                                                                                            |
| VII  | Accessibilité, performance      | Pass      | This feature verifies VII as a whole (R7) and fixes every gap (R8). Both scripts counted in the 200 kB budget; Speed Insights then keeps watching real-visitor performance.                                                                                                                                                        |
| VIII | Jetons, direction visuelle      | Pass      | No new visual direction. UI fixes use the tokens, follow `DESIGN.md`, load `impeccable`, and are checked at 375 / 1280 px, both themes, header and footer.                                                                                                                                                                         |
| IX   | Conventions, qualité vérifiable | Pass      | English names; `npm run check && npm run build` before each commit, plus the link check in CI (FR-001). Redirects stay in `astro.config.mjs` as IX requires. Commits `docs`, `ci`, `feat`, `chore`, `a11y`, `perf`, one per user story; C6 roadmap tick ships with this PR.                                                        |

**Post-design re-check**: unchanged. The single exception (II) is recorded in Complexity
Tracking.

## Project Structure

### Documentation (this feature)

```text
specs/011-quality-ops/
├── plan.md              # This file
├── research.md          # Phase 0: R1–R8
├── data-model.md        # Phase 1: configuration entities
├── quickstart.md        # Phase 1: validation scenarios
├── contracts/
│   └── operations.md    # Phase 1: lychee, redirects, headers, script, audit record
├── audit.md             # created during implementation (R7)
└── tasks.md             # Phase 2 (/speckit-tasks)
```

### Source Code (repository root)

```text
.github/workflows/ci.yml       # + lychee step after the build
lychee.toml                    # NEW: root dir, remap, fragments, retries, exclusions
vercel.json                    # + first routes entry with the three headers
astro.config.mjs               # + VERCEL_ENV in env.schema; redirects block unchanged
src/layouts/BaseLayout.astro   # + analytics and speed insights scripts when VERCEL_ENV is production
src/components/, src/views/    # audit fixes, where the gaps are found
ROADMAP.md                     # C6 ticked (already done), F11 ticked at the end
```

**Structure Decision**: existing single Astro project. Operational config stays at the repo
root next to `vercel.json`; nothing goes into `src/lib/` since no page reads new data.

## Complexity Tracking

| Violation                                           | Why Needed                                                                                                                     | Simpler Alternative Rejected Because                                                                                                                                     |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Two client `<script>` tags (principle II exception) | Audience and real-visitor performance are in the spec (US3) and need the browser to report a page view and its Core Web Vitals | No HTML/CSS mechanism counts visits or measures LCP, INP and CLS; Vercel Hobby gives no usable server logs; a tracking pixel `<img>` has no supported endpoint on Vercel |

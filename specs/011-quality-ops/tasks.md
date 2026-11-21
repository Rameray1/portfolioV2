---
description: 'Task list for F11 · Qualité et exploitation'
---

# Tasks: Qualité et exploitation

**Input**: Design documents from `specs/011-quality-ops/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/operations.md,
quickstart.md

**Tests**: no automated test suite (not requested). The link check (US1) is itself the new
automated gate; every story ends with a manual validation task from
[quickstart.md](./quickstart.md).

**Organization**: tasks grouped by user story (spec US1–US5). Phases follow the dependencies
rather than the strict priority order: the audit (US2, P1) runs **last**, because it measures
the site with the scripts and headers of US3 and US5 in place.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: can run in parallel (different files, no dependency on an incomplete task)
- **[Story]**: US1–US5 from spec.md
- All paths are relative to the repository root.
- **No npm dependency** (plan, Constitution Check I). **Only two `<script defer src>` tags**,
  production only, no inline script, no `client:*` (research R6, R9).
- Few code comments: only a short non-obvious _why_, in French.
- Any task that touches UI: load the `impeccable` skill first, respect `DESIGN.md` and the
  tokens of `src/styles/global.css`, check at 375 px (in a 375 px `<iframe>`) and 1280 px,
  light and dark, header and footer included (AGENTS.md).
- « Scratch » checks are done on a throw-away change and reverted; nothing from them is
  committed.
- Built site today: `dist/` holds `index.html`, `about/`, `background/`, `cv/`, `skills/`,
  `projects/` (`meetz`, `portfolio`, `shipment-preparation`, `sportify`, redirect
  `sample-project`), `cv-fr.pdf`, `cv-en.pdf`, `og/`, `404.html`, `en/…`,
  `sitemap-index.xml`, `sitemap-0.xml`. External links in content and data:
  `github.com/…` (4), `www.linkedin.com/in/ramazan-kus/`, `youtu.be/…`.

---

## Phase 1: Setup

**Purpose**: commit the design docs before code.

- [x] T001 On branch `011-quality-ops`, run `npx prettier --check specs/011-quality-ops ROADMAP.md` and commit `specs/011-quality-ops/` with `ROADMAP.md` (C6 tick and F11 Plan block aligned with plan.md) as `docs(specs): F11 specification, plan and tasks`
- [x] T002 Install lychee locally (`brew install lychee`), note its version with `lychee --version`, and read `lychee --help` for the exact names of the options used below (`--root-dir`, `--index-files`, `--remap`, `--include-fragments`, `--max-retries`, `--retry-wait-time`, `--accept`, `--exclude`); if a name differs in this version, use the installed one everywhere and add one line to research R1

---

## Phase 2: Foundational

None: the five stories touch different files (`lychee.toml` / `ci.yml`, `astro.config.mjs`,
`vercel.json`, `BaseLayout.astro`) and share no prerequisite beyond Phase 1.

---

## Phase 3: User Story 1 — Ne jamais publier un lien mort (Priority: P1) 🎯 MVP

**Goal**: every PR and push on `main` fails when a link of the built site is dead (FR-001 to
FR-006).

**Independent Test**: quickstart §1, scenarios 1–3 and 5.

- [x] T003 [US1] Create `lychee.toml` at the repo root per [contracts/operations.md §1](./contracts/operations.md): `include_fragments = true`, `index_files = ["index.html"]`, `max_retries = 3`, `retry_wait_time = 5`, `accept = ["200..=299", "429"]`, `no_progress = true`, and `exclude = ['^https://www\.linkedin\.com/']` with a French comment on the line above (« LinkedIn répond 999 aux robots, la page existe »). Rules from data-model, verbatim: « External only; no own-domain or relative pattern ». Keep `mailto:` out by lychee's default (no `include_mail`). Paths that must be absolute (`root_dir`, the `remap` target) are **not** in the file: they are passed on the command line (T004)
- [x] T004 [US1] Run locally `npm run build && lychee --config lychee.toml --root-dir "$PWD/dist" --remap "https://ramazankus\.dev/(.*) file://$PWD/dist/\$1" 'dist/**/*.html' 'dist/sitemap-*.xml'`, once with `--verbose` to see whether JSON-LD URLs are extracted (research R2: if not, keep R2 as written, they are covered by the canonicals). Expected 0 error (research R2: canonicals, alternates, `og:image`, JSON-LD and sitemap URLs resolve in `dist/`). For each error: a real dead link → fix it in the source file (content, `src/data/`, component) and note it for `audit.md` (T019); a false positive from an external site → add an `exclude` entry with its reason in `lychee.toml`, never an own-domain pattern (FR-005)
- [x] T005 [US1] In `.github/workflows/ci.yml`, job `check-and-build`, after `- run: npm run build`, add the step `- uses: lycheeverse/lychee-action@v2` with `fail: true` and `args: --config lychee.toml --root-dir ${{ github.workspace }}/dist --remap 'https://ramazankus\.dev/(.*) file://${{ github.workspace }}/dist/$1' 'dist/**/*.html' 'dist/sitemap-*.xml'` (same options as T004). The action uses the job's `GITHUB_TOKEN` by default; keep `permissions: contents: read`
- [x] T006 [US1] Scratch checks, quickstart §1 scenarios 1–3: a link to `/projects/nope/` in `src/content/projects/fr/meetz.md`, then `#nope` on an internal link, then `https://no-such-host-f11-check.dev/` (lychee skips reserved TLDs such as `.invalid` by default); each run of the T004 command fails and names the source file and the link; revert each
- [x] T007 [US1] Commit `ci: check every link of the built site` (T003–T005), push the branch, open the PR **as a draft** with no session link (quickstart §1 scenario 5: the lychee step runs and passes)

**Checkpoint**: a dead link can no longer reach `main` (SC-001).

---

## Phase 4: User Story 4 — Retirer un contenu sans casser ses liens (Priority: P2)

**Goal**: redirects declared in one place, immediate, canonical to their target, checked by
US1 (FR-007 to FR-009).

**Independent Test**: quickstart §1 scenario 4, and opening `/projects/sample-project` and
`/en/projects/sample-project`.

- [ ] T008 [US4] In `astro.config.mjs`, check the `redirects` block against data-model « Redirect »: « One entry per language; target is an existing page of the same language; no chain ». Today `/projects/sample-project` → `/projects/portfolio/` and `/en/projects/sample-project` → `/en/projects/portfolio/` comply; add above the block one French comment line: un contenu retiré = une entrée par langue ici, vérifiée par lychee (constitution IX)
- [ ] T009 [US4] Check `dist/projects/sample-project/index.html` and `dist/en/projects/sample-project/index.html`: `meta http-equiv="refresh" content="0;url=…"`, `link rel="canonical"` to the absolute target, `meta name="robots" content="noindex"`, `<a href>` to the target (research R4)
- [ ] T010 [US4] Scratch check, quickstart §1 scenario 4: point the French redirect at `/projects/nope/`, build, run the T004 command; it fails on the redirect page. Revert
- [ ] T011 [US4] Commit `chore: redirects stay in astro.config.mjs, checked by lychee` if T008 changed a line, else no commit (the story is satisfied by existing config plus US1)

**Checkpoint**: removing a project = 1 file deleted + 1 redirect per language, checked in CI.

---

## Phase 5: User Story 5 — Des protections de base, sans y penser (Priority: P3)

**Goal**: three headers on every response (FR-015, FR-016).

**Independent Test**: quickstart §2 on the preview deployment.

- [ ] T012 [P] [US5] In `vercel.json`, add as the **first** entry of `routes`, before `{ "handle": "filesystem" }`, the object of [contracts/operations.md §3](./contracts/operations.md): `"src": "/(.*)"`, headers `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Content-Security-Policy: frame-ancestors 'none'`, `"continue": true`. Do not add top-level `headers`: Vercel refuses it next to `routes` (research R5)
- [ ] T013 [US5] Commit `feat(ops): base security headers on every response`, push, wait for the preview deployment, then run quickstart §2 against the preview URL (if Vercel deployment protection answers 401, read the headers in DevTools › Network while logged in). Expected: the three headers on `/`, `/projects/portfolio/`, `/cv-fr.pdf`, `/nope` (404), `/en/nope` (404 kept), `/projects/sample-project`; fonts, images, view transitions and the CV still work. If a response lacks them, fix `vercel.json` in a new commit and fold it into this story's commit before the PR leaves draft

**Checkpoint**: the site cannot be framed; headers hold on 404s and the PDF (SC-008).

---

## Phase 6: User Story 3 — Savoir qui lit le site, sans pister personne (Priority: P2)

**Goal**: visits and real-visitor Core Web Vitals, cookieless, production only (FR-010 to
FR-014).

**Independent Test**: quickstart §3 (fully only after merge: the scripts are rendered for
production builds only).

- [ ] T014 [P] [US3] In `astro.config.mjs`, `env.schema`, add `VERCEL_ENV: envField.enum({ context: 'server', access: 'public', values: ['production', 'preview', 'development'], optional: true })` (data-model « Build target »: « Set by Vercel; absent locally and in CI, so the analytics script is not rendered there »)
- [ ] T015 [US3] In `src/layouts/BaseLayout.astro`, import `VERCEL_ENV` from `astro:env/server`; at the end of `<head>`, after `<slot name="head" />`, render only when `VERCEL_ENV === 'production'` the two tags of [contracts/operations.md §4](./contracts/operations.md): `<script defer src="/_vercel/insights/script.js"></script>` and `<script defer src="/_vercel/speed-insights/script.js"></script>`. Add `is:inline` if Astro would otherwise process them, so they stay plain external tags. One French comment: mesure d'audience et de performance de l'hébergeur, sans cookie, production seulement (constitution II, exception du plan). No inline code, no `@vercel/*` package (R9)
- [ ] T016 [US3] Run `npm run check && npm run build`: `dist/index.html` has no `_vercel` tag. Then `VERCEL_ENV=production npm run build`: both tags are in `dist/index.html` and `dist/en/index.html`, once each, in `<head>`; rebuild without the variable afterwards
- [ ] T017 [US3] **Maintainer action**: in the Vercel project, enable Web Analytics and Speed Insights; note in `audit.md` (T019) the free Hobby quotas and whether bot filtering is on (research R6 « To verify when enabling »). Check that « Automatically expose System Environment Variables » is on, so `VERCEL_ENV` reaches the build
- [ ] T018 [US3] Commit `feat(ops): cookieless audience and speed insights in production`, push; on the preview deployment, the page source has **no** `_vercel` tag (FR-012)

**Checkpoint**: the code is ready; counting starts at the first production deploy.

---

## Phase 7: User Story 2 — Garder l'audit au vert (Priority: P1)

**Goal**: one audit of the whole site against CONTENU.md §10 and constitution VII, every gap
fixed where it lives (FR-017 to FR-020).

**Independent Test**: quickstart §4.

- [ ] T019 [US2] Create `specs/011-quality-ops/audit.md` per [contracts/operations.md §5](./contracts/operations.md): a scores table (page × performance / accessibility / best practices / SEO, mobile, before / after, date, Lighthouse version) and a gaps table (page, theme, language, tool, finding, fix file, commit, status). Record there the dead links fixed in T004 and the Vercel facts of T017
- [ ] T020 [US2] Lighthouse, DevTools, mobile preset, cache disabled, on the **preview deployment** of the branch: `/`, `/projects/portfolio/`, `/en/`. Record performance, accessibility and best practices; one gap row per failing audit
- [ ] T021 [US2] SEO: `PUBLIC_NOINDEX=false npm run build && npx astro preview`, Lighthouse SEO on the same three pages; record (target 100, research R7)
- [ ] T022 [P] [US2] axe DevTools on every page type, FR and EN, light and dark: home, about, projects, project (`portfolio` and `shipment-preparation`), background, skills, CV page, 404. One gap row per issue
- [ ] T023 [P] [US2] Keyboard only on the same pages: skip link reaches `#content`, order follows reading order, focus always visible in both themes, no trap, the home move rows and the language switcher reachable. One gap row per issue
- [ ] T024 [P] [US2] Headings and images on the same pages: exactly one `h1`, no skipped level (DevTools or a headings bookmarklet); every `img` and `svg role="img"` has a fitting `alt` / label, decorative ones `alt=""` or `aria-hidden`. One gap row per issue
- [ ] T025 [US2] Contrast AA in both themes for the states axe cannot see (hover, focus, visited, current page, availability banner, evaluation symbols): measure with DevTools; one gap row per failure
- [ ] T026 [US2] Home weight on the preview, DevTools › Network, cache disabled: transferred < 200 kB; record it (the two scripts are added and measured in T033)
- [ ] T027 [US2] For each open gap row, append below one task `T0xx [US2] Fix <finding> in <file>` and do it in the component, view or token that carries it (research R8); UI fixes load `impeccable` first, go through the i18n dictionary for any text, and are checked at 375 px and 1280 px in both themes. Close the row with the commit
- [ ] T028 [US2] Re-run T020–T026 on the new preview; record the « after » scores; every gap row is closed (SC-003, SC-004, SC-005)
- [ ] T029 [US2] Commit the fixes as `a11y: …` / `perf: …` (one per kind of fix, few and clear), and `audit.md` with the last of them

**Checkpoint**: scores and accessibility grid at target on the branch.

---

## Phase 8: Polish & close

- [ ] T030 If any UI fix was made in T027: `/impeccable audit` then `/impeccable polish` on the touched pages (AGENTS.md), captures at 375 px and 1280 px, light and dark, header and footer
- [ ] T031 [P] In `ROADMAP.md`, tick F11 and check that its **Plan** block still matches what shipped (aligned in T001: `vercel.json` routes, two Vercel scripts, no npm package); in `CONTRIBUTING.md`, add one line to the commands table or the checks section: the link check runs in CI and locally with the T004 command
- [ ] T032 `npm run format && npm run check && npm run build`, T004 command clean, commit `docs: close F11 in roadmap`, push; the PR stays a draft until the maintainer marks it ready

### After merge (production)

- [ ] T033 On `https://ramazankus.dev`: quickstart §2 (headers), §3 steps 2–4 (both `_vercel` scripts in the source and answering 200, no cookie, no storage, no banner, site unchanged when they are blocked), §4 step 4 (home < 200 kB with the scripts), and Lighthouse performance mobile on `/` with the scripts (≥ 95, no layout shift from them, SC-006). Watch the first 10 link checks on `main` for transient external failures (SC-002); add an exclusion or a retry setting if one occurs. Record in `audit.md` in a follow-up `docs:` commit if anything differs

---

## Dependencies & Execution Order

- **Phase 1** → stories. No foundational phase.
- **US1** first: US4 relies on it for FR-009.
- **US4** after US1. **US5** and **US3** are independent of each other and of US1 (T012 ∥
  T014).
- **US2** last: it audits the preview with US5's headers, and its fixes are checked by US1's
  link check. Its final weight check with the scripts (T033) waits for production.
- **Phase 8** after US2.

## Parallel Opportunities

- T012 (US5) ∥ T014 (US3): different files.
- T022 ∥ T023 ∥ T024: different checks on the same pages, rows in one file merged at the end.

## Implementation Strategy

1. **MVP**: Phases 1 and 3. Dead links can no longer reach `main`.
2. Add US4 (redirect rules, nearly free), then US5 (headers) and US3 (measurement).
3. Run the audit on the complete branch, fix, re-measure.
4. Close the roadmap; after merge, check production.

Commits, one per user story (each ticking its own tasks in this file):

1. `docs(specs): F11 specification, plan and tasks` (T001, with the C6 tick)
2. `ci: check every link of the built site` (US1, T003–T007)
3. `chore: redirects stay in astro.config.mjs, checked by lychee` (US4), only if T008 changed
   a line
4. `feat(ops): base security headers on every response` (US5, T012–T013)
5. `feat(ops): cookieless audience and speed insights in production` (US3, T014–T018)
6. `a11y: …` / `perf: …` with `audit.md` (US2, T019–T029)
7. `docs: close F11 in roadmap` (Phase 8)

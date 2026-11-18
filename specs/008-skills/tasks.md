---
description: 'Task list for F08 · Compétences'
---

# Tasks: Compétences

**Input**: Design documents from `specs/008-skills/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/skills.md,
quickstart.md

**Tests**: no automated test suite (not requested). The zod schema and the throws of
`getSkills` cover the failure contract; `npm run check` covers types and dictionary keys.
Each story ends with a manual validation task from [quickstart.md](./quickstart.md).

**Organization**: tasks grouped by user story (spec US1–US4). US4 (data and checks) is the
foundation every page story reads, so its code sits in Phase 2 and its validation in its
own phase. **Load the `impeccable` skill before any task that touches UI** (AGENTS.md),
respect `DESIGN.md` and the tokens of `src/styles/global.css`. Finish with the Impeccable
audit + polish phase.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: can run in parallel (different files, no dependency on an incomplete task)
- **[Story]**: US1–US4 from spec.md
- All paths are relative to the repository root.
- No UI literal in components (constitution VI): labels are `t(key)`, skill names come from
  the YAML file, proof titles from the projects collection.
- Every style value comes from a token (`var(--…)`); component-only sizes get a short
  French comment (constitution VIII).
- Few code comments: only a short non-obvious _why_, in French. Error messages in French,
  like the existing ones in `src/lib/projects.ts` and `src/lib/background.ts`.
- Visual checks at 375 px (in a 375 px `<iframe>`) and 1280 px, light and dark, header and
  footer included.
- « Scratch » checks are done on a throw-away change that is reverted; nothing from them is
  committed.
- Commits: one per user story, conventional, in English, without co-author trailer or
  session link.

---

## Phase 1: Setup

**Purpose**: commit the design docs before code.

- [x] T001 On branch `008-skills`, run `npx prettier --check specs/008-skills` and commit `specs/008-skills/` as `docs(specs): F08 specification, plan and tasks`

---

## Phase 2: Foundational (blocking prerequisites)

**Purpose**: the closed lists, the typed collection, the first data, the single access
function with its checks, and the labels used by every story.

**⚠️ CRITICAL**: no user story can start before this phase is done.

- [x] T002 [P] Create `src/lib/skill-scale.ts`, a module with no import, exporting `DOMAINS = ['frontend', 'backend', 'data', 'tools'] as const` (display order) and `LEVELS = ['basics', 'proficient', 'advanced'] as const` (rank, low to high), plus the types `Domain` and `Level` derived from them (research R4)
- [x] T003 [P] In `src/i18n/ui.ts`, add to `fr` and to `en` the sixteen keys of [data-model.md § Dictionary keys](./data-model.md): `skills.title` (« Compétences » / « Skills »), `skills.description` (one sentence per language, unique among the pages of its language, without date), `skills.intro` (one sentence: each skill links to the projects that prove it), `skills.legend` (« Niveaux » / « Levels »), `skills.domain.frontend` (« Front-end »), `skills.domain.backend` (« Back-end »), `skills.domain.data` (« Données » / « Data »), `skills.domain.tools` (« Outils et méthodes » / « Tools and methods »), `skills.level.basics` (« Notions » / « Basics »), `skills.level.proficient` (« Autonome » / « Proficient »), `skills.level.advanced` (« Avancé » / « Advanced »), `skills.level.basics.definition` (« utilisé en projet guidé » / « used in a guided project »), `skills.level.proficient.definition` (« livre seul un projet réel » / « ships a real project on my own »), `skills.level.advanced.definition` (« fait des choix d'architecture, peut former » / « makes architecture choices, can teach it »), `skills.since` (« depuis » / « since »), `skills.proofs` (« Preuves » / « Proof », kept singular: uncountable in English, correct before one or several links). French follows `CONTENU.md` §9 and the site prose style (few colons, keep « back-end » / « front-end »); English is rewritten, not translated
- [x] T004 In `src/content.config.ts`, add a `skills` collection with `loader: strictFile('src/data/skills.yaml')` and a `z.strictObject` schema: `name: z.union([text, localized])` (« `string` or `{ fr: string, en: string }` », required, trimmed, non-empty), `domain: z.enum(DOMAINS)`, `level: z.enum(LEVELS)` (both imported from `src/lib/skill-scale.ts`), `since: z.number().int().min(2000).max(new Date().getFullYear())` (« 2000 ≤ `since` ≤ current year »), `projects: z.array(reference('projects')).min(1, 'au moins un projet')` (« at least one »). Import `reference` from `astro:content`; export `skills` in `collections` (depends on T002)
- [x] T005 Create `src/data/skills.yaml`, a YAML map keyed by kebab-case English ids, with a first set of skills drawn only from the `tech` of the four published projects (`src/content/projects/fr/*.md`), covering the four domains, with TypeScript proven by `meetz` and `shipment-preparation` and Docker by `sportify` and `meetz` (research R11). Leave out Leaflet and Socket.IO. Use `TypeScript` in `frontend`, Java/Spring/PHP/Express/Prisma in `backend`, PostgreSQL/MariaDB/MySQL in `data`, Docker/GitLab/Claude Code/Spec Kit in `tools`; pick provisional levels and years from the project years and `src/data/experience.yaml`, to be confirmed by the maintainer in T018 (depends on T004)
- [x] T006 Create `src/lib/skills.ts` exporting the `Skill` and `SkillDomain` interfaces of [data-model.md § View model](./data-model.md) and `getSkills(locale)`. It reads `getCollection('skills')` and `getCollection('projects')` (raw, drafts included) and throws, with a message naming `src/data/skills.yaml`, the skill id and, for proofs, the slug, when: the file has no entry; two skills share a French name (case-insensitive); a skill cites the same slug twice; a cited slug has no project; a cited project has `draft: true` (in dev as in production, research R6). It then builds proof titles from `getProjects(locale)` (order of that list: year desc, then title), resolves `name` to the locale (a string is used as is), sorts each domain by level rank desc, then French name (`localeCompare(…, 'fr')`), then id, sets `rank` to the level index + 1, and returns the domains in `DOMAINS` order, dropping empty ones (research R6, R7; depends on T002, T004, T005)
- [x] T007 Run `npm run check && npm run build` and fix until both pass

**Checkpoint**: the data loads and validates; pages can be built on `getSkills`.

---

## Phase 3: User Story 1 - Lire les compétences par domaine (Priority: P1) 🎯 MVP

**Goal**: `/skills` and `/en/skills` show the levels legend, then one section per domain,
each skill with its name, level in words and squares, and « depuis <année> ».

**Independent Test**: [quickstart.md §1](./quickstart.md).

- [x] T008 [US1] Load the `impeccable` skill, then create `src/views/SkillsView.astro` on `BaseLayout` with `title={t('skills.title')}` and `description={t('skills.description')}`, following [contracts/skills.md § HTML structure](./contracts/skills.md): one `<h1>`, the intro paragraph, the legend section (`<h2>` `skills.legend`, a `<dl>` with the three levels from highest to lowest, each `<dt>` holding the `aria-hidden` mark and the level word, each `<dd>` its definition), then for each domain of `getSkills(locale)` a `<section aria-labelledby>` with an `<h2>` (`skills.domain.<domain>`) and a `<ul>` of skills: `<h3>` name, the level line (mark `aria-hidden` + word), the « depuis <année> » line. The mark is three spans, `rank` of them filled with ink, the others outlined; no colour carries meaning (FR-005, research R9)
- [x] T009 [P] [US1] Create the shells `src/pages/skills.astro` and `src/pages/en/skills.astro`, each rendering `<SkillsView />`, like `src/pages/background.astro`
- [x] T010 [US1] Validate [quickstart.md §1](./quickstart.md) in both languages: order of domains and skills, legend once, language switcher, head title and description, `hreflang` alternates, both pages in `dist/sitemap-*.xml`; check with VoiceOver that the level is read in words and the squares are silent

**Checkpoint**: the page is reachable from the navigation and readable, without proof links yet.

---

## Phase 4: User Story 2 - Vérifier une compétence par ses projets (Priority: P1)

**Goal**: each skill lists its proof projects, named by their title, linking to the project
page in the page language.

**Independent Test**: [quickstart.md §2](./quickstart.md).

- [x] T011 [US2] In `src/views/SkillsView.astro`, add under each skill the proofs label (`skills.proofs`, with a unique id per skill such as `proofs-<id>`) and a `<ul aria-labelledby>` of links, one per entry of `skill.proofs`, text = project title, `href={localizePath(`/projects/${slug}/`, locale)}` (contract, FR-007)
- [x] T012 [US2] Build, then check that every proof `href` in `dist/skills/index.html` and `dist/en/skills/index.html` matches a built page in `dist/` (a one-off shell loop, not committed): 0 dead link; on `/en/skills`, an untranslated project opens its English route with French prose (quickstart §2)

**Checkpoint**: the « aucune compétence déclarative » promise is visible on the page.

---

## Phase 5: User Story 3 - Lire les compétences sur mobile (Priority: P1)

**Goal**: a layout designed for 375 px and for 1280 px, in both themes.

**Independent Test**: [quickstart.md §3](./quickstart.md).

- [x] T013 [US3] With the `impeccable` skill loaded, style `src/views/SkillsView.astro` in a scoped `<style>`: mobile first, each skill stacks (name and level on one line when they fit, then « depuis », then proofs, wrapping without overlap); from `56rem` (the breakpoint of `src/views/BackgroundView.astro`), a four-column grid name | level | since | proofs, with the same column widths in every domain so the whole page reads as one table; the legend reads as a compact key above the domains; squares sized and spaced with tokens (component-only size commented in French); proof links keep the site's link states and are at least 24 × 24 px, or spaced so a 24 px circle centred on each touches no other (WCAG 2.2, 2.5.8) (research R10)
- [x] T014 [US3] Capture `/skills` and `/en/skills` at 375 px (inside a 375 px `<iframe>`) and 1280 px, light and dark, header and footer included; check no horizontal scroll, no overlap with a long name or many proofs, levels readable in grayscale, contrasts per `DESIGN.md`; at each width, time a cold read: find the level of a given skill and open one of its proofs in under 15 s (SC-003); fix in `src/views/SkillsView.astro`

**Checkpoint**: US1–US3 shippable on every screen size.

---

## Phase 6: User Story 4 - Tenir les compétences à jour dans un seul fichier (Priority: P2)

**Goal**: prove the failure contract and the one-file workflow built in Phase 2.

**Independent Test**: [quickstart.md §4](./quickstart.md).

- [x] T015 [US4] Run every row of the table in [quickstart.md §4](./quickstart.md) as a scratch change of `src/data/skills.yaml` (and, for the draft case, of one cited project's frontmatter); each `npm run build` must fail with a message naming the file, the skill and, for proofs, the slug; fix `src/content.config.ts` or `src/lib/skills.ts` where a message is missing or unclear; revert every scratch change
- [x] T016 [US4] Scratch-add a valid skill to `src/data/skills.yaml` and check it appears at its rank in its domain on both pages with no other file changed; revert
- [x] T017 [P] [US4] In `CONTRIBUTING.md`, add a short section « Ajouter une compétence »: one block in `src/data/skills.yaml`, the fields and their allowed values, the plain-string vs `{ fr, en }` name rule, at least one published project, and the build errors it can raise

---

## Phase 7: Content and documents

**Purpose**: real data and aligned documents (research R11, R12).

- [x] T018 Ask the maintainer to confirm or correct the level and year of each skill in `src/data/skills.yaml`, and whether any skill should be added or removed from the four published projects; apply the answers. **Blocks the merge**: the PR stays a draft until the maintainer has confirmed every value
- [x] T019 [P] In `DESIGN.md`, add a « Liste des compétences » component section describing the legend, the three squares, the stack at 375 px and the grid from `56rem`, with the values settled in T013
- [x] T020 [P] In `ROADMAP.md`, update the F08 « Plan » block to what was built: collection `skills` via `strictFile`, `reference('projects')` plus existence and draft checks in `src/lib/skills.ts`, `SkillsView.astro` without `SkillGroup.astro`, grouping in `getSkills` for reuse by F09; in the F09 « Plan » block, name `getSkills(locale)` as the CV's source of skills (SC-009)

---

## Phase 8: Polish & design review

**Purpose**: constitution principle VII–IX gates for a visual feature.

- [x] T021 Run `/impeccable audit` on `/skills` and `/en/skills` and fix the findings in `src/views/SkillsView.astro`
- [x] T022 Run `/impeccable polish` and apply it; redo the captures of T014 (375 px and 1280 px, both themes, header and footer)
- [x] T023 Run Lighthouse mobile on `/skills` and `/en/skills` (≥ 95 / 100 / 100 / 100, 0 kB JS) and axe (0 violation); fix any issue
- [x] T024 Run `npm run format`, then `npm run check && npm run build`; both pass

---

## Dependencies & Execution Order

- **Phase 1** → **Phase 2** → user stories.
- In Phase 2: T002 and T003 in parallel; T004 after T002; T005 after T004; T006 after T005;
  T007 last.
- **US1** (Phase 3) needs Phase 2. **US2** needs the view of T008. **US3** styles the markup
  of T008 and T011, so it comes after US2. **US4** (Phase 6) needs only Phase 2 and can run
  alongside US1–US3; T017 is independent.
- **Phase 7**: T018 any time after T005, before merge; T019 after T013; T020 any time.
- **Phase 8** after everything else.

## Parallel Opportunities

- Phase 2: T002 ∥ T003.
- US1: T009 ∥ T008.
- US4: T017 ∥ T015–T016; the whole of Phase 6 ∥ Phases 3–5.
- Phase 7: T019 ∥ T020.

## Implementation Strategy

1. **MVP**: Phases 1–3. The page exists, reachable from the navigation, with domains, levels
   and years.
2. Add US2 (proofs): the feature's promise is met.
3. Add US3 (layout), then validate US4 and write `CONTRIBUTING.md`.
4. Confirm the data with the maintainer, align the documents, then audit, polish and the
   quality gates.

Commits, one per user story:

1. `docs(specs): F08 specification, plan and tasks` (T001)
2. `feat(skills): skills collection and build checks` (Phase 2 and US4, T002–T007,
   T015–T017)
3. `feat(skills): skills page by domain` (US1, T008–T010)
4. `feat(skills): proof links to projects` (US2, T011–T012)
5. `feat(skills): mobile and desktop layout` (US3, T013–T014)
6. `docs: align DESIGN and ROADMAP with the skills page` (T019–T020)
7. `content: confirm skills levels and years` (T018, if the data changes)
8. Phase 8 fixes go into a `fix(skills):` or `a11y(skills):` commit.

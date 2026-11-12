---
description: 'Task list for F06 · Projets'
---

# Tasks: Projets

**Input**: Design documents from `specs/006-projects/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/projects.md,
quickstart.md

**Tests**: no automated test suite (not requested). zod schemas and build-time throws cover
the failure contract; `npm run check` covers types and dictionary keys. Each story ends with
a manual validation task from [quickstart.md](./quickstart.md).

**Organization**: tasks grouped by user story (spec US1–US6). **Load the `impeccable` skill
before any task that touches UI** (AGENTS.md), respect `DESIGN.md`, the tokens of
`src/styles/global.css` and the approved comps `.impeccable/prototype/index.html` (move
list) and `project.html` (project page), adjusted by the spec clarifications: the symbol
sits at the key move, the cover comes before the body, `!!` is blue. Finish with the
Impeccable audit + polish phase.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: can run in parallel (different files, no dependency on an incomplete task)
- **[Story]**: US1–US6 from spec.md
- All paths are relative to the repository root.
- No UI literal in components (constitution VI): labels are `t(key)`, project prose comes
  from Markdown.
- Every style value comes from a token (`var(--…)`); component-only sizes taken from
  `DESIGN.md` get a short French comment (constitution VIII).
- Few code comments: only a short non-obvious _why_, in French.
- Visual checks at 375 px (in a 375 px `<iframe>`) and 1280 px, light and dark, header and
  footer included.
- « Scratch » checks are done on a throw-away branch or reverted; nothing from them is
  committed.

---

## Phase 1: Setup

**Purpose**: commit the design docs before code.

- [ ] T001 On branch `006-projects`, run `npx prettier --check specs/006-projects` and commit `specs/006-projects/` as `docs(specs): F06 specification, plan and tasks`

---

## Phase 2: Foundational (blocking prerequisites)

**Purpose**: the typed collections, the single access function, the fixtures, and the
tokens, labels and symbol component used by every story.

**⚠️ CRITICAL**: no user story can start before this phase is done.

- [ ] T002 [P] In `src/styles/global.css`, add to `:root` `--color-invert-bg: var(--color-ink);`, `--color-invert-ink: var(--color-paper);`, `--color-mark-on-invert: #ff5a6a;`, `--color-brilliant: #0077b6;`, `--color-brilliant-on-invert: #5cc8ff;`, and in the dark block `--color-mark-on-invert: #c8102e;`, `--color-brilliant: #5cc8ff;`, `--color-brilliant-on-invert: #0077b6;` (values from the `DESIGN.md` front matter; research R8). No other token change
- [ ] T003 [P] In `src/i18n/ui.ts`, add to `fr` and to `en` the keys of [data-model.md § Dictionary additions](./data-model.md): `projects.title`, `projects.description`, `projects.empty`, `projects.featured`, `projects.keyMove`, `projects.back`, `projects.year`, `projects.tech`, `projects.links`, `projects.link.code`, `projects.link.demo`, `projects.link.video`, `projects.legend`, `eval.good`, `eval.bet`, `eval.brilliant`, `projects.frenchOnly`, `projects.frenchOnlyNotice`, `projects.draft`, with the wording of that table. `projects.keyMove` in French is `Coup clé :` (narrow no-break space before the colon). Write `projects.description` as one sentence per language, unique among the pages of its language, following `CONTENU.md` §9 (a number, a technology or a link; no banned word); English rewritten, not translated. Get the wording approved by the maintainer
- [ ] T004 In `src/content.config.ts`, keep `pages` and add two collections per [data-model.md](./data-model.md) and research R1–R2 (check the `image()` and strict-object syntax against the Astro 7 content-collections guide):

  - `projects`: `loader: glob({ pattern: '*.md', base: './src/content/projects/fr' })`, `schema: ({ image }) =>` a **strict** object: `title`, `summary`, `keyMove` non-empty strings; `year` integer, 2000 – 2100; `tech` array of non-empty strings, at least one; `eval` enum `'!' | '!?' | '!!'`; `links` strict object `{ code?, demo?, video? }`, each an http(s) URL, default `{}`; `cover` `image()` optional; `coverAlt` non-empty string optional; `featured` boolean default `false`; `draft` boolean default `false`; `move` optional strict object `{ from, to, notation: { fr, en } }` where `from` and `to` match `/^[a-h][1-8]$/` and both notations are non-empty. Refinements with a French message: `coverAlt` present if and only if `cover` is; `featured` implies `move`; `move.to` differs from `move.from`;
  - `projectsEn`: `loader: glob({ pattern: '*.md', base: './src/content/projects/en' })`, **strict** schema `{ title, summary, keyMove }` non-empty strings and `coverAlt` optional non-empty string.

  Export `collections = { pages, projects, projectsEn }`

- [ ] T005 [P] Provisional cover (research R13): `mkdir -p src/assets/projects` and generate `src/assets/projects/sample-project.png` once with sharp (`node -e`), 1600 × 900, flat `#c9c6be` background with the text « [provisoire] » composited from an inline SVG, PNG under 50 kB. Do not add a dependency or a script file
- [ ] T006 [P] Create the three fixtures (FR-029, research R13), all prose marked « [provisoire] » / « [draft] », first person, each sentence with a date, a number, a technology or a link, no banned word (`CONTENU.md` §9), nothing copied from the old portfolio:

  - `src/content/projects/fr/sample-project.md`: `title`, `year: 2026`, `summary`, `keyMove`, `tech: [Astro, TypeScript]`, `eval: '!!'`, `links: { code: https://github.com/Rameray1 }`, `cover: ../../../assets/projects/sample-project.png`, `coverAlt`, `featured: true`, `move: { from: c2, to: c3, notation: { fr: '4.c3', en: '4.c3' } }` (a white move on the provisional position of `src/data/diagram.ts`); body with the six `##` headings of `CONTENU.md` §6 in order (Contexte, Le problème, Ce que j'ai fait, Stack et pourquoi, Résultat, Ce que j'en ai appris), one or two sentences each;
  - `src/content/projects/en/sample-project.md`: `title`, `summary`, `keyMove`, `coverAlt`, and the six parts rewritten in English (Context, The problem, What I did, Stack and why, Outcome, What I learned);
  - `src/content/projects/fr/sample-draft.md`: `draft: true`, `year: 2025`, `eval: '!?'`, `tech` with one entry, no `links`, no `cover`, no `featured`, short body; no English file

- [ ] T007 Create `src/lib/projects.ts` per [data-model.md § Cross-entry rules and § Merged view](./data-model.md) and research R2–R5. Export the `Project` interface and:

  - `getProjects(locale: Locale): Promise<Project[]>`: load both collections with `getCollection`; **throw** an `Error` (French message naming the slugs) when an English id has no French entry, when the body of a published (non-draft) project is empty after `trim()` in either collection (a draft may have an empty body), or when the English `coverAlt` is present without a French `cover` or missing with one; drop `draft` entries when `import.meta.env.PROD`; among the published (non-draft) entries **throw** when more than 3 have `featured: true` or when more than 1 featured entry has `eval: '!!'`; build each `Project` (French data; prose and `entry` from the English file when `locale === 'en'` and it exists; otherwise French prose with `untranslated: locale === 'en'`; `move.notation` resolved to the page language); sort by `year` descending, then French title with `localeCompare('fr')`;
  - `featuredProjects(locale)`: `getProjects(locale)` filtered on `featured`;
  - `projectPaths(locale)`: the `getStaticPaths` array `{ params: { slug }, props: { project } }`.

  Run `npm run check && npm run build`: both pass with the fixtures

- [ ] T008 Load `impeccable`. Create `src/components/EvalMark.astro` per [contracts/projects.md § EvalMark](./contracts/projects.md) and research R8: props `{ eval: '!' | '!?' | '!!'; legend?: boolean }`; renders `<span data-eval={eval}>` with the symbol in `<span aria-hidden="true">` and, unless `legend`, the meaning (`eval.good`, `eval.bet`, `eval.brilliant`) in a visually hidden span; in `legend` mode the meaning is visible text after the symbol. Symbol style: 800, `font-stretch: var(--stretch-display)`, line-height 1, `--color-mark`, and `--color-brilliant` for `[data-eval='!!']`; size inherited from the caller. Scoped styles, tokens only

**Checkpoint**: the build validates project files and exposes one merged, sorted list.

---

## Phase 3: User Story 1 — Parcourir la liste des projets (Priority: P1) 🎯 MVP

**Goal**: `/projects/` and `/en/projects/` list the published projects as move-list rows.

**Independent Test**: quickstart §1.

- [ ] T009 [US1] Load `impeccable`. Create `src/components/ProjectList.astro` per [contracts/projects.md § Row](./contracts/projects.md) and research R9, from the prototype `.moves` styles: props `{ projects: Project[]; detail?: boolean }`; renders nothing for an empty array; an `<ol>` (no list style) of rows, each `<li>` holding **one** `<a href={localizePath('/projects/' + slug + '/', locale)}>` laid out as a three-column grid `4.5rem minmax(0, 1fr) 2.5rem` on a common baseline (`DESIGN.md` values, commented): left the year (`--text-sm`, `--color-ink-muted`) and, without `detail`, the notation (700) under it; centre the title (Title: 700, `--text-lg`, `--leading-snug`) then, with `detail`, the summary and the technologies joined by `·` (`--text-sm`, `--color-ink-muted`), or without `detail`, `{t('projects.keyMove')} {keyMove}` (`--color-ink-muted`); right `<EvalMark>` at `--text-2xl`, right-aligned. Rows separated by a 1 px `--color-rule-soft` rule, the list opened by a 2 px `--color-rule` rule. Hover and `:focus-visible` invert the row (`--color-invert-bg` / `--color-invert-ink`, `--duration`, `--ease-out`), muted text inherits, the symbol takes `--color-mark-on-invert` or `--color-brilliant-on-invert`; no underline; focus ring stays visible. After the list, a legend `<ul aria-label={t('projects.legend')}>` (no list style; Meta: `--text-xs`, `--color-ink-muted`, flex-wrap; never `aria-label` on a `<p>`, which ARIA forbids) with one `<li><EvalMark legend></li>` per symbol present in `projects`, in the order `!`, `!?`, `!!`. Long titles, summaries and technology lists wrap without overflow at 320 px. No image, no card, no script, no `view-transition-name`
- [ ] T010 [US1] Load `impeccable`. Create `src/views/ProjectsView.astro` per [contracts/projects.md § List page](./contracts/projects.md): `<BaseLayout title={t('projects.title')} description={t('projects.description')}>`, an `<h1>` styled like the About title (Headline on a 2 px bottom rule), then `<ProjectList projects={await getProjects(locale)} detail />`, or `<p>{t('projects.empty')}</p>` when the array is empty (FR-011). Composed for 375 px and 1280 px
- [ ] T011 [P] [US1] Create shells `src/pages/projects/index.astro` and `src/pages/en/projects/index.astro`, each only `<ProjectsView />` (F03 page pattern)
- [ ] T012 [US1] Validate quickstart §1: `npm run check && npm run build`; both pages at 375 px and 1280 px in light and dark show the `sample-project` row with its five pieces of information and the legend; keyboard focus inverts the row; the « Projets » nav link has `aria-current="page"`; `/projects/` and `/en/projects/` are in `dist/sitemap-0.xml` with paired `hreflang`; scratch checks of order (three years, then equal years) and of the empty message. Record the results in this task's note

**Checkpoint**: MVP — the « Projets » link leads to a real list.

---

## Phase 4: User Story 2 — Lire un projet (Priority: P1)

**Goal**: one page per published project, in both languages.

**Independent Test**: quickstart §2.

- [ ] T013 [P] [US2] In `src/i18n/utils.ts` (research R6), replace the « Routes dynamiques ([slug]) non listées » note: keep the set of static routes and build, from the page files that contain `[`, a list of patterns where each `[param]` segment becomes `[^/]+` (`/projects/[slug]` → `/^\/projects\/[^/]+$/`); `alternatePath` returns the target when it is in the set **or** matches a pattern. `switchPath` is unchanged
- [ ] T014 [US2] Load `impeccable`. Create `src/views/ProjectView.astro` per [contracts/projects.md § Project page](./contracts/projects.md) and research R12, from the prototype `project.html`: prop `{ project: Project }`; `const { Content } = await render(project.entry)`; `<BaseLayout title={project.title} description={project.summary}>` containing, in order: the back link to `localizePath('/projects/', locale)` (`projects.back`); an `<article>` with `<h1>` (Headline), the summary (Lead); a `<dl>` between a 2 px rule and a 1 px rule with one `<div>` per entry — year, technologies as a `<ul>` of chips (`DESIGN.md` Chips: 1 px ink outline, paper fill, `--text-sm`, padding `--space-1` / `--space-3`, no radius), and links **only if at least one exists**, each present link labelled `projects.link.code` / `.demo` / `.video` (labels in Meta muted, values 600; the grid adapts to two or three entries, two columns under `40rem`); the key move between two thin rules (`--text-lg`, 600) with a visually hidden `{t('projects.keyMove')} ` prefix and `<EvalMark>` in the margin column at its level (`3rem`, `1.75rem` under `40rem`, `DESIGN.md` values commented); the cover **only if** `project.cover`, as `<Picture src={project.cover} alt={project.coverAlt} formats={['avif', 'webp']} fallbackFormat="webp" widths={…} sizes={…} loading="lazy" />` no wider than `--measure` (widths up to 2× the displayed width; `width`/`height` come from the import, no layout shift); then the body `<Content />` in the annotated column at `--measure`, `h2` in Title style, paragraphs and lists spaced with tokens. No script, no animation, no `view-transition-name`
- [ ] T015 [P] [US2] Create `src/pages/projects/[slug].astro` and `src/pages/en/projects/[slug].astro`: each exports `getStaticPaths = () => projectPaths('fr' | 'en')` and renders `<ProjectView project={Astro.props.project} />`
- [ ] T016 [US2] Validate quickstart §2: `npm run check && npm run build`; `/projects/sample-project/` and `/en/projects/sample-project/` at 375 px and 1280 px, light and dark; English prose with the same year, chips, link and image; the language switch goes between the two pages and `hreflang` pairs them; `<title>` is the project title and the description its summary; scratch checks: one link only, no links, no cover; `grep -c '<script' dist/projects/sample-project/index.html` → 0. Record the results in this task's note

**Checkpoint**: a lead can open a project and reach its code.

---

## Phase 5: User Story 3 — Publier un projet avec un seul fichier, sans erreur possible (Priority: P1)

**Goal**: prove that a fiche is the only thing to edit and that a bad fiche cannot ship.

**Independent Test**: quickstart §3.

- [ ] T017 [US3] Validate quickstart §3 on a scratch branch, rebuilding after each of the eleven failure cases (missing `keyMove`, `year: soon`, `eval: '?'`, `links.code: github`, missing cover file, `cover` without `coverAlt`, `year` in the English file, English file without French file, empty body in a published file, `move.from: i9`, `move.to` equal to `move.from`): each fails `npm run build` and the message names the file; fix any case that passes or whose message does not name the file (in `src/content.config.ts` or `src/lib/projects.ts`). Then add one valid French file only: it appears in both lists and has both pages, and `git status` shows that file alone; an empty body in `sample-draft.md` does not fail the build. Record the results in this task's note
- [ ] T018 [P] [US3] In `CONTRIBUTING.md` § Conventions, add one bullet in French: ajouter un projet = une fiche `src/content/projects/fr/<slug>.md` (champs de `CONTENU.md` §6) et, s'il a un visuel, une image dans `src/assets/projects/` ; la version anglaise `src/content/projects/en/<slug>.md` ne porte que la prose et peut venir plus tard ; `draft: true` garde la fiche hors production ; `featured: true` (trois au plus, avec son `move`) la met sur l'accueil ; retirer un projet = supprimer les fichiers et ajouter une redirection vers `/projects/`

**Checkpoint**: adding a project is one file, and the maintainer knows which.

---

## Phase 6: User Story 4 — Préparer un projet en brouillon (Priority: P2)

**Goal**: a draft is visible in dev with a mark, and absent from production.

**Independent Test**: quickstart §4.

- [ ] T019 [US4] Load `impeccable`. Show the draft mark (FR-019): in `src/components/ProjectList.astro`, when `project.draft`, add `{t('projects.draft')}` next to the title (Label size, `--color-ink-muted`, inherits on inversion); in `src/views/ProjectView.astro`, a `<p>` with the same label above the article. No red: the mark is not a judgement (`DESIGN.md`, Commentator's Red Rule)
- [ ] T020 [US4] Validate quickstart §4: after `npm run build`, `grep -rl "sample-draft" dist/` returns nothing, no `sample-draft` folder under `dist/projects` or `dist/en/projects`, nothing in `dist/sitemap-0.xml`; in `astro dev`, `/projects/` lists the draft with its mark and `/projects/sample-draft/` opens. Record the results in this task's note

**Checkpoint**: a fiche can be versioned before it is published.

---

## Phase 7: User Story 5 — Choisir les projets de l'accueil dans la donnée (Priority: P2)

**Goal**: featured projects appear on `/` and `/en/` as the move list.

**Independent Test**: quickstart §5.

- [ ] T021 [US5] Load `impeccable`. In `src/views/HomeView.astro` (research R10, [contracts/projects.md § Home](./contracts/projects.md)): fetch `featuredProjects(locale)`; when it is not empty, render after the `<aside>` a `<section aria-labelledby="featured">` with `<h2 id="featured">{t('projects.featured')}</h2>` (Label: 700, `--text-sm`) and `<ProjectList projects={featured} />`. Desktop grid: the section in column 1, row 2, the aside spanning rows 1–2 and still sticky; under `56rem` the source order gives name, pitch, actions, availability, diagram, then the list. Nothing rendered when no project is featured (FR-023). The diagram does not change (FR-024)
- [ ] T022 [US5] Validate quickstart §5: `/` and `/en/` at 375 px and 1280 px, light and dark, show the heading, the row (year, `4.c3`, title, key move, blue `!!`) and the legend; scratch checks: `featured: false` → no heading or legend; four published featured fiches → build fails naming them; two featured `!!` → fails; `featured: true` without `move` → fails; `npm run preview` then load `/` with an empty cache → transferred < 200 kB, no `.js` request. Record the results in this task's note

**Checkpoint**: the third campaign lever is live.

---

## Phase 8: User Story 6 — Un projet pas encore réécrit en anglais reste lisible (Priority: P2)

**Goal**: an untranslated project is readable under `/en`, marked, and not offered to search
engines there.

**Independent Test**: quickstart §6.

- [ ] T023 [P] [US6] In `src/components/Seo.astro` and `src/layouts/BaseLayout.astro` (research R7, [contracts/projects.md § Head](./contracts/projects.md)): add the optional prop `untranslated?: boolean`, forwarded by `BaseLayout`. In `Seo`: when `untranslated`, emit no `hreflang` links and no `og:locale:alternate`; when also `locale === 'en'`, the canonical (and `og:url`) is the French URL and `robots` is `noindex` (the global `PUBLIC_NOINDEX` value still wins)
- [ ] T024 [P] [US6] Sitemap (research R7): in `src/data/seo.ts`, export `isUntranslatedProjectPath(pathname: string): boolean`, true when the path is `/en/projects/<slug>` (with or without trailing slash) and `src/content/projects/en/<slug>.md` does not exist (`existsSync` from `node:fs`, path relative to the project root; keep the « aucun import `astro:*` » rule of the file). In `astro.config.mjs`, extend the sitemap `filter` to also exclude these paths
- [ ] T025 [US6] Load `impeccable`. Fallback display (FR-025–FR-027): in `src/views/ProjectView.astro`, pass `untranslated={project.untranslated}` to `BaseLayout`; when `project.untranslated`, show `<p>{t('projects.frenchOnlyNotice')}</p>` between the back link and the article (Label size, on a thin rule, no red), set `lang="fr"` on the title, summary, key move, cover and body, and keep the `dl` labels, link labels and the hidden key-move prefix in English (outside the `lang="fr"` elements or marked `lang="en"`). In `src/components/ProjectList.astro`, when `project.untranslated`, set `lang="fr"` on the title and text cell and add `{t('projects.frenchOnly')}` next to the title, styled like the draft mark
- [ ] T026 [US6] Validate quickstart §6 on a scratch branch: delete `src/content/projects/en/sample-project.md` and build; `/en/projects/sample-project/` has the English interface, the notice and French prose inside `lang="fr"`; `/en/projects/` and `/en/` show the French text with « French only »; `dist/en/projects/sample-project/index.html` has `noindex`, the French canonical and no `hreflang`; `dist/projects/sample-project/index.html` has no `hreflang`; `dist/sitemap-0.xml` has the French URL without an English alternate and no English URL; the switch from the French page reaches the fallback page; restoring the file brings everything back. Check both pages at 375 px and 1280 px, light and dark. Record the results in this task's note

**Checkpoint**: the English mirror has no hole.

---

## Phase 9: Design review, accessibility & polish (Impeccable)

**Purpose**: constitution VII–IX quality gate before the feature is done.

- [ ] T027 [P] Align the documents (research R14), in French: `CONTENU.md` §6 — `projects` row gains `keyMove`, `eval`, `move{from,to,notation{fr,en}}`, `coverAlt`; the EN row becomes `title, summary, keyMove, coverAlt?` + récit. `DESIGN.md` — the symbol notes the key move, not a heading (Layout « Page projet », Components « En-tête PGN et récit commenté »); blue tokens delivered in F06, not F11 (Accent); the cover sits between the key move and the body; the header has year, technologies, links; the `/projects` row variant (summary and technologies, no notation); legend meanings final, with `!` renamed « bon coup » (« coup clé » now names only the project's sentence) (remove « Leur sens définitif est fixé en F06 »); list heading « Parties choisies ». `ROADMAP.md` — F11 spec and plan lose the blue-token line; F06 plan block matches what was built (two collections, `ProjectList`, `move.notation` per language). No constitution change
- [ ] T028 Run `/impeccable audit` on `/projects/`, `/projects/sample-project/`, `/` and their `/en` mirrors, plus the fallback page in dev or on a scratch build (light and dark, 375 px and 1280 px, header and footer included); list findings in this task's note
- [ ] T029 Run `/impeccable polish` and apply the accepted fixes in the files concerned (`ProjectList`, `EvalMark`, `ProjectView`, `ProjectsView`, `HomeView`), tokens only
- [ ] T030 Run quickstart §7: Lighthouse mobile on `astro preview` with `PUBLIC_NOINDEX` unset → ≥ 95 / 100 / 100 / 100 on the list, the sample page and the home in both languages, CLS 0 on the sample page; axe 0 violation in both themes; contrast of red and blue symbols, normal and inverted (≥ 4.5:1, or ≥ 3:1 for the large inverted blue in dark, `DESIGN.md` Accent); 320 px and 200 % zoom without horizontal scroll; `grep -rn "\[provisoire\]\|\[draft\]" src/content/projects` lists every sample text; titles and descriptions unique per language (SC-011). VoiceOver (symbol meanings, French passages on the fallback page) may be left to the maintainer; say so in the note
- [ ] T031 Run `npm run check && npm run build` on the whole branch; read the markup of each new or changed component for literal UI text (constitution VI) and untokenised values (VIII); `git log main..HEAD --oneline` → every commit conventional and in English

---

## Dependencies & Execution Order

- **Setup (T001)**: first.
- **Foundational (T002–T008)**: T002 ∥ T003 ∥ T005 ∥ T006 alongside T004; T007 needs T004,
  T005 and T006; T008 needs T002 and T003. Blocks all stories.
- **US1 (T009–T012)**: T009 needs T007 and T008; T010 needs T009; T011 ∥; T012 last.
- **US2 (T013–T016)**: after Foundational; T013 ∥ T015 with T014; T016 last. Independent of
  US1 except the back link target (`/projects/`).
- **US3 (T017–T018)**: T017 after US1 and US2 (it checks lists and pages); T018 any time
  after T004.
- **US4 (T019–T020)**: after US1 and US2 (edits `ProjectList` and `ProjectView`).
- **US5 (T021–T022)**: after US1 (uses `ProjectList`).
- **US6 (T023–T026)**: after US2 and US5; T023 ∥ T024, then T025, then T026.
- **Phase 9 (T027–T031)**: T027 any time after US6; T028 → T029 → T030 → T031.

```text
T001 ─► T002 ∥ T003 ∥ T004 ∥ T005 ∥ T006 ─► T007, T008
                                               │
              ┌────────────────────────────────┼───────────────┐
              ▼                                ▼               ▼
   T009 ─► T010 ∥ T011 ─► T012 (US1)   T013 ∥ T015 ∥ T014   T018
              │                              └─► T016 (US2)
              ├─► T021 ─► T022 (US5)             │
              └──────────────┬───────────────────┘
                             ▼
              T017 (US3) · T019 ─► T020 (US4)
                             ▼
              T023 ∥ T024 ─► T025 ─► T026 (US6)
                             ▼
              T027 · T028 ─► T029 ─► T030 ─► T031
```

## Parallel Examples

- **Foundational**: T002 (`global.css`), T003 (`ui.ts`), T005 (cover) and T006 (fixtures)
  while T004 (`content.config.ts`) is written.
- **US1 / US2**: T011 (list shells) with T010; T013 (`utils.ts`) and T015 (`[slug]` shells)
  with T014.
- **US6**: T023 (`Seo`, `BaseLayout`) with T024 (`seo.ts`, `astro.config.mjs`).

## Implementation Strategy

1. **MVP = Phases 1–4 (US1 + US2)**: validated collections, the list and the project pages.
   The list is not deployed alone, since its rows link to project pages.
2. **Then US3**: prove the failure contract, document how to add a project.
3. **Then US4**: draft mark and production check.
4. **Then US5**: featured list on the home.
5. **Then US6**: French fallback and its SEO treatment.
6. **Then Phase 9**: documents aligned, Impeccable audit + polish, final measurements.

Suggested commits (one per user story, each ticking its own tasks in this file;
`npm run check && npm run build` before each):

| Commit                                                    | Tasks     |
| --------------------------------------------------------- | --------- |
| `docs(specs): F06 specification, plan and tasks`          | T001      |
| `feat: add typed project collections with sample entries` | T002–T008 |
| `feat: add projects list`                                 | T009–T012 |
| `feat: add project pages`                                 | T013–T016 |
| `docs: explain how to add a project`                      | T017–T018 |
| `feat: mark draft projects in dev`                        | T019–T020 |
| `feat: show featured projects on home`                    | T021–T022 |
| `feat: fall back to French for untranslated projects`     | T023–T026 |
| `docs: align content model and design with projects`      | T027      |
| `a11y: …` / `fix: …` (audit findings)                     | T028–T031 |

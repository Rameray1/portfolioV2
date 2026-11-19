---
description: 'Task list for F09 · CV en ligne et PDF'
---

# Tasks: CV en ligne et PDF

**Input**: Design documents from `specs/009-cv/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/cv.md,
quickstart.md

**Tests**: no automated test suite (not requested). The `languages` schema, the throws of
`getCv` and the checks of the `cv-pdf` integration cover the failure contract;
`npm run check` covers types and dictionary keys. Each story ends with a manual validation
task from [quickstart.md](./quickstart.md).

**Organization**: tasks grouped by user story (spec US1–US5). The view model `getCv` and the
new data are read by both the page (US1) and the PDF (US2), so they sit in Phase 2; US4
validates them. **Load the `impeccable` skill before any task that touches UI** (AGENTS.md),
respect `DESIGN.md` and the tokens of `src/styles/global.css`. Finish with the Impeccable
audit + polish phase.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: can run in parallel (different files, no dependency on an incomplete task)
- **[Story]**: US1–US5 from spec.md
- All paths are relative to the repository root.
- No UI literal in components or in the LaTeX body (constitution VI): labels are `t(key)`.
- No phone number in any file, comment or example (FR-022).
- Every style value comes from a token (`var(--…)`); component-only sizes get a short French
  comment (constitution VIII).
- Few code comments: only a short non-obvious _why_, in French. Error messages in French,
  like those of `src/lib/background.ts`.
- Visual checks at 375 px (in a 375 px `<iframe>`) and 1280 px, light and dark, header and
  footer included.
- « Scratch » checks are done on a throw-away change that is reverted; nothing from them is
  committed.
- Commits: one per user story, conventional, in English, without co-author trailer or session
  link.

---

## Phase 1: Setup

**Purpose**: commit the design docs, get the tool and the template.

- [x] T001 On branch `009-cv`, run `npx prettier --check specs/009-cv ROADMAP.md` and commit `specs/009-cv/` and `ROADMAP.md` as `docs(specs): F09 specification, plan and tasks`
- [x] T002 Check `tectonic --version` (0.17.0 or later); if missing, ask the maintainer to run `! brew install tectonic`. Check `pdfinfo` and `pdftotext` (`brew install poppler`) for the quickstart
- [x] T003 Ask the maintainer to paste their current French LaTeX CV (layout source for `src/cv/template.tex`, research R4); keep it out of the repository as is, only its preamble and macros are reused

---

## Phase 2: Foundational (blocking prerequisites)

**Purpose**: the two new values, the dictionary and the single view model read by the page
and the PDF.

**⚠️ CRITICAL**: no user story can start before this phase is done.

- [x] T004 [P] In `src/content.config.ts`, add a `languages` collection with `loader: strictFile('src/data/languages.yaml')` and the schema `z.strictObject({ name: localized, level: localized })` (« `{ fr, en }`, both non-empty, required », reuse the existing `localized` helper); export it in `collections`
- [x] T005 Create `src/data/languages.yaml`, a YAML map keyed by English ids in display order: `french` (Français / French, langue maternelle / native), `turkish` (Turc / Turkish, langue maternelle / native), `english` (Anglais / English, courant, C1 – certifié TOEIC / fluent, C1 – TOEIC certified) (depends on T004 for validation)
- [x] T006 [P] In `src/data/site.ts`, add `city: string` to `Contact` and `city: 'Alès, France'` to `site.contact`
- [x] T007 [P] In `src/i18n/ui.ts`, add to `fr` and `en` the seven keys of [data-model.md § Dictionary keys](./data-model.md): `cv.title` (« CV »), `cv.description` (one sentence per language, unique among the pages of its language, without date), `cv.profile` (« Profil » / « Profile »), `cv.projects` (« Projets » / « Projects »), `cv.skills` (« Compétences » / « Skills »), `cv.languages` (« Langues » / « Languages »), `cv.download` (« Télécharger le CV en PDF » / « Download the CV as PDF »). French follows `CONTENU.md` §9 and the site prose style; English is rewritten, not translated
- [x] T008 Create `src/lib/cv.ts` exporting the `Cv`, `CvEntry` and `CvProject` types and `getCv(locale)` of [data-model.md § View model](./data-model.md): identity and contact from `site` (website = `import.meta.env.SITE`), profile from `campaign.pitch[locale]` and, only when `campaign.availability.visible`, status · place · formatted start; experience and education by splitting `getBackground(locale)` on `kind`, `period` = `formatMonth(start)` – `formatMonth(end)` or `t('background.present')`; projects from `featuredProjects(locale)` with absolute `url` = `new URL(localizePath('/projects/<slug>/', locale), site)`; skills from `getSkills(locale)` as `{ domain: t('skills.domain.<d>'), names }` (no level, clarification Q3); languages from `getCollection('languages')` in file order, throwing `src/data/languages.yaml : aucune langue` when empty; `pdf` = `{ href: '/cv-<locale>.pdf', filename: '<site.name with dashes>-CV.pdf' }`. The function only gathers and orders: no markup (depends on T004–T007)

**Checkpoint**: `npm run check` passes; `getCv('fr')` and `getCv('en')` return the same entries in the same order.

---

## Phase 3: User Story 1 - Lire le CV en ligne (Priority: P1) 🎯 MVP

**Goal**: `/cv` and `/en/cv` show every rubric from the data.

**Independent Test**: quickstart §1.

- [x] T009 [US1] Load the `impeccable` skill, then create `src/views/CvView.astro` (props `locale`) rendering `await getCv(locale)` in `BaseLayout` with the structure of [contracts/cv.md § HTML structure](./contracts/cv.md): one `h1` (name), title, contact list (links shown without scheme or trailing slash), download link (`href` and `download` from `cv.pdf`, label `t('cv.download')`), then one `<section aria-labelledby>` per non-empty rubric in the order Profil, Expérience, Formation, Projets, Compétences, Langues, each entry an `article` with an `h3`; project titles link to `url` with class `print-url`. Title and description from `cv.title` / `cv.description`. Scoped styles, tokens only, following `DESIGN.md` (reference-book density, rules between rubrics, tabular dates); at 375 px dates go under the title, from `56rem` they align right (depends on T008)
- [x] T010 [US1] Create the shells `src/pages/cv.astro` and `src/pages/en/cv.astro`, each rendering `<CvView />` like `src/pages/skills.astro` (depends on T009)
- [x] T011 [US1] Validate quickstart §1: both languages, every value matches its source page, captures at 375 px and 1280 px in both themes; time the path from any page to the download link (under 10 s, SC-004); commit `feat(cv): online CV page`

---

## Phase 4: User Story 2 - Télécharger le CV en PDF (Priority: P1)

**Goal**: two one-page PDFs, built at each build from `getCv`, or a failed build.

**Independent Test**: quickstart §2 and the PDF cases of §4.

- [x] T012 [US2] Create `src/cv/template.tex` from the preamble and macros pasted in T003 (research R4, R5): keep `geometry` margins, `titlesec` section rule, `\resumeItem`, `\resumeSubheading`, `\resumeProject`, `\resumeSubItem`, the list start/end macros, `hyperref` with dark blue links and `\urlstyle{same}`; remove `\input{glyphtounicode}`, `\pdfgentounicode`, `cfr-lm`, `fontenc`, `latexsym`, `marvosym`, `verbatim`, `float`, `multicol`, `graphicx`, `\headerfontiii`, the `pdftitle`/`pdfauthor` values and every phone line and `\ifshowphone`; add `fontspec` with `\setmainfont{texgyrepagella}[Extension=.otf, UprightFont=*-regular, BoldFont=*-bold, ItalicFont=*-italic, BoldItalicFont=*-bolditalic]` and `\AtEndDocument{\clearpage\ifnum\value{page}>2 \errmessage{CV longer than one page}\fi}` (research R7); body = `\begin{document}`, a line `%% CONTENT %%`, `\end{document}`
- [x] T013 [US2] Create `src/lib/cv-latex.ts`: `latex(text)` escaping `\ { } $ & # ^ _ % ~` and mapping U+00A0 to `~` and U+202F to `\,` (research R6); `href(url, text)` escaping `%` and `#` in the URL; `renderCvLatex(cv)` building, from the `Cv` object only, `\hypersetup{pdftitle={<name> – CV}, pdfauthor={<name>}, pdflang=<locale>}`, the centred header (name, `email | city`, `linkedin | github | website`), then the non-empty sections in the page order with the macros of [contracts/cv.md § PDF](./contracts/cv.md) (experience and education: `detail` as first item, then highlights), section titles from the dictionary; it replaces `%% CONTENT %%` in the template imported with `import template from '../cv/template.tex?raw'`, and throws if the marker is missing (depends on T008, T012)
- [x] T014 [US2] Create `src/pages/[file].tex.ts`: `getStaticPaths` returns `{ params: { file: 'cv-fr' }, props: { locale: 'fr' } }` and the same for `en`; `GET` returns `renderCvLatex(await getCv(locale))` with `Content-Type: application/x-tex; charset=utf-8` (research R3) (depends on T013)
- [x] T015 [US2] Create `src/integrations/cv-pdf.ts`, an `AstroIntegration` named `cv-pdf` whose `astro:build:done({ dir })` hook, for `cv-fr` and `cv-en`: runs `execFile('tectonic', ['--keep-logs', '--chatter', 'minimal', '--outdir', <dir>, <dir>/<file>.tex])`; on `ENOENT` throws « tectonic introuvable : brew install tectonic (ou scripts/install-tectonic.sh) »; on a non-zero exit throws naming the file and quoting the end of the log; throws when `<file>.log` contains `Missing character`; throws when `<file>.pdf` does not exist; then deletes `<file>.tex` and `<file>.log`. Register it in `astro.config.mjs` `integrations` (depends on T014)
- [x] T016 [P] [US2] Create `scripts/install-tectonic.sh` (`set -eu`): download `https://github.com/tectonic-typesetting/tectonic/releases/download/tectonic%400.17.0/tectonic-0.17.0-x86_64-unknown-linux-musl.tar.gz`, check it against a pinned SHA-256 (compute it once from the release asset and write it in the script), extract `tectonic` into `node_modules/.bin/` (research R8)
- [x] T017 [US2] In `.github/workflows/ci.yml`, add `- run: sh scripts/install-tectonic.sh` after `npm ci`; in `vercel.json`, add `"installCommand": "npm ci && sh scripts/install-tectonic.sh"` (depends on T016)
- [x] T018 [US2] Validate quickstart §2 and the PDF cases of §4 (special characters, missing glyph, overflow, missing tool): both PDFs one page, `pdftotext` keeps accents and reading order, links open, no `.tex` or `.log` in `dist/`; commit `feat(cv): PDF built from the site data`

---

## Phase 5: User Story 3 - Imprimer la page depuis le navigateur (Priority: P2)

**Goal**: browser print gives one clean light A4 page.

**Independent Test**: quickstart §3.

- [x] T019 [US3] In `src/styles/global.css`, change `@media (prefers-color-scheme: dark)` to `@media screen and (prefers-color-scheme: dark)`, and add `@media print { :root { color-scheme: light; } }` (research R10)
- [x] T020 [US3] In `src/views/CvView.astro`, add an `@media print` block: `@page { size: A4; margin: … }` (component value, French comment), hide `:global(body > header)`, `:global(body > footer)` and `.download`, `a.print-url::after { content: ' (' attr(href) ')'; }`, avoid breaks inside entries (`break-inside: avoid`) (depends on T009, T019)
- [x] T021 [US3] Validate quickstart §3 in Chrome print preview, system in dark mode, both languages; check that no other page changed on screen in dark mode; commit `feat(cv): print layout`

---

## Phase 6: User Story 4 - Tenir le CV à jour sans le saisir (Priority: P2)

**Goal**: the CV follows the data; languages and city are written once; no phone number.

**Independent Test**: quickstart §4 (data cases).

- [x] T022 [US4] Scratch checks: remove `level.en` from a language, then empty `languages.yaml` → the build fails naming the entry or the file; unmark a featured project → it leaves the page and both PDFs; change a highlight → page and PDFs change. Revert everything
- [x] T023 [US4] Run the phone grep of quickstart §4 on the repository and `dist/`; it returns nothing. Verification only, no commit; if a fix is needed, commit it as `fix(cv): remove phone number`

---

## Phase 7: User Story 5 - Atteindre le CV depuis la campagne (Priority: P3)

**Goal**: the home calls to action lead to the CV.

**Independent Test**: quickstart §4 (end).

- [x] T024 [US5] In `src/data/campaign.ts`, set `actions` to `[{ label: { fr: 'Voir le CV', en: 'View my CV' }, href: { fr: '/cv', en: '/en/cv' } }, <the existing email action, unchanged>]` (research R12; CV first, as `CONTRIBUTING.md` describes)
- [x] T025 [US5] Validate on `/` and `/en`: « Voir le CV » then « M'écrire », each to the right target; capture the home at 375 px and 1280 px in both themes; commit `feat(cv): CV call to action on the home page`

---

## Phase 8: Documents

**Purpose**: aligned documents (research R12).

- [x] T026 [P] In `CONTENU.md`, §5: `/cv` « généré depuis les mêmes données, imprimable, PDF FR et EN » ; §6: add the `languages` row (`src/data/languages.yaml`, `name { fr, en }`, `level { fr, en }`) and `city` in the site identity; §7 lever 4: « aujourd'hui : CV + email »
- [x] T027 [P] In `CONTRIBUTING.md`: install Tectonic (`brew install tectonic`) before `npm run build`; add a language = one entry in `src/data/languages.yaml`; the CV has no data of its own; in `astro dev` the PDF link is a 404, check the PDFs with `npm run build` then `astro preview`; update the campaign paragraph to the current actions
- [x] T028 [P] In `DESIGN.md`, add a « CV » component section: the page (rubrics, density, dates aligned right from `56rem`, under the title at 375 px), its print layout (A4, light ink, no header or footer, project URLs written out), and the rule that the PDF follows a classic CV layout (the maintainer's LaTeX template, Pagella, dark blue links) on purpose, outside the site palette and type (constitution VIII, FR-016)
- [x] T029 [P] In `ROADMAP.md`, update the F09 « Plan » block to what was built (file names, integration, install script) if it changed during implementation

---

## Phase 9: Polish & design review

**Purpose**: constitution principles VII–IX gates for a visual feature.

- [x] T030 Run `/impeccable audit` on `/cv` and `/en/cv` and fix the findings in `src/views/CvView.astro`
- [x] T031 Run `/impeccable polish` and apply it; redo the captures of T011 (375 px and 1280 px, both themes, header and footer)
- [x] T032 Run Lighthouse mobile on `/cv` and `/en/cv` (≥ 95 / 100 / 100 / 100, 0 kB JS) and axe (0 violation); fix any issue
- [ ] T033 Ask the maintainer to read both PDFs and confirm the layout matches their current CV closely enough. **Blocks the merge**: the PR stays a draft until then
- [x] T034 Run `npm run format`, then `npm run check && npm run build`; both pass; push and check that CI and the Vercel preview serve `/cv-fr.pdf` and `/cv-en.pdf` (quickstart §5)

---

## Dependencies & Execution Order

- **Phase 1** → **Phase 2** → user stories. T003 blocks only T012.
- Phase 2: T004, T006, T007 in parallel; T005 after T004; T008 last.
- US1: T010 after T009.
- **US1** (Phase 3) needs Phase 2. **US2** (Phase 4) needs Phase 2 and T003; it does not
  need the page, only the download link of T009 points to its output. **US3** needs T009.
  **US4** needs US1 and US2. **US5** needs only T010 (the `/cv` route).
- **Phase 8** any time after the stories it describes; **Phase 9** last.

## Parallel Opportunities

- Phase 2: T004 ∥ T006 ∥ T007.
- US2: T016 ∥ T012–T015; the whole of Phase 4 ∥ Phase 3 once Phase 2 is done.
- Phase 8: T026 ∥ T027 ∥ T028 ∥ T029.

## Implementation Strategy

1. **MVP**: Phases 1–3. The `/cv` page exists, reachable from the navigation, from the data.
2. Add US2 (PDF): the feature's main promise, a LaTeX CV always in step with the site.
3. Add US3 (print), validate US4, switch the campaign (US5).
4. Align the documents, then audit, polish, the quality gates and the maintainer's reading of
   the PDFs.

Commits, one per user story:

1. `docs(specs): F09 specification, plan and tasks` (T001)
2. `feat(cv): online CV page` (Phase 2 and US1, T004–T011)
3. `feat(cv): PDF built from the site data` (US2, T012–T018)
4. `feat(cv): print layout` (US3, T019–T021)
5. `feat(cv): CV call to action on the home page` (US5, T024–T025)
6. `docs: align CONTENU, CONTRIBUTING, DESIGN and ROADMAP with the CV` (Phase 8)
7. `fix(cv): design review` or folded into the matching story commit (Phase 9)

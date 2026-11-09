---
description: 'Task list for F03 · Site bilingue'
---

# Tasks: Site bilingue

**Input**: Design documents from `specs/003-bilingual-site/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: no automated test suite (not requested). Types (`npm run check`) enforce dictionary
completeness; each story ends with a manual validation task taken from
[quickstart.md](./quickstart.md).

**Organization**: tasks grouped by user story. Visual change (switcher, header): **load the
`impeccable` skill before any task that touches UI** (AGENTS.md), respect `DESIGN.md` and the
tokens of `src/styles/global.css`, and finish with the Impeccable audit + polish phase.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: can run in parallel (different files, no dependency on an incomplete task)
- **[Story]**: US1–US4 from spec.md
- All paths are relative to the repository root.
- No UI literal in components from this feature on (constitution VI): every label is `t(key)`.
- Every style value comes from a token (`var(--…)`), constitution VIII exceptions only.

---

## Phase 1: Setup

**Purpose**: turn on Astro i18n routing; no dependency added.

- [x] T001 In `astro.config.mjs`, set `defineConfig({ i18n: { locales: ['fr', 'en'], defaultLocale: 'fr', routing: { prefixDefaultLocale: false } } })`, no `fallback`, no `redirectToDefaultLocale` (research R1). Add a short French comment: these two literals mirror `locales` / `defaultLocale` in `src/i18n/ui.ts` and must change together (plan, principle IV exception)

---

## Phase 2: Foundational (blocking prerequisites)

**Purpose**: the dictionary and the helpers every component uses.

**⚠️ CRITICAL**: no user story can start before this phase is done.

- [x] T002 Create `src/i18n/ui.ts` per [contracts/i18n.md](./contracts/i18n.md) and [data-model.md § Dictionary](./data-model.md): `export const locales = ['fr', 'en'] as const;`, `export type Locale = (typeof locales)[number];`, `export const defaultLocale: Locale = 'fr';` (comment: mirrors `astro.config.mjs`); `export const fr = { … } satisfies Record<string, string>;` with the 15 flat keys and French values of the data-model table, in that order (`skipLink`, `nav.label`, `nav.about`, `nav.projects`, `nav.background`, `nav.skills`, `nav.cv`, `nav.blog`, `nav.frenchMark`, `nav.inFrench`, `footer.email`, `footer.github`, `footer.linkedin`, `langSwitch.short`, `langSwitch.label`); `export type UiKey = keyof typeof fr;`; `export const en: Record<UiKey, string> = { … };` as an **annotated object literal** with the English values (so a missing key and an extra key are both type errors, R2). French comments: `fr` is the reference; `langSwitch.*` describe the target language, written in that language; `nav.frenchMark` / `nav.inFrench` are rendered only on non-French pages. French values must equal the F02 literals exactly (FR-007)
- [x] T003 Create `src/i18n/utils.ts` with, per [contracts/i18n.md § utils](./contracts/i18n.md): `getLocale(value: string | undefined): Locale` (`value === 'en' ? 'en' : 'fr'`, R3); `useTranslations(locale: Locale)` returning `(key: UiKey) => string` from `const dictionaries = { fr, en } satisfies Record<Locale, Record<UiKey, string>>`; `localizePath(path: string, locale: Locale): \`/${string}\``—`const bare = path.replace(/^\/en(?=\/|$)/, '') || '/'`, return `bare`for`fr`, `'/en/'`if`bare === '/'` else `` `/en${bare}` `` for `en`(R4; must satisfy every row of the contract's`localizePath`table, including`/english`→`/english`/`/en/english`). `switchPath` is added in US2

**Checkpoint**: `npm run check` passes.

---

## Phase 3: User Story 1 — Lire le site en anglais (Priority: P1) 🎯 MVP

**Goal**: `/en/` exists, declares English, and every UI label of the layout comes from the
dictionary in the page's locale; `/` is unchanged.

**Independent Test**: quickstart §2: `dist/en/index.html` has `lang="en"`, English skip link,
nav label and rubriques with `/en/` hrefs, name link → `/en/`; `dist/index.html` has
`lang="fr"` and the F02 labels.

### Implementation for User Story 1

- [x] T004 [P] [US1] Rewrite `src/data/nav.ts` per [data-model.md § Nav entry](./data-model.md): `import type { UiKey } from '../i18n/ui';` `type NavKey = Extract<UiKey, \`nav.${string}\`>;` `export interface NavItem { key: NavKey; href: \`/${string}\`; frenchOnly?: true }` (`label`removed;`href`= "French path, unprefixed; localized at render";`frenchOnly`= "entry exists only in French: href never localized, (FR) mark on other locales"); same six entries in the same order with keys`nav.about`, `nav.projects`, `nav.background`, `nav.skills`, `nav.cv`, `nav.blog`, and `frenchOnly: true`on the blog entry only. Update the French top comment (labels now come from the dictionary;`frenchOnly` for pages without an English version)
- [x] T005 [P] [US1] In `src/layouts/BaseLayout.astro`: `const locale = getLocale(Astro.currentLocale); const t = useTranslations(locale);`; `<html lang={locale}>` (FR-003); skip link text `{t('skipLink')}`. Props and title format unchanged
- [x] T006 [US1] In `src/components/Navigation.astro`: get `locale` and `t` as above; `aria-label={t('nav.label')}`; for each item, label `t(item.key)` and `href = item.frenchOnly ? item.href : localizePath(item.href, locale)`; apply the F02 current-item rule (`strip`, `"page"` / `"true"`) to that localized `href` (FR-011, FR-012). The (FR) mark comes in US3
- [x] T007 [P] [US1] In `src/components/Footer.astro`: labels `t('footer.email')`, `t('footer.github')`, `t('footer.linkedin')` with `t` from `useTranslations(getLocale(Astro.currentLocale))`; hrefs unchanged
- [x] T008 [P] [US1] In `src/components/Header.astro`: name link `href={localizePath('/', locale)}` (US1 scenario 4); switcher comes in US2
- [x] T009 [US1] Create `src/views/HomeView.astro` from the current `src/pages/index.astro` (same markup and scoped styles): `const locale = getLocale(Astro.currentLocale)`; `const pitch = { fr: 'Élève ingénieur à IMT Mines Alès, en alternance chez Astrée Software, je développe des applications métier, du modèle de données à la mise en production.', en: 'Engineering student at IMT Mines Alès and apprentice developer at Astrée Software. I build business applications, from the data model to production.' } satisfies Record<Locale, string>;` then `pitch[locale]` as description and paragraph (R8, R9). **Ask the maintainer to approve or rewrite the English pitch before committing** (`CONTENU.md` §9). Frontmatter comment: provisional, pitch moves to `campaign.ts` in F05
- [x] T010 [US1] Replace `src/pages/index.astro` with the shell `import HomeView from '../views/HomeView.astro';` + `<HomeView />`, and create `src/pages/en/index.astro` with `import HomeView from '../../views/HomeView.astro';` + `<HomeView />`: no markup, no prop, no style (FR-014, FR-015, contract § Page pattern)
- [x] T011 [US1] Validate US1 with quickstart §2 (`lang` per page, English labels and `/en/` hrefs on `/en/`, name link → `/en/`, 0 `<script>`, no `/en/blog`) and the SC-007 diff of `dist/index.html` against a `main` build (only difference allowed later: the header that holds the switcher); `npm run check && npm run build` pass; check every row of the `localizePath` table of [contracts/i18n.md](./contracts/i18n.md) (6 inputs × 2 locales) with a temporary `src/pages/paths-check.astro` that renders `localizePath(input, locale)` for each case, compared with the table in `astro dev --background`, then **delete it, never commit it** (quickstart §3)

**Checkpoint**: MVP — the site exists in both languages; switching still by URL.

---

## Phase 4: User Story 2 — Changer de langue depuis n'importe quelle page (Priority: P1)

**Goal**: one link in the header leads to the same page in the other language, or to that
language's home if the page does not exist.

**Independent Test**: quickstart §2 (switcher markup on `/` and `/en/`) and §4 (fallback for a
French-only page; round trip for a page in both languages).

### Implementation for User Story 2

- [x] T012 [US2] In `src/i18n/utils.ts`, add the route listing and `switchPath` (R5): `const strip = (p: string) => (p.length > 1 ? p.replace(/\/+$/, '') : p);` `const routes = new Set(Object.keys(import.meta.glob('/src/pages/**/*.astro')).filter((file) => !file.includes('[')).map((file) => strip(file.replace(/^\/src\/pages/, '').replace(/\.astro$/, '').replace(/\/index$/, '') || '/')));` and `export function switchPath(pathname: string, locale: Locale): \`/${string}\``—`other = locale === 'fr' ? 'en' : 'fr'`, `target = localizePath(pathname, other)`, return `routes.has(strip(target)) ? target : localizePath('/', other)`(FR-008). French comment: dynamic routes are not listed (F06). If`astro build`fails on the circular lazy import, switch the glob to`{ query: '?raw' }` (R5 risk)
- [x] T013 [US2] Create `src/components/LangSwitcher.astro` per R6 and contract § Layout: `const locale = getLocale(Astro.currentLocale); const other = locale === 'fr' ? 'en' : 'fr'; const t = useTranslations(locale);` render one `<a href={switchPath(Astro.url.pathname, locale)} hreflang={other} lang={other} aria-label={`${t('langSwitch.short')}, ${t('langSwitch.label')}`}>{t('langSwitch.short')}</a>`, no `<script>` (FR-009). Scoped style as nav links (DESIGN.md § Navigation: `EN` in 600): `display: inline-block`, `padding-block: var(--space-1)`, `font-size: var(--text-sm)`, `font-weight: var(--weight-semibold)`, `text-decoration: none`, `text-underline-offset: var(--underline-offset-current)`; hover `text-decoration-line: underline; text-decoration-thickness: var(--rule-heavy)` (FR-010)
- [x] T014 [US2] In `src/components/Header.astro`, wrap `<Navigation />` and `<LangSwitcher />` in a right-hand group (e.g. `<div class="end">`) so the name stays left (DESIGN.md § Navigation); scoped style `display: flex; flex-wrap: wrap; align-items: baseline; gap: var(--space-1) var(--space-5)`; the group must wrap under the name at 320 px without horizontal scroll (FR-010)
- [x] T015 [US2] Validate US2 with quickstart §2 (switcher on `/`: `href="/en/" hreflang="en" lang="en" aria-label="EN, English"`, text `EN`; on `/en/`: `href="/"`, `lang="fr"`, `aria-label="FR, Français"`, text `FR`) and §4 (scratch `src/pages/blog/index.astro` → switcher to `/en/`; scratch `src/pages/test.astro` + `src/pages/en/test.astro` → `/test` ↔ `/en/test`; **delete the scratch pages, never commit them**)

**Checkpoint**: both P1 stories done.

---

## Phase 5: User Story 3 — Trouver le blog depuis la version anglaise (Priority: P2)

**Goal**: on English pages, Blog points to `/blog/`, shows (FR) and is announced as French.

**Independent Test**: quickstart §2: on `/en/`, Blog → `/blog/` with ` (FR)`, `hreflang="fr"`,
`aria-label="Blog (FR), in French"`; on `/`, Blog without mark or `aria-label`.

### Implementation for User Story 3

- [ ] T016 [US3] In `src/components/Navigation.astro`, for an item with `frenchOnly` on a page whose `locale !== 'fr'` (R7, FR-013): link text `` `${t(item.key)} ${t('nav.frenchMark')}` ``, `hreflang="fr"`, `aria-label={\`${t(item.key)} ${t('nav.frenchMark')}, ${t('nav.inFrench')}\`}`(visible text kept in the accessible name, WCAG 2.5.3). On French pages, no mark, no`hreflang`, no `aria-label` (output identical to F02)
- [ ] T017 [US3] Validate US3 with quickstart §2 (Blog markup on `/en/` and `/`; `grep -rn 'href="/en/blog' dist` → nothing, SC-006)

**Checkpoint**: navigation complete in both languages.

---

## Phase 6: User Story 4 — Ajouter un libellé ou une page dans les deux langues (Priority: P2)

**Goal**: a key missing in one language, an extra key, or an unknown key fails the check; a
bilingual page = one view + two shells.

**Independent Test**: quickstart §1 (three failure cases, then restore).

### Implementation for User Story 4

- [ ] T018 [P] [US4] At the top of `src/i18n/ui.ts`, add a short French comment: adding a UI label = one key in `fr` and in `en`; `npm run check` fails if one side is missing. At the top of `src/views/HomeView.astro`, a French comment: a bilingual page = one view here + one shell in `src/pages/` and one in `src/pages/en/`, each rendering the view with no prop (contract § Page pattern)
- [ ] T019 [US4] Validate US4 with quickstart §1: delete `'nav.about'` from `en` → `npm run check` fails; add `extra: 'x'` to `en` only → fails; call `t('nav.missing')` in `src/components/Footer.astro` → fails; restore each and confirm `npm run check` passes (FR-006, SC-004)

**Checkpoint**: all four stories done.

---

## Phase 7: Design review, accessibility & polish (Impeccable)

**Purpose**: constitution gate for a visual feature — audit + polish before the feature is
done.

- [ ] T020 Run `/impeccable audit` on `/` and `/en/` (both themes, 320 px and desktop), focused on the header group and the switcher; list findings
- [ ] T021 Run `/impeccable polish` and apply the accepted fixes in the files concerned (`src/components/Header.astro`, `src/components/LangSwitcher.astro`, `src/components/Navigation.astro`), tokens only
- [ ] T022 Run quickstart §5 on `/` and `/en/`: keyboard order (skip link → name → rubriques → switcher → content → footer) and focus ring on the switcher; 320 px and 200 % zoom in both themes without horizontal scroll; axe 0 errors in light and dark (SC-009); Lighthouse mobile ≥ 95 / 100 / 100 / 100 and < 200 kB transferred on both (SC-008). VoiceOver checks (switcher read in English, "Blog (FR), in French") may be left to the maintainer; say so in the task note
- [ ] T023 Run `npm run check && npm run build` on the whole branch, `grep -rnE "Aller au contenu|Navigation principale|À propos|Projets|Parcours|Compétences|>(Email|GitHub|LinkedIn|CV|Blog)<|'(Email|GitHub|LinkedIn|CV|Blog)'" src/components src/layouts src/views` → 0 hit (constitution VI), a hit inside a French code comment is not a label and is allowed; then read the markup of each changed component for any other literal text, and `git log main..HEAD --oneline` to check that every commit is conventional and in English

---

## Dependencies & Execution Order

- **Setup (T001)**: no dependency.
- **Foundational (T002–T003)**: T002 → T003 (imports `ui.ts`). Blocks all stories.
- **US1 (T004–T011)**: T004 → T006 (needs `NavItem.key`), in parallel with T005 ∥ T007 ∥
  T008, then T009 → T010 → T011.
- **US2 (T012–T015)**: after US1 (needs the English home to switch to). T012 → T013 → T014 →
  T015.
- **US3 (T016–T017)**: after US1 (needs localized nav and `frenchOnly`). Independent of US2.
- **US4 (T018–T019)**: after Foundational and T009; independent of US2 and US3.
- **Phase 7 (T020–T023)**: after all stories.

```text
T001 ─► T002 ─► T003
                  │
                  ▼
   T004 ∥ T005 ∥ T006 ∥ T007 ∥ T008 ─► T009 ─► T010 ─► T011   (US1)
                                                 │
              ┌──────────────────────────────────┼─────────────────────┐
              ▼                                  ▼                     ▼
  T012 ─► T013 ─► T014 ─► T015 (US2)    T016 ─► T017 (US3)    T018 ─► T019 (US4)
              └──────────────────────────────────┬─────────────────────┘
                                                 ▼
                                  T020 ─► T021 ─► T022 ─► T023
```

## Parallel Examples

- **US1**: T005 (`BaseLayout.astro`), T007 (`Footer.astro`) and T008 (`Header.astro`) together,
  while T004 then T006 update `nav.ts` and `Navigation.astro`.
- **After US1**: US2 (`utils.ts`, `LangSwitcher.astro`, `Header.astro`), US3
  (`Navigation.astro`) and US4 (comments, checks) touch different files and can run in any
  order; keep the order of the suggested commits below.

## Implementation Strategy

1. **MVP = Phases 1–3 (US1)**: i18n routing, dictionary, layout in both languages, English home.
2. **Then US2**: the language switcher with its fallback.
3. **Then US3**: Blog (FR) in the English navigation.
4. **Then US4**: document and verify the dictionary checks.
5. **Then Phase 7**: Impeccable audit + polish, final measurements.

Suggested commits (one per group, each ticking its own tasks in this file; `npm run check`
before each):

| Commit                                                       | Tasks     |
| ------------------------------------------------------------ | --------- |
| `docs(specs): F03 specification, plan and tasks`             | spec docs |
| `feat: add i18n routing and typed ui dictionary`             | T001–T003 |
| `feat: serve layout labels from the dictionary in fr and en` | T004–T011 |
| `feat: add language switcher in the header`                  | T012–T015 |
| `feat: mark the french-only blog in english navigation`      | T016–T017 |
| `docs: explain how to add a ui label or a bilingual page`    | T018–T019 |
| `fix: apply design review fixes` (or `a11y:` if only a11y)   | T020–T023 |

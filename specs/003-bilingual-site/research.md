# Research: Site bilingue

All Technical Context items were known; this file records the decisions and what was
rejected.

## R1 — Routing: Astro i18n, no prefix for French

- **Decision**: `i18n: { locales: ['fr', 'en'], defaultLocale: 'fr', routing: {
prefixDefaultLocale: false } }` in `astro.config.mjs`. French pages live in `src/pages/`,
  English pages in `src/pages/en/`. Astro then fills `Astro.currentLocale` (`'en'` under `/en`,
  `'fr'` elsewhere) in pages and components.
- **Rationale**: built-in (principle I), static, gives the locale without parsing URLs in every
  component. No `fallback` and no `redirectToDefaultLocale`: they generate redirect pages we do
  not need (the switcher handles missing pages, R5).
- **Alternatives**: no i18n config and a hand-written `getLocale(url)` (works, but reinvents
  `currentLocale` and loses F04's `@astrojs/sitemap` i18n integration); `[lang]/` dynamic
  segment for both locales (breaks the "French without prefix" rule or needs rewrites).

## R2 — Dictionary typed so a missing key fails `astro check`

- **Decision**: `src/i18n/ui.ts` exports `fr` (`satisfies Record<string, string>`), the type
  `UiKey = keyof typeof fr`, and `en: Record<UiKey, string>` written as an annotated object
  literal. A key missing in `en` is a missing-property error; a key only in `en` is an
  excess-property error; `t('unknown')` is a type error since `t` takes a `UiKey`.
  All three fail `npm run check` (FR-006, SC-004).
- **Rationale**: zero dependency, zero runtime check, error at the exact line. French is the
  reference because it is the default locale and the source of the F02 labels.
- **Alternatives**: a build-time script comparing the two objects (more code, same result);
  JSON files + a schema (loses autocompletion on keys); a library (`astro-i18next`, `i18next`):
  pluralisation, interpolation, lazy loading: none needed for ~15 static labels (principle I).
- Flat dotted keys (`'nav.projects'`), not nested objects: simpler type, simpler lookup.
- Empty strings are not detected (spec Assumptions).

## R3 — Locale reaches views through `Astro.currentLocale`, not a prop

- **Decision**: page shells render the view with no prop (`<HomeView />`). The view, the
  layout and the components all read the locale with `getLocale(Astro.currentLocale)`.
- **Rationale**: the URL is the single source of the locale (principle IV). A `locale` prop
  passed by each shell is a second source: `src/pages/en/x.astro` could pass `'fr'` by mistake
  and render French under `/en`. This differs from the roadmap wording ("un composant qui reçoit
  la locale"): the view still receives it, from Astro rather than from its shell.
- **Alternatives**: `locale` prop drilled from the shell to the layout and every component
  (more plumbing, two sources).
- `getLocale` narrows `string | undefined` to `Locale` (`'en'` → `'en'`, anything else →
  `'fr'`), so components never handle `undefined`.

## R4 — `localizePath` written by hand, not `getRelativeLocaleUrl`

- **Decision**: `localizePath(path, locale)` first removes a leading `/en` segment, then adds
  `/en` for English. It accepts any site path, with or without prefix, so the switcher is
  `localizePath(Astro.url.pathname, other)` and the nav is `localizePath(item.href, locale)`.
  Rules: `/` ↔ `/en/`; `/projects/` ↔ `/en/projects/`; `/about` ↔ `/en/about`; the trailing
  slash of the input is kept.
- **Rationale**: four lines, behaviour fully visible. `astro:i18n`'s `getRelativeLocaleUrl`
  adds `base`/trailing-slash normalisation we do not use, and has no "remove prefix" mode, so we
  would still need the inverse by hand.
- **Alternatives**: `getRelativeLocaleUrl` + `getPathByLocale` (two APIs for one need); a
  route dictionary (excluded by `CONTENU.md` §5: paths are identical).

## R5 — Knowing at build time whether the other-language page exists

- **Decision**: `src/i18n/utils.ts` lists the generated static routes once with
  `Object.keys(import.meta.glob('/src/pages/**/*.astro'))`, converted to paths
  (`/src/pages/en/index.astro` → `/en/`, `/src/pages/about.astro` → `/about`), and compares
  them without trailing slash. `switchPath(pathname, locale)` returns `localizePath(pathname,
other)` if that route exists, else the other locale's home (FR-008).
- **Rationale**: derived from the files actually present, so no list to maintain; the blog
  (no `src/pages/en/blog/`) falls back to `/en/` with no special case.
- **Limits**: dynamic routes (`[slug].astro`, from F06) are skipped by this listing. F06 adds
  their translated paths when it builds them; noted for that plan.
- **Risk**: the glob creates lazy imports of the pages from a module the pages import
  (circular, but never executed). If `astro build` complains, switch to
  `import.meta.glob(..., { query: '?raw' })`, which imports file text, not modules.
- **Alternatives**: a `translated` prop on each page (forgettable, leads to broken links);
  reading `src/pages` with `node:fs` (depends on the working directory, breaks in dev with
  some setups); generating both locales for every page, even untranslated (contradicts
  FR-004 for the blog).

## R6 — Language switcher markup

- **Decision**: one link in the header, after the navigation (`DESIGN.md` › Navigation: « les
  rubriques … et `EN` (600) à droite »). Visible text `EN` on French pages, `FR` on English
  pages; `aria-label` = visible text + full language name in that language (`EN, English`,
  `FR, Français`), so the visible text is a whole word of the accessible name (WCAG 2.5.3;
  `English` alone failed Lighthouse's label-content-name-mismatch check at implementation); `lang` and `hreflang` set to the target
  locale (FR-009). Same type size, underline and focus as nav links, weight 600.
- **Rationale**: plain `<a>`, no JS (principle II); `DESIGN.md` already fixes its look.
- **Alternatives**: `<select>` (needs JS to navigate); listing both languages with the current
  one marked (two items for one choice; useful only beyond two locales).

## R7 — Blog entry in the English navigation

- **Decision**: `nav.ts` marks the blog entry `frenchOnly: true`. Such an entry keeps its
  French href (`/blog/`) in every locale. On a page whose locale is not French it shows
  ` (FR)` after the label and carries `hreflang="fr"` and
  `aria-label="Blog (FR), in French"` (label text + mark + `nav.inFrench`), so the visible text
  stays in the accessible name and the destination language is spoken (FR-013, US3).
- **Rationale**: one flag in the data, no special case keyed on the word "blog".
- **Alternatives**: a visually hidden span (needs a new global utility class for one use);
  `title` attribute (not reliably announced).

## R8 — One view per bilingual page

- **Decision**: `src/views/HomeView.astro` holds the home markup and styles; it picks its
  prose with `const pitch = { fr: '…', en: '…' } satisfies Record<Locale, string>`.
  `src/pages/index.astro` and `src/pages/en/index.astro` are two-line shells (FR-014).
- **Rationale**: the plan input; markup and styles exist once. The pitch stays in the view
  until F05 moves it to `campaign.ts` (spec Assumptions).
- **Alternatives**: `[...locale]` dynamic route with `getStaticPaths` (one file, but mixes
  French-without-prefix with a param and makes `currentLocale` harder to reason about).

## R9 — English provisional pitch

- **Decision** (draft, to be approved by the maintainer at implementation, `CONTENU.md` §9.6:
  rewritten, not translated): "Engineering student at IMT Mines Alès and apprentice developer
  at Astrée Software. I build business applications, from the data model to production."
- Title of both home pages stays `site.name` (proper noun, not a UI label).

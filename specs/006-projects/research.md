# Research: Projets

Phase 0 of [plan.md](./plan.md). No `NEEDS CLARIFICATION` remained in the Technical Context;
each entry below records one design decision.

## R1 — Two collections, one per language

- **Decision**: `projects` (glob `*.md` in `src/content/projects/fr`) and `projectsEn` (same
  in `…/en`), both in `src/content.config.ts`. The entry id is the file name, so it is the
  slug and the join key. Both schemas are `.strict()`.
- **Rationale**: the two files have different shapes (FR-002, FR-003). With two strict
  schemas, a year or a link written in the English file fails the build instead of being
  ignored, which enforces principle IV. `id = slug` is also what F08 needs for
  `reference('projects')`.
- **Alternatives**: one collection with a `fr/` / `en/` id prefix and a union schema (the
  union gives poor error messages and every caller must split ids); EN prose inside the FR
  file (breaks « one file per language », long frontmatter).

## R2 — What the schema checks, and what `getProjects` checks

- **Decision**: per-entry rules live in zod (required fields, year, `eval` enum, URL links,
  `image()` cover, squares, `cover` ⇔ `coverAlt`, `featured` ⇒ `move`). Rules that span
  several entries live in `src/lib/projects.ts`, which throws with the slugs in the message:
  English file without a French file, empty body of a published project, cover without English `coverAlt` (or the
  reverse), more than three published featured projects, more than one featured `!!`.
- **Rationale**: a zod schema sees one entry at a time. Every page of the feature and the
  home call `getProjects`, so the build always runs the cross-entry checks. A plain `throw`
  fails `astro build`, like `parseFen` and `formatStart` in F05.
- **Alternatives**: a custom loader that validates the whole set (more code than five
  `if`s); an Astro integration hook (same checks, further from the data).

## R3 — One merged type, one access function

- **Decision**: `getProjects(locale)` returns `Project[]`, already filtered, merged and
  sorted: French data, prose of the page language, `untranslated: true` when the English file
  is missing (prose is then the French one), and the entry whose body must be rendered.
  `featuredProjects(locale)` is a filter on top. Sort: `year` descending, then the French
  title with `localeCompare('fr')`.
- **Rationale**: lists, pages and static paths read the same array, so draft filtering,
  fallback and order cannot diverge. Sorting on the French title gives the same order in both
  languages. `src/lib/` appears here because the helper has four callers (two views, two
  route files), unlike the F05 helpers kept next to their data.
- **Alternatives**: merging in each view (three copies of the fallback rule); sorting on the
  displayed title (order changes between `/projects` and `/en/projects`).

## R4 — Drafts

- **Decision**: `getProjects` drops `draft: true` entries when `import.meta.env.PROD`. In
  `astro dev` they are listed and rendered with a « Brouillon » / « Draft » mark. The featured
  and `!!` limits count published projects only.
- **Rationale**: `CONTENU.md` §7 (« existe en local, absent en production »). Vercel previews
  are production builds, so a draft never reaches a public URL. A draft passes the same
  schema as a published file; only its body may be empty (spec, Clarifications).
- **Alternatives**: an environment variable to show drafts in previews (no need today).

## R5 — Routes and static paths

- **Decision**: `src/pages/projects/index.astro` and `[slug].astro`, mirrored under
  `src/pages/en/projects/`. Each `[slug].astro` exports
  `getStaticPaths = () => projectPaths(locale)` (from `src/lib/projects.ts`) and passes
  `props.project` to `ProjectView`. Views: `ProjectsView.astro`, `ProjectView.astro`
  (F03 pattern).
- **Rationale**: `getStaticPaths` must be exported by the page file; the helper keeps the
  two shells at three lines. Every published project gets both paths, with or without an
  English file (FR-012, SC-006).
- **Alternatives**: one `[...locale]/projects/[slug].astro` (breaks the F03 mirror and
  `Astro.currentLocale`).

## R6 — Language switch and alternates for dynamic routes

- **Decision**: `src/i18n/utils.ts` keeps its set of static routes and adds one pattern per
  page file that contains `[param]` (`/projects/[slug]` → `^/projects/[^/]+$`).
  `alternatePath` accepts a target that matches a pattern. The switch therefore goes from
  `/projects/x` to `/en/projects/x` and back (FR-017).
- **Rationale**: closes the F03 note « routes dynamiques non listées : à traiter en F06 »
  with about five lines and no list of slugs. Both paths always exist (R5), so a pattern is
  enough.
- **Alternatives**: passing the alternate path as a prop through `BaseLayout` → `Header` →
  `LangSwitcher` (three components touched for one link).

## R7 — French fallback: page, meta and sitemap

- **Decision**:
  - `ProjectView` on `/en/projects/<slug>` with `untranslated`: English interface, a notice
    from the dictionary, and `lang="fr"` on the French title, summary, key move, body and
    cover alt. Rows of an untranslated project carry `lang="fr"` on their text and a
    « French only » mention.
  - `BaseLayout` and `Seo` get one optional prop, `untranslated`. English page: `noindex`,
    canonical to the French URL, no `hreflang`. French page: no `hreflang` (FR-027).
  - Sitemap: `astro.config.mjs` cannot read collections. `src/data/seo.ts` gets
    `isUntranslatedProjectPath(pathname)`, true for an `/en/projects/<slug>` path whose
    English file does not exist (`existsSync` from `node:fs`); the sitemap `filter` uses it.
- **Rationale**: one boolean covers both sides of the pair. The sitemap integration filters
  pages before it pairs languages, so the French page loses its English alternate there too
  (checked in quickstart §6). `seo.ts` already is the module shared with the config.
- **Alternatives**: adding fallback slugs by hand to `noindexPaths` (a second place to edit
  for each fiche, against « 0 ligne de code »); three props on `Seo` (`noindex`, `canonical`,
  `alternates`) for a single case.

## R8 — Evaluation symbol and colour tokens

- **Decision**: `EvalMark.astro` renders the symbol with `aria-hidden` and its meaning in a
  visually hidden span (dictionary keys `eval.good`, `eval.bet`, `eval.brilliant`). It sets
  `data-eval`, and `!!` takes `--color-brilliant`. New tokens in `global.css`, light and
  dark, from the `DESIGN.md` front matter: `--color-invert-bg`, `--color-invert-ink`,
  `--color-mark-on-invert`, `--color-brilliant`, `--color-brilliant-on-invert`.
- **Rationale**: the symbol appears in rows, legends and the project page; one component
  keeps colour and accessible name in one place (FR-005, FR-010). Blue ships in F06
  (clarification 2), so the invert tokens the rows need arrive together.
- **Alternatives**: `aria-label` on the symbol (not announced reliably on a `span`); a class
  per symbol in each caller.

## R9 — One list component, two densities

- **Decision**: `ProjectList.astro` takes `projects` and `detail`. `detail` (page
  `/projects`): year, title, summary, technologies as one line of text separated by « · »,
  symbol. Without it (home): year and notation, title, « Coup clé : … », symbol. Same grid
  (4.5rem / 1fr / 2.5rem), same inverted row on hover and focus, the whole row is one link,
  and the legend lists only the symbols present. No hover move on the diagram (F11).
- **Rationale**: the two lists share grid, states, symbol, fallback and draft marks; only
  the middle and left cells differ. Technologies stay plain text in a row because the row is
  a single link that inverts; chips (`DESIGN.md`, Chips) are for the project page.
- **Alternatives**: two components (duplicated states and marks); chips inside rows (borders
  to recolour on inversion, noisy at 375 px).

## R10 — Home placement

- **Decision**: the featured list is a third child of the `.opening` grid: column 1, row 2
  on desktop, with the diagram column spanning both rows (still sticky); under `56rem` it
  comes after the diagram, as `DESIGN.md` (Responsive) orders. Heading from the dictionary
  (« Parties choisies » / « Selected games »), without a count. Nothing is rendered when no
  project is featured (FR-023).
- **Rationale**: source order gives the mobile order without `order` or duplicated markup.
  A heading without a number stays true with one, two or three projects.
- **Alternatives**: the list inside `.lead` (on mobile it would sit above the diagram and
  push it down, against the documented order).

## R11 — Notation per language

- **Decision**: `move.notation` is `{ fr, en }` in the French file (`23.Fxh7` / `23.Bxh7`).
- **Rationale**: piece letters differ between French and English, and the first audience
  reads English. The notation is a rendering of one move, not narrative, so it stays next to
  `from` / `to` instead of going to the English file; `diagram.ts` already does the same for
  its `alt`. Computing it from the squares would need capture, check and disambiguation
  rules for three strings.
- **Alternatives**: one string (wrong letters in one language); a chess library
  (principle I).

## R12 — Project page composition

- **Decision**: back link, `h1`, summary, then a definition list (year, technologies as
  chips, links when present), the key move between two thin rules with the symbol in the
  margin column, the cover when present, then the body in the annotated column. The cover
  uses `<Picture>` (AVIF + WebP, widths up to the reading measure × 2, `loading="lazy"`,
  width and height from `image()`).
- **Rationale**: follows clarifications 1 and 3. The prototype's « Contexte » and « Rôle »
  cells have no field, so the header has three entries, two without links; its grid adapts.
  Dimensions come from the image import, so there is no layout shift (FR-015).
- **Alternatives**: keeping four fixed columns with new fields `context` and `role` (not in
  the spec); cover above the title (pushes the summary off the first mobile screen).

## R13 — Sample entries

- **Decision**: `sample-project.md` (published, featured, `!!`, cover, English file, move
  `4.c3` on the provisional position) and `sample-draft.md` (draft, `!?`, no English file, no
  cover). All prose carries « [provisoire] » / « [draft] ». The cover is a flat provisional
  image generated once with sharp (already installed with Astro), like the F05 crop.
- **Rationale**: FR-029; the pair exercises blue, cover, featured, draft and the fallback
  page (visible in dev). A second published fixture is added only on scratch branches for
  the quickstart checks.
- **Alternatives**: a real screenshot (no real project yet, C2).

## R14 — Documents to align

- **Decision**: one `docs:` commit updates `CONTENU.md` §6 (new fields, English shape),
  `DESIGN.md` (symbol notes the key move, blue tokens in F06, cover place, `/projects` row,
  legend final) and `ROADMAP.md` (F11 loses the blue-token line). No constitution change.
- **Rationale**: the spec now contradicts these three documents (Governance: « aligné,
  jamais ignoré »).

## R15 — Commentator notes in the narrative (after the critique)

- **Decision**: a Markdown blockquote in a project file becomes a commentator note
  (`div.note`, between thin rules). A note starting with `!`, `!?` or `!!` gets that symbol in
  the margin and a visually hidden meaning from the dictionary. Done by one HTML plugin,
  `src/lib/note-annotations.ts`, passed to Astro's default Markdown processor (Sätteri) in
  `astro.config.mjs`; the plugin only touches files under `src/content/projects/`.
- **Rationale**: the critique scored the narrative as six identical blocks with an empty
  margin. A blockquote is plain Markdown the author already knows, and it needs no new field.
  `@astrojs/markdown-satteri` is declared because the config imports it; it is the version
  Astro already installs.
- **Alternatives**: `markdown.remarkPlugins` (needs `@astrojs/markdown-remark`, a second
  Markdown stack); CSS only on `blockquote` (no blue for `!!`, no accessible meaning); a
  frontmatter field per section (sections are not named in data).

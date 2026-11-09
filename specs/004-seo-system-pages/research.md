# Research: SEO et pages système

All Technical Context items were known after reading the code and the `@astrojs/sitemap`
3.7.4 source; this file records the decisions and what was rejected.

## R1 — One `Seo.astro`, called by `BaseLayout`, that derives everything from the URL

- **Decision**: `src/components/Seo.astro` renders every presentation tag in `<head>`: title,
  description, canonical, `robots`, Open Graph, `twitter:card`, `hreflang` links. Props:
  `title`, `description`, optional `image`. Canonical, alternates and the noindex flag are
  **computed** from `Astro.url.pathname`, `Astro.site`, `Astro.currentLocale`, the generated
  routes and `PUBLIC_NOINDEX`, not passed in. `BaseLayout` keeps its `title` / `description`
  props, adds `image`, and delegates its current `<title>` / description lines to `Seo`.
- **Rationale**: a new page gives 2 values and nothing else (SC-005). The roadmap listed
  `noindex` and `alternates` as props; passing them would make each page a second source for
  facts the URL and the route list already hold (principle IV), and a shell could pass
  alternates that do not exist (SC-002). `noindex` moves to a data list (R4).
- **Alternatives**: `astro-seo` package (a prop bag over the same 15 tags, one more
  dependency, principle I); tags written in `BaseLayout` directly (works, but `BaseLayout`
  already holds layout, font preload and skip link; one component per concern reads better).

## R2 — Canonical: `Astro.site` + pathname with a trailing slash

- **Decision**: `site` is set in `astro.config.mjs`. Canonical =
  `new URL(withTrailingSlash(Astro.url.pathname), Astro.site)`. Same helper for `og:url`, the
  `hreflang` links and `og:image` (absolute, as Open Graph requires).
- **Rationale**: the build format is `directory` (Astro default), so pages are served at
  `/x/`, and `@astrojs/sitemap` writes `/x/` too (checked in its `addRouteUrl`). The canonical
  must be the exact URL listed in the sitemap. Normalising in one helper makes the result the
  same whether Astro gives `/x` or `/x/` (spec edge case).
- **Alternatives**: `trailingSlash: 'always'` in the config (also correct, but turns
  `/about` into a 404 in dev and changes every existing nav `href`: out of scope).
- **Domain**: unknown until go-live (spec Assumptions). Placeholder
  `https://ramazankus.example` (`.example` is reserved, so no real third-party site is ever
  pointed at). Changing this one line updates canonicals, alternates, sitemap and robots.
  It MUST be replaced in the go-live step (`ROADMAP.md` « Mise en ligne »).

## R3 — Global switch: `astro:env` boolean `PUBLIC_NOINDEX`

- **Decision**: `env.schema.PUBLIC_NOINDEX = envField.boolean({ context: 'client', access:
'public', default: false })` in `astro.config.mjs`; read with
  `import { PUBLIC_NOINDEX } from 'astro:env/client'` in `Seo.astro` and `robots.txt.ts`.
- **Rationale**: typed and validated by Astro: `PUBLIC_NOINDEX=yes` fails the build instead
  of silently meaning "indexable". Default `false` keeps local builds indexable so they can be
  checked (spec Assumptions); the host sets `true` until C3. Inlined at build, no runtime.
- **Alternatives**: raw `import.meta.env.PUBLIC_NOINDEX === 'true'` (untyped string, a typo
  passes silently); a constant in a data file (changing it would need a commit, and branch
  previews could not differ from production).

## R4 — Per-page noindex: a path list in `src/data/seo.ts`, read by `Seo` and the sitemap

- **Decision**: `src/data/seo.ts` exports `noindexPaths` (bare paths, no `/en`, applied to
  both locales) and `isNoindexPath(pathname)`. `Seo.astro` emits `noindex` when
  `PUBLIC_NOINDEX || isNoindexPath(pathname) || isStatusPage(pathname)`. The sitemap
  `filter` calls the same `isNoindexPath` on each URL's pathname. The list starts **empty**:
  the only non-indexable page today is the 404, handled by R7.
- **Rationale**: `@astrojs/sitemap`'s `filter` only sees URLs, not page props. A `noindex`
  prop on the page plus a path list in the config would be two sources for one fact; one list
  read by both keeps them in sync (principle IV, SC-003). The module imports nothing from
  `astro:*`, so `astro.config.mjs` can import it (Astro loads the config through Vite, which
  compiles TS). If that import fails at implementation, rename the config to
  `astro.config.ts`; no other change.
- **Alternatives**: own sitemap endpoint that globs pages for an exported `noindex` constant
  (≈ 50 lines reimplementing i18n links and chunking); `noindex` prop + duplicated filter
  (drifts).

## R5 — Alternates from the routes already listed for the switcher

- **Decision**: `src/i18n/utils.ts` gains `alternatePath(pathname, locale)`: the other
  locale's path if it is a generated route, else `undefined`. `switchPath` becomes
  `alternatePath(...) ?? localizePath('/', other)`. Status pages (`/404`, `/en/404`) are
  removed from the `routes` set. `Seo` emits `hreflang="fr"`, `hreflang="en"` and
  `hreflang="x-default"` (→ French) only when the alternate exists; `og:locale:alternate` too.
- **Rationale**: one route list for both the switcher and the alternates: they can never
  disagree (FR-005, SC-002). Removing status pages makes the switcher on a 404 go to the other
  home (spec edge case) instead of `/en/404/`, which is not a servable page.
- **Alternatives**: `getRelativeLocaleUrl` from `astro:i18n` (does not know if the target
  exists); alternates as a prop (R1).

## R6 — Sitemap: `@astrojs/sitemap` with `i18n` and `filter`

- **Decision**: add `@astrojs/sitemap@^3.7.4`.
  `sitemap({ i18n: { defaultLocale: 'fr', locales: { fr: 'fr', en: 'en' } }, filter: (page) => !isNoindexPath(new URL(page).pathname) })`.
  Output: `/sitemap-index.xml` + `/sitemap-0.xml` (URL fixed by `CONTENU.md` §5).
- **Rationale**: official, maintained with Astro, deps `sitemap` + `zod` (build time only,
  0 kB shipped). Read in its 3.7.4 source: it already drops `404` / `500` pages, including
  `en/404` when `i18n.locales` is given; its i18n links group URLs that exist with the same
  bare path and are omitted when a page has no counterpart (FR-010, blog edge case).
- **Alternatives**: hand-written `sitemap.xml.ts` endpoint (no dependency, but grouping,
  `xhtml:link` and future chunking to write and test ourselves). Justification for
  principle I is in the plan.
- The `locales` literal repeats the i18n block once more in `astro.config.mjs`; same accepted
  exception as F03 (config and `ui.ts` commented as linked).

## R7 — 404 pages: two shells, one `NotFoundView`, never indexable, no canonical

- **Decision**: `src/views/NotFoundView.astro` + shells `src/pages/404.astro` and
  `src/pages/en/404.astro` (F03 page pattern). Build output `dist/404.html` and
  `dist/en/404.html`. `Seo` treats `/404` and `/en/404` as status pages: always `noindex`, and
  **no** canonical, `og:url` or `hreflang` (spec FR-003 amended accordingly).
- **Rationale**: a 404 is served at whatever URL was requested; a canonical pointing to
  `/404/` would be false, and Google treats a noindex page with a canonical as mixed signals.
  Links: home and projects via `localizePath`, email from `site.contact.email` (principle IV).
- **Hosting**: Cloudflare Pages serves the nearest `404.html` up the tree natively; Netlify
  needs `/en/* /en/404.html 404` in `public/_redirects`; Vercel needs a rewrite. The host is
  chosen at go-live, so this file is written then, not now (YAGNI). Locally, `astro preview`
  serves only the root 404: the English one is checked by opening `/en/404.html`.

## R8 — Open Graph tags

- **Decision**: `og:type=website`, `og:site_name`, `og:title` (the document title),
  `og:description`, `og:url`, `og:locale` (`fr_FR` / `en_US`), `og:locale:alternate` when an
  alternate exists, `og:image` (absolute) + `og:image:width=1200`, `og:image:height=630`,
  `og:image:alt`; `twitter:card=summary_large_image`. No other network-specific tags.
- Image: default `/og/default-fr.png` or `/og/default-en.png` by locale; a page may pass
  `image={{ src: '/og/x.png', alt: '…' }}`, assumed 1200 × 630 (only shape needed; no page
  uses it before F06). Default alt text comes from the dictionary (`seo.ogImageAlt`).
- **Rationale**: the set LinkedIn, Slack, messaging apps and X read (spec Assumptions). The
  image lives in `public/`, is never referenced by the page body, so the home weight is
  unchanged (SC-011).

## R9 — Default share image: two PNGs rendered once from an HTML source

- **Decision**: `scripts/og-image.html`, a single static page that uses the site font file
  and the `DESIGN.md` tokens, with one section per locale (`#fr`, `#en`) shown by CSS
  `:target`: no script (principle II), even though the file is never published. Rendered with the local
  Chrome in headless mode at 1200 × 630 into `public/og/default-fr.png` and
  `default-en.png` (command in [quickstart.md](./quickstart.md) §6). Composition per
  `DESIGN.md` « Image de partage par défaut » ; the Impeccable skill shapes it.
- **Rationale**: real font, real tokens, exact layout, zero dependency in `package.json`.
  The pitch will move to `campaign.ts` in F05; when it changes, the image is re-rendered with
  the same command. Target < 100 kB per PNG.
- **Alternatives**: build-time generation with `satori` + `resvg` (two dependencies and a
  font pipeline for an image that changes a few times a year); SVG `og:image` (not supported
  by LinkedIn and most previewers).

## R10 — Favicon: `!` glyph extracted from Archivo, theme-aware SVG + 32 px ICO

- **Decision**: extract the `exclam` glyph from Archivo at `wght=800`, `wdth=72` as an SVG
  path (fontTools `varLib.instancer` + `SVGPathPen`, run once in a throw-away Python venv
  with `brotli` to read the woff2; not a project dependency). `public/favicon.svg`: square,
  no radius, `paper` background, `mark` glyph; an inner `<style>` with
  `@media (prefers-color-scheme: dark)` switches to `paper-dark` / `mark-dark` (FR-016).
  `public/favicon.ico`: 32 × 32 rendering of the light version (Pillow). Both replace the
  Astro default files. `BaseLayout` links: `<link rel="icon" href="/favicon.ico"
sizes="32x32">` then `<link rel="icon" href="/favicon.svg" type="image/svg+xml">`.
- **Rationale**: `DESIGN.md` asks for the vectorised glyph with no font loaded. The ICO
  answers browsers and tools that request `/favicon.ico` at the root (spec edge case).
- **Alternatives**: hand-drawn path (fallback if extraction fails: the glyph is a tapered bar
  and a square dot); `apple-touch-icon`, web manifest (not asked; no PWA, `ROADMAP.md`).

## R11 — Person structured data on the home page

- **Decision**: `src/components/PersonSchema.astro` renders
  `<script type="application/ld+json" set:html={json} />` with `@type: Person`, `name`,
  `url` (home of the locale), `jobTitle` (per locale), `affiliation` (`CollegeOrUniversity`,
  IMT Mines Alès), `worksFor` (`Organization`, Astrée Software), `sameAs` (GitHub, LinkedIn).
  No phone, no email. Data comes from `site.ts`, extended with a `person` object (R12).
  `HomeView` puts it in a new named slot `head` of `BaseLayout`. `<` is escaped as `<`
  in the JSON so no value can close the script.
- **Rationale**: `affiliation` fits a current student better than `alumniOf`; both are read
  by validators. JSON-LD is data, not executed script: principle II is not affected (no
  client JS, 0 kB executed).
- **Alternatives**: JSON-LD in the body (valid, but `<head>` keeps the view's markup clean);
  `schema-dts` types (dependency for one object).

## R12 — Dictionary and data additions

- **Dictionary** (`src/i18n/ui.ts`, both locales): `notFound.title`, `notFound.description`,
  `notFound.lead`, `notFound.home`, `notFound.projects`, `notFound.email`, `seo.ogImageAlt`.
  Copy follows `CONTENU.md` §9 and is approved by the maintainer at implementation.
- **Data** (`src/data/site.ts`): `person: { jobTitle: Record<Locale, string>; school: string;
employer: string }`. Proposed `jobTitle`: « Élève ingénieur en alternance » /
  "Software engineering apprentice" (to approve). Names of school and employer appear once
  here; the provisional pitch in `HomeView` still spells them until F05 moves it to
  `campaign.ts` (accepted, as in F03).

## R13 — robots.txt as a static endpoint

- **Decision**: `src/pages/robots.txt.ts` exports `GET` returning `text/plain`. Switch on:
  `User-agent: *` / `Disallow: /`. Switch off: `User-agent: *` / `Allow: /` + blank line +
  `Sitemap: <site>/sitemap-index.xml` (FR-008).
- **Known trade-off**: with `Disallow: /`, crawlers do not fetch pages, so they never read the
  `noindex` meta; a URL linked from elsewhere could appear as a bare result. Accepted because
  the site has never been indexed and nothing links to it before C3; the spec asks for both.
- **Alternatives**: static `public/robots.txt` (cannot follow the env switch); integration
  package (`astro-robots-txt`, a dependency for 4 lines).

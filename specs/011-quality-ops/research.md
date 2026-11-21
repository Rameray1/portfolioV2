# Research: Qualité et exploitation

Phase 0 of [plan.md](./plan.md). Facts checked on production (`ramazankus.dev`) on
2026-11-21 are marked « observed ».

## R1 — Link checker: lychee, after the build, in the existing CI job

- **Decision**: one step `lycheeverse/lychee-action@v2` after `npm run build` in the
  `check-and-build` job of `.github/workflows/ci.yml`, with `fail: true`. Inputs:
  `dist/**/*.html` and `dist/sitemap-*.xml`. Settings live in `lychee.toml` at the repo root
  (contract: [contracts/operations.md](./contracts/operations.md) §1): `root_dir = "dist"`
  for root-relative links, `include_fragments = true` for anchors, `max_retries = 3` with a
  wait between tries, `exclude` with one comment per entry.
- **Rationale**: a single static binary through an official action, nothing added to
  `package.json` (principle I). It reads the built HTML, so it sees every page, anchor, image
  and file the site really publishes, in both languages, including F12 pages later. Running
  in the same job reuses the built `dist/` without an artifact upload. The action uses the
  job's `GITHUB_TOKEN`, which avoids GitHub rate limits on `github.com` links.
- **Alternatives**: `linkinator` or `broken-link-checker` (npm dependency, slower, no
  fragments); an Astro integration that walks the pages (code to maintain for a solved
  problem); a separate job (a second build, or an artifact round trip).

## R2 — Absolute links to the site itself are checked against `dist/`

- **Decision**: `remap` in `lychee.toml` maps `https://ramazankus.dev/<path>` to the matching
  file in `dist/` (`index_files = ["index.html"]` for directories). No own-domain URL is
  excluded.
- **Rationale**: canonicals, language alternates, `og:image` and the sitemap use absolute
  URLs (F04). JSON-LD URLs sit inside a `<script>`, which lychee may not read; they are built
  from `Astro.site` and the same paths as the canonicals, so checking the canonicals covers
  them. Observed with lychee 0.24.2 (`--dump`): it reads `href` and `src` (canonicals,
  alternates, links, images, sitemap) but not `<meta content>` nor JSON-LD, so `og:url`,
  `og:image` and JSON-LD URLs are not checked; they come from `Astro.site` plus paths that
  the checked links already cover, and the `og:image` files were checked at go-live
  (LinkedIn Post Inspector). Checked against production, a page added in a PR would fail before it
  is deployed; excluded, a wrong alternate would slip through (spec, edge cases; FR-005 « no
  internal link is excluded »).
- **Alternatives**: excluding `^https://ramazankus\.dev` (blind spot on F04 output); checking
  against a preview deployment (waits on Vercel, couples CI to the host).

## R3 — Exclusions and failure rules

- **Decision**: excluded with a reason: `linkedin.com` (answers 999 to robots), `mailto:`
  (lychee default, spec edge case). Accepted status codes: 2xx and `429` (rate limited means
  the page exists). Redirects are followed (lychee default) and the final page is judged.
  Any other entry needs a comment and a reason in `lychee.toml`.
- **Rationale**: FR-004/FR-005; SC-002 (no failure on transient errors over 10 runs). The
  list starts with what the site links to today (`src/data/site.ts`, project files) and
  grows only on a real false positive.
- **Alternatives**: a lychee cache between runs (YAGNI for a few dozen links); a scheduled
  run (rejected in clarification, 2026-11-21).

## R4 — Redirects stay in `astro.config.mjs`

- **Decision**: keep the `redirects` block of `astro.config.mjs` as the only place. Static
  output writes one HTML page per old address with an instant `meta refresh`, a canonical to
  the target, `noindex` and a link to the target (observed on `/projects/sample-project`,
  HTTP 200). Each language has its own entry.
- **Rationale**: constitution IX names `astro.config.mjs` as the place for redirects; the
  link checker reads the redirect page and its target link, so a redirect to a missing page
  fails CI with no extra code (FR-009). Google treats an instant meta refresh as a permanent
  redirect, and the canonical plus `noindex` make the intent explicit (FR-008, as reworded).
- **Alternatives**: `vercel.json` redirects (true 308, but a second place against
  constitution IX, and invisible to the checker of `dist/`); `@astrojs/vercel` in static
  mode, which turns Astro redirects into host redirects (an adapter and a dependency, and
  its Build Output config would bypass the current `vercel.json` routes, including the
  English 404). Revisit only if a real need for HTTP 301/308 appears (reserve).

## R5 — Security headers in `vercel.json` routes

- **Decision**: one first entry in the existing `routes` of `vercel.json`:
  `{ "src": "/(.*)", "headers": { … }, "continue": true }` with
  `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`,
  `Content-Security-Policy: frame-ancestors 'none'`.
- **Rationale**: the host is Vercel; `public/_headers` is a Netlify / Cloudflare format that
  Vercel ignores. Vercel refuses `headers` next to `routes` in one file, and `routes`
  already serves the English 404 (F04), so the headers go into `routes` with `continue`.
  `strict-origin-when-cross-origin` sends only the origin to other sites (FR-015).
  `frame-ancestors 'none'`: the site never frames itself. HSTS is already sent by Vercel
  (observed).
- **Alternatives**: migrating `routes` to `headers` + `rewrites` (rewrites cannot set the 404
  status the English 404 needs); `X-Frame-Options` (superseded by `frame-ancestors` in every
  supported browser); a full CSP with hashes (excluded by `ROADMAP.md`).

## R6 — Audience and performance: Vercel Web Analytics and Speed Insights, production only

- **Decision**: Vercel Web Analytics, enabled once in the Vercel project. One
  `<script defer src="/_vercel/insights/script.js"></script>` in `BaseLayout`, rendered only
  when the build runs with `VERCEL_ENV=production`, declared in the `env.schema` of
  `astro.config.mjs` (`context: 'server'`, `access: 'public'`, optional enum).
- **Rationale**: the host is already Vercel, so no extra account, no third-party domain and
  no cookie: the service identifies a visit by a hash of the request, renewed daily, and
  stores nothing in the browser (Vercel docs). The script is served from the site's own
  origin and is small (about 1 kB compressed), deferred, with no layout effect (FR-013,
  SC-005). It reports pages, referrers and countries; the page language reads from the path
  (`/en/…`) (FR-011). Rendering it only for production builds keeps previews and `astro dev`
  out of the counts and avoids a 404 script in local Lighthouse runs (FR-012). Principle II:
  with Speed Insights below, the only scripts of the site, progressive enhancement, with
  nothing depending on them.
- **Alternatives**: Plausible (paid); Umami Cloud (third-party domain and account);
  Cloudflare Web Analytics (third-party beacon, site not on Cloudflare); `@vercel/analytics`
  npm package (a dependency for the same one-line script); server logs (Vercel Hobby keeps
  none usable).
- **Speed Insights** (maintainer request, 2026-11-21): a second tag,
  `<script defer src="/_vercel/speed-insights/script.js"></script>`, under the same
  production condition. It reports the Core Web Vitals of real visits (LCP, INP, CLS, FCP,
  TTFB) per page, also without cookie. It complements the one-off Lighthouse audit (R7):
  Lighthouse measures one simulated phone once; Speed Insights shows over time whether real
  readers get the same result.
- **Bots**: the measurement relies on the host's bot filtering; if T017 shows there is none,
  the bias is accepted and noted in `audit.md` (spec edge cases).
- **To verify when enabling** (quickstart §3): bot filtering, and the free Hobby quotas of
  both products in the Vercel dashboard.

## R9 — Script tags, not the `@vercel/*` packages

- **Decision**: no `@vercel/analytics` nor `@vercel/speed-insights`. `BaseLayout` writes the
  two `<script defer src>` tags that those packages inject.
- **Rationale**: the Astro components of the packages only add the same scripts, plus an
  inline bootstrap and a bundled client module; the tags give the same data with no
  dependency, no inline code and nothing bundled by Astro (principles I and II). The paths
  are served by Vercel on the site's origin once each product is enabled in the project.
  Vercel documents this plain HTML setup for sites without a supported framework package.
- **Alternatives**: the two packages, as the dashboard suggests (two dependencies to update
  for two lines of HTML; their Astro component ships a client bundle).

## R7 — The audit: manual, once, recorded in `audit.md`

- **Decision**: Lighthouse (Chrome DevTools, mobile preset) on production for performance,
  accessibility and best practices, on `/`, one project page and `/en/`. SEO on a local
  `astro preview` of a build with `PUBLIC_NOINDEX=false`, because production is `noindex`
  until C5 and the SEO score fails by design. axe DevTools and a keyboard pass on every page
  type, FR and EN, light and dark. Results, gaps and fixes go to
  `specs/011-quality-ops/audit.md`.
- **Rationale**: spec Assumptions (a single audit, no Lighthouse CI per `ROADMAP.md`). The
  SEO audits read the HTML only, so a local build is equivalent; performance needs the
  host's compression and cache, so it runs on production.
- **Alternatives**: Lighthouse CI (excluded by `ROADMAP.md`); a preview deployment with
  `PUBLIC_NOINDEX=false` (a Vercel setting to change and restore, for the same result).

## R8 — Fixes go where the defect lives

- **Decision**: each gap is fixed in the component, view or token that carries it, as its
  own commit (`a11y:` or `perf:`), with a line in `audit.md`. UI fixes follow `DESIGN.md`
  and the tokens, load the `impeccable` skill, and are checked at 375 px and 1280 px in both
  themes.
- **Rationale**: FR-020; a shared component fix covers every page (spec US2-6).

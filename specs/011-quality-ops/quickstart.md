# Quickstart: Qualité et exploitation

Validation scenarios. Contract: [contracts/operations.md](./contracts/operations.md).

## Prerequisites

- `npm ci`, `sh scripts/install-tectonic.sh`, `npm run build`.
- lychee installed locally (`brew install lychee`) to run the CI check by hand.
- Chrome with Lighthouse (DevTools) and the axe DevTools extension.
- Access to the Vercel project (Web Analytics, preview deployments).

## 1. Links (US1, US4)

```sh
npm run build && lychee --config lychee.toml 'dist/**/*.html' 'dist/sitemap-*.xml'
```

Expected: 0 error. Then, one at a time, and revert after each:

1. Add a link to `/projects/nope/` in a project file → fails, names the page and the link.
2. Add `#nope` to an internal link → fails on the fragment.
3. Add `https://does-not-exist.invalid/` → fails after the retries.
4. Point the sample redirect at `/projects/nope/` → fails on the redirect page.
5. Push the branch: the same check runs in CI and the PR shows it.

## 2. Headers (US5)

On the preview deployment of the branch, then on production after merge:

```sh
for p in / /projects/portfolio/ /cv-fr.pdf /nope /en/nope /projects/sample-project; do
  echo "== $p"; curl -sI "https://<host>$p" | grep -iE '^(HTTP|x-content-type|referrer-policy|content-security)'
done
```

Expected: the three headers on every line; `/nope` and `/en/nope` keep status 404. Browse the
site: fonts, images, transitions, CV and analytics still work. A test page on another origin
with `<iframe src="https://ramazankus.dev/">` stays empty.

## 3. Audience (US3)

1. Enable Web Analytics and Speed Insights in the Vercel project; check both free quotas and
   bot filtering.
2. Production build: the page source has the `/_vercel/insights/script.js` and
   `/_vercel/speed-insights/script.js` tags, both answering 200. Local build and preview
   deployment: no tag.
3. Private window on production, visit three pages: DevTools › Application shows no cookie
   and no storage for the site; no banner. The three pages appear in Web Analytics; their
   vitals appear in Speed Insights once enough visits are collected.
4. Block both scripts (DevTools › Network › Block request URL): the site works the same.

## 4. Audit (US2)

1. Lighthouse, mobile, on production: `/`, `/projects/portfolio/`, `/en/`. Expected ≥ 95 /
   100 / 100, SEO aside.
2. SEO: `PUBLIC_NOINDEX=false npm run build && npx astro preview`, Lighthouse SEO on the same
   three pages. Expected 100.
3. On every page type (home, about, projects, project, background, skills, CV, 404), FR and
   EN, light and dark: axe DevTools 0 issue; keyboard only (skip link, order, visible focus,
   no trap); headings: one `h1`, no skipped level; every image has a fitting `alt` or
   `alt=""`.
4. Home transferred weight < 200 kB (DevTools › Network, cache disabled), analytics
   included.
5. Record everything in `audit.md`; fix, recheck, close each row. UI fixes: captures at
   375 px (iframe) and 1280 px, both themes, header and footer.

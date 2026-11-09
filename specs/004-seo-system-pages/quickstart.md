# Quickstart: validate SEO et pages système

Prerequisites: `npm ci`; Node per `.nvmrc`; Google Chrome installed (§6).

## 1. Check and build

```sh
npm run check && npm run build
```

Expected: both pass. `dist/` contains `robots.txt`, `sitemap-index.xml`, `sitemap-0.xml`,
`404.html`, `en/404/index.html`, `og/default-fr.png`, `og/default-en.png`, `favicon.svg`,
`favicon.ico`.

Failure cases (revert after each):

- remove `description` from one page → `npm run check` fails (FR-002);
- `PUBLIC_NOINDEX=maybe npm run build` → build fails on env validation.

## 2. Presentation tags (switch off)

```sh
grep -o '<link rel="\(canonical\|alternate\)"[^>]*>\|<meta \(property\|name\)="\(og:\|twitter:\|robots\)[^>]*>' dist/index.html
grep -o '<link rel="\(canonical\|alternate\)"[^>]*>' dist/en/index.html
```

Expected: matches [contracts/seo.md](./contracts/seo.md) — canonical `/` and `/en/`,
`hreflang` fr / en / x-default on both, absolute `og:image` per locale, no `robots` tag
(SC-001, SC-002).

On `dist/404.html` and `dist/en/404/index.html`: `robots` `noindex`, no canonical, no `hreflang`
(FR-015, R7). Header switcher on each 404 points to the other home.

## 3. Global switch

```sh
PUBLIC_NOINDEX=true npm run build
grep -L 'name="robots" content="noindex, nofollow"' $(find dist -name '*.html')   # expect no output
cat dist/robots.txt                                                               # Disallow: /
npm run build && cat dist/robots.txt                                              # Allow: / + Sitemap:
```

Expected: SC-004.

## 4. Sitemap

```sh
cat dist/sitemap-0.xml
```

Expected: exactly the indexable pages (today `/` and `/en/`), each with `xhtml:link` to both
locales; no `404` (SC-003). Add a temporary path to `noindexPaths` matching a real page → it
disappears from the sitemap and gets `robots noindex`; revert.

## 5. Structured data

Paste the generated `dist/index.html` and `dist/en/index.html` into the Schema.org validator
(validator.schema.org, "code snippet"). Expected: one `Person`, 0 error, 0 warning on
required fields (SC-006). `grep -c 'telephone' dist/index.html` → `0`.

## 6. Share image and favicon

Regenerate the share images (only when the pitch or design changes):

```sh
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
for l in fr en; do
  "$CHROME" --headless --hide-scrollbars --window-size=1200,630 \
    --screenshot="public/og/default-$l.png" "file://$PWD/scripts/og-image.html#$l"
done
```

Expected: two 1200 × 630 PNGs, each < 100 kB, matching `DESIGN.md` (at most one red element,
no radius, no shadow); text readable at 400 px wide (spec edge case).

Favicon: open `dist/favicon.svg` in the browser with the system in light, then dark mode;
the `!!` is deep blue on paper, then sky blue on dark paper. `astro preview` and load `/favicon.ico` → icon,
not a 404.

## 7. 404 in both languages

```sh
astro preview --background   # or npm run preview
```

- `/does-not-exist` → French 404 with links `/`, `/projects/`, `mailto:` (US4 #1).
- `/en/404/` → English 404 with `/en/`, `/en/projects/`, `mailto:` (US4 #2; `astro
preview` serves only the root 404, research R7).
- Keyboard: Tab reaches each link with the site focus ring; VoiceOver reads the `<h1>`
  first. axe on both 404 pages, light and dark theme: 0 error (SC-010). 0 `<script>` other
  than JSON-LD in `dist/` (`grep -rl '<script' dist --include='*.html'` lists only the two homes).

## 8. Audits

Lighthouse mobile on `/` and `/en/` (preview, switch off): SEO 100, accessibility 100,
performance ≥ 95; home transferred < 200 kB (SC-008, SC-011).

## 9. After go-live (not blocking this feature)

With the real domain in `site`: LinkedIn Post Inspector and an Open Graph previewer on `/` and
`/en/` → large card, right language (SC-007). Real 404 status on `/en/x` per the host
(research R7).

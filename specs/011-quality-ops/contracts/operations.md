# Contract: Qualité et exploitation

What the repo exposes to CI, the host and the browser. Values are the decisions of
[research.md](../research.md); tasks may adjust syntax to the tool versions, not the intent.

## 1. Link check (`lychee.toml`, `ci.yml`)

**CI step**, in `check-and-build`, after `npm run build`:

```yaml
- uses: lycheeverse/lychee-action@v2
  with:
    args: --config lychee.toml 'dist/**/*.html' 'dist/sitemap-*.xml'
    fail: true
```

**`lychee.toml`** keys and meaning:

| Key                 | Value                                                 | Why                                              |
| ------------------- | ----------------------------------------------------- | ------------------------------------------------ |
| `root_dir`          | `dist`                                                | resolve `/projects/…` links in the build (R1)    |
| `index_files`       | `["index.html"]`                                      | a directory link resolves to its page (R2)       |
| `remap`             | `https://ramazankus\.dev/(.*)` → `dist/$1` (file URL) | own absolute URLs checked locally (R2)           |
| `include_fragments` | `true`                                                | `#anchor` must exist on the target page (FR-003) |
| `max_retries`       | `3`, with a retry wait                                | transient errors (FR-004)                        |
| `accept`            | `200..=299`, `429`                                    | rate limited ≠ dead (R3)                         |
| `exclude`           | `linkedin\.com`, each with a comment                  | robots refused (R3)                              |

**Output**: on failure, the job log lists each dead link with its source file; the step
summary repeats it. Exit code ≠ 0 fails the PR check.

## 2. Redirects (`astro.config.mjs`)

```js
redirects: {
  '/old-path': '/new-path/',
  '/en/old-path': '/en/new-path/',
}
```

Each old address serves an HTML page with `meta refresh` 0, `link rel="canonical"` to the
target, `meta robots noindex` and an `<a href>` to the target (Astro static output). The link
check follows that `<a>`: a missing target fails CI.

## 3. Response headers (`vercel.json`)

First entry of `routes`, before `{ "handle": "filesystem" }`:

```json
{
  "src": "/(.*)",
  "headers": {
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Content-Security-Policy": "frame-ancestors 'none'"
  },
  "continue": true
}
```

Must hold for pages, assets, `cv-fr.pdf`, both 404s and redirect pages. The English 404 route
keeps its status 404.

## 4. Measurement scripts (`BaseLayout.astro`)

- `env.schema` gains `VERCEL_ENV: envField.enum({ context: 'server', access: 'public',
values: ['production', 'preview', 'development'], optional: true })`.
- `BaseLayout` renders, in `<head>`, only when `VERCEL_ENV === 'production'`:

  ```html
  <script defer src="/_vercel/insights/script.js"></script>
  <script defer src="/_vercel/speed-insights/script.js"></script>
  ```

- No other script, no inline code, no `client:*`, no `@vercel/*` package (R9). Pages are
  identical without them.
- Host side: Web Analytics and Speed Insights enabled in the Vercel project, otherwise both
  paths answer 404.

## 5. Audit record (`specs/011-quality-ops/audit.md`)

- Scores table: page × (performance, accessibility, best practices, SEO), mobile, before and
  after fixes, with the date and the Lighthouse version.
- Gaps table: page, theme, language, tool (Lighthouse / axe / keyboard / manual), finding,
  fix (file), commit. Closed when the fix is merged and rechecked.

## Gates

- `npm run check && npm run build` pass; the lychee step passes on the branch.
- Production responses carry the three headers (quickstart §2).
- Scores and accessibility grid meet SC-003 and SC-004 (quickstart §4).

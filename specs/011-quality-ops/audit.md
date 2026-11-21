# Audit: Qualité et exploitation

Single audit of F11 (spec US2), run on 2026-11-21 with Lighthouse 12.8.2 (CLI, mobile preset,
headless Chrome), the axe rules inside Lighthouse, and a scripted keyboard pass
(puppeteer-core, 375 px). Grid: [quickstart.md §4](./quickstart.md).

The branch preview is behind Vercel deployment protection, so the scores below were taken on
production (`ramazankus.dev`, identical pages, F11 adds no page change) for performance,
accessibility and best practices, and on a local `astro preview` of a build with
`PUBLIC_NOINDEX=false` for SEO (research R7).

## Scores (mobile)

| Page                   | Performance | Accessibility | Best practices | SEO (local, indexable) | SEO (production, `noindex`) | Transferred | LCP    | CLS |
| ---------------------- | ----------- | ------------- | -------------- | ---------------------- | --------------------------- | ----------- | ------ | --- |
| `/`                    | 100         | 100           | 100            | 100                    | 69 (expected until C5)      | 102 kB      | 1.61 s | 0   |
| `/projects/portfolio/` | 100         | 100           | 100            | 100                    | 69 (expected until C5)      | 160 kB      | 1.62 s | 0   |
| `/en/`                 | 100         | 100           | 100            | 100                    | 69 (expected until C5)      | 102 kB      | 1.44 s | 0   |

Production without the two Vercel scripts yet: they are rendered only by production builds,
so their weight and effect are measured after merge (tasks T033).

## Accessibility grid

Every page type, FR and EN, light and dark (36 combinations): home, about, projects, project
(`portfolio`, `shipment-preparation`), background, skills, CV page, 404.

| Check                                                           | Result                                                                |
| --------------------------------------------------------------- | --------------------------------------------------------------------- |
| Lighthouse accessibility (axe rules), each combination          | 100 everywhere, 0 failing audit                                       |
| First Tab reaches the skip link to `#content`                   | yes, everywhere                                                       |
| Every focusable element shows an outline on focus               | yes (global `:focus-visible`, `--color-mark`), 6 to 37 stops per page |
| Focus never trapped (Tab walks the page and leaves it)          | yes                                                                   |
| Exactly one `h1`, no skipped heading level                      | yes, everywhere                                                       |
| Every `img` has an `alt`                                        | yes, everywhere                                                       |
| Token contrasts, text ≥ 4.5:1 (muted text, links, buttons)      | 5.5 to 17.4 in light, 6.0 to 15.9 in dark                             |
| Token contrasts, symbols and focus ring ≥ 3:1 on paper / invert | 4.2 to 9.8 in both themes                                             |

## Links

lychee 0.24.2 on the built site: 855 links, 120 unique, 0 error (CI run of the first F11
push, same result locally). No dead link found, so nothing was fixed. Not checked by
lychee: `<meta content>` URLs (`og:url`, `og:image`) and JSON-LD (research R2).

## Gaps

No gap against the spec grid: nothing to fix (T027 adds no task).

## Observations (not gaps, maintainer's call)

| Where                                | Finding                                                                                                                         | Why it is not a gap                                                                                                   |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Home diagram, dark theme, move hover | Red square liserés (`--color-mark-on-board` `#c8102e`) on a dark square (`#b3afa5`): 2.69:1, under the 3:1 of non-text contrast | Decorative: the active row is already marked in the list, the diagram alt describes the position, the marks repeat it |
| Home diagram, dark theme, `!!` stamp | `--color-brilliant-on-board` `#0077b6` on the stamp chip (`#e6e3dc`): 3.8:1                                                     | Stamp is `aria-hidden`, its meaning is in the list, where the symbol is 9.7:1                                         |

## Vercel (T017)

Both products were enabled in the Vercel project before F11. Checked on production on
2026-11-21, before the scripts are rendered:

| Script                              | Status | Transferred (Brotli) | Raw     | Cache             | Cookie |
| ----------------------------------- | ------ | -------------------- | ------- | ----------------- | ------ |
| `/_vercel/insights/script.js`       | 200    | 2.1 kB               | 4.5 kB  | `max-age=2678400` | none   |
| `/_vercel/speed-insights/script.js` | 200    | 7.6 kB               | 20.3 kB | `max-age=2678400` | none   |

Expected home weight with both scripts: about 112 kB, under the 200 kB budget (confirmed
after merge, T033). Still to note from the dashboard: free Hobby quotas, bot filtering, and
« Automatically expose System Environment Variables » (needed for `VERCEL_ENV`).

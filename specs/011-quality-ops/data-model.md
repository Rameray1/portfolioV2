# Data Model: Qualité et exploitation

No content collection changes. The feature adds configuration, each in one place.

| Entity          | Where                                    | Fields                                                           | Rules                                                                                                       |
| --------------- | ---------------------------------------- | ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Link            | built pages in `dist/`                   | source page, URL, kind (internal page / anchor / file, external) | Internal: must resolve in `dist/`, anchor included. External: final response 2xx or 429 after retries (R3). |
| Exclusion       | `lychee.toml` (`exclude`)                | pattern, reason (comment on the line above)                      | External only; no own-domain or relative pattern (FR-005, R2).                                              |
| Redirect        | `astro.config.mjs` (`redirects`)         | old path, target path                                            | One entry per language; target is an existing page of the same language; no chain (FR-007 to FR-009, R4).   |
| Security header | `vercel.json` (first `routes` entry)     | name, value                                                      | Applies to every response, `continue: true` (FR-015, FR-016, R5).                                           |
| Visit           | Vercel Web Analytics (outside the repo)  | page path, referrer, country, day                                | No visitor identifier stored on the device; production builds only (FR-010 to FR-012, R6).                  |
| Vitals sample   | Vercel Speed Insights (outside the repo) | page path, LCP, INP, CLS, FCP, TTFB, device type                 | Real visits only, no cookie; production builds only (FR-011, FR-012, R6).                                   |
| Build target    | `astro.config.mjs` (`env.schema`)        | `VERCEL_ENV`: `production` / `preview` / `development`, optional | Set by Vercel; absent locally and in CI, so the analytics script is not rendered there (R6).                |
| Audit record    | `specs/011-quality-ops/audit.md`         | page, theme, tool, score or gap, fix, commit                     | One row per gap; the feature is done when no gap is open (FR-020, SC-004).                                  |

## Existing data kept

- Redirect `/projects/sample-project` → `/projects/portfolio/` and its English twin (F06).
- `PUBLIC_NOINDEX` (F04): unchanged, still `true` in production until C5.

# Contract: CI workflow

File: `.github/workflows/ci.yml` · Workflow name: `CI` · Job name: `check-and-build`.

## Triggers (FR-009)

| Event | Scope |
|---|---|
| `push` | every branch |
| `pull_request` | targeting `main` |

`concurrency: ci-${{ github.ref }}` with `cancel-in-progress: true`.

## Steps (in order, any failure stops the job)

1. Checkout the repository.
2. Set up Node from `.nvmrc`, with npm cache.
3. `npm ci`
4. `npm run check`
5. `npm run build`

## Status (FR-010)

- All steps succeed → check `CI / check-and-build` is green on the commit and the PR.
- Any step fails → the check is red; the log shows the failing step and the file(s) at fault.

## Permissions

`permissions: contents: read` (least privilege; the job only reads the code).

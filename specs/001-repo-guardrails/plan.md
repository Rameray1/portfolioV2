# Implementation Plan: Outillage et garde-fous du dépôt

**Branch**: `001-repo-guardrails` | **Date**: 2026-11-07 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-repo-guardrails/spec.md`

## Summary

Add the repository's guardrails before any component exists: Prettier (with the Astro plugin)
for formatting, `astro check` on the existing strict `tsconfig` for types, two npm scripts
(`format`, `check`) next to the unchanged `build`, shared editor settings and a Node version
file, a GitHub Actions workflow that runs `npm ci → check → build` on every push and PR, and a
README updated with install, commands and the speckit workflow. No ESLint, no pre-commit hook.

## Technical Context

**Language/Version**: TypeScript 6 (strict, via `astro/tsconfigs/strict`), Node 22 (`.nvmrc`)

**Primary Dependencies**: Astro 7.4 (existing). New dev dependencies: `prettier@^3.9`,
`prettier-plugin-astro@^1.1`, `@astrojs/check@^0.9`, `typescript@^6` (see research R1–R2).

**Storage**: N/A

**Testing**: no test framework; the feature _is_ the verification. Validation by the scenarios of
[quickstart.md](./quickstart.md) (injected format / type / build errors).

**Target Platform**: developer machine (macOS) and GitHub Actions `ubuntu-latest`

**Project Type**: static website (Astro), repository tooling only

**Performance Goals**: `npm run check` < 30 s locally (SC-003); CI status < 5 min (SC-004)

**Constraints**: zero runtime impact (dev dependencies only, nothing shipped to `dist/`);
`npm run build` unchanged (FR-007); `typescript` must stay `<7` while `@astrojs/check` requires
`^5 || ^6` (R2)

**Scale/Scope**: one page today (`src/pages/index.astro`), ~10 config/doc files touched

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| #    | Principle                    | Status  | Notes                                                                                                                                                                                                                                      |
| ---- | ---------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| I    | Simplicité (KISS/YAGNI)      | ✅ Pass | 4 dev dependencies, each justified below; ESLint, husky/lint-staged, branch-protection automation rejected (R3, R7, R8).                                                                                                                   |
| II   | Statique, zéro JS client     | ✅ Pass | Dev tooling only; no `<script>`, no adapter, `dist/` unchanged.                                                                                                                                                                            |
| III  | Contenu = donnée typée       | N/A     | No content in this feature. Strict types prepare the schemas of F03+.                                                                                                                                                                      |
| IV   | Une source par information   | ✅ Pass | Node version lives in `.nvmrc` only (CI reads it); `engines` is a floor, not a second source (R5). Formatting rules in `.prettierrc` only.                                                                                                 |
| V    | Leviers de campagne          | N/A     | —                                                                                                                                                                                                                                          |
| VI   | Bilingue par dictionnaire    | N/A     | No UI text. README in English (visitors); CONTRIBUTING.md stays French (project prose).                                                                                                                                                    |
| VII  | Accessibilité et performance | N/A     | No page change.                                                                                                                                                                                                                            |
| VIII | Styles par jetons            | N/A     | No style. Not a visual feature: no Impeccable audit/polish phase needed.                                                                                                                                                                   |
| IX   | Conventions et qualité       | ✅ Pass | This feature _creates_ `npm run check` and the CI required by IX. Config files and scripts named in English. Commits: `chore` (tooling), `ci` (workflow), `docs` (README); the initial reformat is `chore: format codebase with prettier`. |

**Dependency justification (principle I)**

| Package                 | Need                              | Weight   | Native alternative rejected          |
| ----------------------- | --------------------------------- | -------- | ------------------------------------ |
| `prettier`              | FR-001/002 formatting             | dev only | No native formatter in Astro/Node    |
| `prettier-plugin-astro` | Format `.astro` files             | dev only | Prettier alone cannot parse `.astro` |
| `@astrojs/check`        | FR-002/003 type check of `.astro` | dev only | `tsc` does not read `.astro` files   |
| `typescript`            | Peer of `@astrojs/check`          | dev only | Required by the checker              |

**Post-design re-check**: ✅ unchanged after Phase 1 — no new dependency or abstraction
introduced by the contracts.

## Project Structure

### Documentation (this feature)

```text
specs/001-repo-guardrails/
├── plan.md              # This file
├── research.md          # Phase 0
├── data-model.md        # Phase 1 (config files and their roles)
├── quickstart.md        # Phase 1 (validation scenarios)
├── contracts/
│   ├── commands.md      # npm command surface
│   └── ci.md            # CI workflow contract
├── checklists/
│   └── requirements.md
└── tasks.md             # Phase 2 (/speckit-tasks)
```

### Source Code (repository root)

```text
.editorconfig              # new — FR-012
.nvmrc                     # new — "22", FR-011
.prettierrc                # new — FR-001
.prettierignore            # new — FR-008
.github/workflows/ci.yml   # new — FR-009, FR-010
package.json               # scripts format + check, devDependencies
package-lock.json          # updated by npm install
tsconfig.json              # unchanged (already extends astro/tsconfigs/strict)
README.md                  # updated — FR-013
.vscode/extensions.json    # add esbenp.prettier-vscode recommendation
src/pages/index.astro      # possibly reformatted by the first `npm run format`
AGENTS.md                  # drop the "until F01" note once `npm run check` exists
```

**Structure Decision**: repository-root configuration only; no change to `src/` beyond the
initial reformat. The first `npm run format` over the existing files goes in its own commit
(`chore: format codebase with prettier`) so it does not hide real changes (spec edge case).

## Implementation notes for `/speckit-tasks`

1. Install dev dependencies (pin `typescript@^6`), add scripts:
   `"format": "prettier --write ."`, `"check": "prettier --check . && astro check"`.
2. Add `.nvmrc`, `.editorconfig`, `.prettierrc`, `.prettierignore` (contents in research R4–R6).
3. Run `npm run format`, review the diff on Markdown documents (tables, code blocks); exclude a
   file in `.prettierignore` only if it is garbled. Commit separately.
4. Make `npm run check && npm run build` pass locally.
5. Add `.github/workflows/ci.yml` per [contracts/ci.md](./contracts/ci.md).
6. Update README (sections: prérequis, installation, commandes, workflow speckit, protection de
   branche), `.vscode/extensions.json`, and the "until F01" mentions in `AGENTS.md`.
7. Validate with [quickstart.md](./quickstart.md), including the three red-PR scenarios.

## Complexity Tracking

No violation to justify.

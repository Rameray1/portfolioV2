# Research: Outillage et garde-fous du dépôt

Versions checked on the npm registry on 2026-11-07.

## R1 · Formatter

- **Decision**: Prettier 3 (`prettier@^3.9`) + `prettier-plugin-astro@^1.1`, both dev
  dependencies.
- **Rationale**: Prettier is the formatter Astro documents; the plugin is the only maintained way
  to format `.astro` files. Covers `.astro`, `.ts`, `.mjs`, `.json`, `.md`, `.css`, `.yml` in one
  tool. Plugin peer requirement: `prettier ^3.5.3`, Node `>=22.12` (OK with Node 22).
- **Alternatives considered**: Biome (fast, but `.astro` support is partial and it would be a
  second convention to learn); dprint (no first-class Astro plugin). Rejected.

## R2 · Type checking

- **Decision**: `@astrojs/check@^0.9` + `typescript@^6` (dev dependencies); `tsconfig.json` keeps
  `"extends": "astro/tsconfigs/strict"`.
- **Rationale**: `astro check` type-checks `.astro` and `.ts` files (and `// @ts-check` JS files,
  e.g. `astro.config.mjs`) with the Astro language server. `tsconfig.json` **already** extends the
  strict preset: no change needed there. `@astrojs/check@0.9.12` declares the peer
  `typescript ^5.0.0 || ^6.0.0`; the latest TypeScript is 7.0.2, so TypeScript MUST be pinned to
  `^6` or `npm ci` fails on the peer conflict.
- **Alternatives considered**: `tsc --noEmit` alone (does not understand `.astro` files);
  `astro/tsconfigs/strictest` (adds friction such as `exactOptionalPropertyTypes` with no present
  need — YAGNI).

## R3 · No linter

- **Decision**: no ESLint.
- **Rationale**: strict TypeScript + `astro check` catch the errors that matter on a small static
  site; ESLint would add ~5 packages and a config to maintain (constitution I). Revisit only if a
  concrete class of bug slips through (goes to the ROADMAP reserve).

## R4 · Shared editor settings

- **Decision**: `.editorconfig` at the root: `utf-8`, `lf`, 2-space indent, final newline, trim
  trailing whitespace (except `*.md`, where two trailing spaces can be a line break).
- **Rationale**: native to most editors, zero dependency, aligns with Prettier defaults (Prettier
  reads `.editorconfig` for `indent_style`/`indent_size`/`end_of_line`).

## R5 · Node version, single source

- **Decision**: `.nvmrc` containing `22`; CI reads it with `actions/setup-node`'s
  `node-version-file: .nvmrc`. The `engines.node` field of `package.json` stays as a minimum
  floor, not as the version source.
- **Rationale**: one file used by nvm/fnm/Volta-compatible tools locally and by CI (FR-011).
  Major only (`22`) so that CI gets security patches without commits.
- **Note**: the local machine currently runs Node 24; that satisfies `engines` but differs from
  CI. The README tells contributors to run `nvm use`.

## R6 · Prettier configuration

- **Decision**: `.prettierrc` (JSON) with `plugins: ["prettier-plugin-astro"]`, `singleQuote: true`,
  and the `*.astro → parser: astro` override recommended by the plugin README. Everything else
  stays default (print width 80, semicolons, trailing commas `all`).
- **Rationale**: `singleQuote` matches the code Astro already generated (`astro.config.mjs`);
  the override makes the parser explicit regardless of package manager resolution.
- **`.prettierignore`**: `dist/`, `.astro/`, `node_modules/` (implicit), `package-lock.json`,
  `.specify/`, `.claude/`, `.impeccable/` (generated design prototypes and captures). Prettier
  also honours `.gitignore` by default in v3.
- **Markdown**: included (`proseWrap: preserve` default keeps the hand-wrapped French prose).
  If a planning document gets garbled, exclude that single file (spec assumption).

## R7 · CI

- **Decision**: GitHub Actions, `.github/workflows/ci.yml`, one job on `ubuntu-latest`:
  checkout → setup-node (`node-version-file: .nvmrc`, `cache: npm`) → `npm ci` →
  `npm run check` → `npm run build`. Triggers: `push` (to `main`) and `pull_request`
  (to `main`); a push on a feature branch is covered by its PR, so it does not run twice. `concurrency` cancels superseded runs on the same ref.
- **Rationale**: steps run in order and a failing step fails the job, so the PR status is red
  (FR-010). `npm ci` gives a clean install from the lockfile (FR-009). `cache: npm` keeps a run
  well under the 5-minute target (SC-004). Use the latest major tags of `actions/checkout` and
  `actions/setup-node` at implementation time.
- **Alternatives considered**: separate jobs for check and build (parallel but duplicates the
  install, slower overall on a tiny project); a pre-commit hook (husky/lint-staged — extra
  dependencies, spec assumption says CI is the safety net).

## R8 · Branch protection

- **Decision**: not automated. README documents how to mark the `CI` check as required on `main`
  in GitHub settings.
- **Rationale**: a one-time manual setting; automating it would need an API token (YAGNI).

---
description: "Task list for F01 · Outillage et garde-fous du dépôt"
---

# Tasks: Outillage et garde-fous du dépôt

**Input**: Design documents from `specs/001-repo-guardrails/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: no automated test suite (not requested; the feature *is* the verification). Each story
ends with a manual validation task taken from [quickstart.md](./quickstart.md).

**Organization**: tasks grouped by user story. Not a visual feature: no Impeccable audit/polish
phase (plan, Constitution Check VIII).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: can run in parallel (different files, no dependency on an incomplete task)
- **[Story]**: US1, US2, US3 from spec.md
- All paths are relative to the repository root.

---

## Phase 1: Setup

**Purpose**: shared repository settings, no dependency installed yet.

- [x] T001 [P] Create `.nvmrc` containing the single line `22` (single Node version source, FR-011, research R5)
- [x] T002 [P] Create `.editorconfig` with `root = true`; `[*]`: `charset = utf-8`, `end_of_line = lf`, `indent_style = space`, `indent_size = 2`, `insert_final_newline = true`, `trim_trailing_whitespace = true`; `[*.md]`: `trim_trailing_whitespace = false` (FR-012, research R4)
- [x] T003 [P] Add `"esbenp.prettier-vscode"` to the `recommendations` array of `.vscode/extensions.json` (keep `astro-build.astro-vscode`)

---

## Phase 2: Foundational (blocking prerequisites)

**Purpose**: dev dependencies every story relies on.

**⚠️ CRITICAL**: US1 and US2 cannot start before this phase is done.

- [x] T004 Install dev dependencies with `npm install --save-dev prettier@^3.9 prettier-plugin-astro@^1.1 @astrojs/check@^0.9 typescript@^6` — `typescript` MUST stay `^6` because `@astrojs/check@0.9` requires the peer `typescript ^5.0.0 || ^6.0.0` (research R2); updates `package.json` and `package-lock.json`. Verify `npm ls typescript` shows no peer error.
- [x] T005 Confirm `tsconfig.json` still extends `astro/tsconfigs/strict` and leave it unchanged (FR-003, research R2)

**Checkpoint**: dependencies installed, `npm run build` still passes.

---

## Phase 3: User Story 1 — Vérifier localement le code avant de committer (Priority: P1) 🎯 MVP

**Goal**: `npm run format` formats the whole project; `npm run check` fails on any formatting or
type error and modifies nothing; `npm run build` is unchanged.

**Independent Test**: quickstart §1 — check passes on the clean repo, fails on an injected
format error (naming the file) and on an injected type error (naming file and line), and
`npm run format` fixes the format error.

### Implementation for User Story 1

- [x] T006 [P] [US1] Create `.prettierrc` (JSON): `{ "plugins": ["prettier-plugin-astro"], "singleQuote": true, "overrides": [{ "files": "*.astro", "options": { "parser": "astro" } }] }` — no other option, Prettier defaults otherwise (FR-001, research R6)
- [x] T007 [P] [US1] Create `.prettierignore` listing `dist/`, `.astro/`, `node_modules/`, `package-lock.json`, `.specify/`, `.claude/`, `.impeccable/` (FR-008, research R6)
- [x] T008 [US1] Add to `scripts` in `package.json`: `"format": "prettier --write ."` and `"check": "prettier --check . && astro check"`; keep `dev`, `build`, `preview`, `astro` unchanged (FR-002, FR-005, FR-007, contracts/commands.md)
- [ ] T009 [US1] Run `npm run format` on the existing repository, then review `git diff` on every Markdown file (`*.md`, `specs/**`): tables, code blocks and lists must keep their meaning; if a file is garbled, add that single file to `.prettierignore` and restore it with `git checkout -- <file>` (spec edge case). Commit this reformat alone: `chore: format codebase with prettier`
- [ ] T010 [US1] Run `npm run check && npm run build` and fix any error until both exit 0 (FR-014, SC-001); fix type errors in source rather than loosening `tsconfig.json`
- [ ] T011 [US1] Validate quickstart §1: inject a format error, then a type error (`const n: number = 'x';` in the frontmatter of `src/pages/index.astro`), confirm the failure output of contracts/commands.md, revert both; measure `time npm run check` < 30 s (SC-003)

**Checkpoint**: US1 is fully usable locally — the MVP.

---

## Phase 4: User Story 2 — Bloquer automatiquement le code non conforme sur GitHub (Priority: P2)

**Goal**: every push and every PR to `main` runs `npm ci → npm run check → npm run build`; any
failure makes the status red.

**Independent Test**: quickstart §2 — PR green when clean; red on a format error, a type error
and a build-only error.

### Implementation for User Story 2

- [ ] T012 [US2] Create `.github/workflows/ci.yml` per contracts/ci.md: `name: CI`; `on: push` (all branches) and `pull_request` (branches: `main`); `permissions: contents: read`; `concurrency: { group: ci-${{ github.ref }}, cancel-in-progress: true }`; one job `check-and-build` on `ubuntu-latest` with steps `actions/checkout` → `actions/setup-node` (`node-version-file: .nvmrc`, `cache: npm`) → `npm ci` → `npm run check` → `npm run build`. Use the latest major tag of each action at implementation time (check their GitHub releases) (FR-009, FR-010, FR-011)
- [ ] T013 [US2] Run `npm run format` then `npm run check` so the new workflow file is itself formatted
- [ ] T014 [US2] Push the branch `001-repo-guardrails` and open a PR to `main` (ask the user before pushing); confirm the `CI / check-and-build` check is green in < 5 min (SC-004)
- [ ] T015 [US2] Validate quickstart §2 scenarios 2–4 on the PR with throw-away commits (format error, type error, `throw new Error('boom');` in the frontmatter of `src/pages/index.astro`): each turns the check red; revert them so the PR ends green (SC-002)

**Checkpoint**: `main` can no longer receive red code unnoticed.

---

## Phase 5: User Story 3 — Démarrer le projet grâce au README (Priority: P3)

**Goal**: the README alone lets a newcomer install, run and check the project and follow the
speckit workflow.

**Independent Test**: quickstart §3 — fresh clone, only the README, site running and
`npm run check` passing.

### Implementation for User Story 3

- [ ] T016 [US3] Update `README.md` (French, keep existing sections "Documents du projet" and "Conventions"): **Prérequis** (Node 22, `nvm use` reads `.nvmrc`); **Installation** (`npm install`); **Commandes** table with `dev`, `build`, `preview`, `format`, `check` and their role (contracts/commands.md); **Avant de committer** (`npm run check && npm run build`); **CI** (what runs on push/PR, and how to make the `CI / check-and-build` check required on `main` in GitHub → Settings → Branches, research R8); **Workflow speckit** (the `/speckit-specify → clarify → plan → tasks → implement` chain, blocks in `ROADMAP.md`) (FR-013)
- [ ] T017 [P] [US3] In `AGENTS.md`, section "Before committing", remove the parenthesis "(`npm run check` is added by F01; until then, `npm run build` only.)"
- [ ] T018 [US3] Validate quickstart §3: clone the branch into the scratchpad, follow only `README.md` up to `npm run dev` and `npm run check`; fix the README for any missing step (SC-005)

**Checkpoint**: all three stories done.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [ ] T019 Run `npm run check && npm run build` one last time on the whole branch
- [ ] T020 Check with `git log main..HEAD --oneline` that every commit of the branch is a conventional commit (`chore`, `ci`, `docs`) written in English

---

## Dependencies & Execution Order

- **Setup (T001–T003)**: no dependency, all parallel.
- **Foundational (T004–T005)**: after Setup; blocks US1 and US2.
- **US1 (T006–T011)**: after T004. T006 ∥ T007, then T008 → T009 → T010 → T011.
- **US2 (T012–T015)**: needs the `check` script from T008 and a green repo (T010). T012 → T013 → T014 → T015.
- **US3 (T016–T018)**: README content depends on the final command list (T008) and CI behaviour (T012); T017 is independent and can run any time.
- **Polish (T019–T020)**: after all stories.

```text
T001 T002 T003 ──► T004 ─► T005
                     │
                     ▼
              T006 ∥ T007 ─► T008 ─► T009 ─► T010 ─► T011   (US1)
                                       │
                                       ▼
                                  T012 ─► T013 ─► T014 ─► T015   (US2)
                                       │
                                       ▼
                                  T016 ─► T018 (T017 any time)   (US3)
                                       ▼
                                  T019 ─► T020
```

## Parallel Examples

- **Setup**: T001, T002 and T003 together (three different files).
- **US1**: T006 (`.prettierrc`) together with T007 (`.prettierignore`).
- **US3**: T017 (`AGENTS.md`) alongside T016 (`README.md`).

## Implementation Strategy

1. **MVP = Phases 1–3 (US1)**: local `format` / `check` working; already satisfies the
   constitution's "check before each commit" rule.
2. **Then US2**: the CI makes the rule enforced, not just available.
3. **Then US3**: document what now exists.
4. Suggested commits: `chore: add editor and node version settings` (T001–T003),
   `chore: add prettier and astro check` (T004–T008), `chore: format codebase with prettier`
   (T009), `ci: add check and build workflow` (T012–T013), `docs: document setup, commands and
   speckit workflow` (T016–T017).

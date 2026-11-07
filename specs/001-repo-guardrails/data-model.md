# Data Model: Outillage et garde-fous du dépôt

This feature has no runtime data and no content collection. The only "entities" are the
repository configuration files; each one has a single responsibility.

| File                       | Role                                 | Read by                                     | Rules                                                |
| -------------------------- | ------------------------------------ | ------------------------------------------- | ---------------------------------------------------- |
| `.nvmrc`                   | Node version (single source, FR-011) | nvm/fnm locally, `actions/setup-node` in CI | One line: `22`                                       |
| `.editorconfig`            | Base editor settings (FR-012)        | Editors, Prettier                           | utf-8, lf, 2 spaces, final newline                   |
| `.prettierrc`              | Formatting convention (FR-001)       | Prettier                                    | Plugin `prettier-plugin-astro`, `singleQuote`        |
| `.prettierignore`          | Exclusions (FR-008)                  | Prettier                                    | Generated files and third-party tooling              |
| `tsconfig.json`            | Type strictness (FR-003)             | `astro check`                               | Extends `astro/tsconfigs/strict` (already the case)  |
| `package.json` `scripts`   | Command surface (FR-001, 002, 007)   | npm, CI                                     | See [contracts/commands.md](./contracts/commands.md) |
| `.github/workflows/ci.yml` | Automated gate (FR-009, 010)         | GitHub Actions                              | See [contracts/ci.md](./contracts/ci.md)             |
| `README.md`                | Onboarding (FR-013)                  | Humans                                      | Pitch, how it's built, run locally                   |
| `CONTRIBUTING.md`          | Maintenance guide (FR-013)           | Maintainer, contributors                    | Sections listed in the commands contract             |

## State: CI run

```
queued → running → success   (check and build both exit 0)
                 → failure   (first non-zero step; later steps skipped)
                 → cancelled (superseded by a newer push on the same ref)
```

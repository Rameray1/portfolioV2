# Contract: npm commands

The command surface of the repository after F01. The README lists exactly these.

| Command           | Does                                | Modifies files | Exit code                                                |
| ----------------- | ----------------------------------- | -------------- | -------------------------------------------------------- |
| `npm run format`  | `prettier --write .`                | Yes (formats)  | 0 unless Prettier crashes                                |
| `npm run check`   | `prettier --check . && astro check` | No (FR-005)    | 0 if formatted **and** no type error; non-zero otherwise |
| `npm run build`   | `astro build` (unchanged, FR-007)   | Writes `dist/` | 0 on success                                             |
| `npm run dev`     | `astro dev` (unchanged)             | No             | —                                                        |
| `npm run preview` | `astro preview` (unchanged)         | No             | —                                                        |

## Failure output (FR-006)

- Formatting: Prettier prints `[warn] <path>` for each unformatted file, then a summary line.
- Types: `astro check` prints `<path>:<line>:<col> - error ts(<code>): <message>` and a final
  count of errors, warnings and hints.

## Ordering

`check` runs Prettier first (fast, ~1 s) so a formatting slip fails before the slower type
check. Both must pass; `&&` makes the first failure stop the command.

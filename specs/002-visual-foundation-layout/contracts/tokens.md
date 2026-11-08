# Contract: design tokens (`src/styles/global.css`)

Source of values: `DESIGN.md` (front matter + prose). Any change of value happens in
`DESIGN.md` **and** here, never in a component.

## Colors (light on `:root`, dark under `@media (prefers-color-scheme: dark)`)

| Token               | Light     | Dark      | Role                                              |
| ------------------- | --------- | --------- | ------------------------------------------------- |
| `--color-paper`     | `#ffffff` | `#161513` | page background, text on ink/red                  |
| `--color-ink`       | `#141414` | `#f1efea` | text                                              |
| `--color-ink-muted` | `#57554f` | `#aaa69d` | secondary text                                    |
| `--color-rule`      | `#141414` | `#f1efea` | heavy rules (2 px)                                |
| `--color-rule-soft` | `#dcd9d2` | `#36342f` | thin rules (1 px)                                 |
| `--color-mark`      | `#c8102e` | `#ff5a6a` | current page, focus ring, selection, eval symbols |
| `--color-mark-ink`  | `#ffffff` | `#161513` | text on `mark`                                    |

## Typography

| Token                        | Value                                            |
| ---------------------------- | ------------------------------------------------ |
| `--font-sans`                | `"Archivo", "Helvetica Neue", Arial, sans-serif` |
| `--stretch-display`          | `72%`                                            |
| `--stretch-text`             | `100%`                                           |
| `--text-xs`                  | `0.8125rem` (13)                                 |
| `--text-sm`                  | `0.9375rem` (15)                                 |
| `--text-base`                | `1.125rem` (18)                                  |
| `--text-lg`                  | `1.375rem` (22)                                  |
| `--text-xl`                  | `clamp(1.375rem, 1.1rem + 0.9vw, 1.75rem)`       |
| `--text-2xl`                 | `clamp(1.75rem, 1.4rem + 1.2vw, 2.5rem)`         |
| `--text-headline`            | `clamp(2.5rem, 1.6rem + 3.6vw, 4.5rem)`          |
| `--text-display`             | `clamp(3.5rem, 2rem + 6vw, 6rem)`                |
| `--leading-tight`            | `0.92`                                           |
| `--leading-snug`             | `1.3`                                            |
| `--leading-body`             | `1.55`                                           |
| `--tracking-tight`           | `-0.02em`                                        |
| `--weight-regular`           | `400`                                            |
| `--weight-semibold`          | `600`                                            |
| `--weight-bold`              | `700`                                            |
| `--weight-black`             | `800`                                            |
| `--underline-offset`         | `0.2em` (links)                                  |
| `--underline-offset-current` | `0.35em` (current rubrique)                      |

## Space, rules, radius, layout, motion

| Token                     | Value                                 |
| ------------------------- | ------------------------------------- |
| `--space-1` … `--space-9` | `0.25 0.5 0.75 1 1.5 2 3 4 6` rem     |
| `--rule-heavy`            | `2px`                                 |
| `--rule-thin`             | `1px`                                 |
| `--radius`                | `0`                                   |
| `--page-max`              | `80rem`                               |
| `--gutter`                | `clamp(1rem, 0.5rem + 2.5vw, 4.5rem)` |
| `--measure`               | `68ch`                                |
| `--focus-width`           | `2px`                                 |
| `--focus-offset`          | `3px`                                 |
| `--duration`              | `160ms` (`0ms` under reduced motion)  |
| `--ease-out`              | `cubic-bezier(0.16, 1, 0.3, 1)`       |

## Global base (the only global rules besides tokens)

- `@font-face` Archivo (R3); `:root { color-scheme: light dark }`.
- Reset (R4).
- `body`: `--font-sans`, `--text-base`, `--leading-body`, `tabular-nums`, `paper`/`ink`.
- Links: `color: inherit`, underline `--rule-thin`, offset `--underline-offset`; hover `--rule-heavy`.
- `:focus-visible`: outline `--focus-width solid --color-mark`, offset `--focus-offset`.
- `::selection`: `--color-mark` background, `--color-mark-ink` text.
- `h1, h2, h3 { text-wrap: balance }`, `p { text-wrap: pretty }`.

## Usage rules

- Components use `var(--token)` only. Allowed literals (constitution VIII): `0`, `1px`, `%`,
  breakpoints inside `@media`, and one commented value specific to a single component.
- `--radius` is `0` and stays a token so a component never writes a radius of its own.
- Transitions use `var(--duration)` and `var(--ease-out)`.

Tokens of later components (inverted row, eval symbol on inverted row, diagram squares and
edge) are documented in `DESIGN.md` and added to `global.css` by the feature that first uses
them (F05, F06), not before.

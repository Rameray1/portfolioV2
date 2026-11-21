# Contract: Motion

What each piece of the feature exposes to the others. Behaviour per state:
[data-model.md](../data-model.md), « State per active row ».

## `src/lib/board.ts`

```ts
export interface Move {
  from: string;
  to: string;
  eval: '!' | '!?' | '!!';
}
export function playBoard(fen: string, moves: Move[]): Board; // Board: see data-model.md
```

Pure, build time only. Throws on the validation rules of the data model.

## `Diagram.astro`

```ts
interface Props {
  fen: string;
  label: string; // describes the reference position (FR-002)
  moves?: Move[]; // default []: a still diagram of the FEN
}
```

Rendered hooks (internal to the component, listed for review):

| Element     | Attributes / custom properties                                                         |
| ----------- | -------------------------------------------------------------------------------------- |
| square      | `--file`, `--rank`; `data-from="N"` / `data-to="N"` when marked                        |
| piece       | `--file`, `--rank`; `data-move="N"`, `--dx`, `--dy` when moving                        |
| taken piece | `data-taken-by="N"`                                                                    |
| stamp       | `aria-hidden` chip with `EvalMark`, `data-move="N"`, at the arrival square, board inks |

It reacts to **any element of the page** carrying `data-play="N"` that is hovered (with
`hover: hover`) or has `:focus-visible`. N ranges over 1–3.

## `ProjectList.astro`

New prop `transition` (default `true`): `ProjectView` passes `false` for the « partie
suivante » row, which then carries no name, so only the opened project's title travels. In
the home variant (`detail` false), each row link gets `data-play` = its
1-based index. The `.title` block of every row gets
`style="view-transition-name: project-<slug>"`.

Invariant: `HomeView` passes the same `featured` array, in the same order, to
`ProjectList` and (mapped to `Move[]`) to `Diagram`.

## View transition names

| Name             | Element                         | Pages                                               |
| ---------------- | ------------------------------- | --------------------------------------------------- |
| `site-header`    | `<header>` of `Header.astro`    | all                                                 |
| `project-<slug>` | `.title` of a `ProjectList` row | home, `/projects` (not the « partie suivante » row) |
| `project-<slug>` | `h1` of `ProjectView`           | project page                                        |

A name appears at most once per page. Everything else is the root cross-fade.

## Tokens (`src/styles/global.css`)

| Token              | Value | Reduced motion |
| ------------------ | ----- | -------------- |
| `--duration-page`  | 280ms | 0ms            |
| `--duration-move`  | 320ms | 0ms            |
| `--duration-stamp` | 240ms | 0ms            |

Existing: `--duration` (160ms), `--ease-out`. Board inks, same in both themes (research R13,
R14): `--color-great-on-board`, `--color-interesting-on-board`, `--color-brilliant-on-board`,
`--color-mark-on-board`.

## Media and support gates

| Effect                         | Applies when                                         |
| ------------------------------ | ---------------------------------------------------- |
| piece moves, stamps, fades, VT | `screen and (prefers-reduced-motion: no-preference)` |
| hover trigger                  | `(hover: hover)`; focus trigger always               |
| square marks                   | always (reduced motion included)                     |

## Failure contract

| Data                                       | Build result                      |
| ------------------------------------------ | --------------------------------- |
| featured `move.from` without a white piece | fails, names the project's square |
| featured `move.to` on a white piece        | fails                             |
| two featured moves sharing a square        | fails, names both squares         |
| no featured `!!`                           | passes, nothing changes           |

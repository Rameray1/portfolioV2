# Contract: Parcours

What the feature exposes: two pages, their head, their HTML structure, one data access
function and the build failures. Data shapes are in [data-model.md](../data-model.md).

## Routes

| Path             | Language | File                            |
| ---------------- | -------- | ------------------------------- |
| `/background`    | fr       | `src/pages/background.astro`    |
| `/en/background` | en       | `src/pages/en/background.astro` |

Both are prerendered, indexable, in the sitemap, and reached by the existing nav item. The
language switch links one to the other.

## Head

- `<title>` and meta description from `background.title` and `background.description`,
  unique among the pages of each language.
- Canonical, `hreflang` alternates (fr, en, x-default) and Open Graph tags as produced by
  `Seo.astro` for any static page (F04). No change to `Seo.astro`.
- No `<script>`.

## HTML structure

```text
main
├── h1                                  background.title
├── div.head  aria-hidden="true"        column labels; visible from 56rem only
└── ol
    └── li                              one per entry, in the order of getBackground
        ├── div.when
        │   ├── p.year  aria-hidden     start year in display numerals
        │   ├── p.period
        │   │   ├── time[datetime=YYYY-MM]  start
        │   │   ├── " –"
        │   │   └── time[datetime=YYYY-MM]  end, or span.now: red square (aria-hidden)
        │   │                               + the text of background.present
        │   └── p.kind                  background.experience | background.education
        ├── span.node  aria-hidden      picture: pawn (education) or knight (experience)
        ├── h2                          title
        ├── p.place                     place, in ink, 600
        ├── p.detail                    detail
        ├── ul.tech[aria-label]         technologies as stack chips, one li each   (if any)
        └── ul.highlights[aria-label]   achievements, one li each                  (if any)
```

Rules:

- One `<h1>`; entry titles are `<h2>`.
- The type is text, in the page language: never colour or shape alone. The piece is
  decorative (`alt=""`, inside an `aria-hidden` element).
- The pieces are the unmodified cburnett files of the home diagram: `bP` / `bN` by default,
  `wP` / `wN` under `prefers-color-scheme: dark`.
- An ongoing entry (no `end`) ends its period with « aujourd'hui » / « present » in 600,
  after a red square. Years are always in ink.
- Neither `ul` is rendered when empty: no label, no gap.
- When `start` equals `end`, the period is a single `<time>`.
- Technologies are plain text, without links.
- Rows are not links and have no focusable element.
- Class names above are indicative; the element order and the semantics are the contract.

## Layout

| Width     | Columns                                                                                                                                                                                              |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `≥ 56rem` | when (12.5rem: year, one-line period, type) · thread and piece (1.75rem) · title block · place (10–16rem). Header row above.                                                                         |
| `< 56rem` | when (6rem: year with the piece at its end, period on two lines, type) · title with the place right under it. Description, chips and achievements then take the full width. No header row or thread. |

Rows are separated by soft rules. On mobile the list opens on a 2 px rule; from `56rem` the
header row carries it. No horizontal scroll from 320 px. Long titles and chips wrap inside
their column.

Each entry fits in one phone screen: at 375 px wide, no entry is taller than about 550 px
with the delivered content. Achievements are set in `--text-sm`.

## Hover

Inside `@media (hover: hover)` only: the hovered entry keeps full ink and its muted texts
(period) go to ink; every other entry goes to muted ink, year and « aujourd'hui » included.
Colour transition on `--duration`. The piece of the hovered entry moves up by `--space-1`,
unless `prefers-reduced-motion: reduce`. No inversion, no cursor change, nothing on touch.

## `getBackground(locale)` — `src/lib/background.ts`

Returns `BackgroundEntry[]` (data-model), merged and sorted. Used by `BackgroundView` now
and by the CV in F09. It reads nothing but the two collections and never reads the current
date.

## Failure contract

Each case fails `npm run build`. Schema errors are reported by Astro with the collection,
the entry id and the field.

| #   | Case                                                                | Reported by         |
| --- | ------------------------------------------------------------------- | ------------------- |
| 1   | `start`, `title`, `place` or `detail` missing                       | schema              |
| 2   | `title.en`, `detail.fr` or one side of a highlight missing or empty | schema              |
| 3   | `start` or `end` not `YYYY-MM` (text, month 13, full date)          | schema              |
| 4   | `end` before `start`                                                | schema              |
| 5   | unknown key in an entry                                             | schema              |
| 6   | a file missing or unreadable (YAML syntax error)                    | `strictFile` loader |
| 7   | a file without entry                                                | `getBackground`     |

Not a failure: `end` in the future; `start` in the future; `tech` or `highlights` on an
education entry.

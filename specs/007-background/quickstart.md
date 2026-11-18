# Quickstart: validate Parcours

Run from the repo root. Contract: [contracts/background.md](./contracts/background.md);
data: [data-model.md](./data-model.md).

## 0. Prerequisites

```sh
npm ci
npm run check && npm run build
astro dev --background   # http://localhost:4321
```

Data in the repo: two experiences and two education entries taken from the CV (two ongoing
and simultaneous, one experience with technologies and achievements, two finished). Steps
marked « scratch » are done on a throwaway branch and never committed.

## 1. One timeline (US1)

- Open `/background` then `/en/background`: one list mixing both types, most recent start
  first; each entry shows its year in large numerals, period, type, title, place in bold and
  description; an entry with `tech` shows chips, an entry with `highlights` a dashed list;
  the others show no empty label.
- Each ongoing entry ends its period with « aujourd'hui » / « present » in bold after a red
  square; every year is in ink.
- Each entry shows a chess piece: a pawn for education, a knight for experience; black in
  the light theme, white in the dark theme.
- English page: titles, descriptions, achievements and periods in English; same order,
  places and technologies.
- The nav item « Parcours » / « Background » is marked as the current page; the language
  switch leads to the same page in the other language.
- `grep -c '<script' dist/background/index.html dist/en/background/index.html` → 0 for both.
- In `dist/`: both pages have their own `<title>` and description, a canonical and three
  alternates; both are in the sitemap.
- VoiceOver: the timeline is announced as a list with its count; heading navigation moves
  from entry to entry; period, type and title are read for each; the header row, the large
  year and the piece are not read.

## 2. Periods (US2)

- Finished entry: `avr. 2024 – juil. 2024` / `Apr 2024 – Jul 2024` (the internship).
- Ongoing entry: ends with `aujourd'hui` / `present`.
- Each month is a `<time>` with `datetime="YYYY-MM"` in the built HTML.
- Scratch: add `end` to an ongoing entry and rebuild → its period shows that month and
  loses the red square, in both languages; nothing else changes. Set `end` equal to `start`
  → the month is written once.
- Scratch: set an `end` in the future → the period shows that month, not « aujourd'hui ».
- Read the prose of the entries: no date, year, duration or « actuellement » /
  « currently ».
- Build twice on different days (or with a changed system date): identical HTML.

## 3. Mobile and desktop (US3)

Captures at 375 px (in a 375 px `<iframe>`) and at 1280 px, light and dark, header and
footer included:

- 375 px: no horizontal scroll; on the left the year with the piece beside it, the period on
  two lines and the type; on the right the title, the place under it; then the rest on the
  full width; no header row, no thread; nothing overlaps.
- 1280 px: header row on the 2 px rule; year and one-line period in the first column; a
  thread interrupted by one piece per entry; description, chips and achievements under the
  title; place in its own column.
- Hover at 1280 px, light and dark: the hovered entry keeps full ink and its piece moves up
  one step; the other entries go to muted ink; the pointer stays an arrow. In headless
  Chrome, simulate the state by copying the `:hover` rules onto a class. With reduced motion
  enabled, the piece does not move.
- Scratch: a title of about 90 characters and twelve technologies → the text wraps in its
  column at both sizes.
- 320 px: still no horizontal scroll.
- One entry per screen: at 375 px wide, measure the height of each `ol > li`; none exceeds
  about 550 px (501 px for the tallest delivered entry, 306 px at 1280 px). At 320 px the
  apprenticeship reaches 604 px and needs a short scroll.
- Dark theme: contrast of muted text (periods, and every entry while another is hovered)
  meets the `DESIGN.md` thresholds (axe or Lighthouse).

## 4. Two files, no error possible (US4)

Scratch, rebuilding after each step. Every step must fail; steps 1 to 6 name the collection
and the entry:

1. remove `place` from an experience;
2. remove `title.en` from an education entry;
3. empty one side of a highlight;
4. `start: 2024-13`, then `start: soon`, then `start: 2024-09-01`;
5. `end` earlier than `start`;
6. add `kind: internship` to an entry;
7. empty `education.yaml` (`{}`) → fails and names the file;
8. break the YAML syntax of `experience.yaml` (duplicate key) → fails and names the file;
9. rename `education.yaml` → fails and names the file.

Then:

- Add a valid entry to either file → it appears at its rank on both pages, with no other
  file changed. Remove it → it disappears from both.
- Give two entries the same `start` → ongoing first, then latest `end`, then French title;
  same order in both languages.
- Set a `start` in the future → the entry comes first, the build passes.
- Add `tech` and `highlights` to an education entry → shown as for an experience.
- Read both YAML files: no order, type, formatted period or other page-specific value.

## 5. Quality gates

- `npm run check && npm run build` pass.
- Lighthouse mobile on `/background` and `/en/background`: performance ≥ 95, accessibility,
  best practices and SEO 100.
- axe: no violation in either theme.
- Keyboard: the page has no interactive element of its own; focus goes from the header to
  the footer with a visible ring.
- `/impeccable audit`, then `/impeccable polish`, checked again at 375 px and 1280 px in
  both themes.
- `DESIGN.md` and `ROADMAP.md` aligned (research R12).

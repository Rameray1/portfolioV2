# Quickstart: validate Projets

Run from the repo root. Contract: [contracts/projects.md](./contracts/projects.md); data:
[data-model.md](./data-model.md).

## 0. Prerequisites

```sh
npm ci
npm run check && npm run build
astro dev --background   # http://localhost:4321
```

Fixtures in the repo: `sample-project` (published, featured, `!!`, cover, English file) and
`sample-draft` (draft, no English file). Steps marked « scratch » are done on a throwaway
branch and never committed.

## 1. List (US1)

- Open `/projects/` and `/en/projects/` at 1280 px and at 375 px (in a 375 px `<iframe>`),
  light and dark: one row for `sample-project` with year, title, summary, technologies and a
  blue `!!`; legend under the list; no card, image or diagram; no horizontal scroll.
- Tab to the row: it inverts, the symbol stays readable, Enter opens the project.
- VoiceOver on the row: the symbol is read « coup brillant » / « brilliant move »; a `!` is read « bon coup » / « good move ».
- Scratch: copy the sample twice with years 2024 and 2022 → rows ordered 2026, 2024, 2022;
  give two of them the same year → ordered by French title.
- Scratch: mark the only published fiche as draft and build → the list page shows
  `projects.empty`, no legend.

## 2. Project page (US2)

- Open `/projects/sample-project/` then `/en/projects/sample-project/`: back link, title,
  summary, year, chips, links, key move with the blue symbol in the margin, cover, body.
  English page: English prose, same year, chips, links and image file.
- Throttle the network: the cover area is reserved before the image loads (CLS 0 in
  Lighthouse).
- Scratch: remove `links.demo` and `links.video` → only « Code »; remove `links` → no links
  entry; remove `cover` and `coverAlt` (both files) → no image, no gap.
- Language switch on each page leads to the same project in the other language.
- `grep -c '<script' dist/projects/sample-project/index.html` → 0.

## 3. One file, no error possible (US3)

Scratch, rebuilding after each step; each one must fail and name the file:

1. remove `keyMove` from the French file;
2. `year: soon`;
3. `eval: '?'`;
4. `links.code: github`;
5. `cover` pointing to a missing file;
6. `cover` without `coverAlt`;
7. add `year: 2026` to the English file;
8. an English file with no French file;
9. an empty body in a published file;
10. `move.from: i9`;
11. `move.to` equal to `move.from`.

An empty body in `sample-draft.md` must **not** fail the build.

Then add a new valid French file only: it appears in both lists and has both pages, with
`git status` showing nothing but that file.

## 4. Drafts (US4)

```sh
npm run build
grep -rl "sample-draft" dist/ ; ls dist/projects dist/en/projects
```

- No match, no `sample-draft` folder, not in `dist/sitemap-0.xml`.
- In dev, `/projects/` lists it with the draft mark and its page opens.

## 5. Featured (US5)

- `/` and `/en/` at 1280 px: heading, one row (year, `4.c3`, title, key move, blue `!!`),
  legend, under the actions; diagram still. At 375 px: the list comes after the diagram.
- Scratch: `featured: false` on the sample → no heading, no legend, no empty block.
- Scratch: four published featured fiches → build fails, slugs named. Two featured `!!` →
  fails. `featured: true` without `move` → fails.
- Weight: `npm run preview`, load `/` with an empty cache → transferred < 200 kB.

## 6. French fallback (US6)

Scratch: delete `src/content/projects/en/sample-project.md` (and nothing else), build.

- `/en/projects/sample-project/`: English navigation and labels, English notice, French
  prose inside `lang="fr"`.
- `/en/projects/` and `/en/`: French title and text, « French only ».
- `dist/en/projects/sample-project/index.html`: `noindex`, canonical = French URL, no
  `hreflang`. `dist/projects/sample-project/index.html`: no `hreflang`.
- `dist/sitemap-0.xml`: the French URL without an English alternate; the English URL absent.
- Restore the file: notice gone, `hreflang` pair back, English URL in the sitemap.

## 7. Quality gates

- Lighthouse mobile on the list, the sample page and the home, both languages, with
  `PUBLIC_NOINDEX` off: ≥ 95 / 100 / 100 / 100.
- axe: 0 violation, both themes. Contrast of the three symbol colours (dark blue, pink-violet, sky blue), normal and inverted.
- Captures at 375 px and 1280 px, light and dark, header and footer included, for the list,
  the project page (translated and fallback) and the home.
- `grep -rn "\[provisoire\]\|\[draft\]" src/content/projects` lists every sample text.
- Titles and descriptions unique per language: compare the `<title>` and description of the
  indexable pages listed in `dist/sitemap-0.xml`, French then English → no duplicate.

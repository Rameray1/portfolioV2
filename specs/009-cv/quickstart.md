# Quickstart: CV en ligne et PDF

## Prerequisites

- `brew install tectonic` (0.17.0 or later); `tectonic --version` works.
- `pdftotext` and `pdfinfo` (`brew install poppler`) for the PDF checks.
- `npm run check && npm run build` pass.

## 1 · Page (US1)

1. `astro dev --background`, open `/cv` and `/en/cv`. In dev, the `cv-pdf` integration
   compiles each PDF on request, with the same checks as the build.
2. Rubrics in order: header, Profil, Expérience, Formation, Projets, Compétences, Langues
   ([contract](./contracts/cv.md)). English labels and dates on `/en/cv`, same entries.
3. Each value matches `/`, `/background`, `/skills` or the project page.
4. Captures at 375 px (in a 375 px `<iframe>`) and 1280 px, light and dark, header and footer
   included: no horizontal scroll, dates never overlap titles.

## 2 · PDF (US2)

```sh
npm run build
ls dist/cv-fr.pdf dist/cv-en.pdf          # both exist
ls dist/*.tex dist/*.log 2>/dev/null      # nothing
pdfinfo dist/cv-fr.pdf | grep -E 'Pages|Title|Author'   # Pages: 1, title and author set
pdftotext -layout dist/cv-fr.pdf - | head -40           # accents, ’ and « » intact, order kept
```

- Open each PDF: links (email, LinkedIn, GitHub, site, projects) open.
- From any page, reach the CV through the navigation and download the PDF in under 10 s
  (SC-004).
- From `/cv`, the download link saves `Ramazan-Kus-CV.pdf`; from `/en/cv`, the English one.
- Change one value (a highlight, the pitch), rebuild: page and both PDFs show it.

## 3 · Print (US3)

From Chrome in dark mode, print preview of `/cv` and `/en/cv` in A4: one page, light theme,
no header, footer or download link, project URLs written after their titles.

## 4 · Data and failures (US4, US5)

On a scratch copy, one case at a time, `npm run build` must fail and name the cause:

- remove `level.en` from one language;
- empty `languages.yaml`;
- put `&`, `%`, `#` and `_` in a highlight → builds, the characters print as written;
- add a character absent from Pagella (e.g. `☃`) → fails on the missing glyph;
- add long highlights until the CV overflows → fails, « longer than one page »;
- `PATH` without `tectonic` → fails with the install hint.

```sh
grep -rniE 'tel:|\+33|0[67]( ?[0-9]{2}){4}' --exclude-dir=node_modules --exclude-dir=.git . dist
```

returns nothing. On `/` and `/en`, the calls to action are « Voir le CV » then « M'écrire »,
and « Voir le CV » leads to the CV of the current language.

## 5 · CI, deploy and design review

- CI runs `scripts/install-tectonic.sh` then `npm run build`; the Vercel preview of the PR
  serves `/cv-fr.pdf` and `/cv-en.pdf`.
- Lighthouse mobile on `/cv`: ≥ 95 / 100 / 100 / 100; 0 kB of script. axe: no violation.
- `/impeccable audit`, then `/impeccable polish`.

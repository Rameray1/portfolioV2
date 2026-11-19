# Research: CV en ligne et PDF

No `NEEDS CLARIFICATION` was left in the Technical Context. Each decision below resolves a
choice the spec leaves to the plan.

## R1 · One view model for the page and the PDF

- **Decision**: `src/lib/cv.ts` exports `getCv(locale)`, which gathers everything the CV shows
  (identity, contact, profile, experience, education, featured projects, skills, languages)
  into one typed object. `CvView.astro` renders it as HTML, `src/lib/cv-latex.ts` renders it
  as LaTeX. Neither reads a collection or a data file.
- **Rationale**: principle I (a view displays, `src/lib/` provides) and FR-011 (the PDF has
  the rubrics, entries and order of the page): both outputs read the same object, so they
  cannot diverge. Ordering and filtering happen once, in `getCv`, by reusing `getBackground`,
  `getSkills` and `featuredProjects`.
- **Alternatives considered**: each output calling the existing helpers itself (ordering and
  the « empty rubric » rule written twice).

## R2 · Tectonic compiles the PDF, at the end of the build

- **Decision**: [Tectonic](https://tectonic-typesetting.github.io) 0.17.0 (released
  2026-07-27), a single XeTeX binary that fetches the LaTeX packages it needs and caches them.
  An Astro integration, `src/integrations/cv-pdf.ts`, runs it in `astro:build:done` on
  `dist/cv-fr.tex` and `dist/cv-en.tex`, through `execFile` (no shell), then deletes the
  `.tex` and the logs. In `astro dev`, the same integration answers `/cv-fr.pdf` and
  `/cv-en.pdf` by compiling the dev server's `.tex` on request (`astro:server:setup`):
  otherwise the dev server returns its 404 page, which the browser saves as a broken PDF.
- **Rationale**: the maintainer's template is LaTeX; Tectonic is the lightest way to compile
  it (one ~30 MB binary instead of a TeX Live install of several GB), with no npm dependency.
  Running at build time makes the PDF as fresh as the page (FR-010) without a server
  (principle II).
- **Alternatives considered**: TeX Live / `latexmk` (huge install on Vercel and in CI);
  headless Chrome printing `/cv` (one layout instead of two, but a ~150 MB dev dependency,
  and the maintainer chose the LaTeX layout); Typst (single binary, no network, but would
  mean rewriting the template in another language); compiling locally and committing the PDF
  (can lag behind the data, the problem this feature removes).

## R3 · The `.tex` comes from a static endpoint

- **Decision**: `src/pages/[file].tex.ts`, with `getStaticPaths` returning `cv-fr` and
  `cv-en`, returns `renderCvLatex(await getCv(locale))`. The integration only compiles what
  the endpoint wrote.
- **Rationale**: an endpoint runs inside Astro, so it can call `getCollection` through
  `src/lib/`; an integration hook cannot. Same pattern as `robots.txt.ts`. The sitemap
  already ignores endpoints (checked on 2026-11-19: `robots.txt` is not in
  `sitemap-0.xml`), so deleting the `.tex` leaves no dead link.
- **Alternatives considered**: generating the `.tex` in the hook (no access to collections);
  a separate Node script before `astro build` (would duplicate the content layer).

## R4 · Template: the maintainer's preamble, one insertion point

- **Decision**: `src/cv/template.tex` holds the preamble and macros of the maintainer's
  current CV (`\resumeSubheading`, `\resumeProject`, `\resumeItem`, `\resumeSubItem`, list
  starts and ends, margins, section rule, dark blue links) and a body reduced to
  `\begin{document}` · `%% CONTENT %%` · `\end{document}`. It is imported with `?raw`;
  `renderCvLatex` builds the body (header, `\hypersetup` title and author, sections) and
  replaces the marker. No phone number, no `\ifshowphone`.
- **Rationale**: the file stays real LaTeX that the maintainer can read and tweak; all data
  enters at one place, through one escaping function (R6). FR-016.
- **Alternatives considered**: a template engine with loops in the `.tex` (a dependency for
  three loops); the whole template in a TypeScript string (unreadable as LaTeX).

## R5 · XeTeX changes to the template

- **Decision**: remove `\input{glyphtounicode}`, `\pdfgentounicode=1`, `cfr-lm`,
  `\usepackage[T1]{fontenc}`, `latexsym`, `marvosym`, `verbatim`, `float`, `multicol`,
  `graphicx`, `ragged2e`, `tabularx` (unused), and `fullpage` and `fancyhdr` (overridden by
  `geometry`; `\pagestyle{empty}` does their job, same render). Use `fontspec` with TeX Gyre Pagella by file name
  (`\setmainfont{texgyrepagella}[Extension=.otf, UprightFont=*-regular, BoldFont=*-bold,
ItalicFont=*-italic, BoldItalicFont=*-bolditalic]`), which replaces `\headerfontiii`
  (Palatino).
- **Rationale**: the `glyphtounicode` lines are pdfTeX primitives and stop XeTeX. XeTeX with
  an OpenType font writes Unicode text natively, which is what ATS parsers read (FR-012).
  Loading the font by file name works inside Tectonic's bundle without fontconfig.
- **Alternatives considered**: keep pdfTeX (Tectonic only ships XeTeX); Latin Modern (not the
  current Palatino look).

## R6 · Escaping and characters the font lacks

- **Decision**: `latex(text)` in `src/lib/cv-latex.ts` escapes `\ { } $ & # ^ _ % ~` and maps
  the typographic spaces of the data (U+00A0 to `~`, U+202F to `\,`). Every data string goes
  through it; URLs go through `\href{…}` with `%` and `#` escaped. The integration compiles
  with `--keep-logs` and fails the build when the log contains `Missing character`.
- **Rationale**: the data contains `’`, `«`, ` ` (campaign), `ᵉ` (education). An
  unescaped `&` breaks compilation, and a glyph missing from the font is dropped silently
  by XeTeX: the log check turns that into a build failure instead of a hole in the CV.
- **Alternatives considered**: `\tracinglostchars=3` (error support depends on the engine
  version, the log check does not).

## R7 · One page, checked by LaTeX

- **Decision**: the template ends with
  `\AtEndDocument{\clearpage\ifnum\value{page}>2 \errmessage{CV longer than one page}\fi}`.
  The non-zero exit of Tectonic fails the build, and the integration names the file.
- **Rationale**: clarification Q2. After the final `\clearpage`, the page counter is the
  number of pages plus one; the check lives where the layout is decided, with no PDF parsing.
- **Alternatives considered**: counting pages in the PDF from Node (object streams make a
  regex unreliable, a PDF library is a dependency).

## R8 · Installing Tectonic

- **Decision**: locally, `brew install tectonic`. In CI and on Vercel,
  `scripts/install-tectonic.sh` downloads `tectonic-0.17.0-x86_64-unknown-linux-musl.tar.gz`
  from the GitHub release, checks its SHA-256 (pinned in the script), and extracts the binary
  into `node_modules/.bin`, which `npm run build` already puts on the `PATH`. It runs after
  `npm ci` (CI step; `installCommand` in `vercel.json`). When `tectonic` is missing, the
  integration fails with the install command to run.
- **Rationale**: one script for both Linux environments, pinned and verified (no
  `curl | sh`); the static musl build needs no system library on Vercel's image.
- **Alternatives considered**: a third-party GitHub Action (covers CI only); a `postinstall`
  script (would download a Linux binary on the maintainer's Mac too).

## R9 · Stable PDF URLs, readable file name

- **Decision**: `/cv-fr.pdf` and `/cv-en.pdf` at the site root. The download link carries
  `download="Ramazan-Kus-CV.pdf"` (from `site.name`), so the recruiter's file has a useful
  name while the URL stays short and stable.
- **Rationale**: the spec assumes stable names so that a shared link does not break. `/en/…`
  is not needed: Vercel serves existing files before the `/en/.*` 404 route.
- **Alternatives considered**: the name in the URL (renaming the person would move the URL).

## R10 · Print from the browser

- **Decision**: in `global.css`, the dark theme moves under
  `@media screen and (prefers-color-scheme: dark)`, so every page prints in light ink. The
  print block of `CvView` hides the header, the footer, the download link and the symbol
  legend, sets `@page { size: A4; margin: … }`, hides the pieces (a `<picture>` source follows
  the system theme, not print), and writes the URL after each project row
  (`content: var(--site) attr(href)`). Contact links already show their address as text, so
  they get no suffix (FR-018).
- **Rationale**: one word in `global.css` covers FR-017's light theme; the rest is scoped to
  the CV page, the only page with a print layout.
- **Alternatives considered**: redefining every token in a print block (duplicates the
  palette); hiding header and footer site-wide (not needed elsewhere).

## R11 · Languages and city

- **Decision**: a `languages` collection on `src/data/languages.yaml` through `strictFile`,
  schema `{ rank, name: { fr, en }, level: { fr, en } }`; `file()` does not keep the file
  order (checked in dev on 2026-11-19), so `rank` sets it. `site.contact.city`
  (`'Alès, France'`) in `src/data/site.ts`.
- **Rationale**: FR-020 asks for a build failure on an incomplete language; a collection
  schema gives it, a TypeScript constant only fails `astro check`. The city is one string
  next to the other contact data, which `site.ts` already types.
- **Alternatives considered**: languages in `site.ts` (no build-time validation); the city in
  the campaign (it is identity, not a campaign lever).

## R12 · Campaign and documents

- **Decision**: `campaign.actions` becomes `[CV, email]`: `{ label: { fr: 'Voir le CV', en:
'View my CV' }, href: { fr: '/cv', en: '/en/cv' } }` first, as `CONTRIBUTING.md` already
  describes (CV in the filled button, email second). LinkedIn leaves the home calls to action.
  `CONTENU.md` §6 gains the languages row, §5 mentions the PDFs; `CONTRIBUTING.md` explains
  Tectonic and how to add a language; `ROADMAP.md` keeps the F09 plan line.
- **Rationale**: clarification Q1; the order follows the existing convention.
- **Alternatives considered**: email first (contradicts `CONTRIBUTING.md`).

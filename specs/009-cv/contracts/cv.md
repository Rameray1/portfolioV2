# Contract: CV en ligne et PDF

## Routes and files

| Path         | Locale | Source                                            | In sitemap |
| ------------ | ------ | ------------------------------------------------- | ---------- |
| `/cv`        | fr     | `src/pages/cv.astro` → `CvView`                   | yes        |
| `/en/cv`     | en     | `src/pages/en/cv.astro` → `CvView`                | yes        |
| `/cv-fr.pdf` | fr     | `[file].tex.ts` → `cv-pdf` integration (Tectonic) | no         |
| `/cv-en.pdf` | en     | same                                              | no         |

The `.tex` files exist only during the build; `dist/` ships the PDFs, not the `.tex` or logs.
The existing `nav.cv` link and the language switcher reach both pages.

## Head

- `<title>` and `<meta name="description">` from `cv.title` / `cv.description`, unique
  among the pages of the language; `hreflang` alternates through the existing `Seo`.

## HTML structure

```html
<div class="cv">
  <div class="intro">
    <h1>Ramazan Kus</h1>
    <p class="title">Élève ingénieur en alternance</p>
  </div>
  <aside class="info" aria-label="Coordonnées">
    <p class="availability">…status… …detail…</p>
    <p class="download">
      <a class="button primary" href="/cv-fr.pdf" download="Ramazan-Kus-CV.pdf"
        >Télécharger le CV en PDF</a
      >
    </p>
    <dl class="pgn">
      <div>
        <dt>Email</dt>
        <dd><a href="mailto:…">…</a></dd>
      </div>
      <div>
        <dt>LinkedIn</dt>
        <dd><a href="…">linkedin.com/in/…</a></dd>
      </div>
      <div>
        <dt>GitHub</dt>
        <dd><a href="…">github.com/…</a></dd>
      </div>
    </dl>
  </aside>
  <div class="profile">
    <h2 class="visually-hidden">Profil</h2>
    <p class="pitch">…pitch…</p>
  </div>
  <section class="part" aria-labelledby="cv-experience">
    <div class="head"><h2 id="cv-experience">Expérience</h2></div>
    <ol class="steps">
      <li>
        <span class="node"
          ><!-- knight (pawn for education), decorative --></span
        >
        <h3>Développeur logiciel en alternance</h3>
        <p class="when">août 2024 – <span class="now">■ aujourd’hui</span></p>
        <p class="place">Astrée Software, Saint-Jean-Bonnefonds</p>
        <p class="text">…detail…</p>
        <ul class="highlights">
          <li>…</li>
        </ul>
      </li>
    </ol>
  </section>
  <!-- cv-education: same shape; cv-projects: ProjectList (detail mode) -->
  <!-- cv-skills and cv-languages: <dl class="rows"> of <dt>/<dd> rows -->
</div>
```

A rubric with no entry renders no `<section>`. Above `64rem`, `.info` is a sticky column on
the right; below, it dissolves (`display: contents`) under the name. Print: header, footer,
download link and symbol legend hidden; light theme; A4; project URLs written after their
row (`--site` + `href`).

## PDF

- One A4 page, one column; sections in the order of the page, same entries.
- Header: name, title, then `email | city`, then `Portfolio : website | linkedin | github`,
  all clickable, displayed without scheme; only the portfolio carries a label.
- Experience and education: `\resumeSubheading{title}{}{place}{from – to}`, then a list whose
  first item is the `detail` and the next ones the highlights (same entries as the page, FR-011);
  projects: `\resumeProject{title}{tech}{year}{page link}` then summary; skills: one
  `\resumeSubItem{domain :}{names}` per domain; languages: one line.
- Properties: title `Ramazan Kus – CV`, author `Ramazan Kus`, language of the page.
- Text extractable in reading order, accents intact; no icon.

## Failure contract

The build fails, naming the file or entry, when:

| Case                                                | Raised by                 |
| --------------------------------------------------- | ------------------------- |
| a language misses `name` or `level` in one language | `languages` schema        |
| `languages.yaml` is missing, unreadable or empty    | `strictFile` / `getCv`    |
| `tectonic` is not installed                         | `cv-pdf` integration      |
| Tectonic exits with an error (LaTeX error, network) | `cv-pdf` integration      |
| a glyph is missing from the font                    | `cv-pdf` (log scan)       |
| a PDF is longer than one page                       | template `\AtEndDocument` |
| a PDF is not written                                | `cv-pdf` (file check)     |

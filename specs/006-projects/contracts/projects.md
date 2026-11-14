# Contract: Projets

What the build MUST produce. Class names are free; structure, attributes and text sources
are the contract. Fields: [data-model.md](../data-model.md).

## Routes

| Path                   | Shell                                | View           | `<html lang>` |
| ---------------------- | ------------------------------------ | -------------- | ------------- |
| `/projects/`           | `src/pages/projects/index.astro`     | `ProjectsView` | `fr`          |
| `/en/projects/`        | `src/pages/en/projects/index.astro`  | `ProjectsView` | `en`          |
| `/projects/<slug>/`    | `src/pages/projects/[slug].astro`    | `ProjectView`  | `fr`          |
| `/en/projects/<slug>/` | `src/pages/en/projects/[slug].astro` | `ProjectView`  | `en`          |

One pair of project paths per published project, with or without an English file. The
language switch links each path to its mirror (R6).

## Head (`Seo`)

| Page                    | title            | description            | canonical | hreflang pair | robots    |
| ----------------------- | ---------------- | ---------------------- | --------- | ------------- | --------- |
| list                    | `projects.title` | `projects.description` | self      | yes           | —         |
| project, EN file exists | `project.title`  | `project.summary`      | self      | yes           | —         |
| project FR, no EN file  | `project.title`  | `project.summary`      | self      | no            | —         |
| project EN fallback     | French title     | French summary         | FR URL    | no            | `noindex` |

`PUBLIC_NOINDEX` keeps its global effect (F04). The sitemap lists the first three rows only.

## Row (`ProjectList`)

```html
<ol>
  <li>
    <a href="{localizePath('/projects/<slug>/', locale)}">
      <span>
        {year}
        <span>{move.notation}</span>
        <!-- home only -->
      </span>
      <span lang="fr" ?>
        <!-- lang only when untranslated -->
        <span>{title}</span>
        <span>{t('projects.keyMove')} {keyMove}</span>
        <!-- home -->
        <span>{summary}</span>
        <!-- /projects -->
        <span>{tech.join(' · ')}</span>
        <!-- /projects -->
      </span>
      <span>{t('projects.frenchOnly')}</span>
      <!-- only when untranslated -->
      <span>{t('projects.draft')}</span>
      <!-- only for a draft, dev -->
      <EvalMark eval="{eval}" />
    </a>
  </li>
</ol>
<ul aria-label="{t('projects.legend')}">
  <!-- one <li> per symbol present -->
  <li><EvalMark eval="!" legend /></li>
  …
</ul>
```

- One link per row, covering the row; hover and focus invert it (`--color-invert-*`), the
  symbol takes its `-on-invert` colour.
- No image, no card, no diagram in the list.
- Empty array: the component renders nothing.

## `EvalMark`

```html
<span data-eval="{eval}">
  <span aria-hidden="true">{eval}</span>
  <span class="visually-hidden"
    >{t('eval.good' | 'eval.bet' | 'eval.brilliant')}</span
  >
</span>
```

In the legend the meaning is visible text, so the hidden span is not repeated.
`!!` → `--color-brilliant`; others → `--color-mark`.

## List page (`ProjectsView`)

```html
<h1>{t('projects.title')}</h1>
<ProjectList projects detail />
<!-- or <p>{t('projects.empty')}</p> -->
```

## Home (`HomeView`)

Third child of the opening grid, after the diagram in source order (R10). Rendered only when
at least one project is featured:

```html
<section aria-labelledby="featured">
  <h2 id="featured">{t('projects.featured')}</h2>
  <ProjectList projects="{featured}" />
</section>
```

The diagram does not react to the rows (F11). No project image on the home.

## Project page (`ProjectView`)

```html
<a href="{localizePath('/projects/', locale)}">{t('projects.back')}</a>
<p>{t('projects.frenchOnlyNotice')}</p>
<!-- only when untranslated -->
<p>{t('projects.draft')}</p>
<!-- only for a draft, dev -->
<article lang="fr" ?>
  <!-- lang only when untranslated -->
  <h1>{title}</h1>
  <p>{summary}</p>
  <dl>
    <div>
      <dt>{t('projects.year')}</dt>
      <dd>{year}</dd>
    </div>
    <div>
      <dt>{t('projects.tech')}</dt>
      <dd>
        <ul>
          <li>{tech}</li>
          …
        </ul>
      </dd>
    </div>
    <div>
      <!-- only if at least one link -->
      <dt>{t('projects.links')}</dt>
      <dd><a href="{links.code}">{t('projects.link.code')}</a> …</dd>
    </div>
  </dl>
  <div>
    <EvalMark eval="{eval}" />
    <!-- margin column -->
    <p>
      <span class="visually-hidden">{t('projects.keyMove')} </span>{keyMove}
    </p>
  </div>
  <picture src="{cover}" alt="{coverAlt}" … />
  <!-- only if cover -->
  <div><content /></div>
</article>
```

- Interface labels (`dt`, back link, notice) stay in the page language; when the article
  carries `lang="fr"`, the `dl` labels are marked `lang="en"` or sit outside it.
- Only existing links are rendered; no `dl` entry without links.
- The cover has explicit `width` and `height`; AVIF and WebP sources.
- No `<script>`, no `view-transition-name` (F11).

## Failure contract

`npm run build` exits non-zero, and the message names the file, for:

| Case                                                                    | Raised by |
| ----------------------------------------------------------------------- | --------- |
| missing `title`, `year`, `summary`, `keyMove`, `tech`, `eval`           | schema    |
| `year` not an integer, `eval` outside the three symbols, link not a URL | schema    |
| unknown key (for example `year` in an English file)                     | schema    |
| `cover` file missing; `cover` without `coverAlt`, or the reverse        | schema    |
| `featured: true` without `move`; square outside `a1`–`h8`               | schema    |
| English file without French file                                        | lib       |
| empty body of a published project                                       | lib       |
| French `cover` and English file without `coverAlt`, or the reverse      | lib       |
| more than 3 published featured projects                                 | lib       |
| more than 1 published featured `!!`                                     | lib       |

# Data Model: Projets

Phase 1 of [plan.md](./plan.md). « build » means `npm run build`; every rule below fails it.

## French file — `src/content/projects/fr/<slug>.md`

Collection `projects`, id = file name = slug (R1). Strict: an unknown key fails.

| Field           | Type                         | Required          | Rule                                             |
| --------------- | ---------------------------- | ----------------- | ------------------------------------------------ |
| `title`         | string                       | yes               | non-empty                                        |
| `year`          | integer                      | yes               | 2000 – 2100                                      |
| `summary`       | string                       | yes               | non-empty; also the page description             |
| `keyMove`       | string                       | yes               | non-empty; one short sentence                    |
| `tech`          | string[]                     | yes               | at least one, each non-empty; order kept         |
| `eval`          | `'!'` \| `'!?'` \| `'!!'`    | yes               |                                                  |
| `links`         | `{ code?, demo?, video? }`   | no (default `{}`) | each an http(s) URL; strict                      |
| `cover`         | image (`image()`)            | no                | file must exist; lives in `src/assets/projects/` |
| `coverAlt`      | string                       | with `cover`      | present if and only if `cover` is                |
| `featured`      | boolean                      | no (`false`)      | implies `move`                                   |
| `draft`         | boolean                      | no (`false`)      |                                                  |
| `move.from`     | square (`a1` – `h8`)         | with `featured`   |                                                  |
| `move.to`       | square                       | with `featured`   | differs from `from`                              |
| `move.notation` | `{ fr: string; en: string }` | with `featured`   | both non-empty (R11)                             |
| body            | Markdown                     | yes               | not empty; six parts are a writing rule only     |

## English file — `src/content/projects/en/<slug>.md`

Collection `projectsEn`, same slug. Optional file. Strict: prose only (FR-003).

| Field      | Type     | Required            | Rule                                    |
| ---------- | -------- | ------------------- | --------------------------------------- |
| `title`    | string   | yes                 | non-empty                               |
| `summary`  | string   | yes                 | non-empty                               |
| `keyMove`  | string   | yes                 | non-empty                               |
| `coverAlt` | string   | if the FR has cover | present if and only if FR has a `cover` |
| body       | Markdown | yes                 | not empty                               |

## Cross-entry rules — `src/lib/projects.ts` (R2)

Checked on every call, error message names the slugs:

1. every `projectsEn` id exists in `projects`;
2. no empty body in a published project, in either collection (a draft may have one);
3. `coverAlt` of the English file matches the presence of the French `cover`;
4. at most 3 published projects with `featured: true`;
5. at most 1 published featured project with `eval: '!!'`.

« Published » = `draft` is false. Rules 2, 4 and 5 ignore drafts (R4). The schemas apply to
drafts like to any file.

## Merged view — `Project`

```ts
interface Project {
  slug: string;
  year: number;
  tech: string[];
  eval: '!' | '!?' | '!!';
  links: { code?: string; demo?: string; video?: string };
  cover?: ImageMetadata;
  featured: boolean;
  draft: boolean; // true only in dev
  move?: { from: string; to: string; notation: string }; // notation of the page language
  // prose of the page language, or French on an English page when `untranslated`
  title: string;
  summary: string;
  keyMove: string;
  coverAlt?: string;
  untranslated: boolean; // no English file, in both languages
  entry: CollectionEntry<'projects'> | CollectionEntry<'projectsEn'>; // body to render
}

getProjects(locale): Promise<Project[]>      // filtered, merged, sorted
featuredProjects(locale): Promise<Project[]> // same order, featured only
projectPaths(locale)                         // getStaticPaths result: params.slug, props.project
```

- Order: `year` descending, then French title (`localeCompare('fr')`), in both languages.
- `untranslated` has the same value in both languages: the French page uses it to drop its
  `hreflang` pair, the English page to show the fallback.

## States of a project

| State                 | Production                                       | Dev                      |
| --------------------- | ------------------------------------------------ | ------------------------ |
| draft                 | no page, no row, not in sitemap                  | listed, page, draft mark |
| published, no EN file | FR page indexable; EN page = fallback, `noindex` | same                     |
| published, EN file    | both pages indexable, linked by `hreflang`       | same                     |
| published + featured  | also a row on `/` and `/en/`                     | same                     |

Removing a project: delete the file(s) and add a redirect to `/projects/` in
`astro.config.mjs` (principle IX), outside this feature.

## Dictionary additions — `src/i18n/ui.ts`

| Key                                         | fr                                         | en                                          |
| ------------------------------------------- | ------------------------------------------ | ------------------------------------------- |
| `projects.title`                            | Projets                                    | Projects                                    |
| `projects.description`                      | written at implementation, `CONTENU.md` §9 | rewritten, not translated                   |
| `projects.empty`                            | Aucun projet publié pour l’instant.        | No project published yet.                   |
| `projects.featured`                         | Parties choisies                           | Selected games                              |
| `projects.keyMove`                          | Coup clé :                                 | Key move:                                   |
| `projects.back`                             | Tous les projets                           | All projects                                |
| `projects.year` / `.tech` / `.links`        | Année / Technologies / Liens               | Year / Technologies / Links                 |
| `projects.link.code` / `.demo` / `.video`   | Code / Démo / Vidéo                        | Code / Demo / Video                         |
| `projects.legend`                           | Légende des symboles                       | Symbol legend                               |
| `eval.good` / `eval.bet` / `eval.brilliant` | bon coup / pari réfléchi / coup brillant   | good move / calculated bet / brilliant move |
| `projects.frenchOnly`                       | En français uniquement                     | French only                                 |
| `projects.frenchOnlyNotice`                 | Disponible en français uniquement.         | This project is available in French only.   |
| `projects.draft`                            | Brouillon                                  | Draft                                       |

French typography: a narrow no-break space (U+202F) before « : » (`DESIGN.md`, Do's).

## Tokens — `src/styles/global.css` (R8)

| Token                         | Light     | Dark      |
| ----------------------------- | --------- | --------- |
| `--color-invert-bg`           | `ink`     | `ink`     |
| `--color-invert-ink`          | `paper`   | `paper`   |
| `--color-mark-on-invert`      | `#ff5a6a` | `#c8102e` |
| `--color-brilliant`           | `#0077b6` | `#5cc8ff` |
| `--color-brilliant-on-invert` | `#5cc8ff` | `#0077b6` |

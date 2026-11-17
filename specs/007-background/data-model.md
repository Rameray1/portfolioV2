# Data Model: Parcours

Phase 1 of [plan.md](./plan.md). « build » means `npm run build`; every rule below fails it
unless stated otherwise.

## Files

| Collection   | File                       | Type shown on the page          |
| ------------ | -------------------------- | ------------------------------- |
| `experience` | `src/data/experience.yaml` | « Expérience » / « Experience » |
| `education`  | `src/data/education.yaml`  | « Formation » / « Education »   |

Each file is a YAML map: key = entry id, value = entry (R2). Both collections use the same
strict schema (R1): an unknown key fails.

## Entry — `timelineEntry`

| Field        | Type                           | Required  | Rule                                           |
| ------------ | ------------------------------ | --------- | ---------------------------------------------- |
| (key)        | string                         | yes       | id, English kebab-case, unique in its file     |
| `start`      | string `YYYY-MM`               | yes       | month `01` – `12`                              |
| `end`        | string `YYYY-MM`               | no        | absent = ongoing; not before `start`           |
| `title`      | `{ fr: string; en: string }`   | yes       | both non-empty                                 |
| `place`      | string                         | yes       | non-empty; organisation and city, written once |
| `detail`     | `{ fr: string; en: string }`   | yes       | both non-empty                                 |
| `tech`       | string[]                       | no (`[]`) | each non-empty; order kept                     |
| `highlights` | `{ fr: string; en: string }[]` | no (`[]`) | both sides non-empty for each item; order kept |

Notes:

- No `kind`, no order, no stored period, no draft flag (FR-018, Assumptions).
- `tech` and `highlights` are accepted in `education.yaml` too (same shape).
- A date with a day (`2024-09-01`) is parsed by YAML as a date and fails the string schema
  (R4).
- Prose never contains a date, a year or a duration (FR-012): a review rule, not a build
  rule.
- `detail` is the main mission in one sentence; `highlights` are the rest of the role and
  never retell a project published in `/projects` (FR-028, R16). Review rules too.

Shape of one entry (values are placeholders, not content):

```yaml
some-company-apprenticeship:
  start: 2024-09
  title:
    fr: …
    en: …
  place: …
  detail:
    fr: …
    en: …
  tech: [TypeScript, PostgreSQL]
  highlights:
    - fr: …
      en: …
```

## File-level rule — `strictFile` in `src/content.config.ts` (R3)

Any error logged by Astro's `file()` loader is thrown: a missing file or a YAML syntax error
fails the build, with or without a content cache.

## Cross-entry rule — `src/lib/background.ts` (R3)

1. `experience` has at least one entry, and so does `education`. The error names the file
   concerned.

## Merged view — `BackgroundEntry` (R6)

```ts
interface BackgroundEntry {
  id: string;
  kind: 'experience' | 'education';
  start: string; // YYYY-MM
  end?: string; // YYYY-MM
  title: string;
  place: string;
  detail: string;
  tech: string[];
  highlights: string[];
}
```

`getBackground(locale)` returns the entries of both collections with prose in `locale`,
sorted by (R7): `start` descending, ongoing first, `end` descending, French title, id.

## Period (derived, never stored)

| Case                | French                      | English               |
| ------------------- | --------------------------- | --------------------- |
| finished            | `sept. 2022 – août 2024`    | `Sep 2022 – Aug 2024` |
| ongoing (no `end`)  | `sept. 2024 – aujourd'hui`  | `Sep 2024 – present`  |
| same month          | `juin 2023`                 | `Jun 2023`            |
| `end` in the future | the `end` month, as written | same                  |

The space before the dash is non-breaking; the space after it is where the period breaks
on mobile. See
[contracts/background.md](./contracts/background.md) for the markup.

## Dictionary keys — `src/i18n/ui.ts` (R11)

| Key                      | Use                                                                 |
| ------------------------ | ------------------------------------------------------------------- |
| `background.title`       | `<h1>` and `<title>`                                                |
| `background.description` | meta description                                                    |
| `background.experience`  | type label                                                          |
| `background.education`   | type label                                                          |
| `background.present`     | end of an ongoing period                                            |
| `background.col.period`  | header row — « Période » / « Period »                               |
| `background.col.title`   | header row — « Intitulé » / « Title »                               |
| `background.col.place`   | header row — « Lieu » / « Place »                                   |
| `background.highlights`  | name of the achievements list — « Réalisations » / « Achievements » |

Reused: `projects.tech` (name of the technologies list), `nav.background`.

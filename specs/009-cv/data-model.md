# Data Model: CV en ligne et PDF

The CV owns no data. It is a view model built at build time from existing sources, plus two
new values: the languages and the city.

## New data

### `languages` collection (`src/data/languages.yaml`)

A YAML map, key = English id. `file()` does not keep the file order, so `rank` sets it.

| Field   | Type         | Rule                     |
| ------- | ------------ | ------------------------ |
| `rank`  | integer ≥ 1  | display order, required  |
| `name`  | `{ fr, en }` | both non-empty, required |
| `level` | `{ fr, en }` | both non-empty, required |

```yaml
french:
  rank: 1
  name: { fr: Français, en: French }
  level: { fr: langue maternelle, en: native }
```

Failure: a missing or empty field, an unknown field, an empty or missing file fail the build
and name the entry (`strictFile`, strict schema). `getCv` throws on an empty collection.

### `site.contact.city` (`src/data/site.ts`)

`city: string`, e.g. `'Alès, France'`. Typed by `Contact`. Shown by the PDF only.

## Changed data

`campaign.actions` = `[{ label: Voir le CV / View my CV, href: { fr: '/cv', en: '/en/cv' } },
{ label: M'écrire / Email me, href: mailto }]` (R12).

`campaign.availability.place` adds « Été 2027 » and « citoyen de l'UE » (from the maintainer's
LaTeX CV). Its text is built once by `getAvailability(locale)` in `src/lib/availability.ts`,
read by the `Availability` component and by `getCv`.

## View model (`src/lib/cv.ts`)

```ts
interface Cv {
  locale: Locale;
  name: string; // site.name
  title: string; // site.person.jobTitle[locale]
  email: string;
  city: string;
  links: {
    kind: 'website' | 'linkedin' | 'github';
    href: string;
    label: string;
  }[]; // label: short URL; the PDF shows them in this order, the page drops `website`
  profile: { pitch: string; availability?: Availability }; // getAvailability(locale)
  experience: CvEntry[]; // getBackground, kind === 'experience'
  education: CvEntry[]; // getBackground, kind === 'education'
  projects: CvProject[]; // featuredProjects(locale)
  skills: { domain: string; names: string[] }[]; // getSkills, domain label from dictionary
  languages: { name: string; level: string }[];
  pdf: { href: string; filename: string }; // /cv-fr.pdf, Ramazan-Kus-CV.pdf
}

interface CvEntry {
  title: string;
  place: string;
  from: string; // formatMonth(start)
  to: string; // formatMonth(end) | background.present
  current: boolean; // no end: the page marks « aujourd'hui » with the red square
  detail: string;
  highlights: string[];
}

type CvProject = Project & { url: string }; // the page renders it with ProjectList; url is absolute for the PDF
```

Rules carried by `getCv`:

- Order: experience and education as `getBackground` (most recent first); projects as
  `getProjects` (year desc); skills as `getSkills` (domain order, level desc, then name).
- A rubric with no entry is an empty array; both renderers skip it.
- `availability` is absent when `campaign.availability.visible` is false.
- No phone field exists anywhere in the model.

## Dictionary keys (`src/i18n/ui.ts`)

| Key              | FR                       | EN                       |
| ---------------- | ------------------------ | ------------------------ |
| `cv.title`       | CV                       | CV                       |
| `cv.description` | (unique description, FR) | (unique description, EN) |
| `cv.profile`     | Profil                   | Profile                  |
| `cv.projects`    | Projets                  | Projects                 |
| `cv.skills`      | Compétences              | Skills                   |
| `cv.languages`   | Langues                  | Languages                |
| `cv.download`    | Télécharger le CV en PDF | Download the CV as PDF   |
| `cv.contact`     | Coordonnées              | Contact                  |
| `cv.portfolio`   | Portfolio                | Portfolio                |
| `cv.email`       | Email                    | Email                    |
| `cv.linkedin`    | LinkedIn                 | LinkedIn                 |
| `cv.github`      | GitHub                   | GitHub                   |

Reused: `background.experience`, `background.education`, `background.present`,
`skills.domain.*`, `nav.cv`. PDF metadata title: `${name} – CV` (`cv.title`).

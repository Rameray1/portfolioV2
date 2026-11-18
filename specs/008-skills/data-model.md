# Data Model: Compétences

## Skill (collection `skills`, `src/data/skills.yaml`)

A YAML map; the key is the entry id (kebab-case, English).

| Field      | Type                                           | Rule                                                            |
| ---------- | ---------------------------------------------- | --------------------------------------------------------------- |
| `name`     | `string` or `{ fr: string, en: string }`       | required, trimmed, non-empty; unique on the French form (R3)    |
| `domain`   | `'frontend' \| 'backend' \| 'data' \| 'tools'` | required (R4)                                                   |
| `level`    | `'basics' \| 'proficient' \| 'advanced'`       | required (R4)                                                   |
| `projects` | `reference('projects')[]`                      | at least one; no duplicate; each exists and is not a draft (R2) |

Strict object: an unknown field fails the build.

```yaml
typescript:
  name: TypeScript
  domain: frontend
  level: proficient
  projects: [meetz, shipment-preparation]

automated-testing:
  name:
    fr: Tests automatisés
    en: Automated testing
  domain: tools
  level: proficient
  projects: [shipment-preparation]
```

### Checks and where they run

| Check                                     | Where                                                       |
| ----------------------------------------- | ----------------------------------------------------------- |
| missing field, unknown field, wrong type  | schema (zod)                                                |
| unknown `domain` or `level`               | schema (zod enum)                                           |
| `projects` empty                          | schema (`.min(1)`)                                          |
| file missing or unreadable                | `strictFile`                                                |
| duplicate id                              | YAML parser (« Map keys must be unique »), via `strictFile` |
| file without entry                        | `getSkills` (throw)                                         |
| same French name twice (case-insensitive) | `getSkills` (throw)                                         |
| same project cited twice in one skill     | `getSkills` (throw)                                         |
| cited project missing or `draft: true`    | `getSkills` (throw)                                         |

Every message names the file and the skill id; a proof error also names the project slug.

## Ordered lists (code, `src/lib/skill-scale.ts`)

- `DOMAINS = ['frontend', 'backend', 'data', 'tools']`: display order.
- `LEVELS = ['basics', 'proficient', 'advanced']`: rank, low to high. Pieces: pawn, knight, queen.

Both arrays feed the zod enums, so the enum and the order are one value.

## View model (`getSkills(locale)`)

```ts
interface SkillDomain {
  domain: Domain; // label via t(`skills.domain.${domain}`)
  skills: Skill[]; // level desc, then French name, then id
}

interface Skill {
  id: string;
  name: string; // resolved to the locale
  level: Level;
  proofs: { slug: string; title: string }[]; // order of getProjects(locale)
}
```

Domains without skill are not returned. The CV (F09) calls the same function.

## Dictionary keys (`src/i18n/ui.ts`)

| Key                                  | FR                                                     | EN                                            |
| ------------------------------------ | ------------------------------------------------------ | --------------------------------------------- |
| `skills.title`                       | Compétences                                            | Skills                                        |
| `skills.description`                 | _(meta description, written at implementation)_        | _(idem)_                                      |
| `skills.intro`                       | _(one sentence: each skill links to its proof)_        | _(idem)_                                      |
| `skills.legend`                      | Niveaux                                                | Levels                                        |
| `skills.domain.frontend`             | Front-end                                              | Front-end                                     |
| `skills.domain.backend`              | Back-end                                               | Back-end                                      |
| `skills.domain.data`                 | Données                                                | Data                                          |
| `skills.domain.tools`                | Outils et méthodes                                     | Tools and methods                             |
| `skills.level.basics`                | Notions                                                | Basics                                        |
| `skills.level.proficient`            | Autonome                                               | Proficient                                    |
| `skills.level.advanced`              | Avancé                                                 | Advanced                                      |
| `skills.level.basics.definition`     | j’en ai les bases, sans pratique régulière             | I know the basics, without regular practice   |
| `skills.level.proficient.definition` | je livre avec, en cherchant au besoin                  | I ship with it, looking things up when needed |
| `skills.level.advanced.definition`   | je le pratique au quotidien et j’en connais les pièges | I use it daily and know its pitfalls          |
| `skills.col.level`                   | Niveau                                                 | Level                                         |
| `skills.proofs`                      | Preuves                                                | Proof                                         |

`nav.skills` already exists. Final wording follows `CONTENU.md` §9 and is reviewed at
implementation.

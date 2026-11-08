# Data Model: Socle visuel et gabarit commun

No content collection in this feature: two typed TypeScript modules, the layout props, and the
design tokens.

## NavItem — `src/data/nav.ts`

| Field   | Type               | Rule                                                        |
| ------- | ------------------ | ----------------------------------------------------------- |
| `label` | `string`           | Visible French label (moved to the i18n dictionary in F03). |
| `href`  | `` `/${string}` `` | Root-relative path; must start with `/`.                    |

- Export: `export const nav = [ … ] as const satisfies readonly NavItem[]`.
- Order of the array = display order. Adding a rubrique = one line (FR-009, SC-004).
- Missing field or `href` without leading `/` → `astro check` fails.
- Initial content (FR-011), pages not yet built are accepted dead links:

| label       | href          | Delivered by |
| ----------- | ------------- | ------------ |
| À propos    | `/about`      | F05          |
| Projets     | `/projects/`  | F06          |
| Parcours    | `/background` | F07          |
| Compétences | `/skills`     | F08          |
| CV          | `/cv`         | F09          |
| Blog        | `/blog/`      | F10          |

(Per `ROADMAP.md`.)

### Derived state: current item

Computed at build time in `Navigation.astro` from `Astro.url.pathname` (research R7):

| Condition (trailing slashes stripped) | `aria-current` |
| ------------------------------------- | -------------- |
| `pathname === href`                   | `"page"`       |
| `pathname.startsWith(href + '/')`     | `"true"`       |
| otherwise                             | absent         |

## Site — `src/data/site.ts`

| Field              | Type     | Value (confirmed 2026-11-08, research R11) |
| ------------------ | -------- | ------------------------------------------ |
| `name`             | `string` | `Ramazan Kus`                              |
| `contact.email`    | `string` | `rkus.contact@gmail.com`                   |
| `contact.github`   | `string` | `https://github.com/Rameray1`              |
| `contact.linkedin` | `string` | `https://www.linkedin.com/in/ramazan-kus/` |

- Typed with an interface that has **no phone field** (FR-019); `satisfies` keeps literals.
- Single source for the header name, the title suffix and the footer; reused by F04 and F05.

## Page metadata — `BaseLayout` props

| Prop          | Type     | Required | Use                                         |
| ------------- | -------- | -------- | ------------------------------------------- |
| `title`       | `string` | yes      | `<title>` (with `· {site.name}` suffix, R8) |
| `description` | `string` | yes      | `<meta name="description">`                 |

Omitting either fails `astro check` (FR-002). Uniqueness across pages is checked in F12.

## Design token

Name + value, colors with one value per theme. Full list and rules:
[contracts/tokens.md](./contracts/tokens.md).

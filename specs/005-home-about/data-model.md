# Data Model: Accueil et À propos

Phase 1 of [plan.md](./plan.md). Types are TypeScript; « check » means `npm run check`,
« build » means `npm run build`.

## Campaign — `src/data/campaign.ts`

One module, levers 1, 2, 4 and 5 of `CONTENU.md` §7 (R1, R10).

```ts
type Localized = Record<Locale, string>;

interface Action {
  label: Localized;
  href: string | Localized; // per-locale when the target differs (future CV)
}

interface Availability {
  visible: boolean;
  status: Localized; // « Disponible pour un stage »
  start: `${number}-${number}` | `${number}-${number}-${number}`; // YYYY-MM or YYYY-MM-DD
  place: Localized; // « en France et en Europe »
}

interface Campaign {
  pitch: Localized;
  availability: Availability;
  actions: readonly [Action, Action];
}
```

| Field                  | Source / value in F05                                               | Validation                                               |
| ---------------------- | ------------------------------------------------------------------- | -------------------------------------------------------- |
| `pitch`                | `CONTENU.md` §3, FR and EN, final                                   | both locales required (check)                            |
| `availability.visible` | `true`                                                              | boolean (check)                                          |
| `availability.status`  | provisional, « [provisoire] » / « [draft] »                         | both locales (check)                                     |
| `availability.start`   | provisional month, e.g. `'2027-04'`                                 | shape (check); real calendar date or build throws (R2)   |
| `availability.place`   | provisional, marked                                                 | both locales (check)                                     |
| `actions[0]`           | label « M'écrire » / « Email me », `mailto:` + `site.contact.email` | exactly 2 actions, label in both locales (check)         |
| `actions[1]`           | label « LinkedIn », `site.contact.linkedin`                         | idem; later `{ fr: '/cv/…-fr.pdf', en: '/cv/…-en.pdf' }` |

Relations: `actions[*].href` references `site.contact` (never a copied address). `pitch`
feeds the home `description` (F04 `Seo`). The featured-projects lever is not here (R10).

State: `availability.visible: true → false` hides the home caption and the About section;
nothing else changes.

## Diagram position — `src/data/diagram.ts`

```ts
interface DiagramPosition {
  fen: string; // piece placement field only, rank 8 → 1
  alt: Localized; // description of the position, provisional
}
```

`parseFen(fen)` → `{ piece: 'wK' | … | 'bP'; file: 1..8; rank: 1..8 }[]`. Throws (build
fails) unless there are 8 ranks of 8 squares and only `pnbrqkPNBRQK1-8`. F05 value: the
prototype's Italian Game (R6), replaced in C2b.

## About page — collection `pages` (`src/content.config.ts`)

| File                            | id         |
| ------------------------------- | ---------- |
| `src/content/pages/fr/about.md` | `fr/about` |
| `src/content/pages/en/about.md` | `en/about` |

Frontmatter schema (zod): `title: string().min(1)`, `description: string().min(1)`,
`photoAlt: string().min(1)`. Body: the narrative in Markdown (three paragraphs by writing
rule, not validated). Missing file → `AboutView` throws → build fails. Invalid frontmatter →
build fails.

## Photo — `src/assets/about/portrait.jpg`

One file for both locales: 640 × 800 (4:5), JPEG q80, no metadata, derived once from
`../pp.jpg` (R5). Alt text per locale comes from `photoAlt`. Served as AVIF + WebP at 320
and 640 px wide, each < 50 kB.

## Pieces — `src/assets/pieces/{w,b}{K,Q,R,B,N,P}.svg`

12 cburnett SVGs (45 × 45 viewBox) + `LICENSE.md`. Name = colour + piece letter, matching
`parseFen` output.

## Dictionary keys — `src/i18n/ui.ts`

| Key                  | FR                | EN                   |
| -------------------- | ----------------- | -------------------- |
| `availability.label` | Disponibilité     | Availability         |
| `availability.from`  | Dès               | From                 |
| `about.seeking`      | Ce que je cherche | What I’m looking for |
| `action.pdf`         | (PDF)             | (PDF)                |

Wording approved at implementation (principle VI). `availability.label` names the home
aside; `action.pdf` is the hidden suffix of a PDF action.

## Design tokens — `src/styles/global.css`

`--color-square-light` (`#ffffff` / dark `#e6e3dc`), `--color-square-dark` (`#c9c6be` /
`#b3afa5`), `--color-board-edge` (= ink in both themes), values from `DESIGN.md`.

# Quickstart: Compétences

Prerequisites: branch `008-skills`, `npm install` done.

```sh
npm run check && npm run build
astro dev --background
```

## 1 · Page and domains (US1)

- Open `/skills` and `/en/skills`: one `<h1>`, the levels legend, then one `<h2>` per
  domain in the order Front-end, Back-end, Données / Data, Outils et méthodes / Tools and
  methods.
- Each skill shows its name and level word with its piece. From `56rem`, each domain title
  carries the « Niveau » / « Preuves » column labels above its table.
- In a domain, the higher level comes first, then the alphabetical order; same order on
  both pages.
- Language switcher goes from one page to the other; `dist/sitemap-*.xml` lists both;
  head has its own title, description and `hreflang` alternates.

## 2 · Proofs (US2)

- Every skill has at least one link; link text is the project title.
- From `/en/skills`, links go to `/en/projects/<slug>/` (French prose for an untranslated
  project).
- Every proof `href` in `dist/skills/index.html` and `dist/en/skills/index.html` matches a
  built page in `dist/` (the repo has no link checker yet; a one-off shell loop is enough):
  0 dead link.

## 3 · Mobile and themes (US3)

- Captures at 375 px (inside a 375 px `<iframe>`, headless Chrome minimum width) and
  1280 px, light and dark, header and footer included.
- No horizontal scroll; a long name or many proofs wrap without overlapping the level.
- Grayscale view: each level still readable by its word.
- Scroll a domain at 375 px: its title stays at the top until the next domain replaces it.
- With a pointer at 1280 px, hover a row: it stays in ink, its piece steps up, the other rows
  go muted; under reduced motion the piece does not move.

## 4 · Failure contract (US4)

On a scratch change of `src/data/skills.yaml`, `npm run build` must fail, naming the
file, the skill and (for proofs) the slug, for each case:

| Change                                          | Expected                           |
| ----------------------------------------------- | ---------------------------------- |
| `projects: []`                                  | fails, « au moins un projet »      |
| `projects: [does-not-exist]`                    | fails, names `does-not-exist`      |
| cite a project, then set it `draft: true`       | fails, names the draft             |
| `projects: [meetz, meetz]`                      | fails, duplicate                   |
| `level: expert` / `domain: design`              | fails, enum                        |
| remove `name`, or add `color: red`              | fails, field                       |
| two skills with `name: TypeScript`/`typescript` | fails, duplicate name              |
| the same key (`typescript:`) twice              | fails, « Map keys must be unique » |
| empty file (`{}`), or file deleted              | fails, names the file              |

Restore the file; adding a valid skill shows it in its domain on both pages with no other
file changed.

## 5 · Quality (end of feature)

- `/impeccable audit` then `/impeccable polish`.
- Lighthouse mobile on `/skills` and `/en/skills`: ≥ 95 / 100 / 100 / 100; 0 kB JS.
- axe: 0 violation; VoiceOver: headings navigate by domain and skill, the level is read in
  words, the pieces are silent.

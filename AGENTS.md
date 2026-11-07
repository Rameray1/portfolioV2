## Ground rules

- **KISS / YAGNI first.** Build only what the current task needs: no extra feature, option,
  abstraction or dependency "just in case". Prefer native HTML/CSS, then Astro built-ins, then
  a dependency (justified). Future ideas go to the reserve at the end of `ROADMAP.md`.
- **100 % static site**, zero client JavaScript by default (constitution, principles I–II).

## Project documents

Read the relevant ones before working on a task:

- `CONTENU.md` — content framing: goals, audiences, URLs, content model, writing rules (§9).
  Reference for every spec and every published text.
- `ROADMAP.md` — build order and the speckit inputs for each feature (`F01` → `F12`).
- `DESIGN.md` — visual direction: palette, fonts, type scale, spacing, states. *(Created in
  step 0; until then, ask before making visual choices.)*
- `.specify/memory/constitution.md` — non-negotiable principles, checked by every
  `/speckit-plan`. It overrides any other convention in this repo.

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Before committing

- `npm run check && npm run build` must pass. (`npm run check` is added by F01; until then,
  `npm run build` only.)
- Conventional commits only: `feat`, `fix`, `content`, `chore`, `docs`, `perf`, `a11y`, `ci`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## Skills

- Toute tâche qui crée ou modifie de l'UI (composant, page, style, animation) : charger le
  skill `impeccable` avant de coder, et respecter `DESIGN.md` et les jetons de
  `src/styles/global.css`.
- C'est valable aussi pendant `/speckit-implement`, même si la tâche de `tasks.md` ne
  mentionne pas le skill.
- Fin de chaque feature visuelle : `/impeccable audit`, puis `/impeccable polish`, avant de
  considérer la feature terminée (constitution, principe IX).
- Un seul skill de design actif : ne pas utiliser `frontend-design` ni un autre skill
  d'esthétique en parallèle d'`impeccable`.

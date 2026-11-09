# Data model: Site bilingue

No collection; typed TypeScript modules checked by `astro check`.

## Locale

```ts
// src/i18n/ui.ts
export const locales = ['fr', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'fr';
```

- Must match `i18n.locales` / `i18n.defaultLocale` in `astro.config.mjs` (the config cannot
  import TS from `src/`; the duplication is two short literals, commented in both places).
- Prefix: none for `fr`, `/en` for `en`.

## Dictionary (`src/i18n/ui.ts`)

`fr` is the reference; `en: Record<UiKey, string>` must have exactly the same keys (R2).

| Key                | fr                    | en              |
| ------------------ | --------------------- | --------------- |
| `skipLink`         | Aller au contenu      | Skip to content |
| `nav.label`        | Navigation principale | Main navigation |
| `nav.about`        | À propos              | About           |
| `nav.projects`     | Projets               | Projects        |
| `nav.background`   | Parcours              | Background      |
| `nav.skills`       | Compétences           | Skills          |
| `nav.cv`           | CV                    | CV              |
| `nav.blog`         | Blog                  | Blog            |
| `nav.frenchMark`   | (FR)                  | (FR)            |
| `nav.inFrench`     | en français           | in French       |
| `footer.email`     | Email                 | Email           |
| `footer.github`    | GitHub                | GitHub          |
| `footer.linkedin`  | LinkedIn              | LinkedIn        |
| `langSwitch.short` | EN                    | FR              |
| `langSwitch.label` | English               | Français        |

- `langSwitch.*` describe the **other** language (the target), so their values are written in
  that language.
- `nav.frenchMark` and `nav.inFrench` are only rendered on non-French pages; the French values
  exist because both locales must share the same keys.
- French values reproduce F02 exactly (FR-007).

## Nav entry (`src/data/nav.ts`, changed)

| Field        | Type                                | Rule                                                                               |
| ------------ | ----------------------------------- | ---------------------------------------------------------------------------------- |
| `key`        | ``Extract<UiKey, `nav.${string}`>`` | replaces F02's `label`; label = `t(key)`                                           |
| `href`       | `` `/${string}` ``                  | French path, unprefixed; localized at render (R4)                                  |
| `frenchOnly` | `true` (optional)                   | entry exists only in French: href never localized, (FR) mark on other locales (R7) |

Order and paths unchanged from F02; only `blog` has `frenchOnly: true`.

## Page route

Derived, not stored: the set of static routes from `src/pages/**/*.astro` (R5). A page is
"translated" when `localizePath(path, other)` is in that set.

## Home prose (`src/views/HomeView.astro`)

`pitch: Record<Locale, string>`, local to the view until F05 (R8, R9).

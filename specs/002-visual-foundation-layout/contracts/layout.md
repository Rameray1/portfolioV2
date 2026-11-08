# Contract: page layout (`src/layouts/BaseLayout.astro`)

## Usage by a page

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="Projets" description="…">
  <h1>…</h1>
</BaseLayout>
```

- Props: `title: string`, `description: string`, both required (data-model).
- The default slot is the page content, rendered inside `<main>`.
- Pages never import `Header`, `Navigation` or `Footer` (FR-001).

## Rendered skeleton

```text
<!doctype html>
<html lang="fr">
<head>
  meta charset, meta viewport (width=device-width, initial-scale=1)
  meta name="color-scheme" content="light dark"
  title            → "{title} · Ramazan Kus" (or "Ramazan Kus" on home)
  meta description → {description}
  link rel=preload as=font type=font/woff2 crossorigin → hashed Archivo
  existing favicon links (/favicon.svg, /favicon.ico) kept until F04
  global.css (bundled by Astro, render-blocking)
</head>
<body>
  a.skip-link href="#content"            ← first focusable element (FR-014)
  <header>                               ← Header.astro, heavy rule below
    a href="/" (site.name)               ← FR-013
    <nav aria-label="Navigation principale">   ← Navigation.astro
      <ul> <li><a href aria-current?>label</a></li> × nav.length </ul>
    </nav>
  </header>
  <main id="content" tabindex="-1"> <slot /> </main>
  <footer>                               ← Footer.astro, heavy rule above
    <ul> Email (mailto:) · GitHub · LinkedIn </ul>
  </footer>
</body>
</html>
```

No `<script>` anywhere (principle II).

## Behaviour

| Element    | Rule                                                                                                                                                                       |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Skip link  | Off-screen until `:focus`; then visible at the top-left, `paper` on `ink`. Activation moves focus to `<main>`.                                                             |
| Header     | Flex row, `wrap`, baseline-aligned: name left (`--weight-bold`, `--text-base`), nav right; under ~2 lines width, nav wraps below the name.                                 |
| Nav links  | `--text-sm`, no underline at rest; hover: 2 px underline; `[aria-current]`: `--color-mark`, `--weight-semibold`, 2 px underline, offset `--underline-offset-current` (R7). |
| Nav list   | Wraps; gap `--space-1` / `--space-5`; link `padding-block: --space-1` (≥ 24 px target, R5). No popover, no `<details>`.                                                    |
| Footer     | Three links, labels « Email », « GitHub », « LinkedIn »; values from `site.contact`; same tab. No phone, ever (FR-019).                                                    |
| Containers | Header, main and footer each center their content with `max-width: var(--page-max)` and `padding-inline: var(--gutter)` in scoped styles.                                  |
| Motion     | None in F02; any later transition uses `--duration` (0 under reduced motion).                                                                                              |

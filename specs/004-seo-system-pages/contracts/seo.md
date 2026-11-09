# Contract: SEO et pages système

What each file exposes and the exact output expected. Prose of the 404 and `jobTitle` values
are approved at implementation.

## `astro.config.mjs`

```text
site: 'https://ramazankus.example'                       // replaced at go-live
env.schema.PUBLIC_NOINDEX: envField.boolean({ context: 'client', access: 'public', default: false })
integrations: [sitemap({
  i18n: { defaultLocale: 'fr', locales: { fr: 'fr', en: 'en' } },
  filter: (page) => !isNoindexPath(new URL(page).pathname),
})]
i18n: unchanged (F03)
```

## `src/data/seo.ts`

```ts
export const noindexPaths: readonly `/${string}`[];
export function isNoindexPath(pathname: string): boolean;
```

No `astro:*` import (the config imports it).

## `src/i18n/utils.ts` (changed)

```ts
export function isStatusPage(pathname: string): boolean; // '/404', '/en/404', with or without '/'
export function alternatePath(
  pathname: string,
  locale: Locale,
): `/${string}` | undefined;
export function switchPath(pathname: string, locale: Locale): `/${string}`; // = alternatePath ?? other home
```

`routes` excludes status pages. Existing behaviour of `switchPath` is unchanged elsewhere.

## `src/components/Seo.astro`

Props: ``{ title: string; description: string; image?: { src: `/${string}`; alt: string } }``.

Output in `<head>`, in this order, for an indexable page `/x/` that exists in both locales,
rendered in French:

```html
<title>X · Ramazan Kus</title>
<!-- just the name when title === site.name -->
<meta name="description" content="…" />
<link rel="canonical" href="https://<site>/x/" />
<link rel="alternate" hreflang="fr" href="https://<site>/x/" />
<link rel="alternate" hreflang="en" href="https://<site>/en/x/" />
<link rel="alternate" hreflang="x-default" href="https://<site>/x/" />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="Ramazan Kus" />
<meta property="og:title" content="X · Ramazan Kus" />
<meta property="og:description" content="…" />
<meta property="og:url" content="https://<site>/x/" />
<meta property="og:locale" content="fr_FR" />
<meta property="og:locale:alternate" content="en_US" />
<meta property="og:image" content="https://<site>/og/default-fr.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="…" />
<meta name="twitter:card" content="summary_large_image" />
```

Variations:

| Case                    | Difference                                                           |
| ----------------------- | -------------------------------------------------------------------- |
| page in one locale only | no `hreflang` links, no `og:locale:alternate`                        |
| `PUBLIC_NOINDEX=true`   | `+ <meta name="robots" content="noindex, nofollow">`; rest unchanged |
| path in `noindexPaths`  | `+ <meta name="robots" content="noindex">`                           |
| status page (404)       | `+ robots noindex`; no canonical, no `hreflang`, no `og:url`         |
| `image` prop given      | `og:image` / `og:image:alt` from the prop                            |

When both apply, `noindex, nofollow` wins (one `robots` tag only).

## `src/layouts/BaseLayout.astro` (changed)

Props: `title`, `description`, `image?` → forwarded to `<Seo />`. Its own `<title>` and
description lines are removed. Icons: `favicon.ico` (`sizes="32x32"`) then `favicon.svg`.
New `<slot name="head" />` at the end of `<head>`.

## `src/components/PersonSchema.astro`

No props. Rendered by `HomeView` with `slot="head"`. Output (French home):

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Ramazan Kus",
  "url": "https://<site>/",
  "jobTitle": "…",
  "affiliation": { "@type": "CollegeOrUniversity", "name": "IMT Mines Alès" },
  "worksFor": { "@type": "Organization", "name": "Astrée Software" },
  "sameAs": [
    "https://github.com/Rameray1",
    "https://www.linkedin.com/in/ramazan-kus/"
  ]
}
```

English home: `url` = `https://<site>/en/`, `jobTitle` in English.

## `src/pages/robots.txt.ts`

`GET` → `200 text/plain; charset=utf-8`.

```text
# PUBLIC_NOINDEX=false              # PUBLIC_NOINDEX=true
User-agent: *                       User-agent: *
Allow: /                            Disallow: /

Sitemap: https://<site>/sitemap-index.xml
```

## 404 pages

`src/pages/404.astro`, `src/pages/en/404.astro`: shells rendering `<NotFoundView />`.
`NotFoundView` uses `BaseLayout` with `title = t('notFound.title')`,
`description = t('notFound.description')`; body: `<h1>`, one sentence, a list of 3 links
(home, projects, email `mailto:`) in the page locale. Header switcher → other home.

# Data Model: SEO et pages système

No content collection. Typed modules and one environment variable.

## Site address (`astro.config.mjs` → `site`)

| Field  | Type         | Rule                                                                             |
| ------ | ------------ | -------------------------------------------------------------------------------- |
| `site` | absolute URL | One value. Placeholder `https://ramazankus.example` until go-live (research R2). |

Every canonical, alternate, `og:url`, `og:image`, sitemap entry and the robots `Sitemap:` line
is built from it.

## Global switch (`PUBLIC_NOINDEX`, `astro:env`)

| Value             | Pages                            | robots.txt                        |
| ----------------- | -------------------------------- | --------------------------------- |
| `false` (default) | indexable unless R4/R7 rule      | `Allow: /` + `Sitemap:` line      |
| `true`            | 100 % `noindex, nofollow`        | `Disallow: /`, no `Sitemap:` line |
| anything else     | build fails (`envField.boolean`) | build fails                       |

Set on the host: `true` from go-live until C3, then removed.

## Page presentation (props of `BaseLayout` → `Seo`)

| Field         | Type                                   | Required | Rule                                                       |
| ------------- | -------------------------------------- | -------- | ---------------------------------------------------------- |
| `title`       | `string`                               | yes      | Missing → `astro check` fails (FR-002). Unique per locale. |
| `description` | `string`                               | yes      | Missing → `astro check` fails (FR-002). Unique per locale. |
| `image`       | ``{ src: `/${string}`; alt: string }`` | no       | Public path to a 1200 × 630 image. Default: per locale.    |

Derived (never passed):

| Derived    | Source                                                     |
| ---------- | ---------------------------------------------------------- |
| locale     | `Astro.currentLocale` (F03)                                |
| canonical  | `site` + pathname with trailing slash; absent on 404       |
| alternates | `alternatePath()` over the generated routes; absent on 404 |
| noindex    | `PUBLIC_NOINDEX` ∨ `isNoindexPath` ∨ status page           |
| image alt  | `image.alt`, else `t('seo.ogImageAlt')`                    |

## Non-indexable paths (`src/data/seo.ts`)

| Export          | Type                            | Rule                                                                             |
| --------------- | ------------------------------- | -------------------------------------------------------------------------------- |
| `noindexPaths`  | ``readonly `/${string}`[]``     | Bare paths (no `/en`), with trailing slash; apply to both locales. Starts empty. |
| `isNoindexPath` | `(pathname: string) => boolean` | Strips `/en`, normalises the trailing slash, looks up the list.                  |

Read by `Seo.astro` and by the sitemap `filter` in `astro.config.mjs`: one list, two readers.

## Status pages

`/404` and `/en/404` (build: `404.html`, `en/404/index.html`). Always `noindex`; no canonical, no
alternates; excluded from the sitemap (built into `@astrojs/sitemap`) and from the `routes`
set used by the switcher and alternates.

## Person (`src/data/site.ts`, extended)

```text
site.person = {
  jobTitle: Record<Locale, string>,   // proposed: « Élève ingénieur en alternance » / "Software engineering apprentice"
  school:   string,                    // "IMT Mines Alès"
  employer: string,                    // "Astrée Software"
}
```

JSON-LD built from `site.name`, `site.person`, `site.contact.github`, `site.contact.linkedin`
and the home URL of the locale. No phone; no email.

## Dictionary additions (`src/i18n/ui.ts`, both locales)

| Key                    | Used by        | Purpose                                 |
| ---------------------- | -------------- | --------------------------------------- |
| `notFound.title`       | `NotFoundView` | `<h1>` and document title               |
| `notFound.description` | `NotFoundView` | meta description                        |
| `notFound.lead`        | `NotFoundView` | one sentence: the page does not exist   |
| `notFound.home`        | `NotFoundView` | link to `/` or `/en/`                   |
| `notFound.projects`    | `NotFoundView` | link to `/projects/` or `/en/projects/` |
| `notFound.email`       | `NotFoundView` | `mailto:` link                          |
| `seo.ogImageAlt`       | `Seo`          | alt text of the default share image     |

## Static assets (`public/`)

| File                | Spec   | Notes                                     |
| ------------------- | ------ | ----------------------------------------- |
| `favicon.svg`       | FR-016 | replaced; theme-aware via inner `<style>` |
| `favicon.ico`       | FR-016 | replaced; 32 × 32, light version          |
| `og/default-fr.png` | FR-017 | 1200 × 630, French pitch, < 100 kB        |
| `og/default-en.png` | FR-017 | 1200 × 630, English pitch, < 100 kB       |

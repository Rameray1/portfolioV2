# Contract: Accueil et À propos

What the build MUST produce. Class names are free; structure, attributes and text sources
are the contract.

## Routes

| Path        | Shell                      | View        | `<html lang>` | Alternate   |
| ----------- | -------------------------- | ----------- | ------------- | ----------- |
| `/`         | `src/pages/index.astro`    | `HomeView`  | `fr`          | `/en/`      |
| `/en/`      | `src/pages/en/index.astro` | `HomeView`  | `en`          | `/`         |
| `/about`    | `src/pages/about.astro`    | `AboutView` | `fr`          | `/en/about` |
| `/en/about` | `src/pages/en/about.astro` | `AboutView` | `en`          | `/about`    |

Alternates, sitemap and language switch come from F03/F04 route discovery, no extra code.

## Home (`HomeView`)

```html
<title>Ramazan Kus</title>
<meta name="description" content="{campaign.pitch[locale]}" />
…
<section class="opening" aria-labelledby="name">
  <div>
    <h1 id="name">Ramazan Kus</h1>
    <p>{site.person.employer} {site.person.school}</p>
    <!-- game-header line -->
    <p>{campaign.pitch[locale]}</p>
    <div>
      <a href="{actions[0].href}">{actions[0].label}</a>
      <!-- primary -->
      <a href="{actions[1].href}">{actions[1].label}</a>
      <!-- secondary -->
    </div>
    <!-- F06: featured list goes here; nothing in F05 -->
  </div>
  <aside aria-label="{t('availability.label')}">
    <figure>
      <div role="img" aria-label="{diagram.alt[locale]}">
        64 cells + 32 <img alt="" />
      </div>
      <figcaption><Availability /></figcaption>
      <!-- only if visible -->
    </figure>
  </aside>
</section>
```

- `PersonSchema` stays in the head slot (F04).
- `actions[n].href` ending in `.pdf` → the link text ends with a visually hidden
  `t('action.pdf')`.
- `availability.visible === false` → no `<figcaption>`.

## Availability (`Availability.astro`)

```html
<span aria-hidden="true"></span>
<!-- red trait square -->
<span>
  <strong>{availability.status[locale]}</strong>
  {t('availability.from')} {formatStart(start, locale)},
  {availability.place[locale]}
</span>
```

Renders nothing when `visible` is `false`. FR: « Dès avril 2027, en France et en Europe ».
EN: « From April 2027, in France and Europe ».

## Diagram (`Diagram.astro`)

- 64 cells in rank 8 → 1, file a → h order; each cell light or dark by parity.
- One `<img src={piece} alt="" width="45" height="45">` per piece, placed with
  `style="--file:N;--rank:M"`.
- Coordinates rendered `aria-hidden="true"`.
- No `<script>`, no animation in F05.

## About (`AboutView`)

```html
<title>{entry.data.title}</title>
<meta name="description" content="{entry.data.description}" />
…
<article>
  <h1>{entry.data.title}</h1>
  <picture>
    <source type="image/avif" srcset="… 320w, … 640w" sizes="20rem" />
    <source type="image/webp" srcset="… 320w, … 640w" sizes="20rem" />
    <img src="….webp" alt="{entry.data.photoAlt}" width="…" height="…" />
  </picture>
  <!-- narrative: <Content /> of the entry -->
  <section aria-labelledby="seeking">
    <!-- only if visible -->
    <h2 id="seeking">{t('about.seeking')}</h2>
    <Availability />
  </section>
</article>
```

## Failure contract

| Input                                             | Result        |
| ------------------------------------------------- | ------------- |
| missing locale in any `campaign` prose            | `check` fails |
| 1 or 3 actions                                    | `check` fails |
| `start: '2027-13'`                                | `build` fails |
| invalid FEN                                       | `build` fails |
| `en/about.md` missing, or frontmatter field empty | `build` fails |
| `portrait.jpg` missing                            | `build` fails |

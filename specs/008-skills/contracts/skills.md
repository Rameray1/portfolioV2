# Contract: Compétences

## Routes

| Path         | Locale | Source                      |
| ------------ | ------ | --------------------------- |
| `/skills`    | fr     | `src/pages/skills.astro`    |
| `/en/skills` | en     | `src/pages/en/skills.astro` |

Both prerendered, in the sitemap, reached by the existing `nav.skills` link. The language
switcher maps one to the other (`alternatePath` finds the route).

## Head

- `<title>` and `<meta name="description">` from `skills.title` / `skills.description`,
  unique among the pages of the language.
- `hreflang` alternates `fr`, `en`, `x-default` through the existing `Seo` component.

## HTML structure

```html
<h1>Compétences</h1>
<p>…intro…</p>

<section aria-labelledby="levels">
  <h2 id="levels">Niveaux</h2>
  <dl>
    <div>
      <dt>
        <picture class="piece" aria-hidden="true">…queen…</picture> Avancé
      </dt>
      <dd>je le pratique au quotidien et j’en connais les pièges</dd>
    </div>
    <!-- proficient, basics -->
  </dl>
</section>

<div class="domains">
  <section aria-labelledby="domain-frontend">
    <div class="head">
      <h2 id="domain-frontend">Front-end</h2>
      <span aria-hidden="true">Niveau</span>
      <span aria-hidden="true">Preuves</span>
    </div>
    <ul>
      <li>
        <h3>TypeScript</h3>
        <p>
          <picture class="piece" aria-hidden="true">…knight…</picture> Autonome
        </p>
        <p id="proofs-typescript">Preuves</p>
        <ul aria-labelledby="proofs-typescript">
          <li><a href="/projects/meetz/">Meetz, des événements…</a></li>
          <li>
            <a href="/projects/shipment-preparation/"
              >Préparer une expédition…</a
            >
          </li>
        </ul>
      </li>
    </ul>
  </section>
  <!-- backend, data, tools; an empty domain renders nothing -->
</div>
```

Each piece is a `<picture>`: the black cburnett piece by default, the white one under
`prefers-color-scheme: dark`, with `alt=""`. Pawn for `basics`, knight for `proficient`,
queen for `advanced`.

Exact elements around level and proofs may change with Impeccable, as long as:

- one `<h1>`; one `<h2>` per non-empty domain, in `DOMAINS` order; one `<h3>` per skill;
- the column labels next to the domain title are `aria-hidden`; each skill keeps its own
  « Preuves » label for assistive technology (visually hidden from `56rem`);
- the level is announced in words; the piece is `aria-hidden`;
- each proof link's text is the project title, and its `href` is the project path
  localized by `localizePath`;
- no `<script>`, no `client:*`.

## Failure contract

The build fails with a message naming `src/data/skills.yaml` and, where it applies, the
skill id and project slug, when:

1. the file is missing, unreadable or has no entry;
2. a skill lacks a field, has an unknown field, an unknown `domain` or `level`;
3. `projects` is empty, cites the same slug twice, a slug with no project, or a draft
   project;
4. two skills share a French name (case-insensitive) or an id.

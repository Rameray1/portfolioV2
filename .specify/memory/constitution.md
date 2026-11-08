# Portfolio V2 Constitution

Portfolio personnel en Astro, **100 % statique**, maintenu sur plusieurs années. Le détail des
règles éditoriales vit dans `CONTENU.md`, la direction visuelle dans `DESIGN.md`. Cette
constitution fixe ce qui est non négociable et que chaque `/speckit-plan` doit vérifier.

## Core Principles

### I. Simplicité d'abord (KISS, YAGNI)

- Une feature, une dépendance ou une abstraction n'est ajoutée que pour un besoin présent,
  jamais « au cas où ». Une idée future va dans la réserve de `ROADMAP.md`.
- On préfère, dans l'ordre : HTML/CSS natif, puis ce qu'Astro fournit, puis une dépendance.
- Toute nouvelle dépendance npm MUST être justifiée dans le plan (besoin, poids, alternative
  native écartée et pourquoi).

*Raison* : un site tenu seul pendant des années doit rester petit et compréhensible.

### II. Site statique, zéro JavaScript client par défaut

- Tout le site MUST être généré au build (`output: 'static'`). Aucun adaptateur serveur,
  aucune route rendue à la demande.
- Les pages MUST fonctionner sans JavaScript client.
- Tout `<script>` ou directive `client:*` MUST être justifié dans le plan, n'être qu'une
  amélioration progressive, et ne pas exister si une solution HTML/CSS native suffit
  (popover, `<details>`, view transitions CSS…).

*Raison* : performance, robustesse, hébergement gratuit et rien à maintenir côté serveur.

### III. Le contenu est de la donnée typée

- Tout contenu (projets, articles, expériences, formations, compétences) MUST vivre dans une
  collection avec un schéma validé au build. Aucun contenu en HTML en dur dans un composant.
- Ajouter un projet ou un article MUST se faire avec un fichier `.md` (ou une entrée YAML) et
  une image : 0 ligne de code.
- Un contenu incomplet ou invalide MUST faire échouer le build.

### IV. Une information vit à un seul endroit

- Une donnée MUST avoir une seule source. Le CV, `/background` et `/skills` lisent les mêmes
  collections.
- Entre FR et EN, seule la prose existe en double ; les données non textuelles (dates, stack,
  liens, images) MUST n'exister qu'une fois (`CONTENU.md` §6).

*Raison* : deux sources finissent toujours par diverger.

### V. Les leviers de campagne sont des données

- Les 5 leviers de `CONTENU.md` §7 (pitch, bandeau de disponibilité, projets mis en avant,
  appels à l'action, CV) MUST vivre dans `src/data/campaign.ts`, jamais dans un composant.

*Raison* : changer d'objectif de recherche = modifier un fichier, aucune page à réécrire.

### VI. Bilingue par dictionnaire

- Français par défaut, anglais sous `/en`, avec les mêmes chemins. Le blog reste en français.
- Aucun libellé d'interface en dur : tout texte d'UI MUST passer par le dictionnaire i18n.
  La règle s'applique à partir de F03, qui crée le dictionnaire et convertit les libellés posés
  en F02 ; avant F03, les libellés sont des littéraux français regroupés en peu d'endroits.
- L'anglais est réécrit, pas traduit (`CONTENU.md` §9).

### VII. Accessibilité et performance

- WCAG 2.2 niveau AA sur toutes les pages, dans les deux thèmes.
- Lighthouse mobile : ≥ 95 performance, 100 accessibilité, bonnes pratiques et SEO.
- Accueil < 200 ko transférés.
- Chaque page indexable a un `title` et une `description` uniques.
- Tout mouvement MUST être désactivé sous `prefers-reduced-motion: reduce`.

### VIII. Styles par jetons et direction visuelle

- Les styles MUST utiliser les jetons de `src/styles/global.css` (couleurs, typo, espacements,
  rayons), dérivés de `DESIGN.md`. Exceptions admises : `0`, `1px`, pourcentages, breakpoints
  dans les `@media`, et une valeur propre à un seul composant si elle est commentée.
- Les styles MUST être scopés par composant ; seuls les jetons et la base vivent en global.
- Toute feature visuelle MUST respecter `DESIGN.md` et passer une revue design (audit +
  polish) avant d'être considérée terminée.
- Les animations MUST être sobres et servir la compréhension (transition, feedback), jamais
  décoratives par défaut.

### IX. Conventions et qualité vérifiable

- Code, noms de fichiers, chemins, URL, champs et valeurs de schéma MUST être en anglais ; la
  prose est dans la langue de la page.
- `npm run check` et `npm run build` MUST passer avant chaque commit (vérifié en CI dès F01).
- Commits conventionnels uniquement (`feat`, `fix`, `content`, `chore`, `docs`, `perf`,
  `a11y`, `ci`).
- Retirer un contenu publié MUST s'accompagner d'une redirection dans `astro.config.mjs`.

## Contraintes de contenu

- Les règles d'écriture de `CONTENU.md` §9 s'appliquent à tout texte publié : mots bannis,
  une date, un chiffre, une techno ou un lien par phrase, rien de daté en dur.
- Aucun numéro de téléphone publié, nulle part.
- Projet d'entreprise : anonymisé (pas de nom de client, pas de capture, pas de chiffre
  confidentiel).
- Aucun texte copié de l'ancien portfolio.

## Workflow et portes qualité

- Une feature = une branche speckit, fusionnée dans `main` par PR quand elle est finie.
- La spec décrit le quoi et le pourquoi, sans techno ; le plan décrit le comment.
- Chaque `plan.md` MUST contenir un « Constitution Check » qui passe les principes I à IX en
  revue et justifie toute exception (en particulier I, II et VIII).
- Une feature visuelle MUST finir, dans `tasks.md`, par une phase de revue design et
  d'accessibilité.
- Une feature SHOULD tenir en ~5 séances ; au-delà, elle est découpée en deux specs.

## Governance

- Cette constitution prime sur toute autre pratique du dépôt. En cas de conflit avec
  `CONTENU.md`, `DESIGN.md` ou `ROADMAP.md`, la constitution est amendée ou le document
  aligné : jamais ignoré.
- Amendement : via `/speckit-constitution`, dans un commit dédié
  (`docs: amend constitution to vX.Y.Z`). Le rapport d'impact va dans le message de commit ou
  la PR, pas dans ce fichier.
- Versionnage sémantique : MAJOR pour un principe retiré ou redéfini, MINOR pour un principe
  ou une section ajouté, PATCH pour une clarification.
- Conformité : `/speckit-plan` et `/speckit-analyze` vérifient chaque feature contre ces
  principes ; une exception non justifiée bloque la feature.

**Version**: 1.0.1 | **Ratified**: 2026-11-07 | **Last Amended**: 2026-11-08

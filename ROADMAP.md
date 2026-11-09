# Chantier Portfolio V2

Reconstruire le portfolio sous Astro, **une feature speckit à la fois**, en gardant le rythme
d'un commit par jour. Le cadrage (quoi raconter, à qui, quelles URL, quelles données) est dans
[`CONTENU.md`](./CONTENU.md) ; ce fichier dit **dans quel ordre** construire et **quoi donner
à speckit** pour chaque feature.

|                     |                                               |
| ------------------- | --------------------------------------------- |
| Features speckit    | 12 (`F01` → `F12`)                            |
| Portfolio complet   | après `F09`                                   |
| Tâches hors speckit | étape 0, mise en ligne, contenu (`C1` → `C8`) |
| Rythme              | 1 commit / jour · 6 à 8 semaines              |
| Mise en ligne       | après F04 (en `noindex` jusqu'à C3)           |
| Site                | 100 % statique, aucun serveur                 |
| Remplace            | `../Portfolio` (Vue 3)                        |

---

## Mode d'emploi speckit

Pour chaque feature, dans l'ordre :

```
/speckit-specify  <bloc « Spec » de la feature>     → crée la branche NNN-nom + spec.md
/speckit-clarify                                    → si la spec contient des [NEEDS CLARIFICATION]
/speckit-plan     <bloc « Plan » de la feature>     → plan.md, data-model.md, contrats
/speckit-tasks                                      → tasks.md
/speckit-analyze                                    → optionnel : cohérence spec / plan / tâches
/speckit-implement                                  → exécute tasks.md
```

- **Spec = quoi et pourquoi, sans techno. Plan = comment.** C'est la discipline speckit : ne
  colle jamais les détails techniques dans `/speckit-specify`, ils vont dans `/speckit-plan`.
- Les features sont numérotées dans l'ordre de réalisation : si tu les fais dans l'ordre,
  `F07` devient la branche `007-…`.
- Chaque feature indique ses **dépendances** : ne la lance pas avant qu'elles soient fusionnées.
- Feature visuelle : demander à `/speckit-tasks` une phase finale « audit + polish Impeccable »
  (voir `AGENTS.md`).

## Règles du jeu

1. **Une feature = une branche speckit**, fusionnée dans `main` (PR) quand elle est finie.
2. **Une séance = au moins un commit** : une ou plusieurs tâches de `tasks.md`. Écrire la spec
   et le plan compte comme une séance (`docs(specs): …`).
3. Commits conventionnels (`feat`, `fix`, `content`, `chore`, `docs`, `perf`, `a11y`, `ci`).
4. `npm run check && npm run build` passent avant chaque commit — la CI de F01 le vérifie.
5. Une feature qui dépasse ~5 séances est mal découpée : coupe-la en deux specs.
6. Jour sans énergie : une micro-tâche (un `alt`, une relecture, une entrée YAML) et un commit.
7. Déploie tôt (après F04) et itère en public.
8. Aucun texte copié de l'ancien portfolio : tout est réécrit selon `CONTENU.md` §9.
9. **KISS / YAGNI** : rien n'est ajouté « au cas où ». Une idée va dans la réserve en bas de ce
   fichier jusqu'au jour où le besoin est réel.

---

## Étape 0 — Avant la première feature _(hors speckit)_

- [x] **Cadrage du contenu** — `CONTENU.md`.
- [x] **Installer speckit** — `specify init --here --integration claude`.
- [x] **Constitution** — `.specify/memory/constitution.md` (v1.0.0).
      Commit : `docs: constitution speckit`
- [x] **Direction visuelle** _(~1 h 30, avec `/impeccable`)_ — `DESIGN.md` : palette (hex,
      clair + sombre), deux polices au plus, échelle typographique, espacements, grille, rayons,
      3 à 5 sites de référence. Prévoir les états : bandeau de disponibilité, image de partage par
      défaut. Toutes les features visuelles s'y réfèrent. Commit : `docs: direction visuelle`

---

## Phase 1 — Socle

### F01 · Outillage et garde-fous _(~1 séance)_

Avant tout composant : formatage, types stricts et CI. `/speckit-implement` pourra ainsi
vérifier chaque tâche, et `main` ne peut plus casser.
**Dépend de** : étape 0.

**Spec**

```
Mettre en place les garde-fous du dépôt pour que tout code ajouté ensuite soit formaté, typé et vérifié automatiquement.
- Une commande formate tout le projet ; une commande vérifie le formatage et les types ; le build reste la commande existante.
- À chaque push et chaque pull request sur GitHub, vérification et build sont exécutés ; un échec marque la PR en rouge.
- Le README explique comment installer et lancer le projet, les commandes disponibles et le workflow speckit.
Hors périmètre : déploiement, vérification des liens morts (F12).
```

**Plan**

```
Prettier + prettier-plugin-astro, .prettierrc, .editorconfig, .nvmrc (Node 22). tsconfig étendu de astro/tsconfigs/strict. @astrojs/check. Scripts package.json : format, check (prettier --check + astro check). Pas d'ESLint : astro check et TypeScript strict suffisent pour ce projet. GitHub Actions .github/workflows/ci.yml : npm ci, npm run check, npm run build.
```

### F02 · Socle visuel et gabarit _(~3 séances)_

Les jetons de design, le thème clair/sombre et le squelette commun : en-tête, navigation,
pied de page.
**Dépend de** : F01, `DESIGN.md`.

**Spec**

```
Toutes les pages partagent un gabarit commun : en-tête avec navigation, contenu, pied de page.
- L'apparence suit DESIGN.md : couleurs, typographie, espacements et rayons sont des jetons réutilisables ; aucune valeur visuelle en dur ailleurs.
- Le site suit le thème clair ou sombre du système du visiteur, sans aucun flash ; les deux thèmes respectent un contraste AA.
- La navigation liste les rubriques depuis une source de données unique : ajouter une rubrique = une ligne. La rubrique courante est signalée (visuellement et pour les lecteurs d'écran).
- La navigation reste utilisable sur mobile et au clavier.
- Un lien « Aller au contenu » est le premier élément focusable.
- Le pied de page contient email, GitHub et LinkedIn ; jamais de numéro de téléphone.
- Chaque page fournit son titre et sa description au gabarit.
- Une page d'accueil provisoire utilise le gabarit pour démontrer le tout.
```

**Plan**

```
src/styles/global.css : bloc :root de jetons (--color-*, --space-*, --font-*, --radius-*), redéfinis sous @media (prefers-color-scheme: dark) ; color-scheme: light dark ; reset minimal ; importé une seule fois par le layout. Pas de bouton de thème, donc aucun script. Polices auto-hébergées dans src/assets/fonts (@font-face, font-display: swap, preload de la graisse principale). src/layouts/BaseLayout.astro (props title, description ; <slot />). Header.astro, Navigation.astro, Footer.astro appelés uniquement depuis BaseLayout. src/data/nav.ts typé. Mobile : si la nav tient sur une ou deux lignes, pas de menu replié ; sinon popover HTML natif (popover + popovertarget), sans JavaScript. Styles scopés dans chaque composant.
```

### F03 · Site bilingue _(~3 séances)_

Tôt dans la roadmap : l'audience n°1 est anglophone, et en posant l'i18n maintenant, chaque
feature suivante naît bilingue au lieu d'être reprise à la fin.
**Dépend de** : F02.

**Spec**

```
Le site existe en français (par défaut, sans préfixe) et en anglais sous /en, avec les mêmes chemins (/projects ↔ /en/projects).
- Tous les libellés d'interface (navigation, boutons, pied de page) viennent d'un dictionnaire FR/EN. Une clé absente dans une langue fait échouer la vérification du projet.
- Un sélecteur de langue dans l'en-tête mène à la même page dans l'autre langue ; si elle n'existe pas, à l'accueil de cette langue.
- La langue de chaque page est correctement déclarée.
- Le blog n'a pas de version anglaise : dans la navigation anglaise, le lien Blog pointe vers /blog avec la mention (FR) (CONTENU.md §5).
- Les libellés posés en F02 sont convertis. Une page d'accueil anglaise provisoire existe.
```

**Plan**

```
Bloc i18n dans astro.config.mjs (defaultLocale 'fr', locales ['fr','en'], prefixDefaultLocale false). src/i18n/ui.ts : dictionnaire fr typé, en déclaré du même type (une clé manquante = erreur TypeScript). Helpers useTranslations(locale) et localizePath(path, locale). Astro.currentLocale. LangSwitcher.astro dans Header (simple lien, aucun JS). Pattern de pages : le corps d'une page vit dans un composant src/views/XxxView.astro qui reçoit la locale ; src/pages/xxx.astro et src/pages/en/xxx.astro ne sont que des coquilles qui le rendent (pas de markup dupliqué).
```

### F04 · SEO et pages système _(~2 séances)_

**Dépend de** : F03.

**Spec**

```
Chaque page est correctement présentée aux moteurs et aux réseaux, depuis un seul endroit.
- Chaque page expose titre, description, URL canonique, aperçu de partage (Open Graph) et liens alternatifs vers son autre langue.
- Une page peut être déclarée non indexable. Un réglage global rend tout le site non indexable (utilisé jusqu'à la publication des projets) ; il agit aussi sur le robots.txt.
- Un plan du site bilingue liste les pages indexables uniquement.
- L'accueil décrit la personne en données structurées.
- Une page 404 utile (liens vers accueil, projets, email) existe en FR et EN.
- Favicon et une image de partage par défaut, selon DESIGN.md.
```

**Plan**

```
src/components/Seo.astro (props title, description, image, noindex, alternates) appelé par BaseLayout ; canonique via Astro.site + Astro.url ; renseigner `site` dans astro.config.mjs. Réglage global via variable d'environnement PUBLIC_NOINDEX. robots.txt généré par un endpoint statique src/pages/robots.txt.ts qui lit ce réglage. @astrojs/sitemap avec option i18n et filter des pages noindex. JSON-LD Person via <script type="application/ld+json" set:html={JSON.stringify(data)} />. src/pages/404.astro. Favicon SVG + image OG par défaut dans public/. Pas de manifeste web (le site n'est pas une PWA).
```

### 🚀 Mise en ligne _(hors speckit · ~1 h)_

- [ ] Brancher le dépôt sur un hébergeur statique (Netlify, Vercel ou Cloudflare Pages) :
      build `npm run build`, dossier `dist/`. Activer les aperçus par branche.
- [ ] `PUBLIC_NOINDEX=true` en production jusqu'à C3.
- [ ] Remplacer l'adresse provisoire `site` (`https://ramazankus.example`) de
      `astro.config.mjs` par le vrai domaine.
- [ ] Servir `en/404.html` avec un statut 404 sous `/en/*` : Netlify, `/en/* /en/404.html 404`
      dans `public/_redirects` ; Cloudflare Pages, rien à faire ; Vercel, une réécriture.
- [ ] Vérifier l'aperçu grand format de `/` et `/en/` dans LinkedIn Post Inspector.
      Commit : `ci: premiere mise en ligne`

---

## Phase 2 — Pages et projets

### F05 · Accueil et À propos _(~3 séances)_

**Dépend de** : F04.

**Spec**

```
Accueil et page À propos, en FR et EN, pilotés par les leviers de campagne (CONTENU.md §3 et §7).
- Accueil : phrase d'identité, bandeau de disponibilité (ce que je cherche, à partir de quand, où — masquable), deux appels à l'action, et un emplacement pour les projets mis en avant (rempli en F06).
- Les 5 leviers de campagne sont lus depuis une source de données unique et bilingue : changer d'objectif ne touche aucun composant.
- En attendant F09, les appels à l'action pointent vers un CV PDF statique et un lien email ; ils changeront dans la donnée seulement.
- À propos : récit en trois paragraphes, photo optimisée, ce que je cherche. Le texte vit dans des fichiers de contenu, pas dans le composant.
- Les textes définitifs sont rédigés hors speckit (C1) ; des textes provisoires clairement marqués suffisent.
```

**Plan**

```
src/data/campaign.ts typé (valeurs { fr, en }, availability.visible, ctas[]). Composants Hero.astro, AvailabilityBanner.astro, CtaGroup.astro. Vues HomeView.astro et AboutView.astro (pattern F03). Prose d'À propos en Markdown par langue (src/content/pages/{fr,en}/about.md, collection `pages`). Photo dans src/assets/, rendue avec <Image> d'astro:assets. Diagram.astro : grille CSS de 64 cases, chaque pièce est un SVG séparé placé par sa case (custom properties --file / --rank), position dans src/data/diagram.ts (provisoire jusqu'à C2b). Le diagramme est ainsi prêt pour les animations de F11, sans les construire ici.
```

### F06 · Projets _(~4 séances)_

Le cœur du portfolio : les projets deviennent des données typées, avec une page chacun.
**Dépend de** : F05.

**Spec**

```
Les projets sont du contenu typé (CONTENU.md §6), affichés en liste et en pages de détail, en FR et EN.
User stories :
- P1 — /projects affiche les projets publiés en liste, dans le format de la liste des coups de DESIGN.md, sans cartes ni diagramme (titre, année, résumé, technologies, symbole d'évaluation), du plus récent au plus ancien.
- P1 — Chaque projet a sa page : récit (contexte, problème, ce que j'ai fait, stack et pourquoi, résultat, appris) et liens (code, démo, vidéo) quand ils existent.
- P2 — Un projet en brouillon est absent en production (CONTENU.md §7).
- P2 — Les projets marqués « mis en avant » (3 au plus, sinon le build échoue) apparaissent sur l'accueil. Le choix se fait dans la donnée.
- P2 — La version anglaise d'un projet ne contient que la prose ; dates, technologies, liens et visuel viennent de la version française. Si elle manque, /en/projects/<slug> affiche la version française avec la mention « disponible en français uniquement ».
Exigences : une fiche incomplète ou invalide fait échouer le build ; les visuels sont optimisés, sans décalage de mise en page ; l'accueil reste < 200 ko. Fournir deux fiches d'exemple (dont un brouillon) ; le vrai contenu est rédigé hors speckit (C2, C3).
```

**Plan**

```
src/content.config.ts : collection projects, loader glob() sur src/content/projects/{fr,en}/, schéma zod (fr : title, year, summary, tech, links, cover via image(), featured, draft, eval ('!' | '!!' | '!?'), move { from, to } en cases du diagramme et notation (coup des blancs depuis la position de src/data/diagram.ts), requis si featured ; en : title, summary). src/lib/projects.ts : getProjects(locale, { featured }) qui exclut les drafts en production, fusionne métadonnées FR + prose EN par slug, avec repli FR. ProjectRow.astro, ProjectsView.astro, src/pages/projects/[slug].astro (getStaticPaths + render(entry)) et équivalent sous src/pages/en/. Technologies affichées en badges (texte, sans lien). <Image> d'astro:assets (AVIF/WebP, width/height, lazy). Sélecteur de langue : les routes dynamiques ne sont pas listées par switchPath (F03, R5) ; déclarer les chemins traduits des fiches projet (projet sans version anglaise → accueil /en/ ou version française, à trancher en spec).
```

### ✍️ C1 – C3 · Contenu _(hors speckit)_

- [ ] **C1 · Textes accueil et À propos** — FR, selon §3 et §9. `content: accueil et a propos`
- [ ] **C2 · Fiches projets** — choisir 3 à 10 projets selon `CONTENU.md` §8. Une fiche par
      séance. `content: fiche <projet>`
- [ ] **C2b · Position du diagramme** — une fois les projets mis en avant choisis : la position
      finale dans `src/data/diagram.ts`, où chaque projet mis en avant a un coup des blancs
      jouable (son `move`, tous au même numéro de coup) et où le projet `!!` a un vrai coup
      brillant. De préférence une partie célèbre, peu de pièces, la case d'arrivée du `!!` loin
      du bord droit. Les trois coups doivent partir de pièces différentes. À faire avant F11.
      `content: position du diagramme`
- [ ] **C3 · Étude de cas d'entreprise** — **anonymisée** (CONTENU.md §8). La fiche la
      plus travaillée. Puis **lever `PUBLIC_NOINDEX`** : le site a enfin de quoi être trouvé.
      `content: etude de cas de l'alternance`

---

## Phase 3 — Parcours, compétences, CV

### F07 · Parcours _(~2 séances)_

**Dépend de** : F03.

**Spec**

```
/background (et /en/background) présente formations et expériences sur une seule frise chronologique, du plus récent au plus ancien, lisible sur mobile.
- Chaque entrée : période, intitulé, lieu, description. Une expérience ajoute technologies et réalisations.
- Une entrée en cours affiche « aujourd'hui » / « present ». Aucune date ni durée écrite en dur dans la prose.
- Les données vivent dans deux fichiers (expériences, formations) de même forme, réutilisés par le CV (F09). La prose y existe en FR et EN.
- Quelques entrées d'exemple suffisent ; les textes définitifs sont rédigés hors speckit (C4).
```

**Plan**

```
Collections experience et education dans content.config.ts, loader file() sur src/data/experience.yaml et education.yaml ; champs de prose { fr, en }. Timeline.astro générique (ne connaît pas le type d'entrée). BackgroundView.astro : deux getCollection, fusion, tri par start décroissant. Dates formatées par Intl.DateTimeFormat selon la locale (src/lib/dates.ts).
```

### F08 · Compétences _(~2 séances)_

**Dépend de** : F06.

**Spec**

```
/skills (et /en/skills) regroupe les compétences par domaine. Objectif : aucune compétence déclarative.
- Chaque compétence affiche son niveau (compréhensible sans couleur et par un lecteur d'écran), depuis quand, et des liens vers les projets publiés qui la prouvent.
- Une compétence sans projet de preuve, ou qui référence un projet inexistant, fait échouer le build.
- Les données vivent dans un fichier unique, réutilisé par le CV (F09).
- L'échelle de niveau est à définir lors de la clarification.
```

**Plan**

```
Collection skills, loader file() sur src/data/skills.yaml, champ projects: z.array(reference('projects')).min(1). SkillGroup.astro. Regroupement par domaine dans le frontmatter de la vue (build-time, aucun JS client).
```

### F09 · CV en ligne et impression _(~2 séances)_

**Dépend de** : F05, F07, F08.

**Spec**

```
/cv et /en/cv affichent un CV construit uniquement à partir des données existantes (campagne, expériences, formations, compétences, projets mis en avant) : aucune information n'est saisie deux fois.
- Imprimé depuis le navigateur, il tient sur une page A4 propre : sans navigation, en thème clair, liens lisibles (URL visibles).
- Aucun numéro de téléphone n'est publié.
- Un PDF téléchargeable FR et EN est disponible depuis la page.
- Le levier « CV » de la campagne pointe désormais vers /cv.
```

**Plan**

```
CvView.astro réutilisant src/lib/* (projets, dates) et les collections experience, education, skills. Bloc @media print dans son <style> (@page A4, masquage Header/Footer, a[href]::after). PDF exporté à la main depuis le navigateur (Imprimer → PDF) dans public/cv-fr.pdf et public/cv-en.pdf, à refaire quand les données changent. Pas de script de génération.
```

### ✍️ C4 – C5 · Contenu _(hors speckit)_

- [ ] **C4 · Données parcours et compétences** — entrées YAML réelles, 100 % des compétences
      avec une preuve. `content: parcours et competences`
- [ ] **C5 · Version anglaise** — accueil, À propos, parcours, compétences, CV, puis les fiches
      projets (réécrites, pas traduites). Une page par séance. `content(i18n): <page> en anglais`

> ✅ **Ici, le portfolio est complet.** La suite l'enrichit, elle n'est pas nécessaire pour
> postuler.

---

## Phase 4 — Blog

### F10 · Blog _(~3 séances)_

**Dépend de** : F04.

**Spec**

```
Un blog en français (non traduit), qui fait vivre le site entre deux projets.
- Chaque article : titre, description, date, brouillon ou publié (même cycle de vie que les projets, CONTENU.md §7).
- /blog liste les articles publiés du plus récent au plus ancien.
- Page d'article lisible, avec des blocs de code colorés adaptés aux deux thèmes.
- Un flux RSS complet est découvrable depuis toutes les pages.
- Un article d'exemple démontre le tout ; les vrais articles sont rédigés hors speckit (C6).
Hors périmètre : pagination, tags, sommaire, articles liés (à ajouter quand il y aura assez d'articles).
```

**Plan**

```
Collection blog (glob sur src/content/blog/*.md, schéma CONTENU.md §6). src/pages/blog/index.astro et src/pages/blog/[slug].astro + PostLayout.astro. Coloration Shiki intégrée à Astro avec deux thèmes (markdown.shikiConfig.themes { light, dark }) basculés par prefers-color-scheme. src/pages/rss.xml.js avec @astrojs/rss. <link rel="alternate" type="application/rss+xml"> dans BaseLayout. Markdown simple, pas de MDX.
```

### ✍️ C6 · Deux premiers articles _(hors speckit)_

- [ ] Par exemple « De Vue à Astro, ce qui change » ou le récit d'un problème technique.
      `content: premier article`

---

## Phase 5 — Finitions

### F11 · Transitions et micro-animations _(~2 séances)_

**Dépend de** : F06 et C2b (et F10 s'il est fait avant).

**Spec**

```
Les quatre effets de DESIGN.md (section Motion), et rien d'autre :
- Accueil : le coup du projet !! se joue tout seul une fois, puis le symbole !! se pose en bleu à côté.
- Survol ou focus d'un projet mis en avant : sa pièce joue son coup (blancs seulement) et ses cases de départ et d'arrivée se marquent ; elle revient quand on passe à un autre projet, et la pièce du !! revient le temps du survol.
- Moins d'animations demandées : aucune pièce ne bouge, seules les cases se marquent.
- Ouverture d'un projet : son titre passe de la liste à la page projet par une transition fluide ; l'en-tête reste fixe.
- Page projet : le symbole d'évaluation se pose après la transition, jamais pendant.
- Le bleu du !! s'ajoute aux jetons de couleur, en clair et en sombre, contrastes vérifiés.
- Tout mouvement est désactivé si l'utilisateur demande moins d'animations : la page s'affiche dans son état final.
- Aucun JavaScript ajouté : sans support du navigateur, le site fonctionne à l'identique, sans animation.
```

**Plan**

```
Jetons dans global.css : --color-brilliant / --color-brilliant-on-invert (clair et sombre), --duration-page, --duration-move, --duration-stamp. View transitions natives entre documents (@view-transition { navigation: auto; }), view-transition-name: site-header sur l'en-tête et project-<slug> sur les titres (liste et page). Le HTML place la pièce du !! sur sa case d'arrivée et les autres sur leur case de départ. Coup signature : @keyframes sur la pièce du !!, de sa case de départ vers la position du HTML ; au chargement au-dessus de 56rem, animation-timeline: view() en dessous, dans @supports. Coups au survol : une règle :has() par rang de la liste (3 au plus, nth-child) qui translate la pièce du coup (transform calculé depuis --file / --rank de départ et d'arrivée, transition en --duration-move) et ramène la pièce du !!, plus box-shadow inset sur les cases move.from / move.to. Sous reduced motion, seules les cases changent. Symbole de la page projet : animation-delay égal à --duration-page. Tous les mouvements sous @media (prefers-reduced-motion: no-preference). Pas de ClientRouter, pas d'IntersectionObserver.
```

### ✍️ C7 · Domaine _(hors speckit · ~1 h)_

- [ ] Nom de domaine + HTTPS chez l'hébergeur, mise à jour de `site` dans `astro.config.mjs`.
      `ci: nom de domaine`

### F12 · Qualité et exploitation _(~3 séances)_

**Dépend de** : C7 et toutes les features visuelles.

**Spec**

```
Le site atteint les cibles de CONTENU.md §10 et reste propre dans le temps.
- La CI échoue si un lien interne ou externe du site généré est mort.
- Les redirections des contenus retirés sont déclarées en un seul endroit.
- Mesure d'audience respectueuse de la vie privée : sans cookie, sans bandeau de consentement.
- En-têtes de sécurité de base appliqués par l'hébergeur.
- Audit unique : Lighthouse ≥ 95 performance et 100 accessibilité, bonnes pratiques et SEO sur l'accueil, une page projet, un article et /en, en mobile ; navigation au clavier, contrastes AA dans les deux thèmes, hiérarchie de titres, textes alternatifs. Les écarts trouvés sont corrigés.
```

**Plan**

```
lychee (action GitHub) sur dist/ dans ci.yml, exclusions documentées. Bloc redirects d'astro.config.mjs. Analytics sans cookie (Plausible, Umami ou Cloudflare Web Analytics) : un seul <script> dans BaseLayout, justifié dans le plan. En-têtes via public/_headers (ou la config de l'hébergeur) : X-Content-Type-Options, Referrer-Policy, frame-ancestors. Audit manuel avec Lighthouse et axe DevTools, corrections par composant. Pas de Lighthouse CI ni de CSP à hash.
```

### ✍️ C8 · Clôture _(hors speckit)_

- [ ] **Relecture générale** — tout relu à voix haute, mots bannis traqués (§9), descriptions
      SEO vérifiées une par une. `content: relecture generale`
- [ ] **Clôture du chantier** — README final (architecture, comment ajouter / retirer un
      contenu, workflow speckit), archivage de `../Portfolio`, article bilan.
      `docs: readme final et archivage`

---

## Réserve d'idées

À sortir d'ici **seulement quand le besoin est réel**. Chacune peut devenir une feature
speckit.

- Bouton de thème clair / sombre (aujourd'hui : thème du système)
- Pages `/tech/<tech>` et filtre de projets par technologie (utile au-delà de ~15 projets)
- Tags, pagination, sommaire et articles liés pour le blog (utile au-delà de ~10 articles)
- Recherche plein texte (Pagefind)
- Images Open Graph générées par page
- MDX pour intégrer des composants dans les articles
- Formulaire de contact (impose un serveur ou un service tiers)
- Pages `/uses`, `/now`, rubriques `/notes`, `/reading`
- Commentaires de blog (giscus) · démos jouables

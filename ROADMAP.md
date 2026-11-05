# Chantier Portfolio V2

Reconstruire le portfolio sous Astro, **une feature speckit à la fois**, en gardant le rythme
d'un commit par jour. Le cadrage (quoi raconter, à qui, quelles URL, quelles données) est dans
[`CONTENU.md`](./CONTENU.md) ; ce fichier dit **dans quel ordre** construire et **quoi donner
à speckit** pour chaque feature.

| | |
|---|---|
| Features speckit | 19 (`F01` → `F19`) |
| Tâches hors speckit | étape 0, mise en ligne, contenu (`C1` → `C10`) |
| Rythme | 1 commit / jour · 8 à 12 semaines |
| Mise en ligne | après F05 (en `noindex` jusqu'à C3) |
| Remplace | `../Portfolio` (Vue 3) |

---

## Mode d'emploi speckit

Pour chaque feature, dans l'ordre :

```
/speckit.specify  <bloc « Spec » de la feature>     → crée la branche NNN-nom + spec.md
/speckit.clarify                                    → si la spec contient des [NEEDS CLARIFICATION]
/speckit.plan     <bloc « Plan » de la feature>     → plan.md, data-model.md, contrats
/speckit.tasks                                      → tasks.md
/speckit.analyze                                    → optionnel : cohérence spec / plan / tâches
/speckit.implement                                  → exécute tasks.md
```

- **Spec = quoi et pourquoi, sans techno. Plan = comment.** C'est la discipline speckit : ne
  colle jamais les détails techniques dans `/speckit.specify`, ils vont dans `/speckit.plan`.
- Les features sont numérotées dans l'ordre de réalisation : si tu les fais dans l'ordre,
  `F07` devient la branche `007-…`.
- Chaque feature indique ses **dépendances** : ne la lance pas avant qu'elles soient fusionnées.

## Règles du jeu

1. **Une feature = une branche speckit**, fusionnée dans `main` (PR) quand elle est finie.
2. **Une séance = au moins un commit** : une ou plusieurs tâches de `tasks.md`. Écrire la spec
   et le plan compte comme une séance (`docs(specs): …`).
3. Commits conventionnels (`feat`, `fix`, `content`, `chore`, `docs`, `perf`, `a11y`, `ci`).
4. `npm run check && npm run build` passent avant chaque commit — la CI de F01 le vérifie.
5. Une feature qui dépasse ~5 séances est mal découpée : coupe-la en deux specs.
6. Jour sans énergie : une micro-tâche (un `alt`, une relecture, une entrée YAML) et un commit.
7. Déploie tôt (après F05) et itère en public.
8. Aucun texte copié de l'ancien portfolio : tout est réécrit selon `CONTENU.md` §9.

---

## Étape 0 — Avant la première feature *(hors speckit)*

- [x] **Cadrage du contenu** — `CONTENU.md`.
- [ ] **Installer speckit** *(~15 min)*
  ```
  uvx --from git+https://github.com/github/spec-kit.git specify init --here --ai claude
  ```
  Commit : `chore: initialisation de speckit`
- [ ] **Direction visuelle** *(~1 h 30)* — `DESIGN.md` : palette (hex, clair + sombre), deux
  polices, échelle typographique, espacements, grille, rayons, références. Prévoir les états :
  bandeau de disponibilité, badge « archivé », gabarit de l'image OG. Toutes les features
  visuelles s'y réfèrent. Commit : `docs: direction visuelle`
- [ ] **Constitution** *(~30 min)* — les règles que speckit vérifiera à chaque plan :
  ```
  /speckit.constitution Portfolio personnel en Astro, statique par défaut, maintenu sur plusieurs années. Principes non négociables (détail dans CONTENU.md et DESIGN.md) :
  1. Le contenu est de la donnée typée (collections + schémas validés au build), jamais du HTML en dur. Ajouter un projet ou un article = 0 ligne de code.
  2. Une information vit à un seul endroit : CV, /background et /skills lisent les mêmes collections.
  3. URL stables : on archive via `status` (brouillon | publie | archive), on ne supprime pas. Toute suppression réelle impose une redirection.
  4. Les 5 leviers de campagne (CONTENU.md §7) vivent dans src/data/campaign.ts, jamais dans un composant.
  5. Bilingue : français par défaut, anglais sous /en, mêmes chemins. Aucun libellé d'interface en dur : tout passe par le dictionnaire i18n.
  6. Zéro JavaScript client par défaut : chaque directive client: ou script doit être justifié dans le plan.
  7. Accessibilité WCAG 2.2 AA, Lighthouse ≥ 95 perf / 100 a11y / 100 SEO, accueil < 200 ko transférés.
  8. Code, chemins, URL et champs en anglais ; prose en français ou anglais selon la langue.
  9. Styles : uniquement les jetons de src/styles/global.css, styles scopés par composant.
  10. Qualité : npm run check et npm run build passent avant chaque commit ; commits conventionnels ; aucun numéro de téléphone publié.
  ```
  Commit : `docs: constitution speckit`

---

## Phase 1 — Socle

### F01 · Outillage et garde-fous *(~2 séances · ex-J03, J51, J52)*

Avant tout composant : formatage, types stricts, lint et CI. `/speckit.implement` pourra ainsi
vérifier chaque tâche, et `main` ne peut plus casser.
**Dépend de** : étape 0.

**Spec**
```
Mettre en place les garde-fous du dépôt pour que tout code ajouté ensuite soit formaté, typé et vérifié automatiquement.
- Une commande formate tout le projet ; une commande vérifie types et lint ; le build reste la commande existante.
- À chaque push et chaque pull request sur GitHub, formatage, vérification et build sont exécutés ; un échec marque la PR en rouge.
- Le README explique comment installer et lancer le projet, les commandes disponibles, la convention de nommage (anglais pour code/chemins/champs, prose dans la langue du contenu) et le workflow speckit.
Hors périmètre : déploiement, vérification des liens morts (F18).
```
**Plan**
```
Prettier + prettier-plugin-astro, .prettierrc, .editorconfig, .nvmrc (Node 22). tsconfig étendu de astro/tsconfigs/strict. ESLint (flat config) + eslint-plugin-astro + typescript-eslint. Scripts package.json : format, format:check, lint, check (astro check + eslint). GitHub Actions .github/workflows/ci.yml : npm ci, format:check, check, build.
```

### F02 · Socle visuel et gabarit *(~3 séances · ex-J04 – J06)*

Les jetons de design et le squelette commun à toutes les pages : en-tête, navigation, pied de
page, menu mobile.
**Dépend de** : F01, `DESIGN.md`.

**Spec**
```
Toutes les pages partagent un gabarit commun : en-tête avec navigation, contenu, pied de page.
- L'apparence suit DESIGN.md : couleurs, typographie, espacements et rayons sont des jetons réutilisables ; aucune valeur visuelle en dur ailleurs.
- La navigation liste les rubriques depuis une source de données unique : ajouter une rubrique = une ligne. La rubrique courante est signalée (visuellement et pour les lecteurs d'écran).
- Sur mobile, la navigation se replie dans un menu accessible : ouverture/fermeture au clavier, état annoncé, fermeture par Échap, focus géré.
- Un lien « Aller au contenu » est le premier élément focusable.
- Le pied de page contient email, GitHub et LinkedIn ; jamais de numéro de téléphone.
- Chaque page fournit son titre et sa description au gabarit.
- Une page d'accueil provisoire utilise le gabarit pour démontrer le tout.
```
**Plan**
```
src/styles/global.css : bloc :root de jetons (--color-*, --space-*, --font-*, --radius-*), reset minimal, importé une seule fois par le layout. Polices auto-hébergées dans src/assets/fonts (@font-face, font-display: swap, preload des graisses principales). src/layouts/BaseLayout.astro (props title, description ; <slot />). Header.astro, Navigation.astro, Footer.astro appelés uniquement depuis BaseLayout. src/data/nav.ts typé. Le menu burger est le seul script (balise <script> Astro, sans framework). Styles scopés dans chaque composant.
```

### F03 · Thème clair / sombre *(~1 séance · ex-J09)*

**Dépend de** : F02.

**Spec**
```
Le visiteur bascule entre thème clair et sombre via un bouton dans l'en-tête.
- Au premier passage, le thème suit le réglage du système ; ensuite, le choix est mémorisé.
- Aucun flash du mauvais thème au chargement ni lors de la navigation entre pages.
- Les deux thèmes respectent un contraste AA (palette sombre de DESIGN.md).
- Le bouton a un libellé accessible et annonce son état.
- Sans JavaScript, le site suit le réglage système.
```
**Plan**
```
Jetons redéfinis sous [data-theme="dark"] et @media (prefers-color-scheme: dark) dans global.css. ThemeToggle.astro dans Header. <script is:inline> dans le <head> de BaseLayout : lit localStorage puis prefers-color-scheme et pose data-theme sur <html> avant le rendu. Prévoir la compatibilité avec le ClientRouter de F17 (réappliquer sur astro:after-swap).
```

### F04 · Site bilingue *(~3 séances · ex-J31, J32)*

Remonté tout en haut : l'audience n°1 est anglophone, et en posant l'i18n maintenant, chaque
feature suivante naît bilingue au lieu d'être reprise à la fin.
**Dépend de** : F02, F03.

**Spec**
```
Le site existe en français (par défaut, sans préfixe) et en anglais sous /en, avec les mêmes chemins (/projects ↔ /en/projects).
- Tous les libellés d'interface (navigation, boutons, pied de page, thème) viennent d'un dictionnaire FR/EN. Une clé absente en anglais retombe sur le français, et la vérification du projet le signale.
- Un sélecteur de langue dans l'en-tête mène à la même page dans l'autre langue ; si elle n'existe pas, à l'accueil de cette langue.
- La langue de chaque page est correctement déclarée.
- Le blog n'a pas de version anglaise : dans la navigation anglaise, le lien Blog pointe vers /blog avec la mention (FR) (CONTENU.md §5).
- Les libellés posés en F02 et F03 sont convertis. Une page d'accueil anglaise provisoire existe.
```
**Plan**
```
Bloc i18n dans astro.config.mjs (defaultLocale 'fr', locales ['fr','en'], prefixDefaultLocale false). src/i18n/ui.ts : { fr, en } typé (en partiel), helpers useTranslations(locale), localizePath(path, locale), getAlternatePath(url). Astro.currentLocale. LangSwitcher.astro dans Header. Pattern de pages : le corps d'une page vit dans un composant src/views/XxxView.astro qui reçoit la locale ; src/pages/xxx.astro et src/pages/en/xxx.astro ne sont que des coquilles qui le rendent (pas de markup dupliqué).
```

### F05 · SEO et pages système *(~3 séances · ex-J10 – J12, J35)*

**Dépend de** : F04.

**Spec**
```
Chaque page est correctement présentée aux moteurs et aux réseaux, depuis un seul endroit.
- Chaque page expose titre, description, URL canonique, aperçu de partage (Open Graph, Twitter) et liens alternatifs vers son autre langue.
- Une page peut être déclarée non indexable. Un réglage global rend tout le site non indexable (utilisé jusqu'à la publication des projets) ; il agit aussi sur le robots.txt.
- Un plan du site bilingue liste les pages indexables uniquement.
- L'accueil décrit la personne en données structurées.
- Une page 404 utile (liens vers accueil, projets, contact) existe en FR et EN.
- Jeu complet de favicons et manifeste web.
- Image de partage par défaut (les images générées viennent en F16).
```
**Plan**
```
src/components/Seo.astro (props title, description, image, noindex, alternates) appelé par BaseLayout ; canonique via Astro.site + Astro.url ; renseigner `site` dans astro.config.mjs. Réglage global via variable d'environnement PUBLIC_NOINDEX. robots.txt généré par un endpoint src/pages/robots.txt.ts qui lit ce réglage. @astrojs/sitemap avec option i18n et filter des pages noindex. JSON-LD Person via <script type="application/ld+json" set:html={JSON.stringify(data)} />. src/pages/404.astro. Icônes + site.webmanifest dans public/.
```

### 🚀 Mise en ligne *(hors speckit · ~1 h · ex-J13)*

- [ ] Brancher le dépôt sur l'hébergeur (Netlify, Vercel ou Cloudflare Pages) : build
  `npm run build`, dossier `dist/`. Activer les aperçus par branche.
- [ ] `PUBLIC_NOINDEX=true` en production jusqu'à C3.
  Commit : `ci: premiere mise en ligne`

---

## Phase 2 — Pages et projets

### F06 · Accueil et À propos *(~3 séances · ex-J07, J08)*

**Dépend de** : F05.

**Spec**
```
Accueil et page À propos, en FR et EN, pilotés par les leviers de campagne (CONTENU.md §3 et §7).
- Accueil : phrase d'identité, bandeau de disponibilité (ce que je cherche, à partir de quand, où — masquable), deux appels à l'action, et un emplacement pour les projets mis en avant (rempli en F07).
- Les 5 leviers de campagne sont lus depuis une source de données unique et bilingue : changer d'objectif ne touche aucun composant.
- En attendant F11 et F14, les appels à l'action pointent vers un CV PDF statique et un lien email ; ils changeront dans la donnée seulement.
- À propos : récit en trois paragraphes, photo optimisée, ce que je cherche. Le texte vit dans des fichiers de contenu, pas dans le composant.
- Les textes définitifs sont rédigés hors speckit (C1) ; des textes provisoires clairement marqués suffisent.
```
**Plan**
```
src/data/campaign.ts typé (valeurs { fr, en }, availability.visible, ctas[]). Composants Hero.astro, AvailabilityBanner.astro, CtaGroup.astro. Vues HomeView.astro et AboutView.astro (pattern F04). Prose d'À propos en Markdown par langue (src/content/pages/{fr,en}/about.md, collection `pages`). Photo dans src/assets/, rendue avec <Image> d'astro:assets.
```

### F07 · Vitrine projets *(~5 séances · ex-J14, J18 – J20, J23, J34)*

Le cœur du portfolio : les projets deviennent des données typées, avec une page chacun.
**Dépend de** : F06.

**Spec**
```
Les projets sont du contenu typé (CONTENU.md §6), affichés en liste et en pages de détail, en FR et EN.
User stories :
- P1 — /projects affiche en cartes les projets publiés (titre, année, résumé, technos, visuel), du plus récent au plus ancien.
- P1 — Chaque projet a sa page : récit (contexte, problème, ce que j'ai fait, stack et pourquoi, résultat, appris) et liens (code, démo, vidéo) quand ils existent.
- P2 — Cycle de vie (CONTENU.md §7) : brouillon absent en production, archivé hors liste mais URL conservée avec un bandeau « projet ancien », non indexé et hors plan du site.
- P2 — Les projets marqués « mis en avant » (3 au plus) apparaissent sur l'accueil. Le choix se fait dans la donnée.
- P2 — Un projet peut avoir une version anglaise liée à la française ; si elle manque, /en/projects/<slug> affiche la version française avec la mention « disponible en français uniquement ».
Exigences : une fiche incomplète ou invalide fait échouer le build ; les visuels sont optimisés, sans décalage de mise en page ; l'accueil reste < 200 ko. Fournir des fiches d'exemple couvrant les trois statuts ; le vrai contenu est rédigé hors speckit (C2, C3).
```
**Plan**
```
src/content.config.ts : collection projects, loader glob() sur src/content/projects/{fr,en}/, schéma zod en anglais (title, year, summary, tech, links, cover via image(), featured, status enum brouillon|publie|archive, translationKey). src/lib/projects.ts : getProjects(locale, { status, featured }) avec repli FR. ProjectCard.astro, ProjectsView.astro, src/pages/projects/[...slug].astro (getStaticPaths + render(entry)) et équivalents sous src/pages/en/. ProjectLayout.astro lit status pour le bandeau et passe noindex à Seo. <Image>/<Picture> d'astro:assets (AVIF/WebP, width/height, lazy). Exclusion des archives dans le filtre du sitemap.
```

### ✍️ C1 – C3 · Contenu *(hors speckit)*

- [ ] **C1 · Textes accueil et À propos** — FR, selon §3 et §9. `content: accueil et a propos`
- [ ] **C2 · Fiches projets** — Sportify, TrajetSim, AppMeteo, MinhList, Portfolio V2 ; Crousty'kebab
  et Annuaire 1.0 en `archive`. Une fiche par séance. `content: fiche <projet>`
- [ ] **C3 · Étude de cas Astrée** — anonymisée, **accord du tuteur obtenu**. La fiche la plus
  travaillée. Puis **lever `PUBLIC_NOINDEX`** : le site a enfin de quoi être trouvé.
  `content: etude de cas de l'alternance`

### F08 · Explorer par technologie *(~3 séances · ex-J21, J22)*

**Dépend de** : F07.

**Spec**
```
Le visiteur explore les projets par technologie, en FR et EN.
- P1 — /tech liste les technologies des projets publiés avec leur nombre de projets ; /tech/<tech> liste les projets d'une technologie. Slugs normalisés (« Spring Boot » → spring-boot).
- P2 — Sur /projects, un filtre par technologie affine la grille sans rechargement. L'état du filtre est dans l'URL (partageable, bouton retour fonctionnel). Sans JavaScript, la grille complète reste affichée avec des liens vers /tech/<tech>.
- Le filtre est utilisable au clavier et annonce le nombre de résultats.
- Les technologies ne sont jamais utilisées comme tags de blog (CONTENU.md §5).
```
**Plan**
```
src/lib/slug.ts partagé. src/pages/tech/index.astro et [tech].astro via getStaticPaths sur les technos dédoublonnées des projets publiés (+ src/pages/en/tech/). Filtre : îlot Vue (npx astro add vue) en client:visible, recevant la liste sérialisée des projets ; synchronisation avec URLSearchParams et history.replaceState ; région aria-live pour le compteur. Seul JS de la page — si un script vanilla suffit, le plan peut le préférer et le justifier.
```

---

## Phase 3 — Parcours, compétences, CV

### F09 · Parcours *(~3 séances · ex-J24 – J27)*

**Dépend de** : F04.

**Spec**
```
/background (et /en/background) présente formations et expériences sur une seule frise chronologique, du plus récent au plus ancien, lisible sur mobile.
- Chaque entrée : période, intitulé, lieu, description. Une expérience ajoute technologies et réalisations.
- Une entrée en cours affiche « aujourd'hui » / « present ». Aucune date ni durée écrite en dur dans la prose.
- Les données vivent dans deux fichiers (expériences, formations) de même forme, réutilisés par le CV (F11). La prose y existe en FR et EN.
- Données d'exemple : alternance Astrée, Bac NSI, BUT Informatique Lyon 1, IMT Mines Alès. Les textes définitifs sont rédigés hors speckit (C4).
```
**Plan**
```
Collections experience et education dans content.config.ts, loader file() sur src/data/experience.yaml et education.yaml ; champs de prose { fr, en }. Timeline.astro générique (ne connaît pas le type d'entrée). BackgroundView.astro : deux getCollection, fusion, tri par start décroissant. Dates formatées par Intl.DateTimeFormat selon la locale (src/lib/dates.ts).
```

### F10 · Compétences *(~2 séances · ex-J28, J29)*

**Dépend de** : F07.

**Spec**
```
/skills (et /en/skills) regroupe les compétences par domaine. Objectif : aucune compétence déclarative.
- Chaque compétence affiche son niveau (compréhensible sans couleur et par un lecteur d'écran), depuis quand, et des liens vers les projets publiés qui la prouvent.
- Une compétence qui référence un projet inexistant fait échouer le build ; une compétence sans preuve produit un avertissement au build.
- Les données vivent dans un fichier unique, réutilisé par le CV (F11).
- L'échelle de niveau est à définir lors de la clarification.
```
**Plan**
```
Collection skills, loader file() sur src/data/skills.yaml, champ projects: z.array(reference('projects')). SkillGroup.astro et SkillLevel.astro. Regroupement par domaine dans le frontmatter de la vue (build-time, aucun JS client). Avertissement « sans preuve » émis dans le loader ou une intégration au build.
```

### F11 · CV en ligne et impression *(~3 séances · ex-J30, J33 partiel)*

**Dépend de** : F06, F09, F10.

**Spec**
```
/cv et /en/cv affichent un CV construit uniquement à partir des données existantes (campagne, expériences, formations, compétences, projets mis en avant) : aucune information n'est saisie deux fois.
- Imprimé depuis le navigateur, il tient sur une page A4 propre : sans navigation, en thème clair, liens lisibles (URL visibles).
- Aucun numéro de téléphone n'est publié en ligne. Il peut être ajouté uniquement lors d'une génération locale du PDF.
- Un PDF téléchargeable FR et EN est disponible depuis la page.
- Le levier « CV » de la campagne pointe désormais vers /cv.
```
**Plan**
```
CvView.astro réutilisant src/lib/* (projets, dates) et les collections experience, education, skills. Bloc @media print dans son <style> (@page A4, masquage Header/Footer, a[href]::after). Variable CV_PHONE lue seulement si définie (jamais en CI ni en production). Script npm cv:pdf (Playwright ou puppeteer en local) qui produit public/cv-fr.pdf et public/cv-en.pdf.
```

### ✍️ C4 – C5 · Contenu *(hors speckit)*

- [ ] **C4 · Données parcours et compétences** — entrées YAML réelles, 100 % des compétences
  avec une preuve. `content: parcours et competences`
- [ ] **C5 · Version anglaise** — accueil, À propos, parcours, compétences, CV, puis les fiches
  projets (réécrites, pas traduites). Une page par séance. `content(i18n): <page> en anglais`

---

## Phase 4 — Blog

### F12 · Blog : fondations *(~4 séances · ex-J36 – J38, J40)*

**Dépend de** : F05.

**Spec**
```
Un blog en français (non traduit), qui fait vivre le site entre deux projets.
- Chaque article : titre, description, date, tags, statut (même cycle de vie que les projets, CONTENU.md §7), langue, temps de lecture calculé automatiquement.
- /blog liste les articles publiés du plus récent au plus ancien, paginés par 10.
- Page d'article : sommaire construit depuis les titres, ancres sur les titres, articles précédent et suivant.
- Un article peut intégrer un composant interactif ou visuel du site.
- Un flux RSS complet est découvrable depuis toutes les pages.
- Un article d'exemple démontre le tout ; les vrais articles sont rédigés hors speckit (C6).
```
**Plan**
```
npx astro add mdx. Collection blog (glob sur src/content/blog/, schéma CONTENU.md §6). Plugin remark de temps de lecture (reading-time + mdast-util-to-string) déclaré dans astro.config.mjs. src/pages/blog/[...page].astro avec paginate() ; src/pages/blog/[slug].astro + PostLayout.astro (headings renvoyés par render() pour le sommaire ; rehype-slug + rehype-autolink-headings). src/pages/rss.xml.js avec @astrojs/rss alimenté par getCollection. <link rel="alternate" type="application/rss+xml"> dans BaseLayout.
```

### F13 · Blog : tags, code et articles liés *(~3 séances · ex-J39, J41)*

**Dépend de** : F12, F08.

**Spec**
```
- /tags liste les tags avec leur nombre d'articles ; /tags/<tag> liste les articles d'un tag.
- Un tag identique à une technologie de /tech fait échouer le build (espaces disjoints).
- Les blocs de code ont une coloration adaptée aux deux thèmes, un titre de fichier optionnel, des lignes mises en évidence et un bouton « copier » accessible (retour visuel et annoncé).
- En bas d'article, jusqu'à 3 articles liés par tags communs.
```
**Plan**
```
src/pages/tags/index.astro et [tag].astro (getStaticPaths). Contrôle tags ∩ technos dans le schéma (refine) ou une vérification au build réutilisant src/lib/slug.ts. Shiki via markdown.shikiConfig avec themes { light, dark } liés à data-theme + @shikijs/transformers (titre, highlight) — ou astro-expressive-code si le plan le juge plus simple. Bouton copier : petit <script> dans PostLayout. Articles liés calculés au build.
```

### ✍️ C6 · Deux premiers articles *(hors speckit)*

- [ ] Par exemple « De Vue à Astro, ce qui change » et « Dijkstra dans TrajetSim » (avec un
  composant importé dans le MDX). `content: premier article`

---

## Phase 5 — Interaction

### F14 · Formulaire de contact *(~3 séances · ex-J44)*

**Dépend de** : F06.

**Spec**
```
/contact et /en/contact proposent un formulaire qui envoie vraiment un message.
- Champs : nom, email, message. Validation côté serveur avec un message d'erreur par champ ; la saisie n'est jamais perdue en cas d'erreur.
- Anti-spam sans captcha invasif (champ piège + limite de fréquence).
- Confirmation claire après envoi ; état d'erreur explicite si l'envoi échoue.
- Fonctionne sans JavaScript. Le reste du site reste entièrement statique.
- Le message m'arrive par email. Le levier « contact » de la campagne pointe désormais vers /contact.
```
**Plan**
```
Adaptateur de l'hébergeur (npx astro add netlify | vercel | cloudflare), export const prerender = false sur la seule page contact. Astro Action dans src/actions/index.ts (accept: 'form', input zod), résultat via Astro.getActionResult(). Envoi par un service transactionnel (Resend ou équivalent), clé en variable d'environnement. Vérifier que les autres routes restent prérendues.
```

### F15 · Recherche plein texte *(~2 séances · ex-J45)*

**Dépend de** : F07, F12.

**Spec**
```
Le visiteur cherche dans tout le site (projets, articles, pages) depuis l'en-tête, ouvert aussi par la touche « / ».
- Les résultats sont limités à la langue courante ; les pages non indexables et archivées sont exclues.
- Aucun service externe : fonctionne sur le site statique. Le code de recherche n'est chargé qu'à l'ouverture.
- Utilisable entièrement au clavier.
```
**Plan**
```
Pagefind en script postbuild (attention : avec l'adaptateur de F14, le dossier statique peut être dist/client). data-pagefind-body sur le contenu principal, data-pagefind-ignore sur nav/footer, exclusion des pages noindex ; séparation par langue via l'attribut lang de <html>. Search.astro charge l'UI Pagefind à la demande (import dynamique), dialogue accessible.
```

### F16 · Images Open Graph dynamiques *(~2 séances · ex-J46)*

**Dépend de** : F07, F12.

**Spec**
```
Chaque projet, article et page principale a une image de partage générée automatiquement au build, selon le gabarit de DESIGN.md : titre, sous-titre, nom, dans la langue de la page. Si la génération échoue, l'image par défaut est utilisée. Aucune image à produire à la main.
```
**Plan**
```
Endpoint src/pages/og/[...slug].png.ts : getStaticPaths sur projets, articles et pages, GET qui rend via satori + @resvg/resvg-js, polices lues depuis src/assets/fonts. Route prérendue malgré l'adaptateur. Seo.astro calcule l'URL de l'image à partir de la page courante.
```

### F17 · Transitions et micro-animations *(~2 séances · ex-J43, J47)*

**Dépend de** : F08, F15.

**Spec**
```
- Navigation fluide entre les pages : transitions animées, en-tête persistant, liens préchargés au survol.
- Apparitions discrètes au défilement et états de survol soignés.
- Tout mouvement est désactivé si l'utilisateur demande moins d'animations.
- Aucune régression : thème, menu mobile, sélecteur de langue, filtre et recherche fonctionnent après chaque navigation.
```
**Plan**
```
<ClientRouter /> dans le <head> de BaseLayout, prefetch dans astro.config.mjs, transition:name / transition:persist sur l'en-tête. Scripts existants réinitialisés sur astro:page-load ; thème réappliqué sur astro:after-swap. Un IntersectionObserver partagé (src/scripts/reveal.ts). Toutes les animations sous @media (prefers-reduced-motion: no-preference).
```

---

## Phase 6 — Qualité et exploitation

### ✍️ C7 · Domaine *(hors speckit · ~1 h)*

- [ ] Nom de domaine + HTTPS chez l'hébergeur, mise à jour de `site` dans `astro.config.mjs`.
  `ci: nom de domaine`

### F18 · Exploitation : liens, redirections, mesure, sécurité *(~3 séances · ex-J52 partiel, J53, J54)*

**Dépend de** : C7, F14.

**Spec**
```
- La CI échoue si un lien interne ou externe du site généré est mort.
- La CI échoue si une URL publiée auparavant disparaît sans redirection. Les redirections sont déclarées en un seul endroit.
- Mesure d'audience respectueuse de la vie privée : sans cookie, sans bandeau de consentement.
- En-têtes de sécurité et politique de contenu (CSP) appliqués, compatibles avec tous les scripts du site (thème, recherche, filtre, analytics).
```
**Plan**
```
lychee sur le dossier de build dans ci.yml (avec cache et exclusions documentées). Bloc redirects d'astro.config.mjs. Liste versionnée des URL publiées (snapshot du sitemap, ex. urls.snapshot.txt) comparée au build par un script CI. Analytics (Plausible, Umami ou Cloudflare Web Analytics) en <script is:inline> dans BaseLayout. En-têtes via public/_headers ou la config de l'hébergeur ; hash CSP pour les scripts inline.
```

### F19 · Audit accessibilité et performance *(~3 séances · ex-J48, J49)*

**Dépend de** : toutes les features visuelles.

**Spec**
```
Le site atteint et conserve les cibles de CONTENU.md §10.
- Lighthouse ≥ 95 en performance et 100 en accessibilité, SEO et bonnes pratiques sur l'accueil, une page projet, un article et /en, en mobile.
- Navigation intégrale au clavier avec focus visible ; contrastes AA dans les deux thèmes ; hiérarchie de titres correcte ; textes alternatifs pertinents (vérifiés un par un).
- Accueil < 200 ko transférés ; aucun JavaScript client non justifié.
- Les écarts trouvés sont corrigés, et un contrôle automatisé en CI empêche la régression.
```
**Plan**
```
Audit axe (@axe-core/playwright ou pa11y-ci) sur une liste de pages. Lighthouse CI (@lhci/cli) dans ci.yml avec budgets (lighthouserc.json). Revue des directives client: et des images (dimensions, formats). Corrections par composant.
```

### ✍️ C8 – C10 · Clôture *(hors speckit)*

- [ ] **C8 · Page /uses** — éditeur, extensions, matériel, stack. Un `.md` suffit. `feat: page uses`
- [ ] **C9 · Relecture générale** — tout relu à voix haute, mots bannis traqués (§9),
  descriptions SEO vérifiées une par une. `content: relecture generale`
- [ ] **C10 · Clôture du chantier** — README final (architecture, comment ajouter / archiver un
  contenu, workflow speckit), archivage de `../Portfolio`, article bilan.
  `docs: readme final et archivage`

---

## Réserve d'idées

Chacune peut devenir une feature speckit plus tard.

- Commentaires de blog (giscus) · compteur de vues (server island)
- Page `/now`, rubriques `/notes`, `/reading`
- Palette de commandes (Cmd+K) · easter egg clavier
- Démos jouables · visualisation du graphe de TrajetSim
- Thème au choix (3 palettes) · PWA / hors-ligne
- Édition du contenu (Keystatic) · newsletter
- Tests end-to-end (Playwright) · reconstruction nocturne planifiée
- Statistiques GitHub au build *(écarté : peu lu, rebuild planifié à maintenir)*

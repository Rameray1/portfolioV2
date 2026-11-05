# Cadrage du contenu — Portfolio V2

Décidé le 2026-11-01. Document de référence du projet : la constitution speckit en dérive
(§1, §5, §7, §9), et chaque `/speckit.specify` peut y renvoyer (« voir CONTENU.md §6 »).

---

## 1. Finalité

**L'actif durable — le portfolio.** Un site tenu sur des années, de l'école au métier. J'y
ajoute, modifie et retire du contenu sans toucher au code, et il accueille des rubriques pas
encore prévues (notes, veille, conférences…). C'est lui qui dicte l'architecture.

**La campagne en cours — trouver un stage** (horizon ~6 mois). C'est un *réglage*, pas la
finalité : il doit se changer en quelques minutes quand l'objectif deviendra « premier emploi »
ou « freelance ».

Priorités de conception, dans l'ordre :

1. Coût de modification quasi nul.
2. Contenu = données typées, jamais du HTML.
3. URL stables : ce que je retire ne casse aucun lien partagé.
4. Campagne isolée dans quelques leviers en données (§7).
5. Optimisation pour le stage — utile maintenant, périmée dans un an.

## 2. Audiences

Hiérarchie actuelle (portée par la campagne, elle bougera) :

1. **Recruteur international (anglophone)** — filtre en 60 s : qui, quelle stack, quel niveau,
   disponible quand, mobile où, comment me joindre. → **l'anglais n'est pas un bonus.**
2. **Lead technique** — ouvre *un* projet, puis le GitHub.
3. **Recruteur FR** — réseau, école.
4. **Moi** — publier un changement en 10 minutes.

## 3. Message en une phrase

> **FR** — Élève ingénieur en alternance chez Astrée Software, je développe des applications
> Java/Spring et Angular, du modèle de données à la mise en production.

> **EN** — Software engineering student at IMT Mines Alès, currently building Java/Spring and
> Angular applications at Astrée Software.

Un rôle + une stack + une preuve, zéro adjectif. Sert aussi de `description` de l'accueil et de
texte de l'image OG. La recherche de stage vit **à côté**, dans le bandeau de disponibilité.

## 4. Les 5 preuves

Une affirmation sans page qui la prouve est supprimée.

| Promesse | Preuve | Page |
|---|---|---|
| Je livre du logiciel métier en équipe | étude de cas Astrée **anonymisée** | `/projects/alternance-astree` |
| Je résous un problème algorithmique | TrajetSim : graphe, Dijkstra, pourquoi ce choix | `/projects/trajetsim` |
| Je fais du mobile connecté | AppMeteo : Kotlin, API météo, Firebase, Maps | `/projects/appmeteo` |
| Je construis et tiens un site propre | ce portfolio : Astro, specs, CI, Lighthouse | `/projects/portfolio-v2` |
| Mes compétences ne sont pas déclaratives | chaque compétence pointe vers ses projets | `/skills` |

## 5. Arborescence et conventions

- **Code, chemins, URL et noms de champs en anglais ; prose dans la langue du contenu.**
  Le sélecteur de langue n'a ainsi qu'un préfixe `/en` à gérer, sans dictionnaire de routes.
- **Français par défaut, anglais sous `/en`** (mêmes chemins). Un projet sans traduction
  retombe sur la version française.
- **Le blog n'est pas traduit** : pas de `/en/blog`, le lien « Blog » de la nav anglaise pointe
  vers `/blog`, marqué (FR).

```
/                      accueil — pitch, disponibilité, 3 projets, CTA
/about                 récit, photo, ce que je cherche
/projects/             grille + filtre par techno
/projects/<slug>       une page par projet (archives comprises)
/tech/ · /tech/<tech>  index des technos · projets d'une techno
/background            formations + expériences, une seule frise
/skills                par domaine, niveau, liens de preuve
/cv                    généré depuis les mêmes données, imprimable
/contact               formulaire fonctionnel
/blog/ · /blog/<slug>  index paginé · article
/tags/ · /tags/<tag>   tags d'articles
/uses                  ma config
/404 · /rss.xml · /sitemap-index.xml · /og/<slug>.png
/en/…                  miroir anglais (hors blog, tags, rss)
```

- `/tech/<tech>` et `/tags/<tag>` sont des espaces **disjoints** : une techno n'est jamais un tag
  d'article.
- Rubriques futures possibles sans refonte : `/notes`, `/reading`, `/now`. Une rubrique = une
  collection + une page d'index.
- Anciennes pages `/formation`, `/alternance`, `/iut` → remplacées par `/background` + `/skills`.
  Le référentiel du BUT n'est pas recopié.

## 6. Modèle de contenu

Noms de champs en anglais, valeurs en français (ou bilingues `{ fr, en }` pour la donnée YAML).

| Collection | Source | Champs |
|---|---|---|
| `projects` | `src/content/projects/{fr,en}/<slug>.md` | `title, year, summary, tech[], links{code,demo,video}, cover, featured, status, translationKey` + récit en Markdown |
| `experience` | `src/data/experience.yaml` | `start, end?, title, place, detail` + `tech[], highlights[]` |
| `education` | `src/data/education.yaml` | `start, end?, title, place, detail` (même forme que `experience`) |
| `skills` | `src/data/skills.yaml` | `name, domain, level, since, projects[]` (références vers `projects`) |
| `blog` | `src/content/blog/<slug>.mdx` | `title, description, date, tags[], status, lang` + temps de lecture calculé |
| campagne | `src/data/campaign.ts` | les 5 leviers (§7), bilingues |
| navigation | `src/data/nav.ts` | rubriques de la nav |

Le récit d'un projet suit toujours : **contexte · problème · ce que j'ai fait · stack et
pourquoi · résultat · ce que j'en ai appris.**

## 7. Cycle de vie du contenu

**Ajouter** — 1 fichier `.md` (ou 1 entrée YAML) + 1 image dans `src/assets/`. Zéro ligne de
code. Le schéma refuse au build un contenu incomplet.

**Modifier** — une information, un seul endroit. Le CV, `/background` et `/skills` lisent les
mêmes collections.

**Retirer — on n'efface pas, on change le statut** (`projects` et `blog`) :

| `status` | Listes / vitrine | URL | Sitemap |
|---|---|---|---|
| `brouillon` | non | absente en production | non |
| `publie` | oui | oui | oui |
| `archive` | non | conservée, bandeau « contenu ancien » | non (`noindex`) |

Une vraie suppression impose une redirection (`redirects` d'`astro.config.mjs`), vérifiée en CI.

**Les 5 leviers de campagne** — en données (`src/data/campaign.ts`), jamais en code :

1. le pitch de l'accueil ;
2. le bandeau de disponibilité (quoi, à partir de quand, où) ;
3. les `featured: true` des projets mis en avant (3) ;
4. les deux appels à l'action (aujourd'hui : CV + contact) ;
5. le CV.

Changer d'objectif = modifier ces cinq points, aucune page à réécrire.

## 8. Décision sur les projets

| Projet | Décision | Pourquoi |
|---|---|---|
| **Alternance Astrée** (Java, Spring, Angular) | créer — **mis en avant** | atout n°1, absent de l'ancien site. Anonymisé |
| **TrajetSim** (Java, Dijkstra) | garder — **mis en avant** | seul projet algorithmique |
| **AppMeteo** (Kotlin, Firebase, Maps) | garder — **mis en avant** | mobile + API + géoloc, le plus complet |
| **Sportify** (PHP, web social) | garder | projet d'équipe avec démo vidéo |
| **MinhList** (Symfony) | garder, fiche courte | CRUD + auth, sans survente |
| **Portfolio V2** (Astro) | créer | preuve de rigueur : specs, CI, perf |
| **Crousty'kebab** (HTML/CSS/JS) | `archive` | 1ʳᵉ année, hors vitrine, URL conservée |
| **Annuaire 1.0** (C) | `archive` | idem |

→ 6 fiches publiées, 3 mises en avant, 2 archivées.

**Fiche Astrée** : pas de nom de client, pas de capture, pas de chiffre confidentiel.
**Accord du tuteur avant publication.**

## 9. Règles d'écriture

1. Mots **bannis** : passionné · jeune développeur · encore en étude · en quête de nouveaux
   défis · relever de nouveaux défis · performant · innovant · adapté aux besoins des utilisateurs.
2. Toute phrase porte **une date, un chiffre, une techno ou un lien**. Sinon elle est coupée.
3. Première personne, phrases courtes.
4. Un projet se raconte par **le problème**, pas par la liste des technos.
5. Rien de daté en dur (« actuellement en 1ʳᵉ année ») : la date vient de la donnée.
6. L'anglais est **réécrit**, pas traduit. Mêmes règles.
7. Si je ne le dirais pas en entretien, ça ne va pas sur le site.
8. **Pas de numéro de téléphone en ligne**, nulle part.

## 10. Critères de réussite

| Critère | Cible |
|---|---|
| Ajouter un projet | 1 fichier `.md`, 0 ligne de code |
| Retirer un projet | 1 champ `status`, URL conservée |
| CV ↔ site | une seule source |
| Pages indexables | ~25 FR + ~12 EN, `title` / `description` uniques à 100 % |
| Image OG | générée par projet et article |
| Poids de l'accueil (transféré) | < 200 ko |
| Lighthouse perf / a11y / SEO | ≥ 95 / 100 / 100 |
| JS envoyé au navigateur | 0 ko par défaut, sauf îlots justifiés |
| Compétences avec preuve | 100 % |
| Liens morts | 0, vérifié en CI |
| Version anglaise | miroir complet (hors blog) |
| Commits | 100 % conventionnels |

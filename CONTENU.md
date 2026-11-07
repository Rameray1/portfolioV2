# Cadrage du contenu — Portfolio V2

Décidé le 2026-11-01, simplifié le 2026-11-07 (KISS / YAGNI). Document de référence du projet :
la constitution speckit en dérive (§1, §5, §7, §9), et chaque `/speckit-specify` peut y renvoyer
(« voir CONTENU.md §6 »).

---

## 1. Finalité

**L'actif durable — le portfolio.** Un site **statique**, tenu sur des années, de l'école au
métier. J'y ajoute, modifie et retire du contenu sans toucher au code, et il accueille des
rubriques pas encore prévues (notes, veille, conférences…). C'est lui qui dicte l'architecture.

**La campagne en cours — trouver un stage** (horizon ~6 mois). C'est un *réglage*, pas la
finalité : il doit se changer en quelques minutes quand l'objectif deviendra « premier emploi »
ou « freelance ».

Priorités de conception, dans l'ordre :

1. Coût de modification quasi nul.
2. Contenu = données typées, jamais du HTML.
3. Simplicité : rien qui ne serve pas maintenant (KISS, YAGNI). Une fonctionnalité s'ajoute
   le jour où le besoin est réel.
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
texte de l'image de partage. La recherche de stage vit **à côté**, dans le bandeau de
disponibilité.

## 4. Les preuves

Une affirmation sans page qui la prouve est supprimée. Les projets changent avec le temps, les
promesses restent : chaque promesse doit avoir **au moins une page publiée** qui la prouve.

| Promesse | Type de preuve |
|---|---|
| Je livre du logiciel métier en équipe | une étude de cas d'entreprise (anonymisée) |
| Je résous des problèmes techniques non triviaux | un projet raconté par le problème et le choix fait |
| Je construis et tiens un site propre | ce portfolio : Astro, specs, CI, Lighthouse |
| Mes compétences ne sont pas déclaratives | chaque compétence pointe vers ses projets (`/skills`) |

## 5. Arborescence et conventions

- **Code, chemins, URL et noms de champs en anglais ; prose dans la langue du contenu.**
  Le sélecteur de langue n'a ainsi qu'un préfixe `/en` à gérer, sans dictionnaire de routes.
- **Français par défaut, anglais sous `/en`** (mêmes chemins). Un projet sans traduction
  retombe sur la version française.
- **Le blog n'est pas traduit** : pas de `/en/blog`, le lien « Blog » de la nav anglaise pointe
  vers `/blog`, marqué (FR).
- **Pas de serveur** : tout est généré au build. Le contact passe par email et LinkedIn.

```
/                      accueil — pitch, disponibilité, projets mis en avant, CTA
/about                 récit, photo, ce que je cherche
/projects/             liste des projets
/projects/<slug>       une page par projet
/background            formations + expériences, une seule frise
/skills                par domaine, niveau, liens de preuve
/cv                    généré depuis les mêmes données, imprimable
/blog/ · /blog/<slug>  liste · article (FR uniquement)
/404 · /rss.xml · /sitemap-index.xml
/en/…                  miroir anglais (hors blog et rss)
```

- Rubriques futures possibles sans refonte : `/notes`, `/now`, `/uses`… Une rubrique = une
  collection + une page d'index.
- Anciennes pages `/formation`, `/alternance`, `/iut` → remplacées par `/background` + `/skills`.

## 6. Modèle de contenu

Noms de champs en anglais. Une donnée non textuelle (date, stack, liens, image) n'existe qu'une
fois ; seule la prose existe par langue.

| Collection | Source | Champs |
|---|---|---|
| `projects` | `src/content/projects/fr/<slug>.md` | `title, year, summary, tech[], links{code,demo,video}, cover, featured, draft` + récit |
| `projects` (EN) | `src/content/projects/en/<slug>.md` (même slug) | `title, summary` + récit — le reste vient de la version FR |
| `experience` | `src/data/experience.yaml` | `start, end?, title, place, detail` + `tech[], highlights[]` (prose `{ fr, en }`) |
| `education` | `src/data/education.yaml` | `start, end?, title, place, detail` (même forme que `experience`) |
| `skills` | `src/data/skills.yaml` | `name, domain, level, since, projects[]` (au moins une référence vers `projects`) |
| `blog` | `src/content/blog/<slug>.md` | `title, description, date, draft` + article |
| campagne | `src/data/campaign.ts` | les 5 leviers (§7), bilingues |
| navigation | `src/data/nav.ts` | rubriques de la nav |

Le récit d'un projet suit toujours : **contexte · problème · ce que j'ai fait · stack et
pourquoi · résultat · ce que j'en ai appris.**

## 7. Cycle de vie du contenu

**Ajouter** — 1 fichier `.md` (ou 1 entrée YAML) + 1 image dans `src/assets/`. Zéro ligne de
code. Le schéma refuse au build un contenu incomplet.

**Préparer** — `draft: true` : le contenu existe en local, il est absent en production.

**Modifier** — une information, un seul endroit. Le CV, `/background` et `/skills` lisent les
mêmes collections.

**Retirer** — on supprime le fichier et on ajoute une redirection vers la liste
(`redirects` d'`astro.config.mjs`), pour qu'aucun lien déjà partagé ne casse.

**Les 5 leviers de campagne** — en données (`src/data/campaign.ts`), jamais en code :

1. le pitch de l'accueil ;
2. le bandeau de disponibilité (quoi, à partir de quand, où) ;
3. les `featured: true` des projets mis en avant (3 au plus) ;
4. les deux appels à l'action (aujourd'hui : CV + email) ;
5. le CV.

Changer d'objectif = modifier ces cinq points, aucune page à réécrire.

## 8. Choix des projets

- **10 projets au plus** au lancement ; **3 mis en avant**.
- Un projet est publié s'il apporte une preuve (§4) ; sinon il n'est pas publié. Les anciens
  projets ne sont pas une base : ils sont remplacés au fil du temps.
- La sélection se décide au moment de la rédaction (C2), pas dans ce document.
- **Projet d'entreprise** : anonymisé — pas de nom de client, pas de capture, pas de chiffre
  confidentiel.

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
| Retirer un projet | 1 fichier supprimé + 1 redirection |
| CV ↔ site | une seule source |
| Pages indexables | `title` / `description` uniques à 100 % |
| Poids de l'accueil (transféré) | < 200 ko |
| Lighthouse perf / a11y / bonnes pratiques / SEO | ≥ 95 / 100 / 100 / 100 |
| JS envoyé au navigateur | 0 ko par défaut, sauf amélioration justifiée |
| Serveur | aucun : site 100 % statique |
| Compétences avec preuve | 100 % (vérifié au build) |
| Liens morts | 0, vérifié en CI |
| Version anglaise | miroir complet (hors blog) |
| Commits | 100 % conventionnels |

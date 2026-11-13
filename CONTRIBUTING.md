# Contribuer — Portfolio V2

Guide de maintenance du projet : installation, commandes, CI, workflow speckit et conventions.
La présentation du projet est dans le [`README.md`](./README.md).

## Documents du projet

| Fichier                           | Rôle                                                                                                           |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| [`CONTENU.md`](./CONTENU.md)      | Le cadrage : finalité, audiences, URL, modèle de contenu, règles d'écriture. La référence de toutes les specs. |
| [`ROADMAP.md`](./ROADMAP.md)      | L'ordre de construction et, pour chaque feature, les blocs à donner à speckit.                                 |
| [`DESIGN.md`](./DESIGN.md)        | La direction visuelle : palette, typographie, espacements, états.                                              |
| `.specify/memory/constitution.md` | Les principes non négociables, vérifiés à chaque plan.                                                         |
| `specs/NNN-feature/`              | Spec, plan et tâches de chaque feature, générés par speckit.                                                   |

## Prérequis

- Node 22 : la version est fixée dans [`.nvmrc`](./.nvmrc). Avec nvm : `nvm use` (ou
  `nvm install` la première fois).
- npm (fourni avec Node).

## Installation

```sh
git clone git@github.com:Rameray1/portfolioV2.git
cd portfolioV2
nvm use
npm install
npm run dev       # site local sur http://localhost:4321
```

Pour un agent : `astro dev --background`, puis `astro dev stop | status | logs` (voir `AGENTS.md`).

## Commandes

| Commande          | Rôle                                                                   |
| ----------------- | ---------------------------------------------------------------------- |
| `npm run dev`     | Serveur de développement sur http://localhost:4321.                    |
| `npm run format`  | Formate tout le projet (Prettier, fichiers `.astro` compris).          |
| `npm run check`   | Vérifie le formatage puis les types (`astro check`) ; ne modifie rien. |
| `npm run build`   | Build de production statique dans `./dist/`.                           |
| `npm run preview` | Sert le build localement pour le prévisualiser.                        |

**Avant chaque commit** : `npm run check && npm run build` doivent passer. En cas d'échec de
formatage, `npm run format` corrige ; une erreur de type indique le fichier et la ligne.

## Intégration continue

À chaque pull request vers `main` (et à chaque push sur `main`, merges compris), GitHub Actions
([`.github/workflows/ci.yml`](./.github/workflows/ci.yml)) exécute `npm ci`, `npm run check`
puis `npm run build`. Un échec passe le check `CI / check-and-build` au rouge.

`main` est protégée par le ruleset `main` (GitHub → **Settings** → **Rules** → **Rulesets**),
sans contournement possible :

- passage obligatoire par une PR (aucune approbation requise, conversations résolues) ;
- check `check-and-build` vert et branche à jour avec `main` avant de fusionner ;
- fusion en _squash_ uniquement ;
- suppression et force push interdits.

## Workflow speckit

Une feature = une branche `NNN-nom`, fusionnée dans `main` par PR quand elle est finie et que
la CI est verte :

```
/speckit-specify → /speckit-clarify → /speckit-plan → /speckit-tasks → /speckit-implement
```

- `/speckit-specify` reçoit le bloc « Spec » de la feature (quoi et pourquoi, sans techno) ;
  `/speckit-plan` reçoit le bloc « Plan » (comment). Les deux blocs sont dans
  [`ROADMAP.md`](./ROADMAP.md).
- `/speckit-clarify` seulement si la spec contient des `[NEEDS CLARIFICATION]` ;
  `/speckit-analyze` (optionnel) vérifie la cohérence spec / plan / tâches.
- Les artefacts de chaque feature vivent dans `specs/NNN-nom/`.

## Conventions

- **Code, chemins, URL et noms de champs en anglais ; prose dans la langue du contenu.**
- **Français par défaut, anglais sous `/en`**, avec les mêmes chemins. Le blog reste en français.
- **Le contenu est de la donnée** (`src/content/`, `src/data/`) : ajouter un projet = un fichier
  `.md`, zéro ligne de code.
- **Site 100 % statique**, zéro JavaScript client par défaut. KISS / YAGNI : rien « au cas où ».
- **SEO** : une page passe `title` et `description` à `BaseLayout` ; canonique, aperçu de
  partage, liens alternatifs et plan du site en découlent. `image` est optionnelle. Page non
  indexable : son chemin dans `src/data/seo.ts`. Site entier : `PUBLIC_NOINDEX=true` chez
  l'hébergeur.
- **Campagne** : changer d'objectif = modifier `src/data/campaign.ts` seulement (phrase
  d'identité, disponibilité avec `visible` pour la masquer, les deux actions). Un CV par
  langue = `href: { fr, en }` ; le CV passe alors en première action (bouton plein), l'email en
  seconde. Les projets mis en avant restent le drapeau `featured` de chaque projet (F06). La
  position du diagramme est une FEN dans `src/data/diagram.ts`.
- **Projet** : ajouter un projet = une fiche `src/content/projects/fr/<slug>.md` (champs de
  `CONTENU.md` §6) et, s'il a un visuel, une image dans `src/assets/projects/`. La version
  anglaise `src/content/projects/en/<slug>.md` ne porte que la prose et peut venir plus tard :
  d'ici là, `/en/projects/<slug>` affiche le français. `featured: true` (trois au plus, avec
  son `move`) met le projet sur l'accueil. Dans le récit, `> ! texte` isole une phrase comme
  note du commentateur, avec son symbole dans la marge ; `![alt](image "Légende")` ajoute une
  image de preuve légendée (`CONTENU.md` §6).
- **Brouillon** : `draft: true`. **Retirer** un contenu : supprimer le fichier + une redirection
  dans `astro.config.mjs`.
- Commits conventionnels (`feat`, `fix`, `content`, `chore`, `docs`, `perf`, `a11y`, `ci`).

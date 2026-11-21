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
- Tectonic, pour le CV PDF que `npm run build` compile : `brew install tectonic`. La CI et
  Vercel l'installent avec [`scripts/install-tectonic.sh`](./scripts/install-tectonic.sh)
  (version et empreinte fixées). Au premier build, Tectonic télécharge ses paquets LaTeX, puis
  les garde en cache.

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
([`.github/workflows/ci.yml`](./.github/workflows/ci.yml)) exécute `npm ci`, installe Tectonic,
`npm run check`, `npm run build`, puis vérifie les liens du site généré avec lychee
(pages, ancres, fichiers et liens externes ; exclusions et relances dans
[`lychee.toml`](./lychee.toml)). Un échec passe le check `CI / check-and-build` au rouge.

Pour vérifier les liens en local (`brew install lychee`), après `npm run build` :

```sh
lychee --config lychee.toml --root-dir "$PWD/dist" \
  --remap "https://ramazankus\.dev/(.*) file://$PWD/dist/\$1" 'dist/**/*.html' 'dist/sitemap-*.xml'
```

`main` est protégée par le ruleset `main` (GitHub → **Settings** → **Rules** → **Rulesets**),
sans contournement possible :

- passage obligatoire par une PR (aucune approbation requise, conversations résolues) ;
- check `check-and-build` vert et branche à jour avec `main` avant de fusionner ;
- fusion par commit de fusion uniquement (ni _squash_ ni _rebase_), pour garder un commit
  par user story dans l'historique de `main` ;
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
  partage, liens alternatifs et plan du site en découlent. Site entier hors index :
  `PUBLIC_NOINDEX=true` chez l'hébergeur.
- **Campagne** : changer d'objectif = modifier `src/data/campaign.ts` seulement (phrase
  d'identité, disponibilité avec `visible` pour la masquer, les deux actions). Aujourd'hui, le
  CV (`href: { fr, en }`) en première action (bouton plein), l'email en seconde. Les projets
  mis en avant restent le drapeau `featured` de chaque projet (F06). La position du
  diagramme est une FEN dans `src/data/diagram.ts`.
- **Parcours** : ajouter une étape = une entrée dans `src/data/experience.yaml` ou
  `src/data/education.yaml` (champs de `CONTENU.md` §6). Dates au format `AAAA-MM`, sans `end`
  tant que l'étape est en cours. Prose en `fr` et en `en`, sans date dans les textes. Chaque
  fichier garde au moins une entrée.
  `detail` dit la mission principale en une phrase, `highlights` le reste du rôle, sans
  reprendre un projet déjà publié dans `/projects`.
- **Compétence** : ajouter une compétence = une entrée dans `src/data/skills.yaml`, dont la
  clé est un identifiant en anglais (`typescript`). `name` est une chaîne pour un nom propre,
  `{ fr, en }` pour un nom commun. `domain` vaut `frontend`, `backend`, `data` ou `tools`,
  `level` vaut `basics`, `proficient`, `advanced` ou `expert`. Il faut au moins une preuve :
  `projects` cite des projets publiés par leur slug, `background` des étapes du parcours par
  leur clé (`astree-internship`), pour un outil pratiqué en entreprise sans projet publié. Le
  build échoue sur un champ manquant ou inconnu, une preuve absente, en brouillon ou citée
  deux fois, ou un nom déjà pris. Une bibliothèque vue dans un seul projet reste dans les
  technologies du projet.
- **CV** : `/cv` et les PDF `/cv-fr.pdf`, `/cv-en.pdf` n'ont aucune donnée propre. Ils lisent
  le site, la campagne, le parcours, les compétences et les projets mis en avant. Seules les
  langues ont leur fichier : ajouter une langue = une entrée dans `src/data/languages.yaml`
  (`rank`, `name` et `level` en `{ fr, en }`). La mise en page du PDF est
  `src/cv/template.tex`. Le build échoue si un PDF ne compile pas, déborde d'une page ou
  contient un caractère absent de la police. En `npm run dev`, le PDF est compilé à chaque
  téléchargement, avec la même vérification. Jamais de numéro de téléphone.
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

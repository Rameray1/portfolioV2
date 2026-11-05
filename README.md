# Portfolio V2

Mon portfolio personnel, reconstruit de zéro avec [Astro](https://astro.build). Chaque feature est développée avec [spec-kit](https://github.com/github/spec-kit).

> 🚧 En construction. Avancement : [`ROADMAP.md`](./ROADMAP.md).

## Documents du projet

| Fichier | Rôle |
|---|---|
| [`CONTENU.md`](./CONTENU.md) | Le cadrage : finalité, audiences, URL, modèle de contenu, règles d'écriture. La référence de toutes les specs. |
| [`ROADMAP.md`](./ROADMAP.md) | L'ordre de construction et, pour chaque feature, les blocs à donner à speckit. |
| `DESIGN.md` | La direction visuelle *(à venir, étape 0)*. |
| `.specify/memory/constitution.md` | Les principes non négociables, vérifiés à chaque plan *(à venir, étape 0)*. |
| `specs/NNN-feature/` | Spec, plan et tâches de chaque feature, générés par speckit. |

## Démarrer

Prérequis : Node ≥ 22.

```sh
npm install
npm run dev       # serveur local sur http://localhost:4321
npm run build     # build de production dans ./dist/
npm run preview   # prévisualise le build
```

Pour un agent : `astro dev --background`, puis `astro dev stop | status | logs` (voir `AGENTS.md`).

## Workflow

Une feature = une branche speckit, fusionnée dans `main` quand elle est finie :

```
/speckit.specify → /speckit.clarify → /speckit.plan → /speckit.tasks → /speckit.implement
```

Les blocs « Spec » et « Plan » de chaque feature sont dans `ROADMAP.md`.

## Conventions

- **Code, chemins, URL et noms de champs en anglais ; prose dans la langue du contenu.**
- **Français par défaut, anglais sous `/en`**, avec les mêmes chemins. Le blog reste en français.
- **Le contenu est de la donnée** (`src/content/`, `src/data/`) : ajouter un projet = un fichier
  `.md`, zéro ligne de code.
- **On n'efface pas, on archive** : `status: brouillon | publie | archive`.
- Commits conventionnels (`feat`, `fix`, `content`, `chore`, `docs`, `perf`, `a11y`, `ci`).

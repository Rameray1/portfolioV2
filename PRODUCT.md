# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Hiérarchie actuelle, portée par la campagne de stage (elle bougera ; voir `CONTENU.md` §2) :

1. **Recruteur international (anglophone)** : il trie en 60 secondes. Il cherche qui, quelle
   stack, quel niveau, disponible quand, mobile où, comment joindre. L'anglais est une
   exigence, pas un bonus.
2. **Lead technique** : il ouvre _un_ projet, puis le GitHub. Il juge sur la preuve.
3. **Recruteur FR** : il vient du réseau ou de l'école.
4. **Le propriétaire (Ramazan Kus)** : il publie un changement en 10 minutes, sans toucher au
   code.

## Product Purpose

Portfolio personnel de Ramazan Kus, élève ingénieur à IMT Mines Alès, en alternance chez Astrée
Software (Java/Spring, Angular).

- **Actif durable** : un site statique tenu sur des années, de l'école au métier. Le contenu
  s'ajoute, se modifie et se retire sans code, et le site accueille des rubriques futures.
- **Campagne en cours** : trouver un stage (horizon ~6 mois). C'est un réglage en données, pas
  la finalité. Il doit pouvoir passer à « premier emploi » ou « freelance » en quelques minutes.

Réussite : un recruteur sait en 60 s qui, quoi, quand, où et comment joindre. Un lead technique
trouve dans un projet la preuve de ce qui est affirmé. Les cibles chiffrées sont dans
`CONTENU.md` §10.

## Positioning

Deux preuves qui se renforcent. Un autre élève ingénieur Java/Angular ne peut pas les copier
honnêtement :

1. **De la production réelle, de bout en bout** : logiciel métier livré en équipe en alternance,
   du modèle de données à la mise en production. La preuve est une étude de cas d'entreprise
   anonymisée.
2. **De la méthode, rendue visible** : ce portfolio lui-même (Astro, specs speckit, CI,
   Lighthouse, commits conventionnels) prouve la rigueur.

Message en une phrase (`CONTENU.md` §3) : un rôle, une stack, une preuve, zéro adjectif.

## Operating Context

- Le recruteur lit souvent sur mobile, vite, dans un tri de candidatures. Il en sort avec le CV
  ou l'email.
- Le lead technique passe du site au GitHub et lit un récit de projet en entier.
- Le CV en ligne (`/cv`) s'imprime depuis le navigateur sur une page A4 et existe aussi en PDF
  FR/EN.
- Le propriétaire travaille par features speckit, au rythme d'un commit par jour (`ROADMAP.md`).

## Capabilities and Constraints

- **Site 100 % statique**, zéro JavaScript client par défaut. Aucun serveur : le contact passe
  par email et LinkedIn (constitution, principes I–II).
- **Bilingue** : français par défaut, anglais sous `/en` avec les mêmes chemins. L'anglais est
  réécrit, pas traduit. Le blog reste en français.
- **Le contenu est de la donnée typée**, validée au build. Une information vit à un seul
  endroit, et le CV, `/background` et `/skills` lisent les mêmes collections.
- **Cinq leviers de campagne en données** (`src/data/campaign.ts`) : pitch, bandeau de
  disponibilité, projets mis en avant (3 au plus), deux appels à l'action, CV.
- **Arborescence** : `/`, `/about`, `/projects`, `/projects/<slug>`, `/background`, `/skills`,
  `/cv`, `/blog`, `/404`, plus le miroir `/en/…` (`CONTENU.md` §5).
- **Thème** : il suit le système du visiteur (clair/sombre), sans bouton (bouton en réserve).
- **Performance** : accueil < 200 ko transférés. Lighthouse mobile ≥ 95 en perf, 100 en a11y,
  bonnes pratiques et SEO.
- **KISS / YAGNI** : rien « au cas où ». Les idées futures vont dans la réserve de `ROADMAP.md`.
- **Interdits** : aucun numéro de téléphone publié. Aucun texte copié de l'ancien portfolio.
  Projet d'entreprise anonymisé (pas de nom de client, pas de capture, pas de chiffre
  confidentiel).

## Brand Commitments

- **Nom affiché** : Ramazan Kus.
- **Voix** (`CONTENU.md` §9) : première personne, phrases courtes, factuelles. Chaque phrase
  porte une date, un chiffre, une techno ou un lien. Un projet se raconte par le problème.
- **Mots bannis** : passionné, jeune développeur, encore en étude, en quête de nouveaux défis,
  relever de nouveaux défis, performant, innovant, adapté aux besoins des utilisateurs.
- « Si je ne le dirais pas en entretien, ça ne va pas sur le site. »
- Pas de logo ni d'identité visuelle établie. La direction visuelle sera fixée dans `DESIGN.md`
  (étape 0 de `ROADMAP.md`).

## Evidence on Hand

- **Photo de profil** : `../pp.jpg` (hors du dépôt, ~6,9 Mo). C'est la photo retenue. Elle
  reste en place pour l'instant : elle sera compressée et importée dans `src/assets/` plus tard
  (F05). Elle remplace `profile-pic.jpg` de l'ancien portfolio, qui n'est plus utilisée.

Réutilisables depuis l'ancien portfolio (`../Portfolio`), confirmés :

- **CV PDF actuel** : `../Portfolio/public/RamazanKus_CV.pdf`, valable jusqu'au CV généré (F09).
- **Visuels de projets** : `../Portfolio/src/assets/images/` (annuaire, appmeteo, croustykebab,
  minhlist, saejava, sportify). Ils servent seulement si le projet est republié avec une preuve
  (`CONTENU.md` §8).

Absences à ne pas combler par invention :

- Aucun témoignage, aucune recommandation, aucune presse, aucun chiffre public.
- Pas encore d'étude de cas d'entreprise (C3), de fiches projets (C2) ni d'articles (C6).
- Aucun texte définitif : il est rédigé hors speckit (C1–C8).
- Aucune capture de l'application d'entreprise, jamais.

## Product Principles

1. **Une affirmation sans page qui la prouve est supprimée.** Chaque promesse renvoie à une
   preuve publiée.
2. **Le recruteur décide en 60 secondes** : qui, stack, niveau, disponibilité, contact,
   visibles sans effort, dans les deux langues.
3. **Coût de modification quasi nul** : une donnée, un seul endroit, et zéro ligne de code pour
   ajouter un contenu.
4. **La campagne est un réglage, pas l'identité** : rien de propre au stage n'est gravé dans les
   pages.
5. **Le site est lui-même une preuve** : sa sobriété technique et sa qualité mesurable font
   partie du propos.

## Accessibility & Inclusion

WCAG 2.2 AA sur toutes les pages, dans les deux thèmes. Navigation complète au clavier, lien
d'évitement en premier focusable. Niveaux de compétence compréhensibles sans la couleur et par
un lecteur d'écran. Mouvement désactivé sous `prefers-reduced-motion: reduce`. Lighthouse a11y
à 100.

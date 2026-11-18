# Feature Specification: Compétences

**Feature Branch**: `008-skills`

**Created**: 2026-11-18

**Status**: Draft

**Input**: User description: "/skills (et /en/skills) regroupe les compétences par domaine. Objectif : aucune compétence déclarative.

- Chaque compétence affiche son niveau (compréhensible sans couleur et par un lecteur d'écran), depuis quand, et des liens vers les projets publiés qui la prouvent.
- Une compétence sans projet de preuve, ou qui référence un projet inexistant, fait échouer le build.
- Les données vivent dans un fichier unique, réutilisé par le CV (F09).
- L'échelle de niveau est à définir lors de la clarification."

## Clarifications

### Session 2026-11-18

- Q: Quelle échelle de niveau ? → A: Trois niveaux, « Notions » / « Basics » (utilisé en
  projet guidé), « Autonome » / « Proficient » (livre seul un projet réel), « Avancé » /
  « Advanced » (fait des choix d'architecture, peut former).
- Q: Quels domaines, dans quel ordre ? → A: Quatre domaines, Front-end · Back-end ·
  Données · Outils et méthodes (EN : Front-end · Back-end · Data · Tools and methods). Un
  langage va dans le domaine où il sert le plus (TypeScript en front-end). Une bibliothèque
  vue dans un seul projet (Leaflet, Socket.IO) reste dans les technologies du projet, sans
  être une compétence (tri fait en C4).
- Q: Le niveau exige-t-il un nombre minimum de projets de preuve ? → A: Non. Au moins un
  projet, quel que soit le niveau.
- Q: Comment le niveau se montre-t-il, et où lit-on sa définition ? → A: Le mot du niveau,
  accompagné de trois cases décoratives (une, deux ou trois pleines) ; les définitions sont
  données une fois, dans une légende en tête de page.

### Session 2026-11-18 (revue de l’implémentation)

- Q: Les trois cases évoquent-elles assez les échecs ? → A: Non. Chaque niveau porte une
  pièce : un pion pour « Notions », un cavalier pour « Autonome », une dame pour « Avancé »,
  les pièces du parcours (noires en clair, blanches en sombre). Le mot du niveau reste écrit.
- Q: Les définitions des niveaux sont-elles justes ? → A: Non : « projet guidé », « livre
  seul un projet » et « peut former » ne valent pas pour toutes les compétences. Nouvelles
  définitions : « j’en ai les bases, sans pratique régulière » / « I know the basics, without
  regular practice » ; « je livre avec, en cherchant au besoin » / « I ship with it, looking
  things up when needed » ; « je le pratique au quotidien et j’en connais les pièges » / « I
  use it daily and know its pitfalls ».
- Q: Sur mobile, le passage d’un domaine à l’autre se voit-il ? → A: Mal, la page se lit
  comme une seule liste. Sur mobile, le titre du domaine reste en haut de l’écran le long de
  son domaine ; le domaine suivant le remplace. Le grand écran ne change pas.
- Q: Quels niveaux pour Java, Spring et Angular ? → A: « Avancé » : le mainteneur les
  pratique chaque jour en entreprise. Jira est ajouté (« Autonome »).
- Q: L’année « depuis » est-elle utile ? → A: Non. Elle donne la date du premier contact, pas
  une durée de pratique : « depuis 2022 » pour PHP vu une fois est trompeur. La fréquence est
  déjà dans la définition du niveau, l’ancienneté sur la stack dans le parcours. Le champ
  est retiré.
- Q: Sur grand écran, sans la colonne de l’année, la droite de la page est vide. Que faire ?
  → A: Un tableau par domaine sur toute la largeur, en colonnes proportionnelles (nom,
  niveau, preuves). Le titre du domaine tient la ligne d’en-têtes, avec « Niveau » et
  « Preuves » au-dessus de leurs colonnes, purement visuels. Deux colonnes de domaines ou de
  compétences ont été essayées et écartées : les hauteurs ne s’alignaient pas.
- Q: Un effet au survol, comme sur le parcours ? → A: Oui, sur écran à pointeur : la ligne
  survolée reste à l’encre, sa pièce avance d’un pas (sauf sous `prefers-reduced-motion`),
  les autres lignes de la page passent en encre atténuée. Pas d’inversion, la ligne n’est pas
  un lien.
- Q: Un carré rouge sur cette page ? → A: Non. Aucun état en cours à signaler ; le rouge
  serait décoratif (règle du rouge de `DESIGN.md`).

## User Scenarios & Testing _(mandatory)_

Acteurs : le **recruteur** (international anglophone d'abord, puis francophone), le **lead
technique** et le **mainteneur** (seul auteur du site, `CONTENU.md` §2).

### User Story 1 - Lire les compétences par domaine (Priority: P1)

Un recruteur ouvre `/skills` (ou `/en/skills`). Il voit les compétences rangées par domaine.
Chaque compétence donne son nom, son niveau et les projets qui la prouvent. En une lecture, il sait ce que le mainteneur sait faire et à quel point.

**Why this priority**: le recruteur filtre sur la stack et le niveau (`CONTENU.md` §2). Le
lien « Compétences » de la navigation mène aujourd'hui à une page introuvable.

**Independent Test**: avec des compétences dans au moins deux domaines, ouvrir `/skills` puis
`/en/skills` ; chaque domaine forme un groupe titré, chaque compétence affiche nom, niveau et
ses preuves, et les libellés sont dans la langue de la page.

**Acceptance Scenarios**:

1. **Given** des compétences de plusieurs domaines, **When** le visiteur ouvre `/skills`,
   **Then** il voit un groupe par domaine, chacun sous un titre, dans un ordre fixe.
2. **Given** une compétence, **When** elle s'affiche, **Then** elle montre son nom et son
   niveau.
3. **Given** un niveau, **When** il s'affiche, **Then** il se lit en mots, accompagné de sa
   pièce ; il ne dépend ni de la couleur ni de la pièce seule, et un lecteur d’écran
   l’annonce en mots, sans lire la pièce.
4. **Given** un domaine, **When** ses compétences s'affichent, **Then** elles sont triées du
   niveau le plus haut au plus bas, puis par nom.
5. **Given** `/en/skills`, **When** le visiteur l'ouvre, **Then** titres de domaine, niveaux
   et libellés sont en anglais ; les compétences et leur ordre sont les mêmes
   qu'en français.
6. **Given** la page, **When** le visiteur utilise le sélecteur de langue, **Then** il arrive
   sur la même page dans l'autre langue.
7. **Given** la page, **When** un moteur la lit, **Then** elle a un titre et une description
   propres dans chaque langue, et ses liens alternatifs relient les deux langues (F04).
8. **Given** un lecteur d'écran, **When** il parcourt la page, **Then** chaque domaine est un
   intertitre suivi de la liste de ses compétences.
9. **Given** la page, **When** le visiteur arrive en haut, **Then** une légende donne les
   trois niveaux, leur pièce et leur définition, une seule fois.
10. **Given** un écran à pointeur, **When** le visiteur survole une compétence, **Then** elle
    reste à l’encre, sa pièce avance d’un pas et les autres passent en encre atténuée ; rien
    ne laisse croire que la ligne est un lien.

---

### User Story 2 - Vérifier une compétence par ses projets (Priority: P1)

Un lead technique doute d'une compétence. Sous elle, il trouve les liens vers les projets
publiés qui la prouvent. Il ouvre l'un d'eux et lit le projet dans la langue de la page.

**Why this priority**: c'est l'objectif de la feature, « aucune compétence déclarative »
(`CONTENU.md` §4, critère « Compétences avec preuve : 100 % », §10).

**Independent Test**: ouvrir `/skills`, suivre chaque lien de preuve ; tous mènent à une page
projet publiée, dans la langue de la page, et aucun lien n'est mort.

**Acceptance Scenarios**:

1. **Given** une compétence, **When** elle s'affiche, **Then** elle donne au moins un lien
   vers un projet qui la prouve, nommé par le titre du projet.
2. **Given** `/skills`, **When** le visiteur suit un lien de preuve, **Then** il arrive sur
   la page du projet en français ; depuis `/en/skills`, sur la version anglaise du projet
   (ou sa version française si le projet n'est pas traduit, comme ailleurs sur le site).
3. **Given** une compétence prouvée par plusieurs projets, **When** elle s'affiche, **Then**
   tous ses projets apparaissent, du plus récent au plus ancien.
4. **Given** un lecteur d'écran, **When** il lit un lien de preuve, **Then** le lien se
   comprend hors contexte (il nomme le projet).

---

### User Story 3 - Lire les compétences sur mobile (Priority: P1)

Le recruteur ouvre la page sur son téléphone. Chaque compétence s’empile : nom et niveau,
puis les liens de preuve. Rien ne dépasse de l'écran.

**Why this priority**: la constitution (principe VII) impose la vérification à 375 px.

**Independent Test**: ouvrir la page à 375 px et à 1280 px, en clair et en sombre ; aucune
barre de défilement horizontale, aucun niveau ni lien coupé ou superposé, en-tête et pied de
page compris.

**Acceptance Scenarios**:

1. **Given** un écran de 375 px, **When** la page s'affiche, **Then** elle ne défile pas
   horizontalement et chaque compétence reste lisible sans zoom.
2. **Given** un écran de 375 px, **When** une compétence a un nom long ou beaucoup de
   projets, **Then** le texte passe à la ligne sans chevaucher le niveau.
3. **Given** le thème sombre, **When** la page s'affiche à 375 px et à 1280 px, **Then** les
   contrastes respectent les seuils de `DESIGN.md`.
4. **Given** un écran tactile, **When** le visiteur touche un lien de preuve, **Then** la
   cible mesure au moins 24 × 24 px, ou est assez espacée de ses voisines pour qu'un cercle
   de 24 px centré sur elle n'en touche aucune (WCAG 2.2, critère 2.5.8).
5. **Given** un écran de 375 px, **When** le visiteur fait défiler un domaine, **Then** son
   titre reste en haut de l’écran, et le titre du domaine suivant le remplace quand il arrive.

---

### User Story 4 - Tenir les compétences à jour dans un seul fichier (Priority: P2)

Le mainteneur ajoute, modifie ou retire une compétence dans un fichier unique. Il ne touche
aucune page. S'il oublie un champ, écrit un niveau ou un domaine inconnu, ne cite aucun projet
ou cite un projet qui n'existe pas, le build échoue et désigne la compétence. Ce fichier est la
seule source des compétences : le CV (F09) le lira tel quel.

**Why this priority**: « une information, un seul endroit » (`CONTENU.md` §7). La vérification
au build garantit le critère « 100 % des compétences avec preuve » sans relecture.

**Independent Test**: ajouter une compétence valide et constater qu'elle apparaît dans son
domaine dans les deux langues ; puis retirer ses projets, citer un projet inexistant ou en
brouillon, ou mettre un niveau inconnu, et constater que le build échoue en désignant la
compétence.

**Acceptance Scenarios**:

1. **Given** une nouvelle compétence valide, **When** le site est construit, **Then** elle
   apparaît à son rang dans son domaine sur `/skills` et `/en/skills`, sans autre fichier
   modifié.
2. **Given** une compétence sans projet de preuve, **When** le site est construit, **Then**
   le build échoue et désigne la compétence.
3. **Given** une compétence qui cite un projet inexistant, **When** le site est construit,
   **Then** le build échoue et désigne la compétence et le projet cité.
4. **Given** une compétence qui cite un projet en brouillon, **When** le site est construit,
   **Then** le build échoue : un brouillon n'est pas publié, le lien serait mort.
5. **Given** une compétence sans nom, domaine ou niveau, ou avec un niveau ou un
   domaine hors de la liste, **When** le site est construit, **Then**
   le build échoue et désigne la compétence et le champ.
6. **Given** un projet cité par une compétence et que le mainteneur supprime ou repasse en
   brouillon, **When** le site est construit, **Then** le build échoue et désigne la
   compétence à corriger.
7. **Given** le fichier, **When** on le lit, **Then** il ne contient aucune information propre
   à la page (ordre d'affichage, mise en forme, libellé rédigé) : une autre page peut le
   réutiliser sans le modifier.

---

### Edge Cases

- **Domaine sans compétence** : il n'apparaît pas sur la page ; aucun titre vide.
- **Fichier sans compétence, absent ou illisible** : le build échoue et désigne le fichier.
- **Même projet cité deux fois par une compétence** : le build échoue ; un doublon afficherait
  deux fois le même lien.
- **Même nom de compétence deux fois** : le build échoue, une compétence n'existe qu'une fois.
- **Projet prouvant beaucoup de compétences** : rien à faire, le projet ne porte aucune trace
  des compétences.
- **Nom long** : passe à la ligne, sans troncature.

## Requirements _(mandatory)_

### Functional Requirements

**Page**

- **FR-001**: Le site DOIT publier la page des compétences à `/skills` en français et à
  `/en/skills` en anglais, atteinte par le lien « Compétences » / « Skills » de la
  navigation.
- **FR-002**: La page DOIT regrouper les compétences par domaine. Chaque domaine non vide est
  un intertitre suivi de la liste de ses compétences ; les domaines suivent un ordre fixe,
  le même dans les deux langues : « Front-end », « Back-end », « Données » / « Data »,
  « Outils et méthodes » / « Tools and methods ». Un langage se range dans le domaine où il
  sert le plus.
- **FR-003**: Dans un domaine, les compétences DOIVENT être triées par niveau décroissant,
  puis par nom. L'ordre est le même à chaque build et dans les deux langues.
- **FR-004**: Chaque compétence DOIT afficher son nom, son niveau et ses liens de preuve.
- **FR-005**: Le niveau DOIT être écrit en mots dans la langue de la page, accompagné
  d’une pièce d’échecs : un pion pour « Notions », un cavalier pour « Autonome », une dame
  pour « Avancé ». La pièce est décorative pour les technologies d’assistance et ne porte
  jamais seule l’information : le mot la donne, sans dépendre de la couleur.
- **FR-006**: L'échelle de niveau DOIT avoir trois niveaux, du plus bas au plus haut :
  « Notions » / « Basics » (j’en ai les bases, sans pratique régulière), « Autonome » /
  « Proficient » (je livre avec, en cherchant au besoin), « Avancé » / « Advanced » (je le
  pratique au quotidien et j’en connais les pièges). Ces définitions DOIVENT être données une
  seule fois, dans une légende en tête de page, avec la pièce de chaque niveau ; elles ne se répètent pas sous chaque compétence.
- **FR-007**: Chaque lien de preuve DOIT nommer le projet par son titre et mener à sa page
  dans la langue de la page, avec le repli sur la version française des projets non traduits.
  Les projets d'une compétence s'affichent du plus récent au plus ancien.
- **FR-008**: La page DOIT avoir un seul titre de premier niveau et une courte introduction
  qui dit que chaque compétence renvoie à ses preuves.

**Données**

- **FR-009**: Les compétences DOIVENT vivre dans un fichier de données unique
  (`CONTENU.md` §6).
- **FR-010**: Une compétence DOIT porter : un nom, un domaine pris dans une liste fermée, un
  niveau pris dans l'échelle, et au moins une référence de projet. Le
  nombre de projets exigé ne dépend pas du niveau.
- **FR-011**: Le nom d'une compétence est écrit une fois ; une forme anglaise facultative le
  remplace sur `/en/skills` quand le nom n'est pas un nom propre. Les libellés de domaine et de
  niveau existent dans les deux langues dans les libellés d'interface, pas dans le fichier.
- **FR-012**: Le build DOIT échouer, en désignant la compétence, quand un champ obligatoire
  manque, quand le domaine ou le niveau est inconnu,
  quand la liste des projets est vide ou contient un doublon, quand un projet cité n'existe
  pas ou est en brouillon, ou quand deux compétences portent le même nom.
- **FR-013**: Le build DOIT échouer, en désignant le fichier, quand le fichier n'a aucune
  compétence, est absent ou ne peut pas être lu.
- **FR-014**: Ajouter, modifier ou retirer une compétence NE DOIT demander aucune
  modification de page ni de composant.
- **FR-015**: Le fichier NE DOIT contenir aucune information propre à la page des
  compétences, pour que le CV (F09) le réutilise sans le modifier.
- **FR-016**: Le site DOIT être livré avec des compétences dans au moins deux domaines, dont
  une prouvée par plusieurs projets, toutes adossées aux projets publiés. Les compétences
  définitives sont saisies hors speckit (C4).

**Qualité**

- **FR-017**: La page DOIT rester lisible de 375 px à 1280 px et au-delà, sans défilement
  horizontal, en clair et en sombre, selon `DESIGN.md`.
  Sous `56rem`, le titre d’un domaine DOIT rester en haut de l’écran le long de son domaine.
- **FR-021**: Au-dessus de `56rem`, chaque domaine DOIT être un tableau sur toute la largeur,
  en colonnes proportionnelles (nom, niveau, preuves) ; le titre du domaine en tient la ligne
  d’en-têtes, avec « Niveau » et « Preuves » au-dessus de leurs colonnes, ignorés des
  technologies d’assistance.
- **FR-022**: Sur un écran à pointeur, survoler une compétence DOIT la garder à l’encre, faire
  avancer sa pièce d’un pas et passer les autres compétences en encre atténuée, sans descendre
  sous les seuils de contraste. Le pas de la pièce NE DOIT PAS se jouer sous
  `prefers-reduced-motion: reduce`. L’effet NE DOIT PAS reprendre l’inversion des lignes
  cliquables ni exister au toucher.
- **FR-018**: La page DOIT avoir un titre et une description uniques dans chaque langue, et
  des liens alternatifs entre les deux langues (F04).
- **FR-019**: La page DOIT être entièrement statique, sans script envoyé au navigateur
  (constitution, principes I et II).
- **FR-020**: Tous les libellés d'interface de la page (titre, introduction, domaines,
  niveaux et leurs définitions, en-têtes de colonnes, libellé des preuves) DOIVENT exister
  dans les deux langues.

### Key Entities

- **Compétence** : un savoir-faire prouvé. Nom (forme anglaise facultative), domaine, niveau,
  références de projets (au moins une).
- **Domaine** : regroupement de compétences, pris dans une liste fermée et ordonnée
  (front-end, back-end, données, outils et méthodes). Libellé FR et EN.
- **Niveau** : une valeur de l'échelle fermée et ordonnée, avec un libellé et une définition
  courte dans chaque langue, et sa pièce (pion, cavalier, dame).
- **Preuve** : la référence d'une compétence vers un projet publié de la collection des
  projets. Le projet ne connaît pas ses compétences.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: 100 % des compétences publiées ont au moins un lien de preuve vers un projet
  publié, vérifié au build (`CONTENU.md` §10).
- **SC-002**: 0 lien de preuve mort, dans les deux langues.
- **SC-003**: Un visiteur trouve le niveau d'une compétence donnée et ouvre un projet qui la
  prouve en moins de 15 secondes, sur mobile comme sur grand écran.
- **SC-004**: Le niveau de 100 % des compétences reste compréhensible sans couleur (page en
  niveaux de gris) et est annoncé en mots par un lecteur d'écran.
- **SC-005**: Ajouter une compétence demande de modifier un seul fichier et aucune ligne de
  code.
- **SC-006**: 100 % des compétences invalides (sans preuve, preuve inexistante ou en
  brouillon, champ manquant ou inconnu) font échouer le build avec un message qui désigne la
  compétence.
- **SC-007**: À 375 px et à 1280 px, en clair et en sombre, la page n'a aucun défilement
  horizontal ni texte tronqué ou superposé.
- **SC-008**: La page atteint les cibles du site : Lighthouse performance ≥ 95,
  accessibilité 100, bonnes pratiques 100, SEO 100, et 0 ko de script envoyé au navigateur.
- **SC-009**: Le CV (F09) peut afficher les mêmes compétences sans que le fichier soit
  modifié.

## Assumptions

- **Dépendances** : F03 (bilingue, sélecteur de langue, libellés), F04 (titre, description,
  liens alternatifs, plan du site) et F06 (projets et leurs pages) sont livrées. Le lien
  « Compétences » existe déjà dans la navigation.
- **Pas de date** : ni année de début ni durée. La fréquence de pratique est dans la
  définition du niveau ; l’ancienneté sur la stack principale se lit dans le parcours (F07).
- **Projet publié** : un projet de la collection des projets qui n'est pas en brouillon. Un
  brouillon compte comme inexistant pour les preuves.
- **Liste des domaines** : fermée et ordonnée (FR-002) ; l'ajout d'un domaine est une
  modification de code assumée (rare).
- **Ce qui devient une compétence** : un savoir-faire qu'un recruteur cherche. Une
  bibliothèque d'appoint vue dans un seul projet reste dans les technologies du projet.
- **Pas de filtre, pas de recherche, pas de page par compétence**, pas de lien du projet vers
  ses compétences : YAGNI. Les technologies d'un projet restent son propre champ, sans lien
  vers `/skills`.
- **Pas de brouillon de compétence** : une compétence présente dans le fichier est publiée.
- **Compétences livrées** : quelques compétences réelles adossées aux projets déjà publiés ;
  la liste complète est saisie hors speckit (C4).
- **Hors périmètre** : la page `/cv` et sa mise en page d'impression (F09), un lien d'une
  entrée du parcours vers ses projets (réserve de `ROADMAP.md`).
- **Fin de feature** : la feature est visuelle ; elle se termine par l'audit et le polish
  Impeccable, vérifiés à 375 px et à 1280 px, en clair et en sombre (`AGENTS.md`).

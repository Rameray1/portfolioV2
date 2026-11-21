# Feature Specification: Transitions et micro-animations

**Feature Branch**: `010-motion`

**Created**: 2026-11-20

**Status**: Draft

**Input**: User description: "F10. Les quatre effets de DESIGN.md (section Motion), et rien
d'autre :

- Accueil : le coup du projet !! se joue tout seul une fois, puis le symbole !! se pose en bleu
  à côté.
- Survol ou focus d'un projet mis en avant : sa pièce joue son coup (blancs seulement) et ses
  cases de départ et d'arrivée se marquent ; elle revient quand on passe à un autre projet, et
  la pièce du !! revient le temps du survol.
- Moins d'animations demandées : aucune pièce ne bouge, seules les cases se marquent.
- Ouverture d'un projet : son titre passe de la liste à la page projet par une transition
  fluide ; l'en-tête reste fixe.
- Page projet : le symbole d'évaluation se pose après la transition, jamais pendant.
- Tout mouvement est désactivé si l'utilisateur demande moins d'animations : la page s'affiche
  dans son état final.
- Aucun JavaScript ajouté : sans support du navigateur, le site fonctionne à l'identique, sans
  animation."

**Révision du 2026-11-20** (retour du mainteneur après la première implémentation) : le coup
`!!` ne part plus tout seul ; il se joue au survol de sa ligne, comme les autres. Chaque coup
pose son symbole d'évaluation sur sa case d'arrivée quand il se joue. Au repos, le diagramme
montre la position de référence, sans symbole.

## User Scenarios & Testing _(mandatory)_

Acteurs : le **recruteur** (souvent sur mobile, parfois au clavier, parfois avec « réduire les
animations » activé dans son système) et le **mainteneur**, qui choisit dans les données le
projet `!!` et les coups des projets mis en avant (F06, C2b).

Position de référence (`src/data/diagram.ts`, C2b) : trois coups candidats des blancs au
16ᵉ coup. Le `!!` (Portfolio) est la tour e1 qui prend le fou en e7 ; le `!` (Sportify) est le
fou g5 qui prend le cavalier en f6 ; le `!?` (Meetz) est le cavalier c3 qui va en d5. Deux des
trois coups sont des prises.

### User Story 1 - Voir chaque coup noté sur le diagramme (Priority: P1)

Un recruteur survole une ligne de la liste des coups de l'accueil. Sur le diagramme, la pièce du
projet joue son coup, puis le symbole d'évaluation du projet (`!`, `!?` ou `!!`) se pose à côté
de la case d'arrivée, comme un tampon. Il comprend sans lire quel coup est brillant, bon ou
risqué.

**Why this priority**: c'est le geste du commentateur (`DESIGN.md`, Motion) : on joue le coup,
puis on le note. Il relie la note de la liste à la position.

**Independent Test**: à 1280 px, en clair et en sombre, survoler chacune des trois lignes ; à
chaque fois, le bon symbole se pose sur la bonne case, après l'arrivée de la pièce.

**Acceptance Scenarios**:

1. **Given** l'accueil au repos, **When** il s'affiche, **Then** le diagramme montre la position
   de référence, sans pièce déplacée ni symbole ; rien ne bouge tant que le lecteur n'agit pas.
2. **Given** une ligne survolée ou atteinte au clavier, **When** sa pièce arrive, **Then** le
   symbole de son évaluation se pose à côté de la case d'arrivée, en fondu avec une légère
   réduction d'échelle, dans la couleur du symbole.
3. **Given** le symbole, **When** il se pose, **Then** il ne bouge qu'après l'arrivée de la
   pièce, jamais en même temps (Move-Then-Note Rule).
4. **Given** une ligne active, **When** le lecteur la quitte, **Then** le symbole s'efface
   aussitôt et la pièce revient à sa case.
5. **Given** un lecteur d'écran, **When** il lit le diagramme, **Then** la description
   correspond à la position de référence ; les symboles posés sont décoratifs, leur sens est
   déjà dans la liste.

---

### User Story 2 - Faire jouer un coup candidat au survol (Priority: P1)

Le recruteur survole, ou atteint au clavier, une ligne de la liste des coups de l'accueil. La
pièce du projet joue son coup sur le diagramme et ses cases de départ et d'arrivée se marquent
en rouge. Il passe à une autre ligne : la première pièce revient, la nouvelle joue. Il quitte
la liste : la position de référence revient.

**Why this priority**: c'est ce qui relie la liste des projets à la position (`DESIGN.md`,
Liste des coups ; Motion, effet 2) ; sans lui, le diagramme est une image décorative.

**Independent Test**: à 1280 px, survoler puis parcourir au clavier chacune des trois lignes ;
à chaque fois, une seule pièce est hors de sa case de départ, et c'est celle de la ligne active.

**Acceptance Scenarios**:

1. **Given** l'accueil au repos, **When** le pointeur entre sur une ligne ou qu'elle reçoit le
   focus, **Then** la pièce de son coup glisse de sa case de départ à sa case d'arrivée, la
   case d'arrivée se marque d'un liseré rouge épais et la case de départ d'un liseré rouge fin.
2. **Given** un coup qui prend une pièce, **When** la pièce arrive, **Then** la pièce prise
   n'est plus visible ; quand le coup revient, elle réapparaît sur sa case.
3. **Given** une ligne active, **When** le lecteur passe à une autre ligne, **Then** la pièce
   de la première revient à sa case, ses cases cessent d'être marquées, et la pièce de la
   nouvelle ligne joue son coup.
4. **Given** une ligne active, **When** le lecteur quitte la liste, **Then** les cases ne sont
   plus marquées et chaque pièce revient à sa case.
5. **Given** les coups candidats, **When** ils se jouent, **Then** seules des pièces blanches
   bougent ; les noires ne bougent jamais, sauf la pièce prise qui disparaît puis réapparaît.
6. **Given** un écran tactile sans survol, **When** le lecteur touche une ligne, **Then** le
   projet s'ouvre directement, sans coup intermédiaire à toucher deux fois.

---

### User Story 3 - Lire sans mouvement (Priority: P1)

Une recruteuse a activé « réduire les animations » dans son système. Aucune pièce ne glisse,
aucun titre ne se déplace. Au survol d'une ligne, les cases du coup se marquent tout de même :
elle ne perd aucune information.

**Why this priority**: obligation d'accessibilité (constitution, principe VII ; WCAG 2.2,
2.3.3) ; la page doit tout dire sans animation (Final State Rule).

**Independent Test**: activer la préférence de mouvement réduit, parcourir l'accueil, la liste
des projets et une page projet ; aucun mouvement ne se produit, toutes les informations sont
présentes.

**Acceptance Scenarios**:

1. **Given** le mouvement réduit, **When** l'accueil s'affiche, **Then** le diagramme montre la
   position de référence, comme sans réduction.
2. **Given** le mouvement réduit, **When** le lecteur survole ou atteint au clavier une ligne,
   **Then** aucune pièce ne bouge et aucun symbole ne se pose ; seules les cases de départ et
   d'arrivée du coup se marquent.
3. **Given** le mouvement réduit, **When** le lecteur ouvre un projet, **Then** la page projet
   s'affiche sans transition animée, symbole d'évaluation visible tout de suite.

---

### User Story 4 - Ouvrir un projet sans perdre le fil (Priority: P2)

Le recruteur clique sur un projet dans une liste (accueil ou `/projects`). Le titre du projet
glisse et grandit jusqu'à sa place de titre sur la page projet ; l'en-tête du site ne bouge
pas ; le reste passe en fondu. Il voit qu'il entre dans le projet qu'il a choisi.

**Why this priority**: améliore la continuité de lecture (`DESIGN.md`, Motion, effet 3), mais
le site reste complet sans elle.

**Independent Test**: dans un navigateur qui prend en charge les transitions entre pages,
ouvrir chaque projet depuis l'accueil et depuis `/projects`, puis revenir en arrière ; dans un
navigateur qui ne les prend pas en charge, la navigation est instantanée et identique.

**Acceptance Scenarios**:

1. **Given** une liste de projets, **When** le lecteur ouvre un projet, **Then** son titre passe
   de sa place dans la liste à sa place de titre sur la page projet, en un mouvement continu.
2. **Given** une navigation entre deux pages du site, **When** elle a lieu, **Then** l'en-tête
   du site reste immobile et le reste de la page passe en fondu.
3. **Given** une page projet, **When** le lecteur revient à la liste (retour du navigateur ou
   lien de retour), **Then** le titre fait le trajet inverse quand la liste le contient.
4. **Given** un navigateur sans prise en charge, **When** le lecteur navigue, **Then** la page
   change normalement, sans erreur ni contenu manquant.
5. **Given** le changement de langue ou toute autre navigation interne, **When** il a lieu,
   **Then** seul le fondu s'applique ; aucun titre ne se déplace vers un élément sans rapport.

---

### User Story 5 - Voir la note se poser sur la page projet (Priority: P3)

En arrivant sur une page projet, le symbole d'évaluation, dans la marge, apparaît en fondu une
fois la transition de page terminée, dans la couleur de son symbole.

**Why this priority**: finition qui prolonge le geste du commentateur (`DESIGN.md`, Motion,
effet 4) ; plus discrète que le tampon du diagramme.

**Independent Test**: ouvrir une page projet de chaque évaluation (`!`, `!?`, `!!`) ; le
symbole apparaît après la transition, jamais pendant, dans sa couleur.

**Acceptance Scenarios**:

1. **Given** une page projet, **When** elle s'affiche, **Then** le symbole d'évaluation
   apparaît en simple fondu, sans changement d'échelle, après la durée de la transition de page.
2. **Given** le symbole, **When** il est posé, **Then** il est bleu foncé pour `!`, violet pour
   `!?`, bleu ciel pour `!!`, comme ailleurs sur le site.
3. **Given** une page projet ouverte directement (lien externe, rechargement), **When** elle
   s'affiche, **Then** le symbole se pose de la même façon et finit visible.

---

### Edge Cases

- **Aucun projet `!!` parmi les mis en avant** : rien ne change, chaque coup se joue et se note
  au survol de sa ligne.
- **Moins de trois projets mis en avant** (un, deux, ou aucun) : seuls les coups existants se
  jouent ; aucun projet mis en avant, aucun coup au survol.
- **Passage rapide d'une ligne à l'autre** : à tout instant, au plus une pièce est en route
  vers une case d'arrivée (One Move Rule) ; la pièce quittée revient sans attendre la fin de
  son coup, et son symbole s'efface aussitôt.
- **Liste survolée alors que le diagramme est hors de l'écran** (mobile) : les cases et pièces
  changent quand même ; aucun défilement n'est provoqué.
- **Titre de projet non traduit** (version française affichée sur `/en/...`) : la transition du
  titre fonctionne de la même façon.
- **Impression** (CV, page projet) : aucune animation ne laisse une pièce, un titre ou un
  symbole dans un état intermédiaire ; on imprime l'état final.
- **Mode de contraste forcé** : les cases marquées restent repérables.

## Requirements _(mandatory)_

### Functional Requirements

**État au repos**

- **FR-001**: Au repos, le diagramme de l'accueil DOIT montrer la position de référence, sans
  pièce déplacée, sans case marquée et sans symbole ; aucun coup ne se joue sans action du
  lecteur.
- **FR-002**: La description du diagramme pour les lecteurs d'écran DOIT correspondre à la
  position de référence, dans chaque langue.
- **FR-003**: Toute page DOIT être complète et utilisable sans qu'aucune animation ne se joue :
  navigateur sans prise en charge, mouvement réduit demandé ou impression.

**Note d'un coup**

- **FR-004**: Quand un coup se joue au survol ou au focus de sa ligne, le symbole d'évaluation
  de son projet DOIT se poser à côté de sa case d'arrivée (fondu et légère réduction d'échelle),
  après l'arrivée de la pièce, dans la couleur du symbole, sans sortir de la planche.
- **FR-005**: Quand la ligne n'est plus active, son symbole DOIT s'effacer aussitôt.

**Coups candidats**

- **FR-006**: Au survol ou au focus d'une ligne de la liste des projets mis en avant de
  l'accueil, la pièce du coup de ce projet DOIT glisser de sa case de départ à sa case
  d'arrivée, et ses cases d'arrivée et de départ DOIVENT se marquer d'un liseré rouge
  (épais à l'arrivée, fin au départ).
- **FR-007**: Le coup du projet `!!` DOIT se comporter comme les autres : il ne se joue qu'au
  survol ou au focus de sa ligne.
- **FR-008**: Une pièce prise DOIT être invisible tant que la pièce qui la prend occupe sa case,
  et visible sinon.
- **FR-009**: Quand la ligne active change ou que la liste n'est plus active, la pièce
  précédente DOIT revenir à sa case et ses cases cesser d'être marquées ; en quittant la liste,
  la position revient à l'état de FR-001.
- **FR-010**: Seules les pièces blanches DOIVENT se déplacer.
- **FR-011**: Sur écran tactile sans survol, toucher une ligne DOIT ouvrir le projet dès le
  premier toucher.
- **FR-012**: Les coups candidats DOIVENT venir des données des projets (case de départ, case
  d'arrivée, évaluation) : ajouter, retirer ou changer un projet mis en avant ne demande de
  modifier aucun composant.

**Transitions de page**

- **FR-013**: Entre deux pages du site, quand le navigateur le permet, l'en-tête DOIT rester
  immobile et le reste de la page passer en fondu.
- **FR-014**: Ouvrir un projet depuis une liste (accueil ou `/projects`) DOIT faire passer son
  titre de sa place dans la liste à sa place sur la page projet ; le retour fait le trajet
  inverse quand la liste contient ce projet.
- **FR-015**: Sur une page projet, le symbole d'évaluation DOIT apparaître en simple fondu, sans
  changement d'échelle, une fois la transition de page terminée, dans la couleur de son
  symbole.

**Règles générales**

- **FR-016**: Sous la préférence de mouvement réduit, aucun élément NE DOIT se déplacer, changer
  d'échelle ni passer en fondu, et aucun symbole ne se pose sur le diagramme ; seul le marquage
  des cases au survol ou au focus reste.
- **FR-017**: Deux mouvements NE DOIVENT jamais se chevaucher : le symbole suit le coup ou la
  transition ; au plus une pièce est en route à la fois.
- **FR-018**: Aucun autre effet NE DOIT être ajouté : pas de boucle, pas d'apparition au
  défilement sur les sections, pas de parallaxe, pas de pièce qui suit le pointeur.
- **FR-019**: Les durées DOIVENT être celles de `DESIGN.md` (Motion) : transition de page,
  trajet d'une pièce, pose d'un symbole ; toutes nulles sous
  mouvement réduit.
- **FR-020**: Aucun script NE DOIT être envoyé au navigateur par cette feature (constitution,
  principe II).
- **FR-021**: Les animations NE DOIVENT provoquer aucun décalage de mise en page ni défilement
  horizontal, à 375 px comme à 1280 px.

### Key Entities

- **Coup** : déjà dans les données de chaque projet mis en avant (case de départ, case
  d'arrivée, notation, F06). Une prise se déduit de la position : la case d'arrivée est occupée
  par une pièce noire.
- **Position de référence** : la position du diagramme avant les coups candidats (C2b), affichée
  au repos.
- **Évaluation** : le symbole d'un projet (`!`, `!?`, `!!`) et sa couleur, posé sur le diagramme
  quand son coup se joue.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Au chargement de l'accueil, 0 pièce ne bouge ; au survol de chaque ligne, le bon
  symbole est posé sur la bonne case moins de 0,6 seconde après le début du survol.
- **SC-002**: Pour 100 % des lignes mises en avant, au survol comme au focus clavier, la bonne
  pièce joue le bon coup et les deux bonnes cases se marquent ; à tout instant, au plus une
  pièce est en route vers une case d'arrivée.
- **SC-003**: Sous mouvement réduit, 0 élément ne se déplace sur l'ensemble des pages, et 100 %
  des informations (position, symboles de la liste, cases marquées au survol) restent
  présentes.
- **SC-004**: Dans un navigateur sans prise en charge, 100 % des pages s'affichent et se
  naviguent comme avant la feature, dans leur état final.
- **SC-005**: 0 ko de script ajouté ; le poids de l'accueil reste sous 200 ko transférés.
- **SC-006**: Lighthouse mobile reste ≥ 95 en performance et à 100 en accessibilité, bonnes
  pratiques et SEO, avec un décalage de mise en page cumulé nul dû aux animations.
- **SC-007**: Aucune animation ne dure plus de 0,7 seconde, et aucune ne se joue sans action du
  lecteur (survol, focus, navigation).

## Assumptions

- **Dépendances** : F06 (projets, coups, évaluations, jetons bleus) et C2b (position et coups
  définitifs) sont livrées. Les autres features (F07–F09) ne sont pas touchées, sauf par le
  fondu commun des transitions de page.
- **Périmètre fermé** : les quatre effets de `DESIGN.md` (Motion), et rien d'autre. L'effet
  d'avance d'un pas des pièces au survol sur `/background` et `/cv`, déjà livré, n'est pas
  repris ici.
- **Coups au survol sur l'accueil seulement** : `/projects` n'a pas de diagramme ; sa liste ne
  porte que la transition de titre.
- **Navigateurs** : les effets profitent aux navigateurs qui les prennent en charge ; les
  autres reçoivent l'état final, sans contournement.
- **Fin de feature** : la feature est visuelle ; elle se termine par l'audit et le polish
  Impeccable, vérifiés à 375 px et à 1280 px, en clair et en sombre, en-tête et pied de page
  compris (`AGENTS.md`).

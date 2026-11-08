# Feature Specification: Socle visuel et gabarit commun

**Feature Branch**: `002-visual-foundation-layout`

**Created**: 2026-11-08

**Status**: Draft

**Input**: User description: "Toutes les pages partagent un gabarit commun : en-tête avec navigation, contenu, pied de page.

- L'apparence suit DESIGN.md : couleurs, typographie, espacements et rayons sont des jetons réutilisables ; aucune valeur visuelle en dur ailleurs.
- Le site suit le thème clair ou sombre du système du visiteur, sans aucun flash ; les deux thèmes respectent un contraste AA.
- La navigation liste les rubriques depuis une source de données unique : ajouter une rubrique = une ligne. La rubrique courante est signalée (visuellement et pour les lecteurs d'écran).
- La navigation reste utilisable sur mobile et au clavier.
- Un lien « Aller au contenu » est le premier élément focusable.
- Le pied de page contient email, GitHub et LinkedIn ; jamais de numéro de téléphone.
- Chaque page fournit son titre et sa description au gabarit.
- Une page d'accueil provisoire utilise le gabarit pour démontrer le tout."

## User Scenarios & Testing _(mandatory)_

Acteurs : le **visiteur** (recruteur, lead technique ; sur ordinateur ou mobile, à la souris,
au clavier ou avec un lecteur d'écran) et le **mainteneur** (seul auteur du site, qui ajoute
des pages et des rubriques).

### User Story 1 - Retrouver la même structure sur chaque page (Priority: P1)

Le visiteur arrive sur n'importe quelle page et voit la même structure : un en-tête avec le nom
et la navigation, le contenu de la page, un pied de page avec les moyens de contact. Le
mainteneur crée une page en ne fournissant que son titre, sa description et son contenu : le
reste vient du gabarit.

**Why this priority**: c'est la base de toutes les features suivantes (F03 à F12). Sans
gabarit, chaque page dupliquerait l'en-tête, le pied de page et les métadonnées.

**Independent Test**: ouvrir la page d'accueil provisoire ; elle affiche en-tête, navigation,
contenu et pied de page ; son titre d'onglet et sa description sont ceux qu'elle a fournis.

**Acceptance Scenarios**:

1. **Given** la page d'accueil provisoire, **When** le visiteur l'ouvre, **Then** il voit dans
   l'ordre l'en-tête (nom + navigation), le contenu, puis le pied de page.
2. **Given** une page qui fournit un titre et une description, **When** elle est générée,
   **Then** le titre d'onglet et la description présentée aux moteurs sont exactement ceux-là.
3. **Given** une page qui omet son titre ou sa description, **When** le site est vérifié ou
   construit, **Then** la vérification échoue en désignant la page.
4. **Given** le pied de page, **When** le visiteur le lit, **Then** il y trouve un lien email,
   un lien GitHub et un lien LinkedIn, et aucun numéro de téléphone.

---

### User Story 2 - Lire le site dans le thème de son système (Priority: P1)

Le visiteur dont le système est en mode sombre voit le site en sombre dès le premier affichage,
sans éclair blanc ; en mode clair, il le voit en clair. Les deux thèmes appliquent la direction
de `DESIGN.md` et restent lisibles.

**Why this priority**: un éclair au chargement ou un texte illisible dans un thème se voit en
une seconde et contredit la promesse « je construis un site propre » (`CONTENU.md` §4).

**Independent Test**: charger la page en préférence claire puis sombre, avec un réseau ralenti ;
aucune image intermédiaire ne montre l'autre thème ; mesurer les contrastes des textes et des
indicateurs dans les deux thèmes.

**Acceptance Scenarios**:

1. **Given** un système en préférence sombre, **When** le visiteur charge une page (premier
   chargement ou rechargement), **Then** la toute première image affichée est déjà en thème
   sombre.
2. **Given** un système en préférence claire, **When** le visiteur charge une page, **Then** elle
   est en thème clair.
3. **Given** le visiteur change la préférence de son système pendant la visite, **When** il
   revient sur la page, **Then** le thème suit le nouveau réglage.
4. **Given** chaque thème, **When** on mesure le contraste des textes, liens, indicateur de page
   courante et anneau de focus, **Then** chacun atteint le niveau AA.
5. **Given** les éléments natifs du navigateur (barres de défilement, champs), **When** le thème
   est sombre, **Then** ils s'affichent aussi en sombre.

---

### User Story 3 - Naviguer au clavier, au lecteur d'écran et sur mobile (Priority: P2)

Le visiteur au clavier appuie sur Tab : le premier élément atteint est « Aller au contenu », qui
l'amène directement au contenu. Il parcourt ensuite la navigation, voit nettement où se trouve
le focus et sait quelle rubrique est la page courante. Sur un téléphone, toutes les rubriques
restent atteignables et cliquables sans zoom.

**Why this priority**: exigence WCAG 2.2 AA de la constitution (principe VII) ; vient après la
structure et le thème, dont elle dépend.

**Independent Test**: au clavier seul, depuis le chargement, atteindre le contenu en deux
touches et chaque lien de la navigation ; avec un lecteur d'écran, entendre la rubrique
courante annoncée ; sur un écran de 320 px de large, atteindre chaque rubrique sans défilement
horizontal.

**Acceptance Scenarios**:

1. **Given** une page fraîchement chargée, **When** le visiteur appuie une fois sur Tab, **Then**
   le lien « Aller au contenu » reçoit le focus et devient visible.
2. **Given** le focus sur « Aller au contenu », **When** le visiteur l'active, **Then** le focus
   et la lecture passent au début du contenu principal, après l'en-tête.
3. **Given** la page d'une rubrique, **When** le visiteur regarde la navigation, **Then** cette
   rubrique se distingue visuellement des autres, par un autre moyen que la seule couleur.
4. **Given** la page d'une rubrique et un lecteur d'écran, **When** il parcourt la navigation,
   **Then** ce lien est annoncé comme la page courante.
5. **Given** n'importe quel élément interactif, **When** il reçoit le focus clavier, **Then** un
   indicateur de focus visible apparaît.
6. **Given** un écran de 320 px de large, **When** le visiteur ouvre une page, **Then** toutes les
   rubriques sont visibles ou atteignables, sans défilement horizontal, et chaque lien offre
   une cible tactile d'au moins 24 × 24 px.
7. **Given** le navigateur sans JavaScript, **When** le visiteur utilise la navigation, **Then**
   elle fonctionne à l'identique.

---

### User Story 4 - Ajouter une rubrique en une ligne (Priority: P3)

Le mainteneur ajoute une rubrique à la navigation en ajoutant une seule entrée (libellé +
chemin) dans une source de données unique. Toutes les pages l'affichent ensuite, sans autre
modification.

**Why this priority**: garantit le coût de modification quasi nul (`CONTENU.md` §1) ; utile dès
F05, mais n'est pas visible du visiteur.

**Independent Test**: ajouter une entrée dans la source de la navigation, reconstruire ; la
rubrique apparaît sur toutes les pages, à la position de l'entrée ; aucun autre fichier n'a
changé.

**Acceptance Scenarios**:

1. **Given** la source de la navigation, **When** le mainteneur y ajoute une entrée, **Then**
   la nouvelle rubrique apparaît dans la navigation de toutes les pages, dans l'ordre de la
   source.
2. **Given** une entrée incomplète (sans libellé ou sans chemin), **When** le site est vérifié,
   **Then** la vérification échoue.
3. **Given** la page d'une rubrique ou une page placée sous son chemin, **When** elle s'affiche,
   **Then** cette rubrique est signalée comme courante.

---

### Edge Cases

- **Page sans rubrique** (accueil, future 404) : aucune rubrique n'est signalée comme courante ;
  le nom dans l'en-tête ramène à l'accueil.
- **Page sous une rubrique** (future fiche projet sous la rubrique Projets) : la rubrique parente
  est signalée comme courante ; voir FR-010.
- **Chemin avec ou sans barre oblique finale** : la rubrique courante est reconnue dans les deux
  cas.
- **Polices pas encore chargées** ou bloquées : le texte s'affiche tout de suite dans la police
  de repli, sans texte invisible, et la mise en page bouge le moins possible au remplacement.
- **Zoom à 200 %** et texte agrandi : la navigation et le pied de page restent lisibles, sans
  chevauchement ni perte d'information.
- **Rubrique dont la page n'existe pas encore** (de F02 à F10) : le lien est affiché et mène à
  une page introuvable ; aucune vérification ne doit échouer pour cette raison avant F12.
- **Libellé de rubrique long** ou rubriques nombreuses : la navigation passe à la ligne plutôt
  que de déborder.
- **Préférence de mouvement réduit** : aucune transition n'est jouée (constitution, principe
  VII).
- **Impression** : le gabarit reste lisible en noir sur blanc (hors périmètre d'une mise en page
  dédiée ; le CV imprimable relève de F08).
- **Valeur visuelle écrite en dur** dans un composant : elle contredit FR-002 et doit être
  repérée en revue (exceptions admises par la constitution, principe VIII).

## Requirements _(mandatory)_

### Functional Requirements

**Gabarit**

- **FR-001**: Toute page du site MUST être rendue dans un gabarit unique composé, dans l'ordre,
  d'un en-tête (nom + navigation), d'une zone de contenu principal et d'un pied de page.
  L'en-tête, la navigation et le pied de page MUST n'exister qu'à un seul endroit.
- **FR-002**: Chaque page MUST fournir au gabarit un titre et une description ; leur absence
  MUST faire échouer la vérification du projet. Le gabarit MUST les exposer comme titre du
  document et description pour les moteurs.
- **FR-003**: Le gabarit MUST déclarer la langue du document (français pour cette feature ; le
  bilinguisme relève de F03).

**Apparence et thèmes**

- **FR-004**: Couleurs, familles et tailles de police, espacements, rayons, épaisseurs de filet,
  largeurs de mise en page et durées d'animation MUST être définis une seule fois, sous forme de
  jetons nommés dérivés de `DESIGN.md`. Les composants MUST n'utiliser que ces jetons, aux
  exceptions près de la constitution (principe VIII).
- **FR-005**: Les styles de chaque composant MUST s'appliquer à ce seul composant ; seuls les
  jetons et la base commune (remise à zéro, typographie de base, focus, sélection) sont
  globaux.
- **FR-006**: Le site MUST suivre la préférence claire/sombre du système du visiteur, sans
  bouton ni réglage sur le site, et la première image affichée MUST être déjà dans le bon thème.
- **FR-007**: Dans les deux thèmes, le texte courant, les liens, l'indicateur de page courante
  et l'anneau de focus MUST atteindre le contraste WCAG 2.2 AA (4,5:1 pour le texte, 3:1 pour
  les indicateurs non textuels).
- **FR-008**: Le texte MUST rester affiché pendant le chargement des polices (police de repli
  visible, jamais de texte invisible).

**Navigation**

- **FR-009**: La navigation MUST être générée depuis une source de données unique, où chaque
  rubrique est une entrée (libellé, chemin). Ajouter, retirer ou réordonner une rubrique MUST
  se faire en modifiant une seule entrée. Une entrée invalide MUST faire échouer la
  vérification.
- **FR-010**: La rubrique dont le chemin correspond à la page affichée, ou en est le préfixe,
  MUST être signalée comme courante, visuellement (pas par la couleur seule) et pour les
  technologies d'assistance. Une seule rubrique au plus est courante.
- **FR-011**: À la livraison de cette feature, la navigation MUST lister les six rubriques
  prévues par `CONTENU.md` §5, dans cet ordre : À propos (`/about`), Projets (`/projects/`),
  Parcours (`/background`), Compétences (`/skills`), CV (`/cv`), Blog (`/blog/`). Leurs pages
  n'existent pas encore : ces liens mènent à une page introuvable jusqu'à ce que la feature
  concernée (F05 à F10) livre la page. C'est un état transitoire accepté.
- **FR-012**: La navigation MUST rester entièrement utilisable au clavier, sur un écran de
  320 px de large sans défilement horizontal, et sans JavaScript.
- **FR-013**: Le nom affiché dans l'en-tête MUST être un lien vers l'accueil.

**Accessibilité**

- **FR-014**: Un lien « Aller au contenu » MUST être le premier élément focusable de chaque page ;
  masqué au repos, il MUST devenir visible au focus et mener au début du contenu principal.
- **FR-015**: Tout élément interactif MUST afficher un indicateur de focus visible, conforme à
  `DESIGN.md`.
- **FR-016**: L'en-tête, la navigation, le contenu principal et le pied de page MUST être
  identifiables comme régions par les technologies d'assistance ; la navigation principale MUST
  porter un nom accessible.
- **FR-017**: Toute animation ou transition du gabarit MUST être désactivée quand le visiteur
  demande moins de mouvement.

**Pied de page**

- **FR-018**: Le pied de page MUST contenir trois liens : email, profil GitHub, profil LinkedIn.
  Leurs adresses MUST provenir d'une source de données unique, réutilisable par les features
  suivantes.
- **FR-019**: Aucun numéro de téléphone MUST apparaître dans le gabarit ni dans les données de
  contact.

**Page de démonstration**

- **FR-020**: Une page d'accueil provisoire MUST utiliser le gabarit et démontrer : titre et
  description fournis, thèmes, typographie de base de `DESIGN.md` (au moins un titre et un
  paragraphe), lien d'évitement, navigation et pied de page. Son texte respecte `CONTENU.md` §9
  et sera remplacé en F05.

**Hors périmètre**

- **FR-021**: Restent hors de cette feature : bouton de choix du thème (réserve de `ROADMAP.md`),
  sélecteur de langue et libellés bilingues (F03), URL canonique, Open Graph, favicon et page
  404 (F04), contenu réel de l'accueil, bandeau de disponibilité et diagramme (F05),
  transitions entre pages (F11).

### Key Entities

- **Rubrique de navigation** : libellé affiché, chemin de destination. L'ordre des entrées est
  l'ordre d'affichage.
- **Coordonnées de contact** : adresse email, URL du profil GitHub, URL du profil LinkedIn.
  Jamais de téléphone.
- **Métadonnées de page** : titre et description, fournis par chaque page au gabarit.
- **Jeton de design** : nom et valeur (une valeur par thème pour les couleurs), source unique de
  toute valeur visuelle.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: 100 % des pages du site sont rendues par le gabarit commun (en-tête, contenu, pied
  de page identiques d'une page à l'autre).
- **SC-002**: 0 image affichée dans le mauvais thème au chargement, en préférence claire comme
  sombre, réseau ralenti compris.
- **SC-003**: 100 % des couples texte/fond et indicateur/fond du gabarit atteignent AA dans les
  deux thèmes.
- **SC-004**: Ajouter une rubrique demande la modification d'1 seule entrée dans 1 seul fichier.
- **SC-005**: Au clavier, le visiteur atteint le contenu principal en 2 actions (Tab, Entrée)
  depuis le chargement de la page.
- **SC-006**: À 320 px de large et à 200 % de zoom, 0 défilement horizontal et 100 % des
  rubriques atteignables.
- **SC-007**: La page d'accueil provisoire envoie 0 ko de JavaScript au navigateur et pèse moins
  de 200 ko transférés, polices comprises.
- **SC-008**: Hors jetons et exceptions de la constitution, 0 valeur de couleur, de taille, de
  police, d'espacement ou de rayon écrite en dur dans les styles des composants.
- **SC-009**: Un audit d'accessibilité automatisé de la page d'accueil provisoire ne relève
  aucune erreur, dans les deux thèmes.

## Assumptions

- `DESIGN.md` est la référence des valeurs : palette clair et sombre, Archivo seule famille
  (auto-hébergée), échelle typographique, espacements sur base 4 px, rayon unique à 0, filets
  de 1 et 2 px, anneau de focus rouge, navigation sur filet de 2 px.
- Les couleurs de `DESIGN.md` sont réputées AA ; si une mesure échoue, la valeur est corrigée
  dans `DESIGN.md` et dans les jetons, jamais contournée dans un composant.
- `DESIGN.md` prévoit qu'un attribut puisse forcer le thème ; sans bouton de thème (réserve),
  ce forçage n'est pas livré ici (YAGNI).
- Mobile : selon `DESIGN.md`, la liste des rubriques passe à la ligne sous le nom, sans menu
  replié. Un menu replié ne serait introduit que si les rubriques ne tenaient plus sur deux
  lignes à 320 px.
- Liens de navigation morts tolérés entre F02 et la livraison de chaque rubrique (choix du
  mainteneur, 2026-11-08) : la liste complète montre la vraie largeur de la navigation et
  permet de tester le mobile dès maintenant. Le site est en `noindex` jusqu'à C3, et la
  vérification des liens morts n'arrive qu'en F12, après toutes les rubriques.
- Les libellés d'interface sont en français et écrits directement ; F03 les fera passer par le
  dictionnaire FR/EN.
- Les adresses email, GitHub et LinkedIn sont fournies par le mainteneur au moment du plan.
- Le titre d'onglet suit un format commun (par exemple « Titre de la page · Ramazan Kus ») fixé
  au plan ; l'unicité des titres et descriptions est vérifiée en F12.
- Dépendances : F01 fusionnée (formatage, vérification, CI) et `DESIGN.md` validé.

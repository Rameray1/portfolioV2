# Feature Specification: CV en ligne et PDF

**Feature Branch**: `009-cv`

**Created**: 2026-11-19

**Status**: Draft

**Input**: User description: "/cv et /en/cv affichent un CV construit uniquement à partir des
données existantes (campagne, expériences, formations, compétences, projets mis en avant) :
aucune information n'est saisie deux fois.

- Imprimé depuis le navigateur, il tient sur une page A4 propre : sans navigation, en thème
  clair, liens lisibles (URL visibles).
- Un PDF FR et un PDF EN, mis en page comme un CV classique (une colonne, texte lisible par les
  logiciels de tri de candidatures), sont téléchargeables depuis la page. Ils sont produits à
  chaque build à partir des mêmes données que la page : ils ne peuvent pas être en retard sur
  le site.
- Si le PDF ne peut pas être produit, le build échoue.
- Le CV comporte une rubrique Langues ; les langues sont une donnée, saisie une seule fois.
- Aucun numéro de téléphone n'est publié, ni sur la page, ni dans les PDF, ni dans le dépôt.
- Le levier « CV » de la campagne pointe désormais vers /cv."

## Clarifications

### Session 2026-11-19

Le mainteneur a délégué les trois choix ; ils sont révisables.

- Q: L'un des deux appels à l'action de l'accueil devient-il « Voir le CV » ? → A: Oui. Les
  deux appels sont « Voir le CV » puis « M'écrire », le duo de `CONTENU.md` §7, le CV en
  premier comme le prévoit `CONTRIBUTING.md`. LinkedIn sort
  des appels à l'action ; il reste dans l'en-tête du CV et dans le pied de page.
- Q: Si les données ne tiennent plus sur une page A4 ? → A: Le build échoue et dit quel PDF
  déborde. Un CV de deux pages ne part jamais par accident ; on raccourcit une donnée.
- Q: Le niveau des compétences apparaît-il dans le CV ? → A: Non. Noms seuls, regroupés par
  domaine et triés comme sur `/skills` (niveau décroissant, puis nom) : le tri garde
  l'information sans prendre de place, et le niveau se lit sur `/skills`.

### Session 2026-11-19 (revue de l'implémentation)

Décisions finales de la revue avec le mainteneur.

- Q: Quelle organisation pour la page ? → A: Comme une page projet. Au-dessus de `64rem`, la
  lecture à gauche (nom, titre, pitch, puis Expérience, Formation, Projets, Compétences,
  Langues) et une colonne d'infos de 20rem à droite, collée en haut de l'écran : à droite on
  décide et on agit, à gauche on lit le CV. En dessous, une seule colonne de 56rem au plus.
  Écartés : les titres de rubrique dans une colonne de gauche (vide sous chaque titre), une
  seule colonne sur grand écran (droite vide), une colonne latérale avec compétences et
  langues (trop haute pour coller, deux lectures concurrentes).
- Q: Que contient la colonne d'infos, dans quel ordre ? → A: L'ordre des questions du
  recruteur : la disponibilité, le bouton PDF (de bord à bord, comme les filets), puis
  « Email », « LinkedIn », « GitHub », chacun sous son libellé. Ni le lieu (la disponibilité
  dit déjà « tous pays hors de France »), ni le lien vers le site (on y est). Sur mobile :
  nom, disponibilité, bouton, contacts, pitch, rubriques.
- Q: Comment se repère-t-on dans la page ? → A: Chaque rubrique s'ouvre par un filet épais et
  un titre en Section title ; sous `56rem`, il reste collé en haut de l'écran, comme les
  domaines de `/skills`, avec les mêmes écarts entre rubriques.
- Q: Où est la touche d'échecs ? → A: Une pièce dans la marge de chaque étape, comme sur
  `/background` (cavalier pour une expérience, pion pour une formation) ; « aujourd'hui »
  précédé du carré rouge pour une étape en cours. Les projets reprennent la liste des coups,
  avec leur symbole d'évaluation et sa légende.
- Q: Un effet au survol ? → A: Oui, sur écran à pointeur : l'étape ou la ligne survolée reste
  à l'encre, sa pièce avance d'un pas (sauf sous `prefers-reduced-motion`), les autres
  s'atténuent, comme sur `/skills`. Un projet s'inverse, comme dans toute liste des coups.
- Q: Les liens du PDF sont-ils clairs ? → A: Le titre a sa ligne sous le nom ; puis
  « email | ville » (la ville reste dans le PDF : usage, champ lu par les ATS) ; puis
  « Portfolio : ramazankus.dev | LinkedIn | GitHub », seul le portfolio portant un libellé.
  Chaque projet renvoie à sa page, qui donne le code.
- Q: La disponibilité dit-elle quand et à quelles conditions ? → A: Oui : « Été 2027,
  9 semaines minimum, tous pays hors de France (citoyen de l'UE) », repris du CV LaTeX du
  mainteneur. C'est une donnée de campagne : accueil, À propos, page et PDF la reprennent.

## User Scenarios & Testing _(mandatory)_

Acteurs : le **recruteur** (international anglophone d'abord, puis francophone), le
**logiciel de tri de candidatures** (ATS) qui lit le PDF déposé par le recruteur ou par le
mainteneur, et le **mainteneur** (seul auteur du site, `CONTENU.md` §2).

### User Story 1 - Lire le CV en ligne (Priority: P1)

Un recruteur clique sur « CV » dans la navigation. Il lit sur une seule page, dans sa langue,
l'essentiel du portfolio : qui est le mainteneur et ce qu'il cherche, ses expériences, ses
formations, ses projets mis en avant, ses compétences et ses langues. Chaque projet renvoie à
sa page pour en savoir plus.

**Why this priority**: le lien « CV » de la navigation mène aujourd'hui à une page
introuvable ; le CV est l'un des cinq leviers de campagne (`CONTENU.md` §7).

**Independent Test**: ouvrir `/cv` puis `/en/cv` à 375 px et à 1280 px, en clair et en
sombre ; toutes les rubriques sont présentes, dans la langue de la page, sans défilement
horizontal, et chaque information se retrouve à l'identique sur `/background`, `/skills` ou
la page du projet.

**Acceptance Scenarios**:

1. **Given** le site, **When** le visiteur ouvre `/cv`, **Then** il lit, dans cet ordre : le
   nom et le titre, le pitch, l'expérience, la formation, les projets, les compétences et les
   langues ; les infos (disponibilité, bouton PDF, contacts) sont à côté sur grand écran,
   sous le nom sur mobile.
2. **Given** les infos, **When** elles s'affichent, **Then** elles donnent le bandeau de
   disponibilité de la campagne, le lien de téléchargement, puis l'email, LinkedIn et GitHub,
   chacun sous son libellé ; aucun numéro de téléphone.
3. **Given** le profil, **When** il s'affiche, **Then** il reprend le pitch de la campagne,
   tel qu'il est sur l'accueil.
4. **Given** l'expérience et la formation, **When** elles s'affichent, **Then** chaque entrée
   donne son intitulé, son lieu, ses dates et ses points, comme sur `/background`, de la plus
   récente à la plus ancienne.
5. **Given** les projets, **When** ils s'affichent, **Then** seuls les projets mis en avant
   apparaissent, chacun avec son titre, son année, ses technologies, son résumé et un lien
   vers sa page dans la langue du CV.
6. **Given** les compétences, **When** elles s'affichent, **Then** elles sont regroupées par
   domaine, dans l'ordre de `/skills`.
7. **Given** `/en/cv`, **When** le visiteur l'ouvre, **Then** titres de rubrique, dates,
   prose et libellés sont en anglais ; les entrées et leur ordre sont les mêmes qu'en
   français.
8. **Given** la page, **When** un moteur la lit, **Then** elle a un titre et une description
   propres dans chaque langue, et ses liens alternatifs relient les deux langues (F04).
9. **Given** un écran de 375 px, **When** la page s'affiche, **Then** elle ne défile pas
   horizontalement et les dates passent sous l'intitulé plutôt que de le chevaucher.

---

### User Story 2 - Télécharger le CV en PDF (Priority: P1)

Le recruteur veut joindre le CV à une candidature ou le passer dans son ATS. Depuis `/cv`, il
télécharge un PDF d'une page A4, mis en page comme un CV classique. Le texte du PDF se
sélectionne et se copie, et l'ATS en extrait les rubriques. Le contenu est celui de la page,
à jour du dernier déploiement.

**Why this priority**: c'est la forme que le recruteur garde et transmet ; un CV qui diffère
du site, ou illisible par un ATS, fait perdre la candidature.

**Independent Test**: télécharger le PDF français depuis `/cv` et le PDF anglais depuis
`/en/cv` ; chacun fait une page A4, son texte copié-collé redonne les rubriques et les
accents intacts, ses liens sont cliquables, et chaque information est celle de la page.

**Acceptance Scenarios**:

1. **Given** `/cv`, **When** le visiteur suit le lien de téléchargement, **Then** il reçoit
   le PDF français ; depuis `/en/cv`, le PDF anglais.
2. **Given** un PDF, **When** on l'ouvre, **Then** il tient sur une page A4, en une colonne,
   avec les mêmes rubriques, dans le même ordre, que la page de sa langue.
3. **Given** un PDF, **When** on en copie le texte, **Then** on obtient les mots tels qu'ils
   sont écrits, accents, apostrophes et tirets compris, dans l'ordre de lecture.
4. **Given** un PDF, **When** on clique sur l'email, LinkedIn, GitHub, le site ou un projet,
   **Then** le lien s'ouvre.
5. **Given** une donnée modifiée (une expérience, une compétence, le pitch), **When** le site
   est reconstruit, **Then** la page et les deux PDF montrent la nouvelle valeur, sans autre
   action du mainteneur.
6. **Given** un PDF qui ne peut pas être produit, **When** le site est construit, **Then**
   le build échoue ; aucun déploiement ne publie un PDF absent ou ancien.
7. **Given** un PDF, **When** on lit ses propriétés, **Then** son titre et son auteur sont
   renseignés dans sa langue.

---

### User Story 3 - Imprimer la page depuis le navigateur (Priority: P2)

Le recruteur imprime `/cv` (ou l'enregistre en PDF depuis son navigateur). Il obtient une page
A4 propre : sans en-tête ni pied de page du site, sans lien de téléchargement, en thème clair,
avec les adresses des liens écrites en clair.

**Why this priority**: certains recruteurs impriment la page qu'ils ont sous les yeux plutôt
que de chercher le PDF.

**Independent Test**: lancer l'aperçu avant impression de `/cv` et de `/en/cv` depuis un
navigateur en thème sombre ; l'aperçu tient sur une page A4, en clair, sans navigation, et
chaque lien montre son adresse.

**Acceptance Scenarios**:

1. **Given** la page, **When** on l'imprime, **Then** l'en-tête, la navigation, le pied de
   page et le lien de téléchargement ne s'impriment pas.
2. **Given** un système en thème sombre, **When** on imprime la page, **Then** elle
   s'imprime en thème clair, encre sur papier.
3. **Given** un lien du CV, **When** il s'imprime, **Then** son adresse est écrite en clair à
   côté de son texte, sauf quand le texte est déjà l'adresse ; la forme courte sans protocole
   ni barre finale (`linkedin.com/in/…`) compte comme l'adresse.
4. **Given** la page, **When** on l'imprime en A4, **Then** elle tient sur une page.

---

### User Story 4 - Tenir le CV à jour sans le saisir (Priority: P2)

Le mainteneur ne touche jamais au CV lui-même. Il modifie les données du site (campagne,
parcours, compétences, projets) et le CV suit. Seules les langues et la ville (lue par le PDF),
qui n'existaient
nulle part, sont ajoutées aux données, une seule fois. Aucun numéro de téléphone n'est écrit
dans le dépôt.

**Why this priority**: « une information, un seul endroit » (constitution, principe IV ;
`CONTENU.md` §7, critère « CV ↔ site : une seule source », §10).

**Independent Test**: changer une donnée de chaque source et reconstruire ; la page et les
deux PDF changent. Chercher un numéro de téléphone dans le dépôt : aucun résultat.

**Acceptance Scenarios**:

1. **Given** une langue ajoutée, retirée ou modifiée dans les données, **When** le site est
   construit, **Then** la rubrique Langues de la page et des deux PDF change, sans autre
   fichier modifié.
2. **Given** une langue sans nom ou sans niveau dans l'une des deux langues du site, **When**
   le site est construit, **Then** le build échoue et désigne la langue et le champ.
3. **Given** un projet qui n'est plus mis en avant, **When** le site est construit, **Then**
   il disparaît du CV.
4. **Given** le dépôt, **When** on le parcourt, **Then** aucun fichier ne contient de numéro
   de téléphone, gabarit du PDF compris.

---

### User Story 5 - Atteindre le CV depuis la campagne (Priority: P3)

Le levier « CV » de la campagne mène à `/cv` (ou `/en/cv`) au lieu d'un fichier statique.
Changer d'objectif ne demande toujours que de modifier les données de campagne.

**Why this priority**: le CV est le cinquième levier de campagne (`CONTENU.md` §7) ; il doit
pointer vers la source à jour.

**Independent Test**: suivre chaque lien vers le CV du site (navigation, appels à l'action)
dans les deux langues ; tous mènent à la page CV de la langue courante.

**Acceptance Scenarios**:

1. **Given** la navigation, **When** le visiteur clique sur « CV », **Then** il arrive sur
   `/cv` (ou `/en/cv` depuis une page anglaise).
2. **Given** les appels à l'action de l'accueil, **When** ils s'affichent, **Then** ce sont
   « Voir le CV » puis « M'écrire » (« View my CV » puis « Email me ») ; le premier mène au
   CV de la langue courante.
3. **Given** les données de campagne, **When** le mainteneur change un appel à l'action,
   **Then** aucune page ni aucun composant n'est modifié.

---

### Edge Cases

- **Aucun projet mis en avant** : la rubrique Projets n'apparaît pas ; aucun titre vide. Même
  règle pour toute rubrique sans entrée.
- **Disponibilité masquée** (`availability.visible` à faux) : le profil ne donne que le pitch.
- **Expérience en cours** : sa fin s'écrit « aujourd'hui » / « present », comme sur
  `/background`.
- **Projet non traduit** : sur `/en/cv` et dans le PDF anglais, sa prose apparaît en français,
  comme ailleurs sur le site, et son lien mène à `/en/projects/<slug>/`, qui affiche la version
  française avec la mention « disponible en français uniquement » (F06), comme sur `/skills`.
- **Caractères spéciaux dans une donnée** (`&`, `%`, `#`, `_`, `$`, guillemets, espaces
  insécables) : ils s'affichent tels quels dans la page et dans les PDF, sans casser la
  production du PDF.
- **Contenu trop long pour une page** : le build échoue et nomme le PDF qui déborde ; le
  mainteneur raccourcit une donnée.
- **Production du PDF lente ou en panne** (outil absent, ressource injoignable) : le build
  échoue avec un message qui dit quel PDF n'a pas pu être produit.

## Requirements _(mandatory)_

### Functional Requirements

**Page**

- **FR-001**: Le site DOIT publier le CV à `/cv` en français et à `/en/cv` en anglais, atteint
  par le lien « CV » de la navigation.
- **FR-002**: Le CV DOIT présenter, dans cet ordre : un en-tête (nom, titre ; sur la page,
  disponibilité, PDF, email, LinkedIn, GitHub sous leur libellé ; dans le PDF, email, ville,
  portfolio, LinkedIn, GitHub), Profil,
  Expérience, Formation, Projets, Compétences, Langues. Une rubrique sans entrée n'apparaît
  pas. Sur la page, chaque rubrique s'ouvre par un filet épais et un titre qui reste visible
  le long de la rubrique ; chaque étape porte sa pièce ; les projets reprennent la liste des
  coups avec leur symbole d'évaluation.
- **FR-003**: Le profil DOIT reprendre le pitch de la campagne et, quand il est visible, le
  bandeau de disponibilité.
- **FR-004**: L'expérience et la formation DOIVENT reprendre les entrées du parcours (intitulé,
  lieu, dates, détail, points), de la plus récente à la plus ancienne, avec les dates formatées
  comme sur `/background`.
- **FR-005**: La rubrique Projets DOIT lister les seuls projets mis en avant (3 au plus), du
  plus récent au plus ancien, chacun avec titre, année, technologies, résumé et lien vers sa
  page dans la langue du CV.
- **FR-006**: La rubrique Compétences DOIT reprendre toutes les compétences, regroupées par
  domaine, dans l'ordre des domaines et des compétences de `/skills`, par leur nom seul ; le
  niveau n'est pas écrit.
- **FR-007**: La rubrique Langues DOIT lister chaque langue avec son niveau, dans la langue du
  CV.
- **FR-008**: La page DOIT offrir un lien de téléchargement du PDF de sa langue.
- **FR-009**: Le CV NE DOIT afficher aucun numéro de téléphone.

**PDF**

- **FR-010**: Un PDF français et un PDF anglais DOIVENT être produits à chaque construction du
  site, à partir des mêmes données que la page, sans étape manuelle.
- **FR-011**: Chaque PDF DOIT reprendre les rubriques, les entrées et l'ordre de la page de sa
  langue, en une colonne, sur une page A4, dans une mise en page classique de CV : nom en tête,
  rubriques titrées et soulignées d'un filet, dates alignées à droite.
- **FR-012**: Le texte de chaque PDF DOIT être extractible tel qu'il est écrit (accents,
  apostrophes, tirets), dans l'ordre de lecture, sans icône à la place d'une information.
- **FR-013**: Les liens de chaque PDF (email, LinkedIn, GitHub, site, projets) DOIVENT être
  cliquables.
- **FR-014**: Chaque PDF DOIT porter un titre et un auteur dans ses propriétés.
- **FR-015**: Le build DOIT échouer, en nommant le PDF en cause, quand un PDF ne peut pas être
  produit ou dépasse une page.
- **FR-016**: La mise en page du PDF DOIT reprendre celle du CV PDF actuel du mainteneur
  (marges, filets, alignements, police à empattements de style Palatino), sans en reprendre le
  contenu ni le numéro de téléphone.

**Impression**

- **FR-017**: Imprimée depuis le navigateur, la page DOIT tenir sur une page A4, en thème clair
  quel que soit le thème du système, sans en-tête, navigation, pied de page ni lien de
  téléchargement.
- **FR-018**: À l'impression, chaque lien DOIT montrer son adresse en clair, sauf quand son
  texte est déjà l'adresse, y compris sous sa forme courte sans protocole ni barre finale.

**Données**

- **FR-019**: Le CV NE DOIT contenir aucune information saisie pour lui seul : tout vient de la
  campagne, du site, du parcours, des compétences, des projets et des langues.
- **FR-020**: Les langues DOIVENT être une donnée saisie une seule fois : pour chacune, un nom
  et un niveau dans les deux langues du site. Une langue incomplète fait échouer le build en la
  désignant.
- **FR-021**: La ville du mainteneur DOIT être une donnée saisie une seule fois, à côté de ses
  coordonnées.
- **FR-022**: Aucun fichier du dépôt NE DOIT contenir de numéro de téléphone.
- **FR-023**: Le levier « CV » de la campagne DOIT pointer vers `/cv` (ou `/en/cv`) : les deux
  appels à l'action de l'accueil deviennent « Voir le CV » puis « M'écrire », changés dans les
  données de campagne seulement.

**Qualité**

- **FR-024**: La page DOIT rester lisible de 375 px à 1280 px et au-delà, sans défilement
  horizontal, en clair et en sombre, selon `DESIGN.md`.
- **FR-025**: La page DOIT avoir un seul titre de premier niveau, un titre et une description
  uniques dans chaque langue, et des liens alternatifs entre les deux langues (F04).
- **FR-026**: La page DOIT être entièrement statique, sans script envoyé au navigateur
  (constitution, principes I et II).
- **FR-027**: Tous les libellés d'interface du CV (titres de rubrique, lien de téléchargement,
  « aujourd'hui », propriétés du PDF) DOIVENT exister dans les deux langues.

### Key Entities

- **CV** : une vue des données du site, dans une langue. Il ne possède aucune donnée propre.
  Il existe sous deux formes : la page et le PDF.
- **Langue** : une langue parlée. Nom et niveau, chacun en français et en anglais (par exemple
  « Turc, langue maternelle » / « Turkish, native »). Ordre fixé par les données.
- **Coordonnées** : nom, email, ville, LinkedIn, GitHub et adresse du site. Les données
  existantes du site, plus la ville, que seul le PDF affiche. Jamais de téléphone.
- Entités réutilisées telles quelles : campagne (pitch, disponibilité), expérience, formation
  (F07), compétence (F08), projet mis en avant (F06).

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: 100 % des informations du CV (page et PDF) viennent d'une donnée déjà utilisée
  ailleurs sur le site, ou de la seule nouvelle donnée Langues et ville ; 0 information saisie
  deux fois.
- **SC-002**: Après une modification de donnée et un déploiement, la page et les deux PDF
  montrent la nouvelle valeur dans 100 % des cas, sans action manuelle.
- **SC-003**: Chaque PDF tient sur une page A4 ; son texte copié-collé redonne 100 % des mots
  du CV, accents compris, dans l'ordre de lecture.
- **SC-004**: Un recruteur trouve et télécharge le PDF depuis n'importe quelle page du site en
  moins de 10 secondes.
- **SC-005**: 0 numéro de téléphone dans la page, les PDF et le dépôt.
- **SC-006**: Imprimée depuis un navigateur en thème sombre, la page tient sur une page A4 en
  thème clair, sans navigation.
- **SC-007**: À 375 px et à 1280 px, en clair et en sombre, la page n'a aucun défilement
  horizontal ni texte tronqué ou superposé.
- **SC-008**: La page atteint les cibles du site : Lighthouse performance ≥ 95,
  accessibilité 100, bonnes pratiques 100, SEO 100, et 0 ko de script envoyé au navigateur.
- **SC-009**: Un build dont un PDF ne peut pas être produit, ou dépasse une page, échoue dans
  100 % des cas.

## Assumptions

- **Dépendances** : F04 (SEO), F05 (campagne), F06 (projets mis en avant), F07 (parcours) et
  F08 (compétences) sont livrées. Le lien « CV » existe déjà dans la navigation.
- **Prose reprise telle quelle** : les détails et les points du parcours sont écrits à la
  première personne sur le site ; le CV les reprend sans réécriture, au nom de la source
  unique. Un ton plus nominal, propre au CV, serait une saisie en double.
- **Titre de l'en-tête** : le titre de poste des données du site (« Élève ingénieur en
  alternance »).
- **Produit au build, pas au clic** : le site est statique (constitution, principe II) ; « à
  jour » signifie « à jour du dernier déploiement ».
- **Noms des fichiers** : un nom stable par langue, pour qu'un lien partagé vers le PDF ne
  casse pas.
- **Gabarit** : la mise en page du CV PDF actuel du mainteneur, fournie par lui, débarrassée
  de son contenu et de son numéro de téléphone.
- **Hors périmètre** : un CV différent par candidature, une lettre de motivation, une version
  avec téléphone pour les envois par email (le mainteneur la garde hors du dépôt), le choix de
  la langue du PDF indépendamment de la page.
- **Contenu définitif** : les données réelles sont saisies hors speckit (C4) ; les langues sont
  livrées avec leurs valeurs réelles (français et turc langues maternelles, anglais courant).
- **Fin de feature** : la feature est visuelle ; elle se termine par l'audit et le polish
  Impeccable, vérifiés à 375 px et à 1280 px, en clair et en sombre (`AGENTS.md`).

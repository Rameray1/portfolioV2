# Feature Specification: Accueil et À propos

**Feature Branch**: `005-home-about`

**Created**: 2026-11-11

**Status**: Draft

**Input**: User description: "Accueil et page À propos, en FR et EN, pilotés par les leviers de campagne (CONTENU.md §3 et §7).

- Accueil : phrase d'identité, bandeau de disponibilité (ce que je cherche, à partir de quand, où — masquable), deux appels à l'action, et un emplacement pour les projets mis en avant (rempli en F06).
- Les 5 leviers de campagne sont lus depuis une source de données unique et bilingue : changer d'objectif ne touche aucun composant.
- En attendant F09, les appels à l'action pointent vers un CV PDF statique et un lien email ; ils changeront dans la donnée seulement.
- À propos : récit en trois paragraphes, photo optimisée, ce que je cherche. Le texte vit dans des fichiers de contenu, pas dans le composant.
- Les textes définitifs sont rédigés hors speckit (C1) ; des textes provisoires clairement marqués suffisent."

## Clarifications

### Session 2026-11-11

- Q: Quelle photo utiliser, et sous quelle forme ? → A: la photo du mainteneur `pp.jpg`, hors
  du dépôt (dossier parent `projects/`), à adapter au web pour qu'elle soit très légère.
  L'original fait 6,9 Mo en 6112 × 8160 px (portrait, Galaxy S24 Ultra) : il n'entre pas tel
  quel dans le dépôt.
- Q: Quel cadrage pour la photo ? → A: recadrage 4:5, de la tête jusqu'aux bras croisés, avec
  un peu du toit du temple en fond.
- Q: Quel CV derrière l'action « CV » en attendant F09 ? → A: à terme un CV PDF par langue,
  mais aucun n'est prêt (le mainteneur les fera quand le portfolio sera fini) : aucun PDF dans
  le dépôt en F05. D'ici là, la seconde action mène au profil LinkedIn ; elle passera au CV de
  chaque langue en changeant la donnée seulement.
- Q: Le diagramme d'échiquier fait-il partie de F05 ? → A: oui, immobile, avec une position
  provisoire en données ; le bandeau est sa légende. Mouvements en F06 et F11.
- Q: Comment marquer les textes provisoires, le site étant déjà en ligne ? → A: marque visible
  dans le texte, « [provisoire] » en français et « [draft] » en anglais, sur le site en ligne
  aussi.

## User Scenarios & Testing _(mandatory)_

Acteurs : le **recruteur** (international anglophone d'abord, puis francophone), le **lead
technique** et le **mainteneur** (seul auteur du site, `CONTENU.md` §2).

### User Story 1 - Le recruteur sait en 60 secondes qui, quand, où, et agit (Priority: P1)

Un recruteur arrive sur l'accueil, en français ou en anglais. Sans faire défiler sur grand
écran, il lit le nom, la phrase d'identité (`CONTENU.md` §3) et le bandeau de disponibilité :
ce que le mainteneur cherche, à partir de quand, où. Il a deux actions sous la main :
écrire un email, ouvrir le profil LinkedIn (le CV de sa langue, quand il existera).
L'ouverture suit `DESIGN.md` (ouverture d'un livre de
parties commentées) : le diagramme d'échiquier, dont le bandeau est la légende, est à côté du
texte.

**Why this priority**: c'est le filtre des 60 secondes de l'audience n°1. Sans lui, l'accueil
ne sert pas la campagne de stage.

**Independent Test**: ouvrir `/` puis `/en/` sur un écran de bureau et sur un mobile ; nom,
phrase d'identité, disponibilité (quoi, date, lieu) et deux actions sont présents dans la
langue de la page ; l'email se prépare vers la bonne adresse, le profil LinkedIn s'ouvre.

**Acceptance Scenarios**:

1. **Given** l'accueil français, **When** le recruteur l'ouvre, **Then** il voit le nom, la
   phrase d'identité française, le bandeau (statut, date de début, lieu) et deux actions :
   l'email et LinkedIn.
2. **Given** l'accueil anglais, **When** le recruteur l'ouvre, **Then** tous ces éléments sont
   en anglais, date comprise (format de date anglais).
3. **Given** l'action « LinkedIn », **When** le recruteur l'active, **Then** il arrive sur le
   profil LinkedIn du mainteneur.
4. **Given** l'action « email », **When** le recruteur l'active, **Then** sa messagerie
   prépare un message à l'adresse de contact du site.
5. **Given** un écran de bureau, **When** l'accueil s'affiche, **Then** le diagramme est à
   côté du texte et le bandeau lui sert de légende ; **Given** un mobile, **Then** l'ordre est
   nom, phrase d'identité et actions, puis diagramme et bandeau (`DESIGN.md`, Responsive).
6. **Given** l'accueil, **When** un visiteur le parcourt au clavier ou avec un lecteur
   d'écran, **Then** il atteint les deux actions, comprend leur destination, et le diagramme
   a une alternative textuelle.

---

### User Story 2 - Changer de campagne sans toucher au code (Priority: P1)

Le mainteneur décroche son stage, ou passe à la recherche d'un premier emploi. Il modifie une
seule source de données : la phrase d'identité, le bandeau (texte, date, lieu, ou le masquer),
les deux actions (libellé et destination) et le CV. Il ne modifie aucun composant ni aucune
page. Après le build, l'accueil et l'À propos reflètent le changement dans les deux langues.

**Why this priority**: c'est la priorité n°1 de conception du site (`CONTENU.md` §1, coût de
modification quasi nul ; constitution, principe V). F09 changera les actions dans la donnée
seulement.

**Independent Test**: dans la source de campagne, changer la date de disponibilité, masquer
le bandeau, puis changer la destination d'une action ; reconstruire ; vérifier les pages
sans qu'aucun fichier de composant ou de page n'ait été modifié (diff limité à la donnée).

**Acceptance Scenarios**:

1. **Given** une nouvelle date de début dans la donnée, **When** le site est construit,
   **Then** l'accueil et l'À propos l'affichent, formatée selon la langue de chaque page.
2. **Given** le bandeau masqué dans la donnée, **When** le site est construit, **Then** ni
   l'accueil ni l'À propos n'affichent de disponibilité, sans espace vide ni titre orphelin ;
   le reste de la page est inchangé.
3. **Given** une action dont la destination change (par exemple vers la page `/cv` en F09),
   **When** le site est construit, **Then** l'action pointe vers la nouvelle destination dans
   les deux langues.
4. **Given** un levier incomplet (une langue manquante, une date invalide, une action sans
   destination, plus ou moins de deux actions), **When** le projet est vérifié, **Then** la
   vérification échoue.
5. **Given** la phrase d'identité modifiée, **When** le site est construit, **Then** elle
   change aussi dans la description de l'accueil (F04) ; elle n'est écrite qu'à un endroit.

---

### User Story 3 - Le lead technique lit qui est derrière le site (Priority: P2)

Un lead technique ouvre « À propos », en français ou en anglais. Il lit un récit court en
trois paragraphes, voit une photo du mainteneur, et retrouve ce que le mainteneur cherche.
Le mainteneur rédige ce récit dans un fichier de contenu par langue, sans toucher à la page.

**Why this priority**: page de second niveau, ouverte après l'accueil ; utile au lead
technique et au recruteur convaincu, moins urgente que le filtre des 60 secondes.

**Independent Test**: ouvrir `/about` puis `/en/about` ; récit dans la langue de la page,
photo nette sans décalage de mise en page, section « ce que je cherche » cohérente avec le
bandeau de l'accueil ; modifier un paragraphe dans le fichier de contenu suffit à changer la
page.

**Acceptance Scenarios**:

1. **Given** la page À propos française, **When** le lead l'ouvre, **Then** il voit un titre,
   le récit en trois paragraphes, la photo avec un texte alternatif, et ce que le mainteneur
   cherche.
2. **Given** la page À propos anglaise, **When** il l'ouvre, **Then** le récit vient du
   fichier de contenu anglais, et tous les libellés sont en anglais.
3. **Given** le fichier de contenu d'une langue modifié, **When** le site est construit,
   **Then** la page de cette langue change, sans modification de composant.
4. **Given** le fichier de contenu d'une langue manquant ou sans titre ni description,
   **When** le projet est vérifié, **Then** la vérification échoue.
5. **Given** la page À propos, **When** elle est partagée ou lue par un moteur, **Then** elle
   a son propre titre et sa propre description, distincts de ceux de l'accueil, et ses liens
   alternatifs relient les deux langues (F04).

---

### User Story 4 - Préparer la place des projets mis en avant (Priority: P3)

L'accueil a, sous les actions, l'emplacement de la liste des projets mis en avant que F06
remplira. Tant qu'aucun projet n'existe, l'emplacement ne montre rien au visiteur.

**Why this priority**: évite de recomposer l'accueil en F06 ; sans valeur visible pour le
visiteur avant F06.

**Independent Test**: lire l'accueil construit : aucun titre de liste ni bloc vide n'est
visible ; le plan (F06) n'a qu'à fournir des projets à cet emplacement.

**Acceptance Scenarios**:

1. **Given** aucun projet mis en avant, **When** l'accueil s'affiche, **Then** aucun titre
   de liste, aucune légende ni aucun bloc vide n'apparaît.

---

### Edge Cases

- **Bandeau masqué** : le diagramme reste, sans légende ; l'À propos n'affiche pas sa section
  « ce que je cherche » ; aucun titre orphelin.
- **Date de disponibilité passée** : affichée telle quelle ; le mainteneur la met à jour (le
  site ne calcule rien en fonction du jour du build).
- **Date approximative** (« à partir de mars 2027 ») : la donnée permet un mois sans jour ;
  l'affichage suit la précision fournie.
- **Lieu multiple ou à distance** (« Europe, ou à distance ») : texte libre par langue.
- **Texte long** dans le bandeau ou une action : il passe à la ligne sans déborder, jusqu'à
  la plus petite largeur prise en charge.
- **Passage au CV** : quand les CV existeront, le CV devient la première action, avec une
  destination par langue (le CV français sur `/`, l'anglais sur `/en/`), et l'email la
  seconde ; libellés, destinations et ordre changent dans la donnée seulement.
- **Photo absente** : le build échoue, plutôt qu'une page avec une image cassée.
- **Texte provisoire oublié** : chaque texte provisoire porte « [provisoire] » ou « [draft] »,
  pour qu'un seul passage de recherche liste ce qui reste à rédiger (C1).
- **Récit de plus ou de moins de trois paragraphes** : accepté ; « trois paragraphes » est une
  règle de rédaction (C1), pas une contrainte du build.
- **Sélecteur de langue** : depuis `/about`, il mène à `/en/about`, et inversement (F03).
- **Lien « Projets » des pages** : il mène à une page introuvable jusqu'à F06 (état
  transitoire accepté depuis F02).

## Requirements _(mandatory)_

### Functional Requirements

**Leviers de campagne**

- **FR-001**: Les leviers de campagne livrés par F05 MUST vivre dans une seule source de
  données, bilingue : la phrase d'identité, le bandeau de disponibilité et les deux actions
  (dont celle qui portera le CV). Aucun composant ni aucune page ne contient leur texte ni leur
  destination (constitution, principe V).
- **FR-002**: Seule la prose existe par langue. Les données non textuelles du bandeau (date
  de début, visibilité) et des actions (destination, sauf si elle diffère par langue, comme le
  futur CV par langue) MUST n'exister qu'une fois (constitution, principe IV). L'adresse email
  et le profil LinkedIn viennent des données de contact existantes, jamais recopiés.
- **FR-003**: Une donnée de campagne incomplète ou invalide (langue manquante, date invalide,
  action sans libellé ou sans destination, nombre d'actions différent de deux) MUST faire
  échouer la vérification du projet.
- **FR-004**: Le levier « projets mis en avant » reste porté par les projets eux-mêmes
  (`CONTENU.md` §7, point 3) et arrive en F06 ; F05 ne crée pas de liste en double.

**Accueil**

- **FR-005**: L'accueil, en français (`/`) et en anglais (`/en/`), MUST afficher le nom, la
  phrase d'identité, le bandeau de disponibilité (s'il est visible), les deux actions et
  l'emplacement des projets mis en avant, dans la composition d'ouverture de `DESIGN.md`.
- **FR-006**: La phrase d'identité MUST être lue depuis la donnée de campagne, et servir aussi
  de description de l'accueil pour les moteurs et les aperçus de partage (F04,
  `CONTENU.md` §3).
- **FR-007**: Le bandeau MUST afficher le statut (ce que le mainteneur cherche), la date de
  début formatée selon la langue de la page, et le lieu. Il MUST pouvoir être masqué par la
  donnée seule ; masqué, il n'occupe aucune place.
- **FR-008**: Les deux actions MUST être des liens ordinaires. En F05, la première ouvre un
  email vers l'adresse de contact, la seconde mène au profil LinkedIn. Aucun CV PDF n'est
  publié en F05. Quand les CV existeront, une action MUST pouvoir mener au CV de la langue de
  la page, et les actions être réordonnées (CV en première, email en seconde), par un
  changement de donnée seulement ; une action vers un PDF MUST alors le signaler.
- **FR-009**: L'accueil MUST montrer le diagramme d'échiquier de `DESIGN.md` (planche imprimée,
  pièces placées chacune par sa case), avec une position provisoire tenue en données jusqu'à
  C2b. Le diagramme est immobile en F05 : coups au survol et coup signature arrivent en F06
  et F11. Il MUST avoir une alternative textuelle.
- **FR-010**: L'emplacement des projets mis en avant MUST exister sous les actions, sans rien
  afficher tant qu'il n'y a pas de projet.

**À propos**

- **FR-011**: Le site MUST avoir une page À propos en français (`/about`) et en anglais
  (`/en/about`), atteinte depuis la navigation existante.
- **FR-012**: Le récit de chaque langue (titre de page, description, prose) MUST vivre dans un
  fichier de contenu par langue, validé au build ; aucune prose dans le composant. Un fichier
  manquant ou incomplet MUST faire échouer la vérification.
- **FR-013**: La page MUST afficher la photo du mainteneur (`pp.jpg`), optimisée (formats
  modernes, taille adaptée à l'écran, dimensions déclarées pour éviter tout décalage de mise en
  page), avec un texte alternatif dans la langue de la page. La photo n'existe qu'une fois pour
  les deux langues.
- **FR-013a**: La photo MUST être recadrée au format 4:5, de la tête jusqu'aux bras croisés,
  avec un peu du toit du temple en fond ; le recadrage est fait une fois, dans la version
  source. Le dépôt MUST contenir cette version source réduite, jamais
  l'original de 6,9 Mo : au plus 2 fois la plus grande taille affichée, sans métadonnées
  (appareil, date, position éventuelle).
- **FR-014**: La page MUST afficher « ce que je cherche » à partir de la même donnée que le
  bandeau de l'accueil, jamais d'une copie ; masquée avec lui.

**Textes**

- **FR-015**: Tous les textes livrés par F05 (phrase d'identité exceptée, déjà fixée par
  `CONTENU.md` §3) MAY être provisoires ; chaque texte provisoire MUST porter, dans le texte
  affiché, la marque « [provisoire] » (français) ou « [draft] » (anglais), recherchable en une
  fois. Les libellés d'interface passent par le
  dictionnaire (constitution, principe VI).
- **FR-016**: Tout texte publié, provisoire compris, MUST respecter `CONTENU.md` §9 : mots
  bannis, aucune date en dur dans la prose, aucun numéro de téléphone.

### Key Entities

- **Campagne** : l'ensemble des leviers de la recherche en cours ; une seule source,
  bilingue.
- **Phrase d'identité** : une phrase par langue ; affichée sur l'accueil et utilisée comme
  description.
- **Disponibilité** : statut (par langue), date de début (unique, au jour ou au mois), lieu
  (par langue), visibilité (unique).
- **Action** : libellé (par langue), destination (unique ou par langue) ; exactement deux.
- **CV** : un PDF par langue, à venir (hors F05) ; il remplacera LinkedIn et passera en
  première action, en attendant la page `/cv` de F09.
- **Récit À propos** : titre, description et prose, un fichier par langue.
- **Photo** : une image unique, avec un texte alternatif par langue.
- **Position du diagramme** : les pièces et leurs cases, provisoire jusqu'à C2b.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Sur un écran de bureau de 1280 × 800, nom, phrase d'identité, disponibilité
  (quoi, quand, où) et les deux actions sont visibles sans défilement sur `/` et `/en/`.
- **SC-002**: Changer d'objectif de campagne (phrase, bandeau, actions) modifie 1 seule
  source de données et 0 fichier de composant ou de page.
- **SC-003**: Masquer le bandeau demande la modification d'1 seule valeur et le retire de 100 %
  des pages qui l'affichent.
- **SC-004**: 100 % des leviers incomplets ou invalides testés font échouer la vérification
  du projet.
- **SC-005**: Modifier le récit À propos d'une langue touche 1 fichier de contenu et 0
  composant.
- **SC-006**: Les quatre pages (`/`, `/en/`, `/about`, `/en/about`) obtiennent au moins 95 en
  performance et 100 en accessibilité, bonnes pratiques et SEO à l'audit mobile de référence
  (constitution, principe VII), dans les deux thèmes, réglage global de non-indexation
  inactif.
- **SC-007**: L'accueil pèse moins de 200 ko transférés ; les quatre pages envoient 0 ko de
  JavaScript au navigateur.
- **SC-008**: La photo ne provoque aucun décalage de mise en page mesurable, et chaque version
  servie au navigateur pèse moins de 50 ko.
- **SC-009**: Une recherche de la marque provisoire liste 100 % des textes encore à rédiger
  (C1) ; une fois C1 fait, elle ne renvoie plus rien.
- **SC-010**: Les quatre pages ont un titre et une description uniques dans leur langue.

## Assumptions

- **Diagramme dans F05** : confirmé (voir Clarifications). Les mouvements (survol en F06, coup
  signature en F11) sont hors périmètre.
- **Projets mis en avant** : le levier n°3 est le champ `featured` des projets (`CONTENU.md`
  §7), créé en F06. Le plan F05 vérifie que la formulation du principe V de la constitution
  (« les 5 leviers dans une source ») reste compatible, ou propose son alignement.
- **CV** : aucun en F05 (voir Clarifications) ; pas de PDF provisoire en ligne. F09
  remplacera ensuite la destination par la page `/cv`.
- **Photo** : `pp.jpg`, fournie (voir Clarifications) ; pas d'image provisoire.
- **Email** : un lien qui ouvre la messagerie du visiteur, vers l'adresse de contact déjà
  définie ; pas de formulaire (site sans serveur, `CONTENU.md` §5).
- **Ordre des actions** : en F05, email d'abord (le contact direct), LinkedIn ensuite. Quand
  les CV existeront, le CV passera en première action (bouton plein de `DESIGN.md`) et l'email
  en seconde : un réordonnancement dans la donnée seulement.
- **Masquage** : un seul réglage de visibilité masque la disponibilité partout où elle
  s'affiche (accueil et À propos).
- **Marque provisoire** : visible sur le site en ligne, acceptable car le site est non
  indexable jusqu'à C3 (F04).
- **Données structurées de l'accueil** (F04) : inchangées ; seule la description de l'accueil
  passe à la donnée de campagne.
- Dépendances : F04 fusionnée (présentation SEO par page, liens alternatifs, non-indexation).

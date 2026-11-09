# Feature Specification: SEO et pages système

**Feature Branch**: `004-seo-system-pages`

**Created**: 2026-11-09

**Status**: Draft

**Input**: User description: "Chaque page est correctement présentée aux moteurs et aux réseaux, depuis un seul endroit.

- Chaque page expose titre, description, URL canonique, aperçu de partage (Open Graph) et liens alternatifs vers son autre langue.
- Une page peut être déclarée non indexable. Un réglage global rend tout le site non indexable (utilisé jusqu'à la publication des projets) ; il agit aussi sur le robots.txt.
- Un plan du site bilingue liste les pages indexables uniquement.
- L'accueil décrit la personne en données structurées.
- Une page 404 utile (liens vers accueil, projets, email) existe en FR et EN.
- Favicon et une image de partage par défaut, selon DESIGN.md."

## User Scenarios & Testing _(mandatory)_

Acteurs : le **visiteur** (recruteur ou lead technique, francophone ou anglophone), le
**contact qui partage un lien** (sur LinkedIn, Slack, par message), les **moteurs de
recherche** et le **mainteneur** (seul auteur du site).

### User Story 1 - Un lien partagé s'affiche proprement (Priority: P1)

Un recruteur colle l'adresse du site, ou d'une de ses pages, dans LinkedIn ou une messagerie.
L'aperçu montre le titre de la page, sa description et une image de partage aux couleurs du
site, dans la langue de la page partagée. L'onglet du navigateur montre le favicon du site.

**Why this priority**: le site se diffuse surtout par liens partagés pendant la campagne de
stage ; un aperçu vide ou générique fait perdre le clic avant même la visite.

**Independent Test**: passer `/` puis `/en/` dans un outil de prévisualisation de partage ;
chacun montre un titre, une description et l'image de partage dans sa langue.

**Acceptance Scenarios**:

1. **Given** l'adresse de l'accueil français, **When** elle est partagée, **Then** l'aperçu
   montre le nom, la description de l'accueil (le pitch de `CONTENU.md` §3) et l'image de
   partage française.
2. **Given** l'adresse de l'accueil anglais, **When** elle est partagée, **Then** l'aperçu est
   entièrement en anglais, image comprise.
3. **Given** une page qui ne fournit pas d'image propre, **When** elle est partagée, **Then**
   l'aperçu utilise l'image de partage par défaut de sa langue.
4. **Given** un onglet ouvert sur le site, en thème clair ou sombre du système, **When** le
   visiteur le regarde, **Then** le favicon du site est visible et lisible sur la barre
   d'onglets.

---

### User Story 2 - Les moteurs comprennent le site bilingue (Priority: P1)

Un moteur de recherche explore le site. Chaque page lui donne son adresse de référence et
l'adresse de son équivalent dans l'autre langue. Le plan du site liste toutes les pages
indexables des deux langues, et seulement elles. Sur l'accueil, des données structurées
décrivent la personne : nom, rôle, école, liens vers ses profils.

**Why this priority**: l'audience n°1 est anglophone (`CONTENU.md` §2) ; sans liens
alternatifs, un moteur peut montrer la version française à un recruteur anglophone, ou
traiter les deux versions comme du contenu dupliqué.

**Independent Test**: lire le code source de `/` et `/en/` : chaque page donne son adresse
canonique et pointe vers l'autre ; le plan du site contient ces deux adresses, reliées entre
elles ; un validateur de données structurées reconnaît une personne sur l'accueil.

**Acceptance Scenarios**:

1. **Given** une page générée, **When** un moteur la lit, **Then** elle déclare une adresse
   canonique absolue, qui est sa propre adresse publique.
2. **Given** une page qui existe dans les deux langues, **When** un moteur la lit, **Then**
   elle déclare ses deux versions (française et anglaise) et désigne le français comme version
   par défaut.
3. **Given** une page qui n'existe qu'en français (un article de blog), **When** un moteur la
   lit, **Then** elle ne déclare aucune version anglaise.
4. **Given** le plan du site, **When** un moteur le lit, **Then** il contient chaque page
   indexable des deux langues, avec ses équivalents dans l'autre langue, et aucune page non
   indexable ni la page introuvable.
5. **Given** l'accueil (français ou anglais), **When** un validateur de données structurées
   le lit, **Then** il reconnaît une personne avec son nom, son rôle, son école, l'adresse du
   site et ses profils GitHub et LinkedIn, sans erreur.

---

### User Story 3 - Garder le site hors des moteurs avant la publication (Priority: P1)

Le site est mis en ligne tôt (après F04) mais n'a pas encore ses projets. Le mainteneur active
un seul réglage : aucune page n'est indexable et le fichier d'instructions pour robots demande
aux moteurs de ne rien explorer. Le jour de la publication des projets (C3), il désactive ce
réglage et tout le site redevient indexable, sauf les pages déclarées non indexables une à
une.

**Why this priority**: un site à moitié vide indexé sous le nom du mainteneur desservirait la
campagne ; la mise en ligne précoce (`ROADMAP.md`) n'est possible qu'avec ce verrou.

**Independent Test**: construire le site avec le réglage actif ; chaque page porte la
consigne de non-indexation, le fichier robots interdit tout. Construire sans le réglage ; les
pages ordinaires sont indexables, le fichier robots autorise tout et indique le plan du site.

**Acceptance Scenarios**:

1. **Given** le réglage global actif, **When** le site est construit, **Then** 100 % des pages
   demandent à ne pas être indexées, et le fichier robots interdit l'exploration de tout le
   site.
2. **Given** le réglage global inactif, **When** le site est construit, **Then** les pages
   ordinaires sont indexables, et le fichier robots autorise l'exploration et donne l'adresse
   du plan du site.
3. **Given** une page déclarée non indexable par le mainteneur, **When** le site est construit
   sans réglage global, **Then** cette page seule demande à ne pas être indexée et n'apparaît
   pas dans le plan du site.
4. **Given** le réglage global, **When** le mainteneur veut le changer, **Then** il le fait à
   un seul endroit, sans modifier aucune page.

---

### User Story 4 - Un visiteur égaré retrouve son chemin (Priority: P2)

Un visiteur suit un lien cassé ou tape une mauvaise adresse. Il voit une page « introuvable »
dans la langue de l'adresse demandée, aux couleurs du site, avec l'en-tête et le pied de page,
qui lui propose trois sorties : l'accueil, les projets, l'email du mainteneur.

**Why this priority**: une page d'erreur générique fait partir le recruteur ; trois liens
utiles le gardent. Moins urgent que le partage et l'indexation, car rare.

**Independent Test**: ouvrir `/n-existe-pas` puis `/en/does-not-exist` sur le site déployé ;
chaque fois, la page introuvable est dans la bonne langue et ses trois liens mènent au bon
endroit.

**Acceptance Scenarios**:

1. **Given** une adresse inexistante sans préfixe, **When** le visiteur l'ouvre, **Then** il
   voit la page introuvable en français, avec des liens vers `/`, `/projects/` et l'email.
2. **Given** une adresse inexistante sous `/en`, **When** le visiteur l'ouvre, **Then** il
   voit la page introuvable en anglais, avec des liens vers `/en/`, `/en/projects/` et
   l'email.
3. **Given** la page introuvable, **When** un moteur la lit, **Then** elle demande à ne pas
   être indexée et elle n'est pas dans le plan du site.
4. **Given** la page introuvable, **When** le visiteur la parcourt au clavier ou avec un
   lecteur d'écran, **Then** il comprend qu'il est sur une page d'erreur et atteint chaque
   lien.

---

### User Story 5 - Présenter une nouvelle page sans effort (Priority: P2)

Le mainteneur crée une page : il lui donne un titre et une description, et rien d'autre.
Adresse canonique, aperçu de partage, liens alternatifs et présence dans le plan du site
découlent de là. S'il le souhaite, il donne une image de partage propre ou déclare la page non
indexable, au même endroit.

**Why this priority**: c'est ce qui rend la présentation « depuis un seul endroit » durable ;
F05 à F10 ajoutent des pages sans retoucher le SEO.

**Independent Test**: créer une page de test avec seulement un titre et une description ;
toutes ses balises de présentation sont présentes et justes ; oublier la description fait
échouer la vérification du projet.

**Acceptance Scenarios**:

1. **Given** une nouvelle page avec un titre et une description, **When** le site est
   construit, **Then** elle expose canonique, aperçu de partage, liens alternatifs éventuels et
   figure au plan du site, sans autre code.
2. **Given** une page sans description, **When** le projet est vérifié, **Then** la
   vérification échoue.
3. **Given** une page qui fournit sa propre image de partage, **When** elle est partagée,
   **Then** l'aperçu utilise cette image à la place de l'image par défaut.

---

### Edge Cases

- **Barre oblique finale** : l'adresse canonique, les liens alternatifs et le plan du site
  utilisent la même forme d'adresse pour une page donnée, celle que le site sert réellement.
- **Page présente dans une seule langue** (blog) : pas de lien alternatif vers une page qui
  n'existe pas ; le plan du site la liste seule.
- **Page non indexable qui a un équivalent** : ni elle, ni son lien alternatif n'apparaissent
  au plan du site ; l'équivalent indexable y reste, sans lien vers elle.
- **Réglage global actif** : le plan du site peut exister, mais le fichier robots n'y renvoie
  pas ; les pages portent toutes la consigne de non-indexation.
- **Pages de rubriques pas encore livrées** (F05 à F10) : aucune n'apparaît au plan du site,
  qui ne liste que les pages réellement générées. Le lien « Projets » de la page introuvable
  mène à une page introuvable jusqu'à F06 ; état transitoire accepté, comme la navigation
  depuis F02.
- **Page introuvable et sélecteur de langue** : le sélecteur mène à l'accueil de l'autre
  langue (règle de repli de F03), jamais à une autre page introuvable.
- **Page introuvable servie avec le bon statut** : l'hébergeur répond « page introuvable »
  (et non « succès ») ; le choix de l'hébergeur relève de la mise en ligne.
- **Titre identique dans les deux langues** (le nom sur l'accueil) : accepté, les liens
  alternatifs relient les deux pages (constitution, principe VII).
- **Image de partage** : texte lisible une fois réduit à la taille d'un aperçu de messagerie ;
  une image par langue, puisque le pitch diffère (`DESIGN.md`).
- **Favicon en thème sombre** : il suit le thème du système, pas le choix de thème du site.
- **Navigateur qui demande l'ancien format d'icône** à la racine : il reçoit une icône du site,
  pas une page introuvable.

## Requirements _(mandatory)_

### Functional Requirements

**Présentation de chaque page**

- **FR-001**: La présentation d'une page aux moteurs et aux réseaux (titre, description,
  adresse canonique, aperçu de partage, liens alternatifs, consigne d'indexation) MUST être
  produite à un seul endroit, commun à toutes les pages. Une page ne fournit que des données :
  titre, description, et en option une image de partage. Le caractère non indexable d'une
  page est déclaré à un seul endroit dans les données du site, pas dans la page.
- **FR-002**: Chaque page MUST avoir un titre et une description. Une page sans l'un des deux
  MUST faire échouer la vérification du projet.
- **FR-003**: Chaque page MUST déclarer une adresse canonique absolue, construite à partir de
  l'adresse publique du site (définie à un seul endroit) et du chemin de la page. Exception :
  la page introuvable, servie à n'importe quelle adresse, n'en déclare aucune (ni liens
  alternatifs).
- **FR-004**: Chaque page MUST exposer un aperçu de partage complet : titre, description,
  adresse, type de contenu, nom du site, langue de la page, image avec son texte alternatif et
  ses dimensions. Le grand format d'aperçu MUST être demandé aux réseaux qui le proposent.
- **FR-005**: Une page qui existe dans les deux langues MUST déclarer ses deux versions par des
  liens alternatifs absolus, plus une version par défaut qui pointe vers la française. Une
  page qui n'existe que dans une langue MUST n'en déclarer aucun vers l'autre. L'existence de
  l'équivalent est déterminée au build, d'après les pages réellement générées, comme pour le
  sélecteur de F03.

**Indexation**

- **FR-006**: Une page MUST pouvoir être déclarée non indexable ; elle demande alors aux
  moteurs de ne pas l'indexer.
- **FR-007**: Un réglage global, modifiable à un seul endroit et sans toucher aux pages, MUST
  rendre toutes les pages non indexables. Il MUST être désactivé par défaut pour le
  développement local et activé sur le site en ligne jusqu'à la publication des projets (C3).
- **FR-008**: Le site MUST publier un fichier d'instructions pour robots qui suit le réglage
  global : réglage actif, il interdit l'exploration de tout le site ; réglage inactif, il
  autorise l'exploration et donne l'adresse du plan du site.

**Plan du site**

- **FR-009**: Le site MUST publier un plan du site qui liste toutes les pages indexables des
  deux langues, et seulement elles : ni page non indexable, ni page introuvable.
- **FR-010**: Dans le plan du site, chaque page qui a un équivalent indexable dans l'autre
  langue MUST être reliée à lui.

**Données structurées**

- **FR-011**: L'accueil, en français et en anglais, MUST décrire la personne en données
  structurées : nom, rôle, école, employeur en alternance, adresse du site, profils GitHub et
  LinkedIn. Ces informations MUST venir des données du site déjà existantes ou d'un seul
  nouvel endroit, jamais être recopiées (constitution, principe IV). Le rôle est écrit dans la
  langue de la page.
- **FR-012**: Les données structurées MUST NOT contenir de numéro de téléphone (`CONTENU.md`
  §9) et MUST passer un validateur de données structurées sans erreur.

**Page introuvable**

- **FR-013**: Le site MUST avoir une page introuvable en français et une en anglais, servies
  pour toute adresse inexistante de leur langue (sous `/en` : l'anglaise ; ailleurs : la
  française). Le service par langue dépend de l'hébergeur et se configure à la mise en ligne
  (voir Assumptions) ; F04 livre les deux pages.
- **FR-014**: Chaque page introuvable MUST utiliser le gabarit du site (en-tête, navigation,
  pied de page), dire en une phrase que la page n'existe pas, et proposer trois liens dans sa
  langue : l'accueil, la liste des projets et l'email du mainteneur. Ses textes suivent
  `CONTENU.md` §9 et ses libellés passent par le dictionnaire.
- **FR-015**: La page introuvable MUST être non indexable, quel que soit le réglage global.

**Identité visuelle**

- **FR-016**: Le site MUST avoir un favicon conforme à `DESIGN.md` (« Favicon, à construire en
  F04 ») : carré, angles droits, le symbole `!` en rouge du commentateur sur fond papier,
  vectorisé, qui suit le thème clair ou sombre du système. Il remplace le favicon actuel, et un
  format de repli MUST exister pour les navigateurs qui ne lisent pas le format vectoriel.
- **FR-017**: Le site MUST avoir une image de partage par défaut par langue, conforme à
  `DESIGN.md` (« Image de partage par défaut ») : 1200 × 630, fond papier, nom en Display,
  filet d'encre de 2 px, ligne d'en-tête de partie, pitch de `CONTENU.md` §3 dans la langue de
  l'image, au plus un élément rouge, sans rayon ni ombre.

### Key Entities

- **Présentation d'une page** : titre, description, adresse canonique, image de partage (par
  défaut ou propre), caractère indexable, versions dans chaque langue.
- **Réglage d'indexation global** : un interrupteur unique (actif ou inactif) qui l'emporte sur
  le caractère indexable de chaque page et pilote le fichier robots.
- **Adresse publique du site** : base absolue de toutes les adresses canoniques, alternatives
  et du plan du site ; définie à un seul endroit.
- **Personne** : nom, rôle (par langue), école, employeur, profils ; décrite sur l'accueil.
- **Image de partage** : visuel 1200 × 630, une par langue par défaut, avec un texte
  alternatif dans la langue de la page.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: 100 % des pages générées ont un titre, une description, une adresse canonique
  absolue et un aperçu de partage complet avec image.
- **SC-002**: 100 % des pages présentes dans les deux langues déclarent leurs deux versions ;
  0 lien alternatif ne pointe vers une page inexistante.
- **SC-003**: Le plan du site contient 100 % des pages indexables et 0 page non indexable ni
  page introuvable.
- **SC-004**: Avec le réglage global actif, 100 % des pages demandent à ne pas être indexées
  et le fichier robots interdit tout ; inverser le réglage demande la modification d'1 seul
  endroit, 0 page.
- **SC-005**: Ajouter une page correctement présentée demande 2 informations (titre,
  description) et 0 ligne de code SEO.
- **SC-006**: Un validateur de données structurées reconnaît une personne sur `/` et `/en/`,
  avec 0 erreur.
- **SC-007**: Un outil de prévisualisation de partage montre, pour `/` et `/en/`, un aperçu
  grand format avec titre, description et image dans la bonne langue.
- **SC-008**: L'audit SEO mobile de référence de la constitution (principe VII) donne 100 sur
  `/` et `/en/` avec le réglage global inactif ; avec le réglage actif, seule la consigne de
  non-indexation est relevée.
- **SC-009**: Une adresse inexistante mène, en 1 clic depuis la page introuvable, à l'accueil,
  aux projets ou à l'email, dans la langue de l'adresse demandée.
- **SC-010**: Un audit d'accessibilité automatisé des deux pages introuvables ne relève aucune
  erreur, dans les deux thèmes ; elles envoient 0 ko de JavaScript au navigateur.
- **SC-011**: Le poids transféré de l'accueil reste sous 200 ko ; l'image de partage n'est pas
  chargée par la page elle-même.

## Assumptions

- **Adresse publique du site** : le nom de domaine définitif est choisi à la mise en ligne
  (après F04). Une adresse provisoire est posée à un seul endroit ; la changer met à jour
  canoniques, liens alternatifs, plan du site et fichier robots sans autre modification.
- **Valeur par défaut du réglage global** : inactif en local, pour pouvoir vérifier les pages
  indexables ; activé sur le site en ligne à la mise en ligne (`ROADMAP.md`). Les aperçus de
  branche de l'hébergeur héritent du réglage du site en ligne.
- **Image de partage propre à une page** : le mécanisme existe dès F04 (FR-001) mais aucune
  page n'en fournit encore ; les pages projet l'utiliseront peut-être en F06.
- **Version par défaut des liens alternatifs** : le français, langue par défaut du site
  (`CONTENU.md` §5).
- **Rôle dans les données structurées** : dérivé du message en une phrase (`CONTENU.md` §3) ;
  le pitch lui-même passera dans les leviers de campagne en F05 (constitution, principe V),
  et les données structurées le liront alors à cet endroit.
- **Description de l'accueil** : le pitch de `CONTENU.md` §3, dans chaque langue.
- **Statut « introuvable »** : le site produit les pages ; leur service avec le bon statut pour
  toute adresse inexistante dépend de l'hébergeur, configuré à la mise en ligne.
- **Flux RSS** (`/rss.xml`) : hors périmètre, il naît avec le blog (F09).
- **Pas de manifeste d'application web** : le site n'est pas une application installable
  (`ROADMAP.md`, plan F04).
- **Pas de balises propres à un seul réseau** au-delà du grand format d'aperçu : le format
  d'aperçu standard est lu par LinkedIn, Slack, les messageries et X.
- Dépendances : F03 fusionnée (deux langues, dictionnaire, règle de repli du sélecteur).

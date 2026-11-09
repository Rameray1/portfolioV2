# Feature Specification: Site bilingue

**Feature Branch**: `003-bilingual-site`

**Created**: 2026-11-09

**Status**: Draft

**Input**: User description: "Le site existe en français (par défaut, sans préfixe) et en anglais sous /en, avec les mêmes chemins (/projects ↔ /en/projects).

- Tous les libellés d'interface (navigation, boutons, pied de page) viennent d'un dictionnaire FR/EN. Une clé absente dans une langue fait échouer la vérification du projet.
- Un sélecteur de langue dans l'en-tête mène à la même page dans l'autre langue ; si elle n'existe pas, à l'accueil de cette langue.
- La langue de chaque page est correctement déclarée.
- Le blog n'a pas de version anglaise : dans la navigation anglaise, le lien Blog pointe vers /blog avec la mention (FR) (CONTENU.md §5).
- Les libellés posés en F02 sont convertis. Une page d'accueil anglaise provisoire existe."

## User Scenarios & Testing _(mandatory)_

Acteurs : le **visiteur** (recruteur ou lead technique, francophone ou anglophone ; l'audience
n°1 est anglophone, `ROADMAP.md` F03) et le **mainteneur** (seul auteur du site, qui ajoute des
pages et des libellés).

### User Story 1 - Lire le site en anglais (Priority: P1)

Un recruteur anglophone ouvre `/en/`. Toute l'interface est en anglais : lien d'évitement,
navigation, pied de page, sélecteur de langue. Le contenu de l'accueil provisoire est en
anglais, réécrit et non traduit mot à mot. Son navigateur et son lecteur d'écran savent que la
page est en anglais. Les liens de la navigation mènent aux mêmes rubriques sous `/en`.

**Why this priority**: l'audience n°1 est anglophone ; sans version anglaise, le site manque
sa cible principale. Poser l'anglais maintenant fait naître bilingues toutes les features
suivantes (F04 à F12).

**Independent Test**: ouvrir `/en/` ; aucun libellé français n'apparaît hors du lien Blog
marqué (FR) ; la langue déclarée du document est l'anglais ; les liens de rubriques commencent
par `/en/`.

**Acceptance Scenarios**:

1. **Given** l'accueil anglais `/en/`, **When** le visiteur l'ouvre, **Then** le lien
   d'évitement, la navigation, le pied de page et le sélecteur de langue sont en anglais, et le
   contenu de la page aussi.
2. **Given** l'accueil anglais, **When** un lecteur d'écran le lit, **Then** il le prononce en
   anglais, car la page déclare l'anglais comme langue.
3. **Given** la navigation anglaise, **When** le visiteur suit « Projects », **Then** il arrive
   sur `/en/projects/`, le même chemin que la version française précédé de `/en`.
4. **Given** le nom dans l'en-tête de la version anglaise, **When** le visiteur le suit,
   **Then** il arrive sur `/en/`, pas sur l'accueil français.
5. **Given** l'accueil français `/`, **When** le visiteur l'ouvre, **Then** il le voit comme
   avant F03, sans préfixe dans l'adresse, avec la langue française déclarée.

---

### User Story 2 - Changer de langue depuis n'importe quelle page (Priority: P1)

Sur n'importe quelle page, le visiteur trouve dans l'en-tête un lien vers l'autre langue. Il le
suit et arrive sur la même page dans l'autre langue ; si cette page n'existe pas dans l'autre
langue, il arrive sur l'accueil de cette langue, jamais sur une page introuvable.

**Why this priority**: un recruteur arrivé sur la version française par un lien partagé doit
pouvoir passer à l'anglais en un clic, sans revenir à l'accueil ni deviner une adresse.

**Independent Test**: depuis `/`, suivre le sélecteur ; arriver sur `/en/`. Depuis `/en/`,
le suivre ; arriver sur `/`. Le sélecteur fonctionne sans JavaScript.

**Acceptance Scenarios**:

1. **Given** une page française qui existe aussi en anglais, **When** le visiteur suit le
   sélecteur, **Then** il arrive sur cette page en anglais (`/x` → `/en/x`).
2. **Given** une page anglaise qui existe aussi en français, **When** le visiteur suit le
   sélecteur, **Then** il arrive sur cette page en français (`/en/x` → `/x`).
3. **Given** une page qui n'existe que dans une langue (par exemple un article de blog en
   français), **When** le visiteur suit le sélecteur, **Then** il arrive sur l'accueil de
   l'autre langue.
4. **Given** le sélecteur, **When** un lecteur d'écran le lit, **Then** son libellé est
   prononcé dans la langue qu'il propose et annonce clairement qu'il mène à l'autre langue.
5. **Given** un visiteur au clavier, **When** il parcourt l'en-tête, **Then** le sélecteur est
   atteignable et activable comme tout autre lien, avec l'anneau de focus du site.

---

### User Story 3 - Trouver le blog depuis la version anglaise (Priority: P2)

Le visiteur anglophone voit « Blog (FR) » dans la navigation. Il sait avant de cliquer que les
articles sont en français, et le lien l'emmène sur `/blog/`, la seule version du blog.

**Why this priority**: le blog n'est pas traduit (`CONTENU.md` §5) ; sans la mention, le
visiteur tomberait sans prévenir sur du français, ou sur une page `/en/blog` introuvable.

**Independent Test**: sur `/en/`, le lien Blog porte la mention (FR) et pointe vers `/blog/` ;
aucun lien du site ne pointe vers `/en/blog`.

**Acceptance Scenarios**:

1. **Given** la navigation anglaise, **When** le visiteur la lit, **Then** l'entrée Blog
   affiche la mention (FR) et pointe vers `/blog/`.
2. **Given** la navigation française, **When** le visiteur la lit, **Then** l'entrée Blog
   n'affiche aucune mention et pointe vers `/blog/`.
3. **Given** l'entrée « Blog (FR) », **When** un lecteur d'écran la lit, **Then** il comprend
   que la destination est en français.

---

### User Story 4 - Ajouter un libellé ou une page dans les deux langues (Priority: P2)

Le mainteneur ajoute un libellé d'interface : il l'écrit dans le dictionnaire en français et en
anglais. S'il oublie une langue, la vérification du projet échoue et désigne la clé. Il ajoute
une page bilingue : la structure de la page est écrite une seule fois, seuls ses textes
existent dans chaque langue.

**Why this priority**: c'est ce qui garde le site bilingue dans la durée. Un oubli détecté à
la vérification ne se retrouve jamais en ligne.

**Independent Test**: retirer la traduction anglaise d'une clé existante ; la vérification du
projet échoue en nommant la clé. La remettre ; elle passe.

**Acceptance Scenarios**:

1. **Given** une clé présente en français et absente en anglais (ou l'inverse), **When** le
   projet est vérifié, **Then** la vérification échoue et désigne la clé et la langue.
2. **Given** un composant qui demande une clé inexistante dans le dictionnaire, **When** le
   projet est vérifié, **Then** la vérification échoue.
3. **Given** la page d'accueil, **When** le mainteneur la lit, **Then** sa structure n'existe
   qu'à un endroit, partagée par `/` et `/en/` ; seuls ses textes diffèrent.

---

### Edge Cases

- **Chemin avec ou sans barre oblique finale** : le sélecteur et la rubrique courante donnent
  le même résultat dans les deux cas, en français comme en anglais.
- **Rubrique sous `/en`** : sur `/en/projects/x`, la rubrique « Projects » est signalée comme
  courante, comme « Projets » l'est sur `/projects/x` (FR-010 de F02).
- **Pages de rubriques pas encore livrées** (F05 à F10) : les liens de la navigation anglaise
  mènent à une page introuvable, comme en français depuis F02. État transitoire accepté,
  vérifié en F12 seulement.
- **Sélecteur sur une page sans équivalent** : la cible est l'accueil de l'autre langue,
  jamais une page introuvable (FR-008).
- **Page `/blog` lue depuis la version anglaise** : elle reste entièrement en français, avec la
  navigation française ; c'est une page française.
- **Visiteur dont le navigateur est en anglais** et qui arrive sur `/` : il voit le français et
  le sélecteur ; aucune redirection automatique (voir Assumptions).
- **Noms propres et marques** : GitHub et LinkedIn, libellés du pied de page, sont identiques
  dans les deux langues mais passent tout de même par le dictionnaire, pour qu'aucun texte
  d'UI ne soit en dur. Le nom du mainteneur est une donnée du site, pas un libellé : il reste
  hors du dictionnaire.
- **Adresse sous `/en` pour le blog** (`/en/blog`) : aucune page n'est générée, aucun lien du
  site n'y mène.
- **Libellé anglais plus long** que le français : la navigation passe à la ligne sans
  déborder, à 320 px et à 200 % de zoom, comme en F02.

## Requirements _(mandatory)_

### Functional Requirements

**Langues et adresses**

- **FR-001**: Le site MUST exister en deux langues : le français, langue par défaut, servi sans
  préfixe (`/`, `/projects/`…), et l'anglais, servi sous `/en` (`/en/`, `/en/projects/`…).
- **FR-002**: Une page anglaise MUST avoir le même chemin que son équivalent français, précédé
  de `/en`. Les chemins MUST rester en anglais dans les deux langues (`CONTENU.md` §5) : aucune
  table de correspondance d'adresses.
- **FR-003**: Chaque page MUST déclarer sa langue (français ou anglais) au niveau du document,
  et cette déclaration MUST correspondre à la langue du contenu.
- **FR-004**: Le blog MUST n'exister qu'en français : aucune page n'est générée sous `/en/blog`.

**Dictionnaire de libellés**

- **FR-005**: Tous les libellés d'interface (lien d'évitement, nom de la navigation pour les
  technologies d'assistance, libellés des rubriques, liens du pied de page, sélecteur de
  langue, mention (FR)) MUST venir d'un dictionnaire unique qui donne pour chaque clé sa valeur
  en français et en anglais. Un libellé d'interface MUST NOT être écrit en dur dans un
  composant.
- **FR-006**: Les deux langues du dictionnaire MUST avoir exactement les mêmes clés. Une clé
  absente dans une langue, ou une clé demandée par un composant et absente du dictionnaire,
  MUST faire échouer la vérification du projet.
- **FR-007**: Tous les libellés posés en F02 (navigation, pied de page, lien d'évitement, nom
  de la navigation) MUST être convertis au dictionnaire ; leur rendu français MUST rester
  identique à celui de F02.

**Sélecteur de langue**

- **FR-008**: L'en-tête de chaque page MUST contenir un lien vers l'autre langue. Sa cible MUST
  être la même page dans l'autre langue si elle est générée, sinon l'accueil de l'autre langue
  (`/` ou `/en/`). La cible est déterminée au build, d'après les pages réellement générées.
- **FR-009**: Le sélecteur MUST être un simple lien, fonctionnel sans JavaScript. Son libellé
  MUST être écrit dans la langue qu'il propose et déclarer cette langue, ainsi que celle de sa
  destination, aux technologies d'assistance.
- **FR-010**: Le sélecteur MUST respecter `DESIGN.md` et les jetons du site, et rester
  utilisable au clavier, sur mobile à 320 px et à 200 % de zoom.

**Navigation et gabarit dans chaque langue**

- **FR-011**: La navigation, le nom dans l'en-tête et le pied de page MUST être rendus dans la
  langue de la page, et leurs liens internes MUST pointer vers les pages de cette langue.
- **FR-012**: La rubrique courante MUST être reconnue dans les deux langues, selon les mêmes
  règles qu'en F02 (page elle-même ou page placée sous son chemin).
- **FR-013**: Dans la navigation anglaise, l'entrée Blog MUST pointer vers `/blog/` et afficher
  la mention (FR), annoncée aussi aux technologies d'assistance comme une destination en
  français. La navigation française MUST l'afficher sans mention.
- **FR-014**: Une page présente dans les deux langues MUST avoir une structure écrite une seule
  fois ; seuls ses textes existent par langue (constitution, principe IV).

**Pages provisoires**

- **FR-015**: Une page d'accueil anglaise provisoire MUST exister à `/en/`, avec la même
  structure que l'accueil français provisoire et un texte anglais réécrit selon `CONTENU.md`
  §9. Elle sera remplacée par le vrai accueil en F05.

### Key Entities

- **Langue** : français (par défaut, sans préfixe) ou anglais (préfixe `/en`). Détermine la
  langue déclarée, les libellés et la cible des liens internes.
- **Dictionnaire** : ensemble de clés d'interface ; chaque clé a une valeur française et une
  valeur anglaise, toujours les deux.
- **Rubrique** (héritée de F02) : chemin unique, libellé tiré du dictionnaire ; indique si elle
  existe dans les deux langues (le Blog : français seulement).
- **Page** : un chemin et une langue ; peut exister dans une langue ou dans les deux.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: 100 % des pages générées déclarent une langue, et elle correspond à leur préfixe
  (`/en` → anglais, sinon français).
- **SC-002**: Sur `/en/`, 0 libellé d'interface en français, hors deux exceptions voulues :
  la mention du blog (« Blog (FR) ») et le sélecteur, qui nomme le français en français
  (`FR`, « Français »).
- **SC-003**: Depuis chaque page générée, le sélecteur mène en 1 clic à une page qui existe :
  0 lien de sélecteur vers une page introuvable.
- **SC-004**: Retirer une valeur dans une langue du dictionnaire fait échouer la vérification
  du projet dans 100 % des cas.
- **SC-005**: Ajouter un libellé d'interface demande la modification d'1 seul fichier.
- **SC-006**: 0 lien du site vers `/en/blog`.
- **SC-007**: L'accueil français est identique visuellement et textuellement à celui de F02,
  hors l'en-tête qui accueille le sélecteur de langue.
- **SC-008**: Les deux accueils provisoires envoient 0 ko de JavaScript au navigateur et pèsent
  chacun moins de 200 ko transférés.
- **SC-009**: Un audit d'accessibilité automatisé de `/` et de `/en/` ne relève aucune erreur,
  dans les deux thèmes.

## Assumptions

- Pas de redirection automatique selon la langue du navigateur : le site est statique et sans
  JavaScript par défaut (constitution, principe II) ; le visiteur choisit avec le sélecteur.
  Une détection éventuelle irait dans la réserve de `ROADMAP.md`.
- Le sélecteur affiche le nom de l'autre langue dans cette langue (« English » sur une page
  française, « Français » sur une page anglaise) ; le libellé exact et sa forme visuelle sont
  fixés au plan, selon `DESIGN.md`.
- Les liens alternatifs entre langues pour les moteurs (`hreflang`), les URL canoniques et le
  plan du site bilingue relèvent de F04 ; la page 404 bilingue aussi.
- Le texte de l'accueil provisoire (pitch) reste dans la page, comme en F02 ; il passera dans
  les leviers de campagne en F05 (constitution, principe V). Il n'est pas un libellé
  d'interface et n'entre donc pas dans le dictionnaire.
- Le format du titre d'onglet (« Titre · Ramazan Kus ») est le même dans les deux langues.
- Une valeur vide dans le dictionnaire n'est pas détectée automatiquement ; elle relève de la
  relecture. Seule l'absence de clé fait échouer la vérification.
- « Projet sans traduction retombe sur la version française » (`CONTENU.md` §5) concerne le
  contenu des projets et relève de F06 ; ici, le repli ne concerne que la cible du sélecteur.
- Liens de rubriques morts tolérés sous `/en` comme sous `/` jusqu'à la livraison de chaque
  rubrique (même choix qu'en F02, 2026-11-08).
- Dépendances : F02 fusionnée (gabarit, navigation, pied de page, jetons).

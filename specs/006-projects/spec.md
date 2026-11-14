# Feature Specification: Projets

**Feature Branch**: `006-projects`

**Created**: 2026-11-12

**Status**: Draft

**Input**: User description: "Les projets sont du contenu typé (CONTENU.md §6), affichés en liste et en pages de détail, en FR et EN.
User stories :

- P1 — /projects affiche les projets publiés en liste, dans le format de la liste des coups de DESIGN.md, sans cartes ni diagramme (titre, année, résumé, technologies, symbole d'évaluation), du plus récent au plus ancien.
- P1 — Chaque projet a sa page : récit (contexte, problème, ce que j'ai fait, stack et pourquoi, résultat, appris) et liens (code, démo, vidéo) quand ils existent.
- P2 — Un projet en brouillon est absent en production (CONTENU.md §7).
- P2 — Les projets marqués « mis en avant » (3 au plus, sinon le build échoue) apparaissent sur l'accueil. Le choix se fait dans la donnée.
- P2 — La version anglaise d'un projet ne contient que la prose ; dates, technologies, liens et visuel viennent de la version française. Si elle manque, /en/projects/<slug> affiche la version française avec la mention « disponible en français uniquement ».
  Exigences : une fiche incomplète ou invalide fait échouer le build ; les visuels sont optimisés, sans décalage de mise en page ; l'accueil reste < 200 ko. Fournir deux fiches d'exemple (dont un brouillon) ; le vrai contenu est rédigé hors speckit (C2, C3)."

## Clarifications

### Session 2026-11-12

- Q: D'où vient le « coup clé » que `DESIGN.md` affiche sous le titre d'un projet, absent de
  `CONTENU.md` §6 ? → A: un nouveau champ, une phrase courte par langue, distincte du résumé :
  le choix décisif du projet. Obligatoire sur chaque fiche, française et anglaise.
  `CONTENU.md` §6 est mis à jour.
- Q: Quel sens définitif pour les symboles d'évaluation ? → A: celui de `DESIGN.md` : `!` coup
  clé (renommé « bon coup », voir plus bas), `!?` pari réfléchi, `!!` coup brillant. Chaque projet porte exactement un symbole,
  obligatoire. Au plus un `!!` parmi les projets mis en avant, sinon le build échoue.
- Q: Le build doit-il vérifier que le récit contient ses six parties, dans l'ordre ? → A: non.
  Le récit est du Markdown libre : le mainteneur écrit ses six intertitres, le build ne refuse
  qu'un récit vide. Le symbole d'évaluation a une place fixe, en tête du récit, à côté du coup
  clé.
- Q: De quelle couleur s'affiche le `!!` tant que F11 n'est pas livrée ? → A: en bleu dès F06.
  Les jetons bleus de `DESIGN.md` (clair et sombre, normal et sur ligne inversée) sont ajoutés
  en F06 ; F11 ne livre plus que les mouvements. `DESIGN.md` et `ROADMAP.md` sont alignés.
- Q: Où s'affiche le visuel d'un projet sur sa page ? → A: à une place fixe, après l'en-tête
  de métadonnées et le coup clé, avant le récit, à la largeur de la colonne de lecture.
- Q: La page de repli `/en/projects/<slug>` (texte français) est-elle proposée aux moteurs de
  recherche ? → A: non. Elle est non indexable, absente du plan du site, et désigne la page
  française comme référence. La page française n'annonce pas de version anglaise tant que la
  fiche anglaise n'existe pas.
- Q: Dans quel ordre s'affichent les projets mis en avant sur l'accueil ? → A: dans l'ordre de
  la liste des projets : du plus récent au plus ancien, puis par titre à année égale. Aucun
  champ de rang.
- Q: « Coup clé » désigne à la fois le sens de `!` et la phrase de chaque projet : lequel
  renommer ? → A: le sens de `!` devient « bon coup » (« good move »). « Coup clé » ne désigne
  plus que la phrase du projet. `!?` et `!!` gardent leur sens.
- Q: Un brouillon doit-il déjà être une fiche complète ? → A: oui pour les champs : une fiche
  en brouillon passe la même validation qu'une fiche publiée. Seul son récit peut être vide.

### Session 2026-11-12 (après la critique de la page projet)

- Q: Le récit de la page projet se lit comme six blocs identiques ; comment lui donner du
  rythme sans changer la règle des six parties ? → A: chaque partie s'ouvre par un filet doux
  et un intertitre en chasse étroite, et la fiche peut isoler une phrase comme note du
  commentateur (une citation Markdown `> …`). Une note qui commence par `!`, `!?` ou `!!` porte
  ce symbole dans la marge. Pas de nouveau champ.
- Q: Comment finit la page ? → A: par les liens du projet, la partie suivante (le projet plus
  ancien, le dernier renvoyant au premier) et le lien vers tous les projets. Le lien « Code »
  devient « Code source ».
- Q: Rôle et taille d'équipe dans l'en-tête ? → A: non : les projets sont presque tous
  personnels.
- Q: Sur grand écran, la page reste dans la moitié gauche ; comment occuper la largeur ? → A:
  au-dessus de 64rem, l'en-tête de partie (année, technologies, liens) passe dans une colonne
  de droite collante, comme le diagramme de l'accueil ; le récit garde sa mesure à gauche.

## User Scenarios & Testing _(mandatory)_

Acteurs : le **recruteur** (international anglophone d'abord, puis francophone), le **lead
technique** et le **mainteneur** (seul auteur du site, `CONTENU.md` §2).

### User Story 1 - Parcourir la liste des projets (Priority: P1)

Un recruteur ou un lead technique ouvre `/projects` (ou `/en/projects`). Il voit tous les
projets publiés, du plus récent au plus ancien, dans le format de la liste des coups de
`DESIGN.md` : des lignes entre filets, sans cartes ni diagramme. Chaque ligne donne l'année,
le titre, le résumé, les technologies et le symbole d'évaluation. Toute la ligne mène à la
page du projet. Une légende explique les symboles utilisés.

**Why this priority**: c'est l'entrée vers les preuves (`CONTENU.md` §4). Le lien « Projets »
de la navigation mène aujourd'hui à une page introuvable.

**Independent Test**: avec au moins deux fiches publiées d'années différentes, ouvrir
`/projects` puis `/en/projects` à 375 px et à 1280 px ; les lignes sont dans l'ordre attendu,
chaque ligne affiche ses cinq informations et mène à la bonne page.

**Acceptance Scenarios**:

1. **Given** plusieurs projets publiés, **When** le visiteur ouvre `/projects`, **Then** il
   voit une ligne par projet, de l'année la plus récente à la plus ancienne, avec l'année, le
   titre, le résumé, les technologies et le symbole d'évaluation.
2. **Given** la liste, **When** le visiteur active une ligne (souris, toucher ou clavier),
   **Then** il arrive sur la page de ce projet, dans la langue de la liste.
3. **Given** `/en/projects`, **When** le visiteur l'ouvre, **Then** titres et résumés sont en
   anglais ; années, technologies et symboles sont les mêmes qu'en français.
4. **Given** la liste, **When** elle s'affiche, **Then** elle ne montre ni carte, ni visuel de
   projet, ni diagramme, et une légende donne le sens de chaque symbole présent dans la liste.
5. **Given** un lecteur d'écran, **When** il lit une ligne, **Then** le symbole d'évaluation
   est annoncé par son sens (« bon coup », « pari réfléchi », « coup brillant »), pas par sa
   ponctuation.
6. **Given** la page `/projects`, **When** un moteur la lit, **Then** elle a un titre et une
   description propres, et ses liens alternatifs relient les deux langues (F04).

---

### User Story 2 - Lire un projet (Priority: P1)

Le lead technique ouvre un projet. Il lit le titre, le résumé, le coup clé, puis les
métadonnées (année, technologies, liens). Il suit le récit dans l'ordre fixé par
`CONTENU.md` §6 : contexte, problème, ce que j'ai fait, stack et pourquoi, résultat, ce que
j'en ai appris. Il ouvre le code, la démo ou la vidéo quand ils existent. Un lien le ramène à
la liste.

**Why this priority**: le lead technique « ouvre _un_ projet, puis le GitHub »
(`CONTENU.md` §2). Sans page projet, aucune promesse du site n'est prouvée.

**Independent Test**: ouvrir la page de la fiche d'exemple publiée en français puis en
anglais ; récit, métadonnées et liens présents sont affichés, les liens absents ne laissent
aucune trace, le visuel ne décale pas la page.

**Acceptance Scenarios**:

1. **Given** un projet publié, **When** le visiteur ouvre `/projects/<slug>`, **Then** il voit
   le lien de retour vers la liste, le titre, le résumé, le coup clé, l'année, les
   technologies, le symbole d'évaluation et le récit, dans la composition « page projet » de
   `DESIGN.md`.
2. **Given** un projet avec un lien vers le code et sans démo ni vidéo, **When** sa page
   s'affiche, **Then** seul le lien vers le code apparaît, sans libellé vide ni emplacement
   réservé pour les deux autres.
3. **Given** un projet sans aucun lien (projet d'entreprise anonymisé), **When** sa page
   s'affiche, **Then** aucun bloc de liens n'apparaît.
4. **Given** un projet avec un visuel, **When** sa page se charge, **Then** le visuel
   s'affiche sans décaler le contenu, avec un texte alternatif dans la langue de la page.
5. **Given** un projet sans visuel, **When** sa page s'affiche, **Then** la page est complète,
   sans emplacement vide.
6. **Given** la version anglaise d'un projet, **When** le visiteur ouvre
   `/en/projects/<slug>`, **Then** titre, résumé, coup clé et récit sont en anglais ; année,
   technologies, liens et visuel sont ceux de la version française.
7. **Given** une page projet, **When** le visiteur utilise le sélecteur de langue, **Then** il
   arrive sur le même projet dans l'autre langue.
8. **Given** une page projet, **When** un moteur la lit, **Then** son titre est celui du
   projet et sa description son résumé, uniques dans la langue.

---

### User Story 3 - Publier un projet avec un seul fichier, sans erreur possible (Priority: P1)

Le mainteneur ajoute un projet : une fiche en français, et une image s'il y a un visuel. Il
ne modifie aucune page ni aucun composant. La liste, la page du projet et, s'il le marque,
l'accueil se mettent à jour au build. S'il oublie un champ ou écrit une valeur invalide, le
build échoue et nomme la fiche et le champ.

**Why this priority**: priorités n°1 et n°2 de conception (`CONTENU.md` §1 ; constitution,
principe III). Sans validation, une fiche bancale arrive en ligne.

**Independent Test**: ajouter une fiche valide et constater qu'elle apparaît sans autre
modification ; puis retirer un champ obligatoire, ou écrire une année invalide, et constater
que le build échoue avec un message qui désigne la fiche.

**Acceptance Scenarios**:

1. **Given** une nouvelle fiche française valide, **When** le site est construit, **Then** le
   projet apparaît dans la liste et a sa page, dans les deux langues, sans autre fichier
   modifié.
2. **Given** une fiche sans titre, année, résumé, coup clé, technologies ou symbole
   d'évaluation, **When** le site est construit, **Then** le build échoue et désigne la fiche
   et le champ.
3. **Given** une fiche avec une valeur invalide (année qui n'est pas une année, symbole hors
   de `!`, `!?`, `!!`, lien qui n'est pas une adresse web, visuel introuvable, visuel sans
   texte alternatif), **When** le site est construit, **Then** le build échoue.
4. **Given** une fiche anglaise sans fiche française du même nom, **When** le site est
   construit, **Then** le build échoue.
5. **Given** une fiche anglaise sans titre, résumé ou coup clé, **When** le site est
   construit, **Then** le build échoue.

---

### User Story 4 - Préparer un projet en brouillon (Priority: P2)

Le mainteneur rédige une fiche sur plusieurs séances. Tant qu'elle est marquée brouillon, il
la voit en local pour la relire, mais elle n'existe nulle part sur le site en ligne.

**Why this priority**: permet de versionner une fiche en cours (une fiche par séance, C2)
sans la publier (`CONTENU.md` §7).

**Independent Test**: construire le site de production avec la fiche d'exemple en brouillon ;
chercher son titre et son adresse dans le résultat : aucune occurrence.

**Acceptance Scenarios**:

1. **Given** un projet en brouillon, **When** le site de production est construit, **Then**
   il n'a pas de page, dans aucune langue, et n'apparaît ni dans la liste, ni sur l'accueil,
   ni dans le plan du site.
2. **Given** un projet en brouillon, **When** le mainteneur travaille en local, **Then** il
   le voit dans la liste et peut ouvrir sa page, avec une marque « brouillon » visible.
3. **Given** un brouillon dont le mainteneur retire la marque, **When** le site est
   construit, **Then** le projet est publié, sans autre modification.

---

### User Story 5 - Choisir les projets de l'accueil dans la donnée (Priority: P2)

Le mainteneur marque jusqu'à trois projets « mis en avant ». Ils apparaissent sur l'accueil,
dans l'emplacement posé en F05, sous la forme de la liste des coups de `DESIGN.md` : année et
notation du coup, titre et coup clé, symbole d'évaluation, avec la légende. Le recruteur voit
ainsi trois preuves sans quitter l'accueil. Changer la sélection, c'est changer la marque
dans les fiches.

**Why this priority**: c'est le levier de campagne n°3 (`CONTENU.md` §7 ; constitution,
principe V). L'accueil fonctionne déjà sans lui.

**Independent Test**: marquer la fiche d'exemple publiée ; elle apparaît sur `/` et `/en/` ;
marquer quatre fiches publiées : le build échoue ; ne marquer aucune fiche : l'accueil ne
montre ni titre de liste ni légende.

**Acceptance Scenarios**:

1. **Given** un à trois projets publiés mis en avant, **When** l'accueil s'affiche, **Then**
   chacun a sa ligne (année, notation, titre, coup clé, symbole), du plus récent au plus
   ancien, sous un titre de liste, avec la légende des symboles ; chaque ligne mène à la page
   du projet.
2. **Given** plus de trois projets publiés mis en avant, **When** le site est construit,
   **Then** le build échoue avec un message qui les nomme.
3. **Given** plus d'un projet `!!` parmi les projets mis en avant, **When** le site est
   construit, **Then** le build échoue.
4. **Given** un projet mis en avant sans son coup (case de départ, case d'arrivée, notation),
   **When** le site est construit, **Then** le build échoue.
5. **Given** aucun projet mis en avant, **When** l'accueil s'affiche, **Then** ni titre de
   liste, ni légende, ni bloc vide n'apparaît (comportement de F05 conservé).
6. **Given** l'accueil avec trois projets mis en avant, **When** il est chargé, **Then** il
   pèse moins de 200 ko transférés.

---

### User Story 6 - Un projet pas encore réécrit en anglais reste lisible (Priority: P2)

Le mainteneur publie un projet en français avant d'avoir réécrit sa version anglaise. Le
recruteur anglophone le trouve quand même : la liste et l'accueil anglais l'affichent avec la
mention « French only », et `/en/projects/<slug>` montre la version française, avec
l'interface en anglais et la mention « disponible en français uniquement ».

**Why this priority**: l'anglais est réécrit, pas traduit (`CONTENU.md` §9) : il arrive après
le français. Le miroir anglais ne doit pas avoir de trou (`CONTENU.md` §5 et §10).

**Independent Test**: publier une fiche française sans fiche anglaise ; ouvrir `/en/projects`
puis `/en/projects/<slug>` : la ligne et la page existent, portent la mention, et le récit
est en français.

**Acceptance Scenarios**:

1. **Given** un projet publié sans version anglaise, **When** le visiteur ouvre
   `/en/projects/<slug>`, **Then** il lit titre, résumé, coup clé et récit en français, sous
   une mention visible en anglais qui dit que ce projet n'existe qu'en français ; navigation,
   libellés et pied de page restent en anglais.
2. **Given** ce projet, **When** `/en/projects` ou l'accueil anglais l'affichent, **Then** sa
   ligne montre le titre et le texte français, avec une mention « French only ».
3. **Given** cette page de repli, **When** un lecteur d'écran la lit, **Then** le texte
   français est déclaré comme français.
4. **Given** cette page de repli, **When** un moteur la lit, **Then** elle n'est pas
   indexable, n'est pas dans le plan du site, et désigne la page française comme référence.
5. **Given** la page française de ce projet, **When** le visiteur utilise le sélecteur de
   langue, **Then** il arrive sur `/en/projects/<slug>` (la page de repli), pas sur l'accueil.
6. **Given** la fiche anglaise ajoutée plus tard, **When** le site est construit, **Then** la
   mention disparaît partout et la page devient indexable, sans autre modification.

---

### Edge Cases

- **Aucun projet publié** : `/projects` s'affiche avec une phrase qui le dit, sans liste ni
  légende vides ; l'accueil ne montre pas d'emplacement.
- **Deux projets de la même année** : ordre alphabétique du titre, pour un résultat stable.
- **Brouillon mis en avant** : il ne compte pas dans la limite de trois et n'apparaît pas sur
  l'accueil en production.
- **Brouillon incomplet** : un champ obligatoire manquant ou invalide fait échouer le build,
  comme pour une fiche publiée ; seul le récit d'un brouillon peut rester vide.
- **Titre de la page de repli** : le titre et la description de `/en/projects/<slug>` sont en
  français dans une page déclarée anglaise ; limite acceptée, la page est non indexable.
- **Fiche anglaise d'un brouillon** : absente en production, comme la fiche française.
- **Projet non mis en avant avec un coup** : accepté ; le coup n'est affiché nulle part.
- **Projet `!!` non mis en avant** : accepté ; la limite d'un seul `!!` porte sur l'accueil.
- **Titre, résumé ou liste de technologies longs** : ils passent à la ligne sans déborder,
  de 320 px à 1280 px et plus.
- **Technologies** : affichées dans l'ordre de la fiche ; au moins une ; ce sont des textes,
  pas des liens (pas de page par technologie, voir réserve de `ROADMAP.md`).
- **Liens externes** : ils sont annoncés par leur destination (« Code », « Démo », « Vidéo »),
  pas par une adresse brute.
- **Récit incomplet ou dans un autre ordre** : accepté ; les six parties et leur ordre sont
  une règle de rédaction (C2). Le build refuse seulement un récit vide.
- **Projet retiré** : fichier supprimé et redirection vers la liste (constitution,
  principe IX) ; hors périmètre de la feature, mais la liste doit exister pour la recevoir.
- **Adresse inconnue** (`/projects/inconnu`) : page 404 existante (F04).
- **Texte provisoire** : les fiches d'exemple portent « [provisoire] » / « [draft] » (règle de
  F05), pour être retrouvées et remplacées en C2.

## Requirements _(mandatory)_

### Functional Requirements

**Fiche projet (donnée)**

- **FR-001**: Chaque projet MUST être une fiche de contenu validée au build. Ajouter un projet
  MUST se faire avec une fiche française (et une image s'il y a un visuel), sans modifier de
  page ni de composant (constitution, principe III).
- **FR-002**: La fiche française MUST porter : titre, année, résumé, coup clé, technologies
  (au moins une), symbole d'évaluation, et le récit. Elle MAY porter : liens (code, démo,
  vidéo, chacun facultatif), visuel avec son texte alternatif, marque « mis en avant », marque
  « brouillon », coup (case de départ, case d'arrivée, notation).
- **FR-003**: La fiche anglaise MUST ne contenir que la prose : titre, résumé, coup clé, récit
  et, si le projet a un visuel, son texte alternatif. Année, technologies, liens, visuel,
  symbole, coup, « mis en avant » et « brouillon » MUST n'exister que dans la fiche française
  (constitution, principe IV).
- **FR-004**: Le coup clé MUST être une phrase courte par langue, distincte du résumé, qui dit
  le choix décisif du projet. `CONTENU.md` §6 MUST être mis à jour avec ce champ, le symbole
  d'évaluation et le coup.
- **FR-005**: Le symbole d'évaluation MUST être l'un de `!` (bon coup), `!?` (pari réfléchi)
  ou `!!` (coup brillant) ; exactement un par projet. La légende de `DESIGN.md` devient
  définitive avec ces trois sens. Partout où il apparaît (liste, accueil, légende, page
  projet), chaque symbole MUST s'afficher dans sa couleur, comme sur les sites d'échecs : `!`
  en bleu foncé (chess.com), `!!` en bleu ciel, `!?` en rose-violet (Lichess, chess.com n'en
  ayant pas), en clair et en sombre, y compris sur une ligne inversée (`DESIGN.md`, Accent).
  Le rouge, qui évoque un mauvais coup, ne note aucun projet. Les jetons sont ajoutés par
  F06.
- **FR-006**: Le build MUST échouer, en désignant la fiche en cause, quand : un champ
  obligatoire manque ; une valeur est invalide (année, symbole, lien, case) ; un visuel est
  introuvable ou sans texte alternatif dans une langue publiée ; le récit d'une fiche publiée
  est vide ; une fiche
  anglaise n'a pas de fiche française du même nom.
- **FR-007**: Un projet mis en avant MUST porter son coup (case de départ, case d'arrivée,
  notation) ; sinon le build échoue. La légalité du coup dans la position du diagramme n'est
  pas vérifiée ici (C2b).

**Liste des projets**

- **FR-008**: `/projects` et `/en/projects` MUST lister tous les projets publiés, de l'année
  la plus récente à la plus ancienne (à année égale, par titre).
- **FR-009**: Chaque ligne MUST afficher l'année, le titre, le résumé, les technologies et le
  symbole d'évaluation, et être en entier un lien vers la page du projet. Le format est celui
  de la liste des coups de `DESIGN.md` (lignes entre filets, inversion au survol et au focus),
  sans carte, sans visuel et sans diagramme.
- **FR-010**: Une légende MUST expliquer les symboles présents dans la liste. Chaque symbole
  MUST avoir un équivalent textuel pour les lecteurs d'écran.
- **FR-011**: Sans projet publié, la page MUST afficher un message, sans liste ni légende.

**Page projet**

- **FR-012**: Chaque projet publié MUST avoir une page à `/projects/<slug>` et
  `/en/projects/<slug>`, où `<slug>` est le nom de la fiche.
- **FR-013**: La page MUST afficher, selon la composition « page projet » de `DESIGN.md` : un
  lien de retour vers la liste, le titre, le résumé, les métadonnées (année, technologies,
  liens), le coup clé isolé avec le symbole d'évaluation dans la marge à son niveau, puis le
  récit. La place du symbole est fixe : elle ne dépend pas des intertitres du récit. Le
  visuel, s'il existe, se place entre le coup clé et le récit, à la largeur de la colonne de
  lecture.
- **FR-014**: Seuls les liens présents dans la fiche MUST apparaître ; sans aucun lien, aucun
  bloc de liens. Chaque lien porte un libellé qui nomme sa destination.
- **FR-015**: Le visuel, s'il existe, MUST être servi optimisé (formats modernes, taille
  adaptée à l'écran), avec ses dimensions réservées pour qu'il ne décale pas la page, et un
  texte alternatif dans la langue de la page. Il n'apparaît que sur la page projet.
- **FR-016**: Le titre de la page MUST être celui du projet et sa description son résumé ;
  liens alternatifs et adresse de référence suivent F04.
- **FR-017**: Le sélecteur de langue MUST mener, depuis une page projet, au même projet dans
  l'autre langue, que sa version anglaise existe ou non.

**Brouillons**

- **FR-018**: Un projet en brouillon MUST être absent du site de production : pas de page,
  pas de ligne dans la liste ni sur l'accueil, pas d'entrée dans le plan du site, dans aucune
  langue.
- **FR-019**: En local, un brouillon MUST être visible (liste et page), avec une marque
  « brouillon ».

**Projets mis en avant (accueil)**

- **FR-020**: L'accueil, dans les deux langues, MUST afficher les projets publiés mis en
  avant dans l'emplacement posé en F05, sous la forme de la liste des coups de `DESIGN.md` :
  année et notation, titre et coup clé, symbole d'évaluation, légende, chaque ligne menant à
  la page du projet. L'ordre est celui de la liste des projets.
- **FR-021**: Le build MUST échouer si plus de trois projets publiés sont mis en avant, ou si
  plus d'un projet mis en avant porte `!!`.
- **FR-022**: La sélection MUST se faire uniquement par la marque « mis en avant » de chaque
  fiche ; aucune liste de projets n'existe ailleurs (constitution, principe V).
- **FR-023**: Sans projet mis en avant, l'accueil MUST ne montrer ni titre de liste, ni
  légende, ni bloc vide.
- **FR-024**: Le diagramme de l'accueil reste immobile : les coups au survol et le coup
  signature arrivent en F11. L'accueil MUST rester sous 200 ko transférés et n'afficher aucun
  visuel de projet.

**Repli français**

- **FR-025**: Pour un projet publié sans fiche anglaise, `/en/projects/<slug>` MUST afficher
  la prose française (titre, résumé, coup clé, récit) avec une mention visible, en anglais,
  qui dit que le projet n'est disponible qu'en français ; l'interface reste en anglais.
- **FR-026**: Dans la liste et sur l'accueil anglais, ce projet MUST apparaître avec son
  texte français et une mention « French only ».
- **FR-027**: Sur ces pages, le texte français MUST être déclaré comme français. La page de
  repli MUST être non indexable, absente du plan du site, et désigner la page française comme
  référence. Tant que la fiche anglaise n'existe pas, la page française MUST ne pas annoncer
  de version anglaise aux moteurs (pas de lien alternatif vers la page de repli) ; le
  sélecteur de langue, lui, y mène (FR-017).

**Textes et exemples**

- **FR-028**: Tous les libellés d'interface ajoutés (titres de liste, légende, libellés des
  métadonnées et des liens, mentions de repli et de brouillon, message de liste vide, lien de
  retour) MUST passer par le dictionnaire FR/EN (constitution, principe VI).
- **FR-029a**: Dans le récit, une citation Markdown MUST s'afficher comme une note du
  commentateur, isolée entre deux filets fins. Si elle commence par `!`, `!?` ou `!!`, ce
  symbole MUST se placer dans la marge (à droite de la note sous 40rem), avec son sens pour
  les lecteurs d'écran. Chaque intertitre du récit s'ouvre par un filet doux. Une image seule
  dans son paragraphe, avec un titre, MUST s'afficher comme une figure légendée, optimisée et
  sans décalage de mise en page ; une à trois par fiche, le visuel restant unique.
- **FR-029b**: La page projet MUST finir par les liens présents du projet, la partie suivante
  (une ligne de la liste des coups, sans légende) quand au moins deux projets sont publiés, et
  le lien vers tous les projets.
- **FR-029**: La feature MUST fournir deux fiches d'exemple : une publiée, mise en avant, avec
  sa version anglaise, un visuel et le symbole `!!` (pour vérifier le bleu) ; une en
  brouillon, sans version anglaise. Leurs textes
  sont provisoires et portent la marque « [provisoire] » / « [draft] » ; ils respectent
  `CONTENU.md` §9. Le vrai contenu est rédigé hors speckit (C2, C3).

### Key Entities

- **Projet** : une preuve publiée. Données uniques : nom (slug), année, technologies, liens
  (code, démo, vidéo), visuel, symbole d'évaluation, coup, « mis en avant », « brouillon ».
  Prose par langue : titre, résumé, coup clé, récit, texte alternatif du visuel.
- **Version anglaise** : la prose anglaise d'un projet, rattachée par le même nom ;
  facultative.
- **Symbole d'évaluation** : `!` bon coup, `!?` pari réfléchi, `!!` coup brillant ; un par
  projet.
- **Coup** : case de départ, case d'arrivée et notation (une par langue, les lettres des
  pièces diffèrent) d'un coup des blancs sur le diagramme de l'accueil ; obligatoire pour un
  projet mis en avant.
- **Récit** : le texte long du projet, en six parties dans l'ordre de `CONTENU.md` §6.
- **Sélection de l'accueil** : les projets publiés marqués « mis en avant », trois au plus.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Ajouter un projet demande 1 fiche (plus 1 image s'il a un visuel) et 0 ligne de
  code ; il apparaît alors dans la liste et a sa page dans les deux langues.
- **SC-002**: 100 % des fiches incomplètes ou invalides testées (champ manquant, valeur
  invalide, fiche anglaise orpheline, quatre projets mis en avant, deux `!!` mis en avant,
  projet mis en avant sans coup) font échouer le build, avec un message qui désigne la fiche.
- **SC-003**: Dans le site de production, un projet en brouillon a 0 page et 0 mention
  (liste, accueil, plan du site), dans les deux langues.
- **SC-004**: Changer la sélection de l'accueil modifie uniquement des fiches projet, 0 page
  et 0 composant.
- **SC-005**: Depuis l'accueil, un visiteur atteint la page d'un projet mis en avant en 1
  action, et celle de tout autre projet publié en 2 actions.
- **SC-006**: 100 % des projets publiés ont une page sous `/en/projects/` ; celles sans
  version anglaise portent la mention de repli et sont absentes du plan du site.
- **SC-007**: L'accueil avec trois projets mis en avant pèse moins de 200 ko transférés ; les
  pages de la feature envoient 0 ko de JavaScript au navigateur.
- **SC-008**: Un visuel de projet ne provoque aucun décalage de mise en page mesurable.
- **SC-009**: La liste, une page projet et l'accueil obtiennent au moins 95 en performance et
  100 en accessibilité, bonnes pratiques et SEO à l'audit mobile de référence, dans les deux
  langues et les deux thèmes (constitution, principe VII).
- **SC-010**: La liste, une page projet (avec et sans version anglaise) et l'accueil sont
  lisibles et sans débordement à 375 px et à 1280 px, en clair et en sombre.
- **SC-011**: Chaque page indexable de la feature a un titre et une description uniques dans
  sa langue.

## Assumptions

- **Slug** : le nom du fichier de la fiche, en anglais, identique entre les deux langues.
- **Brouillon** : une seule marque, dans la fiche française, vaut pour les deux langues. La
  limite de trois projets mis en avant compte les projets publiés.
- **Visuel** : facultatif, car un projet d'entreprise n'a pas de capture (`CONTENU.md` §8).
  Son texte alternatif est de la prose : il existe par langue.
- **Notation sur l'accueil** : chaque projet mis en avant écrit sa notation complète dans sa
  fiche française, en français et en anglais ; la cohérence avec la position du diagramme (même numéro de coup, coups jouables)
  est réglée en C2b, pas vérifiée par le build.
- **Couleur du `!!`** : bleue dès F06 (voir Clarifications). `DESIGN.md` (« jetons à ajouter
  en F11 ») et le bloc F11 de `ROADMAP.md` sont alignés au plan.
- **Mouvements** : coups au survol, coup signature, transition du titre et pose du symbole
  sont hors périmètre (F11). F06 livre l'état final immobile.
- **Symbole dans la marge de la page projet** : il note le coup clé, pas un intertitre ;
  `DESIGN.md` (« au niveau de l'intertitre qu'il note ») est aligné au plan.
- **Pas de lien « tous les projets » sur l'accueil** : la navigation le fournit déjà.
- **Pas de filtre, de tri au choix, de pagination ni de page par technologie** : 10 projets
  au plus au lancement (`CONTENU.md` §8) ; ces idées sont dans la réserve de `ROADMAP.md`.
- **Compétences** : le lien compétence → projets arrive en F08.
- **Fiches d'exemple en ligne** : acceptable, le site est non indexable jusqu'à C3 (F04).
- Dépendances : F05 fusionnée (emplacement de l'accueil, diagramme, marque provisoire) ; F04
  (titre, description, non-indexation par page, plan du site) ; F03 (dictionnaire, sélecteur
  de langue).

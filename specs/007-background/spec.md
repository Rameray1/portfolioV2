# Feature Specification: Parcours

**Feature Branch**: `007-background`

**Created**: 2026-11-16

**Status**: Implemented

**Input**: User description: "/background (et /en/background) présente formations et expériences sur une seule frise chronologique, du plus récent au plus ancien, lisible sur mobile.

- Chaque entrée : période, intitulé, lieu, description. Une expérience ajoute technologies et réalisations.
- Une entrée en cours affiche « aujourd'hui » / « present ». Aucune date ni durée écrite en dur dans la prose.
- Les données vivent dans deux fichiers (expériences, formations) de même forme, réutilisés par le CV (F09). La prose y existe en FR et EN.
- Quelques entrées d'exemple suffisent ; les textes définitifs sont rédigés hors speckit (C4)."

## Clarifications

### Session 2026-11-16

- Q: Sous quelle forme la page doit-elle écrire le mois d'une période ? → A: Mois abrégé et
  année (« sept. 2024 – aujourd'hui » / « Sep 2024 – present »).
- Q: Sur grand écran, la frise garde-t-elle la ligne d'en-têtes de colonnes de `DESIGN.md` ?
  → A: Oui, visible sur grand écran seulement et purement visuelle ; la frise reste une
  liste ordonnée, et description, technologies et réalisations se placent sous l'intitulé.
- Q: Le libellé de type d'une expérience précise-t-il sa nature (alternance, stage, emploi) ?
  → A: Non. Deux types seulement, « Formation » et « Expérience » ; la nature du contrat
  s'écrit dans l'intitulé.

### Session 2026-11-16 (analyse et revue de l'implémentation)

- Q: Un des deux fichiers peut-il être vide ? → A: Non. Chaque fichier porte au moins une
  entrée ; un fichier vide, absent ou illisible fait échouer le build.
- Q: La page est-elle trop simple visuellement ? → A: Oui. Chaque entrée s'ouvre sur son
  année en chiffres d'affichage ; un fil relie les étapes sur grand écran, et chaque étape y
  porte une pièce d'échecs (un pion pour une formation, un cavalier pour une expérience) ;
  le lieu passe en gras ; les technologies sont en puces.
- Q: Comment signaler une étape en cours ? → A: Par un petit carré rouge devant
  « aujourd'hui » / « present », qui passe en gras. L'année reste à l'encre : une année de
  début en rouge mettait en avant une date passée.
- Q: Quel effet au survol, sachant que les lignes ne sont pas des liens ? → A: L'étape
  survolée reste à l'encre, sa pièce avance d'un pas et les autres étapes passent en encre
  atténuée. Pas d'inversion, réservée aux lignes cliquables du site.
- Q: Quelles pièces, et de quelle couleur ? → A: Les pièces d'origine du jeu du diagramme,
  sans retouche : noires sur papier clair, blanches en thème sombre.
- Q: Une entrée renvoie-t-elle vers le projet qui la prouve ? → A: Pas maintenant. La page
  reste légère ; l'idée va dans la réserve de `ROADMAP.md`.
- Q: Les réalisations d'une expérience reprennent-elles ses projets ? → A: Non. La
  description dit la mission principale, les réalisations le reste du rôle. Un projet déjà
  publié dans `/projects` n'est pas raconté une seconde fois ici.
- Q: Les entrées livrées sont-elles des exemples fictifs ? → A: Non. Elles reprennent le CV
  du mainteneur, sans mention « provisoire ». Les mois des deux formations, que le CV ne
  donne pas, sont confirmés par le mainteneur.

## User Scenarios & Testing _(mandatory)_

Acteurs : le **recruteur** (international anglophone d'abord, puis francophone), le **lead
technique** et le **mainteneur** (seul auteur du site, `CONTENU.md` §2).

### User Story 1 - Lire le parcours sur une seule frise (Priority: P1)

Un recruteur ouvre `/background` (ou `/en/background`). Il voit formations et expériences
mêlées sur une seule frise, de la plus récente à la plus ancienne, dans le format du tableau
du parcours de `DESIGN.md`. Chaque entrée donne sa période, son intitulé, son lieu et sa
description, et dit si c'est une formation ou une expérience. Une expérience ajoute ses
technologies et ses réalisations. Chaque entrée s'ouvre sur son année de début en grands
chiffres, et le lieu (l'école ou l'employeur) est mis en avant. En une lecture, il sait où
le mainteneur étudie, où il travaille et depuis quand.

**Why this priority**: le recruteur filtre en 60 secondes sur l'école, l'employeur et le
niveau (`CONTENU.md` §2). Le lien « Parcours » de la navigation mène aujourd'hui à une page
introuvable.

**Independent Test**: avec au moins deux expériences et deux formations, ouvrir
`/background` puis `/en/background` ; les entrées des deux types sont mêlées dans l'ordre
attendu, chacune affiche ses informations, et la prose est dans la langue de la page.

**Acceptance Scenarios**:

1. **Given** des expériences et des formations, **When** le visiteur ouvre `/background`,
   **Then** il voit une seule frise qui les mêle, de la date de début la plus récente à la
   plus ancienne.
2. **Given** une entrée, **When** elle s'affiche, **Then** elle montre sa période, son
   intitulé, son lieu et sa description, et son type (formation ou expérience) se lit sans
   dépendre de la couleur.
3. **Given** une expérience avec technologies et réalisations, **When** elle s'affiche,
   **Then** ses technologies et la liste de ses réalisations apparaissent sous la description.
4. **Given** une formation, ou une expérience sans technologie ni réalisation, **When** elle
   s'affiche, **Then** aucun libellé vide ni emplacement réservé n'apparaît.
5. **Given** `/en/background`, **When** le visiteur l'ouvre, **Then** intitulés, descriptions,
   réalisations et périodes sont en anglais ; l'ordre, les lieux et les technologies sont les
   mêmes qu'en français.
6. **Given** la page, **When** le visiteur utilise le sélecteur de langue, **Then** il arrive
   sur la même page dans l'autre langue.
7. **Given** la page, **When** un moteur la lit, **Then** elle a un titre et une description
   propres dans chaque langue, et ses liens alternatifs relient les deux langues (F04).
8. **Given** un lecteur d'écran, **When** il parcourt la frise, **Then** les entrées sont
   annoncées comme une liste ordonnée, et chaque entrée donne son type, sa période et son
   intitulé.
9. **Given** une entrée en cours, **When** elle s'affiche, **Then** sa période finit par
   « aujourd'hui » / « present » en gras, précédé d'un carré rouge : l'état est dit en texte
   et ne repose pas sur la couleur.
10. **Given** un écran à pointeur, **When** le visiteur survole une entrée, **Then** elle
    reste à l'encre, sa pièce avance d'un pas et les autres entrées passent en encre
    atténuée ; rien ne laisse croire que la ligne est un lien.

---

### User Story 2 - Des périodes toujours justes, sans date dans la prose (Priority: P1)

Chaque période vient des dates de l'entrée. Elle s'écrit dans la langue de la page, au mois
près. Une entrée sans date de fin est en cours : sa période se termine par « aujourd'hui » en
français et « present » en anglais. Le mainteneur n'écrit ni date ni durée dans les textes
(`CONTENU.md` §9, règle 5) : quand une entrée se termine, il ajoute sa date de fin et rien
d'autre.

**Why this priority**: une page de parcours avec une date fausse ou un « actuellement »
périmé dessert le candidat. C'est aussi ce qui rend la donnée réutilisable par le CV.

**Independent Test**: avec une entrée en cours et une entrée terminée, ouvrir la page dans
les deux langues ; les périodes sont écrites dans la langue de la page, l'entrée en cours
finit par « aujourd'hui » / « present ». Ajouter une date de fin à l'entrée en cours : seule
sa période change.

**Acceptance Scenarios**:

1. **Given** une entrée terminée, **When** elle s'affiche, **Then** sa période donne le mois
   abrégé et l'année de début et de fin, écrits dans la langue de la page (« sept. 2022 –
   août 2024 » / « Sep 2022 – Aug 2024 »).
2. **Given** une entrée sans date de fin, **When** elle s'affiche, **Then** sa période donne
   le mois et l'année de début, puis « aujourd'hui » en français et « present » en anglais.
3. **Given** une entrée qui commence et finit le même mois, **When** elle s'affiche, **Then**
   sa période ne donne ce mois qu'une fois.
4. **Given** une entrée en cours à laquelle le mainteneur ajoute une date de fin, **When** le
   site est construit, **Then** sa période affiche cette date dans les deux langues, sans
   autre modification.
5. **Given** les entrées livrées, **When** on lit leurs intitulés, descriptions et
   réalisations, **Then** aucun texte ne contient de date, d'année, de durée ni de mot comme
   « actuellement ».
6. **Given** une période, **When** une machine la lit (lecteur d'écran, moteur), **Then**
   ses dates sont exposées dans un format lisible par une machine.

---

### User Story 3 - Lire le parcours sur mobile (Priority: P1)

Le recruteur ouvre la page sur son téléphone. La frise s'empile comme le prévoit
`DESIGN.md` : à gauche l'année, puis la période sur deux lignes (le début, puis la fin) et
le type ; à droite l'intitulé, le lieu sous l'intitulé, puis la description, les
technologies et les réalisations. Rien ne dépasse de l'écran. La pièce de l'étape se pose
à côté de l'année ; le fil de la frise et l'effet de survol n'existent que sur grand écran.

**Why this priority**: « lisible sur mobile » est dans la demande, et la constitution
(principe VII) impose la vérification à 375 px.

**Independent Test**: ouvrir la page à 375 px et à 1280 px, en clair et en sombre ; aucune
barre de défilement horizontale, aucune période coupée ou superposée à un intitulé, en-tête
et pied de page compris.

**Acceptance Scenarios**:

1. **Given** un écran de 375 px, **When** la page s'affiche, **Then** elle ne défile pas
   horizontalement et chaque entrée reste lisible sans zoom.
2. **Given** un écran de 375 px, **When** une entrée a un intitulé long ou beaucoup de
   technologies, **Then** le texte passe à la ligne sans chevaucher la période.
3. **Given** un écran de 1280 px, **When** la page s'affiche, **Then** la frise suit le
   tableau du parcours de `DESIGN.md` (ligne d'en-têtes de colonnes, périodes alignées dans
   leur colonne, sans retour à la ligne, fil qui relie les étapes), le lieu a sa colonne, et
   la description, les technologies et les réalisations d'une entrée se placent sous son
   intitulé.
4. **Given** un écran de 375 px, **When** la page s'affiche, **Then** ni la ligne d'en-têtes
   de colonnes ni le fil n'apparaissent.
5. **Given** un téléphone de 375 px de large, **When** le visiteur arrive sur une entrée,
   **Then** il la lit en entier sans faire défiler l'écran.
6. **Given** le thème sombre, **When** la page s'affiche à 375 px et à 1280 px, **Then** les
   contrastes respectent les seuils de `DESIGN.md`.

---

### User Story 4 - Tenir le parcours à jour dans deux fichiers (Priority: P2)

Le mainteneur ajoute, modifie ou retire une entrée dans le fichier des expériences ou dans
celui des formations. Les deux fichiers ont la même forme. Il ne touche aucune page. S'il
oublie un champ, écrit une date invalide ou ne donne la prose que dans une langue, le build
échoue et désigne l'entrée. Ces deux fichiers sont la seule source du parcours : le CV (F09)
les lira tels quels.

**Why this priority**: « une information, un seul endroit » (`CONTENU.md` §7 ; critère
« CV ↔ site : une seule source », §10). La page fonctionne déjà avec les entrées livrées.

**Independent Test**: ajouter une entrée valide dans un des deux fichiers et constater
qu'elle apparaît au bon rang dans les deux langues ; puis retirer un champ obligatoire,
inverser les dates, ou supprimer la prose anglaise, et constater que le build échoue en
désignant l'entrée.

**Acceptance Scenarios**:

1. **Given** une nouvelle entrée valide, **When** le site est construit, **Then** elle
   apparaît à son rang chronologique sur `/background` et `/en/background`, sans autre
   fichier modifié.
2. **Given** une entrée sans date de début, intitulé, lieu ou description, **When** le site
   est construit, **Then** le build échoue et désigne le fichier, l'entrée et le champ.
3. **Given** une entrée dont l'intitulé, la description ou une réalisation manque dans une
   des deux langues, **When** le site est construit, **Then** le build échoue.
4. **Given** une entrée dont la date de fin précède la date de début, ou dont une date n'est
   pas une date, **When** le site est construit, **Then** le build échoue.
5. **Given** une entrée supprimée d'un fichier qui en garde d'autres, **When** le site est
   construit, **Then** elle disparaît de la frise dans les deux langues.
6. **Given** les deux fichiers, **When** on les lit, **Then** ils ne contiennent aucune
   information propre à la page (ordre d'affichage, mise en forme, période déjà rédigée) :
   une autre page peut les réutiliser sans les modifier.

---

### Edge Cases

- **Entrées simultanées** (alternance : l'école et l'entreprise en même temps) : chacune a sa
  ligne. Aucun regroupement ni mise en parallèle.
- **Même date de début** : l'entrée en cours passe avant l'entrée terminée ; entre deux
  entrées terminées, celle qui finit le plus tard passe d'abord ; ensuite, ordre alphabétique
  de l'intitulé. L'ordre est le même à chaque build et dans les deux langues.
- **Date de fin dans le futur** (diplôme prévu) : la période affiche cette date. « En cours »
  veut dire « sans date de fin », pas « fin postérieure au jour du build » : la page ne
  dépend pas de la date à laquelle le site est construit.
- **Date de début dans le futur** (stage signé) : l'entrée s'affiche à son rang, en tête.
- **Un fichier sans entrée, absent ou illisible** (aucune formation, aucune expérience, ou
  une erreur de syntaxe) : le build échoue et désigne le fichier. Chaque fichier porte au
  moins une entrée : une frise amputée d'un type ne doit pas partir en ligne.
- **Technologies ou réalisations sur une formation** : acceptées, puisque les deux fichiers
  ont la même forme ; elles s'affichent comme pour une expérience.
- **Texte long** (intitulé de diplôme, description de plusieurs phrases) : passe à la ligne
  dans sa colonne, sans troncature.

## Requirements _(mandatory)_

### Functional Requirements

**Page et frise**

- **FR-001**: Le site DOIT publier la page du parcours à `/background` en français et à
  `/en/background` en anglais, atteinte par le lien « Parcours » / « Background » de la
  navigation.
- **FR-002**: La page DOIT présenter formations et expériences sur une seule frise, triée par
  date de début décroissante, avec le départage décrit dans les cas limites.
- **FR-003**: Chaque entrée DOIT afficher sa période, son intitulé, son lieu et sa
  description.
- **FR-004**: Chaque entrée DOIT indiquer son type (formation ou expérience) par un texte
  dans la langue de la page, compréhensible sans la couleur et par un lecteur d'écran. Il
  n'existe que ces deux types : la nature d'une expérience (alternance, stage, emploi) n'est
  pas un champ, elle s'écrit dans l'intitulé.
- **FR-005**: Une entrée DOIT afficher ses technologies et ses réalisations quand elle en a,
  et ne laisser aucune trace quand elle n'en a pas.
- **FR-006**: Les technologies DOIVENT s'afficher en texte, sans lien, sous forme de puces
  de stack. Les liens de preuve vers les projets relèvent de `/skills` (F08).
- **FR-007**: La frise DOIT être une liste ordonnée pour les technologies d'assistance, et la
  page DOIT avoir un seul titre de premier niveau. Sur grand écran, une ligne d'en-têtes de
  colonnes (période, intitulé, lieu) ouvre la frise ; elle est purement visuelle, ignorée des
  technologies d'assistance, et absente sur mobile.
- **FR-024**: Chaque entrée DOIT s'ouvrir sur son année de début en chiffres d'affichage.
  Cette année est décorative pour les technologies d'assistance, la période la donne déjà.
  Dans la période d'une entrée en cours, « aujourd'hui » / « present » DOIT être en gras et
  précédé d'un carré rouge ; l'état est donc dit en texte.
- **FR-025**: Chaque entrée DOIT porter une pièce d'échecs décorative, un pion pour une
  formation et un cavalier pour une expérience, prise sans retouche dans le jeu du
  diagramme : noire en thème clair, blanche en thème sombre. Sur grand écran, un fil DOIT
  relier ces pièces ; sur mobile, la pièce se place à côté de l'année, sans fil.
- **FR-026**: Le lieu DOIT être mis en avant (gras, à l'encre) : c'est l'école ou l'employeur
  que le recruteur cherche d'abord.
- **FR-027**: Sur un écran à pointeur, survoler une entrée DOIT la garder à l'encre, faire
  avancer sa pièce d'un pas et passer les autres entrées en encre atténuée, sans descendre
  sous les seuils de contraste. Le pas de la pièce NE DOIT PAS se jouer sous
  `prefers-reduced-motion: reduce`. L'effet NE DOIT PAS reprendre l'inversion des lignes
  cliquables, et NE DOIT PAS exister au toucher.

**Périodes**

- **FR-008**: La période DOIT être produite à partir des dates de l'entrée, au mois près,
  dans la langue de la page, avec le mois abrégé suivi de l'année (« sept. 2024 » /
  « Sep 2024 »). Aucune période n'est rédigée à la main.
- **FR-009**: Une entrée sans date de fin DOIT afficher « aujourd'hui » en français et
  « present » en anglais à la place de la date de fin.
- **FR-010**: La page NE DOIT PAS afficher de durée calculée (« 2 ans 3 mois ») ni dépendre
  de la date du build.
- **FR-011**: Les dates d'une période DOIVENT être exposées dans un format lisible par une
  machine.
- **FR-012**: Les textes des entrées NE DOIVENT contenir ni date, ni année, ni durée, ni
  indication de temps relative (`CONTENU.md` §9, règle 5). Les entrées livrées respectent
  cette règle ; elle est vérifiée à la relecture, pas par le build.

**Données**

- **FR-013**: Les entrées DOIVENT vivre dans deux fichiers de données, un pour les
  expériences et un pour les formations, de même forme (`CONTENU.md` §6).
- **FR-014**: Une entrée DOIT porter : une date de début, une date de fin facultative, un
  intitulé, un lieu, une description, et facultativement des technologies et des
  réalisations.
- **FR-015**: L'intitulé, la description et chaque réalisation DOIVENT exister en français et
  en anglais dans la même entrée. Les dates, le lieu et les technologies n'existent qu'une
  fois.
- **FR-016**: Le build DOIT échouer, en désignant le fichier et l'entrée, quand un champ
  obligatoire manque, quand une prose manque dans une langue, quand une date est invalide,
  quand la date de fin précède la date de début, ou quand un des deux fichiers n'a aucune
  entrée, est absent ou ne peut pas être lu.
- **FR-017**: Ajouter, modifier ou retirer une entrée NE DOIT demander aucune modification
  de page ni de composant.
- **FR-018**: Les deux fichiers NE DOIVENT contenir aucune information propre à la page du
  parcours, pour que le CV (F09) les réutilise sans les modifier.
- **FR-019**: Le site DOIT être livré avec au moins deux expériences et deux formations,
  dont une entrée en cours, deux entrées simultanées et une expérience avec technologies et
  réalisations. Ces entrées reprennent le CV du mainteneur ; les mois que le CV ne donne pas
  sont confirmés par le mainteneur.
- **FR-028**: La description d'une entrée DOIT dire sa mission principale ; ses réalisations
  disent le reste du rôle. Une réalisation NE DOIT PAS raconter un projet déjà publié dans
  `/projects`.

**Qualité**

- **FR-020**: La page DOIT rester lisible de 375 px à 1280 px et au-delà, sans défilement
  horizontal, en clair et en sombre, selon le tableau du parcours et les règles d'empilement
  de `DESIGN.md`.
- **FR-021**: La page DOIT avoir un titre et une description uniques dans chaque langue, et
  des liens alternatifs entre les deux langues (F04).
- **FR-022**: La page DOIT être entièrement statique, sans script envoyé au navigateur
  (constitution, principes I et II).
- **FR-023**: Tous les libellés d'interface de la page (titre, types d'entrée, « aujourd'hui »
  / « present », libellés des technologies et des réalisations) DOIVENT exister dans les
  deux langues.

### Key Entities

- **Entrée de parcours** : une étape datée. Date de début (mois et année), date de fin
  facultative (son absence signifie « en cours »), intitulé (FR, EN), lieu, description
  (FR, EN), technologies facultatives, réalisations facultatives (FR, EN chacune).
- **Expérience** : une entrée de parcours du fichier des expériences (alternance, stage,
  emploi ; cette nature se lit dans l'intitulé). Porte en général technologies et
  réalisations. La description dit la mission principale, les réalisations le reste du rôle.
- **Formation** : une entrée de parcours du fichier des formations (école, diplôme). Même
  forme ; technologies et réalisations y sont en général absentes.
- **Période** : texte dérivé des dates d'une entrée et de la langue de la page. Elle n'est
  jamais stockée.
- **Frise** : la liste ordonnée qui réunit expériences et formations. Le type d'une entrée
  vient du fichier où elle se trouve.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Un visiteur trouve l'école actuelle, l'employeur actuel et leur date de début
  en moins de 15 secondes après l'ouverture de la page, sur mobile comme sur grand écran.
- **SC-002**: 100 % des entrées affichent période, intitulé, lieu, description et type, dans
  les deux langues.
- **SC-003**: Ajouter une entrée demande de modifier un seul fichier et aucune ligne de code.
- **SC-004**: Clore une entrée en cours demande de modifier une seule valeur ; la page est
  juste dans les deux langues au build suivant.
- **SC-005**: 0 date, année ou durée dans la prose des entrées livrées.
- **SC-006**: 100 % des entrées invalides (champ manquant, prose manquante dans une langue,
  dates incohérentes) font échouer le build avec un message qui désigne l'entrée ; un
  fichier vide, absent ou illisible le fait échouer en désignant le fichier.
- **SC-007**: À 375 px et à 1280 px, en clair et en sombre, la page n'a aucun défilement
  horizontal ni texte tronqué ou superposé.
- **SC-008**: La page atteint les cibles du site : Lighthouse performance ≥ 95,
  accessibilité 100, bonnes pratiques 100, SEO 100, et 0 ko de script envoyé au navigateur.
- **SC-009**: Le CV (F09) peut afficher les mêmes entrées sans qu'aucun des deux fichiers ne
  soit modifié.

## Assumptions

- **Dépendance** : F03 (site bilingue, sélecteur de langue, libellés d'interface) et F04
  (titre, description, liens alternatifs, plan du site) sont livrées. Le lien « Parcours »
  existe déjà dans la navigation.
- **Précision des dates** : mois et année. Le jour n'est ni saisi ni affiché. Le mois
  s'affiche abrégé ; l'exemple de période de `DESIGN.md` (`2022 – 2025`) et la largeur de sa
  colonne sont alignés sur ce format pendant la feature.
- **Lieu** : l'établissement ou l'entreprise et sa ville, des noms propres écrits une seule
  fois, identiques dans les deux langues.
- **Technologies** : des noms propres, écrits une seule fois, comme pour les projets.
- **Pas de brouillon** : une entrée présente dans un fichier est publiée. La marque
  « brouillon » des projets n'est pas reprise ici (YAGNI).
- **Pas de repli de langue** : contrairement aux projets, la prose anglaise est obligatoire.
  Les entrées sont courtes et vivent dans le même fichier que le français.
- **Pas de page par entrée, pas de filtre, pas de lien vers les projets ou les compétences**
  depuis une entrée. Le lien d'une entrée vers le projet qui la prouve est noté dans la
  réserve de `ROADMAP.md`.
- **Pas de durée affichée** : la période suffit, et une durée d'entrée en cours dépendrait de
  la date du build.
- **Projet d'entreprise** : les réalisations d'une expérience suivent la règle d'anonymisation
  de `CONTENU.md` §8 (pas de nom de client ni de chiffre confidentiel).
- **Hors périmètre** : l'ajout d'un chiffre par poste dans les réalisations (C4), la page
  `/skills`
  (F08), la page `/cv` et sa mise en page d'impression (F09). Le rappel éventuel du parcours
  sur une autre page n'est pas dans cette feature.
- **Fin de feature** : la feature est visuelle ; elle se termine par l'audit et le polish
  Impeccable, vérifiés à 375 px et à 1280 px, en clair et en sombre (`AGENTS.md`).

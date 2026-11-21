# Feature Specification: Qualité et exploitation

**Feature Branch**: `011-quality-ops`

**Created**: 2026-11-21

**Status**: Draft

**Input**: User description: "F11. Le site atteint les cibles de CONTENU.md §10 et reste propre
dans le temps.

- La CI échoue si un lien interne ou externe du site généré est mort.
- Les redirections des contenus retirés sont déclarées en un seul endroit.
- Mesure d'audience respectueuse de la vie privée : sans cookie, sans bandeau de consentement.
- En-têtes de sécurité de base appliqués par l'hébergeur.
- Audit unique : Lighthouse ≥ 95 performance et 100 accessibilité, bonnes pratiques et SEO sur
  l'accueil, une page projet et /en, en mobile ; navigation au clavier, contrastes AA dans les
  deux thèmes, hiérarchie de titres, textes alternatifs. Les écarts trouvés sont corrigés."

## Clarifications

### Session 2026-11-21

- Q: La vérification des liens tourne-t-elle aussi à intervalle régulier, hors PR ? → A: Non,
  sur les PR et les envois sur `main` seulement. Un lien externe mort entre deux changements
  est détecté au changement suivant.

## User Scenarios & Testing _(mandatory)_

Acteurs : le **mainteneur**, seul à faire évoluer le site pendant des années, qui veut être
prévenu avant de publier un défaut ; le **recruteur**, souvent sur mobile, parfois au clavier
ou avec un lecteur d'écran, qui arrive par un lien partagé ou un moteur de recherche.

Le domaine `ramazankus.dev` est en ligne en HTTPS (C6). Le site reste exclu des moteurs de
recherche jusqu'à C5.

### User Story 1 - Ne jamais publier un lien mort (Priority: P1)

Le mainteneur ouvre une PR qui casse un lien : une page renommée, une ancre supprimée, un
projet externe qui a fermé. La vérification de la PR échoue et nomme la page et le lien en
cause. Il corrige avant de fusionner.

**Why this priority**: « 0 lien mort, vérifié en CI » est une cible de `CONTENU.md` §10. Un
lien mort devant un recruteur coûte plus que tout autre défaut, et le mainteneur ne relit pas
chaque page à chaque changement.

**Independent Test**: dans une branche, ajouter un lien interne vers une page inexistante, puis
un lien externe vers un domaine qui n'existe pas ; la vérification échoue deux fois en nommant
le lien. Les retirer : elle passe.

**Acceptance Scenarios**:

1. **Given** une PR ou un envoi sur `main`, **When** le site est généré, **Then** chaque lien
   interne (page, ancre, fichier, image, CV) et chaque lien externe des pages générées est
   vérifié, dans les deux langues.
2. **Given** un lien interne vers une page, une ancre ou un fichier absent, **When** la
   vérification tourne, **Then** elle échoue et nomme la page source et le lien.
3. **Given** un lien externe qui répond « introuvable » ou dont le domaine n'existe plus,
   **When** la vérification tourne, **Then** elle échoue et nomme la page source et le lien.
4. **Given** un site externe qui refuse les robots alors que la page existe (réseau social,
   par exemple), **When** la vérification tourne, **Then** ce lien est exclu, et l'exclusion
   est écrite avec sa raison à un seul endroit.
5. **Given** un site externe momentanément lent ou indisponible, **When** la vérification
   tourne, **Then** elle réessaie avant de conclure, pour ne pas bloquer une PR sur un incident
   passager.
6. **Given** un lien externe qui meurt sans que le dépôt change, **When** la PR ou l'envoi sur
   `main` suivant est vérifié, **Then** la vérification échoue ; aucune vérification ne tourne
   entre deux changements.

---

### User Story 2 - Garder l'audit au vert (Priority: P1)

Un recruteur ouvre l'accueil sur son téléphone, parcourt les projets au clavier ou avec un
lecteur d'écran, dans le thème clair ou sombre. Tout se lit, tout s'atteint, rien ne charge
lentement. Le mainteneur a passé l'audit une fois, à la fin de toutes les features visuelles,
et corrigé chaque écart trouvé.

**Why this priority**: les cibles de `CONTENU.md` §10 et du principe VII de la constitution ne
sont vérifiées nulle part dans leur ensemble. Les features ont été revues une par une ; leurs
défauts communs (en-tête, pied de page, contrastes d'un thème) ne se voient qu'à la fin.

**Independent Test**: lancer l'audit de performance et de qualité en mobile sur l'accueil, une
page projet et l'accueil anglais ; parcourir au clavier chaque type de page dans les deux
thèmes ; les scores et la grille d'accessibilité sont au niveau des cibles.

**Acceptance Scenarios**:

1. **Given** l'accueil, une page projet et l'accueil anglais, **When** l'audit mobile tourne,
   **Then** les scores sont ≥ 95 en performance et à 100 en accessibilité, bonnes pratiques et
   SEO.
2. **Given** chaque type de page (accueil, à propos, liste des projets, page projet, parcours,
   compétences, CV, 404), dans les deux langues, **When** le lecteur la parcourt au seul
   clavier, **Then** chaque lien et chaque contrôle s'atteint dans l'ordre de lecture, avec un
   focus visible, et le lien d'évitement mène au contenu.
3. **Given** chaque type de page, **When** les contrastes sont mesurés en clair puis en sombre,
   **Then** chaque texte et chaque indicateur d'état atteint le niveau AA.
4. **Given** chaque type de page, **When** un lecteur d'écran liste les titres, **Then** il y a
   un seul titre de premier niveau et aucun niveau n'est sauté.
5. **Given** chaque image, **When** elle s'affiche, **Then** elle a un texte alternatif qui dit
   ce qu'elle apporte, ou un texte vide si elle est décorative.
6. **Given** un écart trouvé, **When** l'audit se termine, **Then** il est corrigé dans le
   composant qui le porte, et la correction vaut pour toutes les pages qui l'utilisent.
7. **Given** l'accueil, **When** il est chargé, **Then** il pèse moins de 200 ko transférés,
   scripts de mesure compris.

---

### User Story 3 - Savoir qui lit le site, sans pister personne (Priority: P2)

Le mainteneur veut savoir si sa candidature est lue : combien de visites, quelles pages,
d'où viennent les lecteurs (LinkedIn, une candidature, un moteur de recherche), en français ou
en anglais. Il veut aussi savoir si les vrais lecteurs reçoivent un site rapide, au-delà du
téléphone simulé de l'audit. Le recruteur, lui, ne voit aucun bandeau et n'est pas suivi d'un site à l'autre.

**Why this priority**: utile pour orienter la campagne (`CONTENU.md` §7), mais le site remplit
son rôle sans. Elle vient après la fiabilité et la qualité.

**Independent Test**: ouvrir le site en navigation privée, parcourir trois pages ; aucun
cookie ni stockage local n'est créé, aucun bandeau n'apparaît, et les trois pages vues
apparaissent dans le tableau de bord du mainteneur.

**Acceptance Scenarios**:

1. **Given** un visiteur, **When** il parcourt le site, **Then** aucun cookie ni donnée stockée
   dans son navigateur n'est créé, et aucun bandeau de consentement n'est affiché.
2. **Given** une visite, **When** le mainteneur consulte sa mesure, **Then** il voit le nombre
   de visites et de pages vues, les pages les plus lues, les sites d'origine et la langue des
   pages.
3. **Given** un visiteur dont le navigateur bloque la mesure ou n'exécute pas de script,
   **When** il parcourt le site, **Then** le site fonctionne à l'identique.
4. **Given** un aperçu de branche ou le serveur local, **When** il est consulté, **Then** ses
   visites ne sont pas comptées.
5. **Given** des visites réelles, **When** le mainteneur consulte sa mesure, **Then** il voit,
   par page, la vitesse d'affichage, la réactivité et la stabilité de la mise en page
   ressenties par les visiteurs.

---

### User Story 4 - Retirer un contenu sans casser ses liens (Priority: P2)

Le mainteneur retire ou renomme un projet. Il supprime le fichier et déclare une redirection.
Le recruteur qui suit un ancien lien (CV envoyé, message LinkedIn, moteur de recherche) arrive
sur la page qui le remplace, dans sa langue.

**Why this priority**: « Retirer un projet : 1 fichier supprimé + 1 redirection » est une cible
de `CONTENU.md` §10, et la constitution (principe IX) l'impose. Le besoin est rare mais il
arrivera.

**Independent Test**: ouvrir l'adresse d'un contenu déjà retiré, en français et en anglais ;
elle mène à sa page de remplacement en une seule redirection, qui désigne sa cible comme
adresse canonique.

**Acceptance Scenarios**:

1. **Given** un contenu retiré avec sa redirection déclarée, **When** un visiteur ouvre
   l'ancienne adresse, **Then** il arrive sur la page de remplacement de la même langue.
2. **Given** une redirection, **When** un moteur de recherche la suit, **Then** il la lit
   comme permanente, et elle ne passe pas par une redirection intermédiaire.
3. **Given** toutes les redirections du site, **When** le mainteneur les cherche, **Then** elles
   sont déclarées à un seul endroit, avec leur cible.
4. **Given** une redirection dont la cible n'existe pas, **When** la vérification des liens
   tourne, **Then** elle échoue.

---

### User Story 5 - Des protections de base, sans y penser (Priority: P3)

Le site ne peut pas être affiché dans un cadre d'un autre site, le navigateur ne devine pas le
type d'un fichier, et un site externe qu'on ouvre depuis le portfolio ne reçoit que l'origine
de la visite, pas l'adresse complète de la page.

**Why this priority**: un site statique sans formulaire ni compte a peu à protéger ; ces
protections sont peu coûteuses et évitent le détournement de la page dans un cadre.

**Independent Test**: lire les en-têtes de réponse de l'accueil, d'une page projet, du CV PDF
et de la 404, en production ; les trois protections sont présentes partout.

**Acceptance Scenarios**:

1. **Given** n'importe quelle réponse du site (page, image, PDF, 404, redirection), **When**
   elle est servie, **Then** elle porte les trois protections.
2. **Given** une page du site placée dans un cadre d'un autre domaine, **When** le navigateur
   la charge, **Then** il refuse de l'afficher.
3. **Given** les protections, **When** le site est parcouru, **Then** rien ne casse : polices,
   images, transitions, CV et mesure d'audience fonctionnent.

---

### Edge Cases

- Un lien externe vers un site qui renvoie une redirection : il n'est pas mort, la vérification
  suit la redirection et juge la page d'arrivée.
- Un lien vers une ancre d'une autre page du site (`/skills#…`) : l'ancre est vérifiée, pas
  seulement la page.
- Les adresses construites par le site lui-même : canoniques, alternatives de langue et
  sitemap sont vérifiées comme les autres liens. L'outil ne lit ni les balises de partage
  (`og:url`, `og:image`) ni les données structurées ; elles reprennent les mêmes adresses,
  et l'image de partage a été vérifiée à la mise en ligne.
- Un projet en brouillon n'est pas publié : aucun lien publié ne doit y mener.
- Les adresses `mailto:` ne sont pas vérifiées : aucun moyen fiable de savoir si une boîte
  existe sans lui écrire.
- Tant que le site est exclu des moteurs de recherche (jusqu'à C5), le score SEO tombe par
  construction : l'audit SEO se fait sur une version identique sans cette exclusion.
- L'audit se fait sur la version publiée (ou un aperçu identique), avec la compression et le
  cache de l'hébergeur, pas sur le serveur de développement.
- Les robots connus : la mesure s'en remet au filtrage de l'hébergeur ; s'il n'existe pas, le
  biais est accepté et noté dans le compte rendu d'audit.
- Les liens du CV PDF ne sont pas vérifiés à part : ils viennent des mêmes données que les
  pages (une seule source), que la vérification couvre.
- La 404 anglaise garde son statut « introuvable » sous `/en/` avec les protections en place.

## Requirements _(mandatory)_

### Functional Requirements

**Liens**

- **FR-001**: Chaque PR et chaque envoi sur `main` DOIT vérifier tous les liens internes et
  externes des pages générées, dans les deux langues, et échouer s'il en trouve un mort.
- **FR-002**: Un échec DOIT nommer la page source et le lien en cause.
- **FR-003**: Les liens internes DOIVENT être vérifiés jusqu'à l'ancre et au fichier (image,
  PDF, police).
- **FR-004**: Un lien externe DOIT être réessayé avant d'être déclaré mort ; une erreur
  passagère ne doit pas faire échouer la vérification.
- **FR-005**: Les liens exclus de la vérification DOIVENT être listés à un seul endroit, chacun
  avec sa raison ; aucun lien interne n'est exclu.
- **FR-006**: La vérification NE tourne QUE sur les PR et les envois sur `main`, sans
  exécution planifiée.

**Redirections**

- **FR-007**: Toutes les redirections du site DOIVENT être déclarées à un seul endroit.
- **FR-008**: Une redirection DOIT mener immédiatement et directement à sa cible, dans la même
  langue ; les moteurs de recherche DOIVENT la lire comme permanente (l'ancienne adresse
  désigne sa cible comme adresse canonique et reste hors de l'index).
- **FR-009**: Une redirection dont la cible n'existe pas DOIT faire échouer la vérification des
  liens.

**Mesure d'audience**

- **FR-010**: La mesure d'audience NE DOIT créer aucun cookie ni aucune donnée stockée dans le
  navigateur du visiteur, ni demander de consentement.
- **FR-011**: Elle DOIT donner au mainteneur au moins : visites, pages vues, pages les plus
  lues, sites d'origine, langue des pages ; et, par page, les indicateurs de performance
  ressentis par les vrais visiteurs (affichage, réactivité, stabilité).
- **FR-012**: Elle NE DOIT compter que la production : ni aperçus de branche, ni serveur local.
- **FR-013**: Le site DOIT fonctionner à l'identique si la mesure est bloquée ou si le
  navigateur n'exécute pas de script ; elle ne doit ni retarder l'affichage ni décaler la mise
  en page.
- **FR-014**: La mesure DOIT être déclarée à un seul endroit, commun à toutes les pages.

**Protections**

- **FR-015**: Chaque réponse du site DOIT interdire son affichage dans un cadre d'un autre
  domaine, interdire au navigateur de deviner le type d'un fichier, et ne transmettre aux sites
  externes que l'origine de la visite.
- **FR-016**: Les protections DOIVENT être déclarées à un seul endroit et ne casser aucune
  fonction existante.

**Audit**

- **FR-017**: En mobile, l'accueil, une page projet et l'accueil anglais DOIVENT atteindre ≥ 95
  en performance et 100 en accessibilité, bonnes pratiques et SEO.
- **FR-018**: Chaque type de page, dans les deux langues et les deux thèmes, DOIT être
  utilisable au seul clavier avec un focus visible, avoir des contrastes AA, un seul titre de
  premier niveau sans niveau sauté, et un texte alternatif adapté pour chaque image.
- **FR-019**: L'accueil DOIT peser moins de 200 ko transférés, scripts de mesure compris.
- **FR-020**: Chaque écart trouvé DOIT être corrigé dans le composant ou le jeton qui le porte,
  et le résultat de l'audit (scores, écarts, corrections) consigné dans le dossier de la
  feature.

### Key Entities

- **Lien** : une adresse citée par une page générée, interne (page, ancre, fichier) ou externe.
- **Exclusion** : un lien externe que la vérification ne suit pas, avec sa raison.
- **Redirection** : une ancienne adresse, sa cible, dans une langue.
- **Visite** : une page vue en production, sans identifiant de visiteur, avec son site
  d'origine et sa langue.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: 0 lien mort sur le site publié ; un lien mort introduit dans une PR la fait
  échouer dans 100 % des cas, en nommant la page et le lien.
- **SC-002**: Après fusion, aucune des 10 premières vérifications de `main` n'échoue sur une
  erreur passagère d'un site externe (suivi, pas une porte de la feature).
- **SC-003**: L'accueil, une page projet et l'accueil anglais obtiennent en mobile ≥ 95 / 100 /
  100 / 100 (performance, accessibilité, bonnes pratiques, SEO).
- **SC-004**: 0 écart d'accessibilité restant sur la grille de l'audit (clavier, focus,
  contrastes AA dans les deux thèmes, titres, textes alternatifs), sur tous les types de page
  et dans les deux langues.
- **SC-005**: L'accueil pèse moins de 200 ko transférés, scripts de mesure compris.
- **SC-006**: 0 cookie et 0 donnée stockée par le site dans le navigateur du visiteur, 0
  bandeau ; la mesure ne retarde pas le premier affichage d'une page.
- **SC-007**: 100 % des redirections déclarées mènent en une seule étape à une page existante,
  avec la cible pour adresse canonique.
- **SC-008**: 100 % des réponses contrôlées (page, image, PDF, 404, redirection) portent les
  trois protections.

## Assumptions

- **Dépendances** : C6 et toutes les features visuelles (F02–F10) sont livrées. Le blog (F12)
  viendra après ; ses pages seront couvertes par la même vérification des liens sans travail
  supplémentaire.
- **Pages mesurées** : les scores sont mesurés sur l'accueil, une page projet et l'accueil
  anglais ; les autres pages partagent la mise en page et les composants, et la grille
  d'accessibilité (clavier, contrastes, titres, textes alternatifs) les couvre toutes.
- **Audit unique** : l'audit complet se fait une fois, à la fin de cette feature. Il n'y a pas
  de mesure automatique des scores en continu ; la vérification des liens et `check` / `build`
  restent les seules portes automatiques.
- **Protections de base seulement** : pas de politique de sécurité du contenu complète (liste
  des sources autorisées), jugée coûteuse à tenir pour un site sans formulaire ni compte.
- **Mesure d'audience et de performance** : les services de l'hébergeur, sans cookie, choisis
  et justifiés dans le plan (demande du mainteneur, 2026-11-21). Leurs scripts sont la seule
  exception au zéro JavaScript de cette feature (constitution, principe II), en amélioration
  progressive.
- **Exclusion des moteurs** : le site reste exclu des moteurs jusqu'à C5 ; cette feature ne
  lève pas l'exclusion.
- **Redirections existantes** : celle de l'ancien projet d'exemple vers `portfolio` est gardée
  et passe sous les mêmes règles.
- **Feature non visuelle** : elle ne change pas la direction visuelle ; les corrections de
  l'audit qui touchent l'UI suivent `DESIGN.md` et les jetons, et sont vérifiées à 375 px et à
  1280 px, en clair et en sombre, en-tête et pied de page compris.

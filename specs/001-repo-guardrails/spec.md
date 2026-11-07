# Feature Specification: Outillage et garde-fous du dépôt

**Feature Branch**: `001-repo-guardrails`

**Created**: 2026-11-07

**Status**: Draft

**Input**: User description: "Mettre en place les garde-fous du dépôt pour que tout code ajouté ensuite soit formaté, typé et vérifié automatiquement.
- Une commande formate tout le projet ; une commande vérifie le formatage et les types ; le build reste la commande existante.
- À chaque push et chaque pull request sur GitHub, vérification et build sont exécutés ; un échec marque la PR en rouge.
- Le README explique comment installer et lancer le projet, les commandes disponibles et le workflow speckit.
Hors périmètre : déploiement, vérification des liens morts (F12)."

## User Scenarios & Testing *(mandatory)*

Acteurs : le **mainteneur** (seul développeur du site) et l'**agent** qui implémente les tâches
speckit. Tous deux ajoutent du code et doivent savoir, sans effort, s'il est conforme.

### User Story 1 - Vérifier localement le code avant de committer (Priority: P1)

Avant chaque commit, le mainteneur (ou l'agent) lance une seule commande qui lui dit si le
projet est correctement formaté et sans erreur de typage. Une seconde commande remet tout le
projet au format attendu, d'un coup.

**Why this priority**: c'est le garde-fou de base, exigé par la constitution (principe IX)
avant chaque commit. Sans lui, la CI n'a rien à exécuter et `/speckit-implement` ne peut pas
vérifier ses tâches.

**Independent Test**: sur un clone frais, introduire un fichier mal formaté puis une erreur de
type ; la commande de vérification échoue dans chaque cas en nommant le fichier fautif ; la
commande de formatage corrige le premier cas ; une fois tout corrigé, la vérification passe.

**Acceptance Scenarios**:

1. **Given** un projet entièrement conforme, **When** le mainteneur lance la vérification,
   **Then** elle se termine avec succès.
2. **Given** un fichier dont la mise en forme s'écarte de la convention, **When** le mainteneur
   lance la vérification, **Then** elle échoue et désigne le fichier concerné.
3. **Given** une erreur de typage dans un composant ou un module, **When** le mainteneur lance
   la vérification, **Then** elle échoue et indique le fichier et la ligne.
4. **Given** plusieurs fichiers mal formatés, **When** le mainteneur lance la commande de
   formatage, **Then** tous sont reformatés et la vérification de format passe ensuite.
5. **Given** le projet existant, **When** le mainteneur lance la commande de build, **Then** il
   utilise la même commande qu'avant cette feature et obtient le site généré.

---

### User Story 2 - Bloquer automatiquement le code non conforme sur GitHub (Priority: P2)

À chaque push et à chaque pull request, GitHub exécute la vérification puis le build. Si l'un
échoue, la PR est marquée en échec (rouge) et le mainteneur voit pourquoi ; sinon elle est
marquée en succès (vert).

**Why this priority**: protège `main` même quand la vérification locale a été oubliée. Dépend
des commandes de la story 1.

**Independent Test**: ouvrir une PR contenant une erreur de formatage : son statut passe au
rouge ; pousser la correction : il passe au vert.

**Acceptance Scenarios**:

1. **Given** une PR conforme, **When** elle est ouverte ou mise à jour, **Then** la vérification
   et le build s'exécutent et la PR affiche un statut de succès.
2. **Given** une PR contenant une erreur de format ou de type, **When** elle est ouverte,
   **Then** la PR affiche un statut d'échec et le journal indique l'étape et le fichier fautifs.
3. **Given** un code qui passe la vérification mais casse le build, **When** il est poussé,
   **Then** le statut est en échec.
4. **Given** un push direct sur une branche (y compris `main`), **When** il arrive sur GitHub,
   **Then** la même vérification et le même build s'exécutent.

---

### User Story 3 - Démarrer le projet grâce au README (Priority: P3)

Une personne qui découvre le dépôt (ou le mainteneur dans un an) lit le README et sait
installer les dépendances, lancer le site en local, connaître les commandes disponibles et
suivre le workflow speckit pour ajouter une feature.

**Why this priority**: utile mais sans effet sur la qualité du code ; le README existe déjà en
partie et doit simplement refléter les nouvelles commandes.

**Independent Test**: sur une machine propre, suivre uniquement le README jusqu'à voir le site
en local et faire passer la vérification, sans autre source.

**Acceptance Scenarios**:

1. **Given** un clone frais, **When** le lecteur suit la section d'installation, **Then** il
   obtient le site en local sans consulter d'autre document.
2. **Given** le README, **When** le lecteur cherche les commandes, **Then** il trouve formatage,
   vérification, build, serveur de développement et prévisualisation, chacune avec son rôle.
3. **Given** le README, **When** le lecteur veut ajouter une feature, **Then** il trouve l'ordre
   des étapes speckit et où trouver les blocs à fournir.

---

### Edge Cases

- Fichiers générés (build, cache du framework, dépendances installées) : ils sont exclus du
  formatage et de la vérification, sinon les commandes échouent ou ralentissent sans raison.
- Documents Markdown de cadrage (`CONTENU.md`, `ROADMAP.md`, specs…) : le formatage ne doit pas
  altérer leur sens (tableaux, blocs de code, listes) ; voir Assumptions.
- Fichiers sous `.specify/` et `.claude/` (outillage speckit et skills fournis par des tiers) :
  exclus, pour ne pas créer de diff à chaque mise à jour de l'outillage.
- Version de Node différente de celle attendue : l'installation ou la vérification doit le
  signaler clairement plutôt qu'échouer de façon obscure.
- Premier passage du formatage sur le dépôt existant : il peut reformater des fichiers déjà
  présents ; ce changement est isolé dans un commit dédié.
- Échec du build en CI alors que la vérification passe : le statut reste en échec.
- Éditeurs différents : les réglages de base (indentation, fin de ligne, encodage) sont
  partagés pour que le code écrit par l'éditeur soit déjà proche du format attendu.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Le projet MUST fournir une commande unique qui formate l'ensemble des fichiers
  sources du projet selon une convention partagée.
- **FR-002**: Le projet MUST fournir une commande unique de vérification qui échoue si au
  moins un fichier n'est pas formaté OU si le code contient une erreur de typage, et réussit
  sinon.
- **FR-003**: La vérification MUST appliquer le niveau de typage le plus strict proposé par le
  framework du site.
- **FR-004**: La vérification MUST couvrir les composants du site, les modules et les fichiers
  de configuration du projet.
- **FR-005**: La commande de vérification MUST ne modifier aucun fichier.
- **FR-006**: En cas d'échec, la vérification MUST indiquer quels fichiers sont en cause (et la
  ligne pour une erreur de typage).
- **FR-007**: La commande de build MUST rester celle existante (`npm run build`), inchangée pour
  son utilisateur.
- **FR-008**: Les fichiers générés, les dépendances installées et l'outillage tiers (`.specify/`,
  `.claude/`) MUST être exclus du formatage et de la vérification.
- **FR-009**: À chaque push sur n'importe quelle branche et à chaque pull request vers `main`,
  GitHub MUST exécuter, sur une installation propre des dépendances, la vérification puis le
  build.
- **FR-010**: Si la vérification ou le build échoue, le statut de la PR / du commit MUST être en
  échec ; s'ils réussissent tous deux, il MUST être en succès.
- **FR-011**: La version de Node attendue MUST être déclarée à un seul endroit, utilisé à la
  fois en local et en CI.
- **FR-012**: Les réglages d'éditeur de base (indentation, fins de ligne, encodage, ligne
  finale) MUST être partagés dans le dépôt.
- **FR-013**: Le README MUST expliquer : prérequis, installation, lancement en local, la liste
  des commandes disponibles avec leur rôle, et le workflow speckit.
- **FR-014**: Après la mise en place, le dépôt existant MUST passer la vérification et le build
  sans erreur.
- **FR-015**: Le déploiement et la vérification des liens morts MUST rester hors de cette
  feature (prévus plus tard, F12).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Sur le dépôt livré, la vérification et le build réussissent du premier coup, en
  local comme sur GitHub (0 erreur).
- **SC-002**: 100 % des erreurs injectées de test (une de format, une de typage, une de build)
  font passer le statut de la PR au rouge.
- **SC-003**: La vérification locale complète s'exécute en moins de 30 secondes sur le projet
  actuel.
- **SC-004**: Le statut d'une PR est disponible en moins de 5 minutes après le push.
- **SC-005**: Une personne qui découvre le dépôt lance le site en local en suivant uniquement le
  README, en moins de 10 minutes (hors temps de téléchargement).
- **SC-006**: Le mainteneur n'a besoin de retenir que 3 commandes pour le cycle courant :
  formater, vérifier, construire.

## Assumptions

- Le dépôt est hébergé sur GitHub (`origin` pointe vers GitHub) et le service d'intégration
  continue intégré à GitHub est utilisé ; aucun service tiers.
- La version de Node visée est 22 (cohérente avec le README et `package.json`).
- Pas de linter dédié en plus du typage strict : la vérification du framework et le typage
  strict suffisent pour un site de cette taille (KISS, constitution principe I).
- Les fichiers Markdown du dépôt sont inclus dans le formatage ; si le formatage dénaturait un
  document de cadrage, ce fichier serait exclu explicitement plutôt que de changer la règle.
- La protection de branche (rendre le statut obligatoire pour fusionner) est un réglage GitHub
  fait à la main par le mainteneur ; la feature se limite à produire le statut et à documenter
  ce réglage dans le README.
- Pas de crochet automatique avant commit : la vérification locale reste une commande à lancer,
  et la CI sert de filet (YAGNI).
- Dépendances : étape 0 terminée (constitution, `DESIGN.md`) ; aucune autre feature requise.

---
name: Ramazan Kus — portfolio
description: La partie annotée. Un livre de parties commentées, imprimé en encre noire avec un seul rouge de commentateur.
colors:
  paper: '#faf8f3'
  ink: '#141414'
  ink-muted: '#57554f'
  rule-soft: '#dcd9d2'
  mark: '#c8102e'
  interesting: '#a3289a'
  interesting-on-invert: '#ea45d8'
  great: '#2a5384'
  great-on-invert: '#749bbf'
  brilliant: '#0077b6'
  brilliant-on-invert: '#5cc8ff'
  great-on-board: '#2a5384'
  interesting-on-board: '#a3289a'
  brilliant-on-board: '#0077b6'
  mark-on-board: '#c8102e'
  square-light: '#ffffff'
  square-dark: '#c9c6be'
  paper-dark: '#161513'
  ink-dark: '#f1efea'
  ink-muted-dark: '#aaa69d'
  rule-soft-dark: '#36342f'
  mark-dark: '#ff5a6a'
  interesting-dark: '#ea45d8'
  interesting-on-invert-dark: '#a3289a'
  great-dark: '#749bbf'
  great-on-invert-dark: '#2a5384'
  brilliant-dark: '#5cc8ff'
  brilliant-on-invert-dark: '#0077b6'
  square-light-dark: '#e6e3dc'
  square-dark-dark: '#b3afa5'
typography:
  display:
    fontFamily: 'Archivo, Helvetica Neue, Arial, sans-serif'
    fontSize: 'clamp(3.5rem, 2rem + 6vw, 6rem)'
    fontWeight: 800
    lineHeight: 0.92
    letterSpacing: '-0.02em'
    fontVariation: "'wdth' 72"
  headline:
    fontFamily: 'Archivo, Helvetica Neue, Arial, sans-serif'
    fontSize: 'clamp(2.5rem, 1.6rem + 3.6vw, 4.5rem)'
    fontWeight: 800
    lineHeight: 0.98
    letterSpacing: '-0.02em'
    fontVariation: "'wdth' 72"
  section-title:
    fontFamily: 'Archivo, Helvetica Neue, Arial, sans-serif'
    fontSize: 'clamp(1.75rem, 1.4rem + 1.2vw, 2.5rem)'
    fontWeight: 800
    lineHeight: 1.1
    fontVariation: "'wdth' 72"
  lead:
    fontFamily: 'Archivo, Helvetica Neue, Arial, sans-serif'
    fontSize: 'clamp(1.375rem, 1.1rem + 0.9vw, 1.75rem)'
    fontWeight: 400
    lineHeight: 1.3
  title:
    fontFamily: 'Archivo, Helvetica Neue, Arial, sans-serif'
    fontSize: '1.375rem'
    fontWeight: 700
    lineHeight: 1.3
  body:
    fontFamily: 'Archivo, Helvetica Neue, Arial, sans-serif'
    fontSize: '1.125rem'
    fontWeight: 400
    lineHeight: 1.55
    fontFeature: "'tnum' 1"
  label:
    fontFamily: 'Archivo, Helvetica Neue, Arial, sans-serif'
    fontSize: '0.9375rem'
    fontWeight: 700
    lineHeight: 1.3
  meta:
    fontFamily: 'Archivo, Helvetica Neue, Arial, sans-serif'
    fontSize: '0.8125rem'
    fontWeight: 400
    lineHeight: 1.55
  eval:
    fontFamily: 'Archivo, Helvetica Neue, Arial, sans-serif'
    fontSize: 'clamp(1.75rem, 1.4rem + 1.2vw, 2.5rem)'
    fontWeight: 800
    lineHeight: 1
    fontVariation: "'wdth' 72"
rounded:
  none: '0'
spacing:
  '1': '4px'
  '2': '8px'
  '3': '12px'
  '4': '16px'
  '5': '24px'
  '6': '32px'
  '7': '48px'
  '8': '64px'
  '9': '96px'
components:
  button-primary:
    backgroundColor: '{colors.ink}'
    textColor: '{colors.paper}'
    typography: '{typography.body}'
    rounded: '{rounded.none}'
    padding: '12px 24px'
    height: '48px'
  button-primary-hover:
    backgroundColor: '{colors.paper}'
    textColor: '{colors.ink}'
  button-secondary:
    backgroundColor: '{colors.paper}'
    textColor: '{colors.ink}'
    typography: '{typography.body}'
    rounded: '{rounded.none}'
    padding: '12px 24px'
    height: '48px'
  button-secondary-hover:
    backgroundColor: '{colors.ink}'
    textColor: '{colors.paper}'
  nav-link:
    textColor: '{colors.ink}'
    typography: '{typography.label}'
  nav-link-current:
    textColor: '{colors.mark}'
    typography: '{typography.label}'
  move-row:
    backgroundColor: '{colors.paper}'
    textColor: '{colors.ink}'
    padding: '12px 8px'
  move-row-hover:
    backgroundColor: '{colors.ink}'
    textColor: '{colors.paper}'
  eval-symbol:
    textColor: '{colors.interesting}'
    typography: '{typography.eval}'
  eval-symbol-on-invert:
    textColor: '{colors.interesting-on-invert}'
  eval-symbol-great:
    textColor: '{colors.great}'
    typography: '{typography.eval}'
  eval-symbol-great-on-invert:
    textColor: '{colors.great-on-invert}'
  eval-symbol-brilliant:
    textColor: '{colors.brilliant}'
    typography: '{typography.eval}'
  eval-symbol-brilliant-on-invert:
    textColor: '{colors.brilliant-on-invert}'
  stack-chip:
    backgroundColor: '{colors.paper}'
    textColor: '{colors.ink}'
    rounded: '{rounded.none}'
    padding: '4px 12px'
  availability-banner:
    textColor: '{colors.ink}'
    typography: '{typography.label}'
---

# Design System: Ramazan Kus — portfolio

## Overview

**Creative North Star: "La partie annotée"**

Le portfolio se lit comme un livre de parties commentées, dans l'esprit de Chess Informator. Chaque projet est une partie. On la raconte par son coup critique (le problème) et par le choix fait, et un symbole d'évaluation la note, dans les couleurs des sites d'échecs : bleu pour un bon coup, violet pour un pari. La page est un papier crème très léger (`#faf8f3`), imprimé en encre presque noire : un blanc pur ferait écran, et fatiguerait les yeux. Un seul rouge, celui du commentateur, marque l'état et la gaffe. Un bleu ciel, plus rare encore, ne marque que le coup brillant (`!!`). Le diagramme d'échiquier est une planche imprimée en gris pierre. Des filets épais ouvrent chaque partie, des filets fins séparent les coups.

La densité est celle d'un livre de référence : des colonnes de texte serrées, une notation et des métadonnées en chiffres tabulaires, aucune décoration qui ne porte une information. La hiérarchie vient d'une seule famille grotesque à axe de chasse : étroite et très grasse pour les noms et les titres, normale pour le texte. Le thème sombre imprime le même livre en négatif, encre claire sur noir chaud. Le diagramme y reste une planche tonale, jamais un échiquier d'écran.

Refus confirmé par la direction : le hero centré suivi d'une rangée de cartes projets, typique du portfolio de développeur.

**Key Characteristics:**

- Papier crème léger, encre `#141414`, un seul rouge de commentateur.
- Une famille (Archivo) sur deux chasses : 72 % pour l'affichage, 100 % pour le texte.
- Chiffres tabulaires partout, notation d'échecs et en-têtes de type PGN.
- Filets de 2 px sous les en-têtes, filets fins de 1 px entre les lignes.
- Zéro rayon, zéro ombre portée. Au survol, la ligne s'inverse.
- Signature : le symbole d'évaluation, en bleu ou en violet. Au survol d'un coup, sa case s'allume sur le diagramme, en CSS seul.
- Deux bleus, réservés aux bons coups, comme sur chess.com : bleu foncé pour `!`, bleu ciel pour `!!`.
- Le mouvement imite le commentateur : un coup joué, puis noté. Les projets mis en avant sont trois coups candidats des blancs depuis la même position : au survol, la pièce joue le coup. En CSS seul (voir Motion).

## Colors

Une encre et un papier, plus un rouge rare qui ne parle que pour le commentateur.

### Primary

- **Rouge du commentateur** (`mark`; sombre : `mark-dark`) : symbole de la gaffe `??` (page 404), marqueur de trait et de disponibilité (le carré plein du bandeau), page courante de la navigation, case allumée sur le diagramme au survol d'un coup. Il sert aussi l'état système : anneau de focus (`2px`, décalage `3px`) et sélection de texte (texte `paper` sur fond rouge).
- **Violet du pari** (`interesting`; sombre : `interesting-dark`) : le symbole `!?` et rien d'autre, comme sur Lichess. Le rouge rappellerait un mauvais coup. Prune sur papier (`#a3289a`, 5,95:1), rose-violet de Lichess en sombre (`#ea45d8`, 5,51:1). Sur ligne inversée (`interesting-on-invert`), les deux valeurs s'échangent (5,56:1 et 5,49:1).

### Accent

- **Bleu du bon coup** (`great`; sombre : `great-dark`) : le symbole `!` et rien d'autre, partout où il apparaît. Bleu marine sur papier (`#2a5384`, 7,41:1), bleu ardoise de chess.com en sombre (`#749bbf`, 6,24:1), assez loin du bleu du `!!` pour ne pas s'y confondre. Sur ligne inversée (`great-on-invert`), les deux valeurs s'échangent (6,3:1 et 6,85:1).
- **Bleu du coup brillant** (`brilliant`; sombre : `brilliant-dark`) : le symbole `!!` et rien d'autre, dans la liste des coups, dans sa légende, sur le diagramme, dans la marge d'une page projet et dans le favicon. Sur papier clair, il s'imprime en bleu profond (`#0077b6`, 4,59:1) : le bleu ciel pur ne tient pas le contraste sur un fond clair. En sombre, il devient le vrai bleu ciel (`#5cc8ff`, 9,7:1).
- **Bleu sur ligne inversée** (`brilliant-on-invert`; sombre : `brilliant-on-invert-dark`) : le `!!` quand sa ligne est inversée. Comme les deux rouges, les deux bleus échangent leurs rôles entre clair et sombre. Sur la ligne inversée du thème sombre, le bleu profond tombe à 4,24:1 : c'est admis, car le symbole y est toujours en grand texte (seuil 3:1).
- **Encres de la planche** (`great-on-board`, `interesting-on-board`, `brilliant-on-board`, `mark-on-board`) : le diagramme reste une planche claire dans les deux thèmes, donc les symboles posés sur le diagramme et les liserés du coup gardent leurs encres d'impression (`#2a5384`, `#a3289a`, `#0077b6`, `#c8102e`), sans échange en sombre. Le bleu ciel du thème sombre tomberait à 1,47:1 sur une case claire, le rouge clair à 1,39:1 sur une case foncée. Les symboles se posent sur une pastille de la couleur des cases claires : de 3,8:1 (`!!` en sombre) à 7,87:1 (`!` en clair), au-dessus du seuil de 3:1 du grand texte. Jetons livrés en F10.
- Jetons livrés en F06 dans `src/styles/global.css` (`--color-great`, `--color-great-on-invert`, `--color-brilliant`, `--color-brilliant-on-invert`).

### Neutral

- **Papier** (`paper`, crème léger ; sombre : `paper-dark`, noir chaud) : fond de page. C'est aussi la couleur du texte posé sur le rouge et sur l'encre (boutons pleins, lignes inversées).
- **Encre** (`ink`; sombre : `ink-dark`) : texte, filets épais (`--color-rule`), fond des lignes inversées (`--color-invert-bg`), bord du diagramme (`--color-board-edge`), bouton plein.
- **Encre atténuée** (`ink-muted`; sombre : `ink-muted-dark`) : années, ligne d'en-tête de partie, coup clé, légende, libellés PGN, coordonnées du diagramme, périodes du parcours.
- **Filet doux** (`rule-soft`; sombre : `rule-soft-dark`) : filets de 1 px entre les coups et entre les lignes de tableau.
- **Case claire / case sombre** (`square-light`, `square-dark`; sombre : `square-light-dark`, `square-dark-dark`) : cases du diagramme. Gris pierre en clair. En sombre, la planche reste imprimée et tonale (`#e6e3dc` / `#b3afa5`), les pièces gardent leur dessin d'origine.

### Named Rules

**The Commentator's Red Rule.** Le rouge est réservé par principe à l'état et à la gaffe : symbole `??`, marqueur de trait ou de disponibilité, page courante, case allumée, focus, sélection. Jamais sur un bouton, jamais en fond de survol, jamais pour décorer. Le test : si l'élément rouge ne note, ne signale ou ne localise rien, il passe en encre.

**The Brilliant Blue Rule.** Le bleu n'existe que pour les bons coups : bleu foncé pour `!`, bleu ciel pour `!!`. Pas de lien bleu, pas de focus bleu, pas de case bleue. Le `!?` est violet ; le rouge ne note jamais un projet. Un projet `!!` est rare : au plus un parmi les coups mis en avant, sinon le bleu perd son sens.

**The Printed Negative Rule.** Le thème sombre est le même livre imprimé en négatif : les jetons s'échangent, la composition ne bouge pas. Il suit uniquement `prefers-color-scheme`, sans script ni attribut ; un forçage par `[data-theme]` n'arrivera qu'avec un bouton de thème (réserve de `ROADMAP.md`). Le diagramme reste une planche tonale claire, jamais inversée.

## Typography

**Display Font:** Archivo, variable (`wdth` 62–125, `wght` 100–900), un seul fichier woff2 auto-hébergé dans `src/assets/fonts/` (tiré de `@fontsource-variable/archivo` 5.2.6, sous-ensemble latin, licence OFL jointe), préchargé, `font-display: swap` (repli : Helvetica Neue, Arial, sans-serif)
**Body Font:** Archivo, même fichier, chasse normale (100 %)

Les graisses passent par des jetons : `--weight-regular` (400), `--weight-semibold` (600), `--weight-bold` (700), `--weight-black` (800).

**Character:** Une grotesque de livre technique. Étroite et très grasse (`font-stretch: 72%`, 800), elle donne le nom et les titres de partie. En chasse normale, elle se lit pour le récit. Les chiffres sont tabulaires (`font-variant-numeric: tabular-nums` sur `body`), comme une notation imprimée.

### Hierarchy

- **Display** (800, 72 %, `clamp(3.5rem, 2rem + 6vw, 6rem)`, interligne 0.92, approche −0.02em) : le nom, sur l'accueil uniquement.
- **Headline** (800, 72 %, `clamp(2.5rem, 1.6rem + 3.6vw, 4.5rem)`, interligne 0.98, −0.02em, 18ch max) : titre d'une page projet, mode lecture.
- **Section title** (800, 72 %, `--text-2xl`, interligne 1.1) : titres de section en tête de grille (« Parcours »).
- **Lead** (400, `--text-xl` 22 → 28 px, interligne 1.3, 34–40ch) : pitch de l'accueil, résumé d'un projet.
- **Title** (700, `--text-lg` 22 px, interligne 1.3) : titre d'un coup dans la liste, intertitres du récit, ligne du coup clé (600).
- **Body** (400, `--text-base` 18 px, interligne 1.55, mesure `--measure` 68ch) : texte courant.
- **Label** (700, `--text-sm` 15 px) : en-tête de liste (« Parties choisies »), en-têtes de tableau, notation (`1.e4`), titre du bandeau de disponibilité. La navigation utilise la même taille en 400, et 600 pour la page courante.
- **Meta** (400, `--text-xs` 13 px) : légende des symboles, libellés PGN, coordonnées du diagramme.
- **Eval** (800, 72 %, `--text-2xl`, interligne 1, rouge) : le symbole d'évaluation dans la marge. En légende, il descend à `--text-sm`.

### Named Rules

**The One Family, Two Widths Rule.** Une seule famille, Archivo. Le contraste vient de la chasse et de la graisse (72 %/800 contre 100 %/400), jamais d'une seconde police. Rien ne passe en capitales espacées.

**The Typesetter's Rule.** Le français est composé à la française : espace fine insécable (U+202F) avant `:` et `;`, tirets demi-cadratin dans les périodes (`sept. 2022 – août 2024`, mois abrégé), `text-wrap: balance` sur les titres et `pretty` sur les paragraphes.

## Layout

Une page de livre centrée : conteneur de `--page-max` (96rem), gouttière fluide `--gutter` (`clamp(1rem, 0.5rem + 2.5vw, 4.5rem)`), mesure de lecture `--measure` (68ch). L'espacement suit une base de 4 px (`--space-1` à `--space-9` : 4, 8, 12, 16, 24, 32, 48, 64, 96 px). Les sections respirent en `--space-8` / `--space-9` sur l'axe vertical.

- **Accueil (ouverture).** Deux colonnes : texte `minmax(0, 1fr)`, diagramme `minmax(18rem, 30rem)`, écart `--space-7` / `--space-8`. Le diagramme est collant (`top: --space-6`). Dessous, le nom, la ligne d'en-tête de partie sur filet de 2 px, le pitch, les deux actions côte à côte, puis la liste des coups.
- **Liste des coups.** Grille à trois colonnes : année + notation (4.5rem), titre + coup clé, symbole d'évaluation aligné à droite (2.5rem), sur ligne de base commune.
- **Page projet (lecture).** Au-dessus de `64rem`, deux colonnes comme l'accueil : la lecture à gauche, l'en-tête PGN à droite (16 à 20rem), collant (`top: --space-6`), ses entrées empilées et séparées par des filets doux. En dessous, une seule colonne. Lien retour, titre, résumé. Un en-tête PGN entre un filet épais et un filet fin : année, technologies, puis liens s'il y en a. Puis la colonne commentée : une marge de symboles (3rem) et le texte à la mesure. Elle s'ouvre par le coup clé, noté par le symbole dans la marge, puis le visuel s'il existe, puis le récit.
- **À propos.** Le titre sur un filet de 2 px qui traverse la page. Dessous, la photo à gauche (20rem) et le récit à la mesure. Au-dessus de `80rem`, « Ce que je cherche » occupe une troisième colonne (16rem au moins) en en-tête de partie : le titre précédé du carré du trait, puis disponibilité, début s'il est renseigné, et modalités, empilés entre un filet épais et un filet fin. En dessous, il passe sous la photo et le récit, sur un filet de 2 px, ses entrées côte à côte. Sous `56rem`, une colonne : titre, photo, récit, « Ce que je cherche » ; sous `30rem`, la photo prend toute la largeur.
- **Mentions légales.** Comme une page projet : titre, résumé en `--text-xl`, puis au-dessus de `64rem` l'en-tête PGN à droite (éditeur, directeur de la publication, contact, hébergeur, mise à jour), collant. Le texte est fait de parties ouvertes comme les rubriques du CV (titre en `--text-2xl` sur un filet de 2 px, précédé d'une pièce : la tour pour les données, le cavalier pour les crédits), et de lignes libellé / texte (libellé de 12rem dès `40rem`) séparées par des filets doux.
- **Pied de page.** Sous un filet de 2 px, il ne répète pas le nom de l'en-tête. Les contacts en mots (Email, LinkedIn, GitHub), en 600, puis une ligne en `--text-sm` atténué ouverte par le roi (1.5rem) : « Ce site est un de mes projets » (lien vers sa fiche) et la date du dernier build, puis les mentions légales. Une seule ligne dès `64rem`, contacts à gauche ; en dessous, tout s'empile au bord gauche et la date prend sa ligne.
- **Responsive.** Sous `56rem`, l'accueil passe à une colonne dans cet ordre : nom (le filet de 2 px reste, la ligne d'en-tête de partie disparaît : le pitch dit déjà l'école et l'employeur), pitch et actions, puis le bandeau de disponibilité sur son filet fin (il quitte la légende pour rester dans le premier écran), puis le diagramme réduit (22rem max), sans légende, puis les coups. Le tableau du parcours passe à une colonne, pour qu'une étape se lise dans un seul écran de téléphone sans tasser sa tête : l'année, avec la pièce de l'étape (1.5rem) au bout de sa ligne, puis l'intitulé sur toute la largeur, le lieu en `--text-sm` 600, et une ligne de `--text-sm` atténuée qui réunit la période et le type d'entrée en 400 (« sept. 2025 – ■ aujourd'hui · Formation »). Viennent ensuite la description, les puces et les réalisations. Les étapes sont espacées de `--space-5`. La ligne d'en-têtes et le fil disparaissent, et le filet de 2 px ouvre la liste. Sous `40rem`, l'en-tête PGN passe à la ligne et la marge des symboles disparaît : le texte reprend toute la largeur, et le symbole passe à droite du coup clé, comme dans la liste.

### Named Rules

**The Rule-Line Rule.** Un filet épais de 2 px (`--rule-heavy`, encre) ouvre chaque partie : sous la barre de navigation, sous le nom, sous un en-tête de liste ou de tableau, au-dessus d'une section et du pied de page. Un filet de 1 px en `rule-soft` sépare les coups et les lignes. La structure se lit par ces filets, pas par des boîtes.

## Elevation & Depth

Le système est plat, comme une page imprimée. Aucune ombre portée, aucun flou, aucune superposition de surfaces. La profondeur vient des filets et d'un seul effet d'état, l'inversion : la ligne survolée passe en encre pleine, son texte en papier. Le coup survolé se marque sur le diagramme par des liserés rouges tracés en contour intérieur des cases (`outline` à décalage négatif, pas d'ombre) : 4 px sur la case d'arrivée, 2 px sur la case de départ. Ce sont des marques, pas une élévation, et elles restent visibles en contraste forcé.

### Named Rules

**The Flat Page Rule.** Rien ne flotte au-dessus du papier. Pour signaler un état, on inverse ou on souligne, on ne soulève pas.

## Shapes

Toutes les formes sont des angles droits (`--radius: 0`). Les boutons, les puces de stack, le diagramme et le carré du trait sont des rectangles nets. Les bordures sont des filets d'encre de 1 ou 2 px. Les liens sont soulignés à 1 px (décalage `--underline-offset`, 0.2em) et passent à 2 px au survol.

### Named Rules

**The Zero Radius Rule.** Aucun rayon, nulle part. Un coin arrondi sortirait la page du livre.

## Motion

Le mouvement imite le geste du commentateur : on joue le coup, puis on le note. Rien ne bouge en boucle, rien ne bouge pour remplir, rien ne bouge sans le lecteur. Tout est en CSS, sans JavaScript. Ces effets sont livrés en F10.

**Jetons.** `--duration` (160 ms, états de survol et de focus), `--duration-page` (280 ms, transition de page), `--duration-move` (320 ms, trajet d'une pièce), `--duration-stamp` (240 ms, pose d'un symbole), `--ease-out`. Sous `prefers-reduced-motion: reduce`, toutes les durées valent 0.

### Les quatre effets

1. **Les coups candidats (survol d'une ligne).** Au repos, le diagramme montre la position de référence et rien ne bouge. Au survol ou au focus d'une ligne de la liste des coups, la pièce du projet glisse de sa case de départ à sa case d'arrivée (`--duration-move`, `--ease-out`). La case d'arrivée s'allume d'un liseré rouge de 4 px et la case de départ d'un liseré rouge de 2 px, comme le dernier coup sur un échiquier en ligne. Une pièce prise disparaît quand la pièce qui la prend arrive. Quand on passe à une autre ligne, la pièce revient à sa case et la pièce de la nouvelle ligne joue son coup ; quand on quitte la liste, la position de référence revient. Le coup `!!` se joue comme les autres, seulement à la demande du lecteur. Ce ne sont que des coups des blancs, le camp de l'auteur : les noirs ne jouent jamais. Sous `prefers-reduced-motion`, aucune pièce ne bouge, seules les cases se marquent (le liseré s'épaissit en `--duration`). Sur écran tactile, sans survol, toucher une ligne ouvre directement le projet.
2. **La note du coup (diagramme).** Une fois la pièce arrivée, le symbole d'évaluation du projet (`!`, `!?` ou `!!`) se pose à côté de la case d'arrivée : fondu et échelle de 1.15 à 1 (`--duration-stamp`, décalage égal à la moitié de `--duration-move`, quand la pièce touche sa case), comme un tampon. Il est posé sur une petite pastille claire qui chevauche le coin haut-droit de la case, sans jamais sortir de la planche, dans l'encre d'impression de son symbole (Accent, encres de la planche). Il s'efface aussitôt que la ligne n'est plus active. Sous `prefers-reduced-motion`, aucun symbole ne se pose : la note reste dans la liste.
3. **La partie qu'on ouvre (transition de page).** View transitions natives entre documents (`@view-transition { navigation: auto; }`). Le titre d'une ligne de la liste et le titre de la page projet partagent un `view-transition-name` par projet (`project-<slug>`) : le titre se déplace et grandit jusqu'à sa place. L'en-tête du site reste fixe (`view-transition-name: site-header`). Le reste de la page passe en fondu, en `--duration-page` : l'ancienne page s'efface avant que la nouvelle n'apparaisse, jamais deux pages superposées. Le titre garde ses proportions en grandissant (`view-transition-class: project`), et le fondu entre ses deux captures dure un tiers de la transition.
4. **La note du commentateur (page projet).** Le symbole d'évaluation du projet, dans la marge, se pose comme le tampon de l'effet 2, mais en simple fondu, sans échelle : il doit rester discret. Il arrive après la transition de page (décalage égal à `--duration-page`), jamais pendant. Dans la couleur de son symbole : bleu foncé pour `!`, violet pour `!?`, bleu ciel pour `!!`.

### Named Rules

**The Move-Then-Note Rule.** Le symbole suit toujours le coup ou la transition, jamais en même temps. Deux mouvements ne se chevauchent pas.

**The One Move Rule.** Un seul mouvement à la fois, et seulement à la demande du lecteur (survol, focus ou navigation). Pas de mouvement au chargement, pas de boucle, pas d'apparition au défilement, pas de parallaxe, pas de pièce qui suit le curseur.

**The Final State Rule.** L'état au repos est l'état du HTML : la position de référence, sans symbole sur le diagramme. Sans prise en charge du navigateur, ou sous `prefers-reduced-motion: reduce`, la page s'affiche dans cet état, et les coups se lisent dans la liste.

## Components

### Buttons

Des rectangles d'encre, francs et sans rayon.

- **Shape :** angles droits (0), contour d'encre de 2 px, hauteur minimale 3rem, marge interne `--space-3` / `--space-5`, 700 en `--text-base`.
- **Primary :** fond encre, texte papier (« Télécharger le CV »).
- **Secondary :** contour seul, texte encre (« M'écrire »).
- **Hover / Focus :** les deux s'inversent (le plein passe en contour, le contour en plein), en `--duration` 160 ms avec `--ease-out`. Le focus utilise l'anneau rouge global. Jamais de fond rouge.

### Chips

- **Style :** puces de stack sur la page projet. Contour encre de 1 px, fond papier, `--text-sm`, marge interne `--space-1` / `--space-3`, sans rayon.
- **State :** statiques, non interactives.

### Navigation

- **Style :** barre de tête sur filet de 2 px. Le nom (700, `--text-base`) à gauche, les rubriques (`--text-sm`, sans soulignement) et `EN` (600) à droite.
- **States :** au survol, soulignement de 2 px. La page courante (`aria-current="page"`, ou `"true"` sur une page placée sous la rubrique) est rouge, en 600, soulignée à 2 px. Survol et page courante partagent le même décalage (`--underline-offset-current`, 0.35em), pour que le trait ne saute pas d'un lien à l'autre.
- **Source :** les rubriques viennent de `src/data/nav.ts`, une entrée par rubrique.
- **Mobile :** sous 48rem, une seule ligne : le nom, la langue, puis le menu dans le coin droit (trois traits en SVG de 1.25rem, qui se croisent à l'ouverture, cible de 44 px centrée sur l'icône et débordant de 0.75rem dans la marge pour que l'icône reste calée sur les filets, « Menu » gardé pour les lecteurs d'écran). « EN » a aussi une cible de 44 px, texte centré, et environ 24 px de vide séparent « EN » des traits. Le menu est un `<details>` natif, sans JavaScript : il déplie les rubriques sous la barre, une par ligne entre filets doux, cibles de 44 px, et pousse le contenu sans le recouvrir. Au-delà de 48rem, la liste reste en ligne et les trois traits disparaissent.

### Liste des coups (signature)

Chaque projet mis en avant est un coup candidat des blancs, joué depuis la même position. Tous portent donc le même numéro de coup, comme les variantes d'un livre commenté (`23.Fxh7`, `23.Td1`, `23.Cg5`). La colonne de gauche donne l'année en encre atténuée et la notation en 700. Au centre, le titre en Title et le coup clé en encre atténuée (« Coup clé : … »). À droite, le symbole d'évaluation dans sa couleur. Toute la ligne est un lien. Au survol ou au focus, elle s'inverse (`--color-invert-bg` / `--color-invert-ink`), le texte atténué hérite de la couleur et le symbole passe dans sa couleur sur ligne inversée (`great-on-invert`, `interesting-on-invert` ou `brilliant-on-invert`). Une légende en Meta explique les symboles utilisés (`!` bon coup en bleu foncé, `!?` pari réfléchi en violet, `!!` coup brillant en bleu ciel) ; « coup clé » ne désigne que la phrase du projet. Sur `/projects`, la même ligne liste tous les projets, sans notation : sous le titre, le résumé puis les technologies en texte, séparées par « · ». Avec `:has()`, la pièce du projet survolé joue son coup sur le diagramme et ses deux cases se marquent (voir Motion, effet 2).

### Diagramme et bandeau de disponibilité

Le diagramme est une planche imprimée de 30rem max (22rem sur mobile) : bord d'encre de 2 px, cases en gris pierre, coordonnées en Meta atténuée, pièces cburnett en SVG (lichess-org/lila, triple licence GPL/BSD/GFDL). Chaque pièce est un élément séparé, placé par sa case, pour qu'on puisse la déplacer d'une case à l'autre en CSS (Motion, effet 1). Sa légende est le bandeau de disponibilité : un filet fin au-dessus, un carré plein rouge de 0.75rem (le trait), le statut en 700 (« Disponible pour un stage »), puis la date et le lieu. Le contenu du bandeau vient des données de campagne.

### Tableau du parcours

Il se lit comme une grille de tournoi : une liste ordonnée qui mêle formations et expériences, de la plus récente à la plus ancienne. Au-dessus de `56rem`, quatre colonnes : période (12.5rem), fil (1.75rem), intitulé, lieu (10 à 16rem). En-têtes en Label sur filet de 2 px, purement visuels ; lignes séparées par des filets doux.

- **Année.** Chaque ligne s'ouvre sur l'année de début en chiffres d'affichage (800, 72 %, `--text-2xl`, interligne 1), toujours à l'encre : c'est le rail de la frise. Dessous, la période en `--text-sm` atténuée, sans retour à la ligne, au mois abrégé (« sept. 2024 – aujourd'hui »), puis le type d'entrée (« Formation », « Expérience ») en 600, jamais au-dessus de l'intitulé (sur mobile, période et type passent sous le lieu, voir Responsive). Une étape en cours se signale dans sa période : « aujourd'hui » passe à l'encre en 600, précédé du carré rouge du trait, réduit à 0.5rem parce qu'il vit dans une ligne de petit texte.
- **Fil et pièces.** Un filet d'encre de 1 px relie les étapes. Chacune y porte une pièce de 1.75rem à la hauteur de l'année : un pion pour une formation (la pièce qui va à promotion), un cavalier pour une expérience. Ce sont les pièces cburnett du diagramme, sans retouche, imprimées à l'encre comme une notation en figurines : la pièce noire en thème clair, la blanche en thème sombre. La règle « les noirs ne jouent jamais » vaut pour le diagramme, pas pour ces figurines. La pièce est décorative, le type se lit dans le texte.
- **Intitulé et lieu.** L'intitulé est en Title. Le lieu (l'école ou l'employeur, ce que le recruteur cherche d'abord) est en 600 à l'encre, en `--text-base` dans sa colonne. Sous l'intitulé, à la mesure : la description, les technologies en puces de stack sans lien, puis les réalisations en liste à tirets, en `--text-sm`. Un lieu sur deux lignes n'écarte pas l'intitulé de sa description.
- **Survol.** L'étape survolée reste à l'encre, sa pièce avance d'un pas (`--space-1`, comme un coup sur le diagramme, jamais sous `prefers-reduced-motion`), et les autres étapes passent en encre atténuée, en `--duration`. La ligne n'est pas un lien : pas d'inversion, qui promettrait un clic. Réservé aux écrans à pointeur (`hover: hover`).

Sur mobile, il s'empile (voir Layout).

### Liste des compétences

Elle se lit comme un tableau de référence, sous une légende. Le titre et une phrase en Lead, puis la légende entre deux filets doux : « Niveaux » en Label, puis les quatre niveaux du plus haut au plus bas, chacun avec sa pièce, son nom en 600 et sa définition atténuée, en `--text-sm`. Puis une section par domaine : le titre en Section title sur un filet de 2 px, les compétences séparées par des filets doux.

- **Niveau.** Une pièce cburnett de 1.5rem, prise sans retouche dans le jeu du diagramme comme sur la frise du parcours : un pion pour Notions, un cavalier pour Autonome, une tour pour Avancé, une dame pour Expert. L’échelle suit la valeur des pièces (1, 3, 5, 9). Expert demande des contextes variés, pas seulement une pratique quotidienne, et peut rester vide. Noire en thème clair, blanche en thème sombre, centrée sur la hauteur d’x du mot. Elle est décorative : le niveau s’écrit toujours en mots à côté, en 600. Ni rouge ni bleu, ce n’est ni un état ni une évaluation de projet.
- **Ligne.** Le nom en Title, le niveau en `--text-sm` 600, et les liens de preuve en `--text-sm` (projets, puis étapes du parcours, qui mènent à l'étape sur `/background`), un par ligne, chacun haut de 24 px au moins (WCAG 2.2, 2.5.8). Aucune date : la fréquence de pratique est dans la définition du niveau.
- **Grand écran.** Au-dessus de `56rem`, chaque domaine est un tableau sur toute la largeur, en colonnes proportionnelles 3 / 2 / 4 (nom, niveau, preuves), identiques dans tous les domaines. Le titre du domaine tient la ligne d’en-têtes : « Niveau » et « Preuves » en Label sont posés sur sa ligne de base, au-dessus de leurs colonnes, purement visuels. Le libellé « Preuves » de chaque ligne n’est plus lu que par les lecteurs d’écran. La légende passe en quatre colonnes égales. Deux colonnes de domaines ou de compétences ont été écartées : les hauteurs ne s’alignent pas.
- **Mobile.** Sous `56rem`, le nom et le niveau partagent la première ligne, le niveau à droite ; puis « Preuves » en Meta atténuée et les liens sur toute la largeur. Le titre du domaine reste collé en haut de l’écran (fond papier, filet de 2 px dessous) le long de son domaine, et le titre suivant le remplace : la page ne se lit pas comme une seule liste. Au-dessus de `56rem`, il ne colle pas.
- **Survol.** Comme sur le tableau du parcours : la ligne survolée reste à l’encre, sa pièce avance d’un pas (`--space-1`, jamais sous `prefers-reduced-motion`), et les autres lignes de la page passent en encre atténuée, en `--duration`. La ligne n’est pas un lien : pas d’inversion. Réservé aux écrans à pointeur (`hover: hover`). La pièce reçoit son pas du parent par `--piece-step`.
- **Pas de rouge.** La page n’a aucun état en cours à signaler : le carré du trait n’y a pas sa place.

### CV

La page `/cv` est une feuille de CV : on la lit de haut en bas, puis on repart avec le PDF ou un contact. Les détails vivent sur `/background`, `/skills` et les pages projet. Elle ne copie pas le PDF.

- **Grille.** Au-dessus de `64rem`, comme la page projet : la lecture à gauche, une colonne d'infos de 20rem à droite, collée en haut de l'écran (`top: --space-6`). À droite on décide et on agit, à gauche on lit le CV : la colonne reste courte pour tenir dans l'écran, et email, LinkedIn et PDF restent à portée de main pendant toute la lecture. Une colonne latérale qui portait aussi compétences et langues a été écartée : trop haute pour coller, deux lectures concurrentes. En dessous de `64rem`, une seule colonne de 56rem au plus : nom et titre, disponibilité, bouton, contacts, pitch, puis les rubriques ; la colonne d'infos se défait (`display: contents`).
- **Infos.** Dans l'ordre des questions du recruteur, séparés de `--space-6` : le bandeau de disponibilité avec son carré rouge (est-ce pour moi ?), le bouton plein « Télécharger le CV en PDF » de bord à bord comme les filets des coordonnées, puis un en-tête de partie comme l'en-tête PGN d'une page projet : « Email », « LinkedIn », « GitHub » en Meta atténuée, chaque valeur dessous en 600, entre un filet de 2 px et un filet fin, empilés entre filets doux. Ni lieu (la disponibilité dit déjà où), ni lien vers le site (on y est).
- **Lecture.** Le nom en Headline, le titre en `--text-lg` 600, le pitch en Lead (40ch, sans titre visible). Le pitch suit le titre à `--space-5`, comme le résumé d'une page projet. Puis Expérience, Formation, Projets, Compétences, Langues, dans l'ordre du PDF : le titre en Section title (800, 72 %, `--text-2xl`) au-dessus de son contenu, sur un filet de 2 px. Comme les domaines de `/skills` : sous `56rem`, il reste collé en haut de l'écran le long de sa rubrique, sur fond papier ; au-dessus, il ne colle pas et perd sa marge du haut. Les rubriques sont séparées par `--space-8`, la dernière ligne d'une liste n'a pas de marge du bas : 64 px entre deux rubriques sur grand écran, 76 px sur mobile, comme sur `/skills`.
- **Étapes (expérience, formation).** Une pièce cburnett de 1.75rem dans la marge, comme sur la frise du parcours : un cavalier pour une expérience, un pion pour une formation, décorative. L'intitulé en Title et la période en `--text-sm` atténuée à droite (dessous sur mobile) ; une étape en cours se signale comme sur le parcours, « aujourd'hui » à l'encre en 600 précédé du carré rouge réduit à 0.5rem ; le lieu en `--text-sm` 600, la description à la mesure, les points en liste à tirets. Étapes séparées par des filets doux.
- **Projets.** La liste des coups, en mode détaillé comme sur `/projects` : année, titre, résumé, technologies, symbole d'évaluation, légende. La ligne s'inverse au survol. Sous `56rem`, sans notation, la colonne de l'année se réduit à 3rem.
- **Compétences et langues.** Une liste de définitions entre filets doux : le domaine ou la langue en 700, les noms ou le niveau à côté (colonne de 12rem dès `40rem`, dessous en dessous). Pas de niveau ni de pièce : `/skills` les donne.
- **Survol.** Comme sur le parcours et les compétences : l'étape ou la ligne survolée reste à l'encre, la pièce avance d'un pas (`--space-1`, jamais sous `prefers-reduced-motion`), les autres passent en encre atténuée. Réservé aux écrans à pointeur.
- **Impression.** Une page A4 (marges 12 × 14 mm), toujours encre sur papier : le thème sombre ne vaut qu'à l'écran (`global.css`). En-tête, pied de page, bouton, légende et pièces disparaissent (la source d'une pièce suit le thème du système, pas l'impression). La même colonne, resserrée, et la base passe à 56 %. L'adresse d'un projet s'écrit sous son titre.
- **PDF.** Il ne suit pas cette direction, volontairement. C'est un CV classique, lu par des recruteurs et par des logiciels de tri : la mise en page LaTeX du CV d'origine (`src/cv/template.tex`), en TeX Gyre Pagella, rubriques en petites capitales sur filet, liens bleu foncé, adresse du site dans l'en-tête. La ville y reste (usage d'un CV, champ lu par les ATS). Le portfolio ouvre la ligne des liens, avec le libellé « Portfolio » : c'est la preuve ; LinkedIn et GitHub se lisent dans leur adresse. Chaque projet renvoie à sa fiche, adresse écrite en clair dans la colonne de droite (le code est sur la fiche). C'est la seule exception à la palette et à la famille du site, et elle reste hors de l'écran.

### En-tête PGN et récit commenté (page projet)

Les métadonnées forment une liste de définitions en ligne (année, technologies en puces, liens) : libellé en Meta atténuée, valeur en 600. Le coup clé est isolé entre deux filets fins, en `--text-lg` 600 ; le symbole d'évaluation se place dans la colonne de marge, à son niveau : il note le coup clé, pas un intertitre. Le visuel, s'il existe, suit à la largeur de la mesure. Dans le récit, chaque partie est un coup : un filet doux au-dessus de l'intertitre, l'intertitre en chasse étroite (800, 72 %, `--text-xl`). Une note du commentateur (une citation Markdown dans la fiche) s'isole entre deux filets fins, en `--text-lg` 600, comme le coup clé ; si elle commence par un symbole d'évaluation, ce symbole se place dans la marge. Une image de preuve du récit prend la largeur de la mesure, sans cadre, avec sa légende dessous en `--text-sm` atténué, comme une figure de livre. La page finit sur un filet épais : les liens du projet, la partie suivante en ligne de la liste des coups, et le lien vers tous les projets.

### États à construire en F04 (non livrés)

Ces deux états découlent du monde construit mais n'existent pas encore.

- **Image de partage par défaut (Open Graph), à construire en F04.** Format 1200 × 630, fond papier, composition de l'ouverture : le nom en Display (800, 72 %), un filet d'encre de 2 px, la ligne d'en-tête de partie en encre atténuée, puis le pitch en Lead (c'est le texte prévu par `CONTENU.md` §3). Un seul élément rouge au plus, un symbole d'évaluation ou le carré du trait. Le diagramme est facultatif, à droite, en planche gris pierre. Pas de rayon, pas d'ombre. Une version par langue si le pitch diffère.
- **Favicon, livré en F04.** SVG carré, angles droits, le symbole `!!` du coup brillant en bleu (`brilliant`), dessiné en Archivo 800 à 72 % et vectorisé (aucune police chargée), sur fond papier. Il s'adapte au thème par `prefers-color-scheme` dans le SVG (fond `paper-dark`, bleu ciel `brilliant-dark`). C'est le seul `!!` hors des projets : il signe le site, il ne note pas un coup.

## Do's and Don'ts

### Do:

- **Do** réserver le rouge (`mark`) à la gaffe `??`, au trait et à la disponibilité, à la page courante, à la case allumée, au focus et à la sélection.
- **Do** inverser la ligne au survol (encre pleine, texte papier) et passer alors le symbole dans sa couleur sur ligne inversée.
- **Do** ouvrir chaque partie par un filet de 2 px et séparer les lignes par un filet de 1 px en `rule-soft`.
- **Do** composer l'affichage en Archivo 800 à 72 % de chasse et le texte en Archivo à 100 %, chiffres tabulaires.
- **Do** placer une espace fine insécable (U+202F) avant `:` et `;` en français.
- **Do** réserver les bleus aux symboles `!` (`great`) et `!!` (`brilliant`).
- **Do** jouer le coup, puis poser le symbole, une seule fois, et afficher l'état final sous `prefers-reduced-motion`.
- **Do** garder le diagramme en planche tonale dans le thème sombre (`#e6e3dc` / `#b3afa5`).
- **Do** prendre chaque valeur dans les jetons de `src/styles/global.css` (constitution, principe VIII).

### Don't:

- **Don't** mettre du rouge sur un bouton ou en fond de survol.
- **Don't** arrondir un coin : le rayon vaut 0 partout.
- **Don't** ajouter d'ombre portée ni de surface flottante. La seule ombre admise est le liseré intérieur de la case allumée.
- **Don't** introduire une seconde famille de caractères ni des capitales espacées.
- **Don't** composer un hero centré suivi d'une rangée de cartes projets.
- **Don't** utiliser le bleu pour un lien, un focus, une case ou une décoration.
- **Don't** animer en boucle, au défilement de chaque section, ni deux mouvements en même temps.
- **Don't** inverser les couleurs du diagramme en sombre ni le peindre aux couleurs d'un échiquier d'écran.

## Références

Le monde vient de l'imprimé, pas du web.

- **Chess Informator** (Šahovski informator) : symboles d'évaluation, diagrammes, notation compacte. C'est la référence du monde.
- **Les livres de parties commentées**, par exemple _Mes 60 meilleures parties_ de Bobby Fischer : une partie par chapitre, le récit autour du coup critique, les en-têtes de partie.
- **lichess.org** : référence de qualité d'exécution seulement, pour la netteté du diagramme et le jeu de pièces cburnett, repris tel quel. Le marquage du dernier coup (case de départ et case d'arrivée) vient aussi de là.
- **chess.com** : la convention des bons coups en bleu, `!` en bleu foncé et `!!` en bleu ciel, et rien d'autre.

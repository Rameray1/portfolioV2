---
name: Ramazan Kus — portfolio
description: La partie annotée. Un livre de parties commentées, imprimé en encre noire avec un seul rouge de commentateur.
colors:
  paper: '#ffffff'
  ink: '#141414'
  ink-muted: '#57554f'
  rule-soft: '#dcd9d2'
  mark: '#c8102e'
  mark-on-invert: '#ff5a6a'
  square-light: '#ffffff'
  square-dark: '#c9c6be'
  paper-dark: '#161513'
  ink-dark: '#f1efea'
  ink-muted-dark: '#aaa69d'
  rule-soft-dark: '#36342f'
  mark-dark: '#ff5a6a'
  mark-on-invert-dark: '#c8102e'
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
    textColor: '{colors.mark}'
    typography: '{typography.eval}'
  eval-symbol-on-invert:
    textColor: '{colors.mark-on-invert}'
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

Le portfolio se lit comme un livre de parties commentées, dans l'esprit de Chess Informator. Chaque projet est une partie. On la raconte par son coup critique (le problème) et par le choix fait, et un symbole d'évaluation rouge la note. La page est un papier blanc pur, imprimé en encre presque noire. Un seul rouge, celui du commentateur, porte le jugement. Le diagramme d'échiquier est une planche imprimée en gris pierre. Des filets épais ouvrent chaque partie, des filets fins séparent les coups.

La densité est celle d'un livre de référence : des colonnes de texte serrées, une notation et des métadonnées en chiffres tabulaires, aucune décoration qui ne porte une information. La hiérarchie vient d'une seule famille grotesque à axe de chasse : étroite et très grasse pour les noms et les titres, normale pour le texte. Le thème sombre imprime le même livre en négatif, encre claire sur noir chaud. Le diagramme y reste une planche tonale, jamais un échiquier d'écran.

Refus confirmé par la direction : le hero centré suivi d'une rangée de cartes projets, typique du portfolio de développeur.

**Key Characteristics:**

- Papier blanc, encre `#141414`, un seul rouge de commentateur.
- Une famille (Archivo) sur deux chasses : 72 % pour l'affichage, 100 % pour le texte.
- Chiffres tabulaires partout, notation d'échecs et en-têtes de type PGN.
- Filets de 2 px sous les en-têtes, filets fins de 1 px entre les lignes.
- Zéro rayon, zéro ombre portée. Au survol, la ligne s'inverse.
- Signature : le symbole d'évaluation rouge. Au survol d'un coup, sa case s'allume sur le diagramme, en CSS seul.

## Colors

Une encre et un papier, plus un rouge rare qui ne parle que pour le commentateur.

### Primary

- **Rouge du commentateur** (`mark`; sombre : `mark-dark`) : symboles d'évaluation (`!`, `!?`), marqueur de trait et de disponibilité (le carré plein du bandeau), page courante de la navigation, case allumée sur le diagramme au survol d'un coup. Il sert aussi l'état système : anneau de focus (`2px`, décalage `3px`) et sélection de texte (texte `paper` sur fond rouge).
- **Rouge sur ligne inversée** (`mark-on-invert`; sombre : `mark-on-invert-dark`) : le symbole d'évaluation quand sa ligne est inversée au survol ou au focus. Les deux rouges échangent leurs rôles entre clair et sombre, et chacun garde au moins 4,5:1 sur son fond.

### Neutral

- **Papier** (`paper`; sombre : `paper-dark`, noir chaud) : fond de page. C'est aussi la couleur du texte posé sur le rouge et sur l'encre (boutons pleins, lignes inversées).
- **Encre** (`ink`; sombre : `ink-dark`) : texte, filets épais (`--color-rule`), fond des lignes inversées (`--color-invert-bg`), bord du diagramme (`--color-board-edge`), bouton plein.
- **Encre atténuée** (`ink-muted`; sombre : `ink-muted-dark`) : années, ligne d'en-tête de partie, coup clé, légende, libellés PGN, coordonnées du diagramme, périodes du parcours.
- **Filet doux** (`rule-soft`; sombre : `rule-soft-dark`) : filets de 1 px entre les coups et entre les lignes de tableau.
- **Case claire / case sombre** (`square-light`, `square-dark`; sombre : `square-light-dark`, `square-dark-dark`) : cases du diagramme. Gris pierre en clair. En sombre, la planche reste imprimée et tonale (`#e6e3dc` / `#b3afa5`), les pièces gardent leur dessin d'origine.

### Named Rules

**The Commentator's Red Rule.** Le rouge est réservé par principe au jugement et à l'état : symboles d'évaluation, marqueur de trait ou de disponibilité, page courante, case allumée, focus, sélection. Jamais sur un bouton, jamais en fond de survol, jamais pour décorer. Le test : si l'élément rouge ne note, ne signale ou ne localise rien, il passe en encre.

**The Printed Negative Rule.** Le thème sombre est le même livre imprimé en négatif : les jetons s'échangent, la composition ne bouge pas. Il suit `prefers-color-scheme`, et `[data-theme]` peut le forcer. Le diagramme reste une planche tonale claire, jamais inversée.

## Typography

**Display Font:** Archivo, variable (`wdth` 62–125, `wght` 100–900), auto-hébergée depuis `@fontsource-variable/archivo` 5.2.6, sous-ensemble latin, licence OFL (repli : Helvetica Neue, Arial, sans-serif)
**Body Font:** Archivo, même fichier, chasse normale (100 %)

**Character:** Une grotesque de livre technique. Étroite et très grasse (`font-stretch: 72%`, 800), elle donne le nom et les titres de partie. En chasse normale, elle se lit pour le récit. Les chiffres sont tabulaires (`font-variant-numeric: tabular-nums` sur `body`), comme une notation imprimée.

### Hierarchy

- **Display** (800, 72 %, `clamp(3.5rem, 2rem + 6vw, 6rem)`, interligne 0.92, approche −0.02em) : le nom, sur l'accueil uniquement.
- **Headline** (800, 72 %, `clamp(2.5rem, 1.6rem + 3.6vw, 4.5rem)`, interligne 0.98, −0.02em, 18ch max) : titre d'une page projet, mode lecture.
- **Section title** (800, 72 %, `--text-2xl`, interligne 1.1) : titres de section en tête de grille (« Parcours »).
- **Lead** (400, `--text-xl` 22 → 28 px, interligne 1.3, 34–40ch) : pitch de l'accueil, résumé d'un projet.
- **Title** (700, `--text-lg` 22 px, interligne 1.3) : titre d'un coup dans la liste, intertitres du récit, ligne du coup clé (600).
- **Body** (400, `--text-base` 18 px, interligne 1.55, mesure `--measure` 68ch) : texte courant.
- **Label** (700, `--text-sm` 15 px) : en-tête de liste (« Trois parties choisies »), en-têtes de tableau, notation (`1.e4`), titre du bandeau de disponibilité. La navigation utilise la même taille en 400, et 600 pour la page courante.
- **Meta** (400, `--text-xs` 13 px) : légende des symboles, libellés PGN, coordonnées du diagramme.
- **Eval** (800, 72 %, `--text-2xl`, interligne 1, rouge) : le symbole d'évaluation dans la marge. En légende, il descend à `--text-sm`.

### Named Rules

**The One Family, Two Widths Rule.** Une seule famille, Archivo. Le contraste vient de la chasse et de la graisse (72 %/800 contre 100 %/400), jamais d'une seconde police. Rien ne passe en capitales espacées.

**The Typesetter's Rule.** Le français est composé à la française : espace fine insécable (U+202F) avant `:` et `;`, tirets demi-cadratin dans les périodes (`2022 – 2025`), `text-wrap: balance` sur les titres et `pretty` sur les paragraphes.

## Layout

Une page de livre centrée : conteneur de `--page-max` (80rem), gouttière fluide `--gutter` (`clamp(1rem, 0.5rem + 2.5vw, 4.5rem)`), mesure de lecture `--measure` (68ch). L'espacement suit une base de 4 px (`--space-1` à `--space-9` : 4, 8, 12, 16, 24, 32, 48, 64, 96 px). Les sections respirent en `--space-8` / `--space-9` sur l'axe vertical.

- **Accueil (ouverture).** Deux colonnes : texte `minmax(0, 1fr)`, diagramme `minmax(18rem, 30rem)`, écart `--space-7` / `--space-8`. Le diagramme est collant (`top: --space-6`). Dessous, le nom, la ligne d'en-tête de partie sur filet de 2 px, le pitch, les deux actions côte à côte, puis la liste des coups.
- **Liste des coups.** Grille à trois colonnes : année + notation (4.5rem), titre + coup clé, symbole d'évaluation aligné à droite (2.5rem), sur ligne de base commune.
- **Page projet (lecture).** Lien retour, titre, résumé. Un en-tête PGN de quatre colonnes entre un filet épais et un filet fin. Puis le récit commenté : une colonne de symboles en marge (3rem), puis le texte à la mesure.
- **Responsive.** Sous `56rem`, l'accueil passe à une colonne dans cet ordre : nom, pitch et actions, puis le diagramme réduit (22rem max), puis les coups. Le tableau du parcours s'empile : la période à gauche (8.5rem), le rôle à droite, le lieu sous le rôle en encre atténuée. Sous `40rem`, l'en-tête PGN passe à deux colonnes et la marge des symboles à 1.75rem.

### Named Rules

**The Rule-Line Rule.** Un filet épais de 2 px (`--rule-heavy`, encre) ouvre chaque partie : sous la barre de navigation, sous le nom, sous un en-tête de liste ou de tableau, au-dessus d'une section et du pied de page. Un filet de 1 px en `rule-soft` sépare les coups et les lignes. La structure se lit par ces filets, pas par des boîtes.

## Elevation & Depth

Le système est plat, comme une page imprimée. Aucune ombre portée, aucun flou, aucune superposition de surfaces. La profondeur vient des filets et d'un seul effet d'état, l'inversion : la ligne survolée passe en encre pleine, son texte en papier. La seule ombre du code est un `box-shadow: inset 0 0 0 4px` rouge qui allume une case du diagramme au survol. C'est un liseré de marquage, pas une élévation.

### Named Rules

**The Flat Page Rule.** Rien ne flotte au-dessus du papier. Pour signaler un état, on inverse ou on souligne, on ne soulève pas.

## Shapes

Toutes les formes sont des angles droits (`--radius: 0`). Les boutons, les puces de stack, le diagramme et le carré du trait sont des rectangles nets. Les bordures sont des filets d'encre de 1 ou 2 px. Les liens sont soulignés à 1 px (décalage 0.2em) et passent à 2 px au survol.

### Named Rules

**The Zero Radius Rule.** Aucun rayon, nulle part. Un coin arrondi sortirait la page du livre.

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
- **States :** au survol, soulignement de 2 px. La page courante (`aria-current="page"`) est rouge, en 600, soulignée à 2 px avec un décalage de 0.35em.
- **Mobile :** la liste passe à la ligne sous le nom, sans menu ni JavaScript.

### Liste des coups (signature)

Chaque projet mis en avant est un coup numéroté. La colonne de gauche donne l'année en encre atténuée et la notation en 700 (`1.e4`). Au centre, le titre en Title et le coup clé en encre atténuée (« Coup clé : … »). À droite, le symbole d'évaluation en rouge. Toute la ligne est un lien. Au survol ou au focus, elle s'inverse (`--color-invert-bg` / `--color-invert-ink`), le texte atténué hérite de la couleur et le symbole passe en `mark-on-invert`. Avec `:has()`, la case du diagramme qui correspond au coup s'allume d'un liseré rouge de 4 px. Une légende en Meta explique les symboles utilisés (`!` coup clé, `!?` pari réfléchi). Leur sens définitif est fixé en F06.

### Diagramme et bandeau de disponibilité

Le diagramme est une planche imprimée de 30rem max (22rem sur mobile) : bord d'encre de 2 px, cases en gris pierre, coordonnées en Meta atténuée, pièces cburnett en SVG (lichess-org/lila, triple licence GPL/BSD/GFDL). Sa légende est le bandeau de disponibilité : un filet fin au-dessus, un carré plein rouge de 0.75rem (le trait), le statut en 700 (« Disponible pour un stage »), puis la date et le lieu. Le contenu du bandeau vient des données de campagne.

### Tableau du parcours

Il se lit comme une grille de tournoi. En-têtes en Label sur filet de 2 px, lignes séparées par des filets doux, période en `--text-sm` atténuée, sans retour à la ligne. Sur mobile, il s'empile (voir Layout).

### En-tête PGN et récit commenté (page projet)

Les métadonnées forment une liste de définitions sur quatre colonnes : libellé en Meta atténuée, valeur en 600. Dans le récit, les intertitres sont en Title. Le symbole d'évaluation se place dans la colonne de marge, au niveau de l'intertitre qu'il note. Le coup clé est isolé entre deux filets fins, en `--text-lg` 600.

### États à construire en F04 (non livrés)

Ces deux états découlent du monde construit mais n'existent pas encore.

- **Image de partage par défaut (Open Graph), à construire en F04.** Format 1200 × 630, fond papier, composition de l'ouverture : le nom en Display (800, 72 %), un filet d'encre de 2 px, la ligne d'en-tête de partie en encre atténuée, puis le pitch en Lead (c'est le texte prévu par `CONTENU.md` §3). Un seul élément rouge au plus, un symbole d'évaluation ou le carré du trait. Le diagramme est facultatif, à droite, en planche gris pierre. Pas de rayon, pas d'ombre. Une version par langue si le pitch diffère.
- **Favicon, à construire en F04.** SVG carré, angles droits, le symbole `!` en rouge du commentateur, dessiné en Archivo 800 à 72 % et vectorisé (aucune police chargée), sur fond papier. Il s'adapte au thème par `prefers-color-scheme` dans le SVG (fond `paper-dark`, rouge `mark-dark`).

## Do's and Don'ts

### Do:

- **Do** réserver le rouge (`mark`) aux symboles d'évaluation, au trait et à la disponibilité, à la page courante, à la case allumée, au focus et à la sélection.
- **Do** inverser la ligne au survol (encre pleine, texte papier) et passer alors le symbole en `mark-on-invert`.
- **Do** ouvrir chaque partie par un filet de 2 px et séparer les lignes par un filet de 1 px en `rule-soft`.
- **Do** composer l'affichage en Archivo 800 à 72 % de chasse et le texte en Archivo à 100 %, chiffres tabulaires.
- **Do** placer une espace fine insécable (U+202F) avant `:` et `;` en français.
- **Do** garder le diagramme en planche tonale dans le thème sombre (`#e6e3dc` / `#b3afa5`).
- **Do** prendre chaque valeur dans les jetons de `src/styles/global.css` (constitution, principe VIII).

### Don't:

- **Don't** mettre du rouge sur un bouton ou en fond de survol.
- **Don't** arrondir un coin : le rayon vaut 0 partout.
- **Don't** ajouter d'ombre portée ni de surface flottante. La seule ombre admise est le liseré intérieur de la case allumée.
- **Don't** introduire une seconde famille de caractères ni des capitales espacées.
- **Don't** composer un hero centré suivi d'une rangée de cartes projets.
- **Don't** inverser les couleurs du diagramme en sombre ni le peindre aux couleurs d'un échiquier d'écran.

## Références

Le monde vient de l'imprimé, pas du web.

- **Chess Informator** (Šahovski informator) : symboles d'évaluation, diagrammes, notation compacte. C'est la référence du monde.
- **Les livres de parties commentées**, par exemple _Mes 60 meilleures parties_ de Bobby Fischer : une partie par chapitre, le récit autour du coup critique, les en-têtes de partie.
- **lichess.org** : référence de qualité d'exécution seulement, pour la netteté du diagramme et le jeu de pièces cburnett, repris tel quel.

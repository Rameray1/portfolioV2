---
version: 1
slug: "impeccable-prototype-index-html"
primary_target: ".impeccable/prototype/index.html"
related_targets: []
---

# Accueil (prototype de direction)

Scope : premier écran et section suivante de l'accueil `/`, plus un fragment de page projet, construits en prototype jetable hors `src/` pour fixer la direction visuelle du site entier. Visitor mode : **Persuade** (accueil). Les pages projet et blog sont en mode Read et héritent du monde.

- Audience : recruteur anglophone (tri en 60 s, souvent sur mobile), lead technique (ouvre un projet).
- Action : télécharger le CV, écrire un email (les deux appels à l'action de la campagne).
- Preuve : chaque projet affiché porte son coup clé (le choix fait) et mène à sa page.
- Contraintes : statique, zéro JS, FR/EN, clair + sombre selon le système, AA, < 200 ko.
- Contenu de démonstration : projets d'exemple marqués comme tels ; aucun chiffre inventé.

## Direction contract

THESIS: Le portfolio est un livre de parties commentées : chaque projet est une partie, racontée par son coup critique (le problème) et le choix fait, annoté d'un symbole d'évaluation. Il refuse le hero centré + rangée de cartes projets du portfolio dev.

OWN-WORLD: Page de livre d'échecs : fond blanc pur, encre presque noire, un seul rouge de commentateur (#c8102e) réservé aux symboles d'évaluation, au trait et à la page courante. Diagramme d'échiquier à cases gris pierre, filets de 2 px sous les en-têtes de partie, filets fins entre coups. Une seule famille grotesque à axe de chasse (étroite pour le nom, normale pour le texte), chiffres tabulaires. Thème sombre : même livre imprimé en négatif, encre claire sur noir chaud.

STORY: En 60 s le recruteur lit qui (nom), quoi (pitch : rôle, stack, preuve), son statut (disponible, sous le diagramme) et agit (CV, email). Le lead technique voit trois parties notées par leur coup clé et en ouvre une.

FIRST VIEWPORT: Barre de nav sur filet de 2 px (nom à gauche, rubriques + EN à droite). Colonne gauche : nom en très grand (~100 px desktop), ligne d'en-tête de partie dessous (Astrée Software · IMT Mines Alès), pitch ~28 px, CV (plein, encre) et email (contour) côte à côte, puis trois coups : année · projet · coup clé · symbole rouge. Colonne droite (~520 px) : diagramme d'échiquier, légende = bandeau de disponibilité. Mobile : diagramme réduit sous les actions.

FORM: Chess Informator / livres de parties commentées, candidat 1 de ma liste ordonnée (IMPECCABLE'S PICK). seed:775e8f61f3840c38. Signature : le symbole d'évaluation rouge qui note le coup clé ; au survol d'un coup, sa ligne s'inverse et la case correspondante s'allume sur le diagramme (CSS seul).

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Unresolved
- Position exacte du diagramme et sens des symboles (!, !?, ±) à fixer dans le modèle de contenu (F06).

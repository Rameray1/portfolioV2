---
title: '[provisoire] Ce portfolio, écrit avec Claude et Spec Kit'
year: 2026
summary: '[provisoire] Un site statique Astro en français et en anglais, écrit avec Claude Code et cadré par Spec Kit, feature par feature.'
keyMove: '[provisoire] Ne laisser Claude écrire le code qu’après une spécification et un plan que j’ai relus, avec Spec Kit.'
tech:
  - Astro
  - TypeScript
  - Claude Code
  - Spec Kit
eval: '!!'
links:
  code: https://github.com/Rameray1/portfolioV2
cover: ../../../assets/projects/sample-project.png
coverAlt: '[provisoire] Image d’exemple grise de 1600 par 900 pixels'
featured: true
move:
  from: c2
  to: c3
  notation:
    fr: 4.c3
    en: 4.c3
---

## Contexte

[provisoire] En 2026, je remplace mon ancien portfolio en Vue 3 par un site statique en Astro. J'en fais un banc d'essai : un code écrit en grande partie par Claude Code peut-il rester propre et lisible ?

## Le problème

[provisoire] Ajouter un projet demandait de modifier 3 composants Vue. Et sans cadre, Claude ajoute vite une abstraction ou une dépendance dont le site n'a pas besoin.

## Ce que j'ai fait

[provisoire] J'ai découpé le site en 12 features et confié chacune à Claude Code avec Spec Kit, en 4 étapes : spécification, plan, tâches, code. Une constitution de 9 principes, dont « site statique » et « zéro JavaScript client », est vérifiée à chaque plan. Je relis chacune des 4 étapes avant de lancer la suivante.

## Stack et pourquoi

[provisoire] Astro génère des pages HTML sans JavaScript client, et TypeScript valide chaque fiche au build. Spec Kit donne à Claude le même cadre à chaque feature : la décision est écrite avant la première ligne de code.

## Résultat

[provisoire] Ajouter un projet tient en 1 fichier Markdown, et l'accueil pèse moins de 200 ko. Lighthouse mobile donne 100 sur ses 4 notes pour l'accueil, la liste des projets et cette page.

## Ce que j'en ai appris

[provisoire] Avec Claude, la propreté du code se décide dans la spécification : une règle écrite 1 fois dans la constitution s'applique aux 12 features. Une spécification relue avant le code m'évite de reprendre une page 2 fois.

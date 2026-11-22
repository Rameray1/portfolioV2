---
title: 'Mon portfolio, écrit avec Claude et Spec Kit'
year: 2026
summary: 'Un site statique Astro en français et en anglais, écrit avec Claude Code et cadré par Spec Kit, feature par feature.'
keyMove: 'Ne laisser Claude écrire le code qu’après une spécification et un plan que j’ai relus, avec Spec Kit.'
tech:
  - Astro
  - Claude Code
  - Spec Kit
eval: '!!'
links:
  code: https://github.com/ramazankus/portfolioV2
cover: ../../../assets/projects/portfolio.png
coverAlt: 'Accueil du portfolio, avec le pitch et 3 projets à gauche, un diagramme d’échecs à droite'
featured: true
move:
  from: e1
  to: e7
  notation:
    fr: 16.Txe7+
    en: 16.Rxe7+
---

## Contexte

En 2026, je remplace mon ancien portfolio en Vue 3 par un site statique en Astro. J'en fais un banc d'essai. Un code écrit par Claude Code peut-il rester propre et lisible ?

## Le problème

Ajouter un projet demandait de modifier 3 composants Vue. Le design tenait dans 8 feuilles CSS, avec 27 couleurs écrites en dur et aucune variable.

## Ce que j'ai fait

J'ai découpé le site en 12 features de base et confié chacune à Claude Code avec Spec Kit, en 4 étapes. Je relis chacune des 4 étapes avant de lancer la suivante.

![Schéma des 4 étapes de Spec Kit avec le fichier produit par chacune, une relecture entre deux étapes, la constitution vérifiée au plan et la commande check après le code](../../../assets/projects/portfolio-workflow.png 'Les 4 étapes de Spec Kit, répétées pour chacune des 12 features. Chaque coche rouge est une relecture de ma part.')

> ! Une constitution de 9 principes, dont « simplicité d'abord » (KISS, YAGNI) et « qualité vérifiable », est vérifiée à chaque plan.

## Stack et pourquoi

Astro génère des pages HTML et refuse au build une fiche incomplète. Spec Kit donne à Claude le même cadre à chaque feature, avec une décision écrite avant la première ligne de code.

## Résultat

Ajouter un projet tient maintenant en 1 fichier Markdown, sans toucher à un composant Astro.

> 1 fichier Markdown par projet · 2 langues · 0 script exécuté dans le navigateur.

## Ce que j'en ai appris

Avec Claude, la propreté du code se décide dans la spécification. Une règle écrite 1 fois dans la constitution s'applique aux 12 features. Une spécification relue avant le code m'évite de réécrire une page après coup.

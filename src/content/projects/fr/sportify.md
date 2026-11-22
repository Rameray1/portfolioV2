---
title: 'Sportify, des pronostics sportifs et une boutique de points'
year: 2024
summary: 'Un site de pronostics sportifs écrit à 4 en PHP sans framework, pendant un projet libre de BUT informatique.'
keyMove: 'Valider chaque achat de la boutique sur le serveur, en 3 contrôles, avant de débiter les points.'
tech:
  - PHP
  - MySQL
  - JavaScript
  - Docker
eval: '!'
links:
  code: https://github.com/ramazankus/Sportify
  video: https://youtu.be/BZSuxtxUq40
cover: ../../../assets/projects/sportify.png
coverAlt: 'Page d’accueil de Sportify, avec un écusson vert à gauche et les boutons S’inscrire et Se connecter à droite'
featured: true
move:
  from: g5
  to: f6
  notation:
    fr: 16.Fxf6
    en: 16.Bxf6
---

## Contexte

De septembre 2023 à janvier 2024, en BUT informatique, nous réalisons à 4 un projet libre. Sportify est un site de pronostics sur des matchs, avec un fil d'actualité sportive. L'équipe écrit tout en PHP 8.2, sans framework, sur une base MySQL de 9 tables.

## Le problème

Un pronostic gagnant rapporte des points, les Sporticoins, selon la mise et la cote. Il fallait leur donner un usage, sans qu'un joueur achète 2 fois le même objet ni dépense des points qu'il n'a pas.

## Ce que j'ai fait

J'ai développé la boutique. Les badges, écussons et icônes de profil s'y achètent en Sporticoins et rejoignent l'inventaire du joueur. Le navigateur envoie l'achat en JSON et le contrôleur PHP fait 3 contrôles avant de répondre. L'objet existe, le joueur ne l'a pas déjà et son solde suffit.

J'ai aussi écrit le fil d'actualité en PHP et JavaScript, avec la publication de posts et les likes, et le panneau de profil affiché sur chaque page.

> ! Un objet acheté disparaît de la boutique du joueur, et un 2ᵉ achat du même objet est refusé par le serveur.

## Stack et pourquoi

PHP 8.2 sans framework est un choix d'équipe, pour écrire nous-mêmes le routeur, les contrôleurs et les DAO d'une architecture MVC. Docker Compose lance Apache, MySQL et phpMyAdmin avec 1 commande.

## Résultat

Le site est rendu en janvier 2024, avec 4 espaces (pronostics, actualité, boutique et administration). Une vidéo de démonstration est en lien sur cette page.

> 9 tables MySQL · 390 commits à 4 · 3 contrôles par achat.

## Ce que j'en ai appris

Écrire le MVC à la main en PHP m'a montré ce qu'un framework comme Symfony prend en charge, du routage à l'accès aux données. J'ai aussi appris à travailler à 4 sur le même dépôt Git pendant 4 mois.

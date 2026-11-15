---
title: 'Meetz, des événements à rejoindre sur une carte'
year: 2026
summary: 'Une plateforme pour créer des événements et s’y inscrire, développée à 4 en 1ʳᵉ année à IMT Mines Alès avec Angular, Express et Prisma.'
keyMove: 'Géocoder les adresses dans le navigateur avec Nominatim et garder le résultat en cache, sans modifier le modèle de données.'
tech:
  - Angular
  - TypeScript
  - Express
  - Prisma
  - MariaDB
  - Socket.IO
  - Leaflet
  - Docker
eval: '!?'
links:
  code: https://github.com/Meetz-IMTA/Meetz
cover: ../../../assets/projects/meetz.png
coverAlt: 'Vue carte de Meetz, avec 8 marqueurs d’événements sur une carte de France et les filtres par catégorie et par distance à gauche'
featured: true
move:
  from: c3
  to: d5
  notation:
    fr: 16.Cd5
    en: 16.Nd5
---

## Contexte

D'avril à juin 2026, en 1ʳᵉ année d'école d'ingénieurs à IMT Mines Alès, nous développons Meetz à 4. C'est une plateforme pour créer des événements et s'y inscrire, avec un fil communautaire et une messagerie en temps réel par Socket.IO. Je prends en charge les événements, de la table Prisma à l'écran Angular.

## Le problème

Un événement enregistre son lieu comme une adresse en texte. Pour l'afficher sur une carte Leaflet et filtrer par distance, il faut une latitude et une longitude.

## Ce que j'ai fait

J'ai écrit un service Angular qui interroge Nominatim, l'API de géocodage d'OpenStreetMap. Chaque adresse n'est demandée qu'1 fois, puis gardée en mémoire et dans le localStorage du navigateur. La liste filtre ensuite les événements dans un rayon de 5 à 100 km autour d'une ville, avec la formule de haversine.

J'ai aussi livré la création et la modification d'un événement, les événements privés et le rôle d'organisateur, qu'un organisateur peut donner à 5 amis au plus.

> ! Un événement privé n'est visible que par son organisateur et ses amis. Ce filtre est écrit dans la requête Prisma, pas dans l'écran Angular.

## Stack et pourquoi

Angular 21 et Express 5 partagent le même dépôt Turborepo, en TypeScript des deux côtés. Prisma 7 décrit les 17 modèles de la base MariaDB et génère les migrations. Docker Compose lance cette base MariaDB 11 en développement. Leaflet affiche les tuiles d'OpenStreetMap sans clé d'API.

## Résultat

Le projet se termine le 25 juin 2026 avec 152 commits. La liste des événements existe en 2 vues, en cartes et sur la carte Leaflet.

> Rayon de 5 à 100 km · 1 requête Nominatim par adresse · 17 modèles Prisma.

## Ce que j'en ai appris

Géocoder dans le navigateur m'a évité une migration Prisma. En échange, la première ouverture de la carte attend Nominatim pour chaque adresse absente du cache. Aujourd'hui j'enregistrerais la latitude et la longitude à la création de l'événement, où l'adresse est déjà choisie dans une liste Nominatim.

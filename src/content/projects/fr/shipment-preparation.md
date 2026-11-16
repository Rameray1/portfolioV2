---
title: 'Préparer une expédition d’usine en un clic'
year: 2026
summary: 'Une fonctionnalité d’Aquiweb, le logiciel de suivi de production d’Astrée Software, livrée en alternance pour un client de l’agroalimentaire, en Java, Spring et Angular.'
keyMove: 'Regrouper le déplacement de la palette, le mouvement de stock et son ajout à l’expédition dans 1 seule transaction.'
tech:
  - Java
  - Spring
  - Angular
  - SQL
  - GitLab
  - Jira
eval: '!'
---

## Contexte

Depuis août 2024, je suis développeur en alternance chez Astrée Software. L'entreprise édite Aquiweb, un MES (le logiciel qui suit en temps réel la production d'une usine), installé dans plus de 500 usines. Mon équipe compte 4 développeurs et 1 coach agile. Elle adapte Aquiweb à chaque client qui lui est confié, en sprints de 2 semaines suivis dans Jira.

## Le problème

Un client de l'agroalimentaire expédie ses produits sur palettes. Pour préparer une commande, l'opérateur trouve dans le stock une palette du bon produit et la déplace vers la zone d'expédition. Il passait pour cela par plusieurs écrans d'Aquiweb.

Le client demande 1 bouton sur l'écran de préparation. Il ouvre la liste des palettes qui conviennent, et un clic déplace la palette choisie.

Ce clic écrit dans le stock réel du client. Une erreur dans la liste y déplace une mauvaise palette.

## Ce que j'ai fait

J'ai développé la fonctionnalité en entier, du back-end au front-end. La requête SQL croise plusieurs tables et ne garde que les palettes qui ne contiennent que le produit commandé, qui ont du stock et qui ne sont pas déjà en préparation. J'ai ajouté ces 3 critères un par un, en vérifiant le résultat à chaque étape.

Le traitement Spring fait ensuite 3 écritures. Il déplace la palette, enregistre le mouvement de stock et ajoute la palette à l'expédition. Côté Angular, la fenêtre liste les palettes et l'écran de préparation se met à jour dès le déplacement terminé, sans rechargement.

> ! Ces 3 écritures passent dans 1 transaction. Soit tout est enregistré, soit rien, et une palette n'est jamais déplacée sans être ajoutée à l'expédition.

![Schéma du clic de l'opérateur, suivi des 3 écritures regroupées dans 1 transaction Spring, qui aboutit soit à un commit des 3 écritures, soit à un rollback qui n'en garde aucune](../../../assets/projects/shipment-transaction.png 'Le déplacement, le mouvement de stock et l’ajout à l’expédition passent dans 1 transaction. Noms de méthodes simplifiés.')

## Stack et pourquoi

Aquiweb 7 repose sur Java et Spring pour le back-end, et sur Angular pour le front-end. J'ai suivi ces choix du produit plutôt que d'en faire. Chaque ticket a sa branche GitLab et passe par une merge request relue par l'équipe avant d'être intégré.

## Résultat

La fonctionnalité a été livrée en recette, l'environnement de test où le client la valide avant la mise en production. J'ai vérifié avant la revue que 3 cas sont écartés de la liste, une palette avec plusieurs produits, une palette sans stock et une palette déjà en préparation.

> 1 clic au lieu de plusieurs écrans · 3 critères de sélection · 1 transaction.

## Ce que j'en ai appris

La transaction est le seul choix technique que j'ai comparé à une autre option, enchaîner les 3 écritures séparément. Pour le reste, j'ai gardé la première solution qui marchait. Pour mes prochaines stories, je cherche d'abord au moins 2 façons de les développer, et j'écris dans la merge request celle que je retiens et pourquoi.

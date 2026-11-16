---
title: 'Sportify, sports predictions and a points shop'
summary: 'A sports prediction site written by a team of 4 in PHP without a framework, as an open project during my computer science degree (BUT).'
keyMove: 'Validate every shop purchase on the server, with 3 checks, before taking the points.'
coverAlt: 'Sportify home page, with a green crest on the left and the sign-up and log-in buttons on the right'
---

## Context

From September 2023 to January 2024, during my computer science degree (BUT), 4 of us built an open project. Sportify is a site for predicting match results, with a sports news feed. The team wrote everything in PHP 8.2, without a framework, on a MySQL database of 9 tables.

## The problem

A winning prediction earns points, called Sporticoins, based on the stake and the odds. They needed a use, without letting a player buy the same item twice or spend points they do not have.

## What I did

I built the shop. Profile badges, crests and icons are bought with Sporticoins and go into the player's inventory. The browser sends the purchase as JSON and the PHP controller runs 3 checks before answering. The item exists, the player does not own it yet, and their balance is enough.

I also wrote the news feed in PHP and JavaScript, with posting and likes, and the profile panel shown on every page.

> ! A purchased item disappears from the player's shop, and a 2nd purchase of the same item is refused by the server.

## Stack and why

PHP 8.2 without a framework was a team choice, so that we would write the router, the controllers and the DAOs of an MVC architecture ourselves. Docker Compose starts Apache, MySQL and phpMyAdmin with 1 command.

## Outcome

The site was handed in in January 2024, with 4 areas (predictions, news, shop and administration). A demo video is linked on this page.

> 9 MySQL tables · 390 commits by 4 people · 3 checks per purchase.

## What I learned

Writing MVC by hand in PHP showed me what a framework like Symfony takes care of, from routing to data access. I also learned to work with 3 other people on the same Git repository for 4 months.

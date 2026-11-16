---
title: 'One-click shipment preparation for a factory'
summary: 'A feature of Aquiweb, the production-tracking software built by Astrée Software, shipped during my apprenticeship for a food-industry client, in Java, Spring and Angular.'
keyMove: 'Wrap the pallet move, the stock movement and its addition to the shipment in 1 single transaction.'
---

## Context

Since August 2024 I have been an apprentice developer at Astrée Software. The company builds Aquiweb, a MES (software that tracks a factory's production in real time) used in more than 500 factories. My team has 4 developers and 1 agile coach. We tailor Aquiweb to each client assigned to us, in 2-week sprints tracked in Jira.

## The problem

A food-industry client ships its products on pallets. To prepare an order, the operator finds a pallet of the right product in stock and moves it to the shipping area. That used to take several Aquiweb screens.

The client asked for 1 button on the preparation screen. It opens the list of suitable pallets, and one click moves the chosen pallet.

That click writes to the client's real stock. A mistake in the list moves the wrong pallet there.

## What I did

I built the whole feature, back end and front end. The SQL query joins several tables and keeps only pallets that hold nothing but the ordered product, have stock, and are not already being prepared. I added those 3 criteria one at a time, checking the result at each step.

The Spring service then makes 3 writes. It moves the pallet, records the stock movement and adds the pallet to the shipment. On the Angular side, the dialog lists the pallets and the preparation screen refreshes as soon as the move is done, with no reload.

> ! Those 3 writes run in 1 transaction. Either everything is saved or nothing is, so a pallet is never moved without being added to the shipment.

![Diagram of the operator's click, followed by the 3 writes grouped in 1 Spring transaction, ending either in a commit of all 3 writes or in a rollback that keeps none](../../../assets/projects/shipment-transaction.png 'The move, the stock movement and the addition to the shipment run in 1 transaction. Method names simplified.')

## Stack and why

Aquiweb 7 runs on Java and Spring for the back end and Angular for the front end. I worked within the product's stack rather than choosing one. Every ticket gets its own GitLab branch and goes through a merge request reviewed by the team before it is merged.

## Outcome

The feature shipped to staging, the test environment where the client validates it before production. Before review, I checked that 3 cases are kept out of the list: a pallet with several products, a pallet with no stock, and a pallet already being prepared.

> 1 click instead of several screens · 3 selection criteria · 1 transaction.

## What I learned

The transaction was the only technical choice I weighed against another option, chaining the 3 writes separately. For everything else, I kept the first solution that worked. For my next stories, I first look for at least 2 ways to build each one, and I write in the merge request which one I picked and why.

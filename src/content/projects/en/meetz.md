---
title: 'Meetz, events to join on a map'
summary: 'A platform to create events and sign up for them, built by a team of 4 in my 1st year at IMT Mines Alès with Angular, Express and Prisma.'
keyMove: 'Geocode addresses in the browser with Nominatim and cache the result, without changing the data model.'
coverAlt: 'Meetz map view, with 8 event markers on a map of France and the category and distance filters on the left'
---

## Context

From April to June 2026, in my 1st year of engineering school at IMT Mines Alès, 4 of us built Meetz. It is a platform to create events and sign up for them, with a community feed and real-time messaging over Socket.IO. I owned the events, from the Prisma table to the Angular screen.

## The problem

An event stores its location as a plain-text address. Showing it on a Leaflet map and filtering by distance takes a latitude and a longitude.

## What I did

I wrote an Angular service that queries Nominatim, the OpenStreetMap geocoding API. Each address is requested only once, then kept in memory and in the browser's localStorage. The list then filters events within 5 to 100 km of a city, using the haversine formula.

I also shipped event creation and editing, private events, and the organizer role, which an organizer can hand to 5 friends at most.

> ! A private event is visible only to its organizer and their friends. That filter lives in the Prisma query, not in the Angular screen.

## Stack and why

Angular 21 and Express 5 share one Turborepo repository, with TypeScript on both sides. Prisma 7 describes the 17 models of the MariaDB database and generates the migrations. Docker Compose starts that MariaDB 11 database in development. Leaflet displays OpenStreetMap tiles without an API key.

## Outcome

The project ended on 25 June 2026 with 152 commits. The event list comes in 2 views, as cards and on the Leaflet map.

> 5 to 100 km radius · 1 Nominatim request per address · 17 Prisma models.

## What I learned

Geocoding in the browser saved me a Prisma migration. In return, the first time the map opens it waits on Nominatim for every address missing from the cache. Today I would store the latitude and longitude when the event is created, where the address is already picked from a Nominatim list.

---
title: '[draft] This portfolio, written with Claude and Spec Kit'
summary: '[draft] A static Astro site in French and English, written with Claude Code inside a Spec Kit workflow, one feature at a time.'
keyMove: '[draft] Let Claude write code only after a specification and a plan I have reviewed, using Spec Kit.'
coverAlt: '[draft] Grey sample image, 1600 by 900 pixels'
---

## Context

[draft] In 2026, I am replacing my old Vue 3 portfolio with a static Astro site. I use it as a test bench: can code written mostly by Claude Code stay clean and readable?

## The problem

[draft] Adding a project meant editing 3 Vue components.

## What I did

[draft] I split the site into 12 features and gave each one to Claude Code through Spec Kit, in 4 steps: specification, plan, tasks, code. I review each of the 4 steps before starting the next.

> ! [draft] A constitution of 9 principles, including "static site" and "zero client JavaScript", is checked against every plan.

## Stack and why

[draft] Astro outputs HTML pages, and TypeScript validates every entry at build time. Spec Kit gives Claude the same frame for every feature: the decision is written down before the first line of code.

## Outcome

[draft] The home page, the project list and this page pass the Lighthouse mobile audit.

> [draft] 100 in all 4 Lighthouse categories · 1 Markdown file per project · a home page under 200 kB.

## What I learned

[draft] With Claude, clean code is decided in the specification: a rule written once in the constitution applies to all 12 features. A specification reviewed before the code saves me from redoing a page twice.

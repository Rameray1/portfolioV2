---
title: 'This portfolio, written with Claude and Spec Kit'
summary: 'A static Astro site in French and English, written with Claude Code inside a Spec Kit workflow, one feature at a time.'
keyMove: 'Let Claude write code only after a specification and a plan I have reviewed, using Spec Kit.'
coverAlt: 'Home page of the portfolio, with the pitch and 3 projects on the left, a chess diagram on the right'
---

## Context

In 2026, I am replacing my old Vue 3 portfolio with a static Astro site. I use it as a test bench. Can code written by Claude Code stay clean and readable?

## The problem

Adding a project meant editing 3 Vue components. The design lived in 8 CSS files, with 27 hard-coded colours and no variables.

## What I did

I split the site into 12 base features and gave each one to Claude Code through Spec Kit, in 4 steps. I review each of the 4 steps before starting the next.

![Diagram of the 4 Spec Kit steps with the file each one produces, a review between two steps, the constitution checked at the plan, and the check and build commands after the code](../../../assets/projects/portfolio-workflow.png 'The 4 Spec Kit steps, repeated for each of the 12 features. Every red tick is a review of mine.')

> ! A constitution of 9 principles, including "simplicity first" (KISS, YAGNI) and "verifiable quality", is checked against every plan.

## Stack and why

Astro outputs HTML pages and rejects an incomplete entry at build time. Spec Kit gives Claude the same frame for every feature, with the decision written down before the first line of code.

## Outcome

Adding a project now takes 1 Markdown file, without touching an Astro component.

> 1 Markdown file per project · 2 languages · 0 scripts run in the browser.

## What I learned

With Claude, clean code is decided in the specification. A rule written once in the constitution applies to all 12 features. A specification reviewed before the code saves me from redoing a page twice.

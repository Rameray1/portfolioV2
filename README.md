# Portfolio V2

[![CI](https://github.com/Rameray1/portfolioV2/actions/workflows/ci.yml/badge.svg)](https://github.com/Rameray1/portfolioV2/actions/workflows/ci.yml)

The source of my personal website. I'm a software engineering student at IMT Mines Alès,
currently building Java/Spring and Angular applications at Astrée Software.

> 🚧 **Work in progress**: the site is being rebuilt from scratch, one feature at a time.
> Progress is tracked in [`ROADMAP.md`](./ROADMAP.md).

<!-- TODO at launch: live site link + screenshot -->

## How it's built

- **Static, zero client-side JavaScript by default.** Every page is generated at build time
  with [Astro](https://astro.build); there is no server.
- **Content is data.** Projects, experience and skills live as typed files in `src/content/`
  and `src/data/`. Adding a project means adding one Markdown file, not writing code.
- **Bilingual.** French by default, English under `/en`, with the same paths.
- **Spec-driven.** Each feature starts as a spec, a plan and a task list written with
  [spec-kit](https://github.com/github/spec-kit), kept in [`specs/`](./specs).
- **A testbed for working well with AI.** I use this project to practise AI-assisted
  development with a coding agent, kept on a short leash: spec-kit turns each feature into a
  reviewed spec before any code exists, a [constitution](./.specify/memory/constitution.md)
  sets rules the agent cannot override, and every change goes through a draft PR that I
  review and merge myself.
- **Guarded by CI.** Every pull request and every push to `main` runs formatting, type checks
  (`astro check`) and a production build on GitHub Actions.
- **Kept simple.** KISS and YAGNI: nothing gets built "just in case".

## Run it locally

Requires Node 22 (see [`.nvmrc`](./.nvmrc)).

```sh
git clone git@github.com:Rameray1/portfolioV2.git
cd portfolioV2
npm install
npm run dev       # http://localhost:4321
```

## Learn more

- [`CONTRIBUTING.md`](./CONTRIBUTING.md): commands, CI, workflow and conventions (in French).
- [`CONTENU.md`](./CONTENU.md): goals, audiences and content model (in French).
- [`DESIGN.md`](./DESIGN.md): visual direction.

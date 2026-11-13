# Specification Quality Checklist: Projets

**Purpose**: Validate specification completeness and quality before proceeding to planning
**Created**: 2026-11-12
**Feature**: [spec.md](../spec.md)

## Content Quality

- [x] No implementation details (languages, frameworks, APIs)
- [x] Focused on user value and business needs
- [x] Written for non-technical stakeholders
- [x] All mandatory sections completed

## Requirement Completeness

- [x] No [NEEDS CLARIFICATION] markers remain
- [x] Requirements are testable and unambiguous
- [x] Success criteria are measurable
- [x] Success criteria are technology-agnostic (no implementation details)
- [x] All acceptance scenarios are defined
- [x] Edge cases are identified
- [x] Scope is clearly bounded
- [x] Dependencies and assumptions identified

## Feature Readiness

- [x] All functional requirements have clear acceptance criteria
- [x] User scenarios cover primary flows
- [x] Feature meets measurable outcomes defined in Success Criteria
- [x] No implementation details leak into specification

## Notes

- Deux points tranchés avec le mainteneur avant rédaction (voir Clarifications) : le coup clé
  devient un champ par langue, et les symboles gardent le sens de `DESIGN.md`.
- Noms de champs, fichiers et composants sont laissés au plan ; la spec ne cite que des
  chemins d'URL et des documents du dépôt.
- À aligner au plan : `CONTENU.md` §6 (coup clé, symbole, coup) et la phrase de `DESIGN.md`
  « Leur sens définitif est fixé en F06 ».
- Tranché en `/speckit-clarify` (2026-11-12) : récit libre, `!!` en bleu dès F06, place du
  visuel, page de repli non indexable, ordre de l'accueil.
- Choix par défaut restant (Assumptions) : pas de lien « tous les projets » sur l'accueil.

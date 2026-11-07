# Quickstart: validating F01

Prerequisites: Node 22 (`nvm use`), the branch `001-repo-guardrails` pushed to GitHub.

## 1. Local commands (User Story 1)

```sh
npm ci
npm run check     # expected: exit 0, "0 errors"
npm run build     # expected: exit 0, dist/ generated
```

Inject a formatting error (e.g. add `const   a=1` badly indented in a `.ts` file, or break the
indentation of `src/pages/index.astro`):

```sh
npm run check     # expected: non-zero, "[warn] <file>"
npm run format    # expected: file rewritten
npm run check     # expected: exit 0
```

Inject a type error (e.g. `const n: number = 'x';` in the frontmatter of `index.astro`):

```sh
npm run check     # expected: non-zero, "<file>:<line>:<col> - error ts(2322)"
```

Revert the change. Measure `time npm run check`: under 30 s (SC-003).

## 2. CI (User Story 2)

1. Push the branch, open a PR to `main`: the `CI / check-and-build` check turns green in < 5 min
   (SC-004).
2. Push a commit with a formatting error → red. Fix it → green.
3. Push a commit with a type error → red. Revert.
4. Push a commit that breaks only the build (e.g. `throw new Error('boom');` in the frontmatter
   of `index.astro`, which type-checks fine) → red although `check` passes. Revert (SC-002).

## 3. README (User Story 3)

In a fresh clone, follow only `README.md`: install, `npm run dev`, open the site, run
`npm run check`. Everything works without another document (SC-005).

Contracts: [commands](./contracts/commands.md) · [CI](./contracts/ci.md).

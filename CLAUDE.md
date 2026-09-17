# @lc-studios-mc/scripting-utils

A collection of small utilities for Minecraft Bedrock scripting with
`@minecraft/server` API.

## Commands

- `bun install`: install dependencies
- `bun test`: run tests
- `bun run typecheck`: run tsc with no emit
- `bunx prettier --write <path>`: format specific file(s) — preferred over
  `--write .`.

## Tech Stack

- Runtime: Bun
- Source (`src/`): JavaScript + JSDoc types
- Tests (`tests/`): TypeScript
- Formatting: Prettier

## Key convention: JS in src, TS in tests

- `src/**`: plain `.js`, strictly typed via JSDoc. Do not rewrite these as
  `.ts`.
- `tests/**`: `.ts` with native types.

This split is intentional, not a migration in progress. Match whichever
convention the file you're editing already uses.

## Code Style

- JSDoc required on all exported functions in `src/`.
- Format touched files before commiting.

## Notes

- Bun only — no `node` or `npm` commands.

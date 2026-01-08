# Bun script best practices (CLI-focused)

This repository ships a TypeScript CLI (`chatline`). We leverage Bun
for local development convenience and faster tooling, while retaining Node +
Vitest for testing and release stability.

## Goals

- Keep publishing/consumption standard: `bin` points to `dist/cli.js`.
- Use Bun for local dev (run TS directly) and for tooling.
- Keep tests on Vitest to match CI and avoid environment drift.
- Bun for local development, pnpm for CI stability.

## What changed

- Dev runs the CLI straight from TypeScript via Bun: `bun dev` →
  `bun src/cli.ts`.
- Linting and formatting use Biome (replaced ESLint/Prettier).
- Tests run on Vitest (`bun test`).

## Scripts (authoritative)

- build: `bun run build` (tsc)
- dev: `bun dev` (runs src/cli.ts directly)
- check: `biome check --write .` (lint + format)
- lint: `biome lint .`
- lint:fix: `biome lint --write .`
- format: `biome format --write .`
- typecheck: `bun typecheck`
- test: `bun test` (vitest)

Notes:

- `bin` remains `./dist/cli.js` for published usage. Dev uses Bun to avoid a
  build step when iterating locally.
- `tsconfig.json` stays strict for production builds. `tsconfig.eslint.json`
  powers fast no-emit type checking for lint/type safety (tests excluded).

## CLI development vs. publish

- Development:
  - Run: `bun dev -- --help` (args after `--` are forwarded to the CLI)
  - Build: `bun run build` → emits `dist/**`
  - Local dist run: `bun cli -- --help`
- Publish consumers:
  - Use the installed command `chatline` (resolves to `dist/cli.js`).

## Testing and CI

- Use Vitest:
  - Local: `bun test`, `bun test:watch`
  - CI: `bun test:ci` with JUnit/coverage reporters
- Coverage uses V8 with configured thresholds.

## Rationale

- Bun offers very fast startup and excellent TypeScript support for dev loops.
- Keeping tests on Vitest ensures CI consistency.
- Biome replaces ESLint + Prettier with a single, fast tool.

## Tips

- Forward CLI args in dev with `--`, e.g.:
  - `bun dev -- --config examples/imessage-config.yaml`
- If you don't have Bun installed locally, install it from https://bun.sh.

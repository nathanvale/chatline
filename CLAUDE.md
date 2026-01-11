# Chatline - iMessage Timeline

Extract, enrich, and render iMessage conversations into AI-powered markdown timelines.

**Package:** `@nathanvale/chatline` | **Version:** 0.3.1 | **Stack:** TypeScript, Bun, Biome, Vitest

---

## Directory Structure

```
chatline/
├── src/
│   ├── cli/              # CLI framework and commands
│   │   └── commands/     # Individual CLI commands
│   ├── config/           # Configuration schema and loaders
│   ├── enrich/           # AI enrichment (98 symbols) ← hotspot
│   │   └── providers/    # Link enrichment providers
│   ├── ingest/           # CSV/DB ingestion (42 symbols)
│   ├── normalize/        # Date conversion, validation
│   ├── normalize-link/   # Merge and dedup pipeline
│   ├── render/           # Markdown rendering (53 symbols)
│   ├── schema/           # Zod schemas (message.ts)
│   ├── utils/            # Shared utilities (52 symbols)
│   └── progress/         # Progress tracking
├── tests/helpers/        # Test utilities (81 symbols)
├── __tests__/fixtures/   # Shared test fixtures
├── .claude/rules/        # Path-scoped Claude rules
├── .github/
│   ├── workflows/        # 19 CI/CD workflows
│   ├── actions/          # Reusable composite actions
│   └── scripts/          # CI helper scripts
├── docs/                 # Architecture and guides
├── website/              # Docusaurus site
└── scripts/              # Build and validation
```

**Codebase Stats:** 110 files, 526 symbols (294 functions, 120 types, 11 classes)

---

## Key Commands

```bash
# Development
bun install              # Install dependencies
bun dev -- --help        # Run CLI in dev mode
bun build                # Build TypeScript to dist/

# Quality
bun run check            # Biome lint + format (write mode)
bun typecheck            # TypeScript type checking
bun run validate         # Full quality check (lint + types + build + test)

# Testing
bun test                 # Run all tests
bun test --coverage      # With coverage report
bun test src/enrich      # Specific directory

# CLI (after build)
bun cli doctor           # System diagnostics
bun cli init             # Generate config file
bun cli ingest-csv       # Import from iMazing CSV
bun cli ingest-db        # Import from Messages.app DB
bun cli normalize-link   # Merge and deduplicate
bun cli enrich-ai        # AI enrichment
bun cli render-markdown  # Generate timeline

# Releases
bun version:gen          # Create changeset
```

---

## Tech Stack

| Category | Tools |
|----------|-------|
| Language | TypeScript 5.9+ (strict), ESM only |
| Runtime | Node.js 24+, Bun for dev |
| Quality | Biome 2.3+ (80-char, tabs, single quotes) |
| Testing | Vitest 4+ (70%+ coverage) |
| Hooks | Husky (commit-msg, pre-commit, pre-push) |

**Path Aliases:** `#enrich/*`, `#ingest/*`, `#normalize/*`, `#render/*`, `#schema/*`, `#utils/*`

**Key Dependencies:** `@google/generative-ai`, `sharp`, `better-sqlite3`, `zod`, `commander`, `pino`

---

## Code Conventions

| Area | Convention |
|------|------------|
| Files | kebab-case (`date-converters.ts`) |
| Functions | camelCase (`ingestCSV`) |
| Types | PascalCase (`Message`, `Config`) |
| Exports | Named only (no defaults except CLI) |
| Imports | Path aliases required (`#enrich/*`) |

**Philosophy:** Functional, immutable, type-safe with Zod at boundaries

---

## Architecture

**4-Stage Pipeline:** Ingest → Normalize → Enrich → Render

```
CSV/DB → Parse & normalize → Merge & dedupe → AI enrichment → Markdown
         (Apple epoch→ISO)   (GUID+content)   (resumable)    (deterministic)
```

**Design Principles:**
- **Deterministic** — Same input → same output
- **Idempotent** — Safe to re-run operations
- **Resumable** — Checkpoint support for crash recovery
- **Incremental** — Delta detection, process only new data

---

## Special Rules

### NEVER

1. **NEVER modify src/legacy/** — Deprecated, being phased out
2. **NEVER skip validation** — Run `bun run validate` before pushing
3. **NEVER create nested biome.json** — Single root config only

### ALWAYS

1. **ALWAYS run `bun run validate`** before pushing
2. **ALWAYS create changesets** for user-facing changes
3. **ALWAYS use path aliases** (`#enrich/*` not `../../enrich`)
4. **ALWAYS preserve determinism** — No randomization in rendering

> **Path-scoped rules:** See `.claude/rules/` for detailed rules by file type

---

## Configuration

**File:** `imessage-config.yaml` — Create with `bun cli init`

**Environment Variables:**
- `GEMINI_API_KEY` — Required for AI enrichment
- `FIRECRAWL_API_KEY` — Optional for link enrichment

---

## Key Files

| File | Purpose |
|------|---------|
| `src/cli.ts` | CLI entry point |
| `src/schema/message.ts` | Core message schema (Zod) |
| `src/config/schema.ts` | Config schema |
| `biome.json` | Linting/formatting rules |

---

## External Documentation

| Topic | Location |
|-------|----------|
| CI/CD | [CI.md](CI.md) |
| Testing | [TESTING.md](TESTING.md) |
| Releases | [RELEASES.md](RELEASES.md) |
| Full docs | https://nathanvale.github.io/chatline/ |

---

## Quick Reference

**Before pushing:** `bun run validate`
**Create changeset:** `bun version:gen`
**Run specific test:** `bun test src/enrich`
**Check types:** `bun typecheck`

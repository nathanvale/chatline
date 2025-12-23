# Chatline - iMessage Timeline Project

**Extract, enrich, and render your iMessage conversations into beautiful, AI-powered markdown timelines.**

---

## Project Overview

**Name:** @nathanvale/chatline
**Type:** CLI Tool + Library Package
**Version:** 0.0.1
**Tech Stack:** TypeScript, Node.js 24+, Bun, Biome, Vitest

This is a sophisticated data pipeline that transforms iMessage conversations into searchable, enriched markdown timelines with AI-powered analysis.

---

## Directory Structure

```
chatline/
├── src/
│   ├── cli/              # CLI commands and entry points
│   │   ├── commands/     # Individual command implementations
│   │   └── index.ts      # CLI setup and routing
│   ├── config/           # Configuration schema and loaders
│   ├── enrich/           # AI enrichment (98 symbols)
│   │   ├── providers/    # Link enrichment providers
│   │   ├── audio-transcription.ts
│   │   ├── image-analysis.ts
│   │   ├── checkpoint.ts
│   │   └── idempotency.ts
│   ├── ingest/           # CSV/DB ingestion (42 symbols)
│   │   ├── ingest-csv.ts
│   │   ├── ingest-db.ts
│   │   ├── dedup-merge.ts
│   │   └── link-replies-and-tapbacks.ts
│   ├── normalize/        # Data normalization
│   │   ├── date-converters.ts
│   │   └── validate-normalized.ts
│   ├── render/           # Markdown rendering (53 symbols)
│   │   ├── grouping.ts
│   │   ├── reply-rendering.ts
│   │   └── embeds-blockquotes.ts
│   ├── schema/           # Zod schemas
│   ├── utils/            # Shared utilities (52 symbols)
│   │   ├── logger.ts
│   │   ├── delta-detection.ts
│   │   ├── enrichment-merge.ts
│   │   └── incremental-state.ts
│   ├── progress/         # Progress tracking
│   └── index.ts          # Library exports
├── tests/
│   └── helpers/          # Test utilities (81 symbols)
├── docs/                 # Comprehensive documentation
├── website/              # Docusaurus documentation site
├── .github/
│   └── workflows/        # CI/CD automation
├── examples/             # Example configurations
└── scripts/              # Build and validation scripts
```

---

## Key Commands

### Development

```bash
bun install              # Install dependencies
bun dev -- --help        # Run CLI in dev mode (TypeScript via Bun)
bun build                # Build TypeScript to dist/
bun watch:types          # Watch mode for type checking
```

### Testing

```bash
bun test                 # Run all tests (Vitest)
bun test:watch           # Watch mode
bun test:coverage        # Generate coverage report
bun test:ci              # CI mode with reporters
```

### Quality

```bash
bun run check            # Biome lint + format (write mode)
bun run format           # Format with Biome
bun run format:check     # Check formatting
bun typecheck            # TypeScript type checking
bun run validate         # Full quality check (lint + types + build + test)
```

### CLI Usage (After Build)

```bash
bun cli -- --help        # Run built CLI
bun cli doctor           # System diagnostics
bun cli init             # Generate config file
bun cli ingest-csv       # Import from iMazing CSV
bun cli ingest-db        # Import from Messages.app DB
bun cli normalize-link   # Merge and deduplicate
bun cli enrich-ai        # AI enrichment (images, audio, links)
bun cli render-markdown  # Generate markdown timeline
```

### Release Management

```bash
bun version:gen          # Create changeset (interactive)
bun release              # Publish to npm (CI only)
bun run pre:enter:next   # Enter pre-release mode (next/beta/rc)
bun run pre:exit         # Exit pre-release mode
```

---

## Tech Stack

**Language & Runtime:**
- TypeScript 5.9+ (strict mode)
- Node.js 24.11.1+ (ESM only)
- Bun for local dev tooling

**Package Management:**
- pnpm (CI/stable)
- Bun (local convenience)

**Code Quality:**
- **Linter/Formatter:** Biome 2.3+
  - 80-char line width
  - Tabs (width 2)
  - Single quotes, minimal semicolons
  - Trailing commas
- **Testing:** Vitest 4+ with V8 coverage (70%+ threshold)
- **Git Hooks:** Husky (commit-msg, pre-commit, pre-push)

**Key Dependencies:**
- `@google/generative-ai` - Gemini AI for enrichment
- `@mendable/firecrawl-js` - Link enrichment
- `sharp` - Image processing
- `better-sqlite3` - Database queries
- `zod` - Runtime schema validation
- `commander` - CLI framework
- `pino` - Structured logging

**Path Aliases:** (via `#` imports)
```typescript
import { ... } from '#enrich/*'
import { ... } from '#ingest/*'
import { ... } from '#normalize/*'
import { ... } from '#render/*'
import { ... } from '#schema/*'
import { ... } from '#utils/*'
```

---

## Code Conventions

### TypeScript
- **Strict mode enabled** (tsconfig extends tsconfig.base.json)
- **No `any`** (use `unknown` + type guards)
- **Path aliases** for clean imports (`#enrich/*`, `#utils/*`, etc.)
- **ESM only** (no CommonJS)

### Code Style
- **Functional programming preferred** where practical
- **Immutability** via const, readonly, Object.freeze
- **Pure functions** for utilities
- **Type-safe** with Zod validation at boundaries

### File Organization
- Test files alongside source: `*.test.ts`
- Test helpers in `tests/helpers/`
- Fixtures in `__tests__/fixtures/`
- Integration tests in `__tests__/` at module level

### Naming
- **Files:** kebab-case (`date-converters.ts`)
- **Functions/variables:** camelCase (`ingestCSV`)
- **Types/interfaces:** PascalCase (`Message`, `Config`)
- **Constants:** UPPER_SNAKE_CASE for true constants
- **Test files:** `*.test.ts` pattern

### Exports
- Use named exports (no default exports except CLI entry)
- Export types explicitly: `export type { Message }`
- Re-export from index files for public API

---

## Git Workflow

**Branch Pattern:** `type/description`
- `feat/` - New features
- `fix/` - Bug fixes
- `chore/` - Tooling, dependencies
- `docs/` - Documentation
- `ci/` - CI/CD changes
- `test/` - Test additions/fixes

**Commit Format:** Conventional Commits (enforced by commitlint)
```
type(scope): subject

Examples:
feat(enrich): add PDF summarization support
fix(cli): handle missing API key gracefully
chore(deps): upgrade Biome to 2.3.7
docs(readme): update installation instructions
ci(workflows): add CodeQL scanning
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `chore` - Maintenance (deps, config)
- `docs` - Documentation
- `ci` - CI/CD changes
- `test` - Test changes
- `refactor` - Code refactoring
- `perf` - Performance improvements

**Workflow:**
1. Create feature branch from `main`
2. Make changes with conventional commits
3. Run `bun run validate` before pushing
4. Push and create PR
5. CI runs: lint, typecheck, tests, coverage
6. Squash merge to `main` after approval
7. Changesets manages versioning/releasing

**Protected Branch:** `main`
- Requires PR + approval
- Requires passing CI checks (PR quality gate)
- Linear history (squash merge)
- No direct pushes (pre-push hook blocks)

---

## Testing

**Framework:** Vitest 4+
**Pattern:** `*.test.ts` files alongside source
**Coverage:** 70%+ branch coverage (enforced in CI)

**Test Categories:**
1. **Unit tests:** Individual functions/modules
2. **Integration tests:** Multi-module flows
3. **Schema validation:** Zod schema edge cases
4. **Determinism tests:** Output consistency

**Key Test Helpers:** (see `tests/helpers/`)
- `buildMessage()` - Test data builders
- `createValidCSVRow()` - CSV fixtures
- `assertValidMessage()` - Schema assertions
- `mockGeminiClient()` - AI provider mocks
- `mockFirecrawl()` - Link enrichment mocks

**Running Tests:**
```bash
bun test                 # All tests
bun test --watch         # Watch mode
bun test --coverage      # With coverage
bun test src/enrich      # Specific directory
```

**Coverage Tracking:**
- Critical paths: 95%+ (linking, dedup, enrichment)
- Overall project: 70%+ branch coverage
- V8 coverage engine
- HTML reports in `coverage/`

---

## Configuration

**File:** `imessage-config.yaml` or `imessage-config.json`

Create with `bun cli init` or see `examples/imessage-config.yaml`

**Key Sections:**
- `gemini.apiKey` - Gemini API key (or env var `GEMINI_API_KEY`)
- `firecrawl.apiKey` - Firecrawl API key (optional)
- `attachmentRoots` - Directories to search for media files
- `enrichment` - Enable/disable AI features
- `render` - Markdown rendering options

**Environment Variables:**
- `GEMINI_API_KEY` - Required for AI enrichment
- `FIRECRAWL_API_KEY` - Optional for link enrichment
- `TF_BUILD` - Set by CI for test reporters
- `NODE_ENV` - `production` | `development` | `test`

---

## CI/CD Pipeline

**Workflows:** (`.github/workflows/`)

1. **PR Quality** (`pr-quality.yml`)
   - Lint, typecheck, tests with coverage
   - Delta quality checks (coverage must not decrease)
   - Package hygiene (publint, attw)

2. **Changesets Manage & Publish** (`changesets-manage-publish.yml`)
   - Opens "Version Packages" PR
   - Auto-merges after checks pass
   - Publishes to npm with provenance

3. **Security Scanning**
   - CodeQL (JS/TS analysis)
   - OSV Scanner (dependency vulnerabilities)
   - Dependency Review (PR checks)

4. **Pre-Release Channels** (`channel-release.yml`)
   - `next`, `beta`, `rc` for staged releases
   - Canary snapshots for testing

5. **Automated Dependency Maintenance**
   - Renovate (npm/pnpm, grouped, safe automerge)
   - Dependabot (GitHub Actions only)

**Branch Protection:**
- Required: PR quality gate, commitlint, PR title lint
- Auto-merge enabled after checks
- Signed commits required
- Linear history enforced

---

## Release Process

**Zero-Touch Releases:** Changesets handles versioning automatically

**Standard Flow:**
1. Make changes with conventional commits
2. Run `bun version:gen` to create changeset
3. Commit changeset file (`.changeset/*.md`)
4. Push to PR, merge to `main`
5. CI opens "Version Packages" PR
6. Auto-merges after checks → publishes to npm

**Pre-Releases:**
```bash
# Enter pre-mode
bun run pre:enter:next   # or :beta, :rc

# Create changesets as normal
bun version:gen

# CI publishes as 0.0.1-next.0, 0.0.1-next.1, etc.

# Exit pre-mode
bun run pre:exit
```

**Snapshot (Canary) Releases:**
```bash
# Only when NOT in pre-mode
bun release:snapshot:canary
```

See `docs/automated-release-workflow.md` for full details.

---

## Key Files

| File | Purpose |
|------|---------|
| `src/cli.ts` | CLI entry point (66k lines) |
| `src/index.ts` | Library exports |
| `src/schema/message.ts` | Core message schema (Zod) |
| `src/config/schema.ts` | Config schema |
| `package.json` | Dependencies, scripts, exports |
| `tsconfig.json` | TypeScript config (extends base) |
| `biome.json` | Linting/formatting rules |
| `.nvmrc` | Node version (24.11.1) |
| `README.md` | User-facing documentation |
| `CI.md` | CI/CD documentation |
| `TESTING.md` | Testing strategy guide |

---

## Architecture

**4-Stage Pipeline:**

```
┌─────────────┐
│  CSV / DB   │
│   Exports   │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│  1. INGEST      │ ← Parse & normalize to unified schema
│  ingest-csv     │   - Date conversion (Apple epoch → ISO 8601)
│  ingest-db      │   - Attachment path resolution
└──────┬──────────┘   - Split multi-attachment messages
       │
       ▼
┌─────────────────┐
│  2. NORMALIZE   │ ← Merge, deduplicate, link
│  normalize-link │   - GUID + content deduplication
└──────┬──────────┘   - Reply/tapback linking
       │
       ▼
┌─────────────────┐
│  3. ENRICH      │ ← AI enrichment (resumable, incremental)
│  enrich-ai      │   - Image analysis (Gemini Vision)
└──────┬──────────┘   - Audio transcription
       │               - Link context extraction
       ▼               - Checkpointing + idempotency
┌─────────────────┐
│  4. RENDER      │ ← Generate markdown timelines
│  render-md      │   - Group by date + time-of-day
└─────────────────┘   - Nested replies (blockquotes)
                      - Deterministic output
```

**Complexity Hotspots:** (from Kit stats)
1. `src/enrich/` - 98 symbols
2. `tests/helpers/` - 81 symbols
3. `src/render/` - 53 symbols
4. `src/utils/` - 52 symbols
5. `src/ingest/` - 42 symbols

---

## Special Rules

### NEVER Do These

1. **NEVER modify src/legacy/** - Deprecated code being phased out
2. **NEVER use default exports** - Named exports only (except CLI entry)
3. **NEVER commit without changesets** - User-facing changes require changesets
4. **NEVER push directly to main** - Pre-push hook blocks this
5. **NEVER use destructive git commands** - No `reset --hard`, `push --force`
6. **NEVER create nested biome.json** - Single root config only
7. **NEVER run enrichment without checkpoints** - Always use `--checkpoint-interval`
8. **NEVER skip validation** - Run `bun run validate` before pushing

### ALWAYS Do These

1. **ALWAYS run `bun run validate`** before pushing
2. **ALWAYS create changesets** for user-facing changes (`bun version:gen`)
3. **ALWAYS use path aliases** (`#enrich/*`, not `../../enrich`)
4. **ALWAYS add JSDoc** for exported functions (explain the "why")
5. **ALWAYS write tests** for new functionality (70%+ coverage)
6. **ALWAYS use conventional commits** (enforced by commitlint)
7. **ALWAYS preserve determinism** in rendering (no randomization)
8. **ALWAYS handle errors gracefully** (never crash, log and continue)

### Code Patterns

**Error Handling:**
```typescript
// Good: Log and degrade gracefully
try {
  const enrichment = await enrichImage(message)
  message.media.enrichment = enrichment
} catch (error) {
  logger.warn({ error, messageId: message.guid }, 'Image enrichment failed')
  // Continue processing other messages
}
```

**Idempotent Operations:**
```typescript
// Check before enriching
if (hasEnrichmentKind(message, 'image_analysis')) {
  logger.debug({ messageId: message.guid }, 'Already enriched, skipping')
  return message
}
```

**Deterministic Output:**
```typescript
// Always sort for consistency
const sorted = messages.sort((a, b) =>
  a.date === b.date ? a.guid.localeCompare(b.guid) : a.date.localeCompare(b.date)
)
```

---

## Documentation

**Full Docs:** https://nathanvale.github.io/chatline/

**Key Docs:**
- `README.md` - Main user guide
- `CI.md` - CI/CD comprehensive guide
- `TESTING.md` - Testing strategy
- `docs/automated-release-workflow.md` - Release process
- `docs/pre-release-guide.md` - Pre-release channels
- `docs/cli-usage.md` - CLI command reference
- `docs/imessage-pipeline-tech-spec.md` - Technical spec
- `docs/testing-best-practices.md` - Test patterns
- `docs/bun-script-best-practices.md` - Bun usage rationale

---

## Notes

**This project is actively developed** with:
- 352 files indexed
- 526 symbols across 110 source files
- 1463 test assertions (Vitest)
- Comprehensive CI/CD automation
- Zero-touch release workflow

**Development Philosophy:**
- **Deterministic:** Same input → same output (reproducible)
- **Idempotent:** Safe to re-run operations
- **Resumable:** Checkpoint support for crash recovery
- **Incremental:** Process only new data (delta detection)
- **Type-safe:** Zod validation at all boundaries
- **Privacy-first:** Local-only processing, no data retention

**For Nathan:**
- Use Kit tools for codebase exploration (`kit:find`, `kit:callers`, `kit:stats`)
- Check `CLAUDE.md` in other projects for examples
- ADHD-friendly: Clear structure, visual whitespace, concise docs
- Celebrate wins when CI passes ✅

---

**Last Updated:** 2025-12-23 (Auto-generated via kit:prime and git-intelligence)
